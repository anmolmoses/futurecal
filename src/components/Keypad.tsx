// ============================================
// NEBULA CALC — Keypad Component
// ============================================

import React, { useCallback } from 'react';
import { THEME } from '../config/theme';
import { ENTRANCE } from '../config/animations';
import { KEYPAD_LAYOUT } from '../config/keys';
import type { KeyConfig, KeypadProps } from '../types';
import Button from './Button';

/**
 * 4-column CSS Grid keypad.
 * Iterates KEYPAD_LAYOUT rows and passes staggered entrance delay to each Button.
 */
const Keypad: React.FC<KeypadProps> = ({ onKeyPress, activeKey, disabled }) => {
  const handleKeyPress = useCallback(
    (key: KeyConfig) => {
      if (disabled) return;
      onKeyPress(key);
    },
    [onKeyPress, disabled]
  );

  return (
    <div
      style={{
        ...styles.grid,
        pointerEvents: disabled ? 'none' : undefined,
        opacity: disabled ? 0.5 : 1,
      }}
      role="group"
      aria-label="Calculator keypad"
      aria-disabled={disabled}
    >
      {KEYPAD_LAYOUT.map((row, rowIndex) =>
        row.map((key, colIndex) => (
          <Button
            key={key.id}
            config={key}
            onPress={handleKeyPress}
            isActive={activeKey === key.id}
            entranceDelay={
              (rowIndex * 4 + colIndex) * ENTRANCE.buttonStagger.duration
            }
          />
        ))
      )}
    </div>
  );
};

// --- Styles ---
const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: THEME.layout.buttonGap,
    padding: `0 ${THEME.spacing.md} ${THEME.spacing.md}`,
  },
};

export default Keypad;
