import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { PigFarmFeatures } from '../../types/farm';

interface Props {
  breedingCycles: PigFarmFeatures['breedingCycles'];
  onUpdate: (cycles: PigFarmFeatures['breedingCycles']) => void;
}

export function BreedingCycleManager({ breedingCycles, onUpdate }: Props) {
  const [sowId, setSowId] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleAddCycle = () => {
    if (!sowId || !startDate) return;

    const expectedDueDate = new Date(startDate);
    expectedDueDate.setDate(expectedDueDate.getDate() + 114); // Average pig gestation period

    const newCycle = {
      id: Date.now().toString(),
      sow: sowId,
      startDate,
      expectedDueDate: expectedDueDate.toISOString().split('T')[0],
      status: 'pending' as const
    };

    onUpdate([...breedingCycles, newCycle]);
    setSowId('');
    setStartDate('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold">Breeding Cycle Management</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sow ID</label>
            <input
              type="text"
              value={sowId}
              onChange={(e) => setSowId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter sow identifier"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          onClick={handleAddCycle}
          disabled={!sowId || !startDate}
          className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" /> Add Breeding Cycle
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Breeding Cycles</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sow ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Start Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Expected Due Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {breedingCycles.map((cycle) => (
                  <tr key={cycle.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{cycle.sow}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{cycle.startDate}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{cycle.expectedDueDate}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cycle.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : cycle.status === 'active'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                      </span>
                    </td>
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