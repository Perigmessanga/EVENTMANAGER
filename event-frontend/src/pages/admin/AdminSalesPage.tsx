import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpDown,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

interface Sale {
  id: string;
  orderId: string;
  event: string;
  buyer: string;
  email: string;
  ticketType: string;
  quantity: number;
  amount: number;
  paymentMethod: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
}

const mockSales: Sale[] = [
  { id: '1', orderId: 'TK-2024-001', event: 'Concert Magic System', buyer: 'Kouassi Jean', email: 'kouassi@gmail.com', ticketType: 'VIP', quantity: 2, amount: 50000, paymentMethod: 'Orange Money', status: 'success', date: '2024-01-20T14:30:00' },
  { id: '2', orderId: 'TK-2024-002', event: 'Match ASEC vs Africa', buyer: 'Diallo Fatou', email: 'fatou.d@gmail.com', ticketType: 'Tribune', quantity: 4, amount: 60000, paymentMethod: 'MTN MoMo', status: 'success', date: '2024-01-20T13:15:00' },
  { id: '3', orderId: 'TK-2024-003', event: 'Festival des Grillades', buyer: 'Koné Ibrahim', email: 'kone.i@gmail.com', ticketType: 'Standard', quantity: 1, amount: 10000, paymentMethod: 'Wave', status: 'pending', date: '2024-01-20T12:45:00' },
  { id: '4', orderId: 'TK-2024-004', event: 'Spectacle Gohou Michel', buyer: 'N\'Guessan Marie', email: 'marie.n@gmail.com', ticketType: 'Gold', quantity: 3, amount: 60000, paymentMethod: 'Orange Money', status: 'success', date: '2024-01-20T11:30:00' },
  { id: '5', orderId: 'TK-2024-005', event: 'Concert Magic System', buyer: 'Ouattara Seydou', email: 'seydou.o@gmail.com', ticketType: 'VIP', quantity: 2, amount: 50000, paymentMethod: 'MTN MoMo', status: 'failed', date: '2024-01-20T10:20:00' },
  { id: '6', orderId: 'TK-2024-006', event: 'Exposition Art Moderne', buyer: 'Bamba Aicha', email: 'aicha.b@gmail.com', ticketType: 'Standard', quantity: 2, amount: 10000, paymentMethod: 'Wave', status: 'success', date: '2024-01-19T16:45:00' },
  { id: '7', orderId: 'TK-2024-007', event: 'Match ASEC vs Africa', buyer: 'Touré Amadou', email: 'amadou.t@gmail.com', ticketType: 'VIP', quantity: 2, amount: 40000, paymentMethod: 'Orange Money', status: 'success', date: '2024-01-19T15:30:00' },
  { id: '8', orderId: 'TK-2024-008', event: 'Soirée Jazz Club', buyer: 'Yao Patricia', email: 'patricia.y@gmail.com', ticketType: 'Standard', quantity: 2, amount: 30000, paymentMethod: 'MTN MoMo', status: 'pending', date: '2024-01-19T14:00:00' },
];

export default function AdminSalesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredSales = mockSales.filter(sale => {
    const matchesSearch = sale.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.event.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredSales.filter(s => s.status === 'success').reduce((sum, s) => sum + s.amount, 0);
  const totalOrders = filteredSales.length;
  const successfulOrders = filteredSales.filter(s => s.status === 'success').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Ventes de billets</h1>
          <p className="text-muted-foreground">
            Suivez toutes les transactions et ventes de billets.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total commandes</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Réussies</p>
          <p className="text-2xl font-bold text-success">{successfulOrders}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">En attente</p>
          <p className="text-2xl font-bold text-pending">{filteredSales.filter(s => s.status === 'pending').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Revenus</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-widget animate-fade-in">
        <div className="dashboard-widget-content">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par commande, acheteur, événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="success">Réussi</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="dashboard-widget animate-fade-in">
        <div className="dashboard-widget-header">
          <CardTitle className="text-lg">Historique des ventes</CardTitle>
          <span className="text-sm text-muted-foreground">{filteredSales.length} transaction(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Commande
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th>Événement</th>
                <th>Acheteur</th>
                <th>Billets</th>
                <th>Montant</th>
                <th>Paiement</th>
                <th>Statut</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={9}>
                      <div className="h-12 bg-muted/50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Calendar className="h-10 w-10 text-muted-foreground/50" />
                      <p className="text-muted-foreground">Aucune vente trouvée</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="group">
                    <td>
                      <span className="font-mono text-sm font-medium">{sale.orderId}</span>
                    </td>
                    <td>
                      <span className="text-sm">{sale.event}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-sm">{sale.buyer}</p>
                        <p className="text-xs text-muted-foreground">{sale.email}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="text-sm">{sale.quantity}x {sale.ticketType}</p>
                      </div>
                    </td>
                    <td className="font-semibold">{formatCurrency(sale.amount)}</td>
                    <td>
                      <span className="text-sm">{sale.paymentMethod}</span>
                    </td>
                    <td>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'gap-1',
                          sale.status === 'success' && 'bg-success/10 text-success border-success/20',
                          sale.status === 'pending' && 'bg-pending/10 text-pending border-pending/20',
                          sale.status === 'failed' && 'bg-destructive/10 text-destructive border-destructive/20'
                        )}
                      >
                        {sale.status === 'success' && <CheckCircle2 className="h-3 w-3" />}
                        {sale.status === 'pending' && <Clock className="h-3 w-3" />}
                        {sale.status === 'failed' && <XCircle className="h-3 w-3" />}
                        {sale.status === 'success' ? 'Payé' : sale.status === 'pending' ? 'En attente' : 'Échoué'}
                      </Badge>
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {formatDate(sale.date)}
                    </td>
                    <td className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
