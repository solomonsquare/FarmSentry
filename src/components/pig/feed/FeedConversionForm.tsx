import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FeedConversionRecord } from '../../../types/pig';

interface Props {
  records: FeedConversionRecord[];
  onSubmit: (records: FeedConversionRecord[]) => void;
}

export function FeedConversionForm({ records, onSubmit }: Props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [initialWeight, setInitialWeight] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [feedConsumed, setFeedConsumed] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<'Nursery' | 'Grower' | 'Finisher'>('Nursery');

  const handleSubmit = () => {
    if (!startDate || !endDate || !initialWeight || !finalWeight || !feedConsumed) return;

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

    onSubmit([...records, newRecord]);

    // Reset form
    setStartDate('');
    setEndDate('');
    setInitialWeight('');
    setFinalWeight('');
    setFeedConsumed('');
    setSelectedPhase('Nursery');
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Growth Phase</label>
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Initial Weight (kg)</label>
          <input
            type="number"
            value={initialWeight}
            onChange={(e) => setInitialWeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Final Weight (kg)</label>
          <input
            type="number"
            value={finalWeight}
            onChange={(e) => setFinalWeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Feed Consumed (kg)</label>
          <input
            type="number"
            value={feedConsumed}
            onChange={(e) => setFeedConsumed(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!startDate || !endDate || !initialWeight || !finalWeight || !feedConsumed}
        className="mt-4 w-full flex items-center justify-center gap-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" /> Add FCR Record
      </button>
    </div>
  );
} 