import type { Variants } from 'framer-motion';
import { ENTRANCE, BUTTON_PRESS, RESULT_ANIMATION } from '../config/animations';

/**
 * Framer Motion variant objects for all animated components.
 */

// Calculator card entrance
export const calculatorVariants: Variants = {
  initial: { opacity: 0, scale: 0.8, y: 40 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: ENTRANCE.calculator.duration,
      delay: ENTRANCE.calculator.delay,
      ease: ENTRANCE.calculator.ease,
    },
  },
};

// Display entrance
export const displayVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ENTRANCE.display.duration,
      delay: ENTRANCE.display.delay,
      ease: ENTRANCE.display.ease,
    },
  },
};

// Button entrance + press interaction
// Use custom property for stagger delay via transition override
export const buttonVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: (entranceDelay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: ENTRANCE.buttonBase.duration,
      delay: ENTRANCE.buttonBase.delay + entranceDelay,
      ease: ENTRANCE.buttonBase.ease,
    },
  }),
  whileTap: {
    scale: BUTTON_PRESS.scale,
    transition: { duration: BUTTON_PRESS.duration },
  },
};

// Result flash — animate background overlay on display
export const resultFlash: Variants = {
  idle: { backgroundColor: 'rgba(0, 0, 0, 0)' },
  flash: {
    backgroundColor: [
      'rgba(0, 0, 0, 0)',
      RESULT_ANIMATION.flashColor,
      'rgba(0, 0, 0, 0)',
    ],
    transition: { duration: RESULT_ANIMATION.flashDuration, times: [0, 0.5, 1] },
  },
};

// Error glitch — shakes display randomly
export const errorGlitch: Variants = {
  idle: { x: 0 },
  glitch: {
    x: [
      0,
      RESULT_ANIMATION.glitchIntensity,
      -RESULT_ANIMATION.glitchIntensity,
      RESULT_ANIMATION.glitchIntensity,
      -RESULT_ANIMATION.glitchIntensity,
      0,
    ],
    transition: {
      duration: RESULT_ANIMATION.glitchDuration,
      ease: 'linear',
    },
  },
};

// History panel slide-in
export const historySlide: Variants = {
  initial: { x: '100%' },
  animate: {
    x: 0,
    transition: {
      duration: ENTRANCE.historyPanel.duration,
      delay: ENTRANCE.historyPanel.delay,
      ease: ENTRANCE.historyPanel.ease,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: ENTRANCE.historyPanel.duration,
      ease: ENTRANCE.historyPanel.ease,
    },
  },
};
