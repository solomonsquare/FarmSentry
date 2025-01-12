import { db } from '../config';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  serverTimestamp,
  writeBatch,
  doc 
} from 'firebase/firestore';
import { Sale, Stock, FarmCategory } from '../../../types';
import { COLLECTIONS } from '../collections';
import { cleanObject } from '../../../utils/data';

export async function createSale(
  userId: string,
  category: FarmCategory,
  sale: Omit<Sale, 'id'>,
  updatedStock: Stock
): Promise<Sale> {
  const batch = writeBatch(db);

  try {
    // Create sale document
    const salesRef = collection(db, COLLECTIONS.SALES);
    const saleData = {
      ...cleanObject(sale),
      userId,
      category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const saleDoc = await addDoc(salesRef, saleData);

    // Update stock
    const stockRef = doc(db, COLLECTIONS.STOCK, userId);
    batch.update(stockRef, {
      currentQuantity: updatedStock.currentBirds,
      history: updatedStock.history,
      lastUpdated: serverTimestamp()
    });

    await batch.commit();
    return { id: saleDoc.id, ...sale };
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
}

export async function getSales(userId: string, category: FarmCategory): Promise<Sale[]> {
  try {
    const salesRef = collection(db, COLLECTIONS.SALES);
    const q = query(
      salesRef,
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
    console.error('Error fetching sales:', error);
    throw error;
  }
}