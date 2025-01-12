import React, { useState } from 'react';
import { BreedingCycle } from '../../../types/pig';

interface Props {
  onSubmit: (cycle: Omit<BreedingCycle, 'id'>) => void;
  onCancel: () => void;
  initialData?: BreedingCycle;
}

export function BreedingCycleForm({ onSubmit, onCancel, initialData }: Props) {
  const [sowId, setSowId] = useState(initialData?.sow || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [status, setStatus] = useState<'active' | 'completed' | 'pending'>(initialData?.status || 'pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate expected due date (typically 114 days for pigs)
    const startDateObj = new Date(startDate);
    const expectedDueDate = new Date(startDateObj);
    expectedDueDate.setDate(startDateObj.getDate() + 114);

    onSubmit({
      sow: sowId,
      startDate,
      expectedDueDate: expectedDueDate.toISOString(),
      status
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sow ID</label>
          <input
            type="text"
            value={sowId}
            onChange={(e) => setSowId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Enter Sow ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'completed' | 'pending')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Breeding Cycle
        </button>
      </div>
    </form>
  );
} 