import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, handleFirestoreError, OperationType } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function AuthScreens() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setErrorMsg('Please fill all fields');
    if (!isLogin && !name) return setErrorMsg('Please provide a name');

    setLoading(true);
    setErrorMsg('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-dark px-6 pt-20">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-text-light uppercase tracking-tighter">
          {isLogin ? 'Welcome Back' : 'Join the Squad'}
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          {isLogin ? 'Sign in to access your dashboard and schedule.' : 'Create an account to start your journey to the stadium.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AnimatePresence>
          {!isLogin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <label className="text-[10px] uppercase font-bold text-text-muted px-2 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Cristiano Ronaldo"
                className="w-full bg-[#111827] border border-border rounded-xl py-4 px-4 text-sm font-medium focus:border-accent outline-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <label className="text-[10px] uppercase font-bold text-text-muted px-2 block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="player@academy.com"
            className="w-full bg-[#111827] border border-border rounded-xl py-4 px-4 text-sm font-medium focus:border-accent outline-none"
          />
        </div>

        <div>
           <label className="text-[10px] uppercase font-bold text-text-muted px-2 block mb-1">Password</label>
           <input
             type="password"
             value={password}
             onChange={e => setPassword(e.target.value)}
             placeholder="••••••••"
             className="w-full bg-[#111827] border border-border rounded-xl py-4 px-4 text-sm font-medium focus:border-accent outline-none"
           />
        </div>

        {errorMsg && <p className="text-red-500 text-xs font-medium px-2">{errorMsg}</p>}

        <button 
          disabled={loading} 
          type="submit" 
          className="mt-6 bg-accent text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all shadow-[0_4px_14px_rgba(22,163,74,0.4)]"
        >
          {loading ? 'Authenticating...' : (isLogin ? 'Login' : 'Create Account')}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button type="button" onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} className="text-text-muted text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}
