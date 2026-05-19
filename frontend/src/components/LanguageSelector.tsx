import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Language, languageNames, languageFlags } from '../i18n';

export default function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
          darkMode 
            ? 'text-light hover:text-primary hover:bg-gray-800' 
            : 'text-gray-700 hover:text-primary hover:bg-gray-100'
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-base">{languageFlags[language]}</span>
        <span className="hidden sm:inline">{languageNames[language]}</span>
        <svg 
          className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } ring-1 ring-black ring-opacity-5 z-50`}
          role="listbox"
          aria-label="Available languages"
        >
          <div className="py-1">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                  language === lang
                    ? 'bg-primary text-white'
                    : darkMode
                      ? 'text-light hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="option"
                aria-selected={language === lang}
              >
                <span className="text-base">{languageFlags[lang]}</span>
                <span>{languageNames[lang]}</span>
                {language === lang && (
                  <svg 
                    className="h-4 w-4 ml-auto" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
