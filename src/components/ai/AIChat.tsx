// ✅ Enhanced AIChat.tsx with JenniferVoicePanel integration, audio transcription logging, and summarization
import { useEffect, useState, useRef } from 'react';
import { AIMessageList } from './chat/AIMessageList';
import { AIMessageInput } from './chat/AIMessageInput';
import { AISuggestions } from './AISuggestions';
import { AIHeader } from './AIHeader';
import type { AIMessage } from '@/types/ai';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

export interface JenniferVoicePanelProps {
  onTranscript: (transcript: string) => void | Promise<void>;
}

const JenniferVoicePanel: React.FC<JenniferVoicePanelProps> = ({ onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Placeholder UI for JenniferVoicePanel
  return (
    <div>
      <button
        onClick={() => {
          setIsRecording((prev) => !prev);
          // Simulate a transcript for demonstration
          if (!isRecording) {
            const fakeTranscript = "This is a sample transcript.";
            setTranscript(fakeTranscript);
            onTranscript(fakeTranscript);
          }
        }}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div>
        <strong>Transcript:</strong> {transcript}
      </div>
    </div>
  );
};
// ... rest of the code remains the same

export default JenniferVoicePanel;
export interface AIChatProps {
  messages: AIMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error?: Error;
  onClose?: () => void;
}

export function AIChat({ messages: initialMessages, onSendMessage, isLoading, error, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const chatRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('jennifer.chat.history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMessages(parsed);
      } catch {
        console.warn('💾 Failed to parse chat history.');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jennifer.chat.history', JSON.stringify(messages));
  }, [messages]);

  const handleVoiceTranscript = async (transcript: string) => {
    if (!transcript) return;

    const userMsg: AIMessage = { role: 'user', content: transcript };
    setMessages((prev) => [...prev, userMsg]);
    onSendMessage(transcript);

    try {
      // Log transcription to audit_logs
      await supabase.from('audit_logs').insert({
        user_id: user?.id ?? null,
        event: 'jennifer_voice_transcript',
        metadata: { transcript, timestamp: new Date().toISOString() }
      });

      // Send to summarizer (optional)
      const res = await fetch('/.netlify/functions/summarize-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });

      const { summary } = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: `📄 Summary: ${summary}` }]);
    } catch (err) {
      console.error('🔴 Transcript processing failed:', err);
    }
  };

  return (
    <div ref={chatRef} className="flex flex-col h-[600px]">
      {onClose && <AIHeader onClose={onClose} title="Jennifer" />}

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <>
           
            <AISuggestions
              suggestions={['How can you help?', 'Schedule a consultation', 'Upload a document']}
              onSelect={onSendMessage}
            />
          </>
        ) : (
          <AIMessageList messages={messages} isTyping={isLoading} />
        )}
      </div>

      <div className="border-t px-4 py-2">
        <AIMessageInput
          onSend={onSendMessage}
          isDisabled={isLoading}
          placeholder="Ask Jennifer anything..."
        />
      </div>

      <div className="border-t px-4 py-2">
        <JenniferVoicePanel onTranscript={handleVoiceTranscript} />
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 text-sm border-t border-red-200">
          {error.message}
        </div>
      )}
    </div>
  );
}
