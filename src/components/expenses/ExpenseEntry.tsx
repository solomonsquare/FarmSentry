import React from 'react';
import { formatNaira, calculatePerBirdCost } from '../../utils/currency';

interface Props {
  label: string;
  tooltip: string;
  value: number;
  totalBirds: number;
  onChange: (value: number) => void;
}

export function ExpenseEntry({ label, tooltip, value, totalBirds, onChange }: Props) {
  const perBird = calculatePerBirdCost(value, totalBirds);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700" title={tooltip}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        min="0"
      />
      <p className="mt-1 text-sm text-gray-500">
        Per bird: {formatNaira(perBird)}
      </p>
    </div>
  );
}