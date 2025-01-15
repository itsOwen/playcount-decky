import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  finalValue: number | string;
  duration?: number;
  isLoading?: boolean;
}

export const AnimatedCounter = ({ finalValue, duration = 1000, isLoading = false }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [previousValue, setPreviousValue] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const getFinalNumber = (): number => {
    if (typeof finalValue === 'number') return finalValue;
    if (typeof finalValue === 'string') {
      return parseInt(finalValue.replace(/,/g, '')) || 0;
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

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (valueDiff * easeOutCubic));

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
        opacity: isLoading ? 0.5 : 1
      }
    },
    isLoading ? "00000" : new Intl.NumberFormat().format(displayValue)
  );
};