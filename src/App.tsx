import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Settings } from './pages/Settings';
import { CategorySelection } from './pages/CategorySelection';
import { Onboarding } from './pages/Onboarding';
import { FarmRoutes } from './components/FarmRoutes';
import { FarmProvider } from './contexts/FarmContext';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import './i18n';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>}>
        <Router>
          <AuthProvider>
            <ThemeProvider>
              <LanguageProvider>
                <FarmProvider>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected routes */}
                    <Route 
                      path="/settings" 
                      element={
                        <PrivateRoute>
                          <Settings />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/onboarding" 
                      element={
                        <PrivateRoute>
                          <Onboarding />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/birds/*" 
                      element={
                        <PrivateRoute>
                          <FarmRoutes category="birds" />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/pigs/*" 
                      element={
                        <PrivateRoute>
                          <FarmRoutes category="pigs" />
                        </PrivateRoute>
                      } 
                    />
                    
                    {/* Redirect root to login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                </FarmProvider>
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;