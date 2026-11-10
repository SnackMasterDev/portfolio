import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import type { Translations } from '../../data/translations';
import type { Language } from '../../context/useLanguage';

export interface HeaderMobileLinksProps {
  t: Translations['header'];
  language: Language;
  onClose: () => void;
}

export const HeaderMobileLinks: React.FC<HeaderMobileLinksProps> = ({
  t,
  language,
  onClose,
}) => {
  return (
    <>
      <a
        href={language === 'en' ? '/cv_en.pdf' : '/cv.pdf'}
        download={t.cvFile}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#f4eee5] text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
      >
        <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{t.downloadCv}</span>
      </a>

      <div className="grid grid-cols-2 gap-2">
        <a
          href="https://github.com/SnackMasterDev"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/80 hover:bg-white text-[#1c1c1e] text-xs font-medium border border-[#d6cebf] hover:border-[#1c1c1e] shadow-2xs transition-colors"
          title={t.gitHubTitle}
        >
          <span>GitHub</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#78716c]" aria-hidden="true" />
        </a>
        <a
          href="https://linkedin.com/in/juan-camilo-garcia-"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/80 hover:bg-white text-[#1c1c1e] text-xs font-medium border border-[#d6cebf] hover:border-[#1c1c1e] shadow-2xs transition-colors"
          title={t.linkedInTitle}
        >
          <span>LinkedIn</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#78716c]" aria-hidden="true" />
        </a>
      </div>
    </>
  );
};

export default HeaderMobileLinks;
