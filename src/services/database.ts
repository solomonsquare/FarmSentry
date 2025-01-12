import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FarmCategory, Sale } from '../types';

export class DatabaseService {
  static async getFarmData(userId: string, category: FarmCategory) {
    try {
      const farmRef = doc(db, 'farms', userId);
      const docSnap = await getDoc(farmRef);
      
      if (!docSnap.exists()) {
        // Initialize with empty data structure if no data exists
        const initialData = {
          [category]: {
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
            stats: {
              totalSold: 0,
              totalRevenue: 0,
              totalProfit: 0,
              lastSaleDate: null
            },
            lastUpdated: new Date().toISOString()
          }
        };
        await setDoc(farmRef, initialData);
        return initialData[category];
      }

      return docSnap.data()[category] || null;
    } catch (error) {
      console.error('Error getting farm data:', error);
      throw error;
    }
  }

  static async updateFarmData(userId: string, category: FarmCategory, data: any) {
    const farmRef = doc(db, 'farms', userId);

    try {
      // If there are sales, update the stats
      if (data.sales) {
        const totalSold = data.sales.reduce((sum: number, sale: Sale) => sum + sale.quantity, 0);
        const totalRevenue = data.sales.reduce((sum: number, sale: Sale) => 
          sum + (sale.quantity * sale.pricePerBird), 0
        );
        const totalProfit = data.sales.reduce((sum: number, sale: Sale) => sum + sale.totalProfit, 0);

        // Include stats in the update
        data.stats = {
          totalSold,
          totalRevenue,
          totalProfit,
          lastSaleDate: new Date().toISOString()
        };
      }

      // Clean the data by removing undefined values
      const cleanData = JSON.parse(JSON.stringify({
        [category]: {
          ...data,
          lastUpdated: new Date().toISOString()
        }
      }));

      await updateDoc(farmRef, cleanData);
      return true;
    } catch (error) {
      console.error('Error updating farm data:', error);
      throw error;
    }
  }
}