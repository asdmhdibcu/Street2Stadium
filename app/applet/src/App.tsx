import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import SplashScreen from './screens/SplashScreen';
import AuthScreens from './screens/AuthScreens';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import MainMobileShell from './components/MainMobileShell';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, 'profiles', uid));
      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        setProfile(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setTimeout(() => setLoading(false), 1000);
    });
    return () => unsub();
  }, []);

  const handleRoleSelected = () => {
    if (user) fetchProfile(user.uid);
  };

  return (
    <div className="mobile-container">
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="splash" exit={{ opacity: 0 }} className="absolute inset-0 z-50">
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !user && <AuthScreens />}
      
      {!loading && user && !profile && (
        <RoleSelectionScreen onComplete={handleRoleSelected} />
      )}

      {!loading && user && profile && (
        <MainMobileShell user={user} profile={profile} onProfileUpdate={() => fetchProfile(user.uid)} />
      )}
    </div>
  );
}
