import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/common/Card';
import { useFarmType } from '../hooks/useFarmType';
import { CurrentFarmSection } from '../components/settings/CurrentFarmSection';
import { PlanSelector } from '../components/settings/PlanSelector';
import { UserProfileSection } from '../components/settings/UserProfileSection';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useSubscription } from '../hooks/useSubscription';
import { ResetDataSection } from '../components/settings/ResetDataSection';

export function SettingsPage() {
  const { currentUser } = useAuth();
  const { currentFarmType, loading: farmTypeLoading } = useFarmType();
  const { currentPlan, loading: subscriptionLoading, updateSubscription } = useSubscription();

  if (farmTypeLoading || subscriptionLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* User Profile Section */}
      <Card>
        <UserProfileSection />
      </Card>

      {/* Current Farm Section */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Farm</h2>
        <CurrentFarmSection currentType={currentFarmType} />
      </Card>

      {/* Subscription Section */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscription</h2>
        <PlanSelector 
          currentPlan={currentPlan} 
          farmType={currentFarmType || 'birds'} 
          onSelect={updateSubscription} 
        />
      </Card>

      {/* Reset Data Section */}
      <Card>
        <ResetDataSection />
      </Card>
    </div>
  );
} 