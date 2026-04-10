import { useRef } from "react";
import { Calendar, ChevronLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Search, ArrowRight, Zap, Shield, Star, ChevronRight, MapPin, Sparkles, Heart, Clock, Ticket, Users, Smile } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useEventAPI } from '@/hooks/useEventAPI';
import type { Event } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', label: 'Tous', emoji: '🎉', color: 'from-gray-400 to-gray-500' },
  { id: 'Musique', label: 'Musique', emoji: '🎵', color: 'from-blue-400 to-purple-400' },
  { id: 'Sport', label: 'Sport', emoji: '⚽', color: 'from-green-400 to-emerald-400' },
  { id: 'Culture', label: 'Culture', emoji: '🎭', color: 'from-orange-400 to-red-400' },
  { id: 'Humour', label: 'Humour', emoji: '😂', color: 'from-yellow-400 to-amber-400' },
  { id: 'Conférence', label: 'Conférence', emoji: '🎤', color: 'from-indigo-400 to-purple-400' },
];

const features = [
  {
    icon: Zap,
    title: 'Paiement instantané',
    description: 'Mobile Money en 30 secondes',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    icon: Shield,
    title: '100% Sécurisé',
    description: 'Transactions cryptées',
    color: 'from-blue-400 to-indigo-400',
  },
  {
    icon: Heart,
    title: 'Service premium',
    description: 'Support 24h/24 et 7j/7',
    color: 'from-pink-400 to-rose-400',
  },
];

