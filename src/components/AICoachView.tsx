import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  Sparkles, 
  Mic, 
  ArrowLeft,
  Loader2,
  BrainCircuit,
  Zap,
  ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { genAI, AI_MODELS } from '../lib/gemini';
import { cn } from '../lib/utils';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function AICoachView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "I'm your Elite AI Coach. Ready to sharpen your game? Whether it's tactical planning, mentality, or a custom training drill, I've got you covered. What's our focus today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!genAI) throw new Error("AI Service not configured");

      const modelName = AI_MODELS.default;
      const response = await genAI.models.generateContent({
        model: modelName,
        contents: [
          { role: 'user', parts: [{ text: `You are an elite pro football coach advisor for underprivileged players. Be practical, motivating, and use tactical terminology. 
          Respond briefly but with high value. Current focus: ${userMsg.content}` }] }
        ],
        config: {
          systemInstruction: "You are the head coach of Street2Stadium. Your job is to unlock talent through digital coaching. Focus on technical skills, physical conditioning, and elite mentality. Be direct, professional, and encouraging. If asked for drills, provide numbered steps."
        }
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm having trouble connecting to the sidelines. Let's try that again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "System timeout. Check your connection or AI Studio configuration.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-[calc(100vh-12rem)] flex flex-col bg-surface border border-border rounded-[24px] overflow-hidden"
    >
      {/* Coach Header */}
      <header className="p-6 border-b border-border bg-white/[0.02] flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="ai-header flex items-center gap-4">
            <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_10px_#CCFF00]" />
            <h3 className="font-bold text-sm uppercase tracking-[0.5px]">Coach AI Assistant</h3>
          </div>
        </div>
        <div className="flex gap-2">
           {['Tactics', 'Mentality', 'Drills'].map(tag => (
             <button 
               key={tag} 
               onClick={() => setInput(`Can you give me a 5-minute advice on ${tag}?`)}
               className="px-3 py-1 rounded-full border border-border text-[9px] uppercase font-black text-text-muted hover:border-accent hover:text-accent transition-colors"
             >
               {tag}
             </button>
           ))}
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex flex-col max-w-[85%]",
              msg.role === 'user' ? "ml-auto items-end" : "items-start"
            )}
          >
            <div className={cn(
              "p-4 rounded-[16px] text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-accent text-black font-medium border-br-none" 
                : "bg-glass border border-border text-white/90 border-bl-none prose prose-invert prose-sm max-w-none"
            )}>
              {msg.role === 'assistant' ? (
                <div className="markdown-body">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
            <span className="text-[9px] uppercase tracking-widest text-white/20 mt-2 font-black">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-accent/60 animate-pulse ml-2">
            <div className="w-1 h-1 bg-accent rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Analysing play...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <footer className="p-6 bg-black/20 border-t border-border">
        <div className="relative group">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your game..."
            className="w-full bg-white/[0.03] border border-border rounded-xl py-4 px-6 pr-16 focus:outline-none focus:border-accent/50 transition-all text-sm placeholder:text-text-muted"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 text-accent disabled:opacity-30 hover:scale-110 transition-transform"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
