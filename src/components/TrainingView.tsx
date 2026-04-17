import React from 'react';
import { motion } from 'motion/react';
import { 
  Dumbbell, 
  Play, 
  CheckCircle, 
  Clock, 
  Focus,
  Activity,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function TrainingView() {
  const sessions = [
    { title: 'Technical Mastery', intensity: 'High', drills: 4, duration: '45m', status: 'In Progress' },
    { title: 'Endurance Build', intensity: 'Med', drills: 2, duration: '60m', status: 'Pending' },
    { title: 'Finishing Fundamentals', intensity: 'High', drills: 3, duration: '30m', status: 'Locked' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl font-black uppercase tracking-tighter">Training Ground</h2>
        <p className="text-text-muted font-bold uppercase tracking-widest text-[10px] mt-1">Lagos Elite Program • Week 4 Intensity</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-text-muted">Available Modules</h3>
          {sessions.map((session, i) => (
            <div key={i} className={cn(
              "glass-card p-6 flex items-center justify-between group transition-all bg-surface border-border",
              session.status === 'Locked' ? 'opacity-30 grayscale pointer-events-none' : 'hover:border-accent/40'
            )}>
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border border-border",
                  session.status === 'In Progress' ? 'bg-accent/10 text-accent' : 'bg-white/5 text-text-muted'
                )}>
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg tracking-tight leading-none mb-1">{session.title}</h4>
                  <div className="flex items-center gap-4 text-[10px] text-text-muted uppercase font-black tracking-widest">
                    <span className="flex items-center gap-1"><Clock size={12} /> {session.duration}</span>
                    <span className="flex items-center gap-1"><Focus size={12} /> {session.drills} Drills</span>
                  </div>
                </div>
              </div>
              <button disabled={session.status === 'Locked'} className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                session.status === 'In Progress' ? 'bg-accent text-black scale-110 shadow-[0_0_15px_rgba(204,255,0,0.5)]' : 'border border-border text-text-muted'
              )}>
                {session.status === 'In Progress' ? <Play size={20} className="fill-current ml-1" /> : <ChevronRight size={20} />}
              </button>
            </div>
          ))}
        </section>

        <section className="glass-card p-8 bg-surface border-border overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black uppercase tracking-tighter">Live Session: Control</h3>
            <span className="bg-accent text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Ongoing</span>
          </div>

          <div className="space-y-8">
            <DrillStep 
              number="01" 
              title="First Touch Expansion" 
              desc="Receive and open hips. 20 reps each foot."
              completed={true}
            />
            <DrillStep 
              number="02" 
              title="Scanning & Awareness" 
              desc="Check shoulder before receiving. Visualizing 3 options."
              completed={false}
            />
            <DrillStep 
              number="03" 
              title="Deceptive Passing" 
              desc="Disguise passes using eyes and body positioning."
              completed={false}
            />
          </div>

          <button className="w-full mt-10 py-5 bg-accent text-black rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
            Register Session
          </button>
        </section>
      </div>
    </motion.div>
  );
}

function DrillStep({ number, title, desc, completed }: { number: string, title: string, desc: string, completed: boolean }) {
  return (
    <div className="flex gap-4">
      <div className={cn(
        "shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black",
        completed ? "bg-neon border-neon text-pitch" : "border-white/20 text-white/20"
      )}>
        {completed ? <CheckCircle size={16} /> : number}
      </div>
      <div>
        <h5 className={cn("font-bold text-sm", completed && "line-through text-white/30")}>{title}</h5>
        <p className="text-xs text-white/40 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
