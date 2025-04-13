import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import nb from './locales/nb/translation.json';
import en from './locales/en/translation.json';
import es from './locales/es/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      nb: {
        translation: nb,
      },
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    lng: 'nb',
    fallbackLng: 'nb',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    }
  });

// Force Norwegian language
i18n.changeLanguage('nb');

export default i18n;