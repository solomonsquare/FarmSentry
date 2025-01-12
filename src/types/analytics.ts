import { FarmCategory, WeightRecord } from './index';

export interface AnalyticsData {
  currentFlockSize: number;
  maxSampleSize: number;
  mortalityRate: number;
  totalDeaths: number;
  weightRecords: WeightRecord[];
  // Farm-type specific metrics
  birds?: {
    eggProduction?: number;
    feedConversionRatio?: number;
    dailyFeedConsumption?: number;
    feedCost?: number;
    daysToMarket?: number;
    costPerBird?: number;
    revenuePerBird?: number;
    feedRecords: {
      id: string;
      date: string;
      feedType: 'starter' | 'grower' | 'finisher';
      quantity: number;
      cost: number;
      notes?: string;
    }[];
    performanceMetrics: {
      id: string;
      date: string;
      adg: number;
      fcr: number;
      mortality: number;
      feedCostPerKg: number;
      profitMargin: number;
    }[];
  };
  pigs?: {
    litterSize?: number;
    weaningRate?: number;
    breedingEfficiency?: number;
    totalBreedings?: number;
    successfulBreedings?: number;
    averageWeaningAge?: number;
    averageBreedingInterval?: number;
    successfulFarrowings?: number;
    averageLiveBorn?: number;
    preWeaningMortality?: number;
  };
}

export interface StockEntry {
  date: string;
  quantity: number;
  type: 'initial' | 'addition' | 'death' | 'sale';
  notes?: string;
} 