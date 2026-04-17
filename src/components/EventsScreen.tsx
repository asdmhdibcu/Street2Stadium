import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Trash2, MapPin, Clock } from 'lucide-react';

export default function EventsScreen({ profile, showToast }: { profile: any, showToast: (msg: string) => void }) {
  // Demo Data
  const events = [
    { id: '1', title: 'Match vs City FC', date: '2026-04-18', time: '10:00 AM', location: 'Main Pitch', type: 'Match' },
    { id: '2', title: 'Agility & Tactics', date: '2026-04-20', time: '18:00 PM', location: 'Training Ground', type: 'Training' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="mb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Schedule</h2>
        <p className="text-text-muted mt-1 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
           Upcoming Events
        </p>
      </div>

      {profile.role === 'Coach' && (
        <button onClick={() => showToast("Opening Event Creator")} className="w-full bg-surface border border-accent text-accent py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
          <Calendar size={16} /> Create New Event
        </button>
      )}

      <div className="space-y-4 pt-2">
        {events.map(ev => (
           <div key={ev.id} className="glass-card p-5 relative">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-[#111827] rounded-xl flex flex-col justify-center items-center border border-border">
                     <span className="text-[8px] uppercase tracking-widest text-text-muted">{new Date(ev.date).toLocaleDateString('en-US', {weekday:'short'})}</span>
                     <span className="font-black leading-none mt-1">{new Date(ev.date).getDate()}</span>
                   </div>
                   <div>
                     <h4 className="font-bold uppercase tracking-wider">{ev.title}</h4>
                     <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded mt-1 inline-block ${ev.type==='Match' ? 'bg-stadium-gold/20 text-stadium-gold' : 'bg-accent/20 text-accent'}`}>{ev.type}</span>
                   </div>
                 </div>
                 {profile.role === 'Coach' && (
                   <button className="text-text-muted hover:text-red-500">
                     <Trash2 size={16} />
                   </button>
                 )}
              </div>
              
              <div className="flex items-center gap-4 text-xs font-bold text-text-muted mb-4">
                <span className="flex items-center gap-1"><Clock size={12}/> {ev.time}</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {ev.location}</span>
              </div>

              {profile.role === 'Player' ? (
                <div className="flex gap-2">
                   <button className="flex-1 bg-accent/20 text-accent border border-accent py-2 rounded-lg font-black uppercase text-[10px] tracking-widest" onClick={()=>showToast("Marked Going")}>Going</button>
                   <button className="flex-1 bg-[#111827] border border-border text-text-muted py-2 rounded-lg font-black uppercase text-[10px] tracking-widest" onClick={()=>showToast("Marked Out")}>Out</button>
                </div>
              ) : (
                <div className="flex justify-between items-center pt-3 border-t border-border">
                   <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Attendance</span>
                   <span className="font-black text-xs"><span className="text-accent">14</span> / 18</span>
                </div>
              )}
           </div>
        ))}
      </div>
    </motion.div>
  );
}
