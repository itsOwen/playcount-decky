/**
 * AnimatedCounter component - smooth number animation for player counts
 */

import { formatPlayerCount, parseFormattedCount } from '../utils/api';
import { TIMING } from '../constants';
import type { AnimatedCounterProps } from '../types/index';

const { useEffect, useRef, useState } = window.SP_REACT;

/**
 * Easing function for smooth animation
 */
const easeOutCubic = (progress: number): number => {
  return 1 - Math.pow(1 - progress, 3);
};

export const AnimatedCounter = ({
  finalValue,
  duration = TIMING.ANIMATION_DURATION,
  isLoading = false,
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [previousValue, setPreviousValue] = useState<number>(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  /**
   * Parse final value to number
   */
  const getFinalNumber = (): number => {
    if (typeof finalValue === 'number') return finalValue;
    if (typeof finalValue === 'string') {
      return parseFormattedCount(finalValue);
    }
    return 0;
  };

  useEffect(() => {
    if (isLoading) {
      setDisplayValue(0);
      return;
    }

    const targetValue = getFinalNumber();
    if (targetValue === previousValue) return;

    setPreviousValue(targetValue);
    const startValue = displayValue;
    const valueDiff = targetValue - startValue;

    // Reset start time for new animation
    startTimeRef.current = undefined;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.round(startValue + valueDiff * easedProgress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [finalValue, duration, isLoading]);

  return window.SP_REACT.createElement(
    'span',
    {
      style: {
        transition: 'opacity 0.3s ease',
        opacity: isLoading ? 0.5 : 1,
      },
    },
    isLoading ? '00000' : formatPlayerCount(displayValue)
  );
};

export default AnimatedCounter;
