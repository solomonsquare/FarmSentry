import { Stock, Sale, Expense } from './index';

export interface BaseFarmFeatures {
  stock: Stock;
  expenses: Expense;
  sales: Sale[];
  lastUpdated?: string;
}

export interface EnvironmentalControl {
  temperature: number;
  humidity: number;
  ventilation: 'good' | 'moderate' | 'poor';
  lastChecked: string;
}

export interface VaccinationSchedule {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  notes?: string;
}

export interface WasteManagement {
  lastCleaning: string;
  nextScheduled: string;
  disposalMethod: 'composting' | 'biogas' | 'fertilizer';
  quantity: number;
}

export interface FeedConversion {
  id: string;
  startDate: string;
  endDate: string;
  initialWeight: number;
  finalWeight: number;
  feedConsumed: number;
  fcr: number;
  phase: 'Nursery' | 'Grower' | 'Finisher';
}

export interface PigFarmFeatures extends BaseFarmFeatures {
  breedingCycles: Array<{
    id: string;
    sow: string;
    startDate: string;
    expectedDueDate: string;
    actualBirthDate?: string;
    litterSize?: number;
    status: 'pending' | 'active' | 'completed';
  }>;
  weightRecords: Array<{
    id: string;
    date: string;
    pigId: string;
    weight: number;
    notes?: string;
  }>;
  feedConversion: FeedConversion[];
  vaccinations: Array<{
    id: string;
    name: string;
    dueDate: string;
    completed: boolean;
    notes?: string;
  }>;
  environmental: {
    temperature?: number;
    humidity?: number;
    ventilation?: 'good' | 'moderate' | 'poor';
    lastChecked?: string;
  };
  wasteManagement: {
    lastCleaning?: string;
    nextScheduled?: string;
    disposalMethod?: 'composting' | 'biogas' | 'fertilizer';
    quantity?: number;
  };
}

export interface PoultryFarmFeatures extends BaseFarmFeatures {
  eggProduction?: {
    date: string;
    quantity: number;
    damaged: number;
  }[];
  feedConsumption: {
    date: string;
    amount: number;
    type: 'starter' | 'grower' | 'finisher';
  }[];
  vaccinations: VaccinationSchedule[];
}