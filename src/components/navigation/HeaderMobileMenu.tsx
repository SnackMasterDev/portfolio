import React, { useEffect, useRef } from 'react';
import { ZenAudioToggle } from '../audio/ZenAudioToggle';
import { LanguageToggle } from './LanguageToggle';
import { HeaderMobileLinks } from './HeaderMobileLinks';
import type { Translations } from '../../data/translations';
import type { Language } from '../../context/useLanguage';

export interface HeaderMobileMenuProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  t: Translations['header'];
  language: Language;
}

export const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  id = 'mobile-navigation-menu',
  isOpen,
  onClose,
  t,
  language,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const handleResize = () => { if (window.innerWidth >= 640) onClose(); };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] pointer-events-auto sm:hidden"
        onClick={onClose}
        aria-hidden="true"
        data-testid="mobile-menu-backdrop"
      />

      <div
        id={id}
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={language === 'es' ? 'Menú de navegación' : 'Navigation menu'}
        className="pointer-events-auto sm:hidden mt-2 w-full max-w-sm bg-[#fdfbf7]/98 backdrop-blur-xl border border-[#d6cebf] shadow-[0_16px_36px_rgba(28,28,30,0.14)] rounded-2xl p-4 flex flex-col gap-3 z-40 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-[#e3dacd]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c]">
            {language === 'es' ? 'Navegación' : 'Navigation'}
          </span>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#be185d]/10 border border-[#be185d]/25 text-[#be185d] text-[11px] font-mono font-medium">
            <span>{t.availableForWork}</span>
          </div>
        </div>

        <HeaderMobileLinks t={t} language={language} onClose={onClose} />

        <div className="flex items-center justify-between pt-2.5 border-t border-[#e3dacd]">
          <ZenAudioToggle />
          <LanguageToggle />
        </div>
      </div>
    </>
  );
};

export default HeaderMobileMenu;
