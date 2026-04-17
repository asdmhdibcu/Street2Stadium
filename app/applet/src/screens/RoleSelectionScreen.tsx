import React, { useState } from 'react';
import { motion } from 'motion/react';
import { db, auth } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { User, ShieldUser } from 'lucide-react';

export default function RoleSelectionScreen({ onComplete }: { onComplete: () => void }) {
  const [selectedRole, setSelectedRole] = useState<'Player' | 'Coach' | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedRole || !auth.currentUser) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'profiles', auth.currentUser.uid), {
        userId: auth.currentUser.uid,
        name: auth.currentUser.displayName || 'Unknown User',
        role: selectedRole,
        position: 'CM', // default string, player can change in settings
        age: '',
        country: '',
      });
      onComplete();
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-dark px-6 pt-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-text-light uppercase tracking-tighter">Choose Your Path</h1>
        <p className="text-text-muted mt-2 text-sm max-w-[250px] mx-auto">
          Select your role to customize your Street2Stadium experience.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div 
          onClick={() => setSelectedRole('Player')}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${selectedRole === 'Player' ? 'border-accent bg-accent/10' : 'border-border bg-[#111827] hover:border-text-muted'}`}
        >
          <div className={`p-4 rounded-full ${selectedRole === 'Player' ? 'bg-accent/20 text-accent' : 'bg-white/5 text-text-muted'}`}>
            <User size={30} />
          </div>
          <div>
            <h3 className="font-bold text-lg uppercase tracking-wider">Player</h3>
            <p className="text-xs text-text-muted">Access training drills, track progress, and view schedules.</p>
          </div>
        </div>

        <div 
          onClick={() => setSelectedRole('Coach')}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${selectedRole === 'Coach' ? 'border-accent bg-accent/10' : 'border-border bg-[#111827] hover:border-text-muted'}`}
        >
          <div className={`p-4 rounded-full ${selectedRole === 'Coach' ? 'bg-accent/20 text-accent' : 'bg-white/5 text-text-muted'}`}>
            <ShieldUser size={30} />
          </div>
          <div>
            <h3 className="font-bold text-lg uppercase tracking-wider">Coach</h3>
            <p className="text-xs text-text-muted">Manage the squad, schedule events, and track attendance.</p>
          </div>
        </div>
      </div>

      <div className="mt-auto pb-10">
        <button 
          disabled={!selectedRole || saving}
          onClick={handleSave}
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${selectedRole ? 'bg-accent text-white shadow-[0_4px_14px_rgba(22,163,74,0.4)]' : 'bg-[#111827] border border-border text-text-muted cursor-not-allowed'}`}
        >
          {saving ? 'Setting up...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
