import React from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, ShieldAlert, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function CoachDashboardScreen({ profile, nav }: { profile: any, nav: (tab: any) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex justify-between items-center bg-[#1F2937] p-5 rounded-2xl border border-border">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-text-light mb-1">
            Coach {profile.name.split(' ')[0]}
          </h2>
          <p className="text-text-muted text-[10px] uppercase font-bold tracking-widest">Squad Management</p>
        </div>
        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center border border-accent">
           <Users size={18} className="text-accent" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-bold text-text-muted tracking-widest px-1">Upcoming Event Summary</h3>
          <button onClick={()=>nav('events')} className="text-[10px] text-accent uppercase font-bold tracking-wider flex items-center">
            Manage <ChevronRight size={12} />
          </button>
        </div>
        <div className="glass-card p-5">
           <h4 className="font-black uppercase tracking-wider text-base mb-1">Weekly Training</h4>
           <p className="text-[11px] text-text-muted font-bold tracking-widest mb-4">Tomorrow • 18:00</p>
           
           <div className="flex items-center gap-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-accent" />
                 <div><span className="font-black text-lg leading-none">14</span> <span className="text-[9px] uppercase tracking-widest text-text-muted">Going</span></div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-4 h-4 rounded-full border-2 border-text-muted" />
                 <div><span className="font-black text-lg leading-none">3</span> <span className="text-[9px] uppercase tracking-widest text-text-muted">Pending</span></div>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs uppercase font-bold text-text-muted tracking-widest px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 active:scale-95 transition-all" onClick={()=>nav('events')}>
             <Calendar size={24} className="text-stadium-gold mb-3" />
             <p className="text-[10px] uppercase font-black tracking-widest text-stadium-gold">Create Event</p>
          </div>
          <div className="glass-card p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 active:scale-95 transition-all" onClick={()=>nav('announcements')}>
             <ShieldAlert size={24} className="text-accent mb-3" />
             <p className="text-[10px] uppercase font-black tracking-widest text-accent">Post Message</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 mt-6 border-l-4 border-l-red-500">
          <h4 className="font-black uppercase tracking-wider text-sm mb-1 text-red-500">Action Required</h4>
          <p className="text-[11px] text-text-muted font-bold leading-relaxed">2 players have missed consecutive sessions. Review attendance logs.</p>
      </div>

    </motion.div>
  );
}
