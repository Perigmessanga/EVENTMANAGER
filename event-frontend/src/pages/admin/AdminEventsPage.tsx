import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CardTitle } from '@/components/ui/card';
import { useEventAPI } from '@/hooks/useEventAPI';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const { isLoading, getMyEvents, deleteEvent, publish, unpublish } = useEventAPI();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [events, setEvents] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await getMyEvents();
    setEvents(data);
  };

  const handleDelete = async () => {
    if (selectedEventId) {
      const success = await deleteEvent(selectedEventId);
      if (success) {
        setEvents(events.filter(e => e.id !== selectedEventId));
        setDeleteDialogOpen(false);
        setSelectedEventId(null);
      }
    }
  };

  const handlePublish = async (eventId: number, isPublished: boolean) => {
    const result = isPublished ? await unpublish(eventId) : await publish(eventId);
    if (result) {
      setEvents(events.map(e => e.id === eventId ? result : e));
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === (statusFilter === 'published' ? 'published' : 'draft');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Événements</h1>
          <p className="text-muted-foreground">
            Gérez vos événements et suivez leurs performances.
          </p>
        </div>
        <Link to="/admin/events/create">
          <Button className="gap-2 shadow-glow">
            <Plus className="h-4 w-4" />
            Créer un événement
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="dashboard-widget animate-fade-in">
        <div className="dashboard-widget-content">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{events.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Publiés</p>
          <p className="text-2xl font-bold text-success">{events.filter(e => e.status === 'published').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Brouillons</p>
          <p className="text-2xl font-bold text-pending">{events.filter(e => e.status !== 'published').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Tickets dispo</p>
          <p className="text-2xl font-bold text-primary">
            {events.reduce((sum, e) => sum + (e.tickets_available || 0), 0)}
          </p>
        </div>
      </div>

      {/* Events Table */}
      <div className="dashboard-widget animate-fade-in">
        <div className="dashboard-widget-header">
          <CardTitle className="text-lg">Liste des événements</CardTitle>
          <span className="text-sm text-muted-foreground">{filteredEvents.length} résultat(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Événement</th>
                <th>Date</th>
                <th>Lieu</th>
                <th>Tickets</th>
                <th>Prix</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7}>
                      <div className="h-12 bg-muted/50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Calendar className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Aucun événement trouvé</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        {event.image && (
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.organizer.username}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(event.start_date)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[150px]">{event.location}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event.tickets_sold || 0}/{event.capacity}</span>
                      </div>
                    </td>
                    <td className="font-semibold">{formatCurrency(Number(event.ticket_price))}</td>
                    <td>
                      <Badge
                        variant={event.status === 'published' ? 'default' : 'secondary'}
                        className={cn(
                          event.status === 'published' 
                            ? 'bg-success/10 text-success border-success/20' 
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {event.status === 'published' ? 'Publié' : 'Brouillon'}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/events/${event.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/events/${event.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handlePublish(event.id, event.status === 'published')}>
                            {event.status === 'published' ? (
                              <>
                                <ToggleLeft className="h-4 w-4 mr-2" />
                                Dépublier
                              </>
                            ) : (
                              <>
                                <ToggleRight className="h-4 w-4 mr-2" />
                                Publier
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setSelectedEventId(event.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'événement?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'événement sera supprimé définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
