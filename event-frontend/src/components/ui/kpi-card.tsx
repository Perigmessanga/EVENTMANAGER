import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  icon?: LucideIcon;
  iconColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
  loading?: boolean;
}

const iconColorClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
};

export function KpiCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'primary',
  className,
  loading = false,
}: KpiCardProps) {
  if (loading) {
    return <KpiCardSkeleton />;
  }

  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
        ? TrendingDown
        : Minus
    : null;

  const isPositive = trend?.isPositive ?? (trend?.value ?? 0) > 0;

  return (
    <div className={cn('stat-card group', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-1 truncate">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-foreground animate-count-up">
            {value}
          </p>
          
          {(trend || subtitle) && (
            <div className="flex items-center gap-2 mt-2">
              {trend && TrendIcon && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md',
                    isPositive
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  )}
                >
                  <TrendIcon className="h-3 w-3" />
                  {Math.abs(trend.value)}%
                </span>
              )}
              {(subtitle || trend?.label) && (
                <span className="text-xs text-muted-foreground truncate">
                  {subtitle || trend?.label}
                </span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={cn(
              'flex-shrink-0 p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
              iconColorClasses[iconColor]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-24 skeleton-shimmer" />
          <div className="h-8 w-32 skeleton-shimmer" />
          <div className="h-3 w-20 skeleton-shimmer" />
        </div>
        <div className="h-12 w-12 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
}
