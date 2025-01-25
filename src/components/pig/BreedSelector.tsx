import React from 'react';
import { useTranslation } from 'react-i18next';
import { PigBreed } from '../../types/pig';

interface Props {
  breeds: PigBreed[];
  selectedBreed: PigBreed;
  onSelect: (breed: PigBreed) => void;
}

export function BreedSelector({ breeds, selectedBreed, onSelect }: Props) {
  const { t } = useTranslation();

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
      <label className="block text-sm font-medium text-gray-700">
        {t('pig.stockManagement.selectBreed')}
      </label>
      <div className="grid grid-cols-1 gap-4">
        {breeds.map((breed) => (
          <button
            key={breed.id}
            onClick={() => onSelect(breed)}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selectedBreed.id === breed.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <h3 className="font-medium text-gray-900">{breed.name}</h3>
            <div className="mt-1 text-sm text-gray-500 space-y-1">
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