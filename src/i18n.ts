import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const isDevelopment = import.meta.env.MODE === 'development';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: isDevelopment,
    
    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/translations.json',
    },

    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    react: {
      useSuspense: true,
      bindI18n: 'languageChanged',
      bindI18nStore: 'added',
    },

    supportedLngs: ['en', 'es', 'fr', 'ig', 'yo', 'ha'],
    ns: ['translations'],
    defaultNS: 'translations',
  });

export default i18n; 