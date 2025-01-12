import React from 'react';
import { Bird, Warehouse } from 'lucide-react';
import { FarmCategory } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/userService';

interface Props {
  currentType: FarmCategory;
}

export function CurrentFarmSection({ currentType }: Props) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const farmInfo = {
    birds: {
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
    pigs: {
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
  };

  const currentFarm = farmInfo[currentType];
  const Icon = currentFarm.icon;

  const handleChangeFarm = async () => {
    if (!currentUser) return;

    if (window.confirm('Changing farm type will take you to the farm selection page. Continue?')) {
      try {
        await UserService.setOnboardingComplete(currentUser.uid, false);
        navigate('/');
      } catch (error) {
        console.error('Error resetting farm type:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-500">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentFarm.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {currentFarm.description}
            </p>
            <ul className="mt-4 space-y-2">
              {currentFarm.features.map((feature) => (
                <li key={feature} className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={handleChangeFarm}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Change Farm Type
      </button>
    </div>
  );
}