import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { COLLECTIONS } from './schema';

export async function migrateSalesToNewCollection() {
  try {
    const farmsRef = collection(db, COLLECTIONS.FARMS);
    const farmDocs = await getDocs(farmsRef);
    
    for (const farmDoc of farmDocs.docs) {
      const farmData = farmDoc.data();
      const userId = farmDoc.id;
      const batch = writeBatch(db);
      
      // Process each category
      for (const category of ['birds', 'pigs']) {
        const sales = farmData[category]?.sales || [];
        
        // Move sales to new collection
        for (const sale of sales) {
          const salesRef = collection(db, COLLECTIONS.SALES);
          const saleDoc = doc(salesRef);
          
          const saleData = {
            ...sale,
            id: saleDoc.id,
            userId,
            category,
            createdAt: serverTimestamp()
          };
          
          batch.set(saleDoc, saleData);
        }
        
        // Clear sales from farm document
        const farmRef = doc(db, COLLECTIONS.FARMS, userId);
        batch.update(farmRef, {
          [`${category}.sales`]: []
        });
      }
      
      await batch.commit();
    }
    
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}