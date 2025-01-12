import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { UserService } from '../../services/userService';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading: authLoading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [farmType, setFarmType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userData = await UserService.getUserData(currentUser.uid);
        console.log('User data:', userData); // Debug log
        setOnboardingComplete(!!userData?.onboardingComplete);
        setFarmType(userData?.farmType || null);
      } catch (error) {
        console.error('Error checking user status:', error);
        setOnboardingComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [currentUser, location.pathname]); // Add location.pathname as dependency

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Debug logs
  console.log('Current path:', location.pathname);
  console.log('Onboarding complete:', onboardingComplete);
  console.log('Farm type:', farmType);

  // If we're already on the onboarding page
  if (location.pathname === '/onboarding') {
    if (onboardingComplete && farmType) {
      console.log('Redirecting to farm dashboard');
      return <Navigate to={`/${farmType}`} replace />;
    }
    return <>{children}</>;
  }

  // If onboarding is not complete
  if (!onboardingComplete) {
    console.log('Redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // If we have a farm type and we're at the root
  if (farmType && location.pathname === '/') {
    return <Navigate to={`/${farmType}`} replace />;
  }

  // Otherwise, show the requested route
  return <>{children}</>;
} 