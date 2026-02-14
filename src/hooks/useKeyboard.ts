// ============================================
// NEBULA CALC — useKeyboard Hook
// ============================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { KeyConfig, UseKeyboardReturn } from '../types';
import { KEYBOARD_MAP, KEYPAD_LAYOUT } from '../config/keys';

// Flatten KEYPAD_LAYOUT for quick lookup by id
const ALL_KEYS: KeyConfig[] = KEYPAD_LAYOUT.flat();
const KEY_BY_ID = new Map<string, KeyConfig>(ALL_KEYS.map(k => [k.id, k]));

// Modifier keys to ignore
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab']);

interface UseKeyboardOptions {
  onKeyPress: (key: KeyConfig) => void;
}

/**
 * Keyboard listener hook.
 * Maps physical key presses to calculator KeyConfig and triggers onKeyPress.
 * Returns activeKey (id of currently held key) for visual highlight.
 * Prevents key repeat, ignores modifier keys.
 */
export function useKeyboard({ onKeyPress }: UseKeyboardOptions): UseKeyboardReturn {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Track currently pressed keys to prevent repeat firing
  const pressedRef = useRef<Set<string>>(new Set());

  // Stable ref for the callback to avoid re-attaching listeners
  const onKeyPressRef = useRef(onKeyPress);
  onKeyPressRef.current = onKeyPress;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore modifier keys
    if (MODIFIER_KEYS.has(e.key)) return;

    // Ignore if key is already pressed (prevent repeat)
    if (pressedRef.current.has(e.key)) return;

    const keyId = KEYBOARD_MAP[e.key];
    if (!keyId) return;

    const keyConfig = KEY_BY_ID.get(keyId);
    if (!keyConfig) return;

    // Prevent default browser behavior (e.g. '/' opening search)
    e.preventDefault();

    // Mark as pressed
    pressedRef.current.add(e.key);

    // Set active key for visual highlight
    setActiveKey(keyId);

    // Fire callback
    onKeyPressRef.current(keyConfig);
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Remove from pressed set
    pressedRef.current.delete(e.key);

    // Clear active key if this was the one being highlighted
    const keyId = KEYBOARD_MAP[e.key];
    if (keyId) {
      setActiveKey(prev => (prev === keyId ? null : prev));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // Clear pressed state on unmount
      pressedRef.current.clear();
    };
  }, [handleKeyDown, handleKeyUp]);

  return { activeKey };
}
