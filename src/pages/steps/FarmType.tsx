import React from 'react';
import { Bird, Home } from 'lucide-react';

interface Props {
  formData: any;
  updateFormData: (data: any) => void;
}

export function FarmType({ formData, updateFormData }: Props) {
  const farmTypes = [
    {
      id: 'birds',
      title: 'Poultry Farm',
      icon: Bird,
      description: 'Manage broiler birds and layers',
      features: [
        'Automated feed tracking',
        'Mortality rate analytics',
        'Profit forecasting'
      ]
    },
    {
      id: 'pigs',
      title: 'Pig Farm',
      icon: Home,
      description: 'Manage pig breeding and growth',
      features: [
        'Breeding cycle tracking',
        'Growth stage monitoring',
        'Feed conversion analysis'
      ]
    }
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Select Your Farm Type</h1>
      <div className="space-y-4">
        {farmTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.farmType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => updateFormData({ farmType: type.id })}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{type.title}</h3>
                  <p className="text-gray-600 mt-1">{type.description}</p>
                  <ul className="mt-4 space-y-2">
                    {type.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-600">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
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
    </div>
  );
}