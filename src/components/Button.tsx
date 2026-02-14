import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ButtonProps, KeyType } from '../types';
import { THEME } from '../config/theme';
import { ENTRANCE, BUTTON_PRESS } from '../config/animations';

function getButtonBackground(type: KeyType): string {
  switch (type) {
    case KeyType.Number:
      return THEME.colors.number;
    case KeyType.Operation:
      return `rgba(180, 74, 255, 0.2)`;
    case KeyType.Equals:
      return THEME.colors.equals;
    case KeyType.Function:
      return THEME.colors.function;
    case KeyType.Decimal:
      return THEME.colors.number;
    default:
      return THEME.colors.number;
  }
}

function getTextColor(type: KeyType): string {
  switch (type) {
    case KeyType.Operation:
      return THEME.colors.neonPurple;
    case KeyType.Equals:
      return THEME.colors.bgDeep;
    case KeyType.Function:
      return THEME.colors.textPrimary;
    default:
      return THEME.colors.textPrimary;
  }
}

export const Button: React.FC<ButtonProps> = ({ config, onPress, isActive, entranceDelay }) => {
  const handleClick = useCallback(() => {
    onPress(config);
  }, [onPress, config]);

  const bg = getButtonBackground(config.type);
  const color = getTextColor(config.type);
  const isEquals = config.type === KeyType.Equals;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: ENTRANCE.buttonBase.duration,
        delay: ENTRANCE.buttonBase.delay + entranceDelay,
        ease: 'easeOut',
      }}
      whileTap={{ scale: BUTTON_PRESS.scale }}
      onClick={handleClick}
      aria-label={config.ariaLabel}
      style={{
        gridColumn: config.gridSpan ? `span ${config.gridSpan}` : undefined,
        background: bg,
        color,
        border: `1px solid ${THEME.colors.bgGlassBorder}`,
        borderRadius: THEME.radius.md,
        fontSize: THEME.font.buttonSize,
        fontFamily: config.type === KeyType.Number || config.type === KeyType.Decimal
          ? THEME.font.monoFamily
          : THEME.font.family,
        fontWeight: 500,
        padding: `${THEME.spacing.md} 0`,
        minHeight: '56px',
        cursor: 'pointer',
        transition: `background ${THEME.transition.fast}, box-shadow ${THEME.transition.fast}, border-color ${THEME.transition.fast}`,
        boxShadow: isActive
          ? (isEquals ? THEME.glow.cyan : THEME.glow.subtle)
          : 'none',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.background = isEquals ? THEME.colors.neonCyan : THEME.colors.bgGlassHover;
        el.style.boxShadow = isEquals ? THEME.glow.cyan : THEME.glow.subtle;
        el.style.borderColor = isEquals ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.background = bg;
        el.style.boxShadow = 'none';
        el.style.borderColor = THEME.colors.bgGlassBorder;
      }}
    >
      {config.label}
    </motion.button>
  );
};