import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface Props {
  formData: any;
}

const poultryPlans = [
  {
    name: 'Basic',
    price: '₦15,000',
    period: 'per month',
    description: 'Perfect for small poultry farms',
    features: [
      'Up to 5,000 birds',
      'Basic flock tracking',
      'Feed consumption monitoring',
      'Mortality tracking',
      'Weight monitoring',
      'Email support'
    ]
  },
  {
    name: 'Professional',
    price: '₦25,000',
    period: 'per month',
    description: 'Ideal for growing poultry operations',
    features: [
      'Up to 20,000 birds',
      'Advanced analytics',
      'Batch management',
      'Feed conversion tracking',
      'Vaccination schedules',
      'Priority support',
      'Custom reports'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large-scale poultry operations',
    features: [
      'Unlimited birds',
      'Multi-farm management',
      'Advanced forecasting',
      'Integration with suppliers',
      'Dedicated account manager',
      'Team collaboration tools',
      '24/7 priority support'
    ]
  }
];

const pigPlans = [
  {
    name: 'Basic',
    price: '₦15,000',
    period: 'per month',
    description: 'Perfect for small pig farms',
    features: [
      'Up to 50 pigs',
      'Breeding cycle tracking',
      'Basic weight monitoring',
      'Feed tracking',
      'Health records',
      'Email support'
    ]
  },
  {
    name: 'Professional',
    price: '₦25,000',
    period: 'per month',
    description: 'Ideal for growing pig operations',
    features: [
      'Up to 200 pigs',
      'Advanced breeding analytics',
      'Growth stage tracking',
      'Feed conversion analysis',
      'Litter management',
      'Priority support',
      'Custom reports'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large-scale pig farming',
    features: [
      'Unlimited pigs',
      'Multi-farm management',
      'Genetic tracking',
      'Advanced breeding analytics',
      'Dedicated support',
      'Team collaboration',
      'Custom integrations'
    ]
  }
];

export function Recommendation({ formData }: Props) {
  const plans = formData.farmType === 'birds' ? poultryPlans : pigPlans;
  const animalType = formData.farmType === 'birds' ? 'birds' : 'pigs';

  const getRecommendedPlan = () => {
    if (formData.farmType === 'birds') {
      if (parseInt(formData.farmSize) <= 5000) return 'Basic';
      if (parseInt(formData.farmSize) <= 20000) return 'Professional';
      return 'Enterprise';
    } else {
      if (parseInt(formData.farmSize) <= 50) return 'Basic';
      if (parseInt(formData.farmSize) <= 200) return 'Professional';
      return 'Enterprise';
    }
  };

  const recommendedPlan = getRecommendedPlan();

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Personalized Setup</h1>
      
      {/* Recommendation Card */}
      <div className="bg-blue-50 p-6 rounded-xl mb-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">
          We Recommend the {recommendedPlan} Plan
        </h2>
        <p className="text-blue-700 mb-6">
          Based on your farm size of {formData.farmSize} {animalType}, we've prepared a customized setup.
        </p>
        <ul className="space-y-3 mb-6">
          <li className="flex items-center gap-2 text-blue-700">
            <Check className="w-5 h-5" />
            <span>Optimized for {formData.experience} farmers</span>
          </li>
          <li className="flex items-center gap-2 text-blue-700">
            <Check className="w-5 h-5" />
            <span>Includes all tracking and monitoring tools</span>
          </li>
          <li className="flex items-center gap-2 text-blue-700">
            <Check className="w-5 h-5" />
            <span>14-day free trial included</span>
          </li>
        </ul>
      </div>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white p-6 rounded-xl border-2 ${
                plan.name === recommendedPlan
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                  : 'border-gray-200'
              }`}
            >
              {plan.name === recommendedPlan && (
                <div className="text-blue-600 text-sm font-medium mb-2">Recommended</div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 ml-2">{plan.period}</span>
              </div>
              <p className="mt-2 text-gray-600">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  plan.name === recommendedPlan
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Start Free Trial
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}