import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';
import { LogIn } from 'lucide-react';
import { UserService } from '../../services/userService';

export function LoginForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      
      // Sign in user
      const userCredential = await signIn(email, password);
      console.log('User signed in:', userCredential.user.uid);

      try {
        // Try to get user data
        const userData = await UserService.getUserData(userCredential.user.uid);
        
        if (userData && userData.onboardingComplete && userData.farmType) {
          // If onboarding is complete, navigate to farm dashboard
          navigate(`/${userData.farmType}`);
        } else {
          // If no user data or onboarding not complete, create initial document and navigate to onboarding
          if (!userData) {
            await UserService.createUserDocument(userCredential.user.uid);
          }
          navigate('/onboarding');
        }
      } catch (firestoreErr) {
        console.error('Firestore error:', firestoreErr);
        // If there's a permission error, still navigate to onboarding
        // The user document will be created during onboarding
        navigate('/onboarding');
      }
    } catch (err) {
      console.error('Login failed:', err);
      if (err instanceof FirebaseError) {
        console.log('Firebase error code:', err.code);
        console.log('Firebase error message:', err.message);
        switch (err.code) {
          case 'auth/user-not-found':
            setError('No account found with this email');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          case 'auth/too-many-requests':
            setError('Too many failed attempts. Please try again later.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your connection.');
            break;
          default:
            setError(`Failed to sign in: ${err.message}`);
        }
      } else {
        console.log('Non-Firebase error:', err);
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-center mb-8">
        <LogIn className="w-12 h-12 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Sign in to your account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md p-3">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
          <a href="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
} 