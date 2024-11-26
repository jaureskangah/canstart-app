import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export type NeighborhoodData = {
  id: string;
  name: string;
  averagePrice: number;
  priceChange: number;
  priceHistory: number[];
  totalProperties: number;
  propertyChange: number;
  marketTrend: string;
  population: number;
  populationChange: number;
  amenities: {
    schools: number;
    parks: number;
    restaurants: number;
    transit: number;
  };
  safetyScore: number;
  transitScore: number;
};

export async function getNeighborhoodData(neighborhoodId: string): Promise<NeighborhoodData> {
  try {
    const neighborhoodRef = collection(db, 'neighborhoods');
    const q = query(neighborhoodRef, where('id', '==', neighborhoodId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error('Neighborhood not found');
    }

    return snapshot.docs[0].data() as NeighborhoodData;
  } catch (error) {
    console.error('Error fetching neighborhood data:', error);
    throw error;
  }
}

export async function getNeighborhoodsByCity(city: string): Promise<NeighborhoodData[]> {
  try {
    const neighborhoodRef = collection(db, 'neighborhoods');
    const q = query(neighborhoodRef, where('city', '==', city));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => doc.data() as NeighborhoodData);
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    throw error;
  }
}