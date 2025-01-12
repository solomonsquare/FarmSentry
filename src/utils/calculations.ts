import { Expense, Sale, StockEntry } from '../types';

export const calculateTotalExpenses = (expenses: Expense): number => {
  return expenses.birds + expenses.medicine + expenses.feeds + expenses.additionals;
};

export const calculateTotalRevenue = (sales: Sale[]): number => {
  if (!sales) return 0;
  return sales.reduce((total, sale) => total + (sale.quantity * sale.pricePerBird), 0);
};

export const calculateProfit = (expenses: Expense, sales: Sale[]): number => {
  if (!sales || !expenses) return 0;
  const totalRevenue = calculateTotalRevenue(sales);
  const totalExpenses = calculateTotalExpenses(expenses);
  return totalRevenue - totalExpenses;
};

export const calculateWeightedAverageCost = (stockHistory: StockEntry[], beforeDate?: string): number => {
  if (!stockHistory || stockHistory.length === 0) return 0;

  let totalCost = 0;
  let totalBirds = 0;
  let remainingBirds = 0;

  // First, find the remaining birds at the given date
  for (const entry of stockHistory) {
    if (beforeDate && entry.date > beforeDate) continue;
    
    if (entry.type === 'initial' || entry.type === 'addition') {
      remainingBirds += entry.quantity;
    } else if (entry.type === 'sale' || entry.type === 'death') {
      remainingBirds -= entry.quantity;
    }
  }

  // If no birds remain, don't calculate weighted average
  if (remainingBirds <= 0) return 0;

  // Calculate weighted average only if there are remaining birds
  for (const entry of stockHistory) {
    if (beforeDate && entry.date > beforeDate) continue;
    
    if ((entry.type === 'initial' || entry.type === 'addition') && entry.expenses) {
      const entryCost = Object.entries(entry.expenses)
        .reduce((sum: number, [_, cost]) => sum + (typeof cost === 'number' ? cost : 0), 0);
      totalCost += entryCost;
      totalBirds += entry.quantity;
    }
  }

  return totalBirds > 0 ? totalCost / totalBirds : 0;
};

export const calculateProfitPerBird = (sellingPrice: number, stockHistory: StockEntry[]): number => {
  // Get the most recent stock addition entry that has expenses
  const lastStockEntry = [...stockHistory]
    .reverse()
    .find(entry => 
      (entry.type === 'initial' || entry.type === 'addition') && 
      entry.expenses
    );

  if (!lastStockEntry || !lastStockEntry.expenses) {
    return sellingPrice; // If no cost data found, assume 100% profit
  }

  // Calculate total expenses for the batch
  const totalExpenses = Object.values(lastStockEntry.expenses).reduce((sum, value) => sum + value, 0);
  
  // Calculate cost per bird from the last batch
  const costPerBird = totalExpenses / lastStockEntry.quantity;

  // Calculate profit (selling price - cost)
  return sellingPrice - costPerBird;
};