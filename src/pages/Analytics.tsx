import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalyticsData } from '../hooks/analytics/useAnalyticsData';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { FarmCategory, WeightRecord } from '../types';
import { Bird, Warehouse, TrendingUp, Scale, Activity, Skull } from 'lucide-react';
import { PoultryWeightTracking } from '../components/analytics/PoultryWeightTracking';
import { PigBreedingAnalytics } from '../components/analytics/PigBreedingAnalytics';

interface Props {
  category: FarmCategory;
}

export function Analytics({ category }: Props) {
  const { t } = useTranslation();
  const farmType = t(category === 'birds' ? 'farm.poultryFarm' : 'farm.pigFarm');
  const farmTypeKey = category === 'birds' ? 'poultryFarm' : 'pigFarm';
  const { 
    data, 
    loading, 
    error, 
    updateWeightRecord,
    updateFeedData,
    updateStockData 
  } = useAnalyticsData(category);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <ErrorMessage message={t('common.error.noData')} />;

  const stats = [
    {
      label: t('dashboard.stats.currentStock'),
      value: data.currentFlockSize.toLocaleString(),
      icon: Activity,
      color: 'blue'
    },
    {
      label: t('dashboard.stats.deaths'),
      value: data.totalDeaths.toLocaleString(),
      icon: Skull,
      color: 'red'
    },
    {
      label: t('analytics.stats.mortalityRate'),
      value: `${data.mortalityRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'yellow'
    }
  ];

  // Add farm-type specific stats
  if (category === 'birds' && data.birds) {
    stats.push(
      {
        label: t('analytics.feedConversion.title'),
        value: data.birds.feedConversionRatio?.toFixed(2) || '0',
        icon: Scale,
        color: 'purple'
      }
    );
  } else if (category === 'pigs' && data.pigs) {
    stats.push(
      {
        label: t('analytics.stats.totalPigs'),
        value: data.pigs.litterSize?.toFixed(1) || '0',
        icon: Warehouse,
        color: 'green'
      },
      {
        label: t('analytics.stats.avgDailyGain'),
        value: `${data.pigs.weaningRate?.toFixed(1) || '0'} kg/day`,
        icon: Scale,
        color: 'purple'
      },
      {
        label: t('analytics.stats.avgFCR'),
        value: data.pigs.breedingEfficiency?.toFixed(2) || '0',
        icon: TrendingUp,
        color: 'indigo'
      }
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {category === 'birds' ? t('analytics.poultryFarmAnalytics') : t('analytics.pigFarmAnalytics')}
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md bg-${stat.color}-100 p-3`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.label}
                  </dt>
                  <dd className={`text-lg font-semibold text-${stat.color}-600`}>
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {category === 'birds' ? (
        <PoultryWeightTracking
          currentFlockSize={data.currentFlockSize}
          initialWeightRecords={data.weightRecords}
          onAddRecord={updateWeightRecord}
          feedData={{
            dailyConsumption: data.birds?.dailyFeedConsumption ?? 0,
            feedCost: data.birds?.feedCost ?? 0,
            daysToMarket: data.birds?.daysToMarket ?? 0
          }}
          feedRecords={data.birds?.feedRecords ?? []}
          onUpdateFeedData={updateFeedData}
          economicData={{
            costPerBird: data.birds?.costPerBird ?? 0,
            revenuePerBird: data.birds?.revenuePerBird ?? 0
          }}
          performanceMetrics={data.birds?.performanceMetrics ?? []}
        />
      ) : (
        <PigBreedingAnalytics
          breedingStats={{
            totalBreedings: data.pigs?.totalBreedings || 0,
            successfulBreedings: data.pigs?.successfulBreedings || 0,
            averageLitterSize: data.pigs?.litterSize || 0,
            weaningRate: data.pigs?.weaningRate || 0,
            averageWeaningAge: data.pigs?.averageWeaningAge || 0,
            averageBreedingInterval: data.pigs?.averageBreedingInterval || 0,
            successfulFarrowings: data.pigs?.successfulFarrowings || 0,
            averageLiveBorn: data.pigs?.averageLiveBorn || 0,
            preWeaningMortality: data.pigs?.preWeaningMortality || 0
          }}
        />
      )}
    </div>
  );
} 