import React, { useState, useEffect } from 'react';
import { Scale, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
  calculateADG, 
  calculateFeedCostPerKg, 
  calculateProfitMargin, 
  calculateFCR,
  formatNaira 
} from '../../utils/analytics';
import { WeightRecord } from '../../types/poultry';
import { LineChart } from './LineChart';
import { PaginationContainer } from '../common/PaginationContainer';

interface Props {
  currentFlockSize: number;
  onAddRecord: (data: WeightRecord) => Promise<void>;
  onUpdateFeedData: (data: {
    dailyConsumption: number;
    feedCost: number;
    daysToMarket: number;
  }) => Promise<void>;
  feedData: {
    dailyConsumption: number;
    feedCost: number;
    daysToMarket: number;
  };
  economicData: {
    costPerBird: number;
    revenuePerBird: number;
  };
  initialWeightRecords: WeightRecord[];
  feedRecords: {
    id: string;
    date: string;
    feedType: 'starter' | 'grower' | 'finisher';
    quantity: number;
    cost: number;
    notes?: string;
  }[];
  performanceMetrics: {
    id: string;
    date: string;
    adg: number;
    fcr: number;
    mortality: number;
    feedCostPerKg: number;
    profitMargin: number;
  }[];
}

export function PoultryWeightTracking({ 
  currentFlockSize, 
  onAddRecord,
  onUpdateFeedData,
  feedData: savedFeedData,
  economicData,
  initialWeightRecords,
  feedRecords = [],
  performanceMetrics = [],
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(initialWeightRecords);
  const [sampleSize, setSampleSize] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [belowTarget, setBelowTarget] = useState('');
  const [aboveTarget, setAboveTarget] = useState('');
  const [notes, setNotes] = useState('');

  // Add state for feed data form
  const [dailyConsumption, setDailyConsumption] = useState('');
  const [daysToMarket, setDaysToMarket] = useState('');
  const [feedCost, setFeedCost] = useState('');

  // Validation for weight record form
  const isWeightFormValid = Boolean(
    sampleSize && 
    Number(sampleSize) > 0 &&
    totalWeight && 
    Number(totalWeight) > 0 &&
    targetWeight && 
    Number(targetWeight) > 0 &&
    belowTarget !== '' &&
    aboveTarget !== '' &&
    Number(belowTarget) + Number(aboveTarget) <= Number(sampleSize)
  );

  // Validation for feed data form
  const isFeedDataValid = Boolean(
    dailyConsumption && 
    Number(dailyConsumption) > 0 &&
    daysToMarket && 
    Number(daysToMarket) > 0 &&
    feedCost && 
    Number(feedCost) > 0
  );

  // Add loading state for feed data update
  const [isUpdatingFeed, setIsUpdatingFeed] = useState(false);

  // Add state for current page
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(weightRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const displayedRecords = weightRecords.slice(startIndex, startIndex + recordsPerPage);

  // Add state for feed records pagination
  const [feedCurrentPage, setFeedCurrentPage] = useState(1);

  // Add state for performance metrics pagination
  const [metricsCurrentPage, setMetricsCurrentPage] = useState(1);

  // Add state to manage feed and performance records locally
  const [localFeedRecords, setLocalFeedRecords] = useState(feedRecords);
  const [localPerformanceMetrics, setLocalPerformanceMetrics] = useState(performanceMetrics);

  const getFeedTypeColor = (feedType: 'starter' | 'grower' | 'finisher') => {
    switch (feedType) {
      case 'starter':
        return 'bg-blue-100 text-blue-800';
      case 'grower':
        return 'bg-green-100 text-green-800';
      case 'finisher':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const averageWeight = Number(totalWeight) / Number(sampleSize);
      
      const newRecord: WeightRecord = {
        id: Date.now().toString(),
        batchId: 'default',
        date: now,
        sampleSize: Number(sampleSize),
        weights: {
          total: Number(totalWeight),
          average: averageWeight,
          target: Number(targetWeight),
          below: Number(belowTarget),
          above: Number(aboveTarget)
        },
        notes: notes,
        createdAt: now,
        updatedAt: now
      };

      await onAddRecord(newRecord);
      
      // Update local state with the new record
      setWeightRecords(prev => [...prev, newRecord]);
      
      // Reset form
      setSampleSize('');
      setTotalWeight('');
      setTargetWeight('');
      setBelowTarget('');
      setAboveTarget('');
      setNotes('');
    } catch (err) {
      console.error('Failed to add weight record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add validation for below/above target numbers
  const validateTargetNumbers = (value: string, otherValue: string) => {
    const num = Number(value);
    const other = Number(otherValue);
    const total = num + other;
    
    if (total > Number(sampleSize)) {
      return false;
    }
    return true;
  };

  // Handle below target change with validation
  const handleBelowTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(0, Number(e.target.value));
    if (validateTargetNumbers(newValue.toString(), aboveTarget)) {
      setBelowTarget(newValue.toString());
    }
  };

  // Handle above target change with validation
  const handleAboveTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(0, Number(e.target.value));
    if (validateTargetNumbers(belowTarget, newValue.toString())) {
      setAboveTarget(newValue.toString());
    }
  };

  // Calculate percentages
  const calculatePercentages = (record: WeightRecord) => {
    const { sampleSize, weights } = record;
    return {
      below: ((weights.below / sampleSize) * 100).toFixed(1),
      above: ((weights.above / sampleSize) * 100).toFixed(1),
      atTarget: (((sampleSize - weights.below - weights.above) / sampleSize) * 100).toFixed(1)
    };
  };

  // Add this function to calculate totals
  const calculateTotals = () => {
    return weightRecords.reduce((acc, record) => ({
      below: acc.below + record.weights.below,
      above: acc.above + record.weights.above,
      total: acc.total + record.sampleSize
    }), { below: 0, above: 0, total: 0 });
  };

  // Update the handler for feed data updates
  const handleFeedDataUpdate = async () => {
    if (!isFeedDataValid || isUpdatingFeed) return;

    setIsUpdatingFeed(true);
    try {
      // Add debug logging
      console.log('Updating feed data:', {
        dailyConsumption: Number(dailyConsumption),
        feedCost: Number(feedCost),
        daysToMarket: Number(daysToMarket),
        rawValues: {
          dailyConsumption,
          feedCost,
          daysToMarket
        }
      });

      const updatedFeedData = {
        dailyConsumption: Number(dailyConsumption),
        feedCost: Number(feedCost),
        daysToMarket: Number(daysToMarket)
      };

      // Just pass the feed data to the hook
      await onUpdateFeedData(updatedFeedData);
      
      // Clear form
      setDailyConsumption('');
      setDaysToMarket('');
      setFeedCost('');
    } catch (err) {
      console.error('Failed to update feed data:', err);
    } finally {
      setIsUpdatingFeed(false);
    }
  };

  // Update useEffect to sync records with props
  useEffect(() => {
    setLocalFeedRecords(feedRecords);
    setLocalPerformanceMetrics(performanceMetrics);
  }, [feedRecords, performanceMetrics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Weight Tracking Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Scale className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Weight Tracking</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sample Size (birds) - Max: {currentFlockSize}
              </label>
              <input
                type="number"
                value={sampleSize}
                onChange={(e) => setSampleSize(Math.max(0, Number(e.target.value)).toString())}
                max={currentFlockSize}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Weight of Sample (kg)
              </label>
              <input
                type="number"
                value={totalWeight}
                onChange={(e) => setTotalWeight(Math.max(0, Number(e.target.value)).toString())}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Weight per Bird (kg)
            </label>
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(Math.max(0, Number(e.target.value)).toString())}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birds Below Target Weight
              </label>
              <input
                type="number"
                value={belowTarget}
                onChange={handleBelowTargetChange}
                max={Number(sampleSize)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {Number(belowTarget) + Number(aboveTarget) > Number(sampleSize) && (
                <p className="text-xs text-red-500 mt-1">
                  Total of below and above target cannot exceed sample size
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birds Above Target Weight
              </label>
              <input
                type="number"
                value={aboveTarget}
                onChange={handleAboveTargetChange}
                max={Number(sampleSize)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isWeightFormValid}
            className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                Saving...
              </>
            ) : (
              '+ Add Weight Record'
            )}
          </button>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-4">Weight Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg (kg)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target (kg)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Below (%)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Above (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedRecords.map((record) => {
                  const percentages = calculatePercentages(record);
                  return (
                    <tr key={record.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{record.sampleSize}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {record.weights.average.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{record.weights.target}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {record.weights.below} ({percentages.below}%)
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {record.weights.above} ({percentages.above}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {weightRecords.length > recordsPerPage && (
            <PaginationContainer
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Feed Data Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Feed Data</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Daily Feed Consumption (kg)
            </label>
            <input
              type="number"
              value={dailyConsumption}
              onChange={(e) => setDailyConsumption(e.target.value)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Total feed consumed by all {currentFlockSize} birds per day. 
              Per bird: {currentFlockSize > 0 && dailyConsumption ? 
                (Number(dailyConsumption) / currentFlockSize).toFixed(3) : '0'} kg
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Days Until Market Weight
            </label>
            <input
              type="number"
              value={daysToMarket}
              onChange={(e) => setDaysToMarket(e.target.value)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Based on current growth rate and target market weight
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Feed Cost (₦)
            </label>
            <input
              type="number"
              value={feedCost}
              onChange={(e) => setFeedCost(e.target.value)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Cost per bird per day: {currentFlockSize > 0 ? formatNaira(Number(feedCost) / currentFlockSize) : '₦0.00'}
            </p>
          </div>

          <button
            onClick={handleFeedDataUpdate}
            disabled={isUpdatingFeed || !isFeedDataValid}
            className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingFeed ? (
              <>
                <LoadingSpinner size="sm" />
                Updating...
              </>
            ) : (
              'Update Feed Data'
            )}
          </button>
        </div>

        {/* Add Feed Records List */}
        <div className="mt-8">
          <h3 className="font-medium text-gray-900 mb-4">Feed Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity (kg)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost (₦)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {localFeedRecords
                  .slice(
                    (feedCurrentPage - 1) * recordsPerPage,
                    feedCurrentPage * recordsPerPage
                  )
                  .map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFeedTypeColor(record.feedType)}`}>
                          {record.feedType.charAt(0).toUpperCase() + record.feedType.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {record.quantity.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {formatNaira(record.cost)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {localFeedRecords.length > recordsPerPage && (
            <PaginationContainer
              currentPage={feedCurrentPage}
              totalPages={Math.ceil(localFeedRecords.length / recordsPerPage)}
              onPageChange={setFeedCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Weight Analysis Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Scale className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Weight Analysis</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {weightRecords.length > 0 && (
            <>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-red-600 font-medium mb-2">Below Target Weight</h3>
                {(() => {
                  const totals = calculateTotals();
                  const percentage = ((totals.below / totals.total) * 100).toFixed(1);
                  return (
                    <p className="text-3xl font-bold text-red-700">
                      {totals.below} birds
                      <span className="text-lg ml-2">
                        ({percentage}%)
                      </span>
                    </p>
                  );
                })()}
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-green-600 font-medium mb-2">Above Target Weight</h3>
                {(() => {
                  const totals = calculateTotals();
                  const percentage = ((totals.above / totals.total) * 100).toFixed(1);
                  return (
                    <p className="text-3xl font-bold text-green-700">
                      {totals.above} birds
                      <span className="text-lg ml-2">
                        ({percentage}%)
                      </span>
                    </p>
                  );
                })()}
              </div>
            </>
          )}
        </div>

        {/* Weight Distribution Chart */}
        <div className="mt-6">
          {weightRecords.length > 0 ? (
            <div className="h-64">
              <LineChart
                data={weightRecords.map(record => ({
                  date: new Date(record.date).toLocaleDateString(),
                  average: record.weights.average,
                  target: record.weights.target,
                  belowPercentage: (record.weights.below / record.sampleSize) * 100,
                  abovePercentage: (record.weights.above / record.sampleSize) * 100
                }))}
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-400">Add weight records to see the distribution chart</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Performance Metrics</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg overflow-hidden">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Daily Weight Gain</h3>
            <p className="text-xl font-bold text-blue-700 truncate">
              {calculateADG(weightRecords).toFixed(4)} kg/day
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg overflow-hidden">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Feed Cost/kg Gain</h3>
            <p className="text-xl font-bold text-green-700 truncate">
              {formatNaira(calculateFeedCostPerKg(savedFeedData))}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg overflow-hidden">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Profit Margin/Bird</h3>
            <p className="text-xl font-bold text-purple-700 truncate">
              {formatNaira(calculateProfitMargin(economicData, savedFeedData))}
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg overflow-hidden">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Feed Conversion Ratio (FCR)</h3>
            <p className="text-xl font-bold text-yellow-700 truncate">
              {localPerformanceMetrics.length > 0 ? 
                localPerformanceMetrics[localPerformanceMetrics.length - 1].fcr.toFixed(2) 
                : 'N/A'
              }
            </p>
          </div>
        </div>

        {/* Add Performance Metrics Records */}
        <div className="mt-8">
          <h3 className="font-medium text-gray-900 mb-4">Performance History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADG (kg/day)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FCR</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mortality (%)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feed Cost/kg</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {localPerformanceMetrics
                  .slice(
                    (metricsCurrentPage - 1) * recordsPerPage,
                    metricsCurrentPage * recordsPerPage
                  )
                  .map((metric) => (
                    <tr key={metric.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(metric.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {metric.adg.toFixed(3)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {metric.fcr.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {metric.mortality.toFixed(1)}%
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {formatNaira(metric.feedCostPerKg)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {formatNaira(metric.profitMargin)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {localPerformanceMetrics.length > recordsPerPage && (
            <PaginationContainer
              currentPage={metricsCurrentPage}
              totalPages={Math.ceil(localPerformanceMetrics.length / recordsPerPage)}
              onPageChange={setMetricsCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
} 