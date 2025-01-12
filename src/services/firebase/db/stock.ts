import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Stock } from '../../../types';
import { COLLECTIONS } from '../schema/collections';
import { cleanObject } from '../../../utils/data';

export async function getStock(farmId: string): Promise<Stock | null> {
  try {
    const stockRef = doc(db, COLLECTIONS.STOCK, farmId);
    const stockDoc = await getDoc(stockRef);
    
    if (!stockDoc.exists()) {
      return null;
    }
    
    return stockDoc.data() as Stock;
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
}

export async function updateStock(
  farmId: string,
  stock: Stock
): Promise<boolean> {
  try {
    const stockRef = doc(db, COLLECTIONS.STOCK, farmId);
    await updateDoc(stockRef, {
      ...cleanObject(stock),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
}