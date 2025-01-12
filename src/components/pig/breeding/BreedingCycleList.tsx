import React from 'react';
import { BreedingCycle } from '../../../types/pig';

interface Props {
  cycles: BreedingCycle[];
  onSelect?: (cycle: BreedingCycle) => void;
}

export function BreedingCycleList({ cycles, onSelect }: Props) {
  return (
    <div className="space-y-4">
      {cycles.map(cycle => (
        <div 
          key={cycle.id}
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
          onClick={() => onSelect?.(cycle)}
        >
          <h3 className="font-medium">Sow {cycle.sow}</h3>
          <p className="text-sm text-gray-600">Started: {cycle.startDate}</p>
          <p className="text-sm text-gray-600">Due: {cycle.expectedDueDate}</p>
          <span className={`text-xs px-2 py-1 rounded ${
            cycle.status === 'active' ? 'bg-green-100 text-green-800' :
            cycle.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {cycle.status}
          </span>
        </div>
      ))}
      {cycles.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No breeding cycles found
        </div>
      )}
    </div>
  );
} 