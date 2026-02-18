import { Link } from 'react-router-dom';
import { Ticket, Calendar, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { TicketDisplay } from '@/components/tickets/TicketDisplay';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { mockTickets } from '@/data/tickets';

export default function MyTicketsPage() {
  const { isAuthenticated, user } = useAuthStore();

  // For demo, show mock tickets
  const tickets = mockTickets;

  const validTickets = tickets.filter(t => t.status === 'valid');
  const pastTickets = tickets.filter(t => t.status !== 'valid');

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <Ticket className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-4">Connectez-vous</h1>
          <p className="text-muted-foreground mb-6">
            Connectez-vous pour voir vos billets
          </p>
          <Link to="/login">
            <Button size="lg">Se connecter</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl mb-2">Mes Billets</h1>
          <p className="text-muted-foreground">
            Bonjour {user?.firstName}, voici vos billets
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
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
          <div className="space-y-10">
            {/* Upcoming Tickets */}
            {validTickets.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h2 className="font-display font-bold text-xl">À venir</h2>
                  <span className="bg-primary/10 text-primary text-sm font-medium px-2 py-0.5 rounded-full">
                    {validTickets.length}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {validTickets.map(ticket => (
                    <TicketDisplay key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </section>
            )}

            {/* Past Tickets */}
            {pastTickets.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-xl mb-6 text-muted-foreground">
                  Événements passés
                </h2>
                <div className="space-y-3">
                  {pastTickets.map(ticket => (
                    <TicketDisplay key={ticket.id} ticket={ticket} variant="compact" />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
