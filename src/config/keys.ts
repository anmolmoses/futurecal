import { KeyConfig, KeyType, Operation } from '../types';

export const KEYPAD_LAYOUT: KeyConfig[][] = [
  // Row 1
  [
    { id: 'fn-clear', label: 'AC', type: KeyType.Function, value: 'AC', ariaLabel: 'Clear all' },
    { id: 'fn-negate', label: '±', type: KeyType.Function, value: '±', ariaLabel: 'Toggle negative' },
    { id: 'fn-percent', label: '%', type: KeyType.Function, value: '%', ariaLabel: 'Percent' },
    { id: 'op-divide', label: '÷', type: KeyType.Operation, value: Operation.Divide, ariaLabel: 'Divide' },
  ],
  // Row 2
  [
    { id: 'num-7', label: '7', type: KeyType.Number, value: '7', ariaLabel: '7' },
    { id: 'num-8', label: '8', type: KeyType.Number, value: '8', ariaLabel: '8' },
    { id: 'num-9', label: '9', type: KeyType.Number, value: '9', ariaLabel: '9' },
    { id: 'op-multiply', label: '×', type: KeyType.Operation, value: Operation.Multiply, ariaLabel: 'Multiply' },
  ],
  // Row 3
  [
    { id: 'num-4', label: '4', type: KeyType.Number, value: '4', ariaLabel: '4' },
    { id: 'num-5', label: '5', type: KeyType.Number, value: '5', ariaLabel: '5' },
    { id: 'num-6', label: '6', type: KeyType.Number, value: '6', ariaLabel: '6' },
    { id: 'op-subtract', label: '-', type: KeyType.Operation, value: Operation.Subtract, ariaLabel: 'Subtract' },
  ],
  // Row 4
  [
    { id: 'num-1', label: '1', type: KeyType.Number, value: '1', ariaLabel: '1' },
    { id: 'num-2', label: '2', type: KeyType.Number, value: '2', ariaLabel: '2' },
    { id: 'num-3', label: '3', type: KeyType.Number, value: '3', ariaLabel: '3' },
    { id: 'op-add', label: '+', type: KeyType.Operation, value: Operation.Add, ariaLabel: 'Add' },
  ],
  // Row 5
  [
    { id: 'num-0', label: '0', type: KeyType.Number, value: '0', gridSpan: 2, ariaLabel: '0' },
    { id: 'fn-decimal', label: '.', type: KeyType.Decimal, value: '.', ariaLabel: 'Decimal point' },
    { id: 'fn-equals', label: '=', type: KeyType.Equals, value: '=', ariaLabel: 'Equals' },
  ],
];

// Virtual keys not on the visual keypad but reachable via keyboard
export const VIRTUAL_KEYS: KeyConfig[] = [
  { id: 'fn-backspace', label: '⌫', type: KeyType.Function, value: 'Backspace', ariaLabel: 'Backspace' },
];

/** All keys (visual + virtual) for building lookup maps */
export const ALL_KEYS: KeyConfig[] = [...KEYPAD_LAYOUT.flat(), ...VIRTUAL_KEYS];

// Keyboard key → KeyConfig id mapping
export const KEYBOARD_MAP: Record<string, string> = {
  '0': 'num-0', '1': 'num-1', '2': 'num-2', '3': 'num-3', '4': 'num-4',
  '5': 'num-5', '6': 'num-6', '7': 'num-7', '8': 'num-8', '9': 'num-9',
  '+': 'op-add', '-': 'op-subtract', '*': 'op-multiply', '/': 'op-divide',
  '.': 'fn-decimal', ',': 'fn-decimal',
  'Enter': 'fn-equals', '=': 'fn-equals',
  'Backspace': 'fn-backspace', 'Delete': 'fn-clear',
  'Escape': 'fn-clear', '%': 'fn-percent',
};

export const MAX_DISPLAY_LENGTH = 12;
export const MAX_HISTORY_ENTRIES = 20;
export const HISTORY_STORAGE_KEY = 'nebula-calc-history';
