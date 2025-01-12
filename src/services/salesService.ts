import { db } from '../config/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { Stock, Sale, FarmCategory } from '../types';

export class SalesService {
  static async processSale(
    userId: string, 
    category: FarmCategory,
    sale: Sale,
    updatedStock: Stock
  ) {
    const farmRef = doc(db, 'farms', userId);

    try {
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(farmRef);
        if (!docSnap.exists()) {
          throw new Error('Farm data not found');
        }

        const currentData = docSnap.data();
        const currentSales = currentData[category]?.sales || [];

        // Clean data before saving
        const cleanStock = JSON.parse(JSON.stringify(updatedStock));
        const cleanSale = JSON.parse(JSON.stringify(sale));

        transaction.update(farmRef, {
          [`${category}.sales`]: [...currentSales, cleanSale],
          [`${category}.stock`]: cleanStock,
          [`${category}.lastUpdated`]: new Date().toISOString()
        });
      });

      return true;
    } catch (error) {
      console.error('Error processing sale:', error);
      throw error;
    }
  }

  static async getSalesHistory(userId: string, category: FarmCategory): Promise<Sale[]> {
    try {
      const farmRef = doc(db, 'farms', userId);
      const docSnap = await doc(farmRef).get();
      
      if (!docSnap.exists()) {
        return [];
      }

      const farmData = docSnap.data();
      return farmData[category]?.sales || [];
    } catch (error) {
      console.error('Error fetching sales history:', error);
      throw error;
    }
  }
}