import { useEffect, useState } from "react";
import { getAdminOrders } from "@/data/api/admin";
import type { AdminOrder } from "@/types/admin";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    const params = `?page=${page}&status=${statusFilter}&search=${search}`;
    const data = await getAdminOrders(params);

    setOrders(data.results);
    setCount(data.count);
  };

  

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, search]);

  const totalPages = Math.ceil(count / 10);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Commandes</h1>

      {/* FILTRES */}
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="text"
          placeholder="Rechercher par email ou event"
          className="border p-2 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Utilisateur</th>
              <th className="p-3">Événement</th>
              <th className="p-3">Billet</th>
              <th className="p-3">Qté</th>
              <th className="p-3">Total</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.user_email}</td>
                <td className="p-3">{order.event_title}</td>
                <td className="p-3">{order.ticket_name}</td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">{order.total_price} FCFA</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-gray-200">
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>

        <span>
          Page {page} sur {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}