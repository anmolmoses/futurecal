import { AnimationConfig, ParticleConfig } from '../types';

// --- Entrance Animations ---
export const ENTRANCE: Record<string, AnimationConfig> = {
  calculator: { duration: 0.8, delay: 0.2, ease: 'easeOut' },
  display:    { duration: 0.6, delay: 0.5, ease: 'easeOut' },
  buttonBase: { duration: 0.4, delay: 0.7, ease: 'easeOut' },
  buttonStagger: { duration: 0.05, delay: 0, ease: 'easeOut' }, // per-button delay increment
  historyPanel: { duration: 0.4, delay: 0, ease: 'easeOut' },
};

// --- Button Press Animation ---
export const BUTTON_PRESS = {
  scale: 0.92,
  duration: 0.1,
  glowIntensity: 1.5, // multiplier on base glow
};

// --- Display Result Animation ---
export const RESULT_ANIMATION = {
  morphDuration: 0.4,   // seconds for number morph
  flashDuration: 0.2,   // brief flash on =
  flashColor: 'rgba(0, 240, 255, 0.3)',
  glitchDuration: 0.5,  // error glitch effect
  glitchIntensity: 5,   // px offset
};

// --- Ripple ---
export const RIPPLE = {
  duration: 600,         // ms
  maxSize: 200,          // px radius
  opacity: 0.3,
};

// --- Particles ---
export const AMBIENT_PARTICLES: ParticleConfig = {
  count: 50,
  color: '#00f0ff',
  minSize: 1,
  maxSize: 3,
  minSpeed: 0.1,
  maxSpeed: 0.5,
  minOpacity: 0.1,
  maxOpacity: 0.4,
  connectDistance: 120,
};

export const BURST_PARTICLE_COUNT = 15;
export const BURST_SPEED_MULTIPLIER = 3;

// --- Reduced Motion ---
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
