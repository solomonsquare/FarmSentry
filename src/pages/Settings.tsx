import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Building2, User, Moon, ArrowLeft } from 'lucide-react';
import { updatePassword } from 'firebase/auth';
import { CurrentFarmSection } from '../components/settings/CurrentFarmSection';
import { useFarmType } from '../hooks/useFarmType';
import { useTheme } from '../contexts/ThemeContext';
import { ChangePasswordModal } from '../components/settings/ChangePasswordModal';
import { PlanSelector } from '../components/settings/PlanSelector';
import { ResetDataSection } from '../components/settings/ResetDataSection';
import { LanguageSelector } from '../components/settings/LanguageSelector';
import { SubscriptionPlan } from '../hooks/useSubscription';

export function Settings() {
  const { t } = useTranslation();
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
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>('basic');

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

  const handleSwitchPlan = async (planName: SubscriptionPlan) => {
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
            title={t('common.back')}
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.profile.title')}</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isEditing ? t('settings.profile.save') : t('settings.profile.edit')}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.profile.farmName')}</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.profile.email')}</label>
                <input 
                  type="email" 
                  value={currentUser?.email || ''} 
                  disabled 
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" 
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('settings.profile.emailHint')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.profile.phone')}</label>
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('settings.currentFarm.title')}</h2>
            {currentFarmType && <CurrentFarmSection currentType={currentFarmType} />}
          </div>
        </div>

        {/* Subscription Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('settings.subscription.title')}</h2>
            {currentFarmType && (
              <PlanSelector
                currentPlan={currentPlan}
                farmType={currentFarmType}
                onSelect={handleSwitchPlan}
              />
            )}
          </div>
        </div>

        {/* Language Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <LanguageSelector />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('settings.appearance.title')}</h2>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">
                {isDarkMode ? t('settings.appearance.lightMode') : t('settings.appearance.darkMode')}
              </span>
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('settings.password.title')}</h2>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('settings.password.change')}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-500 mb-4">{t('settings.dangerZone.title')}</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-red-200 dark:border-red-900">
            <div className="p-6">
              <ResetDataSection />
            </div>
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