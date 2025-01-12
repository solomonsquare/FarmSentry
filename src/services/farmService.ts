import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PigFarmData } from '../types/pig';

export const getFarmDoc = async (userId: string) => {
  console.log('Getting farm doc for user:', userId);
  return await getDoc(doc(db, 'pigFarms', userId));
};

export const getFarmData = async (userId: string): Promise<PigFarmData> => {
  console.log('Getting farm data for user:', userId);
  const docRef = await getFarmDoc(userId);
  console.log('Farm doc exists:', docRef.exists());
  if (!docRef.exists()) {
    console.log('Initializing new farm data');
    // Initialize farm data if it doesn't exist
    return initializePigFarm(userId);
  }
  const data = docRef.data() as PigFarmData;
  console.log('Retrieved farm data:', data);
  return data;
};

export const initializePigFarm = async (userId: string) => {
  console.log('Initializing farm data for user:', userId);
  const farmData: PigFarmData = {
    weightRecords: [],
    feedConversion: [],
    breedingCycles: [],
    geneticRecords: [],
    environmentalMetrics: [],
    lastUpdated: new Date().toISOString()
  };

  console.log('Setting initial farm data:', farmData);
  await setDoc(doc(db, 'pigFarms', userId), farmData);
  return farmData;
};

export const updateFarmData = async (userId: string, data: Partial<PigFarmData>) => {
  const farmRef = doc(db, 'pigFarms', userId);
  await updateDoc(farmRef, {
    ...data,
    lastUpdated: new Date().toISOString()
  });
};

export const debugFarmData = async (userId: string) => {
  try {
    const doc = await getFarmDoc(userId);
    console.log('Farm data in Firebase:', doc.data());
    return doc.data();
  } catch (err) {
    console.error('Error fetching farm data:', err);
    return null;
  }
}; 