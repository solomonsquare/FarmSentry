import React from 'react';
import { Scale } from 'lucide-react';
import { WeightRecord } from '../../types';
import { WeightInputForm } from './weight/WeightInputForm';
import { WeightRecordsList } from './weight/WeightRecordsList';
import { formatDateTime } from '../../utils/date';
import { useAuth } from '../../contexts/AuthContext';
import { saveWeightRecordToDatabase } from '../../services/weight/weightRecordService';

interface Props {
  weightRecords: WeightRecord[];
  totalBirds: number;
  onUpdate: (records: WeightRecord[]) => void;
}

export function WeightTracker({ weightRecords, totalBirds, onUpdate }: Props) {
  const { currentUser } = useAuth();

  const handleAddWeightRecord = async (data: {
    sampleSize: number;
    totalWeight: number;
    targetWeight: number;
    belowTarget: number;
    aboveTarget: number;
    notes: string;
  }) => {
    if (!currentUser) return;

    try {
      const newRecord: WeightRecord = {
        id: crypto.randomUUID(),
        batchId: 'current',
        date: new Date().toISOString(),
        sampleSize: data.sampleSize,
        weights: {
          total: data.totalWeight,
          average: data.totalWeight / data.sampleSize,
          target: data.targetWeight,
          below: data.belowTarget,
          above: data.aboveTarget
        },
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to database
      const updatedRecords = await saveWeightRecordToDatabase(currentUser.uid, newRecord);
      console.log('Weight records saved successfully:', updatedRecords);
      
      // Update local state
      onUpdate(updatedRecords);
    } catch (error) {
      console.error('Failed to save weight record:', error);
      // Add error handling here
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold">Weight Tracking</h2>
      </div>

      <div className="space-y-4">
        <WeightInputForm totalBirds={totalBirds} onSubmit={handleAddWeightRecord} />

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weight Records</h3>
          <WeightRecordsList records={weightRecords} />
        </div>
      </div>
    </div>
  );
}