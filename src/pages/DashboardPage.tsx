import React from 'react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { useAuth } from '../contexts/AuthContext';
import { FarmCategory } from '../types';

interface Props {
  category: FarmCategory;
}

export function DashboardPage({ category }: Props) {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold leading-6 text-gray-900 sm:truncate">
            Dashboard
          </h1>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <p className="text-sm text-gray-500">
              Welcome back, {currentUser?.email}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <DashboardStats category={category} />
        </div>
      </div>
    </div>
  );
} 