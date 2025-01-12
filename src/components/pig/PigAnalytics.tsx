import React, { useState, useEffect } from 'react';
import { FeedConversionAnalytics } from './feed/FeedConversionAnalytics';
import { BreedingCycleManager } from './breeding';
import usePigFarmData from '../../hooks/usePigFarmData';
import { useAuth } from '../../contexts/AuthContext';
import { updateFarmData } from '../../services/farmService';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { GrowthPerformanceDisplay } from './GrowthPerformanceDisplay';
import { DEFAULT_GROWTH_STAGES, DEFAULT_GROWTH_PHASES, PigFarmData, BreedingCycle, FeedConversionRecord } from '../../types/pig';
import { GeneticPerformance } from './analytics/GeneticPerformance';
import { EnvironmentalImpact } from './analytics/EnvironmentalImpact';
import { Activity, TrendingUp, Scale, Warehouse, Calculator, Baby, Dna, Leaf } from 'lucide-react';
import { DataMigration } from './DataMigration';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

const PigAnalytics = () => {
  const { currentUser } = useAuth();
  const { farmData, loading, error } = usePigFarmData();
  const [breedingPage, setBreedingPage] = useState(1);
  const [feedPage, setFeedPage] = useState(1);

  // Helper function to calculate average daily gain
  function calculateAverageDailyGain(feedConversion: FeedConversionRecord[]): string {
    if (!feedConversion || feedConversion.length === 0) return '0';

    // Sort records by date, newest first
    const sortedRecords = [...feedConversion].sort((a, b) => 
      new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );

    // Calculate total weight gain and total days
    let totalWeightGain = 0;
    let totalDays = 0;

    for (const record of sortedRecords) {
      const weightGain = record.finalWeight - record.initialWeight;
      const days = (new Date(record.endDate).getTime() - new Date(record.startDate).getTime()) / (1000 * 60 * 60 * 24);
      totalWeightGain += weightGain;
      totalDays += days;
    }

    return totalDays > 0 ? (totalWeightGain / totalDays).toFixed(2) : '0';
  }

  // Helper function to calculate average FCR
  function calculateAverageFCR(feedConversion: FeedConversionRecord[]): string {
    if (!feedConversion || feedConversion.length === 0) return '0';

    // Sort records by date, get last 30 days of records
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRecords = feedConversion.filter(record => 
      new Date(record.endDate) >= thirtyDaysAgo
    );

    if (recentRecords.length === 0) return '0';

    const avgFCR = recentRecords.reduce((sum, record) => sum + record.fcr, 0) / recentRecords.length;
    return avgFCR.toFixed(2);
  }

  useEffect(() => {
    console.log('PigAnalytics mounted with data:', {
      currentUser,
      farmData,
      loading,
      error,
      stock: farmData?.stock,
      deaths: farmData?.deaths,
      calculatedMortalityRate: farmData?.deaths && farmData?.stock?.quantity ? 
        ((farmData.deaths / (farmData.stock.quantity + farmData.deaths)) * 100).toFixed(1) : '0.0'
    });
  }, [currentUser, farmData, loading, error]);

  console.log('PigAnalytics render:', { 
    hasUser: !!currentUser, 
    loading, 
    error, 
    hasFarmData: !!farmData,
    weightRecords: farmData?.weightRecords,
    feedConversion: farmData?.feedConversion,
    breedingCycles: farmData?.breedingCycles,
    geneticRecords: farmData?.geneticRecords,
    environmentalMetrics: farmData?.environmentalMetrics,
    farmDataKeys: farmData ? Object.keys(farmData) : []
  });

  const handleUpdateFarm = async (data: Partial<PigFarmData>) => {
    if (!currentUser?.uid) return;
    try {
      await updateFarmData(currentUser.uid, data);
    } catch (err) {
      console.error('Error updating farm:', err);
    }
  };

  interface StockData {
    quantity: number;
    lastUpdated: string;
  }

  // Type guard for stock object
  const hasQuantity = (stock: StockData | undefined | null): stock is StockData => {
    return stock !== null && stock !== undefined && typeof stock.quantity === 'number';
  };

  useEffect(() => {
    // Detailed data logging
    console.log('Raw farm data from database:', {
      entireData: farmData,
      keys: farmData ? Object.keys(farmData) : [],
      stockInfo: {
        stock: farmData?.stock,
        stockKeys: farmData?.stock ? Object.keys(farmData.stock) : [],
        stockQuantity: farmData?.stock?.quantity
      },
      deathInfo: {
        deaths: farmData?.deaths,
        deathsType: typeof farmData?.deaths
      }
    });
  }, [farmData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!farmData) return <DataMigration />;

  // Get the first weight record to use as current weight and calculate stats
  const currentWeight = (farmData?.weightRecords?.[0]?.weights?.average || 0) / 1000;
  const birthDate = farmData?.weightRecords?.[0]?.date || new Date().toISOString();

  // Calculate total pigs and mortality rate
  const totalPigs = farmData?.stock?.quantity || 0;
  const totalDeaths = farmData?.deaths || 0;

  // Calculate mortality rate
  const mortalityRate = (totalPigs + totalDeaths) > 0
    ? ((totalDeaths / (totalPigs + totalDeaths)) * 100).toFixed(1)
    : '0.0';

  // Debug log for stock and mortality calculations
  console.log('Overview stats calculation:', {
    rawFarmData: farmData,
    stockData: {
      stock: farmData?.stock,
      stockQuantity: farmData?.stock?.quantity,
      deaths: farmData?.deaths
    },
    calculatedValues: {
      totalPigs,
      totalDeaths,
      mortalityRate,
      mortalityCalc: `(${totalDeaths} / (${totalPigs} + ${totalDeaths})) * 100 = ${mortalityRate}%`
    }
  });

  // Calculate average daily gain from feed conversion records
  const avgDailyGain = farmData?.feedConversion?.length > 0 
    ? calculateAverageDailyGain(farmData.feedConversion)
    : '0';

  // Calculate average FCR from feed conversion records
  const avgFCR = farmData?.feedConversion?.length > 0
    ? calculateAverageFCR(farmData.feedConversion)
    : '0';

  const overviewStats = [
    {
      label: 'Total Pigs',
      value: totalPigs.toString(),
      icon: Activity,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Mortality Rate',
      value: `${mortalityRate}%`,
      icon: TrendingUp,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      label: 'Avg. Daily Gain',
      value: `${avgDailyGain} kg/day`,
      icon: Scale,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Avg. FCR (30d)',
      value: avgFCR,
      icon: Warehouse,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="flex flex-col gap-6 min-h-screen bg-gray-50 p-6">      
      <div className="flex flex-col gap-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md ${stat.bgColor} p-3`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.label}
                      </dt>
                      <dd className={`text-lg font-semibold ${stat.textColor}`}>
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feed Conversion and Breeding Management side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feed Conversion Section */}
          <ErrorBoundary fallback={<div className="p-4 bg-red-100">Error in Feed Conversion</div>}>
            <div className="relative p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Feed Conversion</h2>
              </div>
              <FeedConversionAnalytics
                feedConversion={farmData?.feedConversion || []}
                currentPage={feedPage}
                recordsPerPage={5}
                onPageChange={setFeedPage}
                onUpdate={(records) => handleUpdateFarm({ feedConversion: records })}
              />
            </div>
          </ErrorBoundary>

          {/* Breeding Section */}
          <ErrorBoundary fallback={<div className="p-4 bg-red-100">Error in Breeding Section</div>}>
            <div className="relative p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Baby className="w-5 h-5 text-pink-600" />
                <h2 className="text-xl font-semibold">Breeding Cycle Management</h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                {farmData?.breedingCycles?.length === 0 ? (
                  <div className="text-center text-gray-500">No breeding cycles yet. Add one to get started.</div>
                ) : (
                  <BreedingCycleManager
                    breedingCycles={farmData?.breedingCycles || []}
                    currentPage={breedingPage}
                    recordsPerPage={5}
                    onPageChange={setBreedingPage}
                    onUpdate={(cycles: BreedingCycle[]) => handleUpdateFarm({ breedingCycles: cycles })}
                  />
                )}
              </div>
            </div>
          </ErrorBoundary>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Genetic Performance */}
          <ErrorBoundary fallback={<div className="p-4 bg-red-100">Error in Genetic Performance</div>}>
            <div className="relative p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <GeneticPerformance
                geneticRecords={farmData?.geneticRecords || []}
                onUpdate={(records) => handleUpdateFarm({ geneticRecords: records })}
              />
            </div>
          </ErrorBoundary>

          {/* Environmental Impact */}
          <ErrorBoundary fallback={<div className="p-4 bg-red-100">Error in Environmental Impact</div>}>
            <div className="relative p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <EnvironmentalImpact
                environmentalMetrics={farmData?.environmentalMetrics || []}
                onUpdate={(metrics) => handleUpdateFarm({ environmentalMetrics: metrics })}
              />
            </div>
          </ErrorBoundary>
        </div>

        {/* Growth Performance by Phase */}
        <ErrorBoundary fallback={<div className="p-4 bg-red-100">Error in Growth Performance</div>}>
          <div className="relative p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">Growth Performance by Phase</h2>
            </div>
            <GrowthPerformanceDisplay
              feedConversion={farmData?.feedConversion || []}
            />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default PigAnalytics;