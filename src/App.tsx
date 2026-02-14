// ============================================
// NEBULA CALC — App Root Component
// ============================================

import React, { useState, useCallback } from 'react';
import type { KeyConfig, HistoryEntry, CalculatorError } from './types';
import Calculator from './components/Calculator';

/**
 * Root app component.
 * Holds minimal UI state for rendering. Full calculator logic
 * (reducer, history management, keyboard handling, sound)
 * will be provided by dedicated hooks in a separate task.
 *
 * For now, we wire up a simple display state so the UI renders.
 */
const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [error] = useState<CalculatorError | null>(null);
  const [activeKey] = useState<string | null>(null);
  const [historyEntries] = useState<HistoryEntry[]>([]);

  // Placeholder key handler — just updates display for visual testing
  const handleKeyPress = useCallback((key: KeyConfig) => {
    // Minimal logic so the UI is interactive during visual testing.
    // Full calculator reducer will replace this.
    if (key.value === 'AC') {
      setDisplay('0');
      setExpression('');
      return;
    }

    if (key.value >= '0' && key.value <= '9') {
      setDisplay((prev) => (prev === '0' ? key.value : prev + key.value));
      return;
    }

    if (key.value === '.') {
      setDisplay((prev) => (prev.includes('.') ? prev : prev + '.'));
      return;
    }

    // Operations — just show in expression for now
    if (['+', '-', '×', '÷', '%'].includes(key.value)) {
      setExpression(`${display} ${key.label} `);
      setDisplay('0');
      return;
    }

    if (key.value === '=') {
      setExpression((prev) => prev + display + ' =');
      // No actual calculation — hooks task will handle this
    }
  }, [display]);

  const handleHistoryEntryClick = useCallback((entry: HistoryEntry) => {
    setDisplay(entry.result);
    setExpression(entry.expression);
  }, []);

  return (
    <Calculator
      display={display}
      expression={expression}
      error={error}
      isAnimating={false}
      activeKey={activeKey}
      historyEntries={historyEntries}
      onKeyPress={handleKeyPress}
      onHistoryEntryClick={handleHistoryEntryClick}
      disabled={false}
    />
  );
};

export default App;