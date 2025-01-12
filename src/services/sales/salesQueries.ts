import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FarmCategory } from '../../types';
import { COLLECTIONS } from '../firebase/schema/collections';

export async function getDashboardStats(
  userId: string, 
  category: FarmCategory
): Promise<{ 
  totalSold: number; 
  totalRevenue: number; 
  totalProfit: number;
  lastSaleDate: string | null;
}> {
  try {
    const farmRef = doc(db, COLLECTIONS.FARMS, userId);
    const docSnap = await getDoc(farmRef);
    
    if (!docSnap.exists()) {
      return {
        totalSold: 0,
        totalRevenue: 0,
        totalProfit: 0,
        lastSaleDate: null
      };
    }

    const farmData = docSnap.data();
    const stats = farmData[category]?.stats || {
      totalSold: 0,
      totalRevenue: 0,
      totalProfit: 0,
      lastSaleDate: null
    };

    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}