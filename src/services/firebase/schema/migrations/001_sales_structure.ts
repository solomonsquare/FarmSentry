import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs, 
  writeBatch, 
  serverTimestamp,
  doc 
} from 'firebase/firestore';
import { COLLECTIONS } from '../collections';

export async function migrateSalesStructure() {
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
          const newSaleRef = doc(collection(db, COLLECTIONS.SALES));
          batch.set(newSaleRef, {
            ...sale,
            id: newSaleRef.id,
            userId,
            category,
            farmId: farmDoc.id,
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
    console.error('Sales migration failed:', error);
    throw error;
  }
}