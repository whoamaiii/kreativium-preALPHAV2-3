import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import nb from './locales/nb.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      nb: { translation: nb },
      en: { translation: en }
    },
    lng: 'nb',
    fallbackLng: 'nb',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;