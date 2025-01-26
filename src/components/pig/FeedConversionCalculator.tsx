import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FeedConversion, PigFarmFeatures } from '../../types/farm';
import { PaginationContainer } from '../common/PaginationContainer';

interface Props {
  feedConversion: FeedConversion[];
  onUpdate: (records: FeedConversion[]) => void;
  currentPage: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
}

export function FeedConversionCalculator({ 
  feedConversion, 
  onUpdate,
  currentPage,
  recordsPerPage,
  onPageChange
}: Props) {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [initialWeight, setInitialWeight] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [feedConsumed, setFeedConsumed] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<'nursery' | 'grower' | 'finisher'>('nursery');

  // Calculate pagination
  const totalPages = Math.ceil(feedConversion.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = feedConversion.slice(startIndex, startIndex + recordsPerPage);

  // Simpler form validation
  const isFormValid = Boolean(
    startDate && 
    endDate && 
    initialWeight && 
    finalWeight && 
    feedConsumed && 
    Number(initialWeight) > 0 &&
    Number(finalWeight) > Number(initialWeight) &&
    Number(feedConsumed) > 0
  );

  const calculateFCR = () => {
    if (!isFormValid) {
      console.log('Form validation failed:', {
        startDate,
        endDate,
        initialWeight,
        finalWeight,
        feedConsumed
      });
      return;
    }

    const initial = Number(initialWeight);
    const final = Number(finalWeight);
    const feed = Number(feedConsumed);

    const weightGain = final - initial;
    const fcr = feed / weightGain;

    const newRecord = {
      id: Date.now().toString(),
      startDate,
      endDate,
      initialWeight: initial,
      finalWeight: final,
      feedConsumed: feed,
      fcr,
      phase: selectedPhase
    };

    console.log('Adding new FCR record:', newRecord);
    
    // Add new record to existing records
    const updatedRecords = [...feedConversion, newRecord];
    onUpdate(updatedRecords);
    onPageChange(1); // Reset to first page when adding new record

    // Reset form
    setStartDate('');
    setEndDate('');
    setInitialWeight('');
    setFinalWeight('');
    setFeedConsumed('');
    setSelectedPhase('nursery');
  };

  const handleInitialWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialWeight(e.target.value);
  };

  const handleFinalWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinalWeight(e.target.value);
  };

  const handleFeedConsumed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedConsumed(e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-teal-600" />
        <h2 className="text-xl font-semibold">{t('analytics.feedConversion.title')}</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('analytics.feedConversion.form.growthPhase')}
            </label>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value as 'nursery' | 'grower' | 'finisher')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="nursery">{t('analytics.feedConversion.phases.nursery')}</option>
              <option value="grower">{t('analytics.feedConversion.phases.grower')}</option>
              <option value="finisher">{t('analytics.feedConversion.phases.finisher')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('analytics.feedConversion.form.startDate')}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('analytics.feedConversion.form.endDate')}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('analytics.feedConversion.form.initialWeight')}
            </label>
            <input
              type="number"
              value={initialWeight}
              onChange={handleInitialWeight}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('analytics.feedConversion.form.finalWeight')}
            </label>
            <input
              type="number"
              value={finalWeight}
              onChange={handleFinalWeight}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('analytics.feedConversion.form.feedConsumed')}
            </label>
            <input
              type="number"
              value={feedConsumed}
              onChange={handleFeedConsumed}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <button
          onClick={calculateFCR}
          disabled={!isFormValid}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('analytics.feedConversion.form.addRecord')}
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('analytics.feedConversion.history')}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    {t('analytics.feedConversion.table.phase')}
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    {t('analytics.feedConversion.table.dateRange')}
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                    {t('analytics.feedConversion.table.initialWeight')}
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                    {t('analytics.feedConversion.table.finalWeight')}
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                    {t('analytics.feedConversion.table.feedConsumed')}
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                    {t('analytics.feedConversion.table.fcr')}
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                    {t('analytics.feedConversion.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {t(`analytics.feedConversion.phases.${record.phase.toLowerCase()}`)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {record.startDate} to {record.endDate}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {record.initialWeight.toFixed(1)} kg
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {record.finalWeight.toFixed(1)} kg
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {record.feedConsumed.toFixed(1)} kg
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {record.fcr.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {/* Actions column content */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {feedConversion.length > recordsPerPage && (
            <div className="mt-4">
              <PaginationContainer
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}