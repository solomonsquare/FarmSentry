import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, User, Moon, ArrowLeft } from 'lucide-react';
import { updatePassword } from 'firebase/auth';
import { CurrentFarmSection } from '../components/settings/CurrentFarmSection';
import { useFarmType } from '../hooks/useFarmType';
import { useTheme } from '../contexts/ThemeContext';
import { ChangePasswordModal } from '../components/settings/ChangePasswordModal';
import { PlanSelector } from '../components/settings/PlanSelector';

export function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { currentFarmType } = useFarmType();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [farmName, setFarmName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPlan, setCurrentPlan] = useState('basic'); // Default to basic plan

  const handleBack = () => {
    navigate(-1);
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await updatePassword(currentUser, newPassword);
      setIsPasswordModalOpen(false);
    } catch (err) {
      setError('Failed to change password. Please make sure your current password is correct.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchPlan = async (planName: string) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      // Here you would typically handle the payment process
      // and update the user's plan in the database
      setCurrentPlan(planName);
      
    } catch (err) {
      setError('Failed to switch plan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Farm Name</label>
                <input 
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 ${
                    !isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                  } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input 
                  type="email" 
                  value={currentUser?.email || ''} 
                  disabled 
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" 
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input 
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 ${
                    !isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                  } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Farm */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Current Farm</h2>
            {currentFarmType && <CurrentFarmSection currentType={currentFarmType} />}
          </div>
        </div>

        {/* Subscription Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Subscription Plan</h2>
            {currentFarmType && (
              <PlanSelector
                currentPlan={currentPlan}
                farmType={currentFarmType}
                onSelect={handleSwitchPlan}
              />
            )}
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Password</h2>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
        error={error}
      />
    </div>
  );
}