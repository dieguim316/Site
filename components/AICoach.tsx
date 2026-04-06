import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Sparkles } from 'lucide-react';
import { chatWithAICoach } from '../services/geminiService';
import { UserStats } from '../types';
import ReactMarkdown from 'react-markdown';

interface AICoachProps {
  stats: UserStats;
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const AICoach: React.FC<AICoachProps> = ({ stats, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Olá! Sou seu treinador cognitivo de IA. Como posso ajudar você a melhorar seu desempenho mental hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Format history for the API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithAICoach(userMessage.text, history, stats);

    const modelMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-300" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Treinador de IA</h1>
            <p className="text-sm text-gray-400">Alimentado por Gemini</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              msg.role === 'user' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-accent/10 border border-accent/20 text-white rounded-tr-none' 
                : 'bg-surface border border-white/5 text-gray-200 rounded-tl-none'
            }`}>
              {msg.role === 'model' ? (
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-surface border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte sobre seu desempenho ou peça dicas..."
          className="w-full bg-surface border border-white/10 rounded-2xl py-4 pl-4 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none"
          rows={1}
          style={{ minHeight: '60px', maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="absolute right-3 bottom-3 p-2 bg-primary hover:bg-primary/80 disabled:bg-surface disabled:text-gray-500 text-white rounded-xl transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AICoach;
