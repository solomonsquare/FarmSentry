import React, { useState, Fragment } from 'react';
import { EnvironmentalMetric } from '../../../types/pig';
import { PaginationContainer } from '../../common/PaginationContainer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, Transition } from '@headlessui/react';
import { Leaf } from 'lucide-react';
import { usePagination } from '../../../hooks/usePagination';

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
  const [isOpen, setIsOpen] = useState(false);
  const [localMetrics, setLocalMetrics] = useState(environmentalMetrics);
  const recordsPerPage = 5;

  const {
    currentPage,
    totalPages,
    displayedRecords,
    setCurrentPage
  } = usePagination(
    localMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    recordsPerPage
  );

  const [formData, setFormData] = useState<MetricForm>({
    resourceType: 'Water',
    usage: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Update local metrics when prop changes
  React.useEffect(() => {
    setLocalMetrics(environmentalMetrics);
  }, [environmentalMetrics]);

  const resourceTypes = [
    { type: 'Water', unit: 'liters' },
    { type: 'Electricity', unit: 'kWh' },
    { type: 'Waste', unit: 'kg' },
    { type: 'Emissions', unit: 'CO2e' }
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
      .filter(metric => metric.resourceType === type)
      .reduce((sum, metric) => sum + metric.usage, 0);

    return {
      resourceType: type,
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
      resourceType: metric.resourceType
    }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-semibold">Environmental Impact</h2>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Add Metric
        </button>
      </div>

      {/* Resource Type Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resourceTypes.map(({ type, unit }) => {
          const totalUsage = localMetrics
            .filter(metric => metric.resourceType === type)
            .reduce((sum, metric) => sum + metric.usage, 0);

          return (
            <div key={type} className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-500">{type} Usage</h4>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {totalUsage.toLocaleString()} {unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="h-64 bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="resourceType" />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value.toLocaleString()} ${props.payload.unit}`,
                  name
                ]}
              />
              <Legend />
              <Bar dataKey="usage" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Trend Chart */}
      {trendData.length > 0 && (
        <div className="h-64 bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Usage Trends (Last 10 Entries)</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="usage" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Metrics Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {displayedRecords.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No environmental metrics available. Add one to get started.
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Resource Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedRecords.map((metric) => (
                  <tr key={metric.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(metric.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.resourceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.usage.toLocaleString()} {resourceTypes.find(r => r.type === metric.resourceType)?.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {localMetrics.length > recordsPerPage && (
              <div className="bg-white px-4 py-3 border-t border-gray-200">
                <PaginationContainer
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
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
              <Dialog.Title className="text-lg font-medium mb-4">Add Environmental Metric</Dialog.Title>
              
              <form onSubmit={addMetric} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resource Type</label>
                  <select
                    value={formData.resourceType}
                    onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    {resourceTypes.map(({ type }) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Usage ({resourceTypes.find(r => r.type === formData.resourceType)?.unit})
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
                  <label className="block text-sm font-medium text-gray-700">Date</label>
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
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Add Metric
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