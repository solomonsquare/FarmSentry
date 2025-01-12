import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { COLLECTIONS } from '../schema/collections';

export async function resetUserData(userId: string) {
  const batch = writeBatch(db);

  try {
    // Delete data from all collections
    for (const collectionName of Object.values(COLLECTIONS)) {
      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error resetting user data:', error);
    throw error;
  }
}