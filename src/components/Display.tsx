import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DisplayProps } from '../types';
import { THEME } from '../config/theme';
import { ENTRANCE } from '../config/animations';

export const Display: React.FC<DisplayProps> = ({ value, expression, error, isAnimating }) => {
  // Auto-scale display text for long numbers
  const getFontSize = (text: string): string => {
    if (text.length > 12) return '1.8rem';
    if (text.length > 9) return '2.4rem';
    return THEME.font.displaySize;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ENTRANCE.display.duration, delay: ENTRANCE.display.delay }}
      role="status"
      aria-live={error ? 'assertive' : 'polite'}
      aria-label={error ? `Error: ${error}` : `Display: ${value}`}
      style={{
        textAlign: 'right',
        padding: `${THEME.spacing.md} ${THEME.spacing.sm}`,
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Expression line */}
      <div
        style={{
          fontSize: THEME.font.expressionSize,
          color: THEME.colors.textSecondary,
          fontFamily: THEME.font.monoFamily,
          minHeight: '1.4em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {expression || '\u00A0'}
      </div>

      {/* Main value */}
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0.6, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          style={{
            fontSize: getFontSize(value),
            fontFamily: THEME.font.monoFamily,
            fontWeight: 700,
            color: error ? THEME.colors.error : THEME.colors.textPrimary,
            textShadow: error
              ? THEME.glow.error
              : `0 0 10px rgba(0, 240, 255, 0.3)`,
            lineHeight: 1.2,
            wordBreak: 'break-all',
            transition: `color ${THEME.transition.fast}, text-shadow ${THEME.transition.fast}`,
          }}
        >
          {error ? 'Error' : value}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};