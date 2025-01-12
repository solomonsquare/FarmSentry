import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { PigFarmData } from '../types/pig';

const usePigFarmData = () => {
  const { currentUser } = useAuth();
  const [farmData, setFarmData] = useState<PigFarmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    // Subscribe to both collections
    const pigFarmsRef = doc(db, 'pigFarms', currentUser.uid);
    const farmsRef = doc(db, 'farms', currentUser.uid);

    const unsubscribePigFarms = onSnapshot(
      pigFarmsRef,
      (pigFarmsSnapshot) => {
        const pigFarmsData = pigFarmsSnapshot.exists() ? pigFarmsSnapshot.data() : {};

        // Subscribe to farms collection for stock data
        const unsubscribeFarms = onSnapshot(
          farmsRef,
          (farmsSnapshot) => {
            const farmsData = farmsSnapshot.exists() ? farmsSnapshot.data() : {};
            const pigData = farmsData.pigs || {};

            // Combine data from both collections
            const data: PigFarmData = {
              // Keep these from pigFarms collection
              breedingCycles: pigFarmsData.breedingCycles || [],
              weightRecords: pigFarmsData.weightRecords || [],
              feedConversion: pigFarmsData.feedConversion || [],
              geneticRecords: pigFarmsData.geneticRecords || [],
              environmentalMetrics: pigFarmsData.environmentalMetrics || [],
              lastUpdated: pigFarmsData.lastUpdated || new Date().toISOString(),
              // Get stock and deaths from farms collection
              stock: {
                quantity: (pigData.stock?.history || []).reduce((total: number, entry: { type: string; quantity: number }) => {
                  if (entry.type === 'initial' || entry.type === 'addition') {
                    return total + entry.quantity;
                  } else if (entry.type === 'death' || entry.type === 'sale') {
                    return total - entry.quantity;
                  }
                  return total;
                }, 0),
                lastUpdated: pigData.lastUpdated || new Date().toISOString()
              },
              deaths: (pigData.stock?.history || []).reduce((count: number, entry: { type: string; quantity: number }) => 
                entry.type === 'death' ? count + entry.quantity : count, 0),
              stockHistory: pigData.stock?.history || []
            };

            console.log('Raw farm data from database:', {
              entireData: data,
              keys: Object.keys(data),
              stockInfo: {
                stock: data.stock,
                stockKeys: Object.keys(data.stock || {}),
                currentStock: data.stock.quantity,
                currentStockKeys: Object.keys(data.stock || {})
              },
              deathInfo: {
                deaths: data.deaths,
                deathsType: typeof data.deaths
              }
            });

            setFarmData(data);
            setLoading(false);
          },
          (err) => {
            console.error('Error fetching farms data:', err);
            setError(err.message);
            setLoading(false);
          }
        );

        return () => unsubscribeFarms();
      },
      (err) => {
        console.error('Error fetching pig farms data:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribePigFarms();
  }, [currentUser]);

  return { farmData, loading, error };
};

export default usePigFarmData;