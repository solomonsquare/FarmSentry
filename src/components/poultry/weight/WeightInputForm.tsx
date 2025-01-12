import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface WeightInputFormProps {
  totalBirds: number;
  onSubmit: (data: {
    sampleSize: number;
    totalWeight: number;
    targetWeight: number;
    belowTarget: number;
    aboveTarget: number;
    notes: string;
  }) => void;
}

export function WeightInputForm({ totalBirds, onSubmit }: WeightInputFormProps) {
  const [sampleSize, setSampleSize] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(0);
  const [belowTarget, setBelowTarget] = useState<number>(0);
  const [aboveTarget, setAboveTarget] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Strict number handler that prevents negative values
  const handleStrictNumberChange = (
    currentValue: string,
    setter: (value: number) => void,
    maxValue?: number
  ) => {
    // Remove any non-numeric characters except decimal point
    const sanitizedValue = currentValue.replace(/[^\d.]/g, '');
    
    // Convert to number, defaulting to 0 if invalid
    let newValue = Math.max(0, Number(sanitizedValue) || 0);

    // If it's not a valid number or negative, force to 0
    if (isNaN(newValue) || newValue < 0) {
      setter(0);
      return;
    }

    // Apply maximum if provided
    if (maxValue !== undefined) {
      newValue = Math.min(newValue, maxValue);
    }

    setter(newValue);
  };

  // Input handlers with strict validation
  const handleSampleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleStrictNumberChange(e.target.value, setSampleSize, totalBirds);
  };

  const handleTotalWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleStrictNumberChange(e.target.value, setTotalWeight);
  };

  const handleTargetWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleStrictNumberChange(e.target.value, setTargetWeight);
  };

  const handleBelowTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleStrictNumberChange(e.target.value, (value) => {
      const newValue = Math.min(value, sampleSize);
      setBelowTarget(newValue);
      // Adjust aboveTarget if needed
      if (newValue + aboveTarget > sampleSize) {
        setAboveTarget(Math.max(0, sampleSize - newValue));
      }
    }, sampleSize);
  };

  const handleAboveTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleStrictNumberChange(e.target.value, (value) => {
      const maxAllowed = sampleSize - belowTarget;
      setAboveTarget(Math.min(value, maxAllowed));
    }, sampleSize - belowTarget);
  };

  // Prevent any actions that could lead to negative values
  const preventNegativeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = Number(e.currentTarget.value) || 0;
    
    // Block these keys always
    if (['-', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
      return;
    }

    // If value is 0 or would become negative, block these keys
    if (currentValue <= 0) {
      if (
        e.key === 'ArrowDown' || 
        e.key === 'Backspace' || 
        e.key === 'Delete' ||
        e.key === '-'
      ) {
        e.preventDefault();
        return;
      }
    }
  };

  const calculateAverageWeight = () => {
    return sampleSize > 0 ? totalWeight / sampleSize : 0;
  };

  const validateData = () => {
    if (sampleSize <= 0 || sampleSize > totalBirds) {
      alert('Please enter a valid sample size');
      return false;
    }
    if (totalWeight <= 0) {
      alert('Please enter a valid total weight');
      return false;
    }
    if (targetWeight < 0) {
      alert('Target weight cannot be negative');
      return false;
    }
    if (belowTarget + aboveTarget > sampleSize) {
      alert('Sum of below and above target counts cannot exceed sample size');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateData()) return;

    onSubmit({
      sampleSize,
      totalWeight,
      targetWeight,
      belowTarget,
      aboveTarget,
      notes
    });

    // Reset form
    setSampleSize(0);
    setTotalWeight(0);
    setTargetWeight(0);
    setBelowTarget(0);
    setAboveTarget(0);
    setNotes('');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sample Size (birds) - Max: {totalBirds}
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={sampleSize === 0 ? "0" : sampleSize}
            onChange={handleSampleSizeChange}
            onKeyDown={preventNegativeInput}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            max={totalBirds}
            step="1"
            defaultValue="0"
            onWheel={(e) => {
              e.preventDefault();
              e.currentTarget.blur();
            }}
            onPaste={(e) => {
              const pastedValue = Number(e.clipboardData.getData('text')) || 0;
              if (pastedValue < 0) {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Weight of Sample (kg)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={totalWeight}
            onChange={handleTotalWeightChange}
            onKeyDown={preventNegativeInput}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            step="0.001"
            onWheel={(e) => e.preventDefault()}
            onPaste={(e) => {
              const pastedValue = parseFloat(e.clipboardData.getData('text'));
              if (isNaN(pastedValue) || pastedValue < 0) {
                e.preventDefault();
              }
            }}
          />
          {sampleSize > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              Average weight per bird: {(totalWeight / sampleSize).toFixed(3)} kg
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Weight (kg)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={targetWeight}
            onChange={handleTargetWeightChange}
            onKeyDown={preventNegativeInput}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            step="0.001"
            onWheel={(e) => e.preventDefault()}
            onPaste={(e) => {
              const pastedValue = parseFloat(e.clipboardData.getData('text'));
              if (isNaN(pastedValue) || pastedValue < 0) {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Below Target
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={belowTarget}
            onChange={handleBelowTargetChange}
            onKeyDown={preventNegativeInput}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            max={sampleSize}
            step="1"
            onWheel={(e) => e.preventDefault()}
            onPaste={(e) => {
              const pastedValue = parseFloat(e.clipboardData.getData('text'));
              if (isNaN(pastedValue) || pastedValue < 0) {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Above Target
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={aboveTarget}
            onChange={handleAboveTargetChange}
            onKeyDown={preventNegativeInput}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            max={Math.max(0, sampleSize - belowTarget)}
            step="1"
            onWheel={(e) => e.preventDefault()}
            onPaste={(e) => {
              const pastedValue = parseFloat(e.clipboardData.getData('text'));
              if (isNaN(pastedValue) || pastedValue < 0) {
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={2}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={sampleSize <= 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        Add Weight Record
      </button>
    </div>
  );
}