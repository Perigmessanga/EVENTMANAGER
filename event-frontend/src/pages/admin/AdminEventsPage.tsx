import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEventAPI } from '@/hooks/useEventAPI';
import type { Event } from '@/types';
import { Eye, Pencil, Trash2, Plus, Search, Calendar, User, LayoutGrid } from "lucide-react";
import { formatDateCompact, formatLocalTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const { getAll, deleteEvent, isLoading } = useEventAPI();

  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    try {
      const data = await getAll();
      setEvents(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des événements :", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []); 

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = (id: number) => {
    setSelectedEventId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedEventId === null) return;
    
    try {
      await deleteEvent(selectedEventId);
      setIsDeleteModalOpen(false);
      setSelectedEventId(null);
      fetchEvents();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const filteredEvents = events.filter((event) =>
    (event.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Gestion des événements</h1>
          <p className="text-muted-foreground text-sm">Gérez et suivez tous vos événements en un coup d'œil</p>
        </div>
        <Button onClick={() => navigate("/admin/events/create")} className="gap-2 shadow-glow">
          <Plus className="w-4 h-4" />
          Créer un événement
        </Button>
      </div>

      {/* Tools */}
      <div className="flex bg-card p-4 rounded-xl border border-border shadow-sm items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30 border-none"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LayoutGrid className="h-4 w-4" />
          <span>{filteredEvents.length} événements</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-semibold text-sm">Événement</th>
                <th className="p-4 font-semibold text-sm">Statut</th>
                <th className="p-4 font-semibold text-sm">Date & Heure</th>
                <th className="p-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground animate-pulse">
                    Chargement de vos événements...
                  </td>
                </tr>
              ) : filteredEvents.map((event: Event) => (
                <tr key={event.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {event.title || "Titre absent"}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        {event.location || "Lieu non défini"}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "capitalize font-medium",
                        event.status === 'published' ? "bg-success/10 text-success border-success/20" : 
                        event.status === 'draft' ? "bg-pending/10 text-pending border-pending/20" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {event.status === 'published' ? 'Publié' : 
                       event.status === 'draft' ? 'Brouillon' : 
                       event.status === 'cancelled' ? 'Annulé' : event.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatDateCompact(event.date)}
                    </div>
                    <div className="text-xs text-muted-foreground ml-5">
                      {formatLocalTime(event.date)} (GMT)
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        title="Voir l'événement"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                        className="h-8 w-8 hover:bg-info/10 hover:text-info"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteClick(event.id)}
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEvents.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={4} className="text-center p-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 opacity-20" />
                      <p>Aucun événement trouvé pour votre recherche.</p>
                      <Button variant="link" onClick={() => setSearch("")} className="text-primary p-0">
                        Effacer la recherche
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'événement"
        description="Voulez-vous vraiment supprimer cet événement ? Cette action est irréversible et supprimera également tous les billets associés."
        confirmText="Supprimer"
        variant="destructive"
        isLoading={isLoading}
      />
    </div>
  );
}