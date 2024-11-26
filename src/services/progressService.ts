import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';

type StepStatus = 'pending' | 'in_progress' | 'completed';

export async function trackProgress(userId: string, stepId: string, status: StepStatus) {
  try {
    const progressRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(progressRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    const userData = userDoc.data();
    const updatedProgress = {
      ...userData.progress,
      [stepId]: {
        status,
        updatedAt: new Date().toISOString()
      }
    };

    await setDoc(progressRef, {
      ...userData,
      progress: updatedProgress
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Error tracking progress:', error);
    throw error;
  }
}

export async function getProgress(userId: string) {
  try {
    const progressRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(progressRef);
    
    if (!userDoc.exists()) {
      return {};
    }

    return userDoc.data().progress || {};
  } catch (error) {
    console.error('Error getting progress:', error);
    throw error;
  }
}