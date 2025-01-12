import { Timestamp } from 'firebase/firestore';
import { FarmCategory } from '../../../types';

// Base document interface
interface BaseDocument {
  id: string;
  userId: string;
  farmId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User profile and settings
export interface UserDocument extends BaseDocument {
  email: string;
  displayName?: string;
  phoneNumber?: string;
  farmName?: string;
  currentFarmType: FarmCategory;
  onboardingComplete: boolean;
  settings: {
    theme: 'light' | 'dark';
    currency: string;
    language: string;
  };
}

// Farm details
export interface FarmDocument extends BaseDocument {
  category: FarmCategory;
  location?: string;
  size?: number;
  plan: 'basic' | 'professional' | 'enterprise';
  settings: {
    autoCalculateProfit: boolean;
    trackWeights: boolean;
    trackFeeds: boolean;
  };
}

// Stock management
export interface StockDocument extends BaseDocument {
  currentQuantity: number;
  breed?: string;
  birthDate?: string;
  purpose?: 'breeding' | 'meat' | 'both';
  status: 'active' | 'archived';
  history: Array<{
    id: string;
    date: string;
    type: 'initial' | 'addition' | 'sale' | 'death';
    quantity: number;
    remainingQuantity: number;
    description?: string;
    expenses?: {
      animals: number;
      medicine: number;
      feeds: number;
      additionals: number;
    };
  }>;
}

// Sales records
export interface SaleDocument extends BaseDocument {
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  profitPerUnit: number;
  totalProfit: number;
  date: string;
  time: string;
  category: FarmCategory;
  paymentMethod?: string;
  customerInfo?: {
    name?: string;
    contact?: string;
  };
  notes?: string;
}

// Expenses tracking
export interface ExpenseDocument extends BaseDocument {
  category: 'animals' | 'feed' | 'medicine' | 'labor' | 'utilities' | 'other';
  amount: number;
  description: string;
  date: string;
  recurring?: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly';
  attachments?: string[];
}

// Weight tracking
export interface WeightRecordDocument extends BaseDocument {
  animalId?: string;
  weight: number;
  date: string;
  notes?: string;
  batch?: string;
  targetWeight?: number;
  category: FarmCategory;
}

// Feed tracking
export interface FeedRecordDocument extends BaseDocument {
  type: 'starter' | 'grower' | 'finisher' | 'custom';
  quantity: number;
  cost: number;
  date: string;
  batchId?: string;
  notes?: string;
  category: FarmCategory;
}

// Health records
export interface HealthRecordDocument extends BaseDocument {
  animalId?: string;
  type: 'vaccination' | 'medication' | 'checkup' | 'other';
  date: string;
  description: string;
  cost?: number;
  nextScheduledDate?: string;
  attachments?: string[];
  category: FarmCategory;
}

// Breeding records (pigs only)
export interface BreedingCycleDocument extends BaseDocument {
  sowId: string;
  startDate: string;
  expectedDueDate: string;
  actualBirthDate?: string;
  litterSize?: number;
  status: 'pending' | 'active' | 'completed' | 'failed';
  notes?: string;
  healthRecords?: Array<{
    date: string;
    type: string;
    notes: string;
  }>;
}

// Litter tracking (pigs only)
export interface LitterRecordDocument extends BaseDocument {
  breedingCycleId: string;
  birthDate: string;
  totalBorn: number;
  bornAlive: number;
  bornDead: number;
  weight?: number;
  notes?: string;
  piglets: Array<{
    id: string;
    gender: 'male' | 'female';
    birthWeight?: number;
    status: 'alive' | 'deceased' | 'sold';
  }>;
}