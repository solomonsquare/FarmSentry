import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { UserProfile, ProfileUpdateData } from './types';

export class UserService {
  private static USERS_COLLECTION = 'users';

  static async createUserProfile(userId: string, email: string): Promise<void> {
    const userRef = doc(db, this.USERS_COLLECTION, userId);
    
    const initialProfile = {
      id: userId,
      email,
      displayName: '',
      phone: '',
      farmName: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      settings: {
        theme: 'light',
        notifications: true
      }
    };

    await setDoc(userRef, initialProfile);
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        ...data,
        id: userDoc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  static async updateUserProfile(userId: string, updates: ProfileUpdateData): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }
}