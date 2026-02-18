import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'shimmer' | 'pulse';
}

export function Skeleton({ className, variant = 'shimmer' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md',
        variant === 'shimmer' && 'skeleton-shimmer',
        variant === 'pulse' && 'skeleton-pulse',
        variant === 'default' && 'bg-muted animate-pulse',
        className
      )}
    />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 border-b border-border">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16 ml-auto" />
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 items-center">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-card">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-32" />
        <div className="flex justify-between items-center pt-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart & Table */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 dashboard-widget">
          <div className="dashboard-widget-header">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
          <div className="dashboard-widget-content">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>

        <div className="dashboard-widget">
          <div className="dashboard-widget-header">
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="dashboard-widget-content space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'featured' }) {
  if (variant === 'featured') {
    return (
      <div className="event-card overflow-hidden">
        <Skeleton className="aspect-[16/9] w-full rounded-none" />
      </div>
    );
  }

  return (
    <div className="event-card overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3 w-32" />
        <div className="flex justify-between items-center pt-3 border-t border-border/50">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}
