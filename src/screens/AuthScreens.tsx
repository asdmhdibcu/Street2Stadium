import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function AuthScreens() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const provider = new GoogleAuthProvider();
      // Add standard scopes and custom parameters as needed
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      console.log("Logged in user:", result.user);
    } catch (err: any) {
      console.error("Auth Error:", err);
      let message = err.message || 'Authentication failed';
      
      // Special note for missing configurations
      if (err.code === 'auth/operation-not-allowed') {
          message = 'Google Sign-in is not enabled. Please enable it in your Firebase Console.';
      } else if (err.code === 'auth/popup-blocked') {
          message = 'Popup was blocked by your browser. Please allow popups for this site.';
      } else if (err.code === 'auth/popup-closed-by-user') {
          message = 'The sign-in popup was closed before completing the process.';
      } else if (err.code === 'auth/unauthorized-domain') {
          message = 'This domain is not authorized for OAuth operations. Please add the preview URL to Firebase Console > Authentication > Settings > Authorized domains.';
      }
      
      setErrorMsg(`Error: ${message} (Code: ${err.code || 'unknown'})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-dark px-6 pt-20">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-text-light uppercase tracking-tighter">
          Join the Squad
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          Sign in with your Google account to access your locker room and schedule.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-10">
        {errorMsg && <p className="text-red-500 text-xs font-medium px-2 text-center">{errorMsg}</p>}

        <button 
          disabled={loading} 
          onClick={handleGoogleSignIn}
          className="mt-6 bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 shadow-[0_4px_14px_rgba(255,255,255,0.2)]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
          </svg>
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </button>
      </div>

    </div>
  );
}
