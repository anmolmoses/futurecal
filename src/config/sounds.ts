import { SoundConfig, SoundType } from '../types';

export const SOUND_PRESETS: Record<SoundType, SoundConfig> = {
  [SoundType.KeyClick]: {
    frequency: 800,
    duration: 0.05,
    type: 'sine',
    volume: 0.15,
    attack: 0.005,
    decay: 0.04,
  },
  [SoundType.OperationClick]: {
    frequency: 600,
    duration: 0.08,
    type: 'triangle',
    volume: 0.2,
    detune: -100,
    attack: 0.005,
    decay: 0.07,
  },
  [SoundType.Equals]: {
    frequency: 1200,
    duration: 0.15,
    type: 'sine',
    volume: 0.25,
    attack: 0.01,
    decay: 0.12,
  },
  [SoundType.Clear]: {
    frequency: 400,
    duration: 0.12,
    type: 'sawtooth',
    volume: 0.15,
    attack: 0.01,
    decay: 0.1,
  },
  [SoundType.Error]: {
    frequency: 200,
    duration: 0.3,
    type: 'square',
    volume: 0.2,
    detune: 50,
    attack: 0.01,
    decay: 0.25,
  },
  [SoundType.PanelOpen]: {
    frequency: 1000,
    duration: 0.1,
    type: 'sine',
    volume: 0.1,
    attack: 0.01,
    decay: 0.08,
  },
  [SoundType.PanelClose]: {
    frequency: 700,
    duration: 0.1,
    type: 'sine',
    volume: 0.1,
    attack: 0.01,
    decay: 0.08,
  },
  [SoundType.Startup]: {
    frequency: 500,
    duration: 0.5,
    type: 'sine',
    volume: 0.2,
    attack: 0.05,
    decay: 0.4,
  },
};

export const SOUND_STORAGE_KEY = 'nebula-calc-muted';
