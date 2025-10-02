import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import type { ChatMessage } from '../types/database';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatBox({ messages, onSendMessage, isLoading }: ChatBoxProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[500px]">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Ask About Companies</h2>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-2">Ask me anything about companies in Bosnia!</p>
            <p className="text-sm">Try: "IT companies in Sarajevo" or "Show me 4+ star retail companies"</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-100 ml-8'
                  : 'bg-gray-100 mr-8'
              }`}
            >
              <p className="text-gray-900">{msg.content}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-600 mr-8 p-4 bg-gray-100 rounded-lg">
            <Loader2 size={16} className="animate-spin" />
            <span>Searching...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about companies..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send size={18} />
          Send
        </button>
      </form>
    </div>
  );
}
