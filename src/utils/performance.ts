import { WeightRecord, Stock, FarmCategory } from '../types';

export function calculatePerformanceMetrics(
  category: FarmCategory,
  weightRecords: WeightRecord[],
  stock: Stock,
  feedData?: { feedCost: number; dailyConsumption: number },
  breedingData?: {
    litterSize?: number;
    weaningRate?: number;
    pigletSurvivalRate?: number;
  }
) {
  // Sort weight records by date
  const sortedRecords = [...weightRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate daily weight gain
  const dailyWeightGain = calculateDailyWeightGain(sortedRecords);

  // Calculate feed conversion ratio
  const fcr = calculateFCR(sortedRecords, feedData);

  // Calculate mortality rate
  const mortalityRate = calculateMortalityRate(stock);

  // Calculate feed cost per kg
  const feedCostPerKg = feedData ? feedData.feedCost / feedData.dailyConsumption : 0;

  const metrics = {
    feedConversionRatio: fcr,
    dailyWeightGain,
    mortalityRate,
    feedCostPerKg,
  };

  if (category === 'birds') {
    return {
      ...metrics,
      eggProduction: 0, // Add actual calculation if available
      layingRate: 0, // Add actual calculation if available
    };
  }

  if (category === 'pigs' && breedingData) {
    return {
      ...metrics,
      litterSize: breedingData.litterSize || 0,
      weaningRate: breedingData.weaningRate || 0,
      pigletSurvivalRate: breedingData.pigletSurvivalRate || 0,
    };
  }

  return metrics;
}

function calculateDailyWeightGain(weightRecords: WeightRecord[]): number {
  if (weightRecords.length < 2) return 0;

  const firstRecord = weightRecords[0];
  const lastRecord = weightRecords[weightRecords.length - 1];
  const daysDiff = (new Date(lastRecord.date).getTime() - new Date(firstRecord.date).getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff <= 0) return 0;

  const weightGain = lastRecord.averageWeight - firstRecord.averageWeight;
  return weightGain / daysDiff;
}

function calculateFCR(
  weightRecords: WeightRecord[],
  feedData?: { feedCost: number; dailyConsumption: number }
): number {
  if (!feedData || weightRecords.length < 2) return 0;

  const totalFeedConsumed = feedData.dailyConsumption * weightRecords.length;
  const totalWeightGain = weightRecords[weightRecords.length - 1].averageWeight - weightRecords[0].averageWeight;

  return totalWeightGain > 0 ? totalFeedConsumed / totalWeightGain : 0;
}

function calculateMortalityRate(stock: Stock): number {
  const deaths = stock.history.reduce(
    (total, entry) => (entry.type === 'death' ? total + entry.quantity : total),
    0
  );

  const totalBirds = stock.history.reduce(
    (total, entry) => (entry.type === 'initial' || entry.type === 'addition' ? total + entry.quantity : total),
    0
  );

  return totalBirds > 0 ? (deaths / totalBirds) * 100 : 0;
} 