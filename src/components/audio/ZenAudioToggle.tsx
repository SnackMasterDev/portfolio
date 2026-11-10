import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { zenAudio } from './zenAudioEngine';

export interface ZenAudioToggleProps {
  className?: string;
}

export const ZenAudioToggle: React.FC<ZenAudioToggleProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    zenAudio.setVolume(0.5);

    const unsubscribePlay = zenAudio.subscribe((active) => {
      setIsPlaying(active);
    });

    const unsubscribeVol = zenAudio.subscribeVolume((vol) => {
      setVolume(vol);
    });

    return () => {
      unsubscribePlay();
      unsubscribeVol();
    };
  }, []);

  const handleToggle = () => {
    zenAudio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    zenAudio.setVolume(val);
    if (val === 0 && isPlaying) {
      zenAudio.stop();
    } else if (val > 0 && !isPlaying) {
      zenAudio.start();
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 p-1 rounded-full border border-[#d6cebf] bg-white/70 shadow-2xs backdrop-blur-xs transition-all ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Silenciar audio zen' : 'Activar audio zen'}
        aria-pressed={isPlaying}
        title={isPlaying ? 'Silenciar audio zen' : 'Activar audio zen'}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer whitespace-nowrap select-none ${
          isPlaying
            ? 'bg-[#be185d]/10 text-[#be185d] font-semibold'
            : 'text-[#78716c] hover:text-[#1c1c1e]'
        }`}
      >
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-[#be185d] animate-pulse" aria-hidden="true" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-[#a8a29e]" aria-hidden="true" />
        )}
        <span>{isPlaying ? 'Audio ON' : 'Audio OFF'}</span>
      </button>

      {/* Control deslizante de volumen accesible */}
      <div className="flex items-center px-1.5 pr-2">
        <input
          type="range"
          id="zen-volume-slider"
          min="0"
          max="1"
          step="0.05"
          value={isPlaying ? volume : 0}
          onChange={handleVolumeChange}
          aria-label="Control de volumen de audio zen"
          title={`Volumen: ${Math.round((isPlaying ? volume : 0) * 100)}%`}
          className="w-14 sm:w-16 h-1 bg-[#d6cebf] rounded-lg appearance-none cursor-pointer accent-[#be185d]"
        />
      </div>
    </div>
  );
};

export default ZenAudioToggle;
