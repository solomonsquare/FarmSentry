import React from 'react';
import { PigAnalytics } from '../components/pig/PigAnalytics';
import { usePigFarmData } from '../hooks/usePigFarmData';

export function PigAnalyticsPage() {
  const { data, updateData } = usePigFarmData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Pig Farm Analytics</h1>
      <PigAnalytics farmData={data} onUpdate={updateData} />
    </div>
  );
}