import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { PigFarmFeatures } from '../../types/farm';
import { formatDateTime } from '../../utils/date';

interface Props {
  weightRecords: PigFarmFeatures['weightRecords'];
  onUpdate: (records: PigFarmFeatures['weightRecords']) => void;
}

export function WeightTracker({ weightRecords, onUpdate }: Props) {
  const [pigId, setPigId] = useState('');
  const [weight, setWeight] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const handleAddRecord = () => {
    if (!pigId || weight <= 0) return;

    const { date } = formatDateTime();
    
    const newRecord = {
      id: Date.now().toString(),
      date,
      pigId,
      weight,
      notes
    };

    onUpdate([...weightRecords, newRecord]);
    setPigId('');
    setWeight(0);
    setNotes('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">Weight Tracking</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pig ID</label>
            <input
              type="text"
              value={pigId}
              onChange={(e) => setPigId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter pig identifier"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              value={weight || ''}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            placeholder="Optional notes about the weight record"
          />
        </div>

        <button
          onClick={handleAddRecord}
          disabled={!pigId || weight <= 0}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Weight Record
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Weight Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Pig ID</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Weight (kg)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {weightRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.pigId}</td>
                    <td className="px-4 py-2 text-sm text-right">{record.weight.toFixed(1)}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}