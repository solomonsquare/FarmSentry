import { PerformanceMetric } from './performance';

export type FarmCategory = 'birds' | 'pigs';

export interface StockEntry {
  id: string;
  date: string;
  time: string;
  type: 'initial' | 'addition' | 'death' | 'sale';
  quantity: number;
  remainingStock: number;
  description?: string;
  expenses?: Expense;
  breed?: {
    name: string;
    id: string;
  };
}

export interface Stock {
  currentBirds: number;
  history: StockEntry[];
  lastUpdated: string;
}

export interface Expense {
  birds: number;
  medicine: number;
  feeds: number;
  additionals: number;
}

export interface Sale {
  id: string;
  date: string;
  time?: string;
  quantity: number;
  pricePerBird: number;
  costPerBird?: number;
  totalAmount: number;
  profitPerBird: number;
  totalProfit: number;
  category: FarmCategory;
  userId?: string;
  createdAt: Date;
}

export interface FeedData {
  date: string;
  amount: number;
  type: "starter" | "grower" | "finisher";
  cost: number;
}

export interface FarmData {
  stock: Stock;
  weightRecords: WeightRecord[];
  expenses: Expense;
  feedConsumption: { date: string; amount: number; type: "starter" | "grower" | "finisher"; }[];
  feedData?: {
    dailyConsumption: number;
    feedCost: number;
    daysToMarket: number;
  };
  performanceMetrics?: PerformanceMetric[];
  lastUpdated?: string;
}

export interface CategoryFarmData {
  [key: string]: FarmData;
}

export interface WeightRecord {
  id: string;
  batchId: string;
  date: string;
  sampleSize: number;
  weights: {
    total: number;
    average: number;
    target: number;
    below: number;
    above: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}