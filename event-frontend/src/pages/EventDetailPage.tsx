import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  Heart, 
  ArrowLeft, 
  Users, 
  Ticket,
  CheckCircle,
  Info,
  ChevronRight
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { TicketSelector } from '@/components/events/TicketSelector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { getEventById } from '@/data/events';
import { formatDate, formatCurrency, getRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const event = id ? getEventById(id) : undefined;

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="relative h-[45vh] md:h-[55vh] skeleton-shimmer" />
        <div className="container mx-auto px-4 -mt-24 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-3/4" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24" />
                <Skeleton className="h-12" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">😢</span>
            </div>
            <h1 className="font-display font-bold text-2xl mb-4">Événement non trouvé</h1>
            <p className="text-muted-foreground mb-6">
              Cet événement n'existe pas ou a été supprimé.
            </p>
            <Link to="/events">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voir tous les événements
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const lowestPrice = Math.min(...event.ticketTypes.map(t => t.price));
  const totalAvailable = event.ticketTypes.reduce((sum, t) => sum + t.available, 0);
  const relativeTime = getRelativeTime(event.date);

  const handleContinue = () => {
    navigate('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: `Découvrez ${event.title} sur Tikerama`,
        url: window.location.href,
      });
    }
  };

  return (
    <Layout showFooter={false}>
      {/* Hero Image */}
      <div className="relative h-[45vh] md:h-[55vh] bg-muted overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover animate-scale-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 shadow-lg glass-strong"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="shadow-lg glass-strong"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className={cn(
              'shadow-lg glass-strong transition-colors',
              isFavorite && 'text-destructive'
            )}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
          </Button>
        </div>

        {/* Breadcrumb */}
        <div className="absolute bottom-28 left-4 md:left-8">
          <nav className="flex items-center gap-2 text-sm text-white/80">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/events" className="hover:text-white transition-colors">Événements</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white truncate max-w-[200px]">{event.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up">
            {/* Event Info Card */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                  {event.category}
                </Badge>
                {event.isFeatured && (
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                    ⭐ À la une
                  </Badge>
                )}
                {relativeTime === "Aujourd'hui" && (
                  <Badge variant="destructive" className="animate-pulse-slow">
                    🔴 Aujourd'hui!
                  </Badge>
                )}
              </div>

              <h1 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl mb-6 leading-tight">
                {event.title}
              </h1>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="p-2.5 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{formatDate(event.date)}</p>
                    {event.endDate && (
                      <p className="text-sm text-muted-foreground">
                        jusqu'au {formatDate(event.endDate, { day: 'numeric', month: 'long' })}
                      </p>
                    )}
                    <p className="text-sm text-primary font-medium mt-1">{relativeTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="p-2.5 bg-secondary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.time}</p>
                    <p className="text-sm text-muted-foreground">Heure locale (GMT)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors sm:col-span-2">
                  <div className="p-2.5 bg-success/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.venue}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.address}, {event.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-center justify-between gap-4 mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-teal flex items-center justify-center shadow-md">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Organisé par</p>
                    <p className="font-semibold">{event.organizerName}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Contacter
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-card">
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                À propos de l'événement
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                {event.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Event Features */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
              <h3 className="font-semibold mb-4">Ce qui est inclus</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Accès à l\'événement',
                  'Billet électronique avec QR code',
                  'Place assise garantie',
                  'Service client disponible',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4 animate-fade-in">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-muted-foreground text-sm">À partir de</span>
                  <span className="font-display font-bold text-3xl text-primary">
                    {formatCurrency(lowestPrice)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Ticket className="h-4 w-4" />
                  <span>{totalAvailable} places disponibles</span>
                </div>

                <TicketSelector event={event} onContinue={handleContinue} />
              </div>

              {/* Trust Badges */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                {[
                  { icon: CheckCircle, text: 'Paiement 100% sécurisé' },
                  { icon: Ticket, text: 'Billet envoyé instantanément' },
                  { icon: Users, text: 'Support disponible 24h/24' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="h-4 w-4 text-success" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
