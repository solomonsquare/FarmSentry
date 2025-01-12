import { db } from '../../config/firebase';
import { 
  doc, 
  collection, 
  writeBatch, 
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  addDoc
} from 'firebase/firestore';
import { FarmCategory, Sale, Stock } from '../../types';
import { COLLECTIONS } from './collections';
import { cleanObject } from '../../utils/data';

export async function initializeDatabase(userId: string, category: FarmCategory) {
  const batch = writeBatch(db);

  try {
    // Create user document
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    batch.set(userRef, {
      id: userId,
      onboardingComplete: true,
      currentFarmType: category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Create farm document
    const farmRef = doc(collection(db, COLLECTIONS.FARMS));
    batch.set(farmRef, {
      id: farmRef.id,
      userId,
      category,
      stock: {
        currentQuantity: 0,
        history: [],
        lastUpdated: serverTimestamp()
      },
      expenses: {
        animals: 0,
        medicine: 0,
        feeds: 0,
        additionals: 0
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await batch.commit();
    return { farmId: farmRef.id };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

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

    // Update farm stock
    const farmQuery = query(
      collection(db, COLLECTIONS.FARMS),
      where('userId', '==', userId)
    );
    const farmDocs = await getDocs(farmQuery);
    
    if (!farmDocs.empty) {
      const farmDoc = farmDocs.docs[0];
      batch.update(farmDoc.ref, {
        'stock.currentQuantity': updatedStock.currentBirds,
        'stock.history': updatedStock.history,
        'stock.lastUpdated': serverTimestamp()
      });
    }

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