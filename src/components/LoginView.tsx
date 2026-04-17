import React, { useState } from 'react';
import { motion } from 'motion/react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Trophy, AlertCircle } from 'lucide-react';

export default function LoginView() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Login failed", err);
      // Don't show technical errors unless necessary, but let's provide basic feedback
      setError(err?.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-dark text-white overflow-hidden relative font-sans items-center justify-center p-6">
      <div className="atmosphere-top absolute -top-[200px] -right-[200px] w-[600px] h-[600px] pointer-events-none z-0" />
      <div className="atmosphere-bottom absolute -bottom-[150px] -left-[150px] w-[500px] h-[500px] pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 max-w-sm w-full relative z-10 flex flex-col items-center text-center border-border"
      >
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
          <Trophy size={40} className="text-accent drop-shadow-[0_0_10px_currentColor]" />
        </div>
        
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">STREET<span className="text-accent">2</span>STADIUM</h1>
        <p className="text-text-muted text-sm font-bold uppercase tracking-widest mb-8">Elite AI Football Platform</p>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-xs font-bold w-full mb-6 text-left">
            <AlertCircle size={14} className="shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-accent text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Booting Platform...' : 'Sign In With Google'}
        </button>
      </motion.div>
    </div>
  );
}
