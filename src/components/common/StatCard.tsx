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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 text-${color}-600`} />
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      </div>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );
}