import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ArrowUpRight, 
  Dumbbell, 
  Target, 
  Calendar, 
  Clock,
  TrendingUp,
  Award,
  Trophy,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tab } from '../App';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

export default function DashboardView({ navigate, showToast, userRole = 'Player' }: { navigate: (t: Tab) => void, showToast: (msg: string) => void, userRole?: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [teamMembersCount, setTeamMembersCount] = useState(0);
  const [teamName, setTeamName] = useState('LAGOS UNITED');

  useEffect(() => {
    async function loadData() {
      if (!auth.currentUser) return;
      try {
        const pRef = doc(db, 'profiles', auth.currentUser.uid);
        const pSnap = await getDoc(pRef);
        if (pSnap.exists()) {
          setProfile(pSnap.data());
        }

        if (userRole === 'Player') {
          const tQuery = query(
            collection(db, 'training'), 
            where('playerId', '==', auth.currentUser.uid),
            where('isCompleted', '==', true)
          );
          const tSnap = await getDocs(tQuery);
          setCompletedSessions(tSnap.size);
        } else {
          // It's a Coach or Manager, fetch their team info
          const tQuery = query(collection(db, 'teams'), where('ownerId', '==', auth.currentUser.uid));
          const tSnap = await getDocs(tQuery);
          if (!tSnap.empty) {
            const tData = tSnap.docs[0].data();
            setTeamName(tData.name || 'Your Team');
            setTeamMembersCount((tData.members || []).length);
          } else {
             setTeamMembersCount(5); // Default dummy 
          }
        }

      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.GET, 'dashboard_data');
        } catch {
          // Silent error
        }
      }
    }
    loadData();
  }, [userRole]);

  const stats = [
    { label: 'Stamina', value: profile?.stats?.stamina || '84', trend: '+2', color: 'accent' },
    { label: 'Tactical', value: profile?.stats?.tactical || '72', trend: '+5', color: 'muted' },
    { label: 'Discipline', value: profile?.stats?.discipline || '98', trend: '-1', color: 'accent' },
  ];

  const coachStats = [
    { label: 'Squad Readiness', value: '92%', trend: '+4%', color: 'accent' },
    { label: 'Avg Match Rating', value: '7.8', trend: '+0.3', color: 'muted' },
    { label: 'Injuries', value: '1', trend: '-2', color: 'accent' },
  ];

  const currentStats = userRole === 'Player' ? stats : coachStats;

  const activities = [
    { title: 'Shooting Drill', time: 'Today, 4:00 PM', type: 'Training' },
    { title: 'Local Derby vs City FC', time: 'Sat, 10:00 AM', type: 'Match' },
    { title: 'Recovery Session', time: 'Sun, All Day', type: 'Recovery' },
  ];
  
  const coachActivities = [
    { title: 'Match Briefing: City Lions FC', time: 'Tomorrow, 07:00 AM', type: 'Team Meeting' },
    { title: 'Local Derby vs City Lions FC', time: 'Tomorrow, 08:30 AM', type: 'Match' },
    { title: 'Scouting Review', time: 'Mon, 1:00 PM', type: 'Office' },
  ]

  const currentActivities = userRole === 'Player' ? activities : coachActivities;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="hero-card bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-border rounded-[24px] p-8 flex flex-col md:flex-row justify-between md:items-end relative overflow-hidden min-h-[220px] gap-6">
        <div className="hero-content relative z-10">
          <div className="bg-accent text-black font-black text-[11px] px-3 py-1 rounded-sm uppercase mb-4 inline-block">{userRole === 'Player' ? 'Welcome Back' : 'Manager Dashboard'}</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-2 italic">
            {profile?.name ? profile.name.toUpperCase() : (userRole === 'Player' ? "PLAYER" : "COACH")}
          </h1>
          <p className="text-sm text-text-muted max-w-sm">
            {userRole === 'Player' ? `Position: ${profile?.position || 'CM'} • Let's get to work on the pitch today.` : `Managing ${teamName} • ${teamMembersCount > 0 ? teamMembersCount : '5'} Active Players in Squad`}
          </p>
        </div>
        <button onClick={() => navigate('team')} className="bg-accent text-black px-6 py-3 rounded-xl font-bold text-sm uppercase relative z-10 shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-transform hover:scale-105 active:scale-95 whitespace-nowrap self-start md:self-auto">
          View Squad
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentStats.map((stat, i) => (
          <div key={i} className="glass-card p-6 group hover:border-accent/40 transition-all cursor-default">
            <div className="card-title mb-4">
              <span>{stat.label}</span>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                stat.color === 'accent' ? "bg-accent/10 text-accent" : "bg-white/5 text-text-muted"
              )}>
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter leading-none">{stat.value}</span>
              <span className={cn(
                "text-xs font-bold",
                stat.trend.startsWith('+') ? "text-accent" : "text-red-400"
              )}>{stat.trend}</span>
            </div>
            {stat.value.toString().includes('%') ? (
               <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: stat.value }}
                   className={cn(
                     "h-full rounded-full shadow-[0_0_10px_currentcolor]",
                     stat.color === 'accent' ? "bg-accent" : "bg-white/40"
                   )}
                 />
               </div>
            ) : (
                <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(parseInt(stat.value) * (userRole === 'Player' ? 1 : 10), 100)}%` }}
                    className={cn(
                      "h-full rounded-full shadow-[0_0_10px_currentcolor]",
                      stat.color === 'accent' ? "bg-accent" : "bg-white/40"
                    )}
                  />
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Playbook / Team Quick Actions */}
        <section className="glass-card p-8 bg-surface">
          {userRole === 'Player' ? (
            <>
              <div className="flex items-center justify-between mb-8 cursor-pointer group" onClick={() => navigate('training')}>
                <div className="flex items-center gap-3">
                  <Dumbbell size={20} className="text-accent group-hover:rotate-12 transition-transform" />
                  <h3 className="text-lg font-black uppercase tracking-tighter group-hover:text-accent transition-colors">Daily Drills</h3>
                </div>
                <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1">{completedSessions} Sessions Done <ArrowUpRight size={14} /></span>
              </div>

              <div className="space-y-4">
                {['Precision Passing', 'Explosive Sprints'].map((drill, i) => (
                  <div key={i} onClick={() => navigate('training')} className="flex gap-4 items-center group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                    <div className="w-12 h-12 rounded-xl bg-glass flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">
                      {i === 0 ? '🎯' : '⚡'}
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{drill}</p>
                      <p className="text-xs text-text-muted">Focus: {i === 0 ? 'First Touch (15 min)' : 'Explosiveness (20 min)'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
             <>
               <div className="flex items-center justify-between mb-8 cursor-pointer group" onClick={() => navigate('team')}>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-accent group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-black uppercase tracking-tighter group-hover:text-accent transition-colors">Squad Management</h3>
                </div>
                <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1">Action Required <ArrowUpRight size={14} /></span>
              </div>

              <div className="space-y-4">
                <div onClick={() => navigate('team')} className="flex gap-4 items-center group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <Target size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">Set Match Lineup</p>
                    <p className="text-xs text-text-muted">3 players remain unassigned for derby.</p>
                  </div>
                </div>
                <div onClick={() => showToast("Medical reports pending...")} className="flex gap-4 items-center group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">Injury Report</p>
                    <p className="text-xs text-text-muted">J. Mbeki requires fitness test today.</p>
                  </div>
                </div>
              </div>
             </>
          )}
        </section>

        {/* Schedule */}
        <section className="glass-card p-8 bg-surface">
          <div className="flex items-center gap-3 mb-8">
            <Calendar size={20} className="text-accent" />
            <h3 className="text-lg font-black uppercase tracking-tighter">Timeline</h3>
          </div>

          <div className="relative pl-8 space-y-8 border-l border-border ml-2">
            {currentActivities.map((activity, i) => (
              <div key={i} className="relative cursor-pointer group" onClick={() => activity.type === 'Training' ? navigate('training') : activity.type === 'Match' ? navigate('team') : showToast(`${activity.type} tracked!`)}>
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-bg-dark border-2 border-accent transition-transform group-hover:scale-150" />
                <p className="text-[10px] text-accent font-bold uppercase tracking-[.2em] mb-1">{activity.type}</p>
                <p className="font-bold text-lg leading-none mb-1 tracking-tight group-hover:text-accent transition-colors">{activity.title}</p>
                <p className="text-[11px] text-text-muted uppercase tracking-widest">{activity.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {userRole === 'Player' && (
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 glass-card p-8 flex flex-col md:flex-row gap-8 items-center bg-blue-500/5 border-blue-500/20">
            <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
              <TrendingUp size={40} className="text-blue-400" />
            </div>
            <div>
              <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Weekly Scouting Analysis</h4>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Your performance in the last 3 matches has caught the attention of scouts. Your <span className="text-accent">Technical Precision</span> is rising.
              </p>
              <div className="flex gap-4 flex-wrap">
                <span className="px-3 py-1 bg-white/5 border border-border rounded-full text-[10px] font-black uppercase tracking-widest">Mid-Level Prospect</span>
                <span className="px-3 py-1 bg-white/5 border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-accent">Potential: 88</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center gap-2 border-dashed relative overflow-hidden group cursor-pointer" onClick={() => showToast("Scouting networks require PRO access. Firebase integration pending.")}>
            <div className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold relative z-10">Market Value</p>
            <p className="text-3xl font-black tracking-tighter text-stadium-gold relative z-10">$0 - Prospect</p>
            <button className="text-[10px] font-black uppercase text-accent hover:underline tracking-widest mt-2 relative z-10">Get Scouted →</button>
          </div>
        </section>
      )}

      {/* Unlock Feature CTA */}
      <section className="bg-accent p-12 rounded-[24px] text-black relative overflow-hidden group cursor-pointer" onClick={() => showToast("PRO Tools upgrade will be available soon.")}>
        <div className="absolute top-0 right-0 p-8 text-black/10 scale-150 rotate-12 group-hover:rotate-45 transition-transform translate-x-1/4">
          <Trophy size={260} />
        </div>
        <div className="relative z-10 max-w-xl">
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4 italic">
            READY FOR THE<br />WORLD STAGE?
          </h3>
          <p className="font-bold text-black/70 mb-8 max-w-sm">
            {userRole === 'Player' 
              ? "Get personalized scouting reports and tactical analysis used by pro academies." 
              : "Access advanced team analytics, injury prediction, and scout integration for your squad."}
          </p>
          <button className="px-10 py-5 bg-black text-white rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-2xl">
            Unlock Pro Tools <Award size={20} />
          </button>
        </div>
      </section>
    </motion.div>
  );
}
