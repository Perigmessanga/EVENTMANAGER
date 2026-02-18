import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  className,
  prefix = '',
  suffix = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        previousValue.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formattedValue = displayValue.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

interface AnimatedPercentageProps {
  value: number;
  showSign?: boolean;
  className?: string;
}

export function AnimatedPercentage({
  value,
  showSign = true,
  className,
}: AnimatedPercentageProps) {
  const isPositive = value >= 0;
  const sign = showSign ? (isPositive ? '+' : '') : '';

  return (
    <span
      className={cn(
        'tabular-nums font-medium',
        isPositive ? 'text-success' : 'text-destructive',
        className
      )}
    >
      {sign}
      <AnimatedCounter value={value} decimals={1} suffix="%" />
    </span>
  );
}
