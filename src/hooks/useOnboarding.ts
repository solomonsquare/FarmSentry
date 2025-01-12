import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/userService';
import { FarmCategory } from '../types';

export function useOnboarding() {
  const { currentUser } = useAuth();
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const status = await UserService.checkOnboardingStatus(currentUser.uid);
        setIsComplete(status);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [currentUser]);

  const completeOnboarding = async (farmType: FarmCategory) => {
    if (!currentUser) return;

    try {
      await UserService.initializeUserAndFarm(currentUser.uid, {
        farmType: farmType,
        farmSize: 0,
        experience: '',
        goals: []
      });

      setIsComplete(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  return { isComplete, loading, completeOnboarding };
}