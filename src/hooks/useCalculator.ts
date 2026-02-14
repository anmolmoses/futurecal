// ============================================
// NEBULA CALC — useCalculator Hook
// Wraps reducer + manages history with localStorage
// ============================================

import { useReducer, useState, useCallback, useEffect, useRef } from 'react';
import {
  CalculatorAction,
  CalculatorState,
  HistoryEntry,
  UseCalculatorReturn,
} from '../types';
import {
  HISTORY_STORAGE_KEY,
  MAX_HISTORY_ENTRIES,
} from '../config/keys';
import { reducer, initialState } from '../engine/reducer';

/** Load history from localStorage */
function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY_ENTRIES) : [];
  } catch {
    return [];
  }
}

/** Save history to localStorage */
function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function useCalculator(): UseCalculatorReturn {
  const [state, baseDispatch] = useReducer(reducer, initialState);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  // Track previous state to detect successful calculations
  const prevStateRef = useRef<CalculatorState>(state);

  // Persist history whenever it changes
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  // Wrapped dispatch that intercepts CALCULATE to record history
  const dispatch = useCallback(
    (action: CalculatorAction) => {
      if (action.type === 'CALCULATE') {
        // Capture state BEFORE dispatch
        const before = prevStateRef.current;

        // Dispatch the action
        baseDispatch(action);

        // If we have the ingredients for a calculation, compute result
        // to create history entry (mirrors reducer logic)
        if (before.previousValue !== null && before.operation !== null) {
          // Import calculate inline to get the result
          import('../engine/math').then(({ calculate }) => {
            const result = calculate(
              before.previousValue!,
              before.display,
              before.operation!
            );

            // Only add to history if it's a valid result (not an error)
            if (typeof result === 'string') {
              const expression = `${before.previousValue} ${before.operation} ${before.display}`;
              const entry: HistoryEntry = {
                id: crypto.randomUUID(),
                expression,
                result,
                timestamp: Date.now(),
              };

              setHistory((prev) => {
                const updated = [entry, ...prev].slice(0, MAX_HISTORY_ENTRIES);
                return updated;
              });
            }
          });
        }
      } else {
        baseDispatch(action);
      }
    },
    []
  );

  // Keep prevStateRef in sync
  useEffect(() => {
    prevStateRef.current = state;
  }, [state]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  return { state, dispatch, history, clearHistory };
}
