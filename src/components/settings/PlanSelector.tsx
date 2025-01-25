import React from 'react';
import { Check } from 'lucide-react';
import { FarmCategory } from '../../types';
import { SubscriptionPlan } from '../../hooks/useSubscription';
import { useTranslation } from 'react-i18next';

interface Props {
  currentPlan: SubscriptionPlan;
  farmType: FarmCategory;
  onSelect: (plan: SubscriptionPlan) => void;
}

export function PlanSelector({ currentPlan, farmType, onSelect }: Props) {
  const { t } = useTranslation();

  const getCapacity = (plan: SubscriptionPlan) => {
    if (farmType === 'birds') {
      switch (plan) {
        case 'basic': return t('settings.subscription.features.upTo5000');
        case 'professional': return t('settings.subscription.features.upTo20000');
        case 'enterprise': return t('settings.subscription.features.unlimited');
        default: return '';
      }
    } else {
      switch (plan) {
        case 'basic': return t('settings.subscription.features.upTo50Pigs');
        case 'professional': return t('settings.subscription.features.upTo200Pigs');
        case 'enterprise': return t('settings.subscription.features.unlimitedPigs');
        default: return '';
      }
    }
  };

  const plans = [
    {
      id: 'basic' as SubscriptionPlan,
      name: t('settings.subscription.plans.basic'),
      price: '₦15,000',
      features: [
        getCapacity('basic'),
        t('settings.subscription.features.basicTracking'),
        t('settings.subscription.features.emailSupport')
      ]
    },
    {
      id: 'professional' as SubscriptionPlan,
      name: t('settings.subscription.plans.professional'),
      price: '₦25,000',
      features: [
        getCapacity('professional'),
        t('settings.subscription.features.advancedAnalytics'),
        t('settings.subscription.features.prioritySupport'),
        t('settings.subscription.features.customReports')
      ]
    },
    {
      id: 'enterprise' as SubscriptionPlan,
      name: t('settings.subscription.plans.enterprise'),
      price: t('settings.subscription.custom'),
      features: [
        getCapacity('enterprise'),
        t('settings.subscription.features.multiFarm'),
        t('settings.subscription.features.dedicatedSupport'),
        t('settings.subscription.features.customIntegrations')
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
            {currentPlan === plan.id ? t('settings.subscription.currentPlan') : t('settings.subscription.switchPlan')}
          </button>
        </div>
      ))}
    </div>
  );
}