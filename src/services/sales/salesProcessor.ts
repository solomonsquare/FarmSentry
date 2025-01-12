import { db } from '../../config/firebase';
import { doc, runTransaction, serverTimestamp, collection, FirestoreError } from 'firebase/firestore';
import { Sale, Stock, FarmCategory } from '../../types';
import { cleanObject } from '../../utils/data';

export async function processSaleTransaction(
  userId: string,
  category: FarmCategory,
  sale: Sale,
  updatedStock: Stock
): Promise<void> {
  try {
    const farmRef = doc(db, 'farms', userId);
    const salesRef = collection(db, 'sales');

    await runTransaction(db, async (transaction) => {
      const farmDoc = await transaction.get(farmRef);
      if (!farmDoc.exists()) {
        throw new Error('Farm document not found');
      }

      const farmData = farmDoc.data();
      const currentStats = farmData[category]?.stats || {
        totalSold: 0,
        totalRevenue: 0,
        totalProfit: 0,
        lastSaleDate: null
      };

      const saleRevenue = sale.quantity * sale.pricePerBird;
      const newStats = {
        totalSold: currentStats.totalSold + sale.quantity,
        totalRevenue: currentStats.totalRevenue + saleRevenue,
        totalProfit: currentStats.totalProfit + sale.totalProfit,
        lastSaleDate: sale.date
      };

      const saleDoc = doc(salesRef);
      const saleData = {
        ...cleanObject(sale),
        id: saleDoc.id,
        userId,
        category,
        createdAt: serverTimestamp()
      };

      // Batch both operations in a single transaction
      transaction.set(saleDoc, saleData);
      transaction.update(farmRef, {
        [`${category}.stock`]: cleanObject(updatedStock),
        [`${category}.stats`]: newStats,
        [`${category}.lastUpdated`]: serverTimestamp()
      });
    }, { maxAttempts: 1 });

  } catch (error) {
    console.error('Error processing sale:', error);
    if (error instanceof FirestoreError && error.code === 'resource-exhausted') {
      throw new Error('Service temporarily unavailable. Please try again in a moment.');
    }
    throw error;
  }
}