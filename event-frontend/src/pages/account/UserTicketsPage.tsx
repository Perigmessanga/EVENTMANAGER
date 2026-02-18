import { Link } from 'react-router-dom';
import { Ticket, Calendar, ArrowRight, QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { mockTickets } from '@/data/tickets';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function UserTicketsPage() {
  const { user } = useAuthStore();
  const tickets = mockTickets;

  const validTickets = tickets.filter(t => t.status === 'valid');
  const pastTickets = tickets.filter(t => t.status !== 'valid');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-3xl mb-1">Mes Billets</h1>
        <p className="text-muted-foreground">
          Bonjour {user?.firstName}, voici vos billets pour les événements à venir.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in">
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-primary">{validTickets.length}</p>
          <p className="text-sm text-muted-foreground">À venir</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold">{pastTickets.length}</p>
          <p className="text-sm text-muted-foreground">Passés</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-success">{tickets.length}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
            <Ticket className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl mb-4">
            Aucun billet pour le moment
          </h2>
          <p className="text-muted-foreground mb-6">
            Vos billets apparaîtront ici après votre premier achat
          </p>
          <Link to="/events">
            <Button size="lg" className="gap-2">
              Découvrir les événements
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Tickets */}
          {validTickets.length > 0 && (
            <section className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="font-display font-bold text-xl">À venir</h2>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {validTickets.length}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {validTickets.map(ticket => (
                  <div 
                    key={ticket.id}
                    className="dashboard-widget group hover:border-primary/30 transition-all"
                  >
                    <div className="dashboard-widget-content">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <QrCode className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{ticket.eventTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(ticket.eventDate)} • {ticket.eventTime}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{ticket.venue}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div>
                          <Badge variant="outline">{ticket.ticketType}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                          <Button variant="default" size="sm" className="gap-1">
                            <QrCode className="h-4 w-4" />
                            Afficher
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Past Tickets */}
          {pastTickets.length > 0 && (
            <section className="animate-fade-in">
              <h2 className="font-display font-bold text-xl mb-4 text-muted-foreground">
                Événements passés
              </h2>
              <div className="space-y-3">
                {pastTickets.map(ticket => (
                  <div 
                    key={ticket.id}
                    className="p-4 rounded-xl bg-card border border-border flex items-center gap-4 opacity-60"
                  >
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Ticket className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{ticket.eventTitle}</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(ticket.eventDate)}</p>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={cn(
                        ticket.status === 'used' && 'bg-success/10 text-success',
                        ticket.status === 'expired' && 'bg-muted text-muted-foreground',
                        ticket.status === 'cancelled' && 'bg-destructive/10 text-destructive'
                      )}
                    >
                      {ticket.status === 'used' ? 'Utilisé' : 
                       ticket.status === 'expired' ? 'Expiré' : 'Annulé'}
                    </Badge>
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
