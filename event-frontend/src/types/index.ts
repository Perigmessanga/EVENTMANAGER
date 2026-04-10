// User & Auth Types
export type UserRole = 'buyer' | 'organizer' | 'admin';

export interface User {
  id: string | number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  profile_picture?: string;
  bio?: string;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Event Types
export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  available: number;
  max_per_order: number;
}

export interface Event {
  image_url: string;
  id: number;
  title: string;
  description: string;
  // Legacy / display fields (frontend)
  shortDescription?: string;
  image_Url?: string;
  date?: string; // ISO string or human date
  time?: string;
  endDate?: string;
  venue?: string;
  address?: string;
  city?: string;
  category?: string;
  // Backend fields (API)
  image?: string | null;
  location?: string;
  start_date?: string;
  end_date?: string;
  ticket_price?: string | number;
  capacity?: number;
  organizer?: {
    id: number | string;
    username?: string;
    email?: string;
  
  };
  // Ticket types (optional)
  ticketTypes?: TicketType[];
  isFeatured?: boolean;
  isPublished?: boolean;
  status?: string;
  createdAt?: string;
  
}

// Cart Types
export interface CartItem {
  ticketTypeId: string;
  ticketTypeName: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  currency: string;
}

// Payment Types
// Payment API

export type PaymentProvider = 'orange_money' | 'mtn_momo' | 'wave';
export type PaymentStatus = 'idle' | 'initiating' | 'pending' | 'processing' | 'success' | 'failed';

export interface PaymentDetails {
  provider: PaymentProvider;
  phoneNumber: string;
  amount: number;
  currency: string;
  transactionId?: string;
  reference?: string;
}

export interface PaymentState {
  status: PaymentStatus;
  details: PaymentDetails | null;
  error: string | null;
  transactionId: string | null;
  lastAttemptTime: number | null;
}

// Ticket Types
export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  ticketType: string;
  ticketHolder: string;
  qrCode: string;
  status: 'valid' | 'used' | 'cancelled' | 'expired';
  purchaseDate: string;
  price: number;
  currency: string;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  eventId: string;
  tickets: Ticket[];
  totalAmount: number;
  currency: string;
  paymentProvider: PaymentProvider;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
}

// Admin/Dashboard Types
export interface DashboardStats {
  totalRevenue: number;
  ticketsSold: number;
  activeEvents: number;
  pendingPayments: number;
  revenueChange: number;
  salesChange: number;
}

export interface SalesData {
  date: string;
  sales: number;
  revenue: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// Auth Response Types
export interface LoginResponse {
  message: string;
  user: User;
  access: string;
  refresh: string;
}

export type RegisterResponse = LoginResponse;

export const PAYMENT_ENDPOINTS = {
  create: '/payments/initiate/',
  detail: (id: string) => `/payments/${id}/`,
  status: (id: string) => `/payments/${id}/status/`,
  confirm: (id: string) => `/payments/${id}/confirm/`,
} as const;

export interface EventPublicResponse {
  event: Event;
  tickets_available: number;
  can_book: boolean;
}
