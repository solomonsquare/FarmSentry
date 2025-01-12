import React, { useEffect, useState, useContext } from 'react';
import { getFarmDoc, initializePigFarm, updateFarmData } from '../services/farmService';
import { PigFarmData } from '../types/pig';
import { useAuth } from './AuthContext';

interface FarmContextType {
  farmData: PigFarmData;
  updateFarm: (data: Partial<PigFarmData>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const defaultFarmData: PigFarmData = {
  weightRecords: [],
  feedConversion: [],
  breedingCycles: [],
  geneticRecords: [],
  environmentalMetrics: [],
  lastUpdated: new Date().toISOString()
};

const FarmContext = React.createContext<FarmContextType>({
  farmData: defaultFarmData,
  updateFarm: async () => {},
  loading: true,
  error: null
});

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [farmData, setFarmData] = useState<PigFarmData>(defaultFarmData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('FarmProvider rendering with user:', currentUser?.uid);

  useEffect(() => {
    if (currentUser?.uid) {
      console.log('Loading farm data for user:', currentUser.uid);
      loadFarmData();
    }
  }, [currentUser]);

  const loadFarmData = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setLoading(true);
      console.log('Fetching farm doc for user:', currentUser.uid);
      const farmDoc = await getFarmDoc(currentUser.uid);
      
      if (farmDoc.exists()) {
        console.log('Farm doc exists:', farmDoc.data());
        const data = farmDoc.data() as PigFarmData;
        if (!data.breedingCycles) {
          console.log('Initializing breeding cycles array');
          data.breedingCycles = [];
          await updateFarmData(currentUser.uid, data);
        }
        setFarmData(data);
      } else {
        console.log('Creating new farm for user:', currentUser.uid);
        const newFarm = await initializePigFarm(currentUser.uid);
        setFarmData(newFarm);
      }
    } catch (err) {
      console.error('Error loading farm data:', err);
      setError('Failed to load farm data');
    } finally {
      setLoading(false);
    }
  };

  const updateFarm = async (data: Partial<PigFarmData>) => {
    if (!currentUser?.uid) return;
    
    try {
      await updateFarmData(currentUser.uid, data);
      setFarmData(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.error('Error updating farm:', err);
      setError('Failed to update farm data');
    }
  };

  return (
    <FarmContext.Provider value={{ farmData, updateFarm, loading, error }}>
      {children}
    </FarmContext.Provider>
  );
};

export function useFarm() {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
} 