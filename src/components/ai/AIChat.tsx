// src/components/ai/AIChat.tsx

import { useState, useEffect, useRef } from 'react';
import { AIMessageList } from './chat/AIMessageList';
import { AIMessageInput } from './chat/AIMessageInput';
import AIWelcomeMessage from './AIWelcomeMessage';
import { AISuggestions } from './AISuggestions';
import { AIHeader } from './AIHeader';
import type { AIMessage } from '@/types/ai';
import { jenniferAI } from '@/services/ai/Jenniferclient';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AIChatProps {
  messages: AIMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error?: Error;
  onClose?: () => void;
}

export function AIChat({
  messages: initialMessages,
  onSendMessage,
  isLoading,
  error,
  onClose
}: AIChatProps) {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // ✅ Restore messages from localStorage without triggering onSendMessage
  useEffect(() => {
    const saved = localStorage.getItem('jennifer.chat.history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Validate structure
          const valid = parsed.every((m: any) => m.role && m.content);
          if (valid) setMessages(parsed);
        }
      } catch {
        console.warn('💾 Could not restore Jennifer chat history.');
      }
    }
  }, []);

  // ✅ Save chat history persistently
  useEffect(() => {
    localStorage.setItem('jennifer.chat.history', JSON.stringify(messages));
  }, [messages]);

  const handleStartVoice = async () => {
    try {
      const res = await fetch('/.netlify/functions/start-jennifer', {
        method: 'POST'
      });
      const { client_secret } = await res.json();

      const ws = new WebSocket(`wss://api.openai.com/v1/realtime/sessions/${client_secret}`);

      ws.onopen = () => {
        setIsVoiceActive(true);
        setLiveTranscript('');
      };

      ws.onmessage = (event) => {
        const json = JSON.parse(event.data);
        const text = json?.content?.[0]?.text;
        if (text) setLiveTranscript(text);
        if (json?.is_final) {
          onSendMessage(text);
          setIsVoiceActive(false);
        }
      };

      ws.onerror = (err) => {
        console.error('Jennifer voice error:', err);
        setIsVoiceActive(false);
      };
    } catch (err) {
      console.error('Voice session error:', err);
      setIsVoiceActive(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    const filePath = `${user.id}/uploads/${file.name}`;
    setUploadProgress(0);

    try {
      const { error } = await supabase.storage.from('documents').upload(filePath, file, {
        upsert: true
      });

      if (error) throw error;

      setUploadProgress(null);

      const { data: publicURL } = supabase.storage.from('documents').getPublicUrl(filePath);
      const fileUrl = publicURL?.publicUrl;

      if (!fileUrl) throw new Error('Failed to generate public URL');

      onSendMessage(`📎 Uploaded: ${file.name}\n📄 Summarizing...`);

      const summary = await jenniferAI.summarizeDocument(fileUrl);
      onSendMessage(`📄 Summary of ${file.name}:\n${summary}`);

      await supabase.from('uploaded_documents').insert({
        user_id: user.id,
        file_name: file.name,
        file_url: fileUrl,
        summarized: true
      });
    } catch (err) {
      console.error('❌ Upload/summarize error:', err);
      onSendMessage('⚠️ Failed to upload or summarize the document.');
      setUploadProgress(null);
    }
  };

  return (
    <div ref={chatRef} className="flex flex-col h-[500px]">
      {onClose && <AIHeader onClose={onClose} title="Jennifer" />}

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <>
            <AIWelcomeMessage />
            <AISuggestions
              suggestions={[
                'What services do you offer?',
                'Can I upload documents for review?',
                'What am I missing from my file?',
                'Help me prepare my taxes'
              ]}
              onSelect={onSendMessage}
            />
          </>
        ) : (
          <AIMessageList messages={messages} isTyping={isLoading || isVoiceActive} />
        )}

        {isVoiceActive && (
          <div className="p-2 text-purple-600 text-sm italic bg-purple-50 border-t border-purple-200">
            🎙️ {liveTranscript || 'Listening...'}
          </div>
        )}

        {uploadProgress !== null && (
          <div className="px-4 text-sm text-blue-700">Uploading: {uploadProgress}%</div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t px-4 py-2">
        <AIMessageInput
          onSend={onSendMessage}
          isDisabled={isLoading || isVoiceActive}
          placeholder="Ask Jennifer anything..."
        />
        <button
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          onClick={handleStartVoice}
          disabled={isVoiceActive || isLoading}
        >
          🎤 Speak
        </button>
        <label className="cursor-pointer">
          📎
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isVoiceActive || isLoading}
          />
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 text-sm border-t border-red-200">
          {error.message}
        </div>
      )}
    </div>
  );
}