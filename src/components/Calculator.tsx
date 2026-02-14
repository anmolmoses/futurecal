// ============================================
// NEBULA CALC — Calculator Card Component
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../config/theme';
import { ENTRANCE } from '../config/animations';
import type {
  KeyConfig,
  HistoryEntry,
  CalculatorError,
} from '../types';
import Display from './Display';
import Keypad from './Keypad';
import HistoryPanel from './HistoryPanel';

interface CalculatorProps {
  display: string;
  expression: string;
  error: CalculatorError | null;
  isAnimating: boolean;
  activeKey: string | null;
  historyEntries: HistoryEntry[];
  onKeyPress: (key: KeyConfig) => void;
  onHistoryEntryClick: (entry: HistoryEntry) => void;
  disabled: boolean;
}

/**
 * Main calculator card — glassmorphic container that composes
 * Display, Keypad, and HistoryPanel.
 */
const Calculator: React.FC<CalculatorProps> = ({
  display,
  expression,
  error,
  isAnimating,
  activeKey,
  historyEntries,
  onKeyPress,
  onHistoryEntryClick,
  disabled,
}) => {
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <motion.div
      style={styles.wrapper}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: ENTRANCE.calculator.duration,
        delay: ENTRANCE.calculator.delay,
        ease: 'easeOut',
      }}
    >
      {/* History toggle button */}
      <button
        onClick={() => setHistoryOpen((prev) => !prev)}
        style={styles.historyToggle}
        aria-label={historyOpen ? 'Close history' : 'Open history'}
        aria-expanded={historyOpen}
      >
        🕐
      </button>

      {/* Display */}
      <Display
        value={display}
        expression={expression}
        error={error}
        isAnimating={isAnimating}
      />

      {/* Keypad */}
      <Keypad
        onKeyPress={onKeyPress}
        activeKey={activeKey}
        disabled={disabled}
      />

      {/* History Panel */}
      <HistoryPanel
        entries={historyEntries}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onEntryClick={onHistoryEntryClick}
      />
    </motion.div>
  );
};

// --- Styles ---
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'relative',
    width: THEME.layout.calcWidth,
    maxWidth: THEME.layout.calcMaxWidth,
    background: THEME.colors.bgSurface,
    backdropFilter: THEME.blur.glass,
    WebkitBackdropFilter: THEME.blur.glass,
    border: `1px solid ${THEME.colors.bgGlassBorder}`,
    borderRadius: THEME.radius.lg,
    boxShadow: THEME.glow.subtle,
    overflow: 'hidden',
    contain: 'layout style paint',
  },
  historyToggle: {
    position: 'absolute',
    top: THEME.spacing.sm,
    left: THEME.spacing.sm,
    zIndex: 5,
    background: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: THEME.radius.sm,
    transition: `background ${THEME.transition.fast}`,
    opacity: 0.6,
    color: THEME.colors.textPrimary,
  },
};

export default Calculator;