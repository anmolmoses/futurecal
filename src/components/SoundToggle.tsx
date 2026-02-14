// ============================================
// NEBULA CALC — Sound Toggle Button
// ============================================

import React from 'react';
import { useSound } from '../hooks/useSound';
import { THEME } from '../config/theme';

const styles: Record<string, React.CSSProperties> = {
  button: {
    position: 'absolute',
    top: THEME.spacing.sm,
    right: THEME.spacing.sm,
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: THEME.colors.bgGlass,
    border: `1px solid ${THEME.colors.bgGlassBorder}`,
    borderRadius: THEME.radius.sm,
    backdropFilter: THEME.blur.glass,
    WebkitBackdropFilter: THEME.blur.glass,
    cursor: 'pointer',
    color: THEME.colors.textSecondary,
    fontSize: '18px',
    padding: 0,
    transition: `color ${THEME.transition.fast}, border-color ${THEME.transition.fast}, box-shadow ${THEME.transition.fast}`,
    zIndex: 10,
  },
};

// Simple SVG speaker icons to avoid external deps
const SpeakerOn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const SpeakerOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

export const SoundToggle: React.FC = () => {
  const { isMuted, setMuted } = useSound();

  const handleClick = () => {
    setMuted(!isMuted);
  };

  return (
    <button
      style={styles.button}
      onClick={handleClick}
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      title={isMuted ? 'Unmute' : 'Mute'}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = THEME.colors.neonCyan;
        (e.currentTarget as HTMLButtonElement).style.borderColor = THEME.colors.neonCyan;
        (e.currentTarget as HTMLButtonElement).style.boxShadow = THEME.glow.subtle;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = THEME.colors.textSecondary;
        (e.currentTarget as HTMLButtonElement).style.borderColor = THEME.colors.bgGlassBorder;
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
      }}
    >
      {isMuted ? <SpeakerOff /> : <SpeakerOn />}
    </button>
  );
};
