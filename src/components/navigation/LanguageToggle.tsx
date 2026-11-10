import React from 'react';
import { useLanguage, type Language } from '../../context/useLanguage';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (lang: Language) => {
    if (language !== lang) {
      setLanguage(lang);
    }
  };

  return (
    <div
      role="group"
      aria-label="Selector de idioma / Language selector"
      className="inline-flex items-center p-0.5 rounded-full bg-white/70 border border-[#d6cebf] text-xs font-mono shadow-2xs shrink-0"
    >
      <button
        type="button"
        onClick={() => handleSelect('es')}
        aria-pressed={language === 'es'}
        className={`px-2 py-0.5 rounded-full transition-all cursor-pointer text-[11px] font-semibold ${
          language === 'es'
            ? 'bg-[#1c1c1e] text-[#f4eee5] shadow-xs'
            : 'text-[#78716c] hover:text-[#1c1c1e]'
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => handleSelect('en')}
        aria-pressed={language === 'en'}
        className={`px-2 py-0.5 rounded-full transition-all cursor-pointer text-[11px] font-semibold ${
          language === 'en'
            ? 'bg-[#1c1c1e] text-[#f4eee5] shadow-xs'
            : 'text-[#78716c] hover:text-[#1c1c1e]'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
