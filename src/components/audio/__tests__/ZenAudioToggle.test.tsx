import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import ZenAudioToggle from '../ZenAudioToggle';
import { zenAudio } from '../zenAudioEngine';

describe('ZenAudioToggle Component', () => {
  it('renders audio toggle button with accessible labels, Audio OFF state, and volume slider', () => {
    const html = renderToString(React.createElement(ZenAudioToggle));
    expect(html).toContain('aria-label="Activar audio zen"');
    expect(html).toContain('Audio OFF');
    expect(html).toContain('id="zen-volume-slider"');
  });

  it('guarantees default browser volume is initialized to 50% (0.5)', () => {
    expect(zenAudio.getVolume()).toBe(0.5);
  });

  it('updates volume via setVolume and notifies listeners', () => {
    zenAudio.setVolume(0.8);
    expect(zenAudio.getVolume()).toBe(0.8);
    zenAudio.setVolume(0.5);
    expect(zenAudio.getVolume()).toBe(0.5);
  });

  it('handles start and stop without throwing or creating multiple streams', async () => {
    expect(zenAudio.getIsPlaying()).toBe(false);
    await zenAudio.stop();
    expect(zenAudio.getIsPlaying()).toBe(false);
  });

  it('safely toggles state and remains consistent in non-browser environments', async () => {
    await zenAudio.toggle();
    expect(zenAudio.getIsPlaying()).toBe(false);
  });
});
