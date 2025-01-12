import React from 'react';
import { FarmData, FarmCategory } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { DashboardStats } from '../components/dashboard/DashboardStats';

interface Props {
  data: FarmData;
  category: FarmCategory;
  loading?: boolean;
  error?: string | null;
}

export function Dashboard({ data, category, loading, error }: Props) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>

      <DashboardStats category={category} />
    </div>
  );
}