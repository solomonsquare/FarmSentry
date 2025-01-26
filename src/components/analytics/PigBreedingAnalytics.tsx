import React, { useState } from 'react';
import { Baby, Users, Heart, CalendarIcon } from 'lucide-react';
import { GrowthPhase, DEFAULT_GROWTH_PHASES } from '../../types/pig';
import { FeedConversion } from '../../types/farm';
import { FeedConversionAnalytics } from '../pig/feed/FeedConversionAnalytics';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

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
  nursery: 'bg-pink-50',
  grower: 'bg-green-50',
  finisher: 'bg-blue-50'
};

export function PigBreedingAnalytics({ breedingStats }: Props) {
  const [fcrRecords, setFcrRecords] = useState<FeedConversion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

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

  const cardClasses = `rounded-lg shadow-sm p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  return (
    <div className="space-y-6">
      {/* Move the Feed Conversion Calculator ABOVE growth performance */}
      <div className={cardClasses}>
        <FeedConversionAnalytics
          feedConversion={fcrRecords}
          currentPage={currentPage}
          recordsPerPage={5}
          onPageChange={setCurrentPage}
          onUpdate={handleFcrUpdate}
        />
      </div>

      {/* Reproductive Performance Stats */}
      <div className={cardClasses}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('analytics.reproductivePerformance.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reproductiveStats.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-lg ${
                isDarkMode 
                  ? `bg-${stat.color}-900/20` 
                  : `bg-${stat.color}-50`
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-5 h-5 ${
                  isDarkMode 
                    ? `text-${stat.color}-400` 
                    : `text-${stat.color}-600`
                }`} />
                <h3 className={`text-sm font-medium ${
                  isDarkMode 
                    ? 'text-gray-300' 
                    : 'text-gray-600'
                }`}>
                  {stat.label}
                </h3>
              </div>
              <p className={`text-2xl font-bold ${
                isDarkMode 
                  ? `text-${stat.color}-400` 
                  : `text-${stat.color}-700`
              }`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Performance Section */}
      <div className={cardClasses}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('analytics.growthPerformance.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {growthPhases.map((phase) => {
            const relevantRecords = fcrRecords.filter((rec) => rec.phase === phase.name);
            const avgFcr = relevantRecords.length
              ? (
                  relevantRecords.reduce((sum, rec) => sum + rec.fcr, 0) /
                  relevantRecords.length
                ).toFixed(2)
              : '0';

            return (
              <div 
                key={phase.name} 
                className={`p-4 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700/50' 
                    : 'bg-gray-50'
                }`}
              >
                <h3 className={`text-sm font-medium mb-2 ${
                  isDarkMode 
                    ? 'text-gray-300' 
                    : 'text-gray-600'
                }`}>
                  {t(`analytics.growthPhases.${phase.name}`)}
                </h3>
                <p className={`text-2xl font-bold ${
                  isDarkMode 
                    ? 'text-gray-100' 
                    : 'text-gray-900'
                }`}>
                  {calculateADG(phase.data)} {t('analytics.metrics.kgPerDay')}
                </p>
                <p className={`text-sm ${
                  isDarkMode 
                    ? 'text-gray-400' 
                    : 'text-gray-500'
                }`}>
                  {t('analytics.metrics.averageFcr')}: {avgFcr}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 