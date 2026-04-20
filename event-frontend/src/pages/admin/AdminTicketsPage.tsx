import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { getAdminTicketTypes, createTicketType, updateTicketType, deleteTicketType } from "@/data/api/admin";

export default function AdminTicketsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<any>({});
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchTickets = async () => {
    try {
      const res = await getAdminTicketTypes("");
      setTickets(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    if (!Array.isArray(tickets)) return [];
    let data = [...tickets];

    if (selectedEvent !== "all") {
      data = data.filter((t) => t && String(t.event) === selectedEvent);
    }

    if (search) {
      data = data.filter((t) =>
        t && t.name && t.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [tickets, selectedEvent, search]);

  const paginatedTickets = filteredTickets.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalRevenue = useMemo(() => {
    if (!Array.isArray(tickets)) return 0;
    return tickets.reduce(
      (acc, t) => acc + (Number(t.quantity_sold) || 0) * (parseFloat(t.price) || 0),
      0
    );
  }, [tickets]);

  const exportCSV = () => {
    const headers = [
      "Event",
      "Name",
      "Price",
      "Total",
      "Sold",
      "Available",
    ];

    const rows = tickets.map((t) => [
      t.event_title,
      t.name,
      t.price,
      t.quantity_total,
      t.quantity_sold,
      t.quantity_total - t.quantity_sold,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "tickets_export.csv";
    link.click();
  };

  const totalPages = Math.ceil(filteredTickets.length / pageSize);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🎟️ Gestion des Tickets</h1>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" className="rounded-2xl">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => { setForm({}); setOpen(true); }} className="rounded-2xl">
            <Plus className="mr-2 h-4 w-4" /> Ajouter
          </Button>
        </div>
      </div>

      {/* Revenue Card */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Revenue Total Tickets</p>
          <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} FCFA</p>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Rechercher ticket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-2xl"
        />

        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-64 rounded-2xl">
            <SelectValue placeholder="Filtrer par événement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les événements</SelectItem>
            {Array.from(
              new Map(tickets.map((t) => [t.event, t.event_title])).entries()
            ).map(([id, title]) => (
              <SelectItem key={id} value={String(id)}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Event</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Sold</th>
                    <th>Available</th>
                    <th>Progress</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map((t) => {
                    const available = t.quantity_total - t.quantity_sold;
                    const percent = t.quantity_total
                      ? (t.quantity_sold / t.quantity_total) * 100
                      : 0;

                    return (
                      <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b">
                        <td className="py-3">{t.event_title}</td>
                        <td>{t.name}</td>
                        <td>{t.price} FCFA</td>
                        <td>{t.quantity_total}</td>
                        <td>{t.quantity_sold}</td>
                        <td className={available <= 0 ? "text-red-600 font-semibold" : ""}>
                          {available <= 0 ? "Sold Out" : available}
                        </td>
                        <td className="w-40">
                          <Progress value={percent} />
                        </td>
                        <td className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => { setEditing(t); setForm(t); setOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteTicketType(t.id).then(fetchTickets)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm">Page {page} / {totalPages || 1}</p>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
              <Button variant="outline" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier Ticket" : "Créer Ticket"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Nom" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Prix" type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input placeholder="Quantité Totale" type="number" value={form.quantity_total || ""} onChange={(e) => setForm({ ...form, quantity_total: e.target.value })} />
            <Input placeholder="Max par commande" type="number" value={form.max_per_order || ""} onChange={(e) => setForm({ ...form, max_per_order: e.target.value })} />

            <Button
              onClick={async () => {
                if (editing) await updateTicketType(editing.id, form);
                else await createTicketType(form);
                setOpen(false);
                setEditing(null);
                fetchTickets();
              }}
              className="w-full rounded-2xl"
            >
              {editing ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
