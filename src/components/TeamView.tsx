import React from 'react';
import { motion } from 'motion/react';
import { Users, UserPlus, Shield, Star, MapPin, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TeamView() {
  const squad = [
    { name: 'K. Diallo', pos: 'ST', rating: 78, status: 'Active' },
    { name: 'M. Mensah', pos: 'LW', rating: 82, status: 'Active' },
    { name: 'O. Ibrahim', pos: 'CB', rating: 75, status: 'Suspended' },
    { name: 'A. Okoro', pos: 'GK', rating: 80, status: 'Active' },
    { name: 'J. Mbeki', pos: 'CM', rating: 74, status: 'Injured' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">First Team Squad</h2>
          <p className="text-text-muted flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] mt-1">
            <MapPin size={12} className="text-accent" /> Lagos Youth Academy • Premier Div
          </p>
        </div>
        <button className="bg-accent text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all">
          <UserPlus size={18} /> Add Player
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lineup Builder Visualization */}
        <section className="lg:col-span-2 bg-surface border border-border rounded-[24px] overflow-hidden relative min-h-[500px] flex flex-col shadow-inner">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {/* Simple Pitch Layout lines */}
            <div className="absolute inset-4 border border-white/30" />
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-1/2 h-1/4 border-b border-white/30" />
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-1/2 h-1/4 border-t border-white/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/30" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
          </div>
          
          <div className="relative z-10 p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <Shield className="text-accent" size={20} />
                <h3 className="font-bold tracking-[1px] uppercase text-[12px] text-text-muted">Tactical Board</h3>
              </div>
              <p className="text-[10px] font-black uppercase border border-border px-3 py-1 rounded-lg">4-3-3 Symmetric</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-20">
              <div className="flex gap-20">
                <PlayerDot name="Mensah" pos="LW" />
                <PlayerDot name="Diallo" pos="ST" />
                <PlayerDot name="Sane" pos="RW" />
              </div>
              <div className="flex gap-24">
                <PlayerDot name="Toure" pos="CM" />
                <PlayerDot name="Mbeki" pos="CM" />
                <PlayerDot name="Kante" pos="CM" />
              </div>
              <div className="flex gap-12">
                <PlayerDot name="Koulibaly" pos="LB" />
                <PlayerDot name="Okoro" pos="CB" />
                <PlayerDot name="Ibrahim" pos="CB" />
                <PlayerDot name="Bissaka" pos="RB" />
              </div>
              <div>
                <PlayerDot name="Enyeama" pos="GK" />
              </div>
            </div>
          </div>
        </section>

        {/* Players List */}
        <section className="glass-card p-6 h-fit bg-surface border-border">
          <div className="card-title mb-6">
             <span>Squad List</span>
             <Search size={14} className="text-text-muted" />
          </div>

          <div className="space-y-4">
            {squad.map((player, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-border transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-border flex items-center justify-center font-bold text-[10px] uppercase">
                    {player.pos}
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">{player.name}</p>
                    <p className={cn(
                      "text-[9px] uppercase font-black tracking-widest",
                      player.status === 'Active' ? 'text-accent' : 
                      player.status === 'Injured' ? 'text-red-400' : 'text-text-muted'
                    )}>{player.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-accent tracking-tighter">{player.rating}</p>
                  <div className="flex gap-0.5">
                    {[1,2,3].map(s => <Star key={s} size={8} className="fill-accent text-accent" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-4 border border-border rounded-xl text-[10px] uppercase tracking-[2px] font-black text-text-muted hover:text-accent hover:border-accent transition-all">
            Manage Staff
          </button>
        </section>
      </div>
    </motion.div>
  );
}

function PlayerDot({ name, pos }: { name: string, pos: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-pitch group-hover:bg-neon group-hover:border-neon transition-all flex items-center justify-center text-[10px] font-black group-hover:text-pitch">
        {pos}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">{name}</span>
    </div>
  );
}
