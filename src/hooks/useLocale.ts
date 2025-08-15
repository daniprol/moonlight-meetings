import { useState, useEffect } from 'react';
import { Locale } from '@/lib/i18n';

export const useLocale = () => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    // Get locale from localStorage or browser language
    const savedLocale = localStorage.getItem('locale') as Locale;
    const browserLang = navigator.language.split('-')[0] as Locale;
    
    if (savedLocale && ['en', 'es', 'gl'].includes(savedLocale)) {
      setLocale(savedLocale);
    } else if (['en', 'es', 'gl'].includes(browserLang)) {
      setLocale(browserLang);
    } else {
      setLocale('en');
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return { locale, changeLocale };
};