import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

const savedLanguage = localStorage.getItem('appLanguage') || 'vi';

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
    fallbackLng: 'vi',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/i18n/{{lng}}.json',
    },
  });

export default i18n;
