import { useRef, useEffect, useCallback } from 'react';
import type { Particle, ParticleConfig } from '../types';
import { BURST_PARTICLE_COUNT, BURST_SPEED_MULTIPLIER } from '../config/animations';

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function createParticle(config: ParticleConfig, x?: number, y?: number, burst?: boolean): Particle {
  const speedMult = burst ? BURST_SPEED_MULTIPLIER : 1;
  const angle = Math.random() * Math.PI * 2;
  const speed = rand(config.minSpeed, config.maxSpeed) * speedMult;
  return {
    x: x ?? Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
    y: y ?? Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: rand(config.minSize, config.maxSize),
    opacity: rand(config.minOpacity, config.maxOpacity),
    color: config.color,
  };
}

export interface UseParticlesReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  burst: (x: number, y: number) => void;
}

/**
 * Manages a particle array and animation loop on a canvas.
 * Draws ambient particles with connecting lines and supports burst effects.
 */
export function useParticles(
  config: ParticleConfig,
  disabled: boolean = false
): UseParticlesReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<(Particle & { life?: number; maxLife?: number })[]>([]);
  const rafRef = useRef<number>(0);

  // Initialize ambient particles
  useEffect(() => {
    if (disabled) {
      particlesRef.current = [];
      return;
    }
    particlesRef.current = Array.from({ length: config.count }, () => createParticle(config));
  }, [config, disabled]);

  // Animation loop
  useEffect(() => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let visible = true;
    const onVisChange = () => { visible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisChange);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!visible) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;

      // Update & draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Fade out burst particles
        if (p.life !== undefined && p.maxLife !== undefined) {
          p.life -= 1 / 60; // ~1 frame at 60fps
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          p.opacity = (p.life / p.maxLife) * 0.6;
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }

      // Draw connecting lines
      const dist = config.connectDistance;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < dist) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = config.color;
            ctx.globalAlpha = (1 - d / dist) * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, [config, disabled]);

  const burst = useCallback((x: number, y: number) => {
    if (disabled) return;
    for (let i = 0; i < BURST_PARTICLE_COUNT; i++) {
      const p = createParticle(config, x, y, true) as Particle & { life: number; maxLife: number };
      p.life = 1; // 1 second
      p.maxLife = 1;
      particlesRef.current.push(p);
    }
  }, [config, disabled]);

  return { canvasRef, burst };
}

export default useParticles;
