import React, { useState, Fragment } from 'react';
import { EnvironmentalMetric } from '../../../types/pig';
import { PaginationContainer } from '../../common/PaginationContainer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, Transition } from '@headlessui/react';
import { Leaf, Plus } from 'lucide-react';
import { usePagination } from '../../../hooks/usePagination';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import { formatDate } from '../../../utils/date';

interface Props {
  environmentalMetrics: EnvironmentalMetric[];
  onUpdate: (metrics: EnvironmentalMetric[]) => void;
}

interface MetricForm {
  resourceType: string;
  usage: string;
  date: string;
}

export function EnvironmentalImpact({ environmentalMetrics = [], onUpdate }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [localMetrics, setLocalMetrics] = useState<EnvironmentalMetric[]>(environmentalMetrics);

  const {
    totalPages,
    displayedRecords,
  } = usePagination(
    localMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    recordsPerPage
  );

  const [formData, setFormData] = useState<MetricForm>({
    resourceType: 'water',
    usage: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Update local metrics when prop changes
  React.useEffect(() => {
    setLocalMetrics(environmentalMetrics);
  }, [environmentalMetrics]);

  const resourceTypes = [
    { type: 'water', unit: 'liters' },
    { type: 'electricity', unit: 'kWh' },
    { type: 'waste', unit: 'kg' },
    { type: 'emissions', unit: 'CO2e' }
  ];

  const addMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMetric: EnvironmentalMetric = {
      id: Date.now().toString(),
      resourceType: formData.resourceType,
      usage: parseFloat(formData.usage),
      date: new Date(formData.date).toISOString()
    };

    // Update local state immediately
    const updatedMetrics = [...localMetrics, newMetric];
    setLocalMetrics(updatedMetrics);
    
    // Update parent state
    onUpdate(updatedMetrics);

    setIsOpen(false);
    setFormData({
      resourceType: 'Water',
      usage: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Prepare data for the graph
  const chartData = resourceTypes.map(({ type, unit }) => {
    const totalUsage = localMetrics
      .filter(metric => metric.resourceType.toLowerCase() === type)
      .reduce((sum, metric) => sum + metric.usage, 0);

    return {
      resourceType: t(`analytics.environmentalImpact.metrics.${type}`),
      usage: totalUsage,
      unit
    };
  });

  // Prepare trend data
  const trendData = localMetrics
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10) // Show last 10 entries
    .map(metric => ({
      date: new Date(metric.date).toLocaleDateString(),
      usage: metric.usage,
      resourceType: t(`analytics.environmentalImpact.metrics.${metric.resourceType.toLowerCase()}`)
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('analytics.environmentalImpact.title')}
        </h2>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isDarkMode 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          {t('analytics.environmentalImpact.addRecord')}
        </button>
      </div>

      {/* Resource Type Summary */}
      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('analytics.environmentalImpact.title')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {resourceTypes.map(({ type, unit }) => {
            const totalUsage = localMetrics
              .filter(metric => metric.resourceType.toLowerCase() === type)
              .reduce((sum, metric) => sum + metric.usage, 0);

            return (
              <div 
                key={type}
                className={`p-4 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h4 className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t(`analytics.environmentalImpact.metrics.${type}`)}
                </h4>
                <p className={`mt-2 text-2xl font-semibold ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {totalUsage.toLocaleString()} {unit}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className={`p-4 rounded-lg ${
          isDarkMode 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-sm font-medium mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t('analytics.environmentalImpact.usageTrends')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                />
                <XAxis 
                  dataKey="resourceType" 
                  stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
                />
                <YAxis 
                  stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                    color: isDarkMode ? '#D1D5DB' : '#111827'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="usage" 
                  fill={isDarkMode ? '#059669' : '#10B981'} 
                  name={t('analytics.environmentalImpact.usage')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Metrics Table */}
      <div className={`overflow-x-auto rounded-lg border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('common.date')}
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('analytics.environmentalImpact.resourceType')}
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('analytics.environmentalImpact.usage')}
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {displayedRecords.map((metric) => (
              <tr 
                key={metric.id}
                className={isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {formatDate(metric.date)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {t(`analytics.environmentalImpact.metrics.${metric.resourceType.toLowerCase()}`)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {metric.usage.toLocaleString()} {resourceTypes.find(r => r.type === metric.resourceType.toLowerCase())?.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {localMetrics.length > recordsPerPage && (
          <PaginationContainer
            currentPage={currentPage}
            totalPages={Math.ceil(localMetrics.length / recordsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Add Metric Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsOpen(false)}>
          <div className="flex items-center justify-center min-h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <Dialog.Title className="text-lg font-medium mb-4">{t('analytics.environmentalImpact.addRecord')}</Dialog.Title>
              
              <form onSubmit={addMetric} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('analytics.environmentalImpact.resourceType')}</label>
                  <select
                    value={formData.resourceType}
                    onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    {resourceTypes.map(({ type }) => (
                      <option key={type} value={type}>{t(`analytics.environmentalImpact.metrics.${type}`)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('analytics.environmentalImpact.usage')} ({resourceTypes.find(r => r.type === formData.resourceType.toLowerCase())?.unit})
                  </label>
                  <input
                    type="number"
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('common.date')}</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    {t('analytics.environmentalImpact.addRecord')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 