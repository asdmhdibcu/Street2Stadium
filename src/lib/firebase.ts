import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "MOCK_KEY",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:mock123"
};

// Try to load real config if it exists
let app;
try {
  // @ts-ignore
  import config from '../firebase-applet-config.json';
  app = initializeApp(config);
} catch (e) {
  app = initializeApp(firebaseConfig);
  console.warn("Firebase config not found. Using mock config.");
}

export const auth = getAuth(app);
export const db = getFirestore(app);
