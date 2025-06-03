// ✅ src/components/ai/JenniferVoicePanel.tsx (Production-Ready)
import React, { useEffect, useRef, useState } from 'react';



export interface JenniferVoicePanelProps {
  onTranscript: ((transcript: string) => void | Promise<void>) | ((transcript: string, audioBlob: Blob) => void | Promise<void>);
}

const JenniferVoicePanel: React.FC<JenniferVoicePanelProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Idle');
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
        const formData = new FormData();
        formData.append('audio', audioBlob);

        setStatus('⏳ Transcribing...');
        try {
          const res = await fetch('/.netlify/functions/transcribe-and-log', {
            method: 'POST',
            body: formData
          });

          const result = await res.json();

          if (res.ok && result.transcript) {
            await onTranscript(result.transcript, audioBlob);
            setStatus('✅ Transcription complete.');
          } else {
            console.error('Transcription failed:', result.error);
            setStatus('⚠️ Transcription failed.');
          }
        } catch (err) {
          console.error('Error sending audio:', err);
          setStatus('⚠️ Upload error.');
        } finally {
          setIsListening(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
      setStatus('🎤 Recording...');

      setTimeout(() => {
        mediaRecorder.stop();
        setStatus('🔄 Processing...');
      }, 5000); // Record for 5 seconds
    } catch (err) {
      console.error('Microphone error:', err);
      setStatus('❌ Microphone access denied.');
    }
  };

  return (
    <div className="mt-2 text-center">
      <button
        onClick={startRecording}
        disabled={isListening}
        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {isListening ? 'Listening...' : '🎤 Start Voice Recording'}
      </button>
      <p className="text-xs text-gray-500 mt-1">{status}</p>
    </div>
  );
};

export default JenniferVoicePanel;