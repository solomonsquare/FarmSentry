export interface PerformanceMetric {
  id: string;
  date: string;
  category: FarmCategory;
  metrics: {
    // Common metrics
    feedConversionRatio: number;
    dailyWeightGain: number;
    mortalityRate: number;
    feedCostPerKg: number;
    
    // Bird-specific metrics
    eggProduction?: number;
    layingRate?: number;
    
    // Pig-specific metrics
    litterSize?: number;
    weaningRate?: number;
    pigletSurvivalRate?: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 