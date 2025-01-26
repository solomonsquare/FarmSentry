import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { WeightTracker } from './weight/WeightTracker';
import { WeightAnalysis } from './WeightAnalysis';
import { WeightRecord } from '../../types/poultry';
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
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
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

  // Calculate feed consumption per bird
  const totalDailyFeed = farmData.performanceMetrics.reduce((sum, metric) => 
    sum + (metric.feedConsumed || 0), 0);
  const perBirdConsumption = currentFlockSize > 0 ? totalDailyFeed / currentFlockSize : 0;

  return (
    <div className="space-y-6">
      <PerformanceMetrics performanceMetrics={farmData.performanceMetrics} />
      
      <WeightTracker
        weightRecords={weightRecords.slice(0, 5)}
        totalBirds={currentFlockSize}
        onUpdate={handleWeightRecordUpdate}
      />
      
      <WeightAnalysis weightRecords={weightRecords} />

      {/* Feed Data Section */}
      <div className={`${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-lg shadow p-6`}>
        <h2 className="text-xl font-semibold mb-4">{t('analytics.feedData.title')}</h2>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {t('analytics.feedData.dailyConsumption')}
            </label>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('analytics.feedData.consumptionNote', { 
                count: currentFlockSize, 
                animal: t('farm.birds'), 
                amount: perBirdConsumption.toFixed(2) 
              })}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {t('analytics.feedData.daysUntilMarket')}
            </label>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('analytics.feedData.marketWeightNote')}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {t('analytics.feedData.dailyCost')}
            </label>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('analytics.feedData.costPerBird', { 
                cost: 0, 
                animal: t('farm.bird').toLowerCase() 
              })}
            </p>
          </div>
        </div>
      </div>
      
      <PoultryWeightRecordsList records={weightRecords} />
    </div>
  );
}