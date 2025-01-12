import React, { useState, useEffect } from 'react';
import { WeightTracker } from './weight/WeightTracker';
import { WeightAnalysis } from './WeightAnalysis';
import { WeightRecord } from '../../types';
import { PoultryWeightRecordsList } from './weight/PoultryWeightRecordsList';
import { PerformanceMetrics } from './PerformanceMetrics';
import { PerformanceMetric } from '../../types/performance';

interface Props {
  farmData: {
    weightRecords: WeightRecord[];
    performanceMetrics: PerformanceMetric[];
  };
  onUpdate: (data: any) => void;
  currentFlockSize: number;
  maxSampleSize: number;
}

export function PoultryAnalytics({ farmData, onUpdate, currentFlockSize, maxSampleSize }: Props) {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(
    [...farmData.weightRecords].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );

  useEffect(() => {
    console.log('farmData.weightRecords changed:', farmData.weightRecords.length);
    setWeightRecords(
      [...farmData.weightRecords].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  }, [farmData.weightRecords]);

  const handleWeightRecordUpdate = (records: WeightRecord[]) => {
    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setWeightRecords(sortedRecords);
    onUpdate({ ...farmData, weightRecords: sortedRecords });
  };

  return (
    <div className="space-y-6">
      <PerformanceMetrics performanceMetrics={farmData.performanceMetrics} />
      
      <WeightTracker
        weightRecords={weightRecords.slice(0, 5)}
        totalBirds={currentFlockSize}
        onUpdate={handleWeightRecordUpdate}
      />
      
      <WeightAnalysis weightRecords={weightRecords} />
      
      <PoultryWeightRecordsList records={weightRecords} />
    </div>
  );
}