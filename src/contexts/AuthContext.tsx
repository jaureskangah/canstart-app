import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  UserCredential,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirebaseError } from '../services/firebase';
import toast from 'react-hot-toast';
import localforage from 'localforage';

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type UserData = {
  preferences: {
    jobAlerts: boolean;
    propertyAlerts: boolean;
    preferredJobTypes: string[];
    preferredLocations: string[];
  };
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getErrorMessage = (error: AuthError) => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/popup-closed-by-user':
      return 'Sign in cancelled';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return error.message || 'An error occurred during authentication';
  }
};

// Initialize localForage instance for user data
const userDataCache = localforage.createInstance({
  name: 'userDataCache'
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
        await initializeUserData(user);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const initializeUserData = async (user: { uid: string }) => {
    try {
      // Try to get data from cache first
      const cachedData = await userDataCache.getItem<UserData>(user.uid);
      if (cachedData) {
        setUserData(cachedData);
      }

      // Try to get data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
        await userDataCache.setItem(user.uid, data);
      } else {
        const initialData: UserData = {
          preferences: {
            jobAlerts: false,
            propertyAlerts: false,
            preferredJobTypes: [],
            preferredLocations: []
          }
        };
        await setDoc(doc(db, 'users', user.uid), initialData);
        setUserData(initialData);
        await userDataCache.setItem(user.uid, initialData);
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      handleFirebaseError(error);
      
      // If we have cached data, continue using it
      const cachedData = await userDataCache.getItem<UserData>(user.uid);
      if (cachedData) {
        setUserData(cachedData);
        toast.success('Using cached data while offline');
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully');
      return result;
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      await initializeUserData(user);
      toast.success('Account created successfully');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await initializeUserData(result.user);
      toast.success('Signed in with Google successfully');
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Google sign-in error:', error);
        toast.error(getErrorMessage(error));
        throw error;
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      await userDataCache.clear();
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        userData,
        loading,
        signIn, 
        signUp,
        signInWithGoogle,
        signOut 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}