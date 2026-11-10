import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ZenAudioToggle } from '../audio/ZenAudioToggle';
import { LanguageToggle } from './LanguageToggle';
import { HeaderMobileMenu } from './HeaderMobileMenu';
import { useLanguage } from '../../context/useLanguage';
import { getTranslations } from '../../data/translations';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = getTranslations(language).header;

  return (
    <header className="fixed top-3 inset-x-0 z-40 flex flex-col items-center px-4 pointer-events-none transition-all">
      <div className="pointer-events-auto max-w-5xl w-full bg-[#fdfbf7]/92 backdrop-blur-md border border-[#d6cebf] shadow-[0_8px_30px_rgba(28,28,30,0.06)] rounded-full px-4 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Lado izquierdo: Marca en tipografía Rancho y Estado de contratación */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            className="font-rancho text-2xl font-bold tracking-normal text-[#1c1c1e] hover:text-[#be185d] transition-colors leading-none whitespace-nowrap"
            title={t.homeTitle}
          >
            SnackMasterDev
          </a>

          {/* Estado de contratación claro y en 1 sola línea */}
          <div className="hidden lg:inline-flex items-center px-3 py-1 rounded-full bg-[#be185d]/10 border border-[#be185d]/25 text-[#be185d] text-[11px] font-mono font-medium whitespace-nowrap shrink-0">
            <span>{t.availableForWork}</span>
          </div>
        </div>

        {/* Lado derecho en escritorio (>= sm): GitHub, LinkedIn, Descarga de CV, Audio Zen y Selector de idioma */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/SnackMasterDev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2.5 py-1.5 rounded-full bg-white/70 hover:bg-white text-[#1c1c1e] text-xs font-medium border border-[#d6cebf] hover:border-[#1c1c1e] transition-colors whitespace-nowrap shadow-2xs"
            title={t.gitHubTitle}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/juan-camilo-garcia-"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2.5 py-1.5 rounded-full bg-white/70 hover:bg-white text-[#1c1c1e] text-xs font-medium border border-[#d6cebf] hover:border-[#1c1c1e] transition-colors whitespace-nowrap shadow-2xs"
            title={t.linkedInTitle}
          >
            LinkedIn
          </a>
          <a
            href={language === 'en' ? '/cv_en.pdf' : '/cv.pdf'}
            download={t.cvFile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#f4eee5] text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{t.downloadCv}</span>
          </a>

          <ZenAudioToggle />

          <LanguageToggle />
        </div>

        {/* Botón hamburguesa visible únicamente en móviles (< sm) */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#1c1c1e] hover:bg-black/5 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be185d] shrink-0"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation-menu"
          aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
          data-testid="header-hamburger-button"
        >
          {isMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Menú desplegable para móviles (< sm) */}
      <HeaderMobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        t={t}
        language={language}
      />
    </header>
  );
};

export default Header;
