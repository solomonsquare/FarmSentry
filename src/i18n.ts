import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const isDevelopment = import.meta.env.MODE === 'development';

// Debug function to log translation loading
const logTranslationLoading = (lng: string, ns: string) => {
  console.log(`Loading translation for ${lng}:${ns}`);
  fetch(`/locales/${lng}/${ns}.json`, {
    cache: 'no-store' // Disable caching for translation files
  })
    .then(response => response.json())
    .then(data => {
      console.log(`Translation loaded for ${lng}:${ns}`, data);
      // Force update the translations
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
      allowMultiLoading: true,
      requestOptions: {
        cache: 'no-store',
        mode: 'cors',
        credentials: 'same-origin'
      }
    },

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: [], // Disable caching in detection
    },

    ns: ['translations'],
    defaultNS: 'translations',

    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p']
    }
  });

// Add debug listeners
i18n.on('initialized', (options) => {
  console.log('i18next initialized:', options);
  // Force load French translations on initialization
  if (i18n.language === 'fr') {
    logTranslationLoading('fr', 'translations');
  }
});

i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  if (lng === 'fr') {
    logTranslationLoading('fr', 'translations');
  }
});

i18n.on('loaded', (loaded) => {
  console.log('i18next loaded:', loaded);
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error('i18next failed loading:', { lng, ns, msg });
});

i18n.store.on('added', (lng, ns) => {
  console.log('i18next translations added:', { lng, ns });
});

i18n.store.on('removed', (lng, ns) => {
  console.log('i18next translations removed:', { lng, ns });
});

// Load initial translations
logTranslationLoading(i18n.language, 'translations');

export default i18n; 