import { useEffect, useState, useCallback, useMemo } from 'react';
import { KeyConfig, KeyType, Operation, CalculatorAction, UseKeyboardReturn } from '../types';
import { ALL_KEYS, KEYBOARD_MAP } from '../config/keys';

/**
 * Maps a KeyConfig to the appropriate CalculatorAction.
 */
function keyToAction(key: KeyConfig): CalculatorAction | null {
  switch (key.type) {
    case KeyType.Number:
      return { type: 'INPUT_DIGIT', digit: key.value };
    case KeyType.Decimal:
      return { type: 'INPUT_DECIMAL' };
    case KeyType.Equals:
      return { type: 'CALCULATE' };
    case KeyType.Operation:
      return { type: 'INPUT_OPERATION', operation: key.value as Operation };
    case KeyType.Function:
      switch (key.value) {
        case 'AC':
          return { type: 'CLEAR' };
        case 'Backspace':
          return { type: 'BACKSPACE' };
        case '±':
          return { type: 'NEGATE' };
        case '%':
          return { type: 'PERCENT' };
        default:
          return null;
      }
    default:
      return null;
  }
}

interface UseKeyboardOptions {
  /** Dispatch a calculator action */
  dispatch: React.Dispatch<CalculatorAction>;
  /** Callback when a key is visually "pressed" (for sound, ripple, etc.) */
  onKeyPress?: (key: KeyConfig) => void;
  /** Disable keyboard handling (e.g. during animation) */
  disabled?: boolean;
}

/**
 * Hook that maps physical keyboard events to calculator actions.
 * Uses ALL_KEYS (visual keypad + virtual keys like backspace) so every
 * mapped keyboard shortcut resolves to a valid KeyConfig.
 */
export function useKeyboard({ dispatch, onKeyPress, disabled = false }: UseKeyboardOptions): UseKeyboardReturn {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Build id → KeyConfig lookup from ALL_KEYS (includes VIRTUAL_KEYS)
  const KEY_BY_ID = useMemo(() => {
    const map = new Map<string, KeyConfig>();
    for (const key of ALL_KEYS) {
      map.set(key.id, key);
    }
    return map;
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;

      const keyId = KEYBOARD_MAP[e.key];
      if (!keyId) return;

      // Prevent default browser behaviour for mapped keys
      e.preventDefault();

      const keyConfig = KEY_BY_ID.get(keyId);
      if (!keyConfig) return;

      // Visual feedback — highlight the key
      setActiveKey(keyId);

      // Dispatch the calculator action
      const action = keyToAction(keyConfig);
      if (action) {
        dispatch(action);
      }

      // Notify for sound / ripple effects
      onKeyPress?.(keyConfig);
    },
    [disabled, dispatch, onKeyPress, KEY_BY_ID],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const keyId = KEYBOARD_MAP[e.key];
      if (keyId) {
        setActiveKey((current) => (current === keyId ? null : current));
      }
    },
    [],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { activeKey };
}
