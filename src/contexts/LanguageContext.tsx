import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import i18n from '../i18n';

export type Language = 'en' | 'es' | 'fr' | 'ig' | 'yo' | 'ha';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ig: 'Igbo',
  yo: 'Yorùbá',
  ha: 'Hausa'
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load language preference from Firestore
  useEffect(() => {
    async function loadLanguagePreference() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          const savedLanguage = (data.language || 'en') as Language;
          setCurrentLanguage(savedLanguage);
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
        setError('Failed to load language preference');
      } finally {
        setLoading(false);
      }
    }

    loadLanguagePreference();
  }, [currentUser]);

  // Initialize i18next with the current language
  useEffect(() => {
    if (!loading) {
      i18n.changeLanguage(currentLanguage);
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage, loading]);

  const setLanguage = async (lang: Language) => {
    if (!currentUser) return;

    try {
      setError(null);
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        language: lang,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setCurrentLanguage(lang);
      document.documentElement.lang = lang;
    } catch (error) {
      console.error('Error updating language:', error);
      setError('Failed to update language preference');
      throw error;
    }
  };

  const value = {
    currentLanguage,
    setLanguage,
    loading,
    error
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
} 