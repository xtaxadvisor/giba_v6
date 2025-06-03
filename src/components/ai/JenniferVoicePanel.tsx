// ✅ src/components/ai/JenniferVoicePanel.tsx (Full production-grade)
import React, { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';



interface JenniferVoicePanelProps {
  onTranscript: (transcript: string, audioBlob: Blob) => void | Promise<void>;
}

const JenniferVoicePanel: React.FC<JenniferVoicePanelProps> = ({ onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setStatus('Uploading audio...');

        // Upload audio
        const filename = `voice_${Date.now()}.webm`;
        const { data, error: uploadError } = await supabase.storage.from('voice-recordings').upload(filename, audioBlob);
        if (uploadError) {
          console.error('Upload error:', uploadError);
          setStatus('❌ Audio upload failed.');
          return;
        }

        const { publicUrl } = supabase.storage.from('voice-recordings').getPublicUrl(filename).data;
        setAudioUrl(publicUrl);

        setStatus('Transcribing and summarizing...');

        const res = await fetch('/.netlify/functions/transcribe-and-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio_url: publicUrl })
        });

        const result = await res.json();

        if (!res.ok || !result.transcript) {
          setStatus('❌ Transcription failed');
          return;
        }

        setTranscript(result.transcript);
        setSummary(result.summary);
        setShowConfirm(true);
        setStatus('✅ Ready to confirm');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setStatus('🎤 Recording...');

      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 5000);
    } catch (err) {
      console.error('🎤 Recording error:', err);
      setStatus('❌ Microphone error.');
    }
  };

  const handleConfirm = async () => {
    try {
      const res = await fetch('/.netlify/functions/log-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          summary,
          audio_url: audioUrl,
          source: 'voice'
        })
      });
      const result = await res.json();
      if (res.ok) {
        setStatus('✅ Logged successfully');
        // Find the audioBlob from the last recording
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await onTranscript(transcript, audioBlob);
        setShowConfirm(false);
        setTranscript('');
        setSummary('');
      } else {
        console.error('Log failed:', result);
        setStatus('❌ Log failed');
      }
    } catch (err) {
      console.error('Log error:', err);
      setStatus('❌ Server error');
    }
  };

  return (
    <div className="mt-4 border-t pt-3">
      <button
        onClick={startRecording}
        disabled={isRecording}
        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {isRecording ? 'Listening...' : '🎤 Start Voice Recording'}
      </button>

      <p className="text-sm text-gray-600 mt-2">{status}</p>

      {showConfirm && (
        <div className="mt-4 text-left space-y-2">
          <label className="block text-sm font-medium">Transcript</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            value={transcript}
            readOnly
          />

          <label className="block text-sm font-medium mt-2">Summary (editable)</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          <button
            onClick={handleConfirm}
            className="mt-3 px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            ✅ Confirm & Save
          </button>
        </div>
      )}
    </div>
  );
};

export default JenniferVoicePanel;