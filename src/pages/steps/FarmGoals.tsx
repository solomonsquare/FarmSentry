import React from 'react';
import { LineChart, TrendingUp, DollarSign } from 'lucide-react';

interface Props {
  formData: any;
  updateFormData: (data: any) => void;
}

export function FarmGoals({ formData, updateFormData }: Props) {
  const goals = [
    {
      id: 'tracking',
      icon: LineChart,
      title: 'Better tracking',
      description: 'Monitor growth and health metrics'
    },
    {
      id: 'efficiency',
      icon: DollarSign,
      title: 'Improve efficiency',
      description: 'Optimize costs and operations'
    },
    {
      id: 'scaling',
      icon: TrendingUp,
      title: 'Scale operations',
      description: 'Grow your farm business'
    }
  ];

  const toggleGoal = (goalId: string) => {
    const currentGoals = formData.goals || [];
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(id => id !== goalId)
      : [...currentGoals, goalId];
    updateFormData({ goals: newGoals });
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Select Your Goals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(({ id, icon: Icon, title, description }) => {
          const isSelected = (formData.goals || []).includes(id);
          
          return (
            <button
              key={id}
              onClick={() => toggleGoal(id)}
              className={`p-4 rounded-xl border-2 ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              } hover:border-blue-500 transition-colors text-left`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}