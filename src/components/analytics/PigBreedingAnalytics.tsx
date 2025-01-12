import React, { useState } from 'react';
import { Baby, Users, Heart, Calendar as CalendarIcon } from 'lucide-react';
import { GrowthPhase, DEFAULT_GROWTH_PHASES } from '../../types/pig';
import { FeedConversion } from '../../types/farm';
import { FeedConversionAnalytics } from '../pig/feed/FeedConversionAnalytics';

interface Props {
  breedingStats: {
    totalBreedings: number;
    successfulBreedings: number;
    averageLitterSize: number;
    weaningRate: number;
    averageWeaningAge: number;
    averageBreedingInterval: number;
    successfulFarrowings: number;
    averageLiveBorn: number;
    preWeaningMortality: number;
  };
}

// Add calculation functions
const calculateADG = (phaseData: GrowthPhase['data']): string => {
  if (!phaseData.daysInPhase) return '0';
  const gain = phaseData.endWeight - phaseData.startWeight;
  return (gain / phaseData.daysInPhase).toFixed(3);
};

const calculateFCR = (phaseData: GrowthPhase['data']): string => {
  if (!phaseData.feedConsumed || !phaseData.endWeight) return '0';
  return (phaseData.feedConsumed / phaseData.endWeight).toFixed(2);
};

const phaseColorMap: Record<string, string> = {
  Nursery: 'bg-pink-50',
  Grower: 'bg-green-50',
  Finisher: 'bg-blue-50'
};

export function PigBreedingAnalytics({ breedingStats }: Props) {
  const [fcrRecords, setFcrRecords] = useState<FeedConversion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFcrUpdate = (records: FeedConversion[]) => {
    console.log('PigBreedingAnalytics updated feed conversion:', records);
    setFcrRecords(records);
  };

  const reproductiveStats = [
    {
      label: 'Farrowing Rate',
      value: `${((breedingStats.successfulFarrowings / breedingStats.totalBreedings) * 100).toFixed(1)}%`,
      icon: Baby,
      color: 'pink'
    },
    {
      label: 'Live Born/Litter',
      value: breedingStats.averageLiveBorn.toFixed(1),
      icon: Users,
      color: 'teal'
    },
    {
      label: 'Pre-weaning Survival',
      value: `${((1 - breedingStats.preWeaningMortality) * 100).toFixed(1)}%`,
      icon: Heart,
      color: 'rose'
    },
    {
      label: 'Litters/Sow/Year',
      value: (365 / breedingStats.averageBreedingInterval).toFixed(1),
      icon: CalendarIcon,
      color: 'amber'
    }
  ];

  const growthPhases = DEFAULT_GROWTH_PHASES;

  return (
    <div className="space-y-6">
      {/* Move the Feed Conversion Calculator ABOVE growth performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <FeedConversionAnalytics
          feedConversion={fcrRecords}
          currentPage={currentPage}
          recordsPerPage={5}
          onPageChange={setCurrentPage}
          onUpdate={handleFcrUpdate}
        />
      </div>

      {/* Growth Performance Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Growth Performance by Phase</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {growthPhases.map((phase) => {
            const relevantRecords = fcrRecords.filter((rec) => rec.phase === phase.name);
            const avgFcr = relevantRecords.length
              ? (
                  relevantRecords.reduce((sum, rec) => sum + rec.fcr, 0) /
                  relevantRecords.length
                ).toFixed(2)
              : '0';

            const colorClass = phaseColorMap[phase.name] || 'bg-gray-50';

            return (
              <div key={phase.name} className={`p-4 rounded-lg ${colorClass}`}>
                <h3 className="text-sm font-medium text-gray-600">{phase.name}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {calculateADG(phase.data)} kg/day
                </p>
                <p className="text-sm text-gray-500">Average FCR: {avgFcr}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 