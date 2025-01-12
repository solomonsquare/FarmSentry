import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Stock, Expense, StockEntry } from '../../../types';
import { PigBreed, DEFAULT_PIG_BREEDS, DEFAULT_GROWTH_STAGES } from '../../../types/pig';
import { BreedSelector } from '../BreedSelector';
import { GrowthStageDisplay } from '../GrowthStageDisplay';
import { formatDateTime } from '../../../utils/date';

interface Props {
  stock: Stock;
  onUpdate: (stock: Stock, expenses?: Expense) => void;
}

export function AddPigStock({ stock, onUpdate }: Props) {
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
        <label className="block text-sm font-medium text-gray-700">
          Add New Stock
        </label>
        <input
          type="number"
          value={addQuantity}
          onChange={(e) => setAddQuantity(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
        <label className="block text-sm font-medium text-gray-700">
          Birth Date
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Weight (kg)
        </label>
        <input
          type="number"
          value={currentWeight || ''}
          onChange={(e) => setCurrentWeight(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="0"
          step="0.1"
          placeholder="Enter current weight"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Purpose
        </label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value as 'breeding' | 'meat' | 'both')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="meat">Meat Production</option>
          <option value="breeding">Breeding</option>
          <option value="both">Both</option>
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
          <h3 className="font-medium text-gray-700">Stock Expenses</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pigs Cost</label>
            <input
              type="number"
              value={expenses.birds || ''}
              onChange={(e) => setExpenses(prev => ({
                ...prev,
                birds: Number(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              placeholder="Enter pigs cost"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Medicine Cost</label>
            <input
              type="number"
              value={expenses.medicine || ''}
              onChange={(e) => setExpenses(prev => ({
                ...prev,
                medicine: Number(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              placeholder="Enter medicine cost"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Feeds Cost</label>
            <input
              type="number"
              value={expenses.feeds || ''}
              onChange={(e) => setExpenses(prev => ({
                ...prev,
                feeds: Number(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              placeholder="Enter feeds cost"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Costs</label>
            <input
              type="number"
              value={expenses.additionals || ''}
              onChange={(e) => setExpenses(prev => ({
                ...prev,
                additionals: Number(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              placeholder="Enter additional costs"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleAddStock}
        disabled={addQuantity <= 0}
        className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" /> Add Pigs to Stock
      </button>
    </div>
  );
}