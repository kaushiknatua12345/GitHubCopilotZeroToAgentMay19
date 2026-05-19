import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { translations, Language, languageNames, languageFlags } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languageName: string;
  languageFlag: string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested translation value
const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  const keys = path.split('.');
  let result: unknown = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return the key if translation not found
    }
  }
  
  return typeof result === 'string' ? result : path;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Get initial language from localStorage or browser preference
  const getInitialLanguage = (): Language => {
    const stored = localStorage.getItem('language') as Language;
    if (stored && (stored === 'en' || stored === 'fr')) {
      return stored;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'fr') {
      return 'fr';
    }
    
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback((key: string): string => {
    const currentTranslations = translations[language] as unknown as Record<string, unknown>;
    return getNestedValue(currentTranslations, key);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    languageName: languageNames[language],
    languageFlag: languageFlags[language],
    availableLanguages: ['en', 'fr'],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook for getting translation function
export function useTranslation() {
  const { t, language } = useLanguage();
  return { t, language };
}

export { LanguageContext };
