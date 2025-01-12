import { db } from '../../../config/firebase';
import { 
  collection, 
  getDocs, 
  writeBatch, 
  serverTimestamp,
  doc 
} from 'firebase/firestore';
import { COLLECTIONS } from './collections';

export async function migrateToNewSchema() {
  const batch = writeBatch(db);
  
  try {
    // Get all farms
    const farmsRef = collection(db, COLLECTIONS.FARMS);
    const farmSnapshot = await getDocs(farmsRef);
    
    for (const farmDoc of farmSnapshot.docs) {
      const farmData = farmDoc.data();
      const userId = farmDoc.id;
      
      // Process birds and pigs categories
      ['birds', 'pigs'].forEach(category => {
        const sales = farmData[category]?.sales || [];
        
        // Move each sale to the sales collection
        sales.forEach(sale => {
          const saleRef = doc(collection(db, COLLECTIONS.SALES));
          batch.set(saleRef, {
            ...sale,
            id: saleRef.id,
            userId,
            category,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
        
        // Clear sales from farm document
        batch.update(farmDoc.ref, {
          [`${category}.sales`]: [],
          [`${category}.lastUpdated`]: serverTimestamp()
        });
      });
    }
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}