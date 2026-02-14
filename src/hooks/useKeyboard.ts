// ============================================
// NEBULA CALC — useKeyboard Hook
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { KeyConfig, UseKeyboardReturn } from '../types';
import { KEYBOARD_MAP, KEYPAD_LAYOUT } from '../config/keys';

// Flatten layout for quick lookup by id
const ALL_KEYS: KeyConfig[] = KEYPAD_LAYOUT.flat();
const KEY_BY_ID = new Map<string, KeyConfig>(ALL_KEYS.map(k => [k.id, k]));

// Modifier keys to ignore
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab']);

export function useKeyboard(
  onKeyPress: (key: KeyConfig) => void
): UseKeyboardReturn {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const pressedRef = useRef<Set<string>>(new Set());
  // Keep callback ref stable to avoid re-registering listeners
  const onKeyPressRef = useRef(onKeyPress);
  onKeyPressRef.current = onKeyPress;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifiers and repeated keys
      if (MODIFIER_KEYS.has(e.key)) return;
      if (pressedRef.current.has(e.key)) return;

      const keyId = KEYBOARD_MAP[e.key];
      if (!keyId) return;

      const keyConfig = KEY_BY_ID.get(keyId);
      if (!keyConfig) return;

      e.preventDefault();
      pressedRef.current.add(e.key);
      setActiveKey(keyId);
      onKeyPressRef.current(keyConfig);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (MODIFIER_KEYS.has(e.key)) return;
      pressedRef.current.delete(e.key);

      const keyId = KEYBOARD_MAP[e.key];
      if (keyId) {
        setActiveKey(prev => (prev === keyId ? null : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return { activeKey };
}
