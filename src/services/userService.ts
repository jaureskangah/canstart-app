import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import type { Job } from '../components/JobCard';
import type { PropertyResponse } from '../services/housingApi';

export type UserPreferences = {
  savedJobs: string[];
  savedProperties: string[];
  searchHistory: string[];
  jobAlerts: boolean;
  propertyAlerts: boolean;
  preferredJobTypes: string[];
  preferredLocations: string[];
};

export async function saveJob(userId: string, job: Job) {
  try {
    const jobRef = doc(db, COLLECTIONS.SAVED_JOBS, `${userId}_${Date.now()}`);
    await setDoc(jobRef, {
      userId,
      id: `${job.company}-${job.title}-${Date.now()}`,
      ...job,
      savedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
}

export async function saveProperty(userId: string, property: PropertyResponse) {
  try {
    const propertyRef = doc(db, COLLECTIONS.SAVED_PROPERTIES, `${userId}_${Date.now()}`);
    await setDoc(propertyRef, {
      userId,
      ...property,
      savedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving property:', error);
    throw error;
  }
}

export async function getSavedJobs(userId: string): Promise<Job[]> {
  try {
    const jobsQuery = query(
      collection(db, COLLECTIONS.SAVED_JOBS),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(jobsQuery);
    return snapshot.docs.map(doc => doc.data() as Job);
  } catch (error) {
    console.error('Error getting saved jobs:', error);
    throw error;
  }
}

export async function getSavedProperties(userId: string): Promise<PropertyResponse[]> {
  try {
    const propertiesQuery = query(
      collection(db, COLLECTIONS.SAVED_PROPERTIES),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(propertiesQuery);
    return snapshot.docs.map(doc => doc.data() as PropertyResponse);
  } catch (error) {
    console.error('Error getting saved properties:', error);
    throw error;
  }
}

export async function unsaveJob(userId: string, jobId: string) {
  try {
    const jobsQuery = query(
      collection(db, COLLECTIONS.SAVED_JOBS),
      where('userId', '==', userId),
      where('id', '==', jobId)
    );
    const snapshot = await getDocs(jobsQuery);
    const deletePromises = snapshot.docs.map(doc => setDoc(doc.ref, { deleted: true }, { merge: true }));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('Error removing saved job:', error);
    throw error;
  }
}

export async function unsaveProperty(userId: string, propertyId: string) {
  try {
    const propertiesQuery = query(
      collection(db, COLLECTIONS.SAVED_PROPERTIES),
      where('userId', '==', userId),
      where('id', '==', propertyId)
    );
    const snapshot = await getDocs(propertiesQuery);
    const deletePromises = snapshot.docs.map(doc => setDoc(doc.ref, { deleted: true }, { merge: true }));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('Error removing saved property:', error);
    throw error;
  }
}

export async function updateSearchHistory(userId: string, searchQuery: string, type: 'job' | 'property') {
  try {
    const historyRef = doc(db, COLLECTIONS.SEARCH_HISTORY, `${userId}_${Date.now()}`);
    await setDoc(historyRef, {
      userId,
      query: searchQuery,
      type,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating search history:', error);
    throw error;
  }
}

export async function updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    const userData = userDoc.data();
    const updatedPreferences = {
      ...userData.preferences,
      ...preferences
    };

    await setDoc(userRef, {
      ...userData,
      preferences: updatedPreferences
    });

    return true;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
}

export async function saveResume(userId: string, resumeData: any) {
  try {
    const resumeRef = doc(db, COLLECTIONS.RESUMES, `${userId}_${Date.now()}`);
    await setDoc(resumeRef, {
      userId,
      ...resumeData,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
}

export async function saveCoverLetter(userId: string, letterData: any) {
  try {
    const letterRef = doc(db, COLLECTIONS.COVER_LETTERS, `${userId}_${Date.now()}`);
    await setDoc(letterRef, {
      userId,
      ...letterData,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving cover letter:', error);
    throw error;
  }
}