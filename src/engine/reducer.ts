// ============================================
// NEBULA CALC — Calculator Reducer
// Pure state transitions for all calculator actions
// ============================================

import {
  CalculatorState,
  CalculatorAction,
  CalculatorError,
  Operation,
} from '../types';
import { MAX_DISPLAY_LENGTH } from '../config/keys';
import { calculate } from './math';

/** Initial calculator state */
export const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  expression: '',
  error: null,
};

/**
 * Pure reducer — returns new CalculatorState for every action.
 * Never throws; errors are captured in state.error.
 */
export function reducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  // If in error state, only CLEAR is accepted
  if (state.error !== null && action.type !== 'CLEAR') {
    return state;
  }

  switch (action.type) {
    // ── Digit Input ──────────────────────────────
    case 'INPUT_DIGIT': {
      const { digit } = action;

      if (state.waitingForOperand) {
        return {
          ...state,
          display: digit,
          waitingForOperand: false,
        };
      }

      // Replace leading zero, or append
      const newDisplay =
        state.display === '0' ? digit : state.display + digit;

      // Respect max display length
      if (newDisplay.replace(/[^\d]/g, '').length > MAX_DISPLAY_LENGTH) {
        return state;
      }

      return { ...state, display: newDisplay };
    }

    // ── Decimal Point ────────────────────────────
    case 'INPUT_DECIMAL': {
      if (state.waitingForOperand) {
        return {
          ...state,
          display: '0.',
          waitingForOperand: false,
        };
      }

      // Don't add a second decimal
      if (state.display.includes('.')) {
        return state;
      }

      return { ...state, display: state.display + '.' };
    }

    // ── Operation ────────────────────────────────
    case 'INPUT_OPERATION': {
      const { operation } = action;
      const currentValue = state.display;

      // Chained operations: compute intermediate result first
      if (state.previousValue !== null && state.operation && !state.waitingForOperand) {
        const result = calculate(state.previousValue, currentValue, state.operation);

        if (typeof result !== 'string') {
          // result is a CalculatorError
          return {
            ...initialState,
            error: result,
            display: 'Error',
            expression: `${state.previousValue} ${state.operation} ${currentValue}`,
          };
        }

        return {
          ...state,
          display: result,
          previousValue: result,
          operation,
          waitingForOperand: true,
          expression: `${result} ${operation}`,
        };
      }

      return {
        ...state,
        previousValue: currentValue,
        operation,
        waitingForOperand: true,
        expression: `${currentValue} ${operation}`,
      };
    }

    // ── Calculate (Equals) ───────────────────────
    case 'CALCULATE': {
      if (state.previousValue === null || state.operation === null) {
        return state;
      }

      const result = calculate(state.previousValue, state.display, state.operation);
      const expression = `${state.previousValue} ${state.operation} ${state.display}`;

      if (typeof result !== 'string') {
        return {
          ...initialState,
          error: result,
          display: 'Error',
          expression,
        };
      }

      return {
        ...state,
        display: result,
        previousValue: null,
        operation: null,
        waitingForOperand: true,
        expression,
        error: null,
      };
    }

    // ── Clear ────────────────────────────────────
    case 'CLEAR':
      return { ...initialState };

    // ── Backspace ────────────────────────────────
    case 'BACKSPACE': {
      if (state.waitingForOperand) return state;

      const trimmed = state.display.slice(0, -1);
      return {
        ...state,
        display: trimmed === '' || trimmed === '-' ? '0' : trimmed,
      };
    }

    // ── Negate ───────────────────────────────────
    case 'NEGATE': {
      if (state.display === '0') return state;

      const negated = state.display.startsWith('-')
        ? state.display.slice(1)
        : '-' + state.display;

      return { ...state, display: negated };
    }

    // ── Percent ──────────────────────────────────
    case 'PERCENT': {
      const val = parseFloat(state.display);
      if (isNaN(val)) return state;

      const pct = parseFloat((val / 100).toFixed(10));
      return { ...state, display: String(pct) };
    }

    // ── Set Error (programmatic) ─────────────────
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        display: 'Error',
      };

    default:
      return state;
  }
}
