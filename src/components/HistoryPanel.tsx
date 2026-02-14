import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryPanelProps } from '../types';
import { THEME } from '../config/theme';
import { ENTRANCE } from '../config/animations';

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  entries,
  isOpen,
  onClose,
  onEntryClick,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{
            duration: ENTRANCE.historyPanel.duration,
            ease: 'easeOut',
          }}
          role="region"
          aria-label="Calculation history"
          style={{
            width: THEME.layout.historyWidth,
            maxWidth: '90vw',
            background: THEME.colors.bgSurface,
            backdropFilter: THEME.blur.glass,
            WebkitBackdropFilter: THEME.blur.glass,
            border: `1px solid ${THEME.colors.bgGlassBorder}`,
            borderRadius: THEME.radius.lg,
            marginLeft: THEME.spacing.md,
            padding: THEME.spacing.lg,
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: THEME.glow.subtle,
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: THEME.spacing.lg,
          }}>
            <span style={{
              fontSize: THEME.font.expressionSize,
              color: THEME.colors.textSecondary,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              History
            </span>
            <button
              onClick={onClose}
              aria-label="Close history panel"
              style={{
                background: THEME.colors.bgGlass,
                border: `1px solid ${THEME.colors.bgGlassBorder}`,
                borderRadius: THEME.radius.sm,
                color: THEME.colors.textSecondary,
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                cursor: 'pointer',
                transition: `background ${THEME.transition.fast}, color ${THEME.transition.fast}`,
              }}
              onMouseEnter={e => {
                (e.currentTarget).style.background = THEME.colors.bgGlassHover;
                (e.currentTarget).style.color = THEME.colors.textPrimary;
              }}
              onMouseLeave={e => {
                (e.currentTarget).style.background = THEME.colors.bgGlass;
                (e.currentTarget).style.color = THEME.colors.textSecondary;
              }}
            >
              ✕
            </button>
          </div>

          {/* Entries */}
          {entries.length === 0 ? (
            <div style={{
              color: THEME.colors.textDim,
              fontSize: THEME.font.historySize,
              textAlign: 'center',
              padding: THEME.spacing.xl,
            }}>
              No calculations yet
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} aria-label="Calculation entries">
              {entries.map(entry => (
                <li
                  key={entry.id}
                  onClick={() => onEntryClick(entry)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${entry.expression} equals ${entry.result}`}
                  onKeyDown={e => { if (e.key === 'Enter') onEntryClick(entry); }}
                  style={{
                    padding: `${THEME.spacing.sm} ${THEME.spacing.sm}`,
                    borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
                    cursor: 'pointer',
                    borderRadius: THEME.radius.sm,
                    transition: `background ${THEME.transition.fast}`,
                  }}
                  onMouseEnter={e => { (e.currentTarget).style.background = THEME.colors.bgGlass; }}
                  onMouseLeave={e => { (e.currentTarget).style.background = 'transparent'; }}
                >
                  <div style={{
                    fontSize: THEME.font.historySize,
                    color: THEME.colors.textSecondary,
                    fontFamily: THEME.font.monoFamily,
                  }}>
                    {entry.expression}
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: THEME.colors.neonCyan,
                    fontFamily: THEME.font.monoFamily,
                    textShadow: '0 0 8px rgba(0, 240, 255, 0.3)',
                  }}>
                    = {entry.result}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};