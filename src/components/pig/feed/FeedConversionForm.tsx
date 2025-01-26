import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import { Plus } from 'lucide-react';
import { FeedConversionRecord } from '../../../types/pig';

interface Props {
  records: FeedConversionRecord[];
  onSubmit: (records: FeedConversionRecord[]) => void;
}

export function FeedConversionForm({ records, onSubmit }: Props) {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [initialWeight, setInitialWeight] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [feedConsumed, setFeedConsumed] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<'nursery' | 'grower' | 'finisher'>('nursery');

  // Form validation
  const isFormValid = Boolean(
    startDate && 
    endDate && 
    initialWeight && 
    finalWeight && 
    feedConsumed && 
    Number(initialWeight) > 0 &&
    Number(finalWeight) > Number(initialWeight) &&
    Number(feedConsumed) > 0
  );

  const handleSubmit = () => {
    if (!isFormValid) return;

    const initial = Number(initialWeight);
    const final = Number(finalWeight);
    const feed = Number(feedConsumed);

    const weightGain = final - initial;
    const fcr = feed / weightGain;

    const newRecord: FeedConversionRecord = {
      id: Date.now().toString(),
      startDate,
      endDate,
      initialWeight: initial,
      finalWeight: final,
      feedConsumed: feed,
      fcr,
      phase: selectedPhase
    };

    onSubmit([...records, newRecord]);

    // Reset form
    setStartDate('');
    setEndDate('');
    setInitialWeight('');
    setFinalWeight('');
    setFeedConsumed('');
    setSelectedPhase('nursery');
  };

  const inputClasses = `mt-1 block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-700 text-gray-100'
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClasses = `block text-sm font-medium ${
    isDarkMode ? 'text-gray-300' : 'text-gray-700'
  }`;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses}>{t('analytics.feedConversion.form.growthPhase')}</label>
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value as 'nursery' | 'grower' | 'finisher')}
            className={inputClasses}
          >
            <option value="nursery">{t('analytics.feedConversion.phases.nursery')}</option>
            <option value="grower">{t('analytics.feedConversion.phases.grower')}</option>
            <option value="finisher">{t('analytics.feedConversion.phases.finisher')}</option>
          </select>
        </div>

        <div>
          <label className={labelClasses}>{t('analytics.feedConversion.form.startDate')}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>{t('analytics.feedConversion.form.endDate')}</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className={labelClasses}>
            {t('analytics.feedConversion.form.initialWeight')}
          </label>
          <input
            type="number"
            value={initialWeight}
            onChange={(e) => setInitialWeight(e.target.value)}
            className={inputClasses}
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className={labelClasses}>
            {t('analytics.feedConversion.form.finalWeight')}
          </label>
          <input
            type="number"
            value={finalWeight}
            onChange={(e) => setFinalWeight(e.target.value)}
            className={inputClasses}
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className={labelClasses}>
            {t('analytics.feedConversion.form.feedConsumed')}
          </label>
          <input
            type="number"
            value={feedConsumed}
            onChange={(e) => setFeedConsumed(e.target.value)}
            className={inputClasses}
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md ${
            isDarkMode 
              ? 'bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed' 
              : 'bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {t('analytics.feedConversion.form.addRecord')}
        </button>
      </div>
    </div>
  );
} 