import { doc, writeBatch, setDoc, deleteDoc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FarmCategory } from '../types';

interface FarmInitData {
  farmType: FarmCategory;
  farmSize: number;
  experience: string;
  goals: string[];
}

export const UserService = {
  async initializeUserAndFarm(userId: string, data: FarmInitData) {
    const userRef = doc(db, 'users', userId);
    const farmRef = doc(db, 'farms', userId);

    try {
      const batch = writeBatch(db);

      // Set user data with explicit values
      batch.set(userRef, {
        onboardingComplete: true,
        farmType: data.farmType,
        experience: data.experience,
        goals: data.goals,
        updatedAt: new Date().toISOString(),
        userId: userId // Add userId for extra validation
      }, { merge: true });

      // Set initial farm data
      batch.set(farmRef, {
        [data.farmType]: {
          stock: {
            currentBirds: 0,
            history: [],
            lastUpdated: new Date().toISOString()
          },
          weightRecords: [],
          feedConsumption: [],
          expenses: {
            birds: 0,
            medicine: 0,
            feeds: 0,
            additionals: 0
          },
          stats: {
            totalSold: 0,
            totalRevenue: 0,
            totalProfit: 0,
            lastSaleDate: null
          }
        }
      }, { merge: true });

      // Commit the batch
      await batch.commit();

      // Verify the update
      const verifyDoc = await getDoc(userRef);
      if (!verifyDoc.exists() || !verifyDoc.data()?.onboardingComplete) {
        throw new Error('Failed to verify onboarding completion');
      }
    } catch (error) {
      console.error('Error initializing user and farm:', error);
      throw error;
    }
  },

  async checkOnboardingStatus(userId: string): Promise<boolean> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data()?.onboardingComplete || false;
    } else {
      return false;
    }
  },

  async resetUserData(userId: string) {
    try {
      console.log('Starting reset for user:', userId);
      
      // Get references
      const userRef = doc(db, 'users', userId);
      const farmRef = doc(db, 'farms', userId);

      // 1. Reset user document
      await setDoc(userRef, {
        onboardingComplete: false,
        farmType: null,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 2. Delete farm document completely
      await deleteDoc(farmRef);

      console.log('Reset completed successfully');
      return true;
    } catch (error) {
      console.error('Error in resetUserData:', error);
      throw new Error('Failed to reset data');
    }
  },

  async getFarmType(userId: string): Promise<string | null> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data()?.farmType || null;
    } else {
      return null;
    }
  },

  async getUserData(userId: string) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  }
};