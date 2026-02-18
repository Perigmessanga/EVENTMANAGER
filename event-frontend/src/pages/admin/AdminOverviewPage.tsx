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
import { mockEvents } from '@/data/events';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Mock data for charts
const revenueData = [
  { name: 'Lun', revenue: 420000, tickets: 28 },
  { name: 'Mar', revenue: 380000, tickets: 24 },
  { name: 'Mer', revenue: 520000, tickets: 35 },
  { name: 'Jeu', revenue: 480000, tickets: 32 },
  { name: 'Ven', revenue: 680000, tickets: 45 },
  { name: 'Sam', revenue: 890000, tickets: 62 },
  { name: 'Dim', revenue: 750000, tickets: 51 },
];

const recentTransactions = [
  { id: '1', event: 'Concert Magic System', buyer: 'Kouassi Jean', amount: 25000, status: 'success', time: 'Il y a 5 min' },
  { id: '2', event: 'Match ASEC vs Africa', buyer: 'Diallo Fatou', amount: 15000, status: 'success', time: 'Il y a 12 min' },
  { id: '3', event: 'Festival des Grillades', buyer: 'Koné Ibrahim', amount: 10000, status: 'pending', time: 'Il y a 18 min' },
  { id: '4', event: 'Spectacle Gohou Michel', buyer: 'N\'Guessan Marie', amount: 20000, status: 'success', time: 'Il y a 25 min' },
  { id: '5', event: 'Concert Magic System', buyer: 'Ouattara Seydou', amount: 50000, status: 'failed', time: 'Il y a 32 min' },
];

const categoryData = [
  { name: 'Musique', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Sport', value: 25, color: 'hsl(var(--secondary))' },
  { name: 'Culture', value: 15, color: 'hsl(var(--info))' },
  { name: 'Humour', value: 10, color: 'hsl(var(--success))' },
  { name: 'Autre', value: 5, color: 'hsl(var(--muted-foreground))' },
];

const sparklineData = [12, 18, 14, 22, 28, 24, 32, 28, 35, 42, 38, 45];

export default function AdminOverviewPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = {
    revenue: 2450000,
    ticketsSold: 342,
    activeEvents: mockEvents.filter(e => e.isPublished).length,
    pendingPayments: 5,
    conversionRate: 68.5,
    avgOrderValue: 28500,
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.firstName}! Voici un aperçu de vos performances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium transition-colors',
                  selectedPeriod === period
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                )}
              >
                {period === '7d' ? '7 jours' : period === '30d' ? '30 jours' : '90 jours'}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in stagger-1">
          <KpiCard
            title="Revenus totaux"
            value={formatCurrency(stats.revenue)}
            trend={{ value: 12.5, label: 'vs mois dernier' }}
            icon={DollarSign}
            iconColor="primary"
          />
        </div>
        <div className="animate-fade-in stagger-2">
          <KpiCard
            title="Billets vendus"
            value={stats.ticketsSold.toLocaleString('fr-FR')}
            trend={{ value: 8.2, label: 'cette semaine' }}
            icon={Ticket}
            iconColor="secondary"
          />
        </div>
        <div className="animate-fade-in stagger-3">
          <KpiCard
            title="Événements actifs"
            value={stats.activeEvents}
            subtitle="publiés"
            icon={Calendar}
            iconColor="success"
          />
        </div>
        <div className="animate-fade-in stagger-4">
          <KpiCard
            title="Taux de conversion"
            value={`${stats.conversionRate}%`}
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

        {/* Category Distribution */}
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
        {/* Recent Transactions */}
        <div className="lg:col-span-2 dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <div>
              <CardTitle className="text-lg">Transactions récentes</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Dernières ventes de billets</p>
            </div>
            <Link to="/admin/sales">
              <Button variant="ghost" size="sm" className="gap-1">
                Voir tout
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Événement</th>
                  <th>Acheteur</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="group">
                    <td>
                      <div>
                        <p className="font-medium text-foreground">{tx.event}</p>
                        <p className="text-xs text-muted-foreground">{tx.time}</p>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{tx.buyer}</td>
                    <td className="font-semibold text-foreground">{formatCurrency(tx.amount)}</td>
                    <td>
                      <Badge
                        variant={
                          tx.status === 'success' ? 'default' :
                          tx.status === 'pending' ? 'secondary' : 'destructive'
                        }
                        className={cn(
                          'gap-1',
                          tx.status === 'success' && 'bg-success/10 text-success border-success/20',
                          tx.status === 'pending' && 'bg-pending/10 text-pending border-pending/20',
                          tx.status === 'failed' && 'bg-destructive/10 text-destructive border-destructive/20'
                        )}
                      >
                        {tx.status === 'success' && <CheckCircle2 className="h-3 w-3" />}
                        {tx.status === 'pending' && <Clock className="h-3 w-3" />}
                        {tx.status === 'failed' && <XCircle className="h-3 w-3" />}
                        {tx.status === 'success' ? 'Payé' : tx.status === 'pending' ? 'En attente' : 'Échoué'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Events */}
        <div className="dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <CardTitle className="text-lg">Top événements</CardTitle>
          </div>
          <div className="dashboard-widget-content space-y-4">
            {mockEvents.slice(0, 4).map((event, index) => (
              <div 
                key={event.id} 
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="relative">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.ticketTypes[0].available} dispo</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-primary">
                    {formatCurrency(event.ticketTypes[0].price)}
                  </p>
                  <MiniChart 
                    data={sparklineData.slice(0, 7 + index)} 
                    color="primary" 
                    height={20}
                    className="w-14 mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
