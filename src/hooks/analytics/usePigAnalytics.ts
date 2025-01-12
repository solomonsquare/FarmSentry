import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface BreedingCycle {
  id: string;
  startDate: string;
  expectedDueDate: string;
  status: 'active' | 'completed';
  notes?: string;
}

interface PigBreedingData {
  totalBreedings: number;
  successfulBreedings: number;
  averageLitterSize: number;
  weaningRate: number;
  averageWeaningAge: number;
  averageBreedingInterval: number;
  successfulFarrowings: number;
  averageLiveBorn: number;
  preWeaningMortality: number;
  feedConversionRatio?: number;
  totalFeedConsumed?: number;
  totalWeightGain?: number;
  activeBreedingCycles?: BreedingCycle[];
}

export function usePigAnalytics() {
  const { currentUser } = useAuth();
  const [data, setData] = useState<PigBreedingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(
      doc(db, 'farms', currentUser.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const farmData = docSnapshot.data();
          const pigData = farmData.pigs?.breeding || {};
          
          setData({
            ...pigData,
            totalBreedings: pigData.totalBreedings || 0,
            successfulBreedings: pigData.successfulBreedings || 0,
            averageLitterSize: pigData.averageLitterSize || 0,
            weaningRate: pigData.weaningRate || 0,
            averageWeaningAge: pigData.averageWeaningAge || 0,
            averageBreedingInterval: pigData.averageBreedingInterval || 0,
            successfulFarrowings: pigData.successfulFarrowings || 0,
            averageLiveBorn: pigData.averageLiveBorn || 0,
            preWeaningMortality: pigData.preWeaningMortality || 0,
            feedConversionRatio: pigData.feedConversionRatio || 0,
            totalFeedConsumed: pigData.totalFeedConsumed || 0,
            totalWeightGain: pigData.totalWeightGain || 0,
            activeBreedingCycles: pigData.activeBreedingCycles || []
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching pig analytics:', err);
        setError('Failed to load pig analytics data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addBreedingCycle = async (cycleData: Omit<BreedingCycle, 'id'>) => {
    if (!currentUser) return;

    try {
      const newCycle: BreedingCycle = {
        id: Date.now().toString(),
        ...cycleData
      };

      const farmRef = doc(db, 'farms', currentUser.uid);
      await updateDoc(farmRef, {
        'pigs.breeding.activeBreedingCycles': arrayUnion(newCycle)
      });

      // Update local state
      setData(prev => prev ? {
        ...prev,
        activeBreedingCycles: [...(prev.activeBreedingCycles || []), newCycle]
      } : null);

    } catch (err) {
      console.error('Error adding breeding cycle:', err);
      setError('Failed to add breeding cycle');
      throw err;
    }
  };

  const updateFCR = async (feedAmount: number, weightGain: number) => {
    if (!currentUser) return;

    try {
      const newTotalFeed = (data?.totalFeedConsumed || 0) + feedAmount;
      const newTotalGain = (data?.totalWeightGain || 0) + weightGain;
      const newFCR = newTotalGain > 0 ? newTotalFeed / newTotalGain : 0;

      const farmRef = doc(db, 'farms', currentUser.uid);
      await updateDoc(farmRef, {
        'pigs.breeding.feedConversionRatio': newFCR,
        'pigs.breeding.totalFeedConsumed': newTotalFeed,
        'pigs.breeding.totalWeightGain': newTotalGain,
        'pigs.breeding.lastUpdated': new Date().toISOString()
      });

      // Update local state
      setData(prev => prev ? {
        ...prev,
        feedConversionRatio: newFCR,
        totalFeedConsumed: newTotalFeed,
        totalWeightGain: newTotalGain
      } : null);

    } catch (err) {
      console.error('Error updating FCR:', err);
      setError('Failed to update FCR');
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    updateFCR,
    addBreedingCycle
  };
} 