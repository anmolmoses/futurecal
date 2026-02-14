// ============================================
// NEBULA CALC — useSound Hook
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { SoundType, UseSoundReturn } from '../types';
import { SOUND_STORAGE_KEY } from '../config/sounds';
import { REDUCED_MOTION_QUERY } from '../config/animations';
import { SoundEngine } from '../audio/SoundEngine';

export function useSound(): UseSoundReturn {
  const engineRef = useRef<SoundEngine>(SoundEngine.getInstance());

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem(SOUND_STORAGE_KEY) === 'true';
  });

  // Check reduced motion preference
  const reducedMotionRef = useRef<boolean>(false);
  useEffect(() => {
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    reducedMotionRef.current = mql.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const play = useCallback((type: SoundType) => {
    if (isMuted || reducedMotionRef.current) return;
    engineRef.current.play(type);
  }, [isMuted]);

  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
    engineRef.current.setMuted(muted);
  }, []);

  return { play, setMuted, isMuted };
}
