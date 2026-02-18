import { LucideIcon, SearchX, CalendarX, Ticket, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'events' | 'tickets' | 'error';
  className?: string;
}

const variantConfig = {
  default: {
    icon: AlertCircle,
    bgClass: 'bg-muted/50',
    iconClass: 'text-muted-foreground',
  },
  search: {
    icon: SearchX,
    bgClass: 'bg-primary/5',
    iconClass: 'text-primary/60',
  },
  events: {
    icon: CalendarX,
    bgClass: 'bg-secondary/5',
    iconClass: 'text-secondary/60',
  },
  tickets: {
    icon: Ticket,
    bgClass: 'bg-primary/5',
    iconClass: 'text-primary/60',
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-destructive/5',
    iconClass: 'text-destructive/60',
  },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = icon || config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in',
        className
      )}
    >
      <div
        className={cn(
          'w-20 h-20 rounded-2xl flex items-center justify-center mb-6',
          config.bgClass
        )}
      >
        <Icon className={cn('h-10 w-10', config.iconClass)} />
      </div>

      <h3 className="font-display font-semibold text-xl mb-2 text-foreground">
        {title}
      </h3>

      {description && (
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          {description}
        </p>
      )}

      {action && (
        <Button onClick={action.onClick} className="gap-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
