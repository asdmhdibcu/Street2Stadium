import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  Dumbbell, 
  MessageSquare,
  Megaphone,
  User as UserIcon,
  LogOut,
  Zap
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut, updateProfile as updateAuthProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';

// Subcomponents
import PlayerDashboardScreen from './PlayerDashboardScreen';
import CoachDashboardScreen from './CoachDashboardScreen';
import TrainingPlanScreen from './TrainingPlanScreen';
import AiCoachScreen from './AiCoachScreen';
import EventsScreen from './EventsScreen';
import AnnouncementsScreen from './AnnouncementsScreen';

type Tab = 'dashboard' | 'training' | 'events' | 'coach' | 'announcements' | 'profile';

export default function MainMobileShell({ user, profile, onProfileUpdate }: { user: any, profile: any, onProfileUpdate: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const tabs = profile.role === 'Player' 
    ? [
        { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
        { id: 'training', label: 'Drills', icon: Dumbbell },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'coach', label: 'AI', icon: MessageSquare },
        { id: 'profile', label: 'Profile', icon: UserIcon },
      ]
    : [
        { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'announcements', label: 'Board', icon: Megaphone },
        { id: 'profile', label: 'Profile', icon: UserIcon },
      ];

  const handleSignOut = () => signOut(auth);

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-stadium-gold text-black px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 text-sm w-[90%] max-w-[400px]"
          >
            <Zap size={16} className="shrink-0" /> 
            <span className="truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto px-4 pt-10 pb-24 scrollbar-hide">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && profile.role === 'Player' && <PlayerDashboardScreen key="pd" profile={profile} nav={setActiveTab} />}
          {activeTab === 'dashboard' && profile.role === 'Coach' && <CoachDashboardScreen key="cd" profile={profile} nav={setActiveTab} />}
          {activeTab === 'training' && <TrainingPlanScreen key="tr" profile={profile} />}
          {activeTab === 'events' && <EventsScreen key="ev" profile={profile} showToast={showToast} />}
          {activeTab === 'coach' && <AiCoachScreen key="ai" profile={profile} />}
          {activeTab === 'announcements' && <AnnouncementsScreen key="an" profile={profile} showToast={showToast} />}
          
          {activeTab === 'profile' && (
              <ProfileScreen key="prof" user={user} profile={profile} onUpdated={onProfileUpdate} showToast={showToast} handleSignOut={handleSignOut} />
          )}
        </AnimatePresence>
      </main>

      <nav className="absolute bottom-6 left-4 right-4 bg-surface/90 backdrop-blur-xl border border-border px-2 py-2 rounded-2xl flex justify-between gap-1 z-50 shadow-2xl">
        {tabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center justify-center py-2 px-2 transition-all relative flex-1 rounded-xl ${
                isActive ? "text-white bg-white/5" : "text-text-muted hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-accent transition-transform" : ""} />
              <span className={`text-[9px] uppercase font-bold tracking-widest mt-1 ${isActive ? "opacity-100" : "opacity-60"}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-accent"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// Inline Profile Screen
function ProfileScreen({ user, profile, onUpdated, showToast, handleSignOut }: any) {
  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState(profile.age ? String(profile.age) : '');
  const [position, setPosition] = useState(profile.position || 'CM');
  const [location, setLocation] = useState(profile.location || '');
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const updateData: any = { name, position };
      if (age) updateData.age = parseInt(age, 10) || 0;
      if (location) updateData.location = location;
      
      await updateDoc(doc(db, 'profiles', user.uid), updateData);
      await updateAuthProfile(user, { displayName: name });
      showToast("Profile Updated");
      onUpdated();
    } catch(e: any) {
      console.error(e);
      showToast("Error updating profile. Schema mismatch?");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-6">Profile</h1>
      
      <div className="glass-card p-6 flex flex-col items-center relative overflow-hidden">
        <div className="w-20 h-20 bg-surface rounded-full border-2 border-accent mb-4 flex items-center justify-center text-2xl font-black">
           {name.charAt(0)}
        </div>
        <h2 className="text-xl font-bold uppercase tracking-wider">{name}</h2>
        <p className="text-accent text-[10px] font-black uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full mt-2">{profile.role}</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-text-muted px-2 block mb-1">Full Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-[#111827] border border-border rounded-xl py-3 px-4 text-sm font-medium focus:border-accent outline-none" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-text-muted px-2 block mb-1">Age</label>
            <input type="number" value={age} onChange={e=>setAge(e.target.value)} className="w-full bg-[#111827] border border-border rounded-xl py-3 px-4 text-sm font-medium focus:border-accent outline-none" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-text-muted px-2 block mb-1">Location</label>
            <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="City, Country" className="w-full bg-[#111827] border border-border rounded-xl py-3 px-4 text-sm font-medium focus:border-accent outline-none" />
          </div>
        </div>
        {profile.role === 'Player' && (
          <div>
            <label className="text-[10px] uppercase font-bold text-text-muted px-2 block mb-1">Position</label>
            <select value={position} onChange={e=>setPosition(e.target.value)} className="w-full bg-[#111827] border border-border rounded-xl py-3 px-4 text-sm font-medium focus:border-accent outline-none appearance-none">
                {['GK', 'LB', 'CB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
            </select>
          </div>
        )}
        
        <button disabled={isSaving} onClick={saveProfile} className="w-full py-4 mt-6 bg-accent text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-[0_4px_14px_rgba(22,163,74,0.4)]">
           {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <button onClick={handleSignOut} className="w-full py-4 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
         <LogOut size={16} /> Sign Out
      </button>
    </motion.div>
  );
}
