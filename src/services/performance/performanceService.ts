import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { PerformanceMetric, FarmCategory } from '../../types';

export async function savePerformanceMetric(userId: string, metric: PerformanceMetric) {
  try {
    const farmRef = doc(db, 'farms', userId);
    const docSnap = await getDoc(farmRef);
    const currentData = docSnap.data();
    const currentMetrics = currentData?.[metric.category]?.performanceMetrics || [];
    
    const updatedMetrics = [...currentMetrics, metric];
    
    await updateDoc(farmRef, {
      [`${metric.category}.performanceMetrics`]: updatedMetrics,
      [`${metric.category}.lastUpdated`]: new Date().toISOString()
    });

    return updatedMetrics;
  } catch (error) {
    console.error('Error saving performance metric:', error);
    throw error;
  }
}

export async function getPerformanceMetrics(
  userId: string, 
  category: FarmCategory,
  page: number = 1,
  pageSize: number = 5
) {
  try {
    const farmRef = doc(db, 'farms', userId);
    const docSnap = await getDoc(farmRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const metrics = data[category]?.performanceMetrics || [];
      
      // Sort by date descending
      const sortedMetrics = metrics.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Calculate pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedMetrics = sortedMetrics.slice(startIndex, endIndex);
      
      return {
        metrics: paginatedMetrics,
        totalPages: Math.ceil(metrics.length / pageSize),
        currentPage: page
      };
    }
    
    return {
      metrics: [],
      totalPages: 0,
      currentPage: 1
    };
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
} 