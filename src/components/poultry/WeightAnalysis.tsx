import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WeightRecord } from '../../types';
import { Scale } from 'lucide-react';

interface Props {
  weightRecords: WeightRecord[];
}

export function WeightAnalysis({ weightRecords }: Props) {
  // Calculate totals from all records
  const totalBelowTarget = weightRecords.reduce((sum, record) => sum + record.weights.below, 0);
  const totalAboveTarget = weightRecords.reduce((sum, record) => sum + record.weights.above, 0);
  const totalSampleSize = weightRecords.reduce((sum, record) => sum + record.sampleSize, 0);

  const chartData = weightRecords.map(record => ({
    date: record.date,
    average: record.weights.average,
    target: record.weights.target,
    belowTarget: (record.weights.below / record.sampleSize) * 100,
    aboveTarget: (record.weights.above / record.sampleSize) * 100
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">Weight Analysis</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-700 mb-1">Below Target Weight</h3>
          <p className="text-2xl font-bold text-red-700">{totalBelowTarget} birds</p>
          {totalSampleSize > 0 && (
            <p className="text-sm text-red-600">
              {((totalBelowTarget / totalSampleSize) * 100).toFixed(1)}% of total samples
            </p>
          )}
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-700 mb-1">Above Target Weight</h3>
          <p className="text-2xl font-bold text-green-700">{totalAboveTarget} birds</p>
          {totalSampleSize > 0 && (
            <p className="text-sm text-green-600">
              {((totalAboveTarget / totalSampleSize) * 100).toFixed(1)}% of total samples
            </p>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="#3b82f6" name="Average Weight" />
              <Line type="monotone" dataKey="target" stroke="#10b981" name="Target Weight" />
              <Line type="monotone" dataKey="belowTarget" stroke="#ef4444" name="Below Target %" />
              <Line type="monotone" dataKey="aboveTarget" stroke="#8b5cf6" name="Above Target %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}