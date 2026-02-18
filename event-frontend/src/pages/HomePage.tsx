import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Search, ArrowRight, Calendar, MapPin, Sparkles, Star, Zap, Shield, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockEvents, getFeaturedEvents } from '@/data/events';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'Tous', emoji: '🎉' },
  { id: 'Musique', label: 'Musique', emoji: '🎵' },
  { id: 'Sport', label: 'Sport', emoji: '⚽' },
  { id: 'Culture', label: 'Culture', emoji: '🎭' },
  { id: 'Humour', label: 'Humour', emoji: '😂' },
  { id: 'Conférence', label: 'Conférence', emoji: '🎤' },
];

const features = [
  {
    icon: Zap,
    title: 'Paiement instantané',
    description: 'Mobile Money en 30 secondes',
    color: 'primary',
  },
  {
    icon: Shield,
    title: '100% Sécurisé',
    description: 'Transactions cryptées',
    color: 'secondary',
  },
  {
    icon: Star,
    title: 'Expérience premium',
    description: 'Support 24h/24',
    color: 'success',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const featuredEvents = getFeaturedEvents();
  const upcomingEvents = mockEvents
    .filter(e => e.isPublished)
    .filter(e => selectedCategory === 'all' || e.category === selectedCategory)
    .slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryChange = (catId: string) => {
    setIsLoading(true);
    setSelectedCategory(catId);
    // Simulate loading for smooth transition
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-16 md:py-24 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-8 animate-fade-in shadow-sm border border-primary/20">
              <Sparkles className="h-4 w-4" />
              La billetterie #1 en Côte d'Ivoire
              <ChevronRight className="h-4 w-4" />
            </div>
            
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground mb-6 animate-fade-in-up tracking-tight">
              Vos événements préférés,{' '}
              <span className="text-gradient">un clic suffit</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in leading-relaxed">
              Concerts, festivals, sport, spectacles... Réservez et payez avec Mobile Money en toute simplicité.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto animate-fade-in-up">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un événement, artiste, lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-card border-border/50 shadow-md text-base input-premium rounded-xl"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 shadow-md hover:shadow-glow transition-all rounded-xl font-semibold">
                Rechercher
              </Button>
            </form>

            {/* Quick Stats */}
            <div className="flex justify-center gap-12 mt-14 animate-fade-in">
              {[
                { value: '50+', label: 'Événements' },
                { value: '10K+', label: 'Billets vendus' },
                { value: '100%', label: 'Sécurisé' },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display font-bold text-3xl md:text-4xl text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Row */}
      <section className="py-8 border-b border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 md:gap-0 md:divide-x divide-border">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="flex items-center gap-4 px-6 py-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  feature.color === 'primary' && 'bg-primary/10 text-primary',
                  feature.color === 'secondary' && 'bg-secondary/10 text-secondary',
                  feature.color === 'success' && 'bg-success/10 text-success',
                )}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
              <div>
                <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-primary" />
                  À NE PAS MANQUER
                </p>
                <h2 className="font-display font-bold text-3xl md:text-4xl">
                  Événements vedettes
                </h2>
              </div>
              <Link to="/events">
                <Button variant="outline" className="gap-2 group">
                  Voir tout
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredEvents.slice(0, 2).map((event, index) => (
                <div 
                  key={event.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <EventCard event={event} variant="featured" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter + Events */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Événements à venir
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Découvrez les meilleurs événements près de chez vous
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-10 -mx-4 px-4 scrollbar-hide justify-start md:justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  'category-pill flex items-center gap-2',
                  selectedCategory === cat.id
                    ? 'category-pill-active'
                    : 'category-pill-inactive'
                )}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))
            ) : (
              upcomingEvents.map((event, index) => (
                <div 
                  key={event.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <EventCard event={event} />
                </div>
              ))
            )}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link to="/events">
              <Button size="lg" variant="outline" className="gap-2 group px-8">
                Voir tous les événements
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-secondary mb-2 uppercase tracking-wide">Simple & Rapide</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Réservez vos billets en 3 étapes simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: Search,
                step: '01',
                title: 'Trouvez',
                description: 'Parcourez notre sélection d\'événements et choisissez celui qui vous plaît',
                gradient: 'gradient-primary',
              },
              {
                icon: Calendar,
                step: '02',
                title: 'Réservez',
                description: 'Sélectionnez vos billets et payez en toute sécurité avec Mobile Money',
                gradient: 'gradient-teal',
              },
              {
                icon: MapPin,
                step: '03',
                title: 'Profitez',
                description: 'Recevez votre billet avec QR code et présentez-le à l\'entrée',
                gradient: 'bg-success',
              },
            ].map((item, index) => (
              <div 
                key={item.step} 
                className="relative text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-border via-border to-transparent" />
                )}
                
                <div className="relative inline-block mb-6">
                  <div className={cn(
                    'w-24 h-24 rounded-3xl flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-105',
                    item.gradient
                  )}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-border text-sm font-bold flex items-center justify-center shadow-md">
                    {item.step}
                  </span>
                </div>
                
                <h3 className="font-display font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Money Section */}
      <section className="py-16 md:py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Paiement 100% sécurisé
            </div>
            
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Payez avec Mobile Money
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              Nous acceptons tous les principaux opérateurs Mobile Money en Côte d'Ivoire
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              {[
                { name: 'Orange Money', class: 'momo-orange', letter: 'O' },
                { name: 'MTN MoMo', class: 'momo-mtn', letter: 'M' },
                { name: 'Wave', class: 'momo-wave', letter: 'W' },
              ].map((provider) => (
                <div 
                  key={provider.name}
                  className={cn(
                    'flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg hover-lift cursor-default',
                    provider.class
                  )}
                >
                  <span className="text-2xl font-display font-bold">{provider.letter}</span>
                  <span className="font-semibold">{provider.name}</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              Transactions cryptées • Confirmation instantanée • Support 24h/24
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-subtle" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Prêt à vivre des moments inoubliables ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Rejoignez des milliers d'Ivoiriens qui font confiance à Tikerama pour leurs événements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <Button size="lg" className="px-8 shadow-md hover:shadow-glow transition-shadow gap-2">
                  Découvrir les événements
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="px-8">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
