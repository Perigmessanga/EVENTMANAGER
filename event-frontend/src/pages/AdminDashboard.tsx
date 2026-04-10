import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Ticket, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  MoreHorizontal,
  Eye,
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Layout } from '@/components/layout/Layout';
import { ColorDot } from '@/components/ColorDot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export default function AdminDashboard() {
  const { user, hasRole } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!hasRole(['admin', 'organizer'])) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="font-display font-bold text-2xl mb-4">Accès refusé</h1>
            <p className="text-muted-foreground mb-6">Vous n'avez pas les droits d'accès à cette page.</p>
            <Link to="/"><Button>Retour à l'accueil</Button></Link>
          </div>
        </div>
      </Layout>
    );
  }

  const stats = {
    revenue: 2450000,
    ticketsSold: 342,
    activeEvents: mockEvents.filter(e => e.isPublished).length,
    pendingPayments: 5,
    conversionRate: 68.5,
    avgOrderValue: 28500,
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <DashboardSkeleton />
        </div>
      </Layout>
    );
  }

 // Remplace ton bloc de retour (return) par celui-ci :

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header - S'adapte de haut en bas sur mobile, et côte à côte sur tablette+ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Bienvenue, {user?.first_name}! Voici un aperçu de vos performances.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-border overflow-hidden bg-card">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={cn(
                    'px-3 py-1.5 text-xs md:text-sm font-medium transition-colors',
                    selectedPeriod === period
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {period === '7d' ? '7j' : period === '30d' ? '30j' : '90j'}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
              <Download className="h-4 w-4" />
              <span className="hidden xs:inline">Exporter</span>
            </Button>
          </div>
        </div>

        {/* KPI Cards - 1 col (mobile), 2 cols (tablette), 4 cols (PC) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            title="Revenus totaux"
            value={formatCurrency(stats.revenue)}
            trend={{ value: 12.5, label: 'vs mois dernier' }}
            icon={DollarSign}
            iconColor="primary"
          />
          <KpiCard
            title="Billets vendus"
            value={stats.ticketsSold.toLocaleString('fr-FR')}
            trend={{ value: 8.2, label: 'cette semaine' }}
            icon={Ticket}
            iconColor="secondary"
          />
          <KpiCard
            title="Événements actifs"
            value={stats.activeEvents}
            subtitle="publiés"
            icon={Calendar}
            iconColor="success"
          />
          <KpiCard
            title="Taux de conversion"
            value={`${stats.conversionRate}%`}
            trend={{ value: 3.1, label: 'vs semaine dernière' }}
            icon={TrendingUp}
            iconColor="info"
          />
        </div>

        {/* Charts Row - Empilé sur mobile, 2/3 + 1/3 sur grand écran */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 dashboard-widget animate-fade-in">
            <div className="dashboard-widget-header flex justify-between items-center p-4">
              <div>
                <CardTitle className="text-lg">Revenus & Ventes</CardTitle>
                <p className="text-sm text-muted-foreground">7 derniers jours</p>
              </div>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
            <div className="p-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-widget animate-fade-in p-4">
            <CardTitle className="text-lg mb-4">Par catégorie</CardTitle>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} innerRadius={60} outerRadius={80} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <ColorDot color={cat.color} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-bold">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity - S'adapte de 1 à 3 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 dashboard-widget overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <CardTitle className="text-lg">Transactions</CardTitle>
              <Button variant="link" size="sm">Voir tout</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Événement</th>
                    <th className="p-4 font-medium hidden sm:table-cell">Acheteur</th>
                    <th className="p-4 font-medium">Montant</th>
                    <th className="p-4 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="p-4 font-medium">{tx.event}</td>
                      <td className="p-4 hidden sm:table-cell">{tx.buyer}</td>
                      <td className="p-4">{formatCurrency(tx.amount)}</td>
                      <td className="p-4">
                         <Badge variant="outline" className="text-[10px] sm:text-xs">
                          {tx.status === 'success' ? 'Payé' : 'Attente'}
                         </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-widget p-4">
            <CardTitle className="text-lg mb-4">Top événements</CardTitle>
            <div className="space-y-4">
              {mockEvents.slice(0, 4).map((event, index) => (
                <div key={event.id} className="flex items-center gap-3">
                  <img src={event.image_Url} alt={event.title} className="w-10 h-10 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                  </div>
                  <div className="text-right font-bold text-sm">
                    {formatCurrency(event.ticketTypes[0].price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
