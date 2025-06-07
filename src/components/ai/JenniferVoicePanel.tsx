// ✅ src/components/ai/JenniferVoicePanel.tsx (Full production-grade)
import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';



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
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'assistant'; message: string; timestamp: string; audioUrl?: string }[]
  >([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

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

        const audioElement = new Audio(publicUrl);
        audioElement.controls = true;
        document.getElementById('audio-container')?.appendChild(audioElement);

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

        const now = new Date().toLocaleTimeString();
        setTranscript(result.transcript);
        setChatHistory((prev) => [
          ...prev,
          { role: 'user', message: result.transcript, timestamp: now, audioUrl: publicUrl },
          { role: 'assistant', message: result.summary, timestamp: now }
        ]);
        setSummary(result.summary);
        setShowConfirm(true);
        setTimeout(() => {
          document.getElementById('jennifer-transcript')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
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
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setStatus('❌ Microphone access denied. Please allow microphone permissions.');
      } else {
        setStatus('❌ Microphone error.');
      }
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

  // Group consecutive messages by role
  const groupedChat = [];
  for (let i = 0; i < chatHistory.length; ) {
    const currentRole = chatHistory[i].role;
    const group = [];
    let j = i;
    while (j < chatHistory.length && chatHistory[j].role === currentRole) {
      group.push(chatHistory[j]);
      j++;
    }
    groupedChat.push({ role: currentRole, messages: group });
    i = j;
  }

  return (
    <div className="mt-4 border-t pt-3 flex flex-col">
      <button
        onClick={startRecording}
        disabled={isRecording}
        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {isRecording ? 'Listening...' : '🎤 Start Voice Recording'}
      </button>

      <AnimatePresence>
        <motion.p
          key={status}
          className="text-sm text-gray-600 mt-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {status}
        </motion.p>
      </AnimatePresence>

      <div id="audio-container" className="mt-4" />

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="mt-4 text-left space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sm font-medium">Transcript</label>
            <textarea
              id="jennifer-transcript"
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
          </motion.div>
        )}
      </AnimatePresence>

      <details className="mt-6 max-h-[300px] overflow-y-auto pr-2" open>
        <summary className="cursor-pointer font-semibold mb-2">Conversation History</summary>
        <div className="space-y-4">
          {groupedChat.map((group, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] ${
                group.role === 'user' ? 'self-end ml-auto' : 'self-start mr-auto'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">
                {group.role === 'user' ? '👤 You' : '🤖 Jennifer'} at {group.messages[0].timestamp}
              </div>
              {group.messages.map((entry, i) => (
                <motion.div
                  key={i}
                  className={`px-4 py-2 rounded-xl mb-1 ${
                    group.role === 'user'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  initial={{ opacity: 0, x: group.role === 'user' ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div>{entry.message}</div>
                  {entry.role === 'user' && entry.audioUrl && (
                    <audio controls className="mt-1 w-full">
                      <source src={entry.audioUrl} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  <div className="mt-1 text-xs text-gray-500">👍 ❤️ 😂</div>
                </motion.div>
              ))}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </details>
    </div>
  );
};

export default JenniferVoicePanel;