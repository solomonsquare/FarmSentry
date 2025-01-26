import React from 'react';
import { useTranslation } from 'react-i18next';
import { PigBreed } from '../../types/pig';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  breeds: PigBreed[];
  selectedBreed: PigBreed;
  onSelect: (breed: PigBreed) => void;
}

export function BreedSelector({ breeds, selectedBreed, onSelect }: Props) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const getBreedTranslation = (breed: PigBreed, key: string) => {
    const breedKey = breed.name
      .split(' ')
      .map((word, index) => 
        index === 0 
          ? word.toLowerCase() 
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('');
    return t(`pig.stockManagement.breeds.${breedKey}.${key}`);
  };

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {t('pig.stockManagement.selectBreed')}
      </label>
      <div className="grid grid-cols-1 gap-4">
        {breeds.map((breed) => (
          <button
            key={breed.id}
            onClick={() => onSelect(breed)}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selectedBreed.id === breed.id
                ? isDarkMode 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-blue-500 bg-blue-50'
                : isDarkMode
                  ? 'border-gray-700 hover:border-blue-700'
                  : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {breed.name}
            </h3>
            <div className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} space-y-1`}>
              <p>{getBreedTranslation(breed, 'growthRate')}</p>
              <p>{getBreedTranslation(breed, 'purpose')}</p>
              <p>{getBreedTranslation(breed, 'lifespan')}</p>
              <p>{getBreedTranslation(breed, 'litterSize')}</p>
              {breed.description && <p>{getBreedTranslation(breed, 'description')}</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}