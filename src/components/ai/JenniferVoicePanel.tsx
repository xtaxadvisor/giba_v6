// JenniferVoiceAssistant.tsx
import React, { useEffect, useRef, useState } from 'react';

export default function JenniferVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Idle");
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startJenniferSession = async () => {
    setStatus("Connecting to Jennifer...");

    const res = await fetch("/.netlify/functions/start-jennifer", {
      method: "POST"
    });
    const { client_secret } = await res.json();

    const ws = new WebSocket(`wss://api.openai.com/v1/realtime/sessions/${client_secret}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("Jennifer is listening 🎤");
      setIsListening(true);
      startMicrophoneStream(ws);
    };

    ws.onmessage = (event) => {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const audioBlob = new Blob([event.data], { type: 'audio/pcm' });
      const reader = new FileReader();
      reader.onload = () => {
        audioCtxRef.current?.decodeAudioData(reader.result as ArrayBuffer, (buffer) => {
          const source = audioCtxRef.current!.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtxRef.current!.destination);
          source.start();
        });
      };
      reader.readAsArrayBuffer(audioBlob);
    };

    ws.onerror = () => {
      setStatus("Error connecting to Jennifer");
    };

    ws.onclose = () => {
      setStatus("Jennifer session ended");
      setIsListening(false);
    };
  };

  const startMicrophoneStream = async (ws: WebSocket) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = async (e) => {
      if (ws.readyState === WebSocket.OPEN) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64AudioMessage = btoa(reader.result as string);
          ws.send(
            JSON.stringify({
              type: "input_audio_buffer.append",
              audio: base64AudioMessage
            })
          );
        };
        reader.readAsBinaryString(e.data);
      }
    };

    mediaRecorder.start(1000);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md text-center">
      <h2 className="text-xl font-semibold">🎙️ Talk to Jennifer</h2>
      <p className="text-gray-600">{status}</p>
      <button
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        onClick={startJenniferSession}
        disabled={isListening}
      >
        Start Talking
      </button>
    </div>
  );
}