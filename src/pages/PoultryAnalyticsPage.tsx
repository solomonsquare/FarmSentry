import React from 'react';
import { PoultryAnalytics, FarmData } from '../components/poultry/PoultryAnalytics';
import { usePoultryFarmData } from '../hooks/usePoultryFarmData';
import { Stock, WeightRecord } from '../types';

// Define the shape of the data from usePoultryFarmData
interface PoultryFarmData {
  stock: Stock;
  weightRecords: WeightRecord[];
  feedConsumption: { date: string; amount: number; type: "starter" | "grower" | "finisher"; }[];
  feedData: any;
  lastUpdated?: string;
}

interface Props {
  currentFlockSize: number;
  maxSampleSize: number;
}

export function PoultryAnalyticsPage({ currentFlockSize, maxSampleSize }: Props) {
  const { data, updateData } = usePoultryFarmData();

  // Ensure data has all required properties with proper typing
  const farmData: PoultryFarmData = {
    stock: data.stock || { currentBirds: 0, history: [], lastUpdated: '' },
    weightRecords: data.weightRecords || [],
    feedConsumption: data.feedConsumption || [],
    feedData: data.feedData || null,
    lastUpdated: data.lastUpdated
  };

  const handleUpdate = (newData: FarmData) => {
    console.log('Updating with new data:', newData);
    updateData({
      ...newData,
      stock: {
        ...newData.stock,
        lastUpdated: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Poultry Farm Analytics</h1>
      <PoultryAnalytics 
        farmData={farmData as FarmData}
        onUpdate={handleUpdate}
        currentFlockSize={currentFlockSize}
        maxSampleSize={maxSampleSize}
      />
    </div>
  );
}