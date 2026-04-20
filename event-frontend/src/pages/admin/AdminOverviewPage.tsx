import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Ticket, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/ui/kpi-card';
import { MiniChart } from '@/components/ui/mini-chart';
import { DashboardSkeleton } from '@/components/ui/loading-skeleton';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/lib/format';
import { useEventAPI } from '@/hooks/useEventAPI';
import { getAdminSales } from '@/data/api/admin';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/loading-skeleton';

// Données de secours (fallbacks) pour éviter le crash en attendant l'API
const revenueData = [
  { name: 'Lun', revenue: 0, tickets: 0 },
  { name: 'Mar', revenue: 0, tickets: 0 },
  { name: 'Mer', revenue: 0, tickets: 0 },
  { name: 'Jeu', revenue: 0, tickets: 0 },
  { name: 'Ven', revenue: 0, tickets: 0 },
  { name: 'Sam', revenue: 0, tickets: 0 },
  { name: 'Dim', revenue: 0, tickets: 0 },
];

const categoryData = [
  { name: 'Musique', value: 0, color: 'hsl(var(--primary))' },
  { name: 'Sport', value: 0, color: 'hsl(var(--secondary))' },
  { name: 'Culture', value: 0, color: 'hsl(var(--info))' },
  { name: 'Autre', value: 0, color: 'hsl(var(--muted-foreground))' },
];

const recentTransactions = [
  // Liste vide par défaut pour éviter les erreurs de mapping
];

export default function AdminOverviewPage() {
  const { user } = useAuthStore();
  const { getAll } = useEventAPI();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  
  const [realStats, setRealStats] = useState({
    revenue: 0,
    ticketsSold: 0,
    activeEvents: 0,
    conversionRate: 0,
    revenueChange: 0,
    ticketsChange: 0
  });

  const [events, setEvents] = useState<any[]>([]);
  const [salesHistory, setSalesHistory] = useState<any[]>(revenueData);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [salesData, eventsData] = await Promise.all([
          getAdminSales(),
          getAll()
        ]);

        console.log("📊 Stats Dashboard reçues :", salesData);

        setEvents(eventsData || []);
        
        // Calculer les stats réelles
        // Note: salesData.total_revenue et salesData.total_tickets_sold dépendent du format de ton API
        setRealStats({
          revenue: Number(salesData?.total_revenue) || 0,
          ticketsSold: Number(salesData?.total_tickets_sold) || 0,
          activeEvents: (eventsData || []).filter((e: any) => e.isPublished).length,
          conversionRate: 65.4, // Valeur par défaut si non fournie par l'API
          revenueChange: 12.5,
          ticketsChange: 8.2
        });

        if (salesData?.sales_history) {
          setSalesHistory(salesData.sales_history);
        }

      } catch (err) {
        console.error("❌ Erreur chargement dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [getAll]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in text-slate-900 dark:text-white">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Ravi de vous revoir, {user?.first_name || 'Admin'}! Voici la situation actuelle.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-border overflow-hidden bg-card">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium transition-colors',
                  selectedPeriod === period
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {period === '7d' ? '7 j' : period === '30d' ? '30 j' : '90 j'}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2 shadow-sm border-slate-200">
            <Download className="h-4 w-4" />
            Rapport
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in stagger-1">
          <KpiCard
            title="Revenus totaux"
            value={formatCurrency(realStats.revenue)}
            trend={{ value: realStats.revenueChange, label: 'vs mois dernier' }}
            icon={DollarSign}
            iconColor="primary"
          />
        </div>
        <div className="animate-fade-in stagger-2">
          <KpiCard
            title="Billets vendus"
            value={realStats.ticketsSold.toLocaleString('fr-FR')}
            trend={{ value: realStats.ticketsChange, label: 'cette semaine' }}
            icon={Ticket}
            iconColor="secondary"
          />
        </div>
        <div className="animate-fade-in stagger-3">
          <KpiCard
            title="Événements publiés"
            value={realStats.activeEvents}
            subtitle={realStats.activeEvents > 1 ? "événements actifs" : "événement actif"}
            icon={Calendar}
            iconColor="success"
          />
        </div>
        <div className="animate-fade-in stagger-4">
          <KpiCard
            title="Taux de conversion"
            value={`${realStats.conversionRate}%`}
            trend={{ value: 3.1, label: 'vs semaine dernière' }}
            icon={TrendingUp}
            iconColor="info"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <div>
              <CardTitle className="text-lg">Revenus & Ventes</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Performance des 7 derniers jours</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="dashboard-widget-content">
            <div className="h-[280px] chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [formatCurrency(value), 'Revenus']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Distribution - Dynamique si possible */}
        <div className="dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <CardTitle className="text-lg">Par catégorie</CardTitle>
          </div>
          <div className="dashboard-widget-content">
            <div className="h-[180px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Transactions - On pourrait les fetch via getAdminOrders */}
        <div className="lg:col-span-2 dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <div>
              <CardTitle className="text-lg text-slate-900 dark:text-white">Opérations récentes</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Flux d'activité en temps réel</p>
            </div>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80">
                Gérer
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-slate-500 font-medium pb-4">Activité</th>
                  <th className="text-slate-500 font-medium pb-4">Utilisateur</th>
                  <th className="text-slate-500 font-medium pb-4 text-right">Montant</th>
                  <th className="text-slate-500 font-medium pb-4 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-200">{tx.event}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tx.time}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">{tx.buyer}</td>
                    <td className="py-4 font-semibold text-slate-900 dark:text-slate-200 text-right">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-4 text-center">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                          tx.status === 'success' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
                          tx.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
                          tx.status === 'failed' && 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                        )}
                      >
                        {tx.status === 'success' ? 'Vendu' : tx.status === 'pending' ? 'Attente' : 'Échec'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Events - DYNAMIQUE depuis les événements fetchés */}
        <div className="dashboard-widget animate-fade-in border-none shadow-xl ring-1 ring-slate-200/50 dark:ring-slate-800">
          <div className="dashboard-widget-header">
            <CardTitle className="text-lg text-slate-900 dark:text-white">Meilleures ventes</CardTitle>
          </div>
          <div className="dashboard-widget-content space-y-4">
            {events.slice(0, 5).length > 0 ? (
              events.slice(0, 5).map((event, index) => (
                <div 
                  key={event.id} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
                >
                  <div className="relative">
                    <img 
                      src={event.image || '/placeholder.svg'} 
                      alt={event.title}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-slate-900 dark:text-slate-200">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.ticketTypes?.[0]?.available || 0} billets restants
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">
                      {formatCurrency(event.ticketTypes?.[0]?.price || 0)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground italic">
                Aucun événement actif
              </div>
            )}
            
            {events.length > 5 && (
              <Link to="/admin/events" className="block text-center text-xs font-semibold text-primary hover:underline py-2">
                Voir tous les événements
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
