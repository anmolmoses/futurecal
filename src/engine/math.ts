// ============================================
// NEBULA CALC — Math Engine
// Pure arithmetic with error handling
// ============================================

import { Operation, CalculatorError } from '../types';

/**
 * Perform arithmetic on two string operands.
 * Returns the string result or a CalculatorError.
 */
export function calculate(
  a: string,
  b: string,
  op: Operation
): string | CalculatorError {
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  // Validate inputs
  if (isNaN(numA) || isNaN(numB)) {
    return CalculatorError.InvalidInput;
  }

  let result: number;

  switch (op) {
    case Operation.Add:
      result = numA + numB;
      break;
    case Operation.Subtract:
      result = numA - numB;
      break;
    case Operation.Multiply:
      result = numA * numB;
      break;
    case Operation.Divide:
      if (numB === 0) {
        return CalculatorError.DivisionByZero;
      }
      result = numA / numB;
      break;
    default:
      return CalculatorError.InvalidInput;
  }

  // Check for overflow / Infinity / NaN
  if (!isFinite(result) || isNaN(result)) {
    return CalculatorError.Overflow;
  }

  // Round to 10 decimal places to avoid floating point artifacts
  result = parseFloat(result.toFixed(10));

  return String(result);
}
