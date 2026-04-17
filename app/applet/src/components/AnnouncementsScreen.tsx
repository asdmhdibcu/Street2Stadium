import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Trash2 } from 'lucide-react';

export default function AnnouncementsScreen({ profile, showToast }: { profile: any, showToast: (msg: string) => void }) {
  // Demo data for MVP
  const announcements = [
    { id: '1', message: 'Training moved to turf pitch today due to rain.', timestamp: new Date().toISOString() },
    { id: '2', message: 'Remember to bring both home and away kits to the tournament this weekend.', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="mb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Locker Room</h2>
        <p className="text-text-muted mt-1 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
           Team Board
        </p>
      </div>

      {profile.role === 'Coach' && (
        <div className="glass-card p-4 border-accent/20">
          <textarea
              placeholder="Type your message to the squad..."
              className="w-full bg-[#111827] border border-border rounded-xl p-4 text-sm font-medium focus:border-accent outline-none min-h-[100px] resize-none"
          />
          <div className="flex justify-end mt-2">
              <button onClick={() => showToast("Message Pinned!")} className="bg-accent text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs">
                  Post
              </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
          {announcements.map((msg) => (
             <div key={msg.id} className="glass-card p-5 border-l-4 border-l-accent relative group">
                 <div className="flex justify-between items-start mb-3">
                     <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 rounded">Coach Update</span>
                     <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                         {new Date(msg.timestamp).toLocaleDateString()}
                     </span>
                 </div>
                 <p className="text-sm leading-relaxed font-medium">{msg.message}</p>
                 {profile.role === 'Coach' && (
                     <button onClick={() => showToast("Announcement deleted")} className="absolute top-4 right-4 text-text-muted">
                         <Trash2 size={14} />
                     </button>
                 )}
             </div>
          ))}
      </div>
    </motion.div>
  );
}
