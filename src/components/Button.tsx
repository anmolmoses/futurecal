// ============================================
// NEBULA CALC — Button Component
// ============================================

import React, { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../config/theme';
import { ENTRANCE, BUTTON_PRESS, RIPPLE } from '../config/animations';
import { KeyType } from '../types';
import type { ButtonProps } from '../types';

/**
 * Single calculator key with glassmorphic styling.
 * Background varies by KeyType. Supports gridSpan for wide keys (e.g. '0').
 * Entrance animation with staggered delay.
 */
const Button: React.FC<ButtonProps> = ({ config, onPress, isActive, entranceDelay }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);

  // Determine background color based on key type
  const getBackground = useCallback((): string => {
    switch (config.type) {
      case KeyType.Number:
        return THEME.colors.number;
      case KeyType.Operation:
        // Use theme token at 20% opacity — extract base color
        return THEME.colors.operation + '33'; // 33 hex ≈ 20% opacity
      case KeyType.Equals:
        return THEME.colors.equals;
      case KeyType.Function:
        return THEME.colors.function;
      case KeyType.Decimal:
        return THEME.colors.number;
      default:
        return THEME.colors.bgGlass;
    }
  }, [config.type]);

  // Get text color — equals button gets dark text for contrast
  const getTextColor = (): string => {
    if (config.type === KeyType.Equals) return '#0a0a0f';
    if (config.type === KeyType.Operation) return THEME.colors.operation;
    if (config.type === KeyType.Function) return THEME.colors.textSecondary;
    return THEME.colors.textPrimary;
  };

  // Get glow on hover
  const getHoverGlow = (): string => {
    if (config.type === KeyType.Equals) return THEME.glow.cyan;
    if (config.type === KeyType.Operation) return THEME.glow.purple;
    return 'none';
  };

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger ripple effect
    if (buttonRef.current && rippleRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = rippleRef.current;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = `${RIPPLE.maxSize}px`;
      ripple.style.height = `${RIPPLE.maxSize}px`;
      ripple.style.opacity = String(RIPPLE.opacity);
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';

      // Force reflow
      void ripple.offsetWidth;

      ripple.style.transition = `transform ${RIPPLE.duration}ms ease-out, opacity ${RIPPLE.duration}ms ease-out`;
      ripple.style.transform = 'translate(-50%, -50%) scale(1)';
      ripple.style.opacity = '0';
    }

    onPress(config);
  }, [config, onPress]);

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      aria-label={config.ariaLabel}
      style={{
        ...styles.button,
        gridColumn: config.gridSpan ? `span ${config.gridSpan}` : undefined,
        background: getBackground(),
        color: getTextColor(),
        fontSize: THEME.font.buttonSize,
        boxShadow: isActive ? getHoverGlow() : 'none',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: ENTRANCE.buttonBase.duration,
        delay: ENTRANCE.buttonBase.delay + entranceDelay,
        ease: ENTRANCE.buttonBase.ease,
      }}
      whileHover={{
        background: THEME.colors.bgGlassHover,
        boxShadow: getHoverGlow(),
        transition: { duration: 0.15 },
      }}
      whileTap={{
        scale: BUTTON_PRESS.scale,
        transition: { duration: BUTTON_PRESS.duration },
      }}
    >
      {config.label}

      {/* Ripple element */}
      <span
        ref={rippleRef}
        style={styles.ripple}
        aria-hidden="true"
      />
    </motion.button>
  );
};

// --- Styles ---
const styles: Record<string, React.CSSProperties> = {
  button: {
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${THEME.colors.bgGlassBorder}`,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    fontFamily: THEME.font.family,
    fontWeight: 500,
    minHeight: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    cursor: 'pointer',
    userSelect: 'none',
    transition: `background ${THEME.transition.fast}, box-shadow ${THEME.transition.fast}`,
  },
  ripple: {
    position: 'absolute',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${THEME.colors.neonCyan}44 0%, transparent 70%)`,
    pointerEvents: 'none',
    width: 0,
    height: 0,
    opacity: 0,
  },
};

export default Button;