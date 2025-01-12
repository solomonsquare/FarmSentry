import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bird, Home, TrendingUp, Timer, Users } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '1000+',
    label: 'Active Users'
  },
  {
    icon: TrendingUp,
    value: '20% Avg.',
    label: 'Profit Increase'
  },
  {
    icon: Timer,
    value: 'Save',
    label: '5hrs/week'
  }
];

export function CategorySelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Farm Management</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your farming operations with our comprehensive management solution. 
            Track growth, monitor health, and optimize profits with data-driven insights.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-lg p-6 text-center">
              <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/onboarding')}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}