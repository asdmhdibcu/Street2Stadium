import React from 'react';
import { motion } from 'motion/react';
import { Target, Zap, Clock, Trophy } from 'lucide-react';

export default function TrainingPlanScreen({ profile }: { profile: any }) {
  const getDrills = (pos: string) => {
    if (['ST', 'LW', 'RW'].includes(pos)) {
      return [
        { name: "Finishing from Angles", duration: "15 min", type: "Attacking" },
        { name: "1v1 Dribbling Sequence", duration: "20 min", type: "Technical" },
        { name: "High Intensity Sprints", duration: "10 min", type: "Physical" }
      ];
    } else if (['CB', 'LB', 'RB'].includes(pos)) {
      return [
        { name: "Defensive Header Clearances", duration: "15 min", type: "Defensive" },
        { name: "1v1 Jockeying & Tackling", duration: "20 min", type: "Technical" },
        { name: "Lateral Quickness", duration: "10 min", type: "Physical" }
      ];
    } else if (pos === 'GK') {
      return [
        { name: "Reaction Saves", duration: "15 min", type: "Goalkeeping" },
        { name: "Distribution Practice", duration: "15 min", type: "Technical" },
        { name: "High Catches", duration: "15 min", type: "Goalkeeping" }
      ];
    } else {
      return [ // Midfield
        { name: "Scanning & Receiving", duration: "15 min", type: "Awareness" },
        { name: "Pass & Move Triangles", duration: "20 min", type: "Technical" },
        { name: "Box-to-Box Runs", duration: "10 min", type: "Physical" }
      ];
    }
  };

  const drills = getDrills(profile.position);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Your Plan</h2>
        <p className="text-text-muted mt-1 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
           <Target size={12} className="text-accent" /> {profile.position} Specific Drills
        </p>
      </div>

      <div className="glass-card p-6 bg-accent/5 border-accent/30 relative overflow-hidden">
        <Zap size={120} className="absolute -right-10 -bottom-10 text-accent opacity-10" />
        <h3 className="font-black text-xl uppercase tracking-tighter mb-2 text-accent">Daily Protocol</h3>
        <div className="flex gap-4 mt-4">
           <div>
             <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Total Time</p>
             <p className="font-black text-lg">45 Min</p>
           </div>
           <div>
             <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Intensity</p>
             <p className="font-black text-lg">High</p>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        {drills.map((drill, idx) => (
          <div key={idx} className="glass-card p-4 flex justify-between items-center group">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-[#1F2937] border border-border flex items-center justify-center font-black text-text-muted">
                 {idx + 1}
               </div>
               <div>
                  <h4 className="font-bold text-sm tracking-wide">{drill.name}</h4>
                  <p className="text-[9px] text-accent uppercase font-black tracking-widest mt-1">{drill.type}</p>
               </div>
            </div>
            <div className="flex items-center gap-1 text-text-muted">
               <Clock size={12} />
               <span className="text-xs font-bold">{drill.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
         <button className="w-full bg-accent text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(22,163,74,0.4)]">
            <Trophy size={16} /> Complete Workout
         </button>
      </div>
    </motion.div>
  );
}
