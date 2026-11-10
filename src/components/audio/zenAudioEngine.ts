class ZenAudioEngine {
  private isPlaying = false;
  private volume = 0.5;
  private audioElement: HTMLAudioElement | null = null;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private volumeListeners: Set<(volume: number) => void> = new Set();
  private playPromise: Promise<void> | null = null;

  public subscribe(cb: (playing: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.isPlaying);
    return () => this.listeners.delete(cb);
  }

  public subscribeVolume(cb: (volume: number) => void): () => void {
    this.volumeListeners.add(cb);
    cb(this.volume);
    return () => this.volumeListeners.delete(cb);
  }

  private notify(): void {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isPlaying);
      } catch {
        // Safe execution
      }
    });
  }

  private notifyVolume(): void {
    this.volumeListeners.forEach((cb) => {
      try {
        cb(this.volume);
      } catch {
        // Safe execution
      }
    });
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    this.notifyVolume();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private getAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;

    if (!this.audioElement) {
      // Purga estricta de instancias duplicadas en el DOM para evitar solapamiento
      const existingAudios = document.querySelectorAll<HTMLAudioElement>(
        'audio#zen-bg-audio, audio[src*="zen-bg.mp3"]'
      );
      if (existingAudios.length > 1) {
        for (let i = 1; i < existingAudios.length; i++) {
          try {
            existingAudios[i].pause();
            existingAudios[i].src = '';
            existingAudios[i].remove();
          } catch {
            // Silencioso ante elementos ya removidos
          }
        }
      }

      let existing = (existingAudios[0] ||
        document.getElementById('zen-bg-audio')) as HTMLAudioElement | null;

      if (!existing && document.body) {
        existing = document.createElement('audio');
        existing.id = 'zen-bg-audio';
        existing.src = '/audio/zen-bg.mp3';
        existing.loop = true;
        existing.preload = 'none';
        existing.volume = this.volume;
        existing.setAttribute('aria-hidden', 'true');
        document.body.appendChild(existing);
      }

      if (existing) {
        this.audioElement = existing;
        this.audioElement.volume = this.volume;

        // Sincronización reactiva con eventos nativos
        this.audioElement.onplay = () => {
          this.isPlaying = true;
          this.notify();
        };
        this.audioElement.onpause = () => {
          this.isPlaying = false;
          this.notify();
        };
        this.audioElement.onerror = () => {
          this.isPlaying = false;
          this.notify();
        };
      }
    }
    return this.audioElement;
  }

  public async start(): Promise<boolean> {
    const audio = this.getAudio();
    if (!audio) return false;

    if (!audio.paused && !audio.ended && audio.currentTime > 0) {
      this.isPlaying = true;
      this.notify();
      return true;
    }

    if (this.playPromise) {
      try {
        await this.playPromise;
        return this.isPlaying;
      } catch {
        // Fallo previo
      }
    }

    try {
      audio.muted = false;
      audio.volume = this.volume;
      this.playPromise = audio.play();
      await this.playPromise;
      this.isPlaying = true;
      this.notify();
      return true;
    } catch {
      this.isPlaying = false;
      this.notify();
      return false;
    } finally {
      this.playPromise = null;
    }
  }

  public async stop(): Promise<void> {
    const audio = this.getAudio();
    if (this.playPromise) {
      try {
        await this.playPromise;
      } catch {
        // Ignorar
      }
    }
    if (audio && !audio.paused) {
      audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public async toggle(): Promise<void> {
    if (this.isPlaying || (this.audioElement && !this.audioElement.paused)) {
      await this.stop();
    } else {
      await this.start();
    }
  }
}

export const zenAudio = new ZenAudioEngine();
export default zenAudio;
