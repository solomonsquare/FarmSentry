import React from 'react';
import { Check } from 'lucide-react';
import { FarmCategory } from '../../types';
import { SubscriptionPlan } from '../../hooks/useSubscription';

interface Props {
  currentPlan: SubscriptionPlan;
  farmType: FarmCategory;
  onSelect: (plan: SubscriptionPlan) => void;
}

export function PlanSelector({ currentPlan, farmType, onSelect }: Props) {
  const getCapacity = (plan: SubscriptionPlan) => {
    if (farmType === 'birds') {
      switch (plan) {
        case 'basic': return '5,000 birds';
        case 'professional': return '20,000 birds';
        case 'enterprise': return 'Unlimited birds';
        default: return '';
      }
    } else {
      switch (plan) {
        case 'basic': return '50 pigs';
        case 'professional': return '200 pigs';
        case 'enterprise': return 'Unlimited pigs';
        default: return '';
      }
    }
  };

  const plans = [
    {
      id: 'basic' as SubscriptionPlan,
      name: 'Basic',
      price: '₦15,000',
      features: [
        `Up to ${getCapacity('basic')}`,
        'Basic tracking features',
        'Email support'
      ]
    },
    {
      id: 'professional' as SubscriptionPlan,
      name: 'Professional',
      price: '₦25,000',
      features: [
        `Up to ${getCapacity('professional')}`,
        'Advanced analytics',
        'Priority support',
        'Custom reports'
      ]
    },
    {
      id: 'enterprise' as SubscriptionPlan,
      name: 'Enterprise',
      price: 'Custom',
      features: [
        getCapacity('enterprise'),
        'Multi-farm management',
        'Dedicated support',
        'Custom integrations'
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`p-6 rounded-lg border-2 ${
            currentPlan === plan.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{plan.price}</p>
            </div>
            {currentPlan === plan.id && (
              <span className="bg-blue-500 text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </span>
            )}
          </div>
          <ul className="mt-4 space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-1" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onSelect(plan.id)}
            disabled={currentPlan === plan.id}
            className={`w-full mt-6 px-4 py-2 rounded-md ${
              currentPlan === plan.id
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentPlan === plan.id ? 'Current Plan' : 'Switch Plan'}
          </button>
        </div>
      ))}
    </div>
  );
}