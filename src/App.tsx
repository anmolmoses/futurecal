import React, { useState, useCallback, useReducer } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from './components/Calculator';
import { HistoryEntry, CalculatorState, CalculatorAction, CalculatorError, Operation, KeyConfig, KeyType } from './types';
import { ENTRANCE } from './config/animations';

// Initial calculator state
const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  expression: '',
  error: null,
};

// Calculator reducer — minimal working version for UI display
function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'INPUT_DIGIT': {
      if (state.error) return { ...state, error: null, display: action.digit, expression: '', waitingForOperand: false };
      if (state.waitingForOperand) {
        return { ...state, display: action.digit, waitingForOperand: false };
      }
      const newDisplay = state.display === '0' ? action.digit : state.display + action.digit;
      return { ...state, display: newDisplay };
    }
    case 'INPUT_DECIMAL': {
      if (state.error) return state;
      if (state.waitingForOperand) {
        return { ...state, display: '0.', waitingForOperand: false };
      }
      if (state.display.includes('.')) return state;
      return { ...state, display: state.display + '.' };
    }
    case 'INPUT_OPERATION': {
      if (state.error) return state;
      const value = state.display;
      if (state.previousValue !== null && !state.waitingForOperand) {
        const result = calculate(parseFloat(state.previousValue), parseFloat(value), state.operation!);
        if (result === null) {
          return { ...state, error: CalculatorError.DivisionByZero, display: 'Error', expression: state.expression };
        }
        const resultStr = String(result);
        return {
          ...state,
          display: resultStr,
          previousValue: resultStr,
          operation: action.operation,
          waitingForOperand: true,
          expression: `${resultStr} ${action.operation}`,
        };
      }
      return {
        ...state,
        previousValue: value,
        operation: action.operation,
        waitingForOperand: true,
        expression: `${value} ${action.operation}`,
      };
    }
    case 'CALCULATE': {
      if (state.error || state.operation === null || state.previousValue === null) return state;
      const result = calculate(parseFloat(state.previousValue), parseFloat(state.display), state.operation);
      if (result === null) {
        return { ...state, error: CalculatorError.DivisionByZero, display: 'Error', expression: `${state.expression} ${state.display}` };
      }
      const resultStr = String(parseFloat(result.toFixed(10)));
      return {
        ...state,
        display: resultStr,
        previousValue: null,
        operation: null,
        waitingForOperand: true,
        expression: `${state.previousValue} ${state.operation} ${state.display} =`,
      };
    }
    case 'CLEAR':
      return { ...initialState };
    case 'BACKSPACE': {
      if (state.error) return { ...initialState };
      if (state.waitingForOperand) return state;
      const newDisp = state.display.length > 1 ? state.display.slice(0, -1) : '0';
      return { ...state, display: newDisp };
    }
    case 'NEGATE': {
      if (state.error || state.display === '0') return state;
      return { ...state, display: state.display.startsWith('-') ? state.display.slice(1) : '-' + state.display };
    }
    case 'PERCENT': {
      if (state.error) return state;
      const pct = parseFloat(state.display) / 100;
      return { ...state, display: String(pct) };
    }
    case 'SET_ERROR':
      return { ...state, error: action.error, display: 'Error' };
    default:
      return state;
  }
}

function calculate(a: number, b: number, op: Operation): number | null {
  switch (op) {
    case Operation.Add: return a + b;
    case Operation.Subtract: return a - b;
    case Operation.Multiply: return a * b;
    case Operation.Divide: return b === 0 ? null : a / b;
    default: return null;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleKeyPress = useCallback((key: KeyConfig) => {
    switch (key.type) {
      case KeyType.Number:
        dispatch({ type: 'INPUT_DIGIT', digit: key.value });
        break;
      case KeyType.Decimal:
        dispatch({ type: 'INPUT_DECIMAL' });
        break;
      case KeyType.Operation:
        dispatch({ type: 'INPUT_OPERATION', operation: key.value as Operation });
        break;
      case KeyType.Equals:
        // Capture pre-calculate state for history
        if (state.operation && state.previousValue) {
          const expr = `${state.previousValue} ${state.operation} ${state.display}`;
          const a = parseFloat(state.previousValue);
          const b = parseFloat(state.display);
          const result = calculate(a, b, state.operation);
          if (result !== null) {
            setHistory(prev => [{
              id: crypto.randomUUID?.() ?? String(Date.now()),
              expression: expr,
              result: String(parseFloat(result.toFixed(10))),
              timestamp: Date.now(),
            }, ...prev].slice(0, 20));
          }
        }
        dispatch({ type: 'CALCULATE' });
        break;
      case KeyType.Function:
        if (key.value === 'AC') dispatch({ type: 'CLEAR' });
        else if (key.value === '±') dispatch({ type: 'NEGATE' });
        else if (key.value === '%') dispatch({ type: 'PERCENT' });
        else if (key.value === 'backspace') dispatch({ type: 'BACKSPACE' });
        break;
    }
  }, [state]);

  const handleEntryClick = useCallback((entry: HistoryEntry) => {
    dispatch({ type: 'CLEAR' });
    dispatch({ type: 'INPUT_DIGIT', digit: entry.result });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ENTRANCE.calculator.duration, delay: ENTRANCE.calculator.delay }}
      style={{ position: 'relative' }}
    >
      <Calculator
        state={state}
        history={history}
        historyOpen={historyOpen}
        activeKey={activeKey}
        onKeyPress={handleKeyPress}
        onToggleHistory={() => setHistoryOpen(o => !o)}
        onCloseHistory={() => setHistoryOpen(false)}
        onEntryClick={handleEntryClick}
      />
    </motion.div>
  );
}