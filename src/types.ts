export type FarmCategory = 'birds' | 'pigs';

export interface Stock {
  currentBirds: number;
  history: StockEntry[];
  lastUpdated: string;
}

export interface StockEntry {
  id: string;
  type: 'initial' | 'addition' | 'death' | 'sale';
  quantity: number;
  date: string;
  time: string;
  remainingStock: number;
  expenses?: Expense;
}

export interface Sale {
  id: string;
  userId: string;
  category: FarmCategory;
  quantity: number;
  pricePerBird: number;
  costPerBird?: number;
  totalAmount: number;
  profitPerBird: number;
  totalProfit: number;
  date: string;
  time: string;
  createdAt: Date;
}

export interface Expense {
  birds: number;
  medicine: number;
  feeds: number;
  additionals: number;
}

export interface WeightRecord {
  id: string;
  batchId: string;
  date: string;
  sampleSize: number;
  weights: number[];
  averageWeight: number;
  targetWeight: number;
  belowTarget: number;
  aboveTarget: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmData {
  stock: Stock;
  weightRecords: WeightRecord[];
  expenses: Expense;
  feedConsumption: { date: string; amount: number; type: "starter" | "grower" | "finisher"; }[];
  lastUpdated?: string;
} 