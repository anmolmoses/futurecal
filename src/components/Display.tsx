// ============================================
// NEBULA CALC — Display Component
// ============================================

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME } from '../config/theme';
import { ENTRANCE } from '../config/animations';
import type { DisplayProps, CalculatorError } from '../types';

/**
 * Calculator display showing expression and current value.
 * Auto-scales font size for long numbers.
 * Shows error state with red glow when error is non-null.
 */
const Display: React.FC<DisplayProps> = ({ value, expression, error, isAnimating }) => {
  // Auto-scale font for long numbers
  const fontSize = useMemo(() => {
    const len = value.length;
    if (len <= 8) return THEME.font.displaySize;   // 3.5rem
    if (len <= 10) return '2.8rem';
    if (len <= 12) return '2.2rem';
    return '1.8rem';
  }, [value]);

  const errorMessage = useMemo(() => {
    if (!error) return null;
    switch (error) {
      case 'DIVISION_BY_ZERO': return 'Cannot divide by zero';
      case 'OVERFLOW': return 'Number too large';
      case 'INVALID_INPUT': return 'Invalid input';
      default: return 'Error';
    }
  }, [error]);

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ENTRANCE.display.duration,
        delay: ENTRANCE.display.delay,
        ease: 'easeOut',
      }}
    >
      {/* Expression line */}
      <div
        style={styles.expression}
        aria-live="polite"
        role="status"
      >
        {expression || '\u00A0'}
      </div>

      {/* Main value display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={error ? 'error' : value}
          style={{
            ...styles.value,
            fontSize,
            color: error ? THEME.colors.error : THEME.colors.textPrimary,
            textShadow: error
              ? THEME.glow.error
              : `0 0 20px rgba(0, 240, 255, 0.3)`,
          }}
          initial={{ opacity: 0.6, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          aria-live={error ? 'assertive' : 'polite'}
          aria-atomic="true"
          role="status"
          aria-label={error ? `Error: ${errorMessage}` : `Result: ${value}`}
        >
          {error ? errorMessage : value}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// --- Styles ---
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: `${THEME.spacing.lg} ${THEME.spacing.xl}`,
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    overflow: 'hidden',
    borderBottom: `1px solid ${THEME.colors.bgGlassBorder}`,
  },
  expression: {
    fontSize: THEME.font.expressionSize,
    color: THEME.colors.textSecondary,
    fontFamily: THEME.font.monoFamily,
    marginBottom: THEME.spacing.sm,
    minHeight: '1.4em',
    textAlign: 'right' as const,
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  value: {
    fontFamily: THEME.font.monoFamily,
    fontWeight: 700,
    textAlign: 'right' as const,
    width: '100%',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
};

export default Display;