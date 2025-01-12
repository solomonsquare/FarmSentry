import React from 'react';
import { FarmData, FarmCategory } from '../types';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorMessage } from './common/ErrorMessage';
import { DashboardStats } from './dashboard/DashboardStats';
import { ExpenseChart } from './dashboard/ExpenseChart';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';

interface Props {
  data: FarmData;
  category: FarmCategory;
  loading?: boolean;
  error?: string | null;
}

export function Dashboard({ data, category, loading: dataLoading, error: dataError }: Props) {
  const { metrics, loading: metricsLoading, error: metricsError } = useDashboardMetrics(category);

  if (dataLoading || metricsLoading) {
    return <LoadingSpinner />;
  }

  if (dataError || metricsError) {
    return <ErrorMessage message={dataError || metricsError || 'An error occurred'} />;
  }

  const deathCount = data.stock.history
    .filter(entry => entry.type === 'death')
    .reduce((total, entry) => total + entry.quantity, 0);

  const animalType = category === 'birds' ? 'Birds' : 'Pigs';

  const expenseData = [
    { name: animalType, value: data.expenses.birds },
    { name: 'Medicine', value: data.expenses.medicine },
    { name: 'Feeds', value: data.expenses.feeds },
    { name: 'Additional', value: data.expenses.additionals },
  ];

  const totalExpenses = Object.values(data.expenses).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>

      <DashboardStats
        currentStock={data.stock.currentBirds}
        deathCount={deathCount}
        totalSold={metrics.totalSold}
        totalExpenses={totalExpenses}
        totalRevenue={metrics.totalRevenue}
        totalProfit={metrics.totalProfit}
        category={category}
      />

      <ExpenseChart data={expenseData} />
    </div>
  );
}