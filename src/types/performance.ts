export interface PerformanceMetric {
  id: string;
  date: string;
  adg: number; // Average Daily Gain
  fcr: number; // Feed Conversion Ratio
  mortality: number;
  feedCostPerKg: number;
  profitMargin: number;
  feedConsumed: number; // Total feed consumed in kg
} 