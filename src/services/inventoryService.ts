import { db } from '../config/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { Stock, Expense, FarmCategory } from '../types';
import { formatDateTime } from '../utils/date';

export class InventoryService {
  static async updateStock(
    userId: string,
    category: FarmCategory,
    stock: Stock,
    expenses?: Expense
  ) {
    const farmRef = doc(db, 'farms', userId);

    try {
      await runTransaction(db, async (transaction) => {
        const farmDoc = await transaction.get(farmRef);
        if (!farmDoc.exists()) {
          throw new Error('Farm data not found');
        }

        const farmData = farmDoc.data();
        const currentExpenses = farmData[category].expenses;

        const updates: any = {
          [`${category}.stock`]: stock,
          [`${category}.lastUpdated`]: formatDateTime().date
        };

        if (expenses) {
          updates[`${category}.expenses`] = {
            birds: currentExpenses.birds + expenses.birds,
            medicine: currentExpenses.medicine + expenses.medicine,
            feeds: currentExpenses.feeds + expenses.feeds,
            additionals: currentExpenses.additionals + expenses.additionals,
          };
        }

        transaction.update(farmRef, updates);
      });

      console.log('Stock updated successfully');
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  static async validateStock(stock: Stock): Promise<boolean> {
    // Add validation logic
    if (stock.currentBirds < 0) return false;
    if (!stock.lastUpdated) return false;
    if (!Array.isArray(stock.history)) return false;
    
    return true;
  }
}