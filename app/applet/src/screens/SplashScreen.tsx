import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-bg-dark">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(22,163,74,0.3)]">
          <Activity size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-text-light tracking-tighter">Street<span className="text-accent">2</span>Stadium</h1>
        <p className="text-text-muted mt-2 font-medium tracking-widest uppercase text-xs">Unlock Your Potential</p>
      </motion.div>
    </div>
  );
}
