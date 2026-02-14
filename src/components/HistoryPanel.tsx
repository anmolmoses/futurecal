// ============================================
// NEBULA CALC — History Panel Component
// ============================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME } from '../config/theme';
import { ENTRANCE } from '../config/animations';
import type { HistoryPanelProps, HistoryEntry } from '../types';

/**
 * Slide-in history panel on the right side of the calculator.
 * Shows past calculations in a scrollable list.
 * Each entry is clickable to recall the result.
 */
const HistoryPanel: React.FC<HistoryPanelProps> = ({
  entries,
  isOpen,
  onClose,
  onEntryClick,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={styles.panel}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: ENTRANCE.historyPanel.duration,
          }}
          role="complementary"
          aria-label="Calculation history"
        >
          {/* Header */}
          <div style={styles.header}>
            <span style={styles.title}>History</span>
            <button
              onClick={onClose}
              style={styles.closeButton}
              aria-label="Close history panel"
            >
              ×
            </button>
          </div>

          {/* Entries list */}
          <div
            style={styles.list}
            role="list"
            aria-label="Past calculations"
          >
            {entries.length === 0 ? (
              <div style={styles.empty}>No calculations yet</div>
            ) : (
              entries.map((entry: HistoryEntry) => (
                <motion.button
                  key={entry.id}
                  style={styles.entry}
                  onClick={() => onEntryClick(entry)}
                  role="listitem"
                  aria-label={`${entry.expression} equals ${entry.result}`}
                  whileHover={{
                    background: THEME.colors.bgGlassHover,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={styles.entryExpression}>{entry.expression}</div>
                  <div style={styles.entryResult}>= {entry.result}</div>
                </motion.button>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Styles ---
const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: THEME.layout.historyWidth,
    background: 'rgba(10, 14, 26, 0.85)',
    backdropFilter: THEME.blur.glass,
    WebkitBackdropFilter: THEME.blur.glass,
    borderLeft: `1px solid ${THEME.colors.bgGlassBorder}`,
    borderRadius: `0 ${THEME.radius.lg} ${THEME.radius.lg} 0`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 10,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
    borderBottom: `1px solid ${THEME.colors.bgGlassBorder}`,
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: THEME.colors.textPrimary,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  closeButton: {
    background: 'none',
    color: THEME.colors.textSecondary,
    fontSize: '1.5rem',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: THEME.radius.sm,
    transition: `color ${THEME.transition.fast}, background ${THEME.transition.fast}`,
    cursor: 'pointer',
    border: 'none',
  },
  list: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: THEME.spacing.sm,
  },
  empty: {
    color: THEME.colors.textDim,
    textAlign: 'center' as const,
    padding: THEME.spacing.xl,
    fontSize: THEME.font.historySize,
  },
  entry: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    padding: `${THEME.spacing.sm} ${THEME.spacing.md}`,
    marginBottom: THEME.spacing.xs,
    background: 'transparent',
    borderRadius: THEME.radius.sm,
    border: `1px solid transparent`,
    cursor: 'pointer',
    transition: `background ${THEME.transition.fast}`,
    textAlign: 'right' as const,
    color: THEME.colors.textPrimary,
  },
  entryExpression: {
    fontSize: THEME.font.historySize,
    color: THEME.colors.textSecondary,
    fontFamily: THEME.font.monoFamily,
    marginBottom: '2px',
  },
  entryResult: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: THEME.colors.neonCyan,
    fontFamily: THEME.font.monoFamily,
  },
};

export default HistoryPanel;