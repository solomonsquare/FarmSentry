import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import { BreedingCycle } from '../../../types/pig';
import { formatDate } from '../../../utils/date';

interface Props {
  cycle: BreedingCycle;
  onClose: () => void;
  onEdit: () => void;
}

export function BreedingDetails({ cycle, onClose, onEdit }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const labelClasses = `text-sm font-medium ${
    isDarkMode ? 'text-gray-400' : 'text-gray-500'
  }`;

  const valueClasses = `mt-1 text-sm ${
    isDarkMode ? 'text-gray-300' : 'text-gray-900'
  }`;

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {t('breeding.details.title')}
        </h3>
        <button
          onClick={onClose}
          className={`p-2 rounded-full ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-600'
          }`}
        >
          <span className="sr-only">{t('common.close')}</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <p className={labelClasses}>{t('breeding.details.sowId')}</p>
          <p className={valueClasses}>{cycle.sow}</p>
        </div>

        <div>
          <p className={labelClasses}>{t('breeding.details.startDate')}</p>
          <p className={valueClasses}>{formatDate(cycle.startDate)}</p>
        </div>

        <div>
          <p className={labelClasses}>{t('breeding.details.expectedDueDate')}</p>
          <p className={valueClasses}>{formatDate(cycle.expectedDueDate)}</p>
        </div>

        <div>
          <p className={labelClasses}>{t('breeding.details.status')}</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
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
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('common.close')}
          </button>
          <button
            onClick={onEdit}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              isDarkMode
                ? 'bg-green-600 text-white hover:bg-green-500'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {t('common.edit')}
          </button>
        </div>
      </div>
    </div>
  );
} 