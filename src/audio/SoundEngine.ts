// ============================================
// NEBULA CALC — Sound Engine (Singleton)
// ============================================

import { SoundType, SoundConfig } from '../types';
import { SOUND_PRESETS, SOUND_STORAGE_KEY } from '../config/sounds';

export class SoundEngine {
  private static instance: SoundEngine | null = null;
  private audioContext: AudioContext | null = null;
  private muted: boolean;

  private constructor() {
    this.muted = localStorage.getItem(SOUND_STORAGE_KEY) === 'true';
  }

  static getInstance(): SoundEngine {
    if (!SoundEngine.instance) {
      SoundEngine.instance = new SoundEngine();
    }
    return SoundEngine.instance;
  }

  /**
   * Lazily create AudioContext on first user interaction
   * to comply with Chrome autoplay policy.
   */
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    // Resume if suspended (autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  get isMuted(): boolean {
    return this.muted;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    localStorage.setItem(SOUND_STORAGE_KEY, String(muted));
  }

  /**
   * Play a sound by type using the preset config.
   */
  play(type: SoundType): void {
    if (this.muted) return;

    const config = SOUND_PRESETS[type];
    if (!config) return;

    this.playTone(config);
  }

  /**
   * Play a single oscillator tone with envelope.
   */
  private playTone(config: SoundConfig, startOffset = 0): void {
    const ctx = this.getContext();
    const now = ctx.currentTime + startOffset;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, now);

    if (config.detune) {
      oscillator.detune.setValueAtTime(config.detune, now);
    }

    // Envelope: attack ramp up, then decay ramp down
    const attack = config.attack ?? 0.005;
    const decay = config.decay ?? config.duration;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(config.volume, now + attack);
    gainNode.gain.linearRampToValueAtTime(0, now + attack + decay);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + config.duration + 0.05);

    // Auto-cleanup
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  /**
   * Play a rising sci-fi startup chord:
   * Three sine waves at 400Hz, 500Hz, 700Hz staggered by 100ms.
   */
  playStartup(): void {
    if (this.muted) return;

    const ctx = this.getContext();
    const frequencies = [400, 500, 700];
    const stagger = 0.1; // 100ms

    frequencies.forEach((freq, i) => {
      this.playTone(
        {
          frequency: freq,
          duration: 0.5,
          type: 'sine',
          volume: 0.18,
          attack: 0.05,
          decay: 0.4,
        },
        i * stagger
      );
    });
  }
}
