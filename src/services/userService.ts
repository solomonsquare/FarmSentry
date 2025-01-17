import { doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FarmCategory } from '../types';

interface FarmInitData {
  farmType: FarmCategory;
  farmSize: number;
  experience: string;
  goals: string[];
}

export const UserService = {
  async createUserDocument(userId: string) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      onboardingComplete: false,
      farmType: null,
      createdAt: new Date().toISOString()
    });
  },

  async getUserData(userId: string) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  },

  async updateUserData(userId: string, data: any) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, data, { merge: true });
  },

  async getFarmType(userId: string): Promise<FarmCategory | null> {
    try {
      const userData = await this.getUserData(userId);
      return userData?.farmType || null;
    } catch (error) {
      console.error('Error getting farm type:', error);
      return null;
    }
  },

  async resetUserData(userId: string) {
    const batch = writeBatch(db);
    const userRef = doc(db, 'users', userId);
    const farmRef = doc(db, 'farms', userId);

    try {
      batch.update(userRef, {
        onboardingComplete: false,
        farmType: null,
        updatedAt: new Date().toISOString()
      });

      batch.delete(farmRef);
      await batch.commit();
    } catch (error) {
      console.error('Error resetting user data:', error);
      throw error;
    }
  },

  async initializeUserAndFarm(userId: string, data: FarmInitData) {
    const userRef = doc(db, 'users', userId);
    const farmRef = doc(db, 'farms', userId);

    try {
      // First try to update user data
      await setDoc(userRef, {
        onboardingComplete: true,
        farmType: data.farmType,
        experience: data.experience,
        goals: data.goals,
        farmSize: data.farmSize,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log('User data updated successfully');

      // Then try to create farm data
      await setDoc(farmRef, {
        farmType: data.farmType,
        stock: {
          currentBirds: 0,
          history: [],
          lastUpdated: new Date().toISOString()
        },
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
      });

      console.log('Farm data created successfully');

      // Verify the update
      const verifyDoc = await getDoc(userRef);
      if (!verifyDoc.exists() || !verifyDoc.data()?.onboardingComplete) {
        throw new Error('Failed to verify onboarding completion');
      }

      return true;
    } catch (error: any) {
      console.error('Error in initializeUserAndFarm:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Please ensure you are logged in and try again');
      }
      throw error;
    }
  }
};