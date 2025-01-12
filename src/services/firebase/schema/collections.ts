export const COLLECTIONS = {
  USERS: 'users',
  FARMS: 'farms',
  SALES: 'sales',
  STOCK: 'stock',
  EXPENSES: 'expenses',
  WEIGHT_RECORDS: 'weight_records',
  FEED_RECORDS: 'feed_records',
  HEALTH_RECORDS: 'health_records',
  BREEDING_CYCLES: 'breeding_cycles',
  LITTER_RECORDS: 'litter_records'
} as const;

export const SUBCOLLECTIONS = {
  SALES_HISTORY: 'salesHistory',
  STOCK_HISTORY: 'stockHistory',
  EXPENSE_HISTORY: 'expenseHistory'
} as const;