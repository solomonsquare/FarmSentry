import { db } from '../../../config/firebase';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS } from './collections';
import { FarmCategory } from '../../../types';

export async function initializeDatabase(userId: string, category: FarmCategory) {
  const batch = writeBatch(db);

  try {
    // Create user document
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    batch.set(userRef, {
      id: userId,
      onboardingComplete: true,
      currentFarmType: category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Create farm document with nested structure
    const farmRef = doc(db, COLLECTIONS.FARMS, userId);
    batch.set(farmRef, {
      id: userId,
      category,
      [category]: {
        stock: {
          currentBirds: 0,
          history: [],
          lastUpdated: serverTimestamp()
        },
        expenses: {
          animals: 0,
          medicine: 0,
          feeds: 0,
          additionals: 0
        },
        salesSummary: {
          totalSold: 0,
          totalRevenue: 0,
          totalProfit: 0,
          lastSaleDate: null
        },
        lastUpdated: serverTimestamp()
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}