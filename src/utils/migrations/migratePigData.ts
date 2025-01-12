import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export async function migratePigData(userId: string) {
  try {
    // Get data from old collection
    const oldDocRef = doc(db, 'pigFarms', userId);
    const oldDocSnap = await getDoc(oldDocRef);
    
    if (!oldDocSnap.exists()) {
      console.log('No data to migrate');
      return;
    }

    const oldData = oldDocSnap.data();

    // Get or create document in new collection
    const newDocRef = doc(db, 'farms', userId);
    const newDocSnap = await getDoc(newDocRef);

    if (newDocSnap.exists()) {
      // Get existing data
      const existingData = newDocSnap.data();
      const existingPigData = existingData.pigs || {};

      // Merge old and new data, preferring existing data where available
      await updateDoc(newDocRef, {
        pigs: {
          breedingCycles: existingPigData.breedingCycles || oldData.breedingCycles || [],
          weightRecords: existingPigData.weightRecords || oldData.weightRecords || [],
          feedConversion: existingPigData.feedConversion || oldData.feedConversion || [],
          geneticRecords: existingPigData.geneticRecords || oldData.geneticRecords || [],
          environmentalMetrics: existingPigData.environmentalMetrics || oldData.environmentalMetrics || [],
          lastUpdated: existingPigData.lastUpdated || oldData.lastUpdated || new Date().toISOString(),
          stock: existingPigData.stock || oldData.stock || { quantity: 0, lastUpdated: new Date().toISOString() },
          stockHistory: existingPigData.stockHistory || oldData.stockHistory || []
        }
      });
    } else {
      // Create new document with old data
      await setDoc(newDocRef, {
        pigs: {
          breedingCycles: oldData.breedingCycles || [],
          weightRecords: oldData.weightRecords || [],
          feedConversion: oldData.feedConversion || [],
          geneticRecords: oldData.geneticRecords || [],
          environmentalMetrics: oldData.environmentalMetrics || [],
          lastUpdated: oldData.lastUpdated || new Date().toISOString(),
          stock: oldData.stock || { quantity: 0, lastUpdated: new Date().toISOString() },
          stockHistory: oldData.stockHistory || []
        }
      });
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
} 