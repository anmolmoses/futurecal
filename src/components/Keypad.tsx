import React from 'react';
import { KeypadProps } from '../types';
import { KEYPAD_LAYOUT } from '../config/keys';
import { ENTRANCE } from '../config/animations';
import { THEME } from '../config/theme';
import { Button } from './Button';

export const Keypad: React.FC<KeypadProps> = ({ onKeyPress, activeKey, disabled }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: THEME.layout.buttonGap,
      }}
      role="group"
      aria-label="Calculator keypad"
    >
      {KEYPAD_LAYOUT.map((row, rowIndex) =>
        row.map((key, colIndex) => {
          const entranceDelay = (rowIndex * 4 + colIndex) * ENTRANCE.buttonStagger.duration;
          return (
            <Button
              key={key.id}
              config={key}
              onPress={onKeyPress}
              isActive={activeKey === key.id}
              entranceDelay={entranceDelay}
            />
          );
        })
      )}
    </div>
  );
};