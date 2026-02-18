import type { Ticket } from '@/types';

// Mock tickets for demo
export const mockTickets: Ticket[] = [
  {
    id: 'ticket-001',
    eventId: 'evt-001',
    eventTitle: 'Festival des Musiques Urbaines d\'Anoumabo',
    eventDate: '2026-04-15',
    eventTime: '18:00',
    venue: 'Village Ki-Yi M\'Bock',
    ticketType: 'Pass 4 Jours',
    ticketHolder: 'Kouamé Adjoua',
    qrCode: 'TKR-FEMUA-001-XYZ789',
    status: 'valid',
    purchaseDate: '2026-01-28T14:30:00Z',
    price: 15000,
    currency: 'XOF',
  },
  {
    id: 'ticket-002',
    eventId: 'evt-002',
    eventTitle: 'Abidjan Comedy Club',
    eventDate: '2026-02-20',
    eventTime: '20:30',
    venue: 'Palais de la Culture',
    ticketType: 'Premium',
    ticketHolder: 'Kouamé Adjoua',
    qrCode: 'TKR-COMEDY-002-ABC123',
    status: 'valid',
    purchaseDate: '2026-01-25T10:00:00Z',
    price: 15000,
    currency: 'XOF',
  },
];

export const getTicketsByUserId = (_userId: string): Ticket[] => {
  return mockTickets;
};

export const getTicketById = (id: string): Ticket | undefined => {
  return mockTickets.find(ticket => ticket.id === id);
};
