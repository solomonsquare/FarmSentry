import { Sale, Stock, FarmCategory } from '../../types';

export interface SaleStats {
  totalSold: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface SaleTransaction {
  sale: Sale;
  updatedStock: Stock;
  category: FarmCategory;
}

export interface SaleValidationResult {
  isValid: boolean;
  errors?: string[];
}