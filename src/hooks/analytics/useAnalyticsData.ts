import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FarmCategory, StockEntry } from '../../types';
import { WeightRecord } from '../../types/poultry';
import { AnalyticsData } from '../../types/analytics';
import { 
  calculateADG, 
  calculateFCR, 
  calculateFeedCostPerKg, 
  calculateProfitMargin,
  calculateMortalityRate,
  determineFeedPhase
} from '../../utils/analytics';

interface AnalyticsHookReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  updateWeightRecord: (record: WeightRecord) => Promise<void>;
  updateFeedData: (data: {
    dailyConsumption: number;
    feedCost: number;
    daysToMarket: number;
  }) => Promise<void>;
  updateStockData: (data: {
    currentFlockSize: number;
    totalDeaths: number;
    maxSampleSize: number;
  }) => Promise<void>;
}

export function useAnalyticsData(category: FarmCategory): AnalyticsHookReturn {
  const { currentUser } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const farmRef = doc(db, 'farms', currentUser.uid);
    
    const unsubscribe = onSnapshot(
      farmRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const categoryData = data[category] || {};
          const stock = categoryData.stock || { currentBirds: 0, history: [] };
          
          // Calculate base metrics
          const currentFlockSize = stock.currentBirds || 0;
          const history = stock.history || [];
          
          // Calculate total deaths
          const totalDeaths = history.reduce((count: number, entry: StockEntry) => 
            entry.type === 'death' ? count + entry.quantity : count, 0);

          // Calculate max sample size (total animals ever in the system)
          const maxSampleSize = history.reduce((total: number, entry: StockEntry) => {
            if (entry.type === 'initial' || entry.type === 'addition') {
              return total + entry.quantity;
            }
            return total;
          }, 0);

          // Calculate mortality rate
          const mortalityRate = calculateMortalityRate(totalDeaths, maxSampleSize);

          // Base analytics data
          const analyticsData: AnalyticsData = {
            currentFlockSize,
            maxSampleSize,
            mortalityRate,
            totalDeaths,
            weightRecords: categoryData.weightRecords || [],
            ...(category === 'birds' ? {
              birds: {
                eggProduction: categoryData.eggProduction?.total || 0,
                feedConversionRatio: calculateFeedConversionRatio(categoryData),
                dailyFeedConsumption: categoryData.feedConsumption?.daily || 0,
                feedCost: categoryData.feedConsumption?.cost || 0,
                daysToMarket: categoryData.daysToMarket || 0,
                costPerBird: categoryData.economics?.costPerBird || 0,
                revenuePerBird: categoryData.economics?.revenuePerBird || 0,
                feedRecords: categoryData.feedRecords || [],
                performanceMetrics: categoryData.performanceMetrics || []
              }
            } : {
              pigs: {
                litterSize: categoryData.breeding?.averageLitterSize || 0,
                weaningRate: calculateWeaningRate(categoryData),
                breedingEfficiency: calculateBreedingEfficiency(categoryData)
              }
            })
          };

          setData(analyticsData);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, category]);

  const updateWeightRecord = async (record: WeightRecord) => {
    if (!currentUser || !data || !data.birds) return;
    
    try {
      const farmRef = doc(db, 'farms', currentUser.uid);
      const updateData: any = {
        [`${category}.weightRecords`]: arrayUnion(record)
      };

      // Generate and add new performance metric
      const newMetric = generatePerformanceMetric(
        [...data.weightRecords, record],
        {
          dailyConsumption: data.birds.dailyFeedConsumption ?? 0,
          feedCost: data.birds.feedCost ?? 0
        },
        data.currentFlockSize,
        data.totalDeaths,
        data.maxSampleSize,
        {
          costPerBird: data.birds.costPerBird ?? 0,
          revenuePerBird: data.birds.revenuePerBird ?? 0
        }
      );
      updateData[`${category}.performanceMetrics`] = arrayUnion(newMetric);

      await updateDoc(farmRef, updateData);
    } catch (err) {
      console.error('Error updating weight record:', err);
      setError('Failed to update weight record');
    }
  };

  const updateFeedData = async (feedData: {
    dailyConsumption: number;
    feedCost: number;
    daysToMarket: number;
  }) => {
    if (!currentUser || !data || !data.birds) return;
    
    try {
      const farmRef = doc(db, 'farms', currentUser.uid);
      
      // Add debug logging
      console.log('Feed data received:', feedData);
      
      // Determine feed phase based on days to market
      const feedPhase = determineFeedPhase(feedData.daysToMarket);
      
      // Add debug logging
      console.log('Determined feed phase:', {
        daysToMarket: feedData.daysToMarket,
        feedPhase,
        calculation: {
          isFinisher: feedData.daysToMarket >= 29,
          isGrower: feedData.daysToMarket >= 15,
          isStarter: feedData.daysToMarket < 15
        }
      });
      
      // Create new feed record with determined phase
      const newFeedRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        feedType: feedPhase,
        quantity: feedData.dailyConsumption,
        cost: feedData.feedCost,
        notes: `${feedPhase.charAt(0).toUpperCase() + feedPhase.slice(1)} phase - ${feedData.daysToMarket} days to market`
      };

      // Update feed consumption data
      const updateData: any = {
        [`${category}.feedConsumption`]: {
          daily: feedData.dailyConsumption,
          cost: feedData.feedCost
        },
        [`${category}.daysToMarket`]: feedData.daysToMarket
      };

      // Only add the feed record if it doesn't exist
      const existingRecords = data.birds.feedRecords || [];
      const recordExists = existingRecords.some(
        record => record.date === newFeedRecord.date
      );

      if (!recordExists) {
        updateData[`${category}.feedRecords`] = arrayUnion(newFeedRecord);
      }

      // Generate and add new performance metric with current mortality data
      const newMetric = generatePerformanceMetric(
        data.weightRecords,
        feedData,
        data.currentFlockSize,
        data.totalDeaths,
        data.maxSampleSize,
        {
          costPerBird: data.birds.costPerBird ?? 0,
          revenuePerBird: data.birds.revenuePerBird ?? 0
        }
      );

      // Only add the performance metric if it doesn't exist
      const existingMetrics = data.birds.performanceMetrics || [];
      const metricExists = existingMetrics.some(
        metric => metric.date === newMetric.date
      );

      if (!metricExists) {
        updateData[`${category}.performanceMetrics`] = arrayUnion(newMetric);
      }

      await updateDoc(farmRef, updateData);
    } catch (err) {
      console.error('Error updating feed data:', err);
      setError('Failed to update feed data');
    }
  };

  const updateStockData = async (stockData: {
    currentFlockSize: number;
    totalDeaths: number;
    maxSampleSize: number;
  }) => {
    if (!currentUser || !data || !data.birds) return;
    
    try {
      const farmRef = doc(db, 'farms', currentUser.uid);
      
      // Calculate the new mortality rate
      const newMortalityRate = calculateMortalityRate(stockData.totalDeaths, stockData.maxSampleSize);
      
      const updateData: any = {
        // Update stock data
        [`${category}.stock.currentBirds`]: stockData.currentFlockSize,
        // Update total deaths in both places to ensure consistency
        [`${category}.stock.totalDeaths`]: stockData.totalDeaths,
        [`${category}.totalDeaths`]: stockData.totalDeaths,
        // Update max sample size in both places
        [`${category}.stock.maxSampleSize`]: stockData.maxSampleSize,
        [`${category}.maxSampleSize`]: stockData.maxSampleSize,
        // Update mortality rate in both places
        [`${category}.stock.mortalityRate`]: newMortalityRate,
        [`${category}.mortalityRate`]: newMortalityRate
      };

      // Generate and add new performance metric with updated mortality data
      const newMetric = generatePerformanceMetric(
        data.weightRecords,
        {
          dailyConsumption: data.birds.dailyFeedConsumption ?? 0,
          feedCost: data.birds.feedCost ?? 0
        },
        stockData.currentFlockSize,
        stockData.totalDeaths,
        stockData.maxSampleSize,
        {
          costPerBird: data.birds.costPerBird ?? 0,
          revenuePerBird: data.birds.revenuePerBird ?? 0
        }
      );

      // Add the new performance metric
      updateData[`${category}.performanceMetrics`] = arrayUnion(newMetric);

      await updateDoc(farmRef, updateData);
    } catch (err) {
      console.error('Error updating stock data:', err);
      setError('Failed to update stock data');
    }
  };

  return { 
    data, 
    loading, 
    error, 
    updateWeightRecord,
    updateFeedData,
    updateStockData
  };
}

