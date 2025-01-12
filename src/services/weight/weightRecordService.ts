import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { WeightRecord } from '../../types';

export async function saveWeightRecordToDatabase(userId: string, newRecord: WeightRecord) {
  try {
    const farmRef = doc(db, 'farms', userId);
    
    // Get current records first
    const docSnap = await getDoc(farmRef);
    const currentData = docSnap.data();
    const currentRecords = currentData?.birds?.weightRecords || [];
    
    // Add new record to existing records
    const updatedRecords = [...currentRecords, newRecord];
    
    // Update the database
    await updateDoc(farmRef, {
      'birds.weightRecords': updatedRecords
    });

    return updatedRecords;
  } catch (error) {
    console.error('Error saving weight record:', error);
    throw error;
  }
}

export async function getWeightRecordsFromDatabase(userId: string) {
  try {
    const farmRef = doc(db, 'farms', userId);
    const docSnap = await getDoc(farmRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.birds?.weightRecords || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching weight records:', error);
    throw error;
  }
} 