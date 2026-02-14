// ============================================
// NEBULA CALC — Sound Toggle Button
// ============================================
import React from 'react';
import { useSound } from '../hooks/useSound';
import { THEME } from '../config/theme';

/** Speaker icon (unmuted) */
const SpeakerOnIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

/** Speaker icon (muted) */
const SpeakerOffIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

/**
 * Small mute/unmute toggle button.
 * Positioned in top-right of calculator card.
 * Glassmorphic style matching theme.
 */
export const SoundToggle: React.FC = () => {
  const { isMuted, setMuted } = useSound();

  return (
    <button
      onClick={() => setMuted(!isMuted)}
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
      title={isMuted ? 'Unmute sound' : 'Mute sound'}
      style={{
        position: 'absolute',
        top: THEME.spacing.sm,
        right: THEME.spacing.sm,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        padding: 0,
        border: `1px solid ${THEME.colors.bgGlassBorder}`,
        borderRadius: THEME.radius.sm,
        background: THEME.colors.bgGlass,
        backdropFilter: THEME.blur.glass,
        WebkitBackdropFilter: THEME.blur.glass,
        color: isMuted ? THEME.colors.textDim : THEME.colors.neonCyan,
        cursor: 'pointer',
        transition: `color ${THEME.transition.fast}, border-color ${THEME.transition.fast}, box-shadow ${THEME.transition.fast}`,
        outline: 'none',
        zIndex: 10,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = THEME.colors.neonCyan;
        el.style.boxShadow = THEME.glow.subtle;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = THEME.colors.bgGlassBorder;
        el.style.boxShadow = 'none';
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = THEME.glow.cyan;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
    </button>
  );
};
