import { useState } from 'react';
import { Send } from 'lucide-react';
import TypingDots from './TypingDots';

function ChatBox({ onAsk, isLoading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onAsk(input.trim());
      setInput('');
    }
  };

  return (
    <div className="glass-card p-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., companies in Sarajevo, IT 4+ stars"
          disabled={isLoading}
          className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Search query"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-8 py-4 bg-gradient-to-r from-bosnia-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-700 disabled:to-slate-800 text-white font-semibold rounded-xl focus-ring disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          aria-label="Submit query"
        >
          {isLoading ? (
            <TypingDots />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Ask</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
