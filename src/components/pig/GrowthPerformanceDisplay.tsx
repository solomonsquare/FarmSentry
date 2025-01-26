import React from 'react';
import { FeedConversionRecord, GrowthPhase } from '../../types/pig';
import { Scale, TrendingUp, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  feedConversion: FeedConversionRecord[];
}

export function GrowthPerformanceDisplay({ feedConversion }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  // Calculate performance metrics for each phase
  const calculatePhaseMetrics = (phase: 'nursery' | 'grower' | 'finisher') => {
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

  const phases: ('nursery' | 'grower' | 'finisher')[] = ['nursery', 'grower', 'finisher'];
  const phaseMetrics = phases.map(phase => ({
    phase,
    ...calculatePhaseMetrics(phase)
  }));

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'nursery':
        return isDarkMode ? 'text-pink-400' : 'text-pink-600';
      case 'grower':
        return isDarkMode ? 'text-emerald-400' : 'text-emerald-600';
      case 'finisher':
        return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      default:
        return isDarkMode ? 'text-gray-100' : 'text-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phaseMetrics.map(({ phase, avgDailyGain, avgFCR, totalFeedConsumed, daysInPhase }) => (
          <div 
            key={phase} 
            className={`p-4 rounded-lg shadow-sm border ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Scale className={`w-5 h-5 ${getPhaseColor(phase)}`} />
              <h3 className={`text-lg font-semibold ${getPhaseColor(phase)}`}>
                {t(`analytics.growthPerformance.${phase}Phase`)}
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('analytics.growthPerformance.avgDailyGain')}:
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {avgDailyGain.toFixed(2)} {t('common.kgPerDay')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('analytics.growthPerformance.avgFCR')}:
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {avgFCR.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('analytics.growthPerformance.feedConsumed')}:
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {totalFeedConsumed.toFixed(1)} {t('common.kg')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('analytics.growthPerformance.daysInPhase')}:
                </span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {Math.round(daysInPhase)} {t('common.days')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 