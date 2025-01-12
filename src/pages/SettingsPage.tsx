import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/common/Card';
import { UserCircle } from 'lucide-react';

export function SettingsPage() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <Card>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <UserCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
            <div className="mt-2">
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-base text-gray-900">{currentUser?.email}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 