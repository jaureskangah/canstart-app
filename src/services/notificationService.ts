import { collection, query, where, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';

export async function getNotifications(userId: string) {
  try {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
  try {
    const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

export async function createJobNotification(userId: string, jobData: any) {
  try {
    const notificationRef = doc(collection(db, COLLECTIONS.NOTIFICATIONS));
    await updateDoc(notificationRef, {
      userId,
      type: 'job',
      title: 'New Job Match',
      message: `New job posting: ${jobData.title} at ${jobData.company}`,
      read: false,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error creating job notification:', error);
    throw error;
  }
}