import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Dumbbell, 
  MessageSquare, 
  LayoutDashboard, 
  Settings,
  Menu,
  X,
  Target,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import DashboardView from './components/DashboardView';
import AICoachView from './components/AICoachView';
import TeamView from './components/TeamView';
import TrainingView from './components/TrainingView';

type Tab = 'dashboard' | 'coach' | 'team' | 'training' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const navItems = [
    { id: 'training', label: 'Training', icon: Dumbbell },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'coach', label: 'Coach', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen bg-bg-dark text-white overflow-hidden relative font-sans">
      {/* Decorative Atmosphere */}
      <div className="atmosphere-top absolute -top-[200px] -right-[200px] w-[600px] h-[600px] pointer-events-none z-0" />
      <div className="atmosphere-bottom absolute -bottom-[150px] -left-[150px] w-[500px] h-[500px] pointer-events-none z-0" />

      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <div className="logo text-2xl font-black tracking-tighter">
            STREET<span className="text-accent">2</span>STADIUM
          </div>
        </div>
        
        <div className="user-profile flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-accent" />
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none">KOFI MENSAH</span>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Lagos Academy</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto px-8 pb-32 z-10 scrollbar-hide">
        <div className="max-w-7xl mx-auto py-4">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardView key="dash" />}
            {activeTab === 'coach' && <AICoachView key="coach" />}
            {activeTab === 'team' && <TeamView key="team" />}
            {activeTab === 'training' && <TrainingView key="training" />}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Floating Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-2 rounded-full flex gap-10 z-50 shadow-2xl shadow-black/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "flex flex-col items-center gap-1 py-1 transition-all relative",
                isActive ? "text-accent" : "text-text-muted hover:text-white"
              )}
            >
              <Icon size={20} className={cn(isActive && "scale-110 drop-shadow-[0_0_8px_currentColor]")} />
              <span className={cn(
                "text-[9px] uppercase font-black tracking-widest",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
