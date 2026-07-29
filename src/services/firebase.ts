import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInWithEmailAndPassword } from 'firebase/auth';

const MY_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB-Ka4eVgVy-cfmQKuhCKYgKrNPhdl7dRQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hotelkeren-241cc.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hotelkeren-241cc',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hotelkeren-241cc.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1053376405109',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1053376405109:web:4a018cba8d22f994b7a23c',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-PY4GD0FQH1',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function initFirebase(): { app: FirebaseApp; auth: Auth } {
  if (app && auth) return { app, auth };

  app = initializeApp(MY_FIREBASE_CONFIG);
  auth = getAuth(app);
  console.log('Firebase Auth initialized.');

  return { app, auth };
}

export async function loginWithEmail(email: string, password: string) {
  const { auth: authInstance } = initFirebase();
  return signInWithEmailAndPassword(authInstance, email, password);
}
