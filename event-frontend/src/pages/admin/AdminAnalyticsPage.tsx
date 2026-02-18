import { useState, useEffect } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Ticket,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/ui/kpi-card';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

const weeklyTrends = [
  { day: 'Lun', visitors: 1200, conversions: 45, revenue: 420000 },
  { day: 'Mar', visitors: 980, conversions: 38, revenue: 380000 },
  { day: 'Mer', visitors: 1450, conversions: 52, revenue: 520000 },
  { day: 'Jeu', visitors: 1320, conversions: 48, revenue: 480000 },
  { day: 'Ven', visitors: 1680, conversions: 65, revenue: 680000 },
  { day: 'Sam', visitors: 2100, conversions: 82, revenue: 890000 },
  { day: 'Dim', visitors: 1850, conversions: 71, revenue: 750000 },
];

const kpis = [
  { 
    title: 'Taux de conversion', 
    value: '4.2%', 
    change: +0.5, 
    target: '5%',
    icon: Target,
    description: 'Visiteurs qui achètent'
  },
  { 
    title: 'Panier moyen', 
    value: '28 500 FCFA', 
    change: +12.3, 
    target: '30 000 FCFA',
    icon: DollarSign,
    description: 'Par transaction'
  },
  { 
    title: 'Temps moyen', 
    value: '3m 24s', 
    change: -8.2, 
    target: '2m 30s',
    icon: Zap,
    description: 'Jusqu\'au paiement'
  },
  { 
    title: 'Taux d\'abandon', 
    value: '32%', 
    change: -5.1, 
    target: '25%',
    icon: ArrowDownRight,
    description: 'Paniers non finalisés'
  },
];

export default function AdminAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-3xl mb-1">Tendances & KPIs</h1>
        <p className="text-muted-foreground">
          Indicateurs clés de performance et tendances de votre activité.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <KpiCard
          title="Visiteurs uniques"
          value="10,580"
          trend={{ value: 15.3, label: 'cette semaine' }}
          icon={Users}
          iconColor="primary"
        />
        <KpiCard
          title="Billets vendus"
          value="401"
          trend={{ value: 8.7, label: 'cette semaine' }}
          icon={Ticket}
          iconColor="secondary"
        />
        <KpiCard
          title="Revenus"
          value={formatCurrency(4120000)}
          trend={{ value: 22.4, label: 'cette semaine' }}
          icon={DollarSign}
          iconColor="success"
        />
        <KpiCard
          title="Événements actifs"
          value="8"
          subtitle="en cours"
          icon={Calendar}
          iconColor="info"
        />
      </div>

      {/* KPI Details */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isPositiveChange = kpi.change > 0;
          const isGoodTrend = kpi.title === 'Taux d\'abandon' ? !isPositiveChange : isPositiveChange;
          
          return (
            <div key={kpi.title} className="dashboard-widget">
              <div className="dashboard-widget-content">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    isGoodTrend ? 'text-success' : 'text-destructive'
                  )}>
                    {isPositiveChange ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1">{kpi.value}</p>
                <p className="font-medium text-sm mb-2">{kpi.title}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{kpi.description}</span>
                  <span>Objectif: {kpi.target}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trends Chart */}
      <div className="dashboard-widget animate-fade-in">
        <div className="dashboard-widget-header">
          <div>
            <CardTitle className="text-lg">Tendances hebdomadaires</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Visiteurs, conversions et revenus</p>
          </div>
        </div>
        <div className="dashboard-widget-content">
          <div className="h-[350px] chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="visitors"
                  name="Visiteurs"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversions"
                  name="Conversions"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <CardTitle className="text-lg">Entonnoir de conversion</CardTitle>
          </div>
          <div className="dashboard-widget-content space-y-4">
            {[
              { stage: 'Visiteurs', count: 10580, percentage: 100 },
              { stage: 'Consultation événement', count: 6348, percentage: 60 },
              { stage: 'Ajout au panier', count: 1587, percentage: 15 },
              { stage: 'Paiement initié', count: 634, percentage: 6 },
              { stage: 'Achat finalisé', count: 445, percentage: 4.2 },
            ].map((step, index) => (
              <div key={step.stage}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{step.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{step.count.toLocaleString()}</span>
                    <span className="text-xs text-primary font-medium">{step.percentage}%</span>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500"
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <CardTitle className="text-lg">Sources de trafic</CardTitle>
          </div>
          <div className="dashboard-widget-content space-y-4">
            {[
              { source: 'Recherche organique', visits: 4232, percentage: 40, color: 'bg-primary' },
              { source: 'Réseaux sociaux', visits: 2645, percentage: 25, color: 'bg-secondary' },
              { source: 'Direct', visits: 2116, percentage: 20, color: 'bg-info' },
              { source: 'Référencement', visits: 1058, percentage: 10, color: 'bg-success' },
              { source: 'Email', visits: 529, percentage: 5, color: 'bg-muted-foreground' },
            ].map((source) => (
              <div key={source.source} className="flex items-center gap-4">
                <div className={cn('w-3 h-3 rounded-full', source.color)} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{source.source}</span>
                    <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn('h-full rounded-full', source.color)}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
