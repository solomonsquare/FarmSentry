import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const isDevelopment = import.meta.env.MODE === 'development';

// Debug function to log translation loading
const logTranslationLoading = (lng: string, ns: string) => {
  console.log(`Loading translation for ${lng}:${ns}`);
  fetch(`/locales/${lng}/${ns}.json`)
    .then(response => response.json())
    .then(data => {
      console.log(`Translation loaded for ${lng}:${ns}`, data);
      // Add the translations manually if needed
      i18n.addResourceBundle(lng, ns, data, true, true);
    })
    .catch(error => {
      console.error(`Failed to load translation for ${lng}:${ns}`, error);
    });
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    
    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/translations.json',
      allowMultiLoading: false,
      requestOptions: {
        cache: 'no-store',
        mode: 'cors',
        credentials: 'same-origin'
      }
    },

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },

    react: {
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added',
      useSuspense: false
    },

    supportedLngs: ['en', 'es', 'fr', 'ig', 'yo', 'ha'],
    ns: ['translations'],
    defaultNS: 'translations',
    
    // Ensure translations are loaded before rendering
    preload: ['en', 'es', 'fr', 'ig', 'yo', 'ha'],
  });

// Add debug listeners
i18n.on('initialized', function(options) {
  console.log('i18next initialized:', options);
  // Load all translations on initialization
  i18n.languages.forEach(lng => {
    logTranslationLoading(lng, 'translations');
  });
});

i18n.on('loaded', function(loaded) {
  console.log('i18next loaded:', loaded);
});

i18n.on('failedLoading', function(lng, ns, msg) {
  console.error('i18next failed loading:', { lng, ns, msg });
});

// Load initial translations
logTranslationLoading(i18n.language, 'translations');

export default i18n; 