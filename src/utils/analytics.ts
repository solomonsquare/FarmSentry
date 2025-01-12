import { WeightRecord } from '../types/poultry';

export const calculateADG = (weightRecords: WeightRecord[]): number => {
  if (weightRecords.length < 2) return 0;

  const sortedRecords = [...weightRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstRecord = sortedRecords[0];
  const lastRecord = sortedRecords[sortedRecords.length - 1];
  const daysDiff = (new Date(lastRecord.date).getTime() - new Date(firstRecord.date).getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff === 0) return 0;

  const weightDiff = lastRecord.weights.average - firstRecord.weights.average;
  return weightDiff / daysDiff;
};

export const calculateFCR = (
  feedData: { dailyConsumption: number },
  weightRecords: WeightRecord[],
  currentFlockSize: number
): number => {
  if (!feedData.dailyConsumption || !currentFlockSize || weightRecords.length < 2) return 0;

  const totalFeedConsumption = feedData.dailyConsumption * currentFlockSize;
  const latestWeight = weightRecords[weightRecords.length - 1].weights.average;
  const initialWeight = weightRecords[0].weights.average;
  const weightGain = latestWeight - initialWeight;

  return weightGain > 0 ? totalFeedConsumption / weightGain : 0;
};

export const calculateFeedCostPerKg = (
  feedData: { dailyConsumption: number; feedCost: number }
): number => {
  if (!feedData.dailyConsumption || !feedData.feedCost) return 0;
  return feedData.feedCost / feedData.dailyConsumption;
};

export const calculateProfitMargin = (
  economicData: { costPerBird: number; revenuePerBird: number },
  feedData: { feedCost: number }
): number => {
  const totalCost = economicData.costPerBird + feedData.feedCost;
  return economicData.revenuePerBird - totalCost;
};

export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const calculateMortalityRate = (totalDeaths: number, maxSampleSize: number): number => {
  return maxSampleSize > 0 ? Number(((totalDeaths / maxSampleSize) * 100).toFixed(1)) : 0;
};

export const determineFeedPhase = (daysToMarket: number): 'starter' | 'grower' | 'finisher' => {
  // Standard broiler growth phases based on remaining days to market:
  // Finisher: 0-14 days left (close to market weight)
  // Grower: 15-28 days left (mid-growth phase)
  // Starter: 29+ days left (early growth phase)
  
  console.log('Determining feed phase for days to market:', daysToMarket);
  
  let phase: 'starter' | 'grower' | 'finisher';
  
  if (daysToMarket >= 29) {
    phase = 'starter';  // Early in growth cycle, lots of days remaining
  } else if (daysToMarket >= 15) {
    phase = 'grower';   // Mid-cycle
  } else {
    phase = 'finisher'; // Close to market weight
  }
  
  console.log('Feed phase determined:', {
    daysToMarket,
    phase,
    conditions: {
      isStarter: daysToMarket >= 29,    // More than 4 weeks left
      isGrower: daysToMarket >= 15,     // 2-4 weeks left
      isFinisher: daysToMarket < 15     // Less than 2 weeks left
    }
  });
  
  return phase;
}; 