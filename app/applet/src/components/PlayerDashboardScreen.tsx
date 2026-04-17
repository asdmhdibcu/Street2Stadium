import React from 'react';
import { motion } from 'motion/react';
import { Flame, Target, ChevronRight, Clock, Trophy, MessageSquare } from 'lucide-react';

export default function PlayerDashboardScreen({ profile, nav }: { profile: any, nav: (tab: any) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex justify-between items-center bg-accent/10 p-5 rounded-2xl border border-accent/20">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-text-light mb-1">
            Hi, {profile.name.split(' ')[0]}
          </h2>
          <p className="text-accent text-[10px] uppercase font-black tracking-widest">Time to work</p>
        </div>
        <div className="flex bg-[#111827] px-3 py-2 rounded-xl items-center gap-2 border border-border shadow-md">
          <Flame size={16} className="text-stadium-gold" />
          <span className="font-bold text-sm">DAY 4</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-bold text-text-muted tracking-widest px-1">Today's Plan</h3>
          <button onClick={()=>nav('training')} className="text-[10px] text-accent uppercase font-bold tracking-wider flex items-center">
            View All <ChevronRight size={12} />
          </button>
        </div>
        <div className="glass-card p-5 cursor-pointer hover:bg-white/5 transition-colors" onClick={()=>nav('training')}>
          <div className="flex justify-between items-start mb-4">
             <div className="bg-[#111827] p-3 rounded-xl border border-border">
                <Target size={24} className="text-accent" />
             </div>
             <span className="text-[10px] uppercase font-bold bg-white/5 px-2 py-1 rounded tracking-wider">
               {profile.position} Focus
             </span>
          </div>
          <h4 className="font-black uppercase tracking-wider text-lg mb-1">Agility & First Touch</h4>
          <p className="text-xs text-text-muted font-medium flex items-center gap-2">
            <Clock size={12} /> 45 Minutes • High Intensity
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs uppercase font-bold text-text-muted tracking-widest px-1">Upcoming Event</h3>
        <div className="glass-card p-5 cursor-pointer hover:bg-white/5 transition-colors" onClick={()=>nav('events')}>
           <div className="flex gap-4 items-center">
              <div className="bg-stadium-gold/10 border border-stadium-gold text-stadium-gold w-14 h-14 rounded-xl flex flex-col items-center justify-center font-black">
                 <span className="text-[9px] uppercase tracking-widest leading-none">Sat</span>
                 <span className="text-lg leading-none mt-1">14</span>
              </div>
              <div className="flex-1">
                 <h4 className="font-black uppercase tracking-wider text-base">Match vs City FC</h4>
                 <p className="text-[11px] text-text-muted font-bold tracking-widest mt-1">10:00 AM • Main Pitch</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 flex flex-col justify-center items-center text-center">
           <Trophy size={20} className="text-text-muted mb-2" />
           <p className="text-2xl font-black">12</p>
           <p className="text-[9px] uppercase font-bold text-text-muted tracking-widest">Sessions</p>
        </div>
        <div className="glass-card p-4 flex flex-col justify-center items-center text-center" onClick={()=>nav('coach')}>
           <MessageSquare size={20} className="text-accent mb-2" />
           <p className="text-[10px] font-black uppercase text-accent tracking-widest mt-1">Ask AI Coach</p>
        </div>
      </div>
    </motion.div>
  );
}
