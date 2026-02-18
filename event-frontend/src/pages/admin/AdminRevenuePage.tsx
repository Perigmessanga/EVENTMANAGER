import { useState, useEffect } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  ArrowUpRight,
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
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/ui/kpi-card';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

const monthlyRevenueData = [
  { month: 'Jan', revenue: 1200000, tickets: 80 },
  { month: 'Fév', revenue: 1450000, tickets: 95 },
  { month: 'Mar', revenue: 1680000, tickets: 112 },
  { month: 'Avr', revenue: 1420000, tickets: 88 },
  { month: 'Mai', revenue: 1890000, tickets: 125 },
  { month: 'Jun', revenue: 2100000, tickets: 140 },
  { month: 'Jul', revenue: 2450000, tickets: 163 },
];

const revenueByEvent = [
  { name: 'Concert Magic System', revenue: 850000, color: 'hsl(var(--primary))' },
  { name: 'Match ASEC vs Africa', revenue: 620000, color: 'hsl(var(--secondary))' },
  { name: 'Festival des Grillades', revenue: 480000, color: 'hsl(var(--info))' },
  { name: 'Spectacle Gohou Michel', revenue: 350000, color: 'hsl(var(--success))' },
  { name: 'Autres', revenue: 150000, color: 'hsl(var(--muted-foreground))' },
];

const paymentMethodData = [
  { method: 'Orange Money', amount: 1200000, percentage: 48 },
  { method: 'MTN MoMo', amount: 850000, percentage: 34 },
  { method: 'Wave', amount: 450000, percentage: 18 },
];

export default function AdminRevenuePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = {
    totalRevenue: 2450000,
    thisMonth: 890000,
    lastMonth: 750000,
    avgOrderValue: 28500,
    growth: 18.7,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Revenus</h1>
          <p className="text-muted-foreground">
            Analysez vos revenus et performances financières.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(['7d', '30d', '90d', '1y'] as const).map((period) => (
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
                {period === '7d' ? '7J' : period === '30d' ? '30J' : period === '90d' ? '90J' : '1 an'}
              </button>
            ))}
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Rapport
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <KpiCard
          title="Revenus totaux"
          value={formatCurrency(stats.totalRevenue)}
          trend={{ value: stats.growth, label: 'vs période précédente' }}
          icon={DollarSign}
          iconColor="primary"
        />
        <KpiCard
          title="Ce mois-ci"
          value={formatCurrency(stats.thisMonth)}
          trend={{ value: ((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100), label: 'vs mois dernier' }}
          icon={Calendar}
          iconColor="success"
        />
        <KpiCard
          title="Panier moyen"
          value={formatCurrency(stats.avgOrderValue)}
          subtitle="par commande"
          icon={TrendingUp}
          iconColor="info"
        />
        <KpiCard
          title="Croissance"
          value={`+${stats.growth}%`}
          subtitle="année en cours"
          icon={ArrowUpRight}
          iconColor="secondary"
        />
      </div>

      {/* Revenue Chart */}
      <div className="dashboard-widget animate-fade-in">
        <div className="dashboard-widget-header">
          <div>
            <CardTitle className="text-lg">Évolution des revenus</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Revenus mensuels et nombre de billets vendus</p>
          </div>
        </div>
        <div className="dashboard-widget-content">
          <div className="h-[350px] chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
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
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'revenue' ? 'Revenus' : 'Billets'
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenus"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue2)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="tickets"
                  name="Billets"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue by Event & Payment Methods */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Event */}
        <div className="dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <CardTitle className="text-lg">Revenus par événement</CardTitle>
          </div>
          <div className="dashboard-widget-content">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByEvent} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis 
                    type="number" 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    width={150}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Revenus']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {revenueByEvent.map((entry, index) => (
                      <rect key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <CardTitle className="text-lg">Méthodes de paiement</CardTitle>
          </div>
          <div className="dashboard-widget-content space-y-4">
            {paymentMethodData.map((method, index) => (
              <div key={method.method} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{method.method}</span>
                  <span className="text-sm text-muted-foreground">{method.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      index === 0 && 'bg-[hsl(25,95%,53%)]',
                      index === 1 && 'bg-[hsl(48,100%,50%)]',
                      index === 2 && 'bg-[hsl(199,89%,48%)]'
                    )}
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{formatCurrency(method.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
