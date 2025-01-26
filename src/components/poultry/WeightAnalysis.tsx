import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WeightRecord } from '../../types/poultry';
import { Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  weightRecords: WeightRecord[];
}

export function WeightAnalysis({ weightRecords }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // Calculate totals from all records
  const totalBelowTarget = weightRecords.reduce((sum, record) => sum + record.weights.below, 0);
  const totalAboveTarget = weightRecords.reduce((sum, record) => sum + record.weights.above, 0);
  const totalSampleSize = weightRecords.reduce((sum, record) => sum + record.sampleSize, 0);

  const chartData = weightRecords.map(record => ({
    date: record.date,
    average: record.weights.average,
    target: record.weights.target,
    belowTarget: (record.weights.below / record.sampleSize) * 100,
    aboveTarget: (record.weights.above / record.sampleSize) * 100
  }));

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <div className="flex items-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-indigo-400" />
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('analytics.weightAnalysis.title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} p-4 rounded-lg`}>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-red-400' : 'text-red-700'} mb-1`}>
            {t('analytics.weightStatus.below')}
          </h3>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
            {totalBelowTarget} birds
          </p>
          {totalSampleSize > 0 && (
            <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {((totalBelowTarget / totalSampleSize) * 100).toFixed(1)}% of total samples
            </p>
          )}
        </div>
        <div className={`${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} p-4 rounded-lg`}>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'} mb-1`}>
            {t('analytics.weightStatus.above')}
          </h3>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
            {totalAboveTarget} birds
          </p>
          {totalSampleSize > 0 && (
            <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {((totalAboveTarget / totalSampleSize) * 100).toFixed(1)}% of total samples
            </p>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="date" 
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
              />
              <YAxis 
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  color: isDarkMode ? '#f3f4f6' : '#111827'
                }}
              />
              <Legend 
                wrapperStyle={{
                  color: isDarkMode ? '#f3f4f6' : '#111827'
                }}
              />
              <Line type="monotone" dataKey="average" stroke="#3b82f6" name={t('analytics.weightTracking.averageWeight')} />
              <Line type="monotone" dataKey="target" stroke="#10b981" name={t('analytics.weightTracking.targetWeight')} />
              <Line type="monotone" dataKey="belowTarget" stroke="#ef4444" name={t('analytics.weightStatus.below')} />
              <Line type="monotone" dataKey="aboveTarget" stroke="#8b5cf6" name={t('analytics.weightStatus.above')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}