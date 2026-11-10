import React from 'react';
import type { CursorVariant } from '../../engine/cursor/types';

interface KatanaSvgContentProps {
  variant: CursorVariant;
}

export const KatanaSvgContent: React.FC<KatanaSvgContentProps> = ({ variant }) => {
  const isPointer = variant === 'pointer' || variant === 'clicking';
  const isText = variant === 'text';

  if (isText) {
    return (
      <g id="twin-staff-cursor">
        {/* Pommel superior */}
        <rect x="24" y="5" width="6" height="2.5" rx="1.2" fill="#D97706" stroke="#18181B" strokeWidth="1.3" />
        {/* Tsuka superior */}
        <rect x="25" y="7.5" width="4" height="10" fill="#18181B" stroke="#18181B" strokeWidth="1" />
        {/* Nudos decorativos Agemaki superiores */}
        <circle cx="21" cy="12" r="2.8" fill="#18181B" stroke="#18181B" strokeWidth="1" />
        <circle cx="33" cy="12" r="2.8" fill="#18181B" stroke="#18181B" strokeWidth="1" />
        <circle cx="21" cy="12" r="1.1" fill="#F4EEE5" />
        <circle cx="33" cy="12" r="1.1" fill="#F4EEE5" />
        {/* Tsuba superior */}
        <rect x="21" y="17.5" width="12" height="2.5" rx="0.8" fill="#F59E0B" stroke="#18181B" strokeWidth="1.3" />

        {/* Eje de acero templado bi-tono (plata reflejante y pizarra) */}
        <rect x="25" y="20" width="2" height="14" fill="#FFFFFF" stroke="#18181B" strokeWidth="0.9" />
        <rect x="27" y="20" width="2" height="14" fill="#64748B" stroke="#18181B" strokeWidth="0.9" />

        {/* Tsuba inferior */}
        <rect x="21" y="34" width="12" height="2.5" rx="0.8" fill="#F59E0B" stroke="#18181B" strokeWidth="1.3" />
        {/* Tsuka inferior */}
        <rect x="25" y="36.5" width="4" height="10" fill="#18181B" stroke="#18181B" strokeWidth="1" />
        {/* Nudos decorativos Agemaki inferiores */}
        <circle cx="21" cy="41" r="2.8" fill="#18181B" stroke="#18181B" strokeWidth="1" />
        <circle cx="33" cy="41" r="2.8" fill="#18181B" stroke="#18181B" strokeWidth="1" />
        <circle cx="21" cy="41" r="1.1" fill="#F4EEE5" />
        <circle cx="33" cy="41" r="1.1" fill="#F4EEE5" />
        {/* Pommel inferior */}
        <rect x="24" y="46.5" width="6" height="2.5" rx="1.2" fill="#D97706" stroke="#18181B" strokeWidth="1.3" />
      </g>
    );
  }

  return (
    <>
      {/* Katana principal estilizada */}
      <g id="katana-sword">
        {/* Tsuka (Empuñadura encordada en negro azabache) */}
        <line x1="8" y1="48" x2="17" y2="39" stroke="#18181B" strokeWidth="5.5" strokeLinecap="round" />
        {/* Kashira (Pomo dorado) */}
        <circle cx="7.5" cy="48.5" r="2.5" fill="#D97706" stroke="#18181B" strokeWidth="1.4" />

        {/* Menuki (Rombos tradicionales dorados visibles cuando no está empuñada) */}
        {!isPointer && (
          <>
            <polygon points="9.5,46.5 10.7,45.3 11.9,46.5 10.7,47.7" fill="#FBBF24" stroke="#18181B" strokeWidth="0.7" />
            <polygon points="12,44 13.2,42.8 14.4,44 13.2,45.2" fill="#FBBF24" stroke="#18181B" strokeWidth="0.7" />
            <polygon points="14.5,41.5 15.7,40.3 16.9,41.5 15.7,42.7" fill="#FBBF24" stroke="#18181B" strokeWidth="0.7" />
          </>
        )}

        {/* Tsuba (Guarda ovalada con reborde dorado y núcleo oscuro) */}
        <ellipse cx="18" cy="38" rx="5.5" ry="3.2" transform="rotate(-45 18 38)" fill="#18181B" stroke="#D97706" strokeWidth="1.5" />
        <ellipse cx="18" cy="38" rx="6" ry="3.7" transform="rotate(-45 18 38)" fill="none" stroke="#18181B" strokeWidth="1.3" />

        {/* Habaki (Collarín dorado de la hoja) */}
        <polygon points="18.5,36.5 21,34 22.5,35.5 20,38" fill="#F59E0B" stroke="#18181B" strokeWidth="1.1" />

        {/* Hoja de acero templado curvada */}
        {/* Faceta inferior / Mune (Lomo en gris pizarra acerado) */}
        <path d="M20 35 Q30 23 41 12 L46 8 Q34 22 22 37 Z" fill="#64748B" stroke="#18181B" strokeWidth="1.6" strokeLinejoin="round" />
        {/* Faceta superior / Ha (Filo en plata brillante de máximo contraste) */}
        <path d="M22 37 Q34 22 46 8 L44 7 Q29 20 19 34 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.6" strokeLinejoin="round" />
        {/* Línea divisoria central Shinogi */}
        <path d="M20.5 35.5 Q32 22.5 45 7.5" stroke="#18181B" strokeWidth="1.1" strokeLinecap="round" />
      </g>

      {/* Guantelete samurai blindado empuñando firmemente la tsuka (Modo pointer / clicking) */}
      {isPointer && (
        <g id="samurai-hand-grip">
          {/* Muñequera / Vambrace blindada posterior */}
          <path d="M11 54 L19 46 L21.5 48.5 L13.5 56.5 Z" fill="#27272A" stroke="#18181B" strokeWidth="1.3" strokeLinejoin="round" />
          <line x1="13" y1="54" x2="20" y2="47" stroke="#52525B" strokeWidth="0.8" />

          {/* Placa dorsal / Metacarpo de la mano */}
          <path d="M9.5 50.5 C10.5 52.5, 18.5 45.5, 20.5 43.5 L17 40 C15 42, 8 48.5, 9.5 50.5 Z" fill="#3F3F46" stroke="#18181B" strokeWidth="1.4" strokeLinejoin="round" />
          <line x1="11.5" y1="49.5" x2="17.5" y2="43.5" stroke="#71717A" strokeWidth="0.7" />

          {/* 4 Dedos blindados envolviendo fuertemente la empuñadura */}
          {/* Dedo 1 (Índice) */}
          <path d="M14.5 38.5 L17.5 41.5 C18.2 42.2, 17.5 43, 16.5 42.5 L13.5 39.5 C13 39, 13.8 38, 14.5 38.5 Z" fill="#27272A" stroke="#18181B" strokeWidth="1.2" />
          <circle cx="16" cy="40.5" r="0.6" fill="#71717A" />

          {/* Dedo 2 (Corazón) */}
          <path d="M12.5 40.5 L15.5 43.5 C16.2 44.2, 15.5 45, 14.5 44.5 L11.5 41.5 C11 41, 11.8 40, 12.5 40.5 Z" fill="#3F3F46" stroke="#18181B" strokeWidth="1.2" />
          <circle cx="14" cy="42.5" r="0.6" fill="#71717A" />

          {/* Dedo 3 (Anular) */}
          <path d="M10.5 42.5 L13.5 45.5 C14.2 46.2, 13.5 47, 12.5 46.5 L9.5 43.5 C9 43, 9.8 42, 10.5 42.5 Z" fill="#27272A" stroke="#18181B" strokeWidth="1.2" />
          <circle cx="12" cy="44.5" r="0.6" fill="#71717A" />

          {/* Dedo 4 (Meñique) */}
          <path d="M8.5 44.5 L11.5 47.5 C12.2 48.2, 11.5 49, 10.5 48.5 L7.5 45.5 C7 45, 7.8 44, 8.5 44.5 Z" fill="#3F3F46" stroke="#18181B" strokeWidth="1.2" />
          <circle cx="10" cy="46.5" r="0.6" fill="#71717A" />

          {/* Pulgar blindado cerrando el agarre sobre la empuñadura */}
          <path d="M13 37 C14 36, 17 37, 16.5 39 C16 40, 14 39, 13 37 Z" fill="#27272A" stroke="#18181B" strokeWidth="1.3" />
          <line x1="14" y1="37" x2="15.5" y2="38.5" stroke="#71717A" strokeWidth="0.7" />
        </g>
      )}
    </>
  );
};

export default KatanaSvgContent;
