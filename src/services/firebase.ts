import { initializeApp } from '@firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  browserLocalPersistence, 
  setPersistence,
  indexedDBLocalPersistence
} from '@firebase/auth';
import { 
  getFirestore, 
  enableMultiTabIndexedDbPersistence,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from '@firebase/firestore';
import { getAnalytics, isSupported } from '@firebase/analytics';
import toast from 'react-hot-toast';

// Ensure all environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
] as const;

// Validate environment variables
for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  toast.error('Failed to initialize application. Please refresh the page.');
  throw error;
}

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence for Firestore
const initializeFirestorePersistence = async () => {
  try {
    if (typeof window !== 'undefined') {
      try {
        // Try multi-tab persistence first
        await enableMultiTabIndexedDbPersistence(db, {
          cacheSizeBytes: CACHE_SIZE_UNLIMITED
        });
      } catch (err: any) {
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, only enable in one tab
          await enableIndexedDbPersistence(db, {
            cacheSizeBytes: CACHE_SIZE_UNLIMITED
          });
        } else if (err.code === 'unimplemented') {
          // Browser doesn't support persistence
          console.warn('Firestore persistence not supported');
        }
      }
    }
  } catch (error) {
    console.warn('Failed to enable Firestore persistence:', error);
  }
};

// Initialize persistence
initializeFirestorePersistence();

// Set persistence to LOCAL for Auth
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
  toast.error('Error setting up authentication. Some features may be limited.');
});

// Initialize analytics only if supported
export const analytics = await isSupported().then(yes => yes ? getAnalytics(app) : null);

// Configure Google provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  SAVED_JOBS: 'savedJobs',
  SAVED_PROPERTIES: 'savedProperties',
  SEARCH_HISTORY: 'searchHistory',
  USER_PREFERENCES: 'userPreferences',
  RESUMES: 'resumes',
  COVER_LETTERS: 'coverLetters',
  NOTIFICATIONS: 'notifications'
} as const;

// Error handling utilities
export const handleFirebaseError = (error: any) => {
  console.error('Firebase operation failed:', error);
  
  if (error.code === 'unavailable') {
    toast.error('You appear to be offline. Some features may be limited.');
    return;
  }

  if (error.code === 'permission-denied') {
    toast.error('You don\'t have permission to perform this action.');
    return;
  }

  if (error.code === 'unauthenticated') {
    toast.error('Please sign in to continue.');
    return;
  }

  toast.error('An error occurred. Please try again later.');
};