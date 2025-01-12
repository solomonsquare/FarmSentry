import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/user/userService';
import { UserProfile, ProfileUpdateData } from '../../services/user/types';

export function useProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const userProfile = await UserService.getUserProfile(currentUser.uid);
        
        if (!userProfile) {
          // Create initial profile if it doesn't exist
          await UserService.createUserProfile(currentUser.uid, currentUser.email || '');
          const newProfile = await UserService.getUserProfile(currentUser.uid);
          setProfile(newProfile);
        } else {
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [currentUser]);

  const updateProfile = async (updates: ProfileUpdateData) => {
    if (!currentUser) return;

    try {
      setError(null);
      await UserService.updateUserProfile(currentUser.uid, updates);
      const updatedProfile = await UserService.getUserProfile(currentUser.uid);
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile
  };
}