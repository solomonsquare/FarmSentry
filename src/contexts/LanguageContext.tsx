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

  const setLanguage = async (lang: Language) => {
    setLoading(true);
    setError(null);
    try {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { language: lang }, { merge: true });
      }
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      document.documentElement.lang = lang;
      localStorage.setItem('i18nextLng', lang);
    } catch (error) {
      console.error('Error setting language:', error);
      setError('Failed to change language');
    } finally {
      setLoading(false);
    }
  };

  // Load language preference from Firestore
  useEffect(() => {
    async function loadLanguagePreference() {
      if (!currentUser) {
        const savedLang = localStorage.getItem('i18nextLng') as Language || 'en';
        await i18n.changeLanguage(savedLang);
        setCurrentLanguage(savedLang);
        document.documentElement.lang = savedLang;
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          const savedLanguage = (data.language || localStorage.getItem('i18nextLng') || 'en') as Language;
          await i18n.changeLanguage(savedLanguage);
          setCurrentLanguage(savedLanguage);
          document.documentElement.lang = savedLanguage;
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
        setError('Failed to load language preference');
        const fallbackLang = localStorage.getItem('i18nextLng') as Language || 'en';
        await i18n.changeLanguage(fallbackLang);
        setCurrentLanguage(fallbackLang);
        document.documentElement.lang = fallbackLang;
      } finally {
        setLoading(false);
      }
    }

    loadLanguagePreference();
  }, [currentUser]);

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