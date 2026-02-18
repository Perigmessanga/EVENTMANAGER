import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  Grid,
  List,
  CalendarDays,
  AlertCircle,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { get } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';
import { cn } from '@/lib/utils';

export interface Event {
  id: number;
  title: string;
  description: string;
  image: string | null;
  location: string;
  start_date: string;
  end_date: string;
  capacity: number;
  ticket_price: string | number;
  status: string;
  organizer: {
    id: number;
    username: string;
    email: string;
  };
  created_at: string;
}

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationFilter, setLocationFilter] = useState(initialLocation);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await get<Event[]>(ENDPOINTS.events.list);
        setEvents(Array.isArray(response) ? response : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query)
      );
    }

    if (locationFilter.trim()) {
      const location = locationFilter.toLowerCase();
      filtered = filtered.filter((e) =>
        e.location.toLowerCase().includes(location)
      );
    }

    return filtered;
  }, [events, searchQuery, locationFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (locationFilter) params.set('location', locationFilter);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setSearchParams({});
  };

  const hasFilters = searchQuery || locationFilter;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-bold text-3xl md:text-4xl">Événements</h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            Découvrez les meilleurs événements
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
              disabled={isLoading}
            />
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Lieu..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="pl-12 h-12"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="h-12 px-6">
            <Filter className="h-4 w-4" />
          </Button>
        </form>

        {/* Toggle */}
        <div className="flex justify-between mb-4">
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              Effacer les filtres
            </Button>
          )}

          <div className="flex gap-1 border rounded p-1">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={cn(
                'p-2 rounded',
                viewMode === 'grid' && 'bg-muted'
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={cn(
                'p-2 rounded',
                viewMode === 'list' && 'bg-muted'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div
            className={cn(
              'grid gap-6',
              viewMode === 'grid'
                ? 'sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 max-w-3xl'
            )}
          >
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun événement trouvé"
            description="Essayez de modifier vos critères"
            action={{ label: 'Réinitialiser', onClick: clearFilters }}
          />
        )}
      </div>
    </Layout>
  );
}
