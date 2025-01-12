import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { PerformanceMetric, FarmCategory } from '../../types';
import { RecordsPagination } from '../common/RecordsPagination';
import { formatDate } from '../../utils/date';

interface Props {
  metrics: PerformanceMetric[];
  category: FarmCategory;
}

export function PerformanceMetricsHistory({ metrics, category }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
  const totalPages = Math.ceil(metrics.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedMetrics = metrics.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">Performance History</h2>
      </div>

      <div className="space-y-4">
        {metrics.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No performance metrics recorded yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">FCR</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Daily Gain</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Mortality</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Feed Cost/kg</th>
                    {category === 'birds' && (
                      <>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Egg Prod.</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Laying Rate</th>
                      </>
                    )}
                    {category === 'pigs' && (
                      <>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Litter Size</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Weaning Rate</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedMetrics.map((metric) => (
                    <tr key={metric.id}>
                      <td className="px-4 py-2 text-sm">{formatDate(metric.date)}</td>
                      <td className="px-4 py-2 text-sm text-right">{metric.metrics.feedConversionRatio.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm text-right">{metric.metrics.dailyWeightGain.toFixed(2)} kg</td>
                      <td className="px-4 py-2 text-sm text-right">{metric.metrics.mortalityRate.toFixed(1)}%</td>
                      <td className="px-4 py-2 text-sm text-right">₦{metric.metrics.feedCostPerKg.toFixed(2)}</td>
                      {category === 'birds' && (
                        <>
                          <td className="px-4 py-2 text-sm text-right">{metric.metrics.eggProduction || '-'}</td>
                          <td className="px-4 py-2 text-sm text-right">{metric.metrics.layingRate?.toFixed(1) || '-'}%</td>
                        </>
                      )}
                      {category === 'pigs' && (
                        <>
                          <td className="px-4 py-2 text-sm text-right">{metric.metrics.litterSize || '-'}</td>
                          <td className="px-4 py-2 text-sm text-right">{metric.metrics.weaningRate?.toFixed(1) || '-'}%</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {metrics.length > recordsPerPage && (
              <RecordsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
} 