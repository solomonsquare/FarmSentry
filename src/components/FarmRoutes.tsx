import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FarmCategory } from '../types';
import { Layout } from './layout/Layout';
import { UnifiedPage } from '../pages/UnifiedPage';
import { SalesPage } from '../pages/SalesPage';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorMessage } from './common/ErrorMessage';
import { useFarmData } from '../hooks/useFarmData';
import { DashboardPage } from '../pages/DashboardPage';
import { Analytics } from '../pages/Analytics';
import PigAnalytics from './pig/PigAnalytics';
import { useTranslation } from 'react-i18next';

interface Props {
  category: FarmCategory;
}

export function FarmRoutes({ category }: Props) {
  const { t } = useTranslation();
  const { data, loading, error, updateStock, updateSales, refresh } = useFarmData(category);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data || !data.stock) return <ErrorMessage message="No farm data available" />;

  return (
    <Layout category={category} onReset={refresh}>
      <Routes>
        <Route path="/" element={<DashboardPage category={category} />} />
        <Route 
          path="/analytics" 
          element={
            category === 'birds' ? (
              <Analytics category={category} />
            ) : (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('analytics.pigFarmAnalytics')}</h1>
                <PigAnalytics />
              </div>
            )
          }
        />
        <Route 
          path="/stock-expenses" 
          element={
            <UnifiedPage 
              stock={data.stock}
              expenses={data.expenses}
              category={category}
              onUpdateStock={updateStock}
              onUpdateExpenses={updateStock}
            />
          } 
        />
        <Route 
          path="/sales" 
          element={
            <SalesPage 
              totalBirds={data.stock.currentBirds}
              stock={data.stock}
              category={category}
              onUpdateStock={updateStock}
            />
          } 
        />
      </Routes>
    </Layout>
  );
}