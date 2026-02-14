import React, { useState, useCallback } from 'react';
import { RIPPLE } from '../config/animations';

interface RippleItem {
  id: number;
  x: number;
  y: number;
}

/**
 * Ripple effect overlay for buttons.
 * Place inside a button with position:relative and overflow:hidden.
 * Call onRipple with click coordinates to trigger.
 */
export const useRipple = () => {
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const addRipple = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);
    // Auto-remove after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, RIPPLE.duration);
  }, []);

  return { ripples, addRipple };
};

interface RippleProps {
  ripples: RippleItem[];
  color?: string;
}

const Ripple: React.FC<RippleProps> = ({ ripples, color = '#00f0ff' }) => {
  return (
    <>
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            position: 'absolute',
            left: r.x - RIPPLE.maxSize,
            top: r.y - RIPPLE.maxSize,
            width: RIPPLE.maxSize * 2,
            height: RIPPLE.maxSize * 2,
            borderRadius: '50%',
            background: color,
            opacity: 0,
            transform: 'scale(0)',
            pointerEvents: 'none',
            animation: `nebula-ripple ${RIPPLE.duration}ms ease-out forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes nebula-ripple {
          0% {
            transform: scale(0);
            opacity: ${RIPPLE.opacity};
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Ripple;
