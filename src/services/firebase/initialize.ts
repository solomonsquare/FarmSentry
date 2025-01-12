import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { COLLECTIONS } from './collections';
import { FarmCategory } from '../../types';

export async function initializeFarmDocument(userId: string, category: FarmCategory) {
  const farmRef = doc(db, COLLECTIONS.FARMS, userId);
  
  const initialData = {
    [category]: {
      sales: [],
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
      lastUpdated: new Date().toISOString()
    }
  };

  await setDoc(farmRef, initialData, { merge: true });
  return initialData;
}