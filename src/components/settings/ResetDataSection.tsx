import React, { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/userService';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export function ResetDataSection() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) return;

    try {
      setError(null);
      setIsResetting(true);

      // Verify password by attempting to sign in
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, currentUser.email, password);

      // Password is correct, ask for final confirmation
      const confirmed = window.confirm(
        'Are you absolutely sure you want to reset ALL your farm data? This action cannot be undone.'
      );

      if (!confirmed) {
        setIsResetting(false);
        setIsModalOpen(false);
        return;
      }

      // Proceed with reset
      await UserService.resetUserData(currentUser.uid);
      window.location.href = '/onboarding';
    } catch (err) {
      console.error('Error during reset:', err);
      setError('Incorrect password. Please try again.');
      setIsResetting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reset Farm Data</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This will permanently delete all your farm data including stock records, sales history, and analytics.
              This action cannot be undone.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Data
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Data Reset
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please enter your password to confirm that you want to reset all your farm data.
              This action cannot be undone.
            </p>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPassword('');
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isResetting ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Reset All Data
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 