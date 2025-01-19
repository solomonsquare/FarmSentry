import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Stock, StockEntry, FarmCategory } from '../types';

export class StockService {
  static async getStock(userId: string, category: FarmCategory): Promise<Stock | null> {
    try {
      const farmRef = doc(db, 'farms', userId);
      const farmDoc = await getDoc(farmRef);
      
      if (!farmDoc.exists()) {
        return null;
      }
      
      const farmData = farmDoc.data();
      return farmData[category]?.stock || null;
    } catch (error) {
      console.error('Error fetching stock:', error);
      throw error;
    }
  }

  static async getStockHistory(userId: string, category: FarmCategory): Promise<StockEntry[]> {
    try {
      const farmRef = doc(db, 'farms', userId);
      const farmDoc = await getDoc(farmRef);
      
      if (!farmDoc.exists()) {
        return [];
      }
      
      const farmData = farmDoc.data();
      return farmData[category]?.stock?.history || [];
    } catch (error) {
      console.error('Error fetching stock history:', error);
      throw error;
    }
  }

  static async updateStock(userId: string, category: FarmCategory, stock: Stock): Promise<void> {
    try {
      const farmRef = doc(db, 'farms', userId);
      await updateDoc(farmRef, {
        [`${category}.stock`]: stock,
        [`${category}.lastUpdated`]: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
} 