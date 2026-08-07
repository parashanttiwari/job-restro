import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations.js';

const LanguageContext = createContext(null);

function interpolate(str, vars) {
  if (!vars || typeof str !== 'string') return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => (vars[key] ?? ''));
}

function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), dict);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    return (key, vars) => {
      const value = resolve(translations[lang], key) ?? resolve(translations.en, key) ?? key;
      return interpolate(value, vars);
    };
  }, [lang]);

  const localize = useMemo(() => {
    return (entity, field) => entity[`${field}_hi`] && lang === 'hi' ? entity[`${field}_hi`] : entity[field];
  }, [lang]);

  const optionLabel = useMemo(() => {
    return (option) => (lang === 'hi' ? option.hi : option.en);
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, localize, optionLabel }),
    [lang, t, localize, optionLabel]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
