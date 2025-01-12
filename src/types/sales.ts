export interface SalesFiltersType {
  searchTerm: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

export interface SalesHistoryProps {
  category: string;
  initialSales: Sale[];
  filters: SalesFiltersType;
  onUpdateFilters: (filters: Partial<SalesFiltersType>) => void;
  onExport: () => void;
  salesData: {
    totalRevenue: number;
    totalProfit: number;
    filteredSales: Sale[];
  };
}