const stats = [
  { value: '500+', label: 'Événements', icon: Calendar },
  { value: '50K+', label: 'Billets vendus', icon: Ticket },
  { value: '98%', label: 'Clients satisfaits', icon: Smile },
  { value: '24/7', label: 'Support disponible', icon: Clock },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const { getAll, isLoading } = useEventAPI();
  const [events, setEvents] = useState<Event[]>([]);

  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.offsetWidth;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsArray = await getAll();
      setEvents(eventsArray);
    };
    fetchEvents();
  }, [getAll]);

  const featuredEvents = events.filter(e => e.isFeatured === true);
  const upcomingEvents = events
    .filter(e => e.status && !e.isFeatured)
    .slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Animations variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section - Version corrigée avec image qui prend tout l'espace */}
      <section 
        className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/ed8615300b6a80c98b0fd390c7258211d5d48696.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Éléments décoratifs (optionnels - peuvent être supprimés si l'image est assez chargée) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-4 py-20 md:py-28 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge animé */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-white/20"
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>La billetterie #1 en Côte d'Ivoire</span>
              <ChevronRight className="h-4 w-4 text-white/60" />
            </motion.div>

            {/* Titre principal */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display font-bold text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 tracking-tight"
            >
              Vos événements préférés,{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                un clic suffit
              </span>
            </motion.h1>

            {/* Sous-titre */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Concerts, festivals, sport, spectacles... Réservez et payez avec Mobile Money en toute simplicité.
            </motion.p>

            {/* Barre de recherche */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              onSubmit={handleSearch} 
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un événement, artiste, lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 shadow-md text-base rounded-xl focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg hover:shadow-xl transition-all rounded-xl font-semibold hover:scale-105"
              >
                Rechercher
              </Button>
            </motion.form>

            {/* Statistiques */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="flex flex-wrap justify-center gap-8 mt-14"
            >
              {stats.slice(0, 3).map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <p className="font-display text-white font-bold text-3xl md:text-4xl">{stat.value}</p>
                  <p className="text-sm text-white/80 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Row - Version plus soft */}
      <section className="py-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 md:gap-0 md:divide-x divide-gray-200 dark:divide-gray-700">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-4 px-6 py-2"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 text-white shadow-lg`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10"
            >
              <div>
                <p className="text-sm font-semibold text-orange-500 mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-orange-500" />
                  À NE PAS MANQUER
                </p>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-gray-100">
                  Événements vedettes
                </h2>
              </div>
              <Link to="/events">
                <Button variant="outline" className="gap-2 group border-orange-200 hover:border-orange-300">
                  Voir tout
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredEvents.slice(0, 2).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard event={{ ...event, image_url: event.image_url || event.image || '/placeholder.jpg' }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter + Events */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-gray-900 dark:text-gray-100">
              Événements à venir
            </h2>
            <Link to="/events">
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg hover:shadow-xl transition-all gap-2 hover:scale-105"
              >
                Découvrir les événements
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Category Pills améliorés */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-2 overflow-x-auto pb-4 mb-10 -mx-4 px-4 scrollbar-hide justify-start md:justify-center"
          >
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  'category-pill flex items-center gap-2 px-4 py-2 rounded-full transition-all',
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Events Carousel avec design amélioré */}
          <div className="relative">
            <button
              onClick={() => scrollCarousel("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-full p-3 hover:scale-110 transition hidden md:flex hover:shadow-xl"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
            >
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="snap-start flex-shrink-0 w-[85%] sm:w-[48%] lg:w-[32%]"
                  >
                    <EventCardSkeleton />
                  </div>
                ))
              ) : (
                upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="snap-start flex-shrink-0 w-[85%] sm:w-[48%] lg:w-[32%]"
                  >
                    <EventCard
                      event={{
                        ...event,
                        image_url: event.image_url || "/placeholder.jpg",
                      }}
                    />
                  </motion.div>
                ))
              )}
            </div>

            <button
              onClick={() => scrollCarousel("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-full p-3 hover:scale-110 transition hidden md:flex hover:shadow-xl"
            >
              <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* View All Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/events">
              <Button size="lg" variant="outline" className="gap-2 group px-8 border-orange-200 hover:border-orange-300">
                Voir tous les événements
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Comment ça marche - Version plus soft */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold text-orange-500 mb-2 uppercase tracking-wide">
              Simple & Rapide
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-gray-900 dark:text-gray-100">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              Réservez vos billets en 3 étapes simples
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              { icon: Search, step: '01', title: 'Trouvez', description: "Parcourez notre sélection d'événements et choisissez celui qui vous plaît", gradient: 'from-yellow-400 to-orange-400' },
              { icon: Calendar, step: '02', title: 'Réservez', description: 'Sélectionnez vos billets et payez en toute sécurité avec Mobile Money', gradient: 'from-blue-400 to-indigo-400' },
              { icon: MapPin, step: '03', title: 'Profitez', description: "Recevez votre billet avec QR code et présentez-le à l'entrée", gradient: 'from-green-400 to-emerald-400' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center group"
              >
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600" />
                )}
                <div className="relative inline-block mb-6">
                  <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-sm font-bold flex items-center justify-center shadow-md text-gray-700 dark:text-gray-300">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl mb-3 text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-xs mx-auto">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AWDPAY Section - Version plus soft */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Paiement 100% sécurisé
            </div>

            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-gray-900 dark:text-gray-100">
              Payez avec <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">AWDPAY</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-lg mx-auto">
              Nous acceptons de payer par AWDPAY
            </p>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex justify-center gap-4 flex-wrap"
            >
              <div className="flex items-center gap-3 px-8 py-5 rounded-2xl shadow-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white cursor-default">
                <Zap className="h-6 w-6" />
                <span className="font-bold text-xl">AWDPAY</span>
              </div>
            </motion.div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
              Transactions cryptées • Confirmation instantanée • Support 24h/24
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Version plus soft */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-amber-400/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-gray-900 dark:text-gray-100">
              Prêt à vivre des moments inoubliables ?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
              Rejoignez des milliers d'Ivoiriens qui font confiance à AWARD pour leurs événements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="px-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg hover:shadow-xl transition-all gap-2"
                  >
                    Découvrir les événements
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="px-8 border-orange-200 hover:border-orange-300">
                    Créer un compte
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}