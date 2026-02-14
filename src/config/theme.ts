// ============================================
// NEBULA CALC — Theme Configuration
// ============================================

export const THEME = {
  colors: {
    // Background layers
    bgDeep: '#0a0a0f',
    bgSurface: 'rgba(15, 15, 25, 0.85)',
    bgGlass: 'rgba(255, 255, 255, 0.05)',
    bgGlassHover: 'rgba(255, 255, 255, 0.1)',
    bgGlassBorder: 'rgba(255, 255, 255, 0.12)',

    // Neon accents
    neonCyan: '#00f0ff',
    neonPurple: '#b44aff',
    neonPink: '#ff2d7c',
    neonGreen: '#00ff88',
    neonOrange: '#ff8800',

    // Text
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textDim: 'rgba(255, 255, 255, 0.3)',

    // Semantic
    error: '#ff3355',
    equals: '#00f0ff',
    operation: '#b44aff',
    number: 'rgba(255, 255, 255, 0.08)',
    function: 'rgba(255, 255, 255, 0.12)',
  },

  glow: {
    cyan: '0 0 20px rgba(0, 240, 255, 0.4), 0 0 60px rgba(0, 240, 255, 0.1)',
    purple: '0 0 20px rgba(180, 74, 255, 0.4), 0 0 60px rgba(180, 74, 255, 0.1)',
    pink: '0 0 20px rgba(255, 45, 124, 0.4), 0 0 60px rgba(255, 45, 124, 0.1)',
    error: '0 0 30px rgba(255, 51, 85, 0.6), 0 0 80px rgba(255, 51, 85, 0.2)',
    subtle: '0 0 10px rgba(0, 240, 255, 0.15)',
  },

  blur: {
    glass: 'blur(20px)',
    heavy: 'blur(40px)',
  },

  radius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    pill: '9999px',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  font: {
    family: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
    monoFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    displaySize: '3.5rem',
    expressionSize: '1rem',
    buttonSize: '1.4rem',
    historySize: '0.9rem',
  },

  transition: {
    fast: '0.15s ease-out',
    normal: '0.3s ease-out',
    slow: '0.6s ease-out',
    spring: '0.5s cubic-bezier(0.17, 0.67, 0.83, 0.97)',
  },

  layout: {
    calcWidth: '380px',
    calcMaxWidth: '95vw',
    buttonGap: '12px',
    historyWidth: '320px',
  },
} as const;

export type ThemeColors = typeof THEME.colors;
export type ThemeGlow = typeof THEME.glow;
