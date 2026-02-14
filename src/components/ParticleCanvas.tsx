import React, { useEffect } from 'react';
import type { ParticleCanvasProps } from '../types';
import { useParticles } from '../hooks/useParticles';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Fullscreen canvas rendering ambient particles behind the calculator.
 * Supports burst effects triggered via props.
 */
const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ config, burstTrigger, burstOrigin }) => {
  const reducedMotion = useReducedMotion();
  const { canvasRef, burst } = useParticles(config, reducedMotion);

  // Fire burst when burstTrigger increments
  useEffect(() => {
    if (burstTrigger > 0 && burstOrigin) {
      burst(burstOrigin.x, burstOrigin.y);
    }
  }, [burstTrigger, burstOrigin, burst]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default ParticleCanvas;
