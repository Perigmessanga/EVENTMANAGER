// src/config/api.ts

// API Configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Endpoints
export const ENDPOINTS = {
  auth: {
    register: '/auth/register/',
    login: '/auth/login/',
    loginPhoneOtp: '/auth/login_phone_otp/',
    requestPhoneOtp: '/auth/request_phone_otp/',
    logout: '/auth/logout/',
    refreshToken: '/auth/refresh/',
    me: '/auth/me/',
    changePassword: '/auth/change_password/',
  },

  events: {
    list: '/events/',
    featured: '/events/?featured=true',
    detail: (id: string) => `/events/${id}/`,
    create: '/events/',
    update: (id: string) => `/events/${id}/`,
    delete: (id: string) => `/events/${id}/`,
  },
  users: {
    list: '/users/',
    detail: (id: string) => `/users/${id}/`,
    me: '/users/me/',
    updateProfile: (id: string) => `/users/${id}/update_profile/`,
  },
  orders: {
    create: '/orders/',
    list: '/orders/',
    detail: (id: string) => `/orders/${id}/`,
    tickets: (orderId: string) => `/orders/${orderId}/tickets/`,
  },
  tickets: {
    list: '/tickets/',
    detail: (id: string) => `/tickets/${id}/`,
    validate: (id: string) => `/tickets/${id}/validate/`,
  },
  payments: {
    initiate: '/payments/initiate/',
    status: (id: string) => `/payments/${id}/status/`,
    confirm: (id: string) => `/payments/${id}/confirm/`,
  },
  admin: {
    dashboard: '/admin/dashboard/',
    sales: '/admin/sales/',
    events: '/admin/events/',
  },
};

// Mobile Money Providers
export const MOMO_PROVIDERS = {
  orange_money: {
    id: 'orange_money',
    name: 'Orange Money',
    color: 'hsl(25, 95%, 53%)',
    logo: '/momo/orange.svg',
    prefix: ['07', '08'],
  },
  mtn_momo: {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    color: 'hsl(48, 100%, 50%)',
    logo: '/momo/mtn.svg',
    prefix: ['05'],
  },
  wave: {
    id: 'wave',
    name: 'Wave',
    color: 'hsl(199, 89%, 48%)',
    logo: '/momo/wave.svg',
    prefix: ['01'],
  },
} as const;

// Currency config
export const CURRENCY = {
  code: 'XOF',
  symbol: 'FCFA',
  locale: 'fr-CI',
};
