import { db } from '../../../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { COLLECTIONS } from './collections';

export async function validateSchema(userId: string) {
  try {
    // Check required collections
    const requiredCollections = [
      COLLECTIONS.FARMS,
      COLLECTIONS.STOCK,
      COLLECTIONS.EXPENSES,
      COLLECTIONS.SALES
    ];

    for (const collectionName of requiredCollections) {
      const q = query(
        collection(db, collectionName),
        where('id', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return {
          isValid: false,
          error: `Missing ${collectionName} collection data`
        };
      }
    }

    return {
      isValid: true
    };
  } catch (error) {
    console.error('Error validating schema:', error);
    throw error;
  }
}