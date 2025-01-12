import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { migratePigData } from '../../utils/migrations/migratePigData';

export function DataMigration() {
  const { currentUser } = useAuth();
  const [migrating, setMigrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleMigration = async () => {
    if (!currentUser) return;
    
    setMigrating(true);
    setError(null);
    setSuccess(false);

    try {
      await migratePigData(currentUser.uid);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-4 rounded-md">
        <p className="text-green-700">Data migration completed successfully!</p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 p-4 rounded-md">
      <p className="text-yellow-700 mb-4">
        Your data needs to be migrated to the new structure. Click the button below to migrate your data.
      </p>
      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}
      <button
        onClick={handleMigration}
        disabled={migrating}
        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50"
      >
        {migrating ? 'Migrating...' : 'Migrate Data'}
      </button>
    </div>
  );
} 