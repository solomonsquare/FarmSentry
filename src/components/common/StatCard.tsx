import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ label, value, icon: Icon, color }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</h3>
      </div>
      <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
    </div>
  );
}