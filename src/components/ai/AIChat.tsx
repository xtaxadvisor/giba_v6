// ✅ src/components/ai/AIChat.tsx (Production-Ready Unified Version)
import { useEffect, useState, useRef } from 'react';
import { AIMessageList } from './chat/AIMessageList';
import { AIMessageInput } from './chat/AIMessageInput';
import { AISuggestions } from './AISuggestions';
import { AIHeader } from './AIHeader';
import type { AIMessage } from '@/types/ai';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import JenniferVoicePanel from './JenniferVoicePanel';

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
  const chatRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('jennifer.chat.history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMessages(parsed);
      } catch {
        console.warn('💾 Could not restore chat history.');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jennifer.chat.history', JSON.stringify(messages));
  }, [messages]);

  const handleTranscript = async (transcript: string, audioBlob: Blob) => {
    const userMsg: AIMessage = { role: 'user', content: transcript };
    setMessages(prev => [...prev, userMsg]);
    onSendMessage(transcript);

    try {
      const filename = `voice_${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(filename, audioBlob, {
          contentType: 'audio/webm',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { publicUrl } = supabase.storage
        .from('voice-recordings')
        .getPublicUrl(filename).data;

      if (!publicUrl) throw new Error('Audio URL generation failed');

      const response = await fetch('/.netlify/functions/transcribe-and-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_url: publicUrl,
          user_id: user?.id || null,
          source: 'voice'
        })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Transcription failed');

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: result.reply || '...' },
        { role: 'assistant', content: `📄 Summary: ${result.summary || '...'}` }
      ]);
    } catch (err) {
      console.error('🎤 Voice pipeline failed:', err);
      onSendMessage('⚠️ Voice processing failed. Try again.');
    }
  };

  return (
    <div ref={chatRef} className="flex flex-col h-[600px]">
      {onClose && <AIHeader onClose={onClose} title="Jennifer" />}

      <div className="flex-1 overflow-y-auto px-4">
        {messages.length === 0 ? (
          <AISuggestions
            suggestions={[
              'What services do you offer?',
              'How can I schedule a consultation?',
              'What are your business hours?',
              'Do you offer virtual meetings?'
            ]}
            onSelect={onSendMessage}
          />
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
        <JenniferVoicePanel onTranscript={handleTranscript} />
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 text-sm border-t border-red-200">
          {error.message}
        </div>
      )}
    </div>
  );
}

export default AIChat;