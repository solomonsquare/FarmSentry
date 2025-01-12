import React from 'react';
import { FeedConversionRecord, GrowthPhase } from '../../types/pig';
import { Scale, TrendingUp, Calendar } from 'lucide-react';

interface Props {
  feedConversion: FeedConversionRecord[];
}

export function GrowthPerformanceDisplay({ feedConversion }: Props) {
  // Calculate performance metrics for each phase
  const calculatePhaseMetrics = (phase: 'Nursery' | 'Grower' | 'Finisher') => {
    const phaseRecords = feedConversion.filter(record => record.phase === phase);
    
    if (phaseRecords.length === 0) {
      return {
        avgDailyGain: 0,
        avgFCR: 0,
        totalFeedConsumed: 0,
        daysInPhase: 0
      };
    }

    let totalWeightGain = 0;
    let totalDays = 0;
    let totalFeedConsumed = 0;
    let totalFCR = 0;

    phaseRecords.forEach(record => {
      const weightGain = record.finalWeight - record.initialWeight;
      const days = (new Date(record.endDate).getTime() - new Date(record.startDate).getTime()) / (1000 * 60 * 60 * 24);
      
      totalWeightGain += weightGain;
      totalDays += days;
      totalFeedConsumed += record.feedConsumed;
      totalFCR += record.fcr;
    });

    return {
      avgDailyGain: totalDays > 0 ? totalWeightGain / totalDays : 0,
      avgFCR: phaseRecords.length > 0 ? totalFCR / phaseRecords.length : 0,
      totalFeedConsumed,
      daysInPhase: totalDays
    };
  };

  const phases: ('Nursery' | 'Grower' | 'Finisher')[] = ['Nursery', 'Grower', 'Finisher'];
  const phaseMetrics = phases.map(phase => ({
    phase,
    ...calculatePhaseMetrics(phase)
  }));

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Nursery':
        return 'text-pink-600';
      case 'Grower':
        return 'text-emerald-600';
      case 'Finisher':
        return 'text-blue-600';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phaseMetrics.map(({ phase, avgDailyGain, avgFCR, totalFeedConsumed, daysInPhase }) => (
          <div key={phase} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Scale className={`w-5 h-5 ${getPhaseColor(phase)}`} />
              <h3 className={`text-lg font-semibold ${getPhaseColor(phase)}`}>{phase} Phase</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Avg. Daily Gain:</span>
                <span className="text-sm font-medium text-gray-900">{avgDailyGain.toFixed(2)} kg/day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Avg. FCR:</span>
                <span className="text-sm font-medium text-gray-900">{avgFCR.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Feed Consumed:</span>
                <span className="text-sm font-medium text-gray-900">{totalFeedConsumed.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Days in Phase:</span>
                <span className="text-sm font-medium text-gray-900">{Math.round(daysInPhase)} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 