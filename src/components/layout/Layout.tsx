import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, BadgeDollarSign, RotateCcw, ArrowLeft, BarChart3, Settings, LogOut } from 'lucide-react';
import { FarmCategory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { UserService } from '../../services/userService';

interface Props {
  children: React.ReactNode;
  category: FarmCategory | 'settings';
  onReset?: () => void;
}

export function Layout({ children, category, onReset }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [isResetting, setIsResetting] = useState(false);
  
  const handleBack = () => {
    if (location.pathname === '/settings') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleReset = async () => {
    if (!currentUser) {
      console.log('No current user found');
      return;
    }
    
    const confirmed = window.confirm(
      'Are you sure you want to reset all your farm data? This action cannot be undone.'
    );

    if (!confirmed) {
      console.log('Reset cancelled by user');
      return;
    }

    try {
      setIsResetting(true);
      console.log('Starting reset process...');
      
      await UserService.resetUserData(currentUser.uid);
      console.log('Reset completed, redirecting...');
      
      window.location.href = '/onboarding';
    } catch (error) {
      console.error('Error during reset:', error);
      alert('Failed to reset data. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const navItems = category === 'settings' ? [] : [
    { 
      to: '', 
      icon: Home, 
      label: 'Dashboard',
      isActive: (pathname: string) => pathname === `/${category}` || pathname === `/${category}/`
    },
    { 
      to: 'stock-expenses', 
      icon: Users, 
      label: 'Stock Management',
      isActive: (pathname: string) => pathname === `/${category}/stock-expenses`
    },
    { 
      to: 'sales', 
      icon: BadgeDollarSign, 
      label: 'Sales',
      isActive: (pathname: string) => pathname === `/${category}/sales`
    },
    { 
      to: 'analytics', 
      icon: BarChart3, 
      label: 'Analytics',
      isActive: (pathname: string) => pathname === `/${category}/analytics`
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white mr-8">
                {category === 'birds' ? 'Poultry Farm' : 'Pig Farm'}
              </h1>
              <div className="flex space-x-8">
                {navItems.map(({ to, icon: Icon, label, isActive }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === ''}
                    className={({ isActive: active }) =>
                      `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(location.pathname)
                          ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900'
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Settings</span>
              </button>
              {category !== 'settings' && (
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  className={`flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 ${
                    isResetting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline">
                    {isResetting ? 'Resetting...' : 'Reset'}
                  </span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}