import React, { useState, useEffect } from 'react';
import { UserCircle, Building2, Moon, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FarmCategory } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChangePasswordModal } from '../components/settings/ChangePasswordModal';

export function Settings() {
  const { currentUser, updatePassword } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentPlan] = useState('basic');
  const location = useLocation();
  const navigate = useNavigate();

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load initial values
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      // You might want to fetch these from Firestore
      // setFarmName(userData.farmName);
      // setPhoneNumber(userData.phoneNumber);
    }
  }, [currentUser]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      handleSaveProfile();
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);

      // Update profile in Firebase Auth
      // await updateProfile(currentUser, { displayName });

      // Update additional info in Firestore
      // const userRef = doc(db, 'users', currentUser.uid);
      // await updateDoc(userRef, {
      //   farmName,
      //   phoneNumber,
      //   updatedAt: serverTimestamp()
      // });

      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeFarmType = () => {
    navigate('/'); // Navigate to category selection
  };

  const handleSwitchPlan = async (planName: string) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      // Update plan in Firestore
      // const userRef = doc(db, 'users', currentUser.uid);
      // await updateDoc(userRef, {
      //   plan: planName,
      //   updatedAt: serverTimestamp()
      // });

      // You might want to handle payment processing here
      
    } catch (err) {
      setError('Failed to switch plan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // First reauthenticate the user if needed
      // const credential = EmailAuthProvider.credential(currentUser.email!, oldPassword);
      // await reauthenticateWithCredential(currentUser, credential);
      
      await updatePassword(currentUser, newPassword);
      setIsPasswordModalOpen(false);
    } catch (err) {
      setError('Failed to change password. Please make sure your current password is correct.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* User Profile */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
              <button 
                onClick={isEditing ? handleSaveProfile : handleEditProfile}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isEditing ? 'Save Profile' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <input 
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Farm Name</label>
                <input 
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  value={currentUser?.email || ''} 
                  disabled 
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50" 
                />
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Farm */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Current Farm</h2>
            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
              <div className="flex gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Poultry Farm</h3>
                  <p className="text-gray-600">Manage broiler birds and layers</p>
                  <ul className="mt-4 space-y-2 text-gray-600">
                    <li>• Flock tracking</li>
                    <li>• Feed consumption monitoring</li>
                    <li>• Weight tracking</li>
                    <li>• Mortality tracking</li>
                  </ul>
                </div>
              </div>
            </div>
            <button 
              onClick={handleChangeFarmType}
              disabled={loading}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Change Farm Type
            </button>
          </div>
        </div>

        {/* Subscription Plan */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Plan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Basic',
                  price: '₦15,000',
                  features: ['Up to 5,000 birds', 'Basic tracking features', 'Email support'],
                  current: currentPlan === 'basic'
                },
                {
                  name: 'Professional',
                  price: '₦25,000',
                  features: ['Up to 20,000 birds', 'Advanced analytics', 'Priority support', 'Custom reports'],
                  current: currentPlan === 'professional'
                },
                {
                  name: 'Enterprise',
                  price: 'Custom',
                  features: ['Unlimited birds', 'Multi-farm management', 'Dedicated support', 'Custom integrations'],
                  current: currentPlan === 'enterprise'
                }
              ].map((plan) => (
                <div key={plan.name} 
                  className={`rounded-lg border ${plan.current ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} p-6`}
                >
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-2">{plan.price}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.current ? (
                    <div className="mt-6 text-center text-gray-500">Current Plan</div>
                  ) : (
                    <button 
                      onClick={() => handleSwitchPlan(plan.name)}
                      disabled={loading || plan.current}
                      className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Switching...' : 'Switch Plan'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Appearance</h2>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Moon className="w-5 h-5" />
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Lock className="w-5 h-5" />
              <span>Change Password</span>
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