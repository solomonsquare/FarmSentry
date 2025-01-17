import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/userService';
import { FarmCategory } from '../types';

export function useFarmType() {
  const { currentUser } = useAuth();
  const [currentFarmType, setCurrentFarmType] = useState<FarmCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFarmType = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const farmType = await UserService.getFarmType(currentUser.uid);
        setCurrentFarmType(farmType as FarmCategory);
      } catch (error) {
        console.error('Error loading farm type:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFarmType();
  }, [currentUser]);

  const updateFarmType = async (newType: FarmCategory) => {
    if (!currentUser) return;

    try {
      await UserService.initializeUserAndFarm(currentUser.uid, {
        farmType: newType,
        farmSize: 0,
        experience: '',
        goals: []
      });
      setCurrentFarmType(newType);
    } catch (error) {
      console.error('Error updating farm type:', error);
      throw error;
    }
  };

  return { currentFarmType, loading, updateFarmType };
}