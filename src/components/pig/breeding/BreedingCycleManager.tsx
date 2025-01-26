import React, { useState } from 'react';
import { BreedingCycle } from '../../../types/pig';
import { BreedingCycleList } from './BreedingCycleList';
import { BreedingCycleForm } from './BreedingCycleForm';
import { PaginationContainer } from '../../common/PaginationContainer';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import { formatDate } from '../../../utils/date';
import { Plus } from 'lucide-react';

interface Props {
  breedingCycles: BreedingCycle[];
  currentPage: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onUpdate: (cycles: BreedingCycle[]) => void;
}

const BreedingCycleManager: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedCycle, setSelectedCycle] = useState<BreedingCycle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [localCycles, setLocalCycles] = useState<BreedingCycle[]>(props.breedingCycles);

  // Update local cycles when props change
  React.useEffect(() => {
    setLocalCycles(props.breedingCycles);
  }, [props.breedingCycles]);

  console.log('BreedingCycleManager render:', { 
    cycles: localCycles,
    currentPage: props.currentPage,
    recordsPerPage: props.recordsPerPage,
    showForm
  });

  const handleAddCycle = (newCycle: Omit<BreedingCycle, 'id'>) => {
    const cycle: BreedingCycle = {
      ...newCycle,
      id: Date.now().toString(), // Simple ID generation
      pigletCount: 0,
      deathCount: 0
    };

    // Update local state immediately
    const updatedCycles = [...localCycles, cycle];
    setLocalCycles(updatedCycles);
    
    // Update parent state
    props.onUpdate(updatedCycles);
    
    // Reset form and close it
    setShowForm(false);
    // Reset to first page when adding new record
    props.onPageChange(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(localCycles.length / props.recordsPerPage);
  const startIndex = (props.currentPage - 1) * props.recordsPerPage;
  const displayedCycles = localCycles
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(startIndex, startIndex + props.recordsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('analytics.breeding.cycles')}
        </h2>
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4" />
          {t('analytics.breeding.addCycle')}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <BreedingCycleForm
            onSubmit={handleAddCycle}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className={`overflow-x-auto rounded-lg border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.breeding.table.sowId')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.breeding.table.startDate')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.breeding.table.expectedDueDate')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.breeding.table.status')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('analytics.breeding.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {displayedCycles.map((cycle) => (
              <tr 
                key={cycle.id}
                onClick={() => setSelectedCycle(cycle)}
                className={isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 cursor-pointer'}
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {cycle.sow}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {formatDate(cycle.startDate)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {formatDate(cycle.expectedDueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    cycle.status === 'pending'
                      ? isDarkMode 
                        ? 'bg-yellow-900/20 text-yellow-400' 
                        : 'bg-yellow-100 text-yellow-800'
                      : cycle.status === 'active'
                        ? isDarkMode
                          ? 'bg-green-900/20 text-green-400'
                          : 'bg-green-100 text-green-800'
                        : isDarkMode
                          ? 'bg-blue-900/20 text-blue-400'
                          : 'bg-blue-100 text-blue-800'
                  }`}>
                    {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  <button 
                    className={`text-sm ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCycle(cycle);
                    }}
                  >
                    {t('analytics.breeding.viewDetails')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {localCycles.length > props.recordsPerPage && (
        <div className={`px-4 py-3 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <PaginationContainer
            currentPage={props.currentPage}
            totalPages={totalPages}
            onPageChange={props.onPageChange}
          />
        </div>
      )}

      {selectedCycle && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{t('analytics.breeding.selectedCycleDetails')}</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedCycle(null)}
            >
              {t('common.close')}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('analytics.breeding.table.sowId')}</p>
              <p className="text-sm text-gray-900">{selectedCycle.sow}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('analytics.breeding.table.status')}</p>
              <p className="text-sm text-gray-900">{t(`analytics.breeding.status.${selectedCycle.status}`)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('analytics.breeding.table.startDate')}</p>
              <p className="text-sm text-gray-900">{formatDate(selectedCycle.startDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('analytics.breeding.table.expectedDueDate')}</p>
              <p className="text-sm text-gray-900">{formatDate(selectedCycle.expectedDueDate)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedingCycleManager; 