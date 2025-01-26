import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, BadgeDollarSign, ArrowLeft, BarChart3, Settings, LogOut } from 'lucide-react';
import { FarmCategory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface Props {
  children: React.ReactNode;
  category: FarmCategory | 'settings';
  onReset?: () => Promise<void>;
}

export function Layout({ children, category, onReset }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
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

  const navItems = category === 'settings' ? [] : [
    { 
      to: '', 
      icon: Home, 
      label: t('navigation.dashboard'),
      isActive: (pathname: string) => pathname === `/${category}` || pathname === `/${category}/`
    },
    { 
      to: 'stock-expenses', 
      icon: Users, 
      label: t('navigation.stockManagement'),
      isActive: (pathname: string) => pathname === `/${category}/stock-expenses`
    },
    { 
      to: 'sales', 
      icon: BadgeDollarSign, 
      label: t('navigation.sales'),
      isActive: (pathname: string) => pathname === `/${category}/sales`
    },
    { 
      to: 'analytics', 
      icon: BarChart3, 
      label: t('navigation.analytics'),
      isActive: (pathname: string) => pathname === `/${category}/analytics`
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className={`mr-4 ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className={`text-xl font-semibold mr-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {category === 'birds' 
                  ? t('settings.currentFarm.poultryFarm')
                  : category === 'pigs'
                  ? t('settings.currentFarm.pigFarm')
                  : ''}
              </h1>
              <div className="flex space-x-8">
                {navItems.map(({ to, icon: Icon, label, isActive }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === ''}
                    className={({ isActive: active }) =>
                      `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(location.pathname)
                          ? isDarkMode
                            ? 'text-blue-400 bg-blue-900/40'
                            : 'text-blue-600 bg-blue-50'
                          : isDarkMode
                            ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/40'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
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
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/40'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">{t('navigation.settings')}</span>
              </button>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isDarkMode
                    ? 'text-gray-300 hover:text-red-400 hover:bg-red-900/40'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">{t('navigation.logout')}</span>
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