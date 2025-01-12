import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, onSnapshot, updateDoc, DocumentReference, FieldValue, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Stock, WeightRecord } from '../types';

interface PoultryFarmData {
  stock: Stock;
  weightRecords: WeightRecord[];
  feedConsumption: { date: string; amount: number; type: "starter" | "grower" | "finisher"; }[];
  sales: Sale[];
  lastUpdated?: string;
}

export function usePoultryFarmData() {
  const { currentUser } = useAuth();
  const [data, setData] = useState<PoultryFarmData>({
    stock: { currentBirds: 0, history: [], lastUpdated: '' },
    weightRecords: [],
    feedConsumption: [],
    feedData: null,
    sales: [],
    lastUpdated: new Date().toISOString()
  });

  // Listen for database changes
  useEffect(() => {
    if (!currentUser) return;

    const farmRef = doc(db, 'farms', currentUser.uid);
    
    const unsubscribe = onSnapshot(farmRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const farmData = docSnapshot.data();
        const poultryData = farmData.poultry || {};
        
        const formattedData: PoultryFarmData = {
          stock: {
            currentBirds: poultryData.stock?.currentBirds || 0,
            history: [...(poultryData.stock?.history || [])],
            lastUpdated: poultryData.stock?.lastUpdated || new Date().toISOString()
          },
          weightRecords: poultryData.weightRecords || [],
          feedConsumption: poultryData.feedConsumption || [],
          feedData: poultryData.feedData || null,
          sales: poultryData.sales || [],
          lastUpdated: poultryData.lastUpdated
        };

        setData(formattedData);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const updateData = async (newData: Partial<PoultryFarmData>) => {
    if (!currentUser) return;

    try {
      const farmRef = doc(db, 'farms', currentUser.uid);

      console.log('Starting update with:', {
        newData,
        currentData: data
      });

      // Create an update object with all possible fields
      const updateObject = {
        'poultry.stock': newData.stock || data.stock,
        'poultry.weightRecords': newData.weightRecords || data.weightRecords,
        'poultry.feedConsumption': newData.feedConsumption || data.feedConsumption,
        'poultry.feedData': newData.feedData,
        'poultry.sales': newData.sales || [],
        'poultry.lastUpdated': new Date().toISOString()
      };

      console.log('Updating Firestore with:', updateObject);

      // Update Firestore
      await updateDoc(farmRef, updateObject);

      // Update local state with all the new data
      setData(prev => {
        const newState = {
          ...prev,
          ...newData,
          lastUpdated: new Date().toISOString()
        };
        console.log('New state:', newState);
        return newState;
      });

    } catch (error) {
      console.error('Error updating poultry farm data:', error);
      throw error;
    }
  };

  return { data, updateData };
}