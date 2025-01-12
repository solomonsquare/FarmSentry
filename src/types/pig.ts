import { Stock, Sale, Expense } from './index';
import { PerformanceMetric } from './performance';

export interface PigBreed {
  id: string;
  name: string;
  growthRate: number; // Average daily weight gain in kg
  purpose: 'breeding' | 'meat' | 'both';
  averageLifespan: number; // In months
  typicalLitterSize: number;
  description?: string;
}

export interface GrowthStage {
  id: string;
  name: string;
  startAge: number; // In days
  endAge: number; // In days (-1 for no end)
  expectedWeightRange: {
    min: number;
    max: number;
  };
  description?: string;
}

export interface BreedingCycle {
  id: string;
  sow: string;
  startDate: string;
  expectedDueDate: string;
  status: 'active' | 'completed' | 'pending';
  pigletCount?: number;
  deathCount?: number;
}

export interface FeedConversionRecord {
  id: string;
  startDate: string;
  endDate: string;
  initialWeight: number;
  finalWeight: number;
  feedConsumed: number;
  fcr: number;
  phase: 'Nursery' | 'Grower' | 'Finisher';
}

export interface WeightRecord {
  id: string;
  date: string;
  weights: {
    average: number;
    target: number;
    below: number;
    above: number;
  };
  sampleSize: number;
}

export interface StockHistoryEntry {
  type?: string;
  quantity: number;
  remainingStock: number;
  description?: string;
  date?: string;
  time?: string;
  expenses?: Record<string, any>;
  id?: string;
}

export interface PigFarmData {
  breedingCycles: BreedingCycle[];
  weightRecords: WeightRecord[];
  feedConversion: FeedConversionRecord[];
  geneticRecords: GeneticRecord[];
  environmentalMetrics: EnvironmentalMetric[];
  lastUpdated: string;
  stock: {
    quantity: number;
    lastUpdated: string;
  };
  deaths: number;
  stockHistory: StockHistoryEntry[];
}

export interface GeneticRecord {
  id: string;
  breedingLine: string;
  improvements: string[];
  date: string;
  type: 'improvement' | 'deterioration';
}

export interface EnvironmentalMetric {
  id: string;
  resourceType: string;
  usage: number;
  date: string;
}

export interface GrowthPhase {
  name: string;
  data: {
    startWeight: number;
    endWeight: number;
    daysInPhase: number;
    feedConsumed: number;
  };
}

export const DEFAULT_GROWTH_PHASES: GrowthPhase[] = [
  {
    name: 'Nursery',
    data: { startWeight: 0, endWeight: 0, daysInPhase: 0, feedConsumed: 0 }
  },
  {
    name: 'Grower',
    data: { startWeight: 0, endWeight: 0, daysInPhase: 0, feedConsumed: 0 }
  },
  {
    name: 'Finisher',
    data: { startWeight: 0, endWeight: 0, daysInPhase: 0, feedConsumed: 0 }
  }
];

export const DEFAULT_GROWTH_STAGES: GrowthStage[] = [
  {
    id: 'piglet',
    name: 'Piglet',
    startAge: 0,
    endAge: 21,
    expectedWeightRange: { min: 1.5, max: 6 },
    description: 'Newborn to weaning'
  },
  {
    id: 'weaner',
    name: 'Weaner',
    startAge: 22,
    endAge: 70,
    expectedWeightRange: { min: 6, max: 25 },
    description: 'Post-weaning growth phase'
  },
  {
    id: 'grower',
    name: 'Grower',
    startAge: 71,
    endAge: 140,
    expectedWeightRange: { min: 25, max: 60 },
    description: 'Main growth phase'
  },
  {
    id: 'finisher',
    name: 'Finisher',
    startAge: 141,
    endAge: 180,
    expectedWeightRange: { min: 60, max: 100 },
    description: 'Final weight gain phase'
  },
  {
    id: 'breeding',
    name: 'Breeding Age',
    startAge: 181,
    endAge: -1,
    expectedWeightRange: { min: 100, max: 200 },
    description: 'Mature breeding stock'
  }
];

export const DEFAULT_PIG_BREEDS: PigBreed[] = [
  {
    id: 'large-white',
    name: 'Large White',
    growthRate: 0.85,
    purpose: 'both',
    averageLifespan: 60,
    typicalLitterSize: 12,
    description: 'Excellent growth rate and meat quality'
  },
  {
    id: 'duroc',
    name: 'Duroc',
    growthRate: 0.9,
    purpose: 'meat',
    averageLifespan: 48,
    typicalLitterSize: 10,
    description: 'Known for marbling and meat quality'
  },
  {
    id: 'landrace',
    name: 'Landrace',
    growthRate: 0.8,
    purpose: 'both',
    averageLifespan: 54,
    typicalLitterSize: 14,
    description: 'Good maternal characteristics'
  }
];