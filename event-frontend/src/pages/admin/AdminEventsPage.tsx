import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEventAPI } from '@/hooks/useEventAPI';
import type { Event } from '@/types';
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const { getAll, deleteEvent, isLoading } = useEventAPI();

  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");

  // Définir fetchEvents avant useEffect
  const fetchEvents = async () => {
    try {
      const data: Event[] = await getAll(); // assure que getAll renvoie Event[]
      setEvents(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des événements :", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // useEffect sans dépendances dynamiques

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cet événement ?"
    );
    if (!confirmDelete) return;

    try {
      await deleteEvent(id);
      fetchEvents(); // rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des événements</h1>
        <Button onClick={() => navigate("/admin/events/create")}>
          Créer un événement
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Rechercher par nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted">
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event: Event) => (
              <tr key={event.id} className="border-t">
                <td className="p-3">{event.title}</td>
                <td className="p-3 capitalize">{event.status}</td>
                <td className="p-3">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="p-3 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}

            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-6 text-muted-foreground">
                  Aucun événement trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isLoading && <p className="mt-4">Chargement...</p>}
    </div>
  );
}