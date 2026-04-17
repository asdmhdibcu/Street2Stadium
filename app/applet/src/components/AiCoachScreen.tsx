import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY }); // Need to use Vite plugin or properly handled polyfilled env

export default function AiCoachScreen({ profile }: { profile: any }) {
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: `Hi ${profile.name.split(' ')[0]}. I'm your AI Coach. I see you play ${profile.position}. What aspect of your game are we improving today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if(!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const prompt = `You are an elite, modern football coach for a startup called Street2Stadium. You are speaking to a player named ${profile.name} who plays ${profile.position}. Keep your advice highly technical, extremely concise, and formatted for mobile (use short paragraphs or bullets). User query: ${userMsg}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || "Keep pushing hard on the pitch." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Server error connecting to the locker room. Check connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full -mx-4 -mb-24 px-4 pb-24">
      <div className="mb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter">AI Coach</h2>
        <p className="text-text-muted mt-1 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
           Tactical Analysis & Advice
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide pb-4" ref={scrollRef}>
         {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-[#111827] border border-border' : 'bg-accent/20 border border-accent/50 text-accent'}`}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
               </div>
               <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#111827] border border-border rounded-tr-none' : 'bg-accent/10 border border-accent/20 rounded-tl-none font-medium'}`}>
                  {m.text}
               </div>
            </div>
         ))}
         {loading && (
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/50 text-accent flex items-center justify-center shrink-0">
                  <Bot size={14} />
               </div>
               <div className="p-4 rounded-2xl max-w-[80%] bg-accent/10 border border-accent/20 rounded-tl-none">
                  <div className="flex gap-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                     <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{animationDelay: '0.1s'}} />
                     <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{animationDelay: '0.2s'}} />
                  </div>
               </div>
            </div>
         )}
      </div>

      <div className="pt-4 border-t border-border mt-auto h-20">
         <div className="flex items-center gap-2 bg-[#1F2937] rounded-full border border-border px-4 py-2">
            <input
               value={input}
               onChange={e=>setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               placeholder="Ask Coach about tactics..."
               className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-white placeholder-text-muted"
            />
            <button disabled={loading} onClick={handleSend} className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:scale-105 transition-transform shrink-0 disabled:opacity-50">
               <Send size={16} />
            </button>
         </div>
      </div>
    </motion.div>
  );
}
