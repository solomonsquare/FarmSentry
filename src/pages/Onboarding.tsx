import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { FarmCategory } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/userService';
import { Bird, Home, LineChart, DollarSign, TrendingUp } from 'lucide-react';
import { useOnboarding } from '../hooks/useOnboarding';

interface OnboardingData {
  farmType: FarmCategory | null;
  farmSize: number | null;
  experience: string | null;
  goals: string[];
}

export function Onboarding() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    farmType: null,
    farmSize: null,
    experience: null,
    goals: []
  });

  const steps = [
    {
      id: 'Farm Type',
      title: 'Select Your Farm Type',
      description: 'What type of farm do you want to manage?',
      component: (
        <div className="space-y-4">
          <button
            onClick={() => handleSelect('farmType', 'birds')}
            className={`w-full p-6 bg-white rounded-lg shadow-sm border hover:border-blue-500 transition-all ${
              formData.farmType === 'birds' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                formData.farmType === 'birds' ? 'bg-blue-100' : 'bg-gray-50'
              }`}>
                <Bird className={`w-6 h-6 ${
                  formData.farmType === 'birds' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold">Poultry Farm</h3>
                <p className="text-gray-600 mt-1">Manage broiler birds and layers</p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Automated feed tracking</li>
                  <li>• Mortality rate analytics</li>
                  <li>• Profit forecasting</li>
                </ul>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleSelect('farmType', 'pigs')}
            className={`w-full p-6 bg-white rounded-lg shadow-sm border hover:border-blue-500 transition-all ${
              formData.farmType === 'pigs' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                formData.farmType === 'pigs' ? 'bg-blue-100' : 'bg-gray-50'
              }`}>
                <Home className={`w-6 h-6 ${
                  formData.farmType === 'pigs' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold">Pig Farm</h3>
                <p className="text-gray-600 mt-1">Manage pig breeding and growth</p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Breeding cycle tracking</li>
                  <li>• Growth stage monitoring</li>
                  <li>• Feed conversion analysis</li>
                </ul>
              </div>
            </div>
          </button>
        </div>
      )
    },
    {
      id: 'Farm Details',
      title: 'Farm Details',
      description: 'Tell us about your farm',
      component: (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg text-gray-700 mb-2">
              How many {formData.farmType === 'birds' ? 'birds' : 'pigs'} do you manage?
            </h3>
            <input
              type="number"
              value={formData.farmSize || ''}
              onChange={(e) => handleSelect('farmSize', Number(e.target.value))}
              placeholder="Enter number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <h3 className="text-lg text-gray-700 mb-2">What's your farming experience?</h3>
            <select
              value={formData.experience || ''}
              onChange={(e) => handleSelect('experience', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select experience level</option>
              <option value="beginner">Just starting out (0-1 year)</option>
              <option value="intermediate">Some experience (1-3 years)</option>
              <option value="expert">Experienced farmer (3+ years)</option>
            </select>
          </div>
        </div>
      )
    },
    {
      id: 'Goals',
      title: 'Select Your Goals',
      description: 'What do you want to achieve?',
      component: (
        <div className="space-y-4">
          <button
            onClick={() => {
              const newGoals = formData.goals.includes('tracking')
                ? formData.goals.filter(g => g !== 'tracking')
                : [...formData.goals, 'tracking'];
              handleSelect('goals', newGoals);
            }}
            className={`w-full p-6 bg-white rounded-lg shadow-sm border transition-all ${
              formData.goals.includes('tracking')
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <LineChart className={`w-6 h-6 ${
                formData.goals.includes('tracking') ? 'text-blue-600' : 'text-blue-500'
              }`} />
              <div className="text-left">
                <h3 className="text-lg font-semibold">Better tracking</h3>
                <p className="text-gray-600">Monitor growth and health metrics</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              const newGoals = formData.goals.includes('efficiency')
                ? formData.goals.filter(g => g !== 'efficiency')
                : [...formData.goals, 'efficiency'];
              handleSelect('goals', newGoals);
            }}
            className={`w-full p-6 bg-white rounded-lg shadow-sm border transition-all ${
              formData.goals.includes('efficiency')
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <DollarSign className={`w-6 h-6 ${
                formData.goals.includes('efficiency') ? 'text-blue-600' : 'text-blue-500'
              }`} />
              <div className="text-left">
                <h3 className="text-lg font-semibold">Improve efficiency</h3>
                <p className="text-gray-600">Optimize costs and operations</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              const newGoals = formData.goals.includes('scale')
                ? formData.goals.filter(g => g !== 'scale')
                : [...formData.goals, 'scale'];
              handleSelect('goals', newGoals);
            }}
            className={`w-full p-6 bg-white rounded-lg shadow-sm border transition-all ${
              formData.goals.includes('scale')
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <TrendingUp className={`w-6 h-6 ${
                formData.goals.includes('scale') ? 'text-blue-600' : 'text-blue-500'
              }`} />
              <div className="text-left">
                <h3 className="text-lg font-semibold">Scale operations</h3>
                <p className="text-gray-600">Grow your farm business</p>
              </div>
            </div>
          </button>
        </div>
      )
    },
    {
      id: 'Recommendation',
      title: 'Your Personalized Setup',
      description: '',
      component: (
        <div className="space-y-8">
          {/* Initial Recommendation */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-700 mb-2">
              We Recommend the Basic Plan
            </h3>
            <p className="text-blue-600 mb-6">
              Based on your farm size of {formData.farmSize} {formData.farmType}, we've prepared a customized setup.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-blue-600">
                <span className="text-blue-500 mr-2">✓</span>
                Optimized for {formData.experience} farmers
              </li>
              <li className="flex items-center text-blue-600">
                <span className="text-blue-500 mr-2">✓</span>
                Includes all tracking and monitoring tools
              </li>
              <li className="flex items-center text-blue-600">
                <span className="text-blue-500 mr-2">✓</span>
                14-day free trial included
              </li>
            </ul>
          </div>

          {/* Available Plans */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Available Plans</h3>
            <div className="grid grid-cols-3 gap-6">
              {/* Basic Plan */}
              <div className="border rounded-lg p-6 bg-white relative">
                <div className="text-blue-600 font-medium mb-2">Recommended</div>
                <h4 className="text-xl font-bold mb-1">Basic</h4>
                <div className="text-2xl font-bold mb-2">₦15,000 <span className="text-gray-500 text-base font-normal">per month</span></div>
                <p className="text-gray-600 mb-4">Perfect for small {formData.farmType} farms</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Up to 50 {formData.farmType}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Breeding cycle tracking
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic weight monitoring
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Feed tracking
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Health records
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Email support
                  </li>
                </ul>
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Start Free Trial
                </button>
              </div>

              {/* Professional Plan */}
              <div className="border rounded-lg p-6 bg-white">
                <h4 className="text-xl font-bold mb-1">Professional</h4>
                <div className="text-2xl font-bold mb-2">₦25,000 <span className="text-gray-500 text-base font-normal">per month</span></div>
                <p className="text-gray-600 mb-4">Ideal for growing {formData.farmType} operations</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Up to 200 {formData.farmType}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced breeding analytics
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Growth stage tracking
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Feed conversion analysis
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Litter management
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom reports
                  </li>
                </ul>
                <button className="w-full mt-6 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Start Free Trial
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="border rounded-lg p-6 bg-white">
                <h4 className="text-xl font-bold mb-1">Enterprise</h4>
                <div className="text-2xl font-bold mb-2">Custom <span className="text-gray-500 text-base font-normal">contact us</span></div>
                <p className="text-gray-600 mb-4">For large-scale {formData.farmType} farming</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited {formData.farmType}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Multi-farm management
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Genetic tracking
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced breeding analytics
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Dedicated support
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Team collaboration
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom integrations
                  </li>
                </ul>
                <button className="w-full mt-6 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleSelect = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      if (!currentUser || !formData.farmType) return;

      try {
        // Show loading state if you want
        await UserService.initializeUserAndFarm(currentUser.uid, {
          farmType: formData.farmType,
          farmSize: formData.farmSize || 0,
          experience: formData.experience || 'beginner',
          goals: formData.goals
        });

        // Verify the update was successful before navigating
        const userData = await UserService.getUserData(currentUser.uid);
        
        if (userData?.onboardingComplete) {
          // Only navigate if onboarding is confirmed complete
          window.location.href = `/${formData.farmType}`; // Force a full page reload
        } else {
          console.error('Onboarding status not updated');
          // Show error to user
        }
      } catch (error) {
        console.error('Error completing onboarding:', error);
        // Show error message to user
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!formData.farmType;
      case 1:
        return !!formData.farmSize;
      case 2:
        return formData.goals.length > 0;
      default:
        return true;
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12">
          {['Farm Type', 'Farm Details', 'Goals', 'Recommendation'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`text-sm ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step}
              </div>
              {index < 3 && (
                <div className={`h-1 w-24 mx-2 rounded ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{currentStepData.title}</h1>
          <p className="text-gray-600">{currentStepData.description}</p>
        </div>

        {currentStepData.component}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
              canProceed()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}