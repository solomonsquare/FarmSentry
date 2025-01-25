import React, { useState } from 'react';
import { BreedingCycle } from '../../../types/pig';
import { BreedingCycleList } from './BreedingCycleList';
import { BreedingCycleForm } from './BreedingCycleForm';
import { PaginationContainer } from '../../common/PaginationContainer';
import { useTranslation } from 'react-i18next';

interface Props {
  breedingCycles: BreedingCycle[];
  currentPage: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onUpdate: (cycles: BreedingCycle[]) => void;
}

const BreedingCycleManager: React.FC<Props> = (props) => {
  const { t } = useTranslation();
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
        <h2 className="text-lg font-semibold">{t('analytics.breeding.cycles')}</h2>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowForm(true)}
        >
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

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('analytics.breeding.table.sowId')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('analytics.breeding.table.startDate')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('analytics.breeding.table.expectedDueDate')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('analytics.breeding.table.status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('analytics.breeding.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedCycles.map((cycle) => (
                <tr key={cycle.id} onClick={() => setSelectedCycle(cycle)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-2 text-sm text-gray-900">{cycle.sow}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{new Date(cycle.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{new Date(cycle.expectedDueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cycle.status === 'active' ? 'bg-green-100 text-green-800' :
                      cycle.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t(`analytics.breeding.status.${cycle.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
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
          <div className="p-4 border-t">
            <PaginationContainer
              currentPage={props.currentPage}
              totalPages={totalPages}
              onPageChange={props.onPageChange}
            />
          </div>
        )}
      </div>

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
              <p className="text-sm text-gray-900">{new Date(selectedCycle.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('analytics.breeding.table.expectedDueDate')}</p>
              <p className="text-sm text-gray-900">{new Date(selectedCycle.expectedDueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedingCycleManager; 