import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirestore, Firestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const MY_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB-Ka4eVgVy-cfmQKuhCKYgKrNPhdl7dRQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hotelkeren-241cc.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hotelkeren-241cc',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hotelkeren-241cc.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1053376405109',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1053376405109:web:4a018cba8d22f994b7a23c',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-PY4GD0FQH1',
};

const appId = import.meta.env.VITE_APP_ID || 'hotel-keren-app-2026';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function getFirebaseConfig() {
  try {
    const w = window as unknown as Record<string, unknown>;
    if (typeof w.__firebase_config === 'string') {
      return JSON.parse(w.__firebase_config as string);
    }
  } catch {
    // ignore
  }
  return MY_FIREBASE_CONFIG;
}

export function initFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  if (app && auth && db) return { app, auth, db };

  const config = getFirebaseConfig();
  app = initializeApp(config);
  auth = getAuth(app);
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
  console.log('Firestore initialized with long polling mode to avoid AdBlocker issues.');

  return { app, auth, db };
}

export function getFirestoreRef() {
  const { db: firestore } = initFirebase();
  return doc(firestore, 'artifacts', appId, 'public', 'data', 'config', 'state');
}

export async function loginWithEmail(email: string, password: string) {
  const { auth: authInstance } = initFirebase();
  return signInWithEmailAndPassword(authInstance, email, password);
}

export async function saveStateToCloud(state: unknown) {
  try {
    const { auth: authInstance } = initFirebase();
    if (!authInstance.currentUser) return;
    const stateRef = getFirestoreRef();
    await setDoc(stateRef, state);
  } catch (err) {
    console.error('Cloud Database Write Error:', err);
    throw err;
  }
}

export async function pullStateFromCloud() {
  const stateRef = getFirestoreRef();
  const docSnap = await getDoc(stateRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

export function subscribeToCloudState(
  callback: (data: Record<string, unknown>) => void,
  onError: (error: Error) => void
): () => void {
  const stateRef = getFirestoreRef();
  return onSnapshot(
    stateRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as Record<string, unknown>);
      }
    },
    (error) => {
      onError(error);
    }
  );
}

export { appId };
