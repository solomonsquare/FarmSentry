import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Stock, Expense, StockEntry } from '../../../types';
import { PigBreed, DEFAULT_PIG_BREEDS, DEFAULT_GROWTH_STAGES } from '../../../types/pig';
import { BreedSelector } from '../BreedSelector';
import { GrowthStageDisplay } from '../GrowthStageDisplay';
import { formatDateTime } from '../../../utils/date';
import { useTheme } from '../../../contexts/ThemeContext';

interface Props {
  stock: Stock;
  onUpdate: (stock: Stock, expenses?: Expense) => void;
}

export function AddPigStock({ stock, onUpdate }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [addQuantity, setAddQuantity] = useState<number>(0);
  const [selectedBreed, setSelectedBreed] = useState<PigBreed>(DEFAULT_PIG_BREEDS[0]);
  const [birthDate, setBirthDate] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [purpose, setPurpose] = useState<'breeding' | 'meat' | 'both'>('meat');
  const [expenses, setExpenses] = useState<Expense>({
    birds: 0,
    medicine: 0,
    feeds: 0,
    additionals: 0
  });

  const inputClasses = `mt-1 block w-full rounded-md shadow-sm ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-400 focus:border-blue-400' 
      : 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
  }`;

  const handleAddStock = () => {
    if (addQuantity <= 0) return;

    const { date, time } = formatDateTime();
    const newStock = stock.currentBirds + addQuantity;

    const newEntry: StockEntry = {
      id: Date.now().toString(),
      date,
      time,
      type: stock.history.length === 0 ? 'initial' : 'addition',
      quantity: addQuantity,
      remainingStock: newStock,
      description: `Added ${addQuantity} ${selectedBreed.name} pigs`,
      breed: selectedBreed,
      birthDate,
      currentWeight,
      purpose,
      expenses: {
        birds: expenses.birds,
        medicine: expenses.medicine,
        feeds: expenses.feeds,
        additionals: expenses.additionals
      }
    };

    onUpdate({
      currentBirds: newStock,
      history: [...stock.history, newEntry],
      lastUpdated: date,
      breed: selectedBreed,
      birthDate,
      currentWeight,
      purpose
    }, expenses);

    // Reset form
    setAddQuantity(0);
    setCurrentWeight(0);
    setBirthDate('');
    setExpenses({
      birds: 0,
      medicine: 0,
      feeds: 0,
      additionals: 0
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {t('pig.stockManagement.addNewStock')}
        </label>
        <input
          type="number"
          value={addQuantity}
          onChange={(e) => setAddQuantity(Number(e.target.value))}
          className={inputClasses}
          min="0"
          placeholder="Enter quantity"
        />
      </div>

      <BreedSelector
        breeds={DEFAULT_PIG_BREEDS}
        selectedBreed={selectedBreed}
        onSelect={setSelectedBreed}
      />

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {t('pig.stockManagement.form.birthDate')}
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={inputClasses}
          max={new Date().toISOString().split('T')[0]}
          placeholder={t('pig.stockManagement.form.birthDatePlaceholder')}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {t('pig.stockManagement.form.currentWeight')}
        </label>
        <input
          type="number"
          value={currentWeight || ''}
          onChange={(e) => setCurrentWeight(Number(e.target.value))}
          className={inputClasses}
          min="0"
          step="0.1"
          placeholder={t('pig.stockManagement.form.currentWeightPlaceholder')}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {t('pig.stockManagement.form.purpose')}
        </label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value as 'breeding' | 'meat' | 'both')}
          className={inputClasses}
        >
          <option value="meat">{t('pig.stockManagement.form.purposes.meat')}</option>
          <option value="breeding">{t('pig.stockManagement.form.purposes.breeding')}</option>
          <option value="both">{t('pig.stockManagement.form.purposes.both')}</option>
        </select>
      </div>

      {birthDate && currentWeight > 0 && (
        <GrowthStageDisplay
          birthDate={birthDate}
          currentWeight={currentWeight}
          stages={DEFAULT_GROWTH_STAGES}
        />
      )}

      {addQuantity > 0 && (
        <div className="space-y-4">
          <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('pig.stockManagement.expenses.title')}
          </h3>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('pig.stockManagement.expenses.pigsCost')}
            </label>
            <input
              type="number"
              value={expenses.birds || ''}
              onChange={(e) => setExpenses(prev => ({
                ...prev,
                birds: Number(e.target.value)
              }))}
              className={inputClasses}
              min="0"
              placeholder={t('pig.stockManagement.expenses.pigsCostPlaceholder')}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('pig.stockManagement.expenses.medicineCost')}
            </label>
            <input
              type="number"
              value={expenses.medicine || ''}
              onChange={(e) => setExpenses(prev => ({
                ...prev,
                medicine: Number(e.target.value)
              }))}
              className={inputClasses}
              min="0"
              placeholder={t('pig.stockManagement.expenses.medicineCostPlaceholder')}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('pig.stockManagement.expenses.feedsCost')}
            </label>
            <input
              type="number"
              value={expenses.feeds || ''}
              onChange={(e) => setExpenses(prev => ({
                ...prev,
                feeds: Number(e.target.value)
              }))}
              className={inputClasses}
              min="0"
              placeholder={t('pig.stockManagement.expenses.feedsCostPlaceholder')}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('pig.stockManagement.expenses.additionalCosts')}
            </label>
            <input
              type="number"
              value={expenses.additionals || ''}
              onChange={(e) => setExpenses(prev => ({
                ...prev,
                additionals: Number(e.target.value)
              }))}
              className={inputClasses}
              min="0"
              placeholder={t('pig.stockManagement.expenses.additionalCostsPlaceholder')}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleAddStock}
        disabled={addQuantity <= 0}
        className={`w-full flex items-center justify-center gap-1 px-4 py-2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
          isDarkMode 
            ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 focus:ring-offset-gray-800' 
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }`}
      >
        <Plus className="w-4 h-4" /> {t('pig.stockManagement.form.addToStock')}
      </button>
    </div>
  );
}