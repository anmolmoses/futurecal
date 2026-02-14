// ============================================
// NEBULA CALC — useSound Hook
// ============================================
import { useState, useCallback, useRef } from 'react';
import { SoundType, UseSoundReturn } from '../types';
import { SOUND_STORAGE_KEY } from '../config/sounds';
import { REDUCED_MOTION_QUERY } from '../config/animations';
import { SoundEngine } from '../audio/SoundEngine';

/**
 * React hook wrapping SoundEngine.
 * Returns play, setMuted, isMuted.
 * play is a no-op when muted or when prefers-reduced-motion is active.
 */
export function useSound(): UseSoundReturn {
  const engineRef = useRef<SoundEngine>(SoundEngine.getInstance());

  const [isMuted, setIsMutedState] = useState<boolean>(() => {
    return localStorage.getItem(SOUND_STORAGE_KEY) === 'true';
  });

  // Check reduced motion preference directly (no dependency on dev-3's hook)
  const prefersReducedMotion = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  }, []);

  const play = useCallback((type: SoundType): void => {
    if (isMuted || prefersReducedMotion()) return;
    engineRef.current.play(type);
  }, [isMuted, prefersReducedMotion]);

  const setMuted = useCallback((muted: boolean): void => {
    engineRef.current.setMuted(muted);
    setIsMutedState(muted);
  }, []);

  return { play, setMuted, isMuted };
}
