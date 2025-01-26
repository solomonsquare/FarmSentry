import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import { BreedingCycle } from '../../../types/pig';

interface Props {
  onSubmit: (data: Partial<BreedingCycle>) => void;
  onCancel: () => void;
  initialData?: Partial<BreedingCycle>;
}

export function BreedingForm({ onSubmit, onCancel, initialData }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = React.useState<Partial<BreedingCycle>>(initialData || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputClasses = `mt-1 block w-full rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-700 text-gray-100'
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClasses = `block text-sm font-medium ${
    isDarkMode ? 'text-gray-300' : 'text-gray-700'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="sow" className={labelClasses}>
          {t('breeding.form.sowId')}
        </label>
        <input
          type="text"
          name="sow"
          id="sow"
          required
          value={formData.sow || ''}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="startDate" className={labelClasses}>
          {t('breeding.form.startDate')}
        </label>
        <input
          type="date"
          name="startDate"
          id="startDate"
          required
          value={formData.startDate || ''}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="expectedDueDate" className={labelClasses}>
          {t('breeding.form.expectedDueDate')}
        </label>
        <input
          type="date"
          name="expectedDueDate"
          id="expectedDueDate"
          required
          value={formData.expectedDueDate || ''}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="status" className={labelClasses}>
          {t('breeding.form.status')}
        </label>
        <select
          name="status"
          id="status"
          required
          value={formData.status || ''}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">{t('breeding.form.selectStatus')}</option>
          <option value="pending">{t('breeding.status.pending')}</option>
          <option value="active">{t('breeding.status.active')}</option>
          <option value="completed">{t('breeding.status.completed')}</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            isDarkMode
              ? 'bg-green-600 text-white hover:bg-green-500'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {t('common.save')}
        </button>
      </div>
    </form>
  );
} 