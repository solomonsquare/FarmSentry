import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [initialWeight, setInitialWeight] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [feedConsumed, setFeedConsumed] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<'Nursery' | 'Grower' | 'Finisher'>('Nursery');

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
    setSelectedPhase('Nursery');
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
        <h2 className="text-xl font-semibold">Feed Conversion Calculator</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Growth Phase
            </label>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value as 'Nursery' | 'Grower' | 'Finisher')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="Nursery">Nursery</option>
              <option value="Grower">Grower</option>
              <option value="Finisher">Finisher</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
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
              End Date
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
              Initial Weight (kg)
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
              Final Weight (kg)
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
              Feed Consumed (kg)
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
          Calculate FCR
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            FCR History
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Phase
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Period
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                    Initial Weight
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                    Final Weight
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                    Feed Consumed
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                    FCR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {record.phase}
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