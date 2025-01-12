import React from 'react';
import { SalesFiltersType } from '../../../types/sales';

interface Props {
  filters: SalesFiltersType;
  onUpdateFilters: (updates: Partial<SalesFiltersType>) => void;
}

export function SalesFilters({ filters, onUpdateFilters }: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <input
        type="text"
        placeholder="Search sales..."
        value={filters.searchTerm}
        onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
        className="px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
      />
      <select
        value={filters.sortBy}
        onChange={(e) => onUpdateFilters({ sortBy: e.target.value as 'date' | 'amount' })}
        className="px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
      >
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
      </select>
      <select
        value={filters.sortOrder}
        onChange={(e) => onUpdateFilters({ sortOrder: e.target.value as 'asc' | 'desc' })}
        className="px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  );
}