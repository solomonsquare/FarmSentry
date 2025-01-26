import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { migratePhasesToLowercase, checkIfMigrationNeeded } from '../../utils/migrations/migratePigData';
import { useTranslation } from 'react-i18next';

export function PhaseMigration() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [migrating, setMigrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [needsMigration, setNeedsMigration] = useState(false);

  useEffect(() => {
    const checkMigration = async () => {
      if (!currentUser) return;
      try {
        const needed = await checkIfMigrationNeeded(currentUser.uid);
        setNeedsMigration(needed);
      } catch (err) {
        console.error('Failed to check migration status:', err);
      }
    };
    
    checkMigration();
  }, [currentUser]);

  const handleMigration = async () => {
    if (!currentUser) return;
    
    setMigrating(true);
    setError(null);
    setSuccess(false);

    try {
      await migratePhasesToLowercase(currentUser.uid);
      setSuccess(true);
      setNeedsMigration(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  if (!needsMigration && !success) {
    return null;
  }

  if (success) {
    return (
      <div className="bg-green-50 p-4 rounded-md">
        <p className="text-green-700">{t('analytics.migrations.phaseSuccess')}</p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 p-4 rounded-md">
      <p className="text-yellow-700 mb-4">
        {t('analytics.migrations.phaseNeeded')}
      </p>
      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}
      <button
        onClick={handleMigration}
        disabled={migrating}
        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50"
      >
        {migrating ? t('analytics.migrations.migrating') : t('analytics.migrations.migratePhases')}
      </button>
    </div>
  );
} 