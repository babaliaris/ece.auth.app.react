import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { ECE_APP_CONFIG } from './literals.core';

// Select modules to USE.
i18n.use(Backend);
if (ECE_APP_CONFIG.USE_LANG_DETECTOR) i18n.use(LanguageDetector);
i18n.use(initReactI18next)

// Initialize.
i18n.init(
{
  fallbackLng : 'el',
  debug       : import.meta.env.DEV,
  backend     :
  {
    // We normalize the path to insure no double slashes // are in the base env name.
    // This path tells i18next where to find the translation files.
    loadPath: `/${import.meta.env.VITE_ROUTER_BASE}/locales/{{lng}}/{{ns}}.json`.replace(/\/+/g, '/')
  },

  interpolation:
  {
    escapeValue: false
  }
});


export default i18n;

