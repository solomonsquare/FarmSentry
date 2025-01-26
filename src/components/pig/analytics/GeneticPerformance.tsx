import React, { useState, Fragment } from 'react';
import { GeneticRecord, DEFAULT_PIG_BREEDS } from '../../../types/pig';
import { PaginationContainer } from '../../common/PaginationContainer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, Transition } from '@headlessui/react';
import { Dna, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import { formatDate } from '../../../utils/date';

interface Props {
  geneticRecords: GeneticRecord[];
  onUpdate: (records: GeneticRecord[]) => void;
}

interface GeneticRecordForm {
  breedingLine: string;
  improvements: string[];
  date: string;
  type: 'improvement' | 'deterioration';
}

// Predefined changes keys
const IMPROVEMENT_CHANGES = [
  'improved_growth_rate',
  'better_feed_efficiency',
  'increased_litter_size',
  'better_disease_resistance',
  'improved_meat_quality',
  'higher_survival_rate',
  'better_mothering_ability'
];

const DETERIORATION_CHANGES = [
  'decreased_growth_rate',
  'bad_feed_efficiency',
  'decreased_litter_size',
  'poor_disease_resistance',
  'poor_meat_quality',
  'lower_survival_rate',
  'poor_mothering_ability'
];

export function GeneticPerformance({ geneticRecords = [], onUpdate }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [localRecords, setLocalRecords] = useState<GeneticRecord[]>(geneticRecords);
  const [formData, setFormData] = useState<GeneticRecordForm>({
    breedingLine: '',
    improvements: [],
    date: new Date().toISOString().split('T')[0],
    type: 'improvement'
  });

  // Update local records when prop changes
  React.useEffect(() => {
    setLocalRecords(geneticRecords);
  }, [geneticRecords]);

  // Helper function to translate changes based on current language
  const translateChanges = (changes: string[]): string[] => {
    return changes.map(change => {
      const translationKey = `analytics.geneticPerformance.changes.${change}`;
      const translation = t(translationKey);
      // Only return the original key if it's a valid change type
      if (IMPROVEMENT_CHANGES.includes(change) || DETERIORATION_CHANGES.includes(change)) {
        return translation;
      }
      return change;
    });
  };

  // Helper function to translate record type
  const translateRecordType = (type: 'improvement' | 'deterioration'): string => {
    const translationKey = `analytics.geneticPerformance.${type}s`;
    const translation = t(translationKey);
    return translation === translationKey ? type : translation;
  };

  // Helper function to translate breeding line
  const translateBreedingLine = (line: string): string => {
    const translationKey = `pig.stockManagement.breeds.${line.toLowerCase().replace(/\s+/g, '')}`;
    const translation = t(`${translationKey}.name`);
    return translation === `${translationKey}.name` ? line : translation;
  };

  const addGeneticRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const availableChanges = formData.type === 'improvement' ? IMPROVEMENT_CHANGES : DETERIORATION_CHANGES;
    
    // Use the selected changes directly since they are already in the correct format
    const newRecord: GeneticRecord = {
      id: Date.now().toString(),
      breedingLine: formData.breedingLine,
      improvements: formData.improvements,
      date: new Date(formData.date).toISOString(),
      type: formData.type
    };

    // Update local state immediately
    const updatedRecords = [...localRecords, newRecord];
    setLocalRecords(updatedRecords);
    
    // Update parent state
    onUpdate(updatedRecords);
    
    setIsOpen(false);
    setFormData({
      breedingLine: '',
      improvements: [],
      date: new Date().toISOString().split('T')[0],
      type: 'improvement'
    });
  };

  // Get available changes based on type
  const getAvailableChanges = () => {
    return formData.type === 'improvement' ? IMPROVEMENT_CHANGES : DETERIORATION_CHANGES;
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const displayedRecords = localRecords.slice(startIndex, endIndex);
  const totalPages = Math.ceil(localRecords.length / recordsPerPage);

  // Prepare data for the graph
  const graphData = localRecords
    .reduce((acc, record) => {
      const breedingLine = record.breedingLine;
      if (!acc[breedingLine]) {
        acc[breedingLine] = {
          improvements: 0,
          deteriorations: 0
        };
      }
      if (record.type === 'deterioration') {
        acc[breedingLine].deteriorations++;
      } else {
        acc[breedingLine].improvements++;
      }
      return acc;
    }, {} as Record<string, { improvements: number; deteriorations: number }>);

  const chartData = Object.entries(graphData).map(([line, counts]) => ({
    breedingLine: line,
    improvements: counts.improvements,
    deteriorations: -counts.deteriorations // Negative to show below the x-axis
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('analytics.geneticPerformance.title')}
        </h2>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isDarkMode 
              ? 'bg-purple-500 hover:bg-purple-600 text-white' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          {t('analytics.geneticPerformance.addRecord')}
        </button>
      </div>

      {/* Graph Section */}
      {chartData.length > 0 && (
        <div className={`h-64 p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="breedingLine" 
                stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
                tickFormatter={translateBreedingLine}
              />
              <YAxis stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                  color: isDarkMode ? '#D1D5DB' : '#111827'
                }}
                formatter={(value: any, name: string) => {
                  const translatedName = name === 'improvements' 
                    ? t('analytics.geneticPerformance.improvements')
                    : t('analytics.geneticPerformance.deteriorations');
                  return [value, translatedName];
                }}
                labelFormatter={translateBreedingLine}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'improvements'
                    ? t('analytics.geneticPerformance.improvements')
                    : t('analytics.geneticPerformance.deteriorations');
                }}
              />
              <Line 
                type="monotone" 
                dataKey="improvements" 
                stroke="#10b981" 
                name="improvements"
              />
              <Line 
                type="monotone" 
                dataKey="deteriorations" 
                stroke="#ef4444" 
                name="deteriorations"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Records Table */}
      <div className={`overflow-x-auto rounded-lg border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('common.date')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.geneticPerformance.breedingLine')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.geneticPerformance.type')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.geneticPerformance.improvements')}
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {displayedRecords.map((record) => (
              <tr 
                key={record.id}
                className={isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {formatDate(record.date)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {translateBreedingLine(record.breedingLine)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.type === 'improvement'
                      ? isDarkMode 
                        ? 'bg-green-900/20 text-green-400' 
                        : 'bg-green-100 text-green-800'
                      : isDarkMode
                        ? 'bg-red-900/20 text-red-400'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {translateRecordType(record.type)}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  <ul className="list-disc list-inside">
                    {translateChanges(record.improvements).map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {localRecords.length > recordsPerPage && (
        <PaginationContainer
          currentPage={currentPage}
          totalPages={Math.ceil(localRecords.length / recordsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Record Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsOpen(false)}>
          <div className="flex items-center justify-center min-h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <Dialog.Title className="text-lg font-medium mb-4">{t('analytics.geneticPerformance.addRecord')}</Dialog.Title>
              
              {/* Form Fields */}
              <form onSubmit={addGeneticRecord} className="space-y-4">
                {/* Breeding Line */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('analytics.geneticPerformance.breedingLine')}
                  </label>
                  <select
                    value={formData.breedingLine}
                    onChange={(e) => setFormData({ ...formData, breedingLine: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="">{t('analytics.geneticPerformance.selectBreed')}</option>
                    {DEFAULT_PIG_BREEDS.map(breed => (
                      <option key={breed.id} value={breed.name}>
                        {breed.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('analytics.geneticPerformance.type')}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      type: e.target.value as 'improvement' | 'deterioration',
                      improvements: [] // Reset improvements when type changes
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  >
                    <option value="improvement">{t('analytics.geneticPerformance.improvements')}</option>
                    <option value="deterioration">{t('analytics.geneticPerformance.deteriorations')}</option>
                  </select>
                </div>

                {/* Changes Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'improvement' 
                      ? t('analytics.geneticPerformance.improvements')
                      : t('analytics.geneticPerformance.deteriorations')}
                  </label>
                  <div className="space-y-2">
                    {(formData.type === 'improvement' ? [
                      { key: 'improved_growth_rate', label: t('analytics.geneticPerformance.changes.improved_growth_rate') },
                      { key: 'better_feed_efficiency', label: t('analytics.geneticPerformance.changes.better_feed_efficiency') },
                      { key: 'increased_litter_size', label: t('analytics.geneticPerformance.changes.increased_litter_size') },
                      { key: 'better_disease_resistance', label: t('analytics.geneticPerformance.changes.better_disease_resistance') },
                      { key: 'improved_meat_quality', label: t('analytics.geneticPerformance.changes.improved_meat_quality') },
                      { key: 'higher_survival_rate', label: t('analytics.geneticPerformance.changes.higher_survival_rate') },
                      { key: 'better_mothering_ability', label: t('analytics.geneticPerformance.changes.better_mothering_ability') }
                    ] : [
                      { key: 'decreased_growth_rate', label: t('analytics.geneticPerformance.changes.decreased_growth_rate') },
                      { key: 'bad_feed_efficiency', label: t('analytics.geneticPerformance.changes.bad_feed_efficiency') },
                      { key: 'decreased_litter_size', label: t('analytics.geneticPerformance.changes.decreased_litter_size') },
                      { key: 'poor_disease_resistance', label: t('analytics.geneticPerformance.changes.poor_disease_resistance') },
                      { key: 'poor_meat_quality', label: t('analytics.geneticPerformance.changes.poor_meat_quality') },
                      { key: 'lower_survival_rate', label: t('analytics.geneticPerformance.changes.lower_survival_rate') },
                      { key: 'poor_mothering_ability', label: t('analytics.geneticPerformance.changes.poor_mothering_ability') }
                    ]).map(({ key, label }) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.improvements.includes(key)}
                          onChange={(e) => {
                            const updatedImprovements = e.target.checked
                              ? [...formData.improvements, key]
                              : formData.improvements.filter(i => i !== key);
                            setFormData({
                              ...formData,
                              improvements: updatedImprovements
                            });
                          }}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('common.date')}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    {t('analytics.geneticPerformance.addRecord')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 