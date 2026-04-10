import { useEffect, useState } from "react";
import { getAdvancedSales } from "@/data/api/admin";
import type { AdvancedSales } from "@/types/admin";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export default function AdminSalesPage() {
  const [sales, setSales] = useState<AdvancedSales | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSales = async () => {
    const params = `?start_date=${startDate}&end_date=${endDate}`;
    const data = await getAdvancedSales(params);
    setSales(data);
  };

  useEffect(() => {
    fetchSales();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!sales) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-bold">Dashboard Ventes Avancé</h1>

      {/* FILTRE DATE */}
      <div className="flex gap-4">
        <input
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchSales}
          className="bg-black text-white px-4 rounded"
        >
          Filtrer
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4">
        <Card title="Revenu Total" value={`${sales.total_revenue} FCFA`} />
        <Card title="Billets Vendus" value={sales.total_tickets} />
        <Card title="Panier Moyen" value={`${sales.average_cart} FCFA`} />
      </div>

      {/* COURBE EVOLUTION */}
      <div className="bg-white p-6 rounded-xl shadow h-96">
        <h2 className="font-semibold mb-4">Évolution Mensuelle</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sales.monthly_sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TOP 5 EVENTS */}
      <div className="bg-white p-6 rounded-xl shadow h-96">
        <h2 className="font-semibold mb-4">Top 5 Événements</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sales.top_events}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="event__title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="bg-white p-6 rounded-xl shadow h-96">
        <h2 className="font-semibold mb-4">Distribution Billets</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sales.ticket_distribution}
              dataKey="total"
              nameKey="ticket_type__name"
              outerRadius={120}
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}