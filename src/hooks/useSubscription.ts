import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export type SubscriptionPlan = 'basic' | 'professional' | 'enterprise';

export function useSubscription() {
  const { currentUser } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>('basic');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubscription() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCurrentPlan((data.subscriptionPlan || 'basic') as SubscriptionPlan);
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
        setError('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, [currentUser]);

  const updateSubscription = async (plan: SubscriptionPlan) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        subscriptionPlan: plan,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setCurrentPlan(plan);
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  return {
    currentPlan,
    loading,
    error,
    updateSubscription
  };
} 