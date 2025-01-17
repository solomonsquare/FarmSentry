import React from 'react';
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
  if (!data) return <ErrorMessage message="No analytics data available" />;

  const stats = [
    {
      label: 'Current Stock',
      value: data.currentFlockSize.toLocaleString(),
      icon: Activity,
      color: 'blue'
    },
    {
      label: 'Total Deaths',
      value: data.totalDeaths.toLocaleString(),
      icon: Skull,
      color: 'red'
    },
    {
      label: 'Mortality Rate',
      value: `${data.mortalityRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'yellow'
    }
  ];

  // Add farm-type specific stats
  if (category === 'birds' && data.birds) {
    stats.push(
      {
        label: 'Egg Production',
        value: data.birds.eggProduction?.toLocaleString() || '0',
        icon: Bird,
        color: 'green'
      },
      {
        label: 'Average FCR',
        value: data.birds.feedConversionRatio?.toFixed(2) || '0',
        icon: Scale,
        color: 'purple'
      }
    );
  } else if (category === 'pigs' && data.pigs) {
    stats.push(
      {
        label: 'Avg. Litter Size',
        value: data.pigs.litterSize?.toFixed(1) || '0',
        icon: Warehouse,
        color: 'green'
      },
      {
        label: 'Weaning Rate',
        value: `${data.pigs.weaningRate?.toFixed(1) || '0'}%`,
        icon: Scale,
        color: 'purple'
      },
      {
        label: 'Breeding Efficiency',
        value: `${data.pigs.breedingEfficiency?.toFixed(1) || '0'}%`,
        icon: TrendingUp,
        color: 'indigo'
      }
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {category === 'birds' ? 'Poultry' : 'Pig'} Analytics
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-xl font-semibold text-${stat.color}-600`}>
                  {stat.value}
                </p>
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
            totalBreedings: data.pigs?.totalBreedings ?? 0,
            successfulBreedings: data.pigs?.successfulBreedings ?? 0,
            averageLitterSize: data.pigs?.litterSize ?? 0,
            weaningRate: data.pigs?.weaningRate ?? 0,
            averageWeaningAge: data.pigs?.averageWeaningAge ?? 0,
            averageBreedingInterval: data.pigs?.averageBreedingInterval ?? 0,
            successfulFarrowings: data.pigs?.successfulFarrowings ?? 0,
            averageLiveBorn: data.pigs?.averageLiveBorn ?? 0,
            preWeaningMortality: data.pigs?.preWeaningMortality ?? 0
          }}
        />
      )}
    </div>
  );
} 