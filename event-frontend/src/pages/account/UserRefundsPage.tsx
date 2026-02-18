import { useState } from 'react';
import { 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Plus,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

interface RefundRequest {
  id: string;
  orderId: string;
  event: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  responseDate?: string;
}

const mockRefunds: RefundRequest[] = [
  { id: '1', orderId: 'TK-2024-001', event: 'Concert Magic System', amount: 50000, reason: 'Événement annulé', status: 'approved', requestDate: '2024-01-18T10:00:00', responseDate: '2024-01-19T14:00:00' },
  { id: '2', orderId: 'TK-2024-003', event: 'Festival des Grillades', amount: 10000, reason: 'Impossibilité de me rendre à l\'événement', status: 'pending', requestDate: '2024-01-20T09:30:00' },
];

export default function UserRefundsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingRefunds = mockRefunds.filter(r => r.status === 'pending');
  const completedRefunds = mockRefunds.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Remboursements</h1>
          <p className="text-muted-foreground">
            Gérez vos demandes de remboursement.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Demande de remboursement</DialogTitle>
              <DialogDescription>
                Sélectionnez la commande et expliquez la raison de votre demande.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="order">Commande à rembourser *</Label>
                <Select>
                  <SelectTrigger id="order" className="mt-2">
                    <SelectValue placeholder="Sélectionner une commande" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TK-2024-002">TK-2024-002 - Match ASEC vs Africa</SelectItem>
                    <SelectItem value="TK-2024-004">TK-2024-004 - Spectacle Gohou Michel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">Raison du remboursement *</Label>
                <Select>
                  <SelectTrigger id="reason" className="mt-2">
                    <SelectValue placeholder="Sélectionner une raison" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cancelled">Événement annulé</SelectItem>
                    <SelectItem value="postponed">Événement reporté</SelectItem>
                    <SelectItem value="unavailable">Je ne peux plus y assister</SelectItem>
                    <SelectItem value="error">Erreur de commande</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="details">Détails (optionnel)</Label>
                <Textarea 
                  id="details" 
                  placeholder="Expliquez votre demande en détail..."
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Soumettre
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in">
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-pending">{pendingRefunds.length}</p>
          <p className="text-sm text-muted-foreground">En cours</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-success">{mockRefunds.filter(r => r.status === 'approved').length}</p>
          <p className="text-sm text-muted-foreground">Approuvés</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-destructive">{mockRefunds.filter(r => r.status === 'rejected').length}</p>
          <p className="text-sm text-muted-foreground">Refusés</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-info/10 border border-info/20 animate-fade-in">
        <div className="flex gap-3">
          <FileText className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-info mb-1">Politique de remboursement</p>
            <p className="text-sm text-muted-foreground">
              Les demandes de remboursement sont traitées sous 48-72h ouvrées. 
              Les remboursements pour annulation d'événement sont automatiquement approuvés. 
              Pour les autres cas, notre équipe étudiera votre demande.
            </p>
          </div>
        </div>
      </div>

      {mockRefunds.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
            <RefreshCw className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl mb-4">
            Aucune demande de remboursement
          </h2>
          <p className="text-muted-foreground mb-6">
            Vos demandes de remboursement apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Refunds */}
          {pendingRefunds.length > 0 && (
            <section className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-pending" />
                <h2 className="font-display font-bold text-lg">En cours de traitement</h2>
              </div>
              <div className="space-y-3">
                {pendingRefunds.map(refund => (
                  <div 
                    key={refund.id}
                    className="dashboard-widget"
                  >
                    <div className="dashboard-widget-content">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{refund.event}</h3>
                          <p className="text-sm text-muted-foreground">
                            Commande: {refund.orderId} • Demandé le {formatDate(refund.requestDate)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-pending/10 text-pending gap-1">
                          <Clock className="h-3 w-3" />
                          En attente
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{refund.reason}</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(refund.amount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed Refunds */}
          {completedRefunds.length > 0 && (
            <section className="animate-fade-in">
              <h2 className="font-display font-bold text-lg mb-4 text-muted-foreground">Historique</h2>
              <div className="space-y-3">
                {completedRefunds.map(refund => (
                  <div 
                    key={refund.id}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        refund.status === 'approved' ? 'bg-success/10' : 'bg-destructive/10'
                      )}>
                        {refund.status === 'approved' ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{refund.event}</h3>
                        <p className="text-sm text-muted-foreground">
                          {refund.status === 'approved' ? 'Remboursé' : 'Refusé'} le {formatDate(refund.responseDate!)}
                        </p>
                      </div>
                      <span className="font-semibold">{formatCurrency(refund.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
