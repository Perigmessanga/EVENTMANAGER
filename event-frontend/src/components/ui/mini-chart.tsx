import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MiniChartProps {
  data: number[];
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  height?: number;
  className?: string;
  showArea?: boolean;
}

const colorClasses = {
  primary: { stroke: 'hsl(var(--primary))', fill: 'hsl(var(--primary) / 0.1)' },
  secondary: { stroke: 'hsl(var(--secondary))', fill: 'hsl(var(--secondary) / 0.1)' },
  success: { stroke: 'hsl(var(--success))', fill: 'hsl(var(--success) / 0.1)' },
  warning: { stroke: 'hsl(var(--warning))', fill: 'hsl(var(--warning) / 0.1)' },
  destructive: { stroke: 'hsl(var(--destructive))', fill: 'hsl(var(--destructive) / 0.1)' },
};

export function MiniChart({
  data,
  color = 'primary',
  height = 40,
  className,
  showArea = true,
}: MiniChartProps) {
  const { path, areaPath } = useMemo(() => {
    if (data.length < 2) return { path: '', areaPath: '' };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 100;
    const stepX = width / (data.length - 1);
    const padding = 2;

    const points = data.map((value, index) => {
      const x = index * stepX;
      const y = padding + ((max - value) / range) * (height - padding * 2);
      return { x, y };
    });

    const linePath = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(' ');

    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

    return { path: linePath, areaPath };
  }, [data, height]);

  const colors = colorClasses[color];

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className={cn('w-full', className)}
      style={{ height }}
    >
      {showArea && (
        <path
          d={areaPath}
          fill={colors.fill}
          className="transition-all duration-500"
        />
      )}
      <path
        d={path}
        fill="none"
        stroke={colors.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-500"
      />
    </svg>
  );
}

interface SparklineProps {
  data: number[];
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  data,
  color = 'primary',
  width = 60,
  height = 24,
  className,
}: SparklineProps) {
  const path = useMemo(() => {
    if (data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const padding = 2;

    const points = data.map((value, index) => {
      const x = index * stepX;
      const y = padding + ((max - value) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  const colors = colorClasses[color];

  return (
    <svg
      width={width}
      height={height}
      className={cn('flex-shrink-0', className)}
    >
      <path
        d={path}
        fill="none"
        stroke={colors.stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
