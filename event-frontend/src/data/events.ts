import type { Event } from '@/types';

export const getEventById = (id: string) => {
  return mockEvents.find(event => event.id === parseInt(id));
};

// Mock events data for Côte d'Ivoire
export const mockEvents: Event[] = [
  {
    id: 25,
    title: "Festival des Musiques Urbaines d'Anoumabo",
    shortDescription: "Le plus grand festival de musique urbaine en Côte d'Ivoire",
    description: `Le FEMUA revient pour sa 15ème édition avec une programmation exceptionnelle réunissant les plus grandes stars de la musique africaine et internationale.

Venez vibrer au son du coupé-décalé, du zouglou, de l'afrobeat et bien d'autres genres musicaux dans une ambiance festive et conviviale.

Au programme : concerts live, DJ sets, espaces restauration, village artisanal et animations pour toute la famille.`,
    image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    date: '2026-04-15',
    end_date: '2026-04-18',
    time: '18:00',
    venue: "Village Ki-Yi M'Bock",
    address: 'Anoumabo, Marcory',
    city: 'Abidjan',
    category: 'Musique',
    organizer: { id: 'org-001', username: 'Magic System Productions' },
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
        max_per_order: 5,
      },
      {
        id: 'tkt-001-2',
        name: 'Pass 4 Jours',
        description: 'Accès complet au festival',
        price: 15000,
        currency: 'XOF',
        available: 200,
        max_per_order: 4,
      },
      {
        id: 'tkt-001-3',
        name: 'VIP',
        description: 'Accès VIP + espace lounge + boissons',
        price: 50000,
        currency: 'XOF',
        available: 50,
        max_per_order: 2,
      },
    ],
  },
  {
    id: 26,
    title: 'Abidjan Comedy Club',
    shortDescription: "Soirée stand-up avec les meilleurs humoristes ivoiriens",
    description: `Une soirée de rires garantie avec les stars de l'humour ivoirien !

Retrouvez sur scène Adama Dahico, Gohou Michel, Digbeu Cravate et bien d'autres pour une nuit de stand-up inoubliable.

Bar et restauration sur place.`,
    image_url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    date: '2026-02-20',
    end_date: '2026-02-20',
    time: '20:30',
    venue: 'Palais de la Culture',
    address: 'Boulevard de la Paix',
    city: 'Abidjan',
    category: 'Humour',
    organizer: { id: 'org-002', username: 'Ivoire Comedy' },
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
       max_per_order: 6,
      },
      {
        id: 'tkt-002-2',
        name: 'Premium',
        description: 'Places de devant + boisson offerte',
        price: 15000,
        currency: 'XOF',
        available: 100,
       max_per_order: 4,
      },
    ],
  },
  // Continue avec evt-003 à evt-006 en appliquant les mêmes corrections :
  // - short_description
  // - image_url
  // - end_date
  // - organizer: { id, username? }
  // - ticket_types avec snake_case
];