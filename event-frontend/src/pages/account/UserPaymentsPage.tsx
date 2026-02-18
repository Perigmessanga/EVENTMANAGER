import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

interface Payment {
  id: string;
  orderId: string;
  event: string;
  amount: number;
  method: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
  tickets: number;
}

const mockPayments: Payment[] = [
  { id: '1', orderId: 'TK-2024-001', event: 'Concert Magic System', amount: 50000, method: 'Orange Money', status: 'success', date: '2024-01-20T14:30:00', tickets: 2 },
  { id: '2', orderId: 'TK-2024-002', event: 'Match ASEC vs Africa', amount: 30000, method: 'MTN MoMo', status: 'success', date: '2024-01-15T10:15:00', tickets: 2 },
  { id: '3', orderId: 'TK-2024-003', event: 'Festival des Grillades', amount: 10000, method: 'Wave', status: 'pending', date: '2024-01-10T16:45:00', tickets: 1 },
  { id: '4', orderId: 'TK-2024-004', event: 'Spectacle Gohou Michel', amount: 40000, method: 'Orange Money', status: 'success', date: '2024-01-05T09:30:00', tickets: 2 },
  { id: '5', orderId: 'TK-2024-005', event: 'Soirée Jazz Club', amount: 15000, method: 'MTN MoMo', status: 'failed', date: '2024-01-01T20:00:00', tickets: 1 },
];

export default function UserPaymentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSpent = mockPayments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-3xl mb-1">Historique des paiements</h1>
        <p className="text-muted-foreground">
          Consultez l'historique de vos transactions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total dépensé</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Transactions</p>
          <p className="text-2xl font-bold">{mockPayments.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Réussies</p>
          <p className="text-2xl font-bold text-success">{mockPayments.filter(p => p.status === 'success').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">En attente</p>
          <p className="text-2xl font-bold text-pending">{mockPayments.filter(p => p.status === 'pending').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-widget animate-fade-in">
        <div className="dashboard-widget-content">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par événement ou commande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
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
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="dashboard-widget animate-fade-in">
        <div className="dashboard-widget-header">
          <CardTitle className="text-lg">Transactions</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4">
                <div className="h-16 bg-muted/50 rounded animate-pulse" />
              </div>
            ))
          ) : filteredPayments.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune transaction trouvée</p>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div key={payment.id} className="p-4 flex items-center gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                  payment.status === 'success' && 'bg-success/10',
                  payment.status === 'pending' && 'bg-pending/10',
                  payment.status === 'failed' && 'bg-destructive/10'
                )}>
                  {payment.status === 'success' && <CheckCircle2 className="h-6 w-6 text-success" />}
                  {payment.status === 'pending' && <Clock className="h-6 w-6 text-pending" />}
                  {payment.status === 'failed' && <XCircle className="h-6 w-6 text-destructive" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{payment.event}</h3>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {payment.tickets} billet{payment.tickets > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono">{payment.orderId}</span>
                    <span>•</span>
                    <span>{payment.method}</span>
                    <span>•</span>
                    <span>{formatDate(payment.date)}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs',
                      payment.status === 'success' && 'bg-success/10 text-success',
                      payment.status === 'pending' && 'bg-pending/10 text-pending',
                      payment.status === 'failed' && 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {payment.status === 'success' ? 'Payé' : 
                     payment.status === 'pending' ? 'En attente' : 'Échoué'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
