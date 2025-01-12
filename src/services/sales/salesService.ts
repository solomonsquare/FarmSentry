import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  orderBy,
  runTransaction,
  serverTimestamp,
  writeBatch,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Sale, Stock, FarmCategory } from '../../types';
import { cleanObject } from '../../utils/data';
import { validateSale } from './salesValidation';

export class SalesService {
  static async processSale(
    userId: string, 
    category: FarmCategory,
    sale: Sale,
    updatedStock: Stock
  ): Promise<boolean> {
    try {
      // Validate sale data
      validateSale(sale, updatedStock);

      await runTransaction(db, async (transaction) => {
        // Add sale record
        const salesCollection = collection(db, 'sales');
        const saleData = {
          ...cleanObject(sale),
          userId,
          category,
          createdAt: serverTimestamp()
        };
        
        await addDoc(salesCollection, saleData);

        // Update farm stock
        const farmRef = doc(db, 'farms', userId);
        transaction.update(farmRef, {
          [`${category}.stock`]: cleanObject(updatedStock),
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
      const salesCollection = collection(db, 'sales');
      const q = query(
        salesCollection,
        where('userId', '==', userId),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Sale[];
    } catch (error) {
      console.error('Error fetching sales history:', error);
      throw error;
    }
  }

  static async deleteAllSales(userId: string, category: FarmCategory) {
    try {
      // Clear sales from the sales collection
      const salesRef = collection(db, 'sales');
      const q = query(
        salesRef,
        where('userId', '==', userId),
        where('category', '==', category)
      );
      
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      
      return true;
    } catch (error) {
      console.error('Error deleting sales:', error);
      throw error;
    }
  }
}