import { db } from './firebase/config';
import { doc, runTransaction, serverTimestamp, collection } from 'firebase/firestore';
import { Sale, Stock, FarmCategory } from '../types';
import { cleanObject } from '../utils/data';

export async function processSaleTransaction(
  userId: string,
  category: FarmCategory,
  sale: Omit<Sale, 'id' | 'userId' | 'category' | 'createdAt' | 'date' | 'time'>,
  updatedStock: Stock
): Promise<void> {
  const farmRef = doc(db, 'farms', userId);
  const salesRef = collection(db, 'sales');

  try {
    await runTransaction(db, async (transaction) => {
      const farmDoc = await transaction.get(farmRef);
      if (!farmDoc.exists()) {
        throw new Error('Farm document not found');
      }

      // Create the complete sale object with proper number conversions
      const completeSale = cleanObject({
        ...sale,
        userId,
        category,
        quantity: Number(sale.quantity),
        pricePerBird: Number(sale.pricePerBird),
        totalAmount: Number(sale.quantity) * Number(sale.pricePerBird),
        profitPerBird: Number(sale.profitPerBird),
        totalProfit: Number(sale.totalProfit),
        createdAt: serverTimestamp(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false })
      });

      // Add sale to sales collection
      const newSaleRef = doc(salesRef);
      transaction.set(newSaleRef, completeSale);

      // Update farm stock
      transaction.update(farmRef, {
        [`${category}.stock`]: cleanObject(updatedStock),
        [`${category}.lastUpdated`]: serverTimestamp()
      });
    });
  } catch (error) {
    console.error('Error processing sale transaction:', error);
    throw error;
  }
}