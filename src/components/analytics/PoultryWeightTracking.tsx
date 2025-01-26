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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

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

  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const animalType = t('farm.birds');

  const inputClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-400 focus:border-indigo-400' 
      : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
  }`;

  const labelClasses = `block text-sm font-medium mb-1 ${
    isDarkMode ? 'text-gray-200' : 'text-gray-700'
  }`;

  const cardClasses = `rounded-lg shadow-sm p-6 ${
    isDarkMode ? 'bg-gray-800' : 'bg-white'
  }`;

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
      <div className={cardClasses}>
        <div className="flex items-center gap-2 mb-6">
          <Scale className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t('analytics.weightTracking.title')}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                {t('analytics.weightTracking.sampleSize', { animal: animalType, max: currentFlockSize })}
              </label>
              <input
                type="number"
                value={sampleSize}
                onChange={(e) => setSampleSize(Math.max(0, Number(e.target.value)).toString())}
                max={currentFlockSize}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>
                {t('analytics.weightTracking.totalWeight')}
              </label>
              <input
                type="number"
                value={totalWeight}
                onChange={(e) => setTotalWeight(Math.max(0, Number(e.target.value)).toString())}
                step="0.01"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              {t('analytics.weightTracking.targetWeight', { animal: animalType })}
            </label>
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(Math.max(0, Number(e.target.value)).toString())}
              step="0.01"
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                {t('analytics.weightTracking.belowTarget', { animal: animalType })}
              </label>
              <input
                type="number"
                value={belowTarget}
                onChange={handleBelowTargetChange}
                max={Number(sampleSize)}
                className={inputClasses}
              />
              {Number(belowTarget) + Number(aboveTarget) > Number(sampleSize) && (
                <p className="text-xs text-red-500 mt-1">
                  {t('analytics.weightTracking.totalExceedError')}
                </p>
              )}
            </div>
            <div>
              <label className={labelClasses}>
                {t('analytics.weightTracking.aboveTarget', { animal: animalType })}
              </label>
              <input
                type="number"
                value={aboveTarget}
                onChange={handleAboveTargetChange}
                max={Number(sampleSize)}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              {t('analytics.weightTracking.notes')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputClasses} resize-none`}
              rows={3}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isWeightFormValid}
            className={`w-full py-2 px-4 text-white font-medium rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDarkMode 
                ? 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-400 focus:ring-offset-gray-800' 
                : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500'
            }`}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                {t('common.saving')}
              </>
            ) : (
              t('common.save')
            )}
          </button>
        </div>

        <div className="mt-6">
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t('analytics.weightTracking.weightRecords')}
          </h2>
          
          {/* Weight Records Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    {t('analytics.weightTracking.sampleSize', { animal: animalType, max: currentFlockSize })}
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    {t('analytics.weightTracking.averageWeight')}
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    {t('analytics.weightTracking.targetWeight', { animal: animalType })}
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    {t('analytics.weightTracking.belowTarget', { animal: animalType })}
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    {t('analytics.weightTracking.aboveTarget', { animal: animalType })}
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {displayedRecords.map((record) => {
                  const percentages = calculatePercentages(record);
                  return (
                    <tr key={record.id} className={isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{record.sampleSize}</td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {record.weights.average.toFixed(2)}
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{record.weights.target}</td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {record.weights.below} ({percentages.below}%)
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
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
      <div className={cardClasses}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t('analytics.feedData.title')}
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className={labelClasses}>
              {t('analytics.feedData.totalConsumption')}
            </label>
            <input
              type="number"
              value={dailyConsumption}
              onChange={(e) => setDailyConsumption(e.target.value)}
              min="0"
              step="0.1"
              className={inputClasses}
            />
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('analytics.feedData.consumptionSummary', { 
                total: currentFlockSize,
                animal: animalType,
                amount: currentFlockSize > 0 && dailyConsumption ? 
                  (Number(dailyConsumption) / currentFlockSize).toFixed(3) : '0'
              })}
            </p>
          </div>

          <div>
            <label className={labelClasses}>
              {t('analytics.feedData.estimatedDays')}
            </label>
            <input
              type="number"
              value={daysToMarket}
              onChange={(e) => setDaysToMarket(e.target.value)}
              min="0"
              className={inputClasses}
            />
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('analytics.feedData.estimatedDaysNote')}
            </p>
          </div>

          <div>
            <label className={labelClasses}>
              {t('analytics.feedData.dailyCost')}
            </label>
            <input
              type="number"
              value={feedCost}
              onChange={(e) => setFeedCost(e.target.value)}
              min="0"
              className={inputClasses}
            />
          </div>

          <button
            onClick={handleFeedDataUpdate}
            disabled={isUpdatingFeed || !isFeedDataValid}
            className={`w-full py-2 px-4 text-white font-medium rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDarkMode 
                ? 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-400 focus:ring-offset-gray-800' 
                : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500'
            }`}
          >
            {isUpdatingFeed ? (
              <>
                <LoadingSpinner size="sm" />
                {t('common.updating')}
              </>
            ) : (
              t('common.update')
            )}
          </button>
        </div>

        {/* Feed Records Section */}
        <div className="mt-8">
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t('analytics.feedData.records')}
          </h2>
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('common.date')}
                  </th>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('analytics.feedData.type')}
                  </th>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('common.quantity')}
                  </th>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('analytics.feedData.cost')}
                  </th>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('analytics.feedData.notes')}
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {localFeedRecords
                  .slice(
                    (feedCurrentPage - 1) * recordsPerPage,
                    feedCurrentPage * recordsPerPage
                  )
                  .map((record) => (
                    <tr key={record.id} className={isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFeedTypeColor(record.feedType)}`}>
                          {record.feedType.charAt(0).toUpperCase() + record.feedType.slice(1)}
                        </span>
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {record.quantity.toFixed(2)}
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatNaira(record.cost)}
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
      <div className={cardClasses}>
        <div className="flex items-center gap-2 mb-6">
          <Scale className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t('analytics.weightAnalysis.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {weightRecords.length > 0 && (
            <>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  {t('analytics.weightTracking.belowTarget', { animal: animalType })}
                </h3>
                {(() => {
                  const totals = calculateTotals();
                  const percentage = ((totals.below / totals.total) * 100).toFixed(1);
                  return (
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                      {totals.below}
                      <span className="text-lg ml-2">({percentage}{t('common.percentageSymbol')})</span>
                    </p>
                  );
                })()}
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {t('analytics.weightTracking.aboveTarget', { animal: animalType })}
                </h3>
                {(() => {
                  const totals = calculateTotals();
                  const percentage = ((totals.above / totals.total) * 100).toFixed(1);
                  return (
                    <p className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                      {totals.above}
                      <span className="text-lg ml-2">({percentage}{t('common.percentageSymbol')})</span>
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
              <p className="text-gray-400">{t('analytics.weightTracking.noWeightRecords')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics Section */}
      <div className={cardClasses}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t('analytics.feedConversion.history')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg overflow-hidden ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('analytics.stats.avgDailyGain')}
            </h3>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} truncate`}>
              {calculateADG(weightRecords).toFixed(4)} {t('common.kgPerDay')}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg overflow-hidden ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
            <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('analytics.feedConversion.feedCostPerKg')}
            </h3>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'} truncate`}>
              {formatNaira(calculateFeedCostPerKg(savedFeedData))}
            </p>
          </div>

          <div className={`p-4 rounded-lg overflow-hidden ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
            <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('analytics.feedConversion.profitMargin')}
            </h3>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'} truncate`}>
              {formatNaira(calculateProfitMargin(economicData, savedFeedData))}
            </p>
          </div>

          <div className={`p-4 rounded-lg overflow-hidden ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
            <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('analytics.stats.avgFCR')}
            </h3>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'} truncate`}>
              {localPerformanceMetrics.length > 0 ? 
                localPerformanceMetrics[localPerformanceMetrics.length - 1].fcr.toFixed(2) 
                : t('common.notAvailable')
              }
            </p>
          </div>
        </div>

        {/* Add Performance Metrics Records */}
        <div className="mt-8">
          <h3 className={`font-medium text-gray-900 mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t('analytics.feedConversion.history')}
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('common.date')}
                  </th>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('analytics.stats.avgDailyGain')}
                  </th>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('analytics.stats.avgFCR')}
                  </th>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('analytics.stats.mortalityRate')}
                  </th>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('analytics.feedConversion.feedCostPerKg')}
                  </th>
                  <th className={`px-4 py-2 text-left text-xs font-medium tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('analytics.feedConversion.profitMargin')}
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {localPerformanceMetrics
                  .slice(
                    (metricsCurrentPage - 1) * recordsPerPage,
                    metricsCurrentPage * recordsPerPage
                  )
                  .map((metric) => (
                    <tr key={metric.id} className={isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {new Date(metric.date).toLocaleDateString()}
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {metric.adg.toFixed(3)} {t('common.kgPerDay')}
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {metric.fcr.toFixed(2)}
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {metric.mortality.toFixed(1)}{t('common.percentageSymbol')}
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatNaira(metric.feedCostPerKg)}
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
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