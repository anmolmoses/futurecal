import React from 'react';
import { motion } from 'framer-motion';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { HistoryPanel } from './HistoryPanel';
import { THEME } from '../config/theme';
import { ENTRANCE } from '../config/animations';
import { CalculatorState, HistoryEntry, KeyConfig } from '../types';

interface CalculatorProps {
  state: CalculatorState;
  history: HistoryEntry[];
  historyOpen: boolean;
  activeKey: string | null;
  onKeyPress: (key: KeyConfig) => void;
  onToggleHistory: () => void;
  onCloseHistory: () => void;
  onEntryClick: (entry: HistoryEntry) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  state,
  history,
  historyOpen,
  activeKey,
  onKeyPress,
  onToggleHistory,
  onCloseHistory,
  onEntryClick,
}) => {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start' }}>
      {/* Main Calculator Card */}
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          duration: ENTRANCE.calculator.duration,
          delay: ENTRANCE.calculator.delay,
          ease: 'easeOut',
        }}
        style={{
          width: THEME.layout.calcWidth,
          maxWidth: THEME.layout.calcMaxWidth,
          background: THEME.colors.bgSurface,
          backdropFilter: THEME.blur.glass,
          WebkitBackdropFilter: THEME.blur.glass,
          border: `1px solid ${THEME.colors.bgGlassBorder}`,
          borderRadius: THEME.radius.lg,
          boxShadow: THEME.glow.subtle,
          padding: THEME.spacing.lg,
          position: 'relative',
          overflow: 'hidden',
          contain: 'layout style paint',
        }}
      >
        {/* History toggle button */}
        <button
          onClick={onToggleHistory}
          aria-label={historyOpen ? 'Close history' : 'Open history'}
          style={{
            position: 'absolute',
            top: THEME.spacing.md,
            left: THEME.spacing.md,
            background: THEME.colors.bgGlass,
            border: `1px solid ${THEME.colors.bgGlassBorder}`,
            borderRadius: THEME.radius.sm,
            color: THEME.colors.textSecondary,
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: `background ${THEME.transition.fast}, color ${THEME.transition.fast}`,
            zIndex: 2,
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = THEME.colors.bgGlassHover;
            (e.target as HTMLElement).style.color = THEME.colors.textPrimary;
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = THEME.colors.bgGlass;
            (e.target as HTMLElement).style.color = THEME.colors.textSecondary;
          }}
        >
          🕐
        </button>

        {/* Display */}
        <div style={{ marginTop: THEME.spacing.xl, marginBottom: THEME.spacing.lg }}>
          <Display
            value={state.display}
            expression={state.expression}
            error={state.error}
            isAnimating={false}
          />
        </div>

        {/* Keypad */}
        <Keypad
          onKeyPress={onKeyPress}
          activeKey={activeKey}
          disabled={false}
        />
      </motion.div>

      {/* History Panel */}
      <HistoryPanel
        entries={history}
        isOpen={historyOpen}
        onClose={onCloseHistory}
        onEntryClick={onEntryClick}
      />
    </div>
  );
};