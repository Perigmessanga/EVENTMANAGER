import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import type { Event } from '@/types';
import { formatCurrency, formatDateCompact, getRelativeTime } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function EventCard({ event, variant = 'default', className }: EventCardProps) {
  const lowestPrice = event.ticketTypes && event.ticketTypes.length > 0
    ? Math.min(...event.ticketTypes.map(t => t.price))
    : (typeof event.ticket_price === 'number' ? event.ticket_price : Number(event.ticket_price) || 0);
  const eventDate = (event.date as string) || (event.start_date as string) || '';
  const relativeTime = getRelativeTime(eventDate);
  const totalAvailable = event.ticketTypes && event.ticketTypes.length > 0
    ? event.ticketTypes.reduce((sum, t) => sum + (t.available || 0), 0)
    : (event.capacity || 0);
  const isAlmostSoldOut = totalAvailable < 50;

  if (variant === 'compact') {
    return (
      <Link to={`/events/${event.id}`} className={cn('block group', className)}>
        <article className="event-card flex gap-4 p-4 group-hover:border-primary/30">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover low-bandwidth-img transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDateCompact(event.date)} • {event.venue}
            </p>
            <p className="text-sm font-bold text-primary mt-2">
              À partir de {formatCurrency(lowestPrice)}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/events/${event.id}`} className={cn('block group', className)}>
        <article className="event-card relative overflow-hidden group-hover:border-primary/30">
          <div className="aspect-[16/9] relative overflow-hidden">
            <img
              src={event.imageUrl || (event.image as string) || ''}
              alt={event.title}
              className="w-full h-full object-cover low-bandwidth-img transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-primary text-primary-foreground shadow-md">
                {event.category}
              </Badge>
              {relativeTime === "Aujourd'hui" && (
                <Badge variant="destructive" className="shadow-md animate-pulse-slow">
                  Aujourd'hui
                </Badge>
              )}
              {isAlmostSoldOut && (
                <Badge variant="secondary" className="bg-warning/90 text-warning-foreground shadow-md">
                  <Ticket className="h-3 w-3 mr-1" />
                  Dernières places
                </Badge>
              )}
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <h3 className="font-display font-bold text-xl md:text-2xl line-clamp-2 mb-3 drop-shadow-lg">
                {event.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                <span className="flex items-center gap-1.5 backdrop-blur-sm bg-white/10 px-2.5 py-1 rounded-full">
                  <Calendar className="h-4 w-4" />
                  {formatDateCompact(eventDate)}
                </span>
                <span className="flex items-center gap-1.5 backdrop-blur-sm bg-white/10 px-2.5 py-1 rounded-full">
                  <MapPin className="h-4 w-4" />
                  {event.venue || event.location || event.address}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-bold text-lg">
                  À partir de {formatCurrency(lowestPrice)}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-white/80">
                  <Users className="h-4 w-4" />
                  {totalAvailable} places
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/events/${event.id}`} className={cn('block group', className)}>
      <article className="event-card overflow-hidden group-hover:border-primary/30">
        <div className="aspect-[4/3] relative overflow-hidden">
            <img
            src={event.imageUrl || (event.image as string) || ''}
            alt={event.title}
            className="w-full h-full object-cover low-bandwidth-img transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-card/95 text-foreground backdrop-blur-sm shadow-sm border-0">
              {event.category}
            </Badge>
            {isAlmostSoldOut && (
              <Badge variant="destructive" className="shadow-sm">
                <Ticket className="h-3 w-3 mr-1" />
                Presque épuisé
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formatDateCompact(eventDate)}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {relativeTime}
            </span>
          </div>
          
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {event.title}
          </h3>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{(event.venue || event.location || event.address) + (event.city ? `, ${event.city}` : '')}</span>
          </div>
          
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">À partir de</span>
            <span className="font-bold text-primary text-lg">{formatCurrency(lowestPrice)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function EventCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'featured' }) {
  if (variant === 'featured') {
    return (
      <div className="event-card overflow-hidden">
        <div className="aspect-[16/9] skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="event-card overflow-hidden">
      <div className="aspect-[4/3] skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-28 skeleton-shimmer rounded" />
        <div className="h-5 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-36 skeleton-shimmer rounded" />
        <div className="flex justify-between items-center pt-3 border-t border-border/50">
          <div className="h-3 w-16 skeleton-shimmer rounded" />
          <div className="h-6 w-24 skeleton-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
