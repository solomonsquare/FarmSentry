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
      
      // Load translations before changing language
      await i18n.loadNamespaces('translations');
      await i18n.changeLanguage(lang);
      
      localStorage.setItem('i18nextLng', lang);
      setCurrentLanguage(lang);
    } catch (err) {
      console.error('Error setting language:', err);
      setError('Failed to set language');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadLanguagePreference() {
      setLoading(true);
      try {
        let lang: Language = 'en';
        
        // First check localStorage
        const storedLang = localStorage.getItem('i18nextLng');
        if (storedLang && Object.keys(languageNames).includes(storedLang)) {
          lang = storedLang as Language;
        }
        
        // Then check user preferences if logged in
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists() && userDoc.data()?.language) {
            lang = userDoc.data().language as Language;
          }
        }

        // Load translations before changing language
        await i18n.loadNamespaces('translations');
        await i18n.changeLanguage(lang);
        
        setCurrentLanguage(lang);
      } catch (err) {
        console.error('Error loading language preference:', err);
        setError('Failed to load language preference');
      } finally {
        setLoading(false);
      }
    }

    loadLanguagePreference();
  }, [currentUser]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, loading, error }}>
      {children}
    </LanguageContext.Provider>
  );
} 