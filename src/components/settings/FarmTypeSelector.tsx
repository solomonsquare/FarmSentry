import React from 'react';
import { Bird, Warehouse } from 'lucide-react';
import { FarmCategory } from '../../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  currentType: FarmCategory;
  onSelect: (type: FarmCategory) => void;
}

export function FarmTypeSelector({ currentType, onSelect }: Props) {
  const navigate = useNavigate();

  const farmTypes = [
    {
      id: 'birds' as FarmCategory,
      title: 'Poultry Farm',
      icon: Bird,
      description: 'Manage broiler birds and layers',
      features: [
        'Flock tracking',
        'Feed consumption monitoring',
        'Weight tracking',
        'Mortality tracking'
      ]
    },
    {
      id: 'pigs' as FarmCategory,
      title: 'Pig Farm',
      icon: Warehouse,
      description: 'Manage pig breeding and growth',
      features: [
        'Breeding cycle tracking',
        'Growth stage monitoring',
        'Feed conversion analysis',
        'Weight tracking'
      ]
    }
  ];

  const handleSelect = async (type: FarmCategory) => {
    if (type !== currentType) {
      if (window.confirm('Switching farm type will take you to the onboarding process. Continue?')) {
        await onSelect(type);
        navigate('/onboarding');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {farmTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = currentType === type.id;

        return (
          <button
            key={type.id}
            onClick={() => handleSelect(type.id)}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${isSelected ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{type.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{type.description}</p>
                <ul className="mt-4 space-y-2">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}