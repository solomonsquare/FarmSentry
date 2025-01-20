import React from 'react';
import { Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage, Language, languageNames } from '../../contexts/LanguageContext';

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const { currentLanguage, setLanguage, loading, error } = useLanguage();

  const handleLanguageChange = async (lang: Language) => {
    try {
      await setLanguage(lang);
      await i18n.changeLanguage(lang);
    } catch (err) {
      console.error('Failed to change language:', err);
    }
  };

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Globe2 className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.language.title')}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('settings.language.description')}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(languageNames).map(([code, name]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            disabled={loading || currentLanguage === code}
            className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
              currentLanguage === code
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
            }`}
          >
            <span className={`text-base ${
              currentLanguage === code
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {name}
            </span>
            {currentLanguage === code && (
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
} 