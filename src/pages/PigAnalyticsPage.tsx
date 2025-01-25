import React from 'react';
import { useTranslation } from 'react-i18next';
import PigAnalytics from '../components/pig/PigAnalytics';
import usePigFarmData from '../hooks/usePigFarmData';

export function PigAnalyticsPage() {
  const { t, i18n } = useTranslation();
  const { farmData, loading, error } = usePigFarmData();

  // Debug logging
  console.log('Current language:', i18n.language);
  console.log('Translation for farm.pigFarm:', t('farm.pigFarm'));
  console.log('Available languages:', i18n.languages);
  console.log('Translation store:', i18n.store.data);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {t('farm.pigFarm')}
      </h1>
      <PigAnalytics />
    </div>
  );
}