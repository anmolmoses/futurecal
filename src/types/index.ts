// ============================================
// NEBULA CALC — Shared Type Definitions
// ============================================

// --- Calculator Operations ---
export enum Operation {
  Add = '+',
  Subtract = '-',
  Multiply = '×',
  Divide = '÷',
  Percent = '%',
  Negate = '±',
}

export enum KeyType {
  Number = 'number',
  Operation = 'operation',
  Function = 'function', // AC, backspace, ±, %
  Equals = 'equals',
  Decimal = 'decimal',
}

export interface KeyConfig {
  id: string;           // unique key like 'num-7', 'op-add'
  label: string;        // display text: '7', '+', 'AC'
  type: KeyType;
  value: string;        // raw value: '7', '+', 'AC', '=', '.'
  gridSpan?: number;    // columns to span (default 1, '0' spans 2)
  ariaLabel: string;
}

// --- Calculator State ---
export interface CalculatorState {
  display: string;           // current display value
  previousValue: string | null;
  operation: Operation | null;
  waitingForOperand: boolean;
  expression: string;        // running expression string e.g. "5 + 3"
  error: CalculatorError | null;
}

export enum CalculatorError {
  DivisionByZero = 'DIVISION_BY_ZERO',
  Overflow = 'OVERFLOW',
  InvalidInput = 'INVALID_INPUT',
}

export type CalculatorAction =
  | { type: 'INPUT_DIGIT'; digit: string }
  | { type: 'INPUT_DECIMAL' }
  | { type: 'INPUT_OPERATION'; operation: Operation }
  | { type: 'CALCULATE' }
  | { type: 'CLEAR' }
  | { type: 'BACKSPACE' }
  | { type: 'NEGATE' }
  | { type: 'PERCENT' }
  | { type: 'SET_ERROR'; error: CalculatorError };

// --- History ---
export interface HistoryEntry {
  id: string;             // uuid
  expression: string;     // "5 + 3"
  result: string;         // "8"
  timestamp: number;      // Date.now()
}

export interface HistoryState {
  entries: HistoryEntry[];
  isOpen: boolean;
}

// --- Animation ---
export interface AnimationConfig {
  duration: number;       // seconds
  delay: number;          // seconds
  ease: string;           // e.g. 'easeOut', [0.17, 0.67, 0.83, 0.97]
}

export interface RippleEffect {
  x: number;              // click position relative to button
  y: number;
  color: string;          // neon color from theme
  size: number;           // max radius in px
  duration: number;       // ms
}

export interface ParticleConfig {
  count: number;
  color: string;
  minSize: number;        // px
  maxSize: number;
  minSpeed: number;
  maxSpeed: number;
  minOpacity: number;
  maxOpacity: number;
  connectDistance: number; // px — draw lines between nearby particles
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

// --- Sound ---
export enum SoundType {
  KeyClick = 'key-click',
  OperationClick = 'op-click',
  Equals = 'equals',
  Clear = 'clear',
  Error = 'error',
  PanelOpen = 'panel-open',
  PanelClose = 'panel-close',
  Startup = 'startup',
}

export interface SoundConfig {
  frequency: number;      // Hz
  duration: number;       // seconds
  type: OscillatorType;   // 'sine' | 'square' | 'sawtooth' | 'triangle'
  volume: number;         // 0-1
  detune?: number;        // cents
  attack?: number;        // seconds
  decay?: number;         // seconds
}

// --- Component Props ---
export interface DisplayProps {
  value: string;
  expression: string;
  error: CalculatorError | null;
  isAnimating: boolean;
}

export interface KeypadProps {
  onKeyPress: (key: KeyConfig) => void;
  activeKey: string | null; // id of currently pressed key (for keyboard highlight)
  disabled: boolean;
}

export interface ButtonProps {
  config: KeyConfig;
  onPress: (key: KeyConfig) => void;
  isActive: boolean;
  entranceDelay: number;  // stagger delay for load animation
}

export interface HistoryPanelProps {
  entries: HistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
  onEntryClick: (entry: HistoryEntry) => void;
}

export interface ParticleCanvasProps {
  config: ParticleConfig;
  burstTrigger: number;   // increment to trigger burst effect
  burstOrigin: { x: number; y: number } | null;
}

// --- Hook Return Types ---
export interface UseCalculatorReturn {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
  history: HistoryEntry[];
  clearHistory: () => void;
}

export interface UseSoundReturn {
  play: (type: SoundType) => void;
  setMuted: (muted: boolean) => void;
  isMuted: boolean;
}

export interface UseKeyboardReturn {
  activeKey: string | null; // currently held key id
}
