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

  /** Get or create the singleton instance */
  static getInstance(): SoundEngine {
    if (!SoundEngine.instance) {
      SoundEngine.instance = new SoundEngine();
    }
    return SoundEngine.instance;
  }

  /** Lazily create AudioContext on first user interaction (Chrome autoplay policy) */
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    // Resume if suspended (happens before user gesture)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /** Play a sound by type */
  play(type: SoundType): void {
    if (this.muted) return;
    const config = SOUND_PRESETS[type];
    if (!config) return;
    this.playTone(config);
  }

  /**
   * Play a single tone from a SoundConfig.
   * Creates OscillatorNode + GainNode, applies attack/decay envelope,
   * and auto-cleans up nodes after playback.
   */
  private playTone(config: SoundConfig, startOffset: number = 0): void {
    const ctx = this.getContext();
    const now = ctx.currentTime + startOffset;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    // Configure oscillator
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, now);
    if (config.detune) {
      oscillator.detune.setValueAtTime(config.detune, now);
    }

    // Configure gain envelope (attack → peak → decay)
    const attack = config.attack ?? 0.005;
    const decay = config.decay ?? config.duration;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(config.volume, now + attack);
    gain.gain.linearRampToValueAtTime(0, now + attack + decay);

    // Connect: oscillator → gain → destination
    oscillator.connect(gain);
    gain.connect(ctx.destination);

    // Start and stop oscillator
    oscillator.start(now);
    oscillator.stop(now + config.duration + 0.05);

    // Auto-cleanup: disconnect nodes after playback to prevent memory leaks
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }

  /**
   * Play a rising sci-fi startup chord.
   * Three sine waves at 400Hz, 500Hz, 700Hz staggered by 100ms each.
   */
  playStartup(): void {
    if (this.muted) return;

    const frequencies = [400, 500, 700];
    const stagger = 0.1; // 100ms between each note

    frequencies.forEach((freq, i) => {
      const config: SoundConfig = {
        frequency: freq,
        duration: 0.5,
        type: 'sine',
        volume: 0.2,
        attack: 0.05,
        decay: 0.4,
      };
      this.playTone(config, i * stagger);
    });
  }

  /** Get current muted state */
  isMuted(): boolean {
    return this.muted;
  }

  /** Set muted state and persist to localStorage */
  setMuted(muted: boolean): void {
    this.muted = muted;
    localStorage.setItem(SOUND_STORAGE_KEY, String(muted));
  }
}
