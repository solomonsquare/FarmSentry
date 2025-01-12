import React from 'react';
import { PigBreed } from '../../types/pig';

interface Props {
  breeds: PigBreed[];
  selectedBreed: PigBreed;
  onSelect: (breed: PigBreed) => void;
}

export function BreedSelector({ breeds, selectedBreed, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Breed
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
              <p>Growth Rate: {breed.growthRate} kg/day</p>
              <p>Purpose: {breed.purpose.charAt(0).toUpperCase() + breed.purpose.slice(1)}</p>
              <p>Average Lifespan: {breed.averageLifespan} months</p>
              <p>Typical Litter Size: {breed.typicalLitterSize} piglets</p>
              {breed.description && <p>{breed.description}</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}