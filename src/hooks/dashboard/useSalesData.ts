import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Sale, FarmCategory } from '../../types';

export function useSalesData(category: FarmCategory) {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(
      doc(db, 'farms', currentUser.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setSales(data[category]?.sales || []);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching sales data:', err);
        setError('Failed to load sales data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, category]);

  const addSale = async (saleData: Omit<Sale, 'id' | 'date'>) => {
    if (!currentUser) return;

    try {
      const newSale: Sale = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...saleData
      };

      const farmRef = doc(db, 'farms', currentUser.uid);
      await updateDoc(farmRef, {
        [`${category}.sales`]: arrayUnion(newSale)
      });

      return newSale;
    } catch (err) {
      console.error('Error adding sale:', err);
      setError('Failed to add sale');
      throw err;
    }
  };

  return {
    sales,
    loading,
    error,
    addSale
  };
} 