import type { Event } from '@/types';

// Mock events data for Côte d'Ivoire
export const mockEvents: Event[] = [
  {
    id: 'evt-001',
    title: 'Festival des Musiques Urbaines d\'Anoumabo',
    shortDescription: 'Le plus grand festival de musique urbaine en Côte d\'Ivoire',
    description: `Le FEMUA revient pour sa 15ème édition avec une programmation exceptionnelle réunissant les plus grandes stars de la musique africaine et internationale.

Venez vibrer au son du coupé-décalé, du zouglou, de l'afrobeat et bien d'autres genres musicaux dans une ambiance festive et conviviale.

Au programme : concerts live, DJ sets, espaces restauration, village artisanal et animations pour toute la famille.`,
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    date: '2026-04-15',
    time: '18:00',
    endDate: '2026-04-18',
    venue: 'Village Ki-Yi M\'Bock',
    address: 'Anoumabo, Marcory',
    city: 'Abidjan',
    category: 'Musique',
    organizerId: 'org-001',
    organizerName: 'Magic System Productions',
    isFeatured: true,
    isPublished: true,
    createdAt: '2025-12-01T10:00:00Z',
    ticketTypes: [
      {
        id: 'tkt-001-1',
        name: 'Pass Journée',
        description: 'Accès 1 jour au festival',
        price: 5000,
        currency: 'XOF',
        available: 500,
        maxPerOrder: 5,
      },
      {
        id: 'tkt-001-2',
        name: 'Pass 4 Jours',
        description: 'Accès complet au festival',
        price: 15000,
        currency: 'XOF',
        available: 200,
        maxPerOrder: 4,
      },
      {
        id: 'tkt-001-3',
        name: 'VIP',
        description: 'Accès VIP + espace lounge + boissons',
        price: 50000,
        currency: 'XOF',
        available: 50,
        maxPerOrder: 2,
      },
    ],
  },
  {
    id: 'evt-002',
    title: 'Abidjan Comedy Club',
    shortDescription: 'Soirée stand-up avec les meilleurs humoristes ivoiriens',
    description: `Une soirée de rires garantie avec les stars de l'humour ivoirien !

Retrouvez sur scène Adama Dahico, Gohou Michel, Digbeu Cravate et bien d'autres pour une nuit de stand-up inoubliable.

Bar et restauration sur place.`,
    imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    date: '2026-02-20',
    time: '20:30',
    venue: 'Palais de la Culture',
    address: 'Boulevard de la Paix',
    city: 'Abidjan',
    category: 'Humour',
    organizerId: 'org-002',
    organizerName: 'Ivoire Comedy',
    isFeatured: true,
    isPublished: true,
    createdAt: '2025-12-10T14:00:00Z',
    ticketTypes: [
      {
        id: 'tkt-002-1',
        name: 'Standard',
        description: 'Place assise en salle',
        price: 7500,
        currency: 'XOF',
        available: 300,
        maxPerOrder: 6,
      },
      {
        id: 'tkt-002-2',
        name: 'Premium',
        description: 'Places de devant + boisson offerte',
        price: 15000,
        currency: 'XOF',
        available: 100,
        maxPerOrder: 4,
      },
    ],
  },
  {
    id: 'evt-003',
    title: 'Marathon d\'Abidjan 2026',
    shortDescription: 'Course internationale à travers la perle des lagunes',
    description: `La 7ème édition du Marathon International d'Abidjan vous attend !

Parcours de 42km à travers les plus beaux quartiers d'Abidjan : Plateau, Cocody, Marcory, et arrivée au Stade Félix Houphouët-Boigny.

Catégories : Marathon (42km), Semi-marathon (21km), Course familiale (5km)

Kit coureur inclus : dossard, t-shirt, médaille finisher.`,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    date: '2026-03-08',
    time: '06:00',
    venue: 'Stade FHB',
    address: 'Plateau',
    city: 'Abidjan',
    category: 'Sport',
    organizerId: 'org-003',
    organizerName: 'Fédération Ivoirienne d\'Athlétisme',
    isFeatured: true,
    isPublished: true,
    createdAt: '2025-11-15T09:00:00Z',
    ticketTypes: [
      {
        id: 'tkt-003-1',
        name: 'Course Familiale (5km)',
        description: 'Inscription course 5km',
        price: 5000,
        currency: 'XOF',
        available: 1000,
        maxPerOrder: 10,
      },
      {
        id: 'tkt-003-2',
        name: 'Semi-Marathon (21km)',
        description: 'Inscription semi-marathon',
        price: 15000,
        currency: 'XOF',
        available: 500,
        maxPerOrder: 5,
      },
      {
        id: 'tkt-003-3',
        name: 'Marathon (42km)',
        description: 'Inscription marathon complet',
        price: 25000,
        currency: 'XOF',
        available: 300,
        maxPerOrder: 3,
      },
    ],
  },
  {
    id: 'evt-004',
    title: 'AfroBeats Night',
    shortDescription: 'La plus grande soirée afrobeats de la capitale',
    description: `Vivez une nuit électrique au son des hits afrobeats du moment !

Line-up surprise avec des artistes internationaux.

Dress code : Élégant & Branché
Ouverture des portes : 22h`,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    date: '2026-02-14',
    time: '22:00',
    venue: 'Sofitel Abidjan Hôtel Ivoire',
    address: 'Boulevard Hassan II, Cocody',
    city: 'Abidjan',
    category: 'Musique',
    organizerId: 'org-004',
    organizerName: 'AfroNight Events',
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-01-05T16:00:00Z',
    ticketTypes: [
      {
        id: 'tkt-004-1',
        name: 'Early Bird',
        description: 'Entrée simple - tarif réduit',
        price: 10000,
        currency: 'XOF',
        available: 100,
        maxPerOrder: 4,
      },
      {
        id: 'tkt-004-2',
        name: 'Regular',
        description: 'Entrée simple',
        price: 15000,
        currency: 'XOF',
        available: 400,
        maxPerOrder: 6,
      },
      {
        id: 'tkt-004-3',
        name: 'Table VIP (6 pers.)',
        description: 'Table réservée + 1 bouteille',
        price: 150000,
        currency: 'XOF',
        available: 20,
        maxPerOrder: 2,
      },
    ],
  },
  {
    id: 'evt-005',
    title: 'Salon de l\'Artisanat Africain',
    shortDescription: 'Découvrez le savoir-faire artisanal de toute l\'Afrique',
    description: `Plus de 200 exposants venus de 25 pays africains présentent leurs créations :

• Textile et mode africaine
• Bijoux et accessoires
• Art et sculpture
• Gastronomie traditionnelle
• Ateliers et démonstrations

Entrée gratuite pour les enfants de moins de 12 ans.`,
    imageUrl: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&q=80',
    date: '2026-03-20',
    time: '09:00',
    endDate: '2026-03-25',
    venue: 'Parc des Expositions',
    address: 'Port-Bouët',
    city: 'Abidjan',
    category: 'Culture',
    organizerId: 'org-005',
    organizerName: 'Chambre des Métiers',
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-01-10T11:00:00Z',
    ticketTypes: [
      {
        id: 'tkt-005-1',
        name: 'Entrée Journée',
        description: 'Accès 1 jour',
        price: 2000,
        currency: 'XOF',
        available: 2000,
        maxPerOrder: 10,
      },
      {
        id: 'tkt-005-2',
        name: 'Pass Semaine',
        description: 'Accès illimité 6 jours',
        price: 8000,
        currency: 'XOF',
        available: 500,
        maxPerOrder: 5,
      },
    ],
  },
  {
    id: 'evt-006',
    title: 'Conférence Tech Abidjan',
    shortDescription: 'L\'avenir de la tech africaine se construit ici',
    description: `La plus grande conférence tech de l'Afrique de l'Ouest réunit entrepreneurs, développeurs et investisseurs.

Thèmes 2026 :
• Intelligence Artificielle en Afrique
• Fintech et inclusion financière
• Startups et levées de fonds
• Coding bootcamp pour débutants

Networking lunch et cocktail inclus.`,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    date: '2026-04-05',
    time: '08:30',
    endDate: '2026-04-06',
    venue: 'Radisson Blu Abidjan',
    address: 'Boulevard de la République, Plateau',
    city: 'Abidjan',
    category: 'Conférence',
    organizerId: 'org-006',
    organizerName: 'Tech Africa Hub',
    isFeatured: true,
    isPublished: true,
    createdAt: '2026-01-15T08:00:00Z',
    ticketTypes: [
      {
        id: 'tkt-006-1',
        name: 'Pass Standard',
        description: 'Accès conférences + déjeuner',
        price: 25000,
        currency: 'XOF',
        available: 300,
        maxPerOrder: 5,
      },
      {
        id: 'tkt-006-2',
        name: 'Pass Startup',
        description: 'Tarif réduit pour startups',
        price: 15000,
        currency: 'XOF',
        available: 100,
        maxPerOrder: 3,
      },
      {
        id: 'tkt-006-3',
        name: 'Pass Business',
        description: 'Accès complet + espace networking privé',
        price: 75000,
        currency: 'XOF',
        available: 50,
        maxPerOrder: 2,
      },
    ],
  },
];

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

export const getFeaturedEvents = (): Event[] => {
  return mockEvents.filter(event => event.isFeatured && event.isPublished);
};

export const getEventsByCategory = (category: string): Event[] => {
  return mockEvents.filter(event => event.category === category && event.isPublished);
};

export const searchEvents = (query: string): Event[] => {
  const lowerQuery = query.toLowerCase();
  return mockEvents.filter(event => 
    event.isPublished && (
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.venue.toLowerCase().includes(lowerQuery) ||
      event.city.toLowerCase().includes(lowerQuery)
    )
  );
};
