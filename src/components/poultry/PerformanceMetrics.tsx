import React from 'react';
import { PerformanceMetric } from '../../types/performance';
import { TrendingUp } from 'lucide-react';

interface Props {
  performanceMetrics: PerformanceMetric[];
}

export function PerformanceMetrics({ performanceMetrics }: Props) {
  // Calculate average FCR from all FCRs in performance history
  const averageFCR = performanceMetrics.length > 0
    ? performanceMetrics.reduce((sum, metric) => {
        // Only include valid FCR values in the calculation
        if (metric.metrics.feedConversionRatio && !isNaN(metric.metrics.feedConversionRatio)) {
          return sum + metric.metrics.feedConversionRatio;
        }
        return sum;
      }, 0) / performanceMetrics.filter(metric => 
        metric.metrics.feedConversionRatio && !isNaN(metric.metrics.feedConversionRatio)
      ).length
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">Performance Metrics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700 mb-1">Average FCR</h3>
          <p className="text-2xl font-bold text-blue-700">{averageFCR.toFixed(2)}</p>
          <p className="text-sm text-blue-600">Average from performance history</p>
        </div>
      </div>
    </div>
  );
} 