// Helper functions for calculations
function calculateFeedConversionRatio(data: any): number {
  // Calculate average FCR from all performance metrics
  if (data.performanceMetrics && data.performanceMetrics.length > 0) {
    const validMetrics = data.performanceMetrics.filter(
      (metric: any) => metric.fcr && !isNaN(metric.fcr)
    );
    
    if (validMetrics.length > 0) {
      const totalFCR = validMetrics.reduce(
        (sum: number, metric: any) => sum + metric.fcr,
        0
      );
      return totalFCR / validMetrics.length;
    }
  }
  
  // Fallback to calculating from total feed and weight if no performance metrics
  const totalFeed = data.feedConsumption?.total || 0;
  const totalWeight = data.weightRecords?.total || 0;
  return totalWeight > 0 ? totalFeed / totalWeight : 0;
}

function calculateWeaningRate(data: any): number {
  const weanedPiglets = data.breeding?.weanedPiglets || 0;
  const totalBorn = data.breeding?.totalBorn || 0;
  return totalBorn > 0 ? (weanedPiglets / totalBorn) * 100 : 0;
}

function calculateBreedingEfficiency(data: any): number {
  const successfulBreedings = data.breeding?.successful || 0;
  const totalBreedings = data.breeding?.total || 0;
  return totalBreedings > 0 ? (successfulBreedings / totalBreedings) * 100 : 0;
}

// Add this function to generate performance metrics
const generatePerformanceMetric = (
  weightRecords: WeightRecord[],
  feedData: { dailyConsumption: number; feedCost: number },
  currentFlockSize: number,
  totalDeaths: number,
  maxSampleSize: number,
  economicData: { costPerBird: number; revenuePerBird: number }
) => {
  // Calculate total feed consumed
  const totalFeedConsumed = feedData.dailyConsumption * currentFlockSize;
  
  // Get the latest weight record for FCR calculation
  const latestWeight = weightRecords.length > 0 
    ? weightRecords[weightRecords.length - 1].weights.average 
    : 0;
  
  // Calculate FCR as total feed consumed divided by current weight
  const fcr = latestWeight > 0 ? totalFeedConsumed / latestWeight : 0;
  
  const adg = calculateADG(weightRecords);
  const mortality = calculateMortalityRate(totalDeaths, maxSampleSize);
  const feedCostPerKg = calculateFeedCostPerKg(feedData);
  const profitMargin = calculateProfitMargin(economicData, feedData);

  return {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    adg,
    fcr,
    mortality,
    feedCostPerKg,
    profitMargin
  };
}; 