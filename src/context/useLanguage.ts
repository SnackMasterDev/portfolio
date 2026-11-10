import { createContext, useContext } from 'react';

export type Language = 'es' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const defaultLanguageContext: LanguageContextType = {
  language: 'es',
  setLanguage: () => {},
  toggleLanguage: () => {},
};

export const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  return context ?? defaultLanguageContext;
}
