// src/config/api.ts

/**
 * Configuration générale de l'API
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://api.awardsdan.com/api/v1',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

/**
 * Endpoints de l'API
 */
export const ENDPOINTS = {
  auth: {
    register: '/auth/register/',          // inscription
    login: '/auth/login/',                // login classique
    loginPhoneOtp: '/auth/login_phone_otp/', // login par OTP mobile
    requestPhoneOtp: '/auth/request_phone_otp/', // demander OTP mobile
    requestEmailOtp: '/auth/send-otp/',  // demander OTP email
    verifyEmailOtp: '/auth/verify-otp/', // vérifier OTP email
    logout: '/auth/logout/',
    refreshToken: '/auth/refresh/',
    me: '/auth/me/',
    changePassword: '/auth/change_password/',
  },
  


 events: {
    list: '/events/',            // GET liste publique / POST création
    create: '/events/',          // POST création
    update: (id: string) => `/events/${id}/`,  // PATCH
    delete: (id: string) => `/events/${id}/`,  // DELETE
    detail: (id: string) => `/events/${id}/`,  // GET détail
    publish: (id: string) => `/events/${id}/publish/`,  // POST publish
    cancel: (id: string) => `/events/${id}/cancel/`,    // POST cancel
    myEvents: '/events/my_events/',                    // GET mes événements
    published: '/events/published/',                  // GET événements publiés
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
} as const;

/**
 * Fournisseurs Mobile Money
 */
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

/**
 * Configuration monétaire
 */
export const CURRENCY = {
  code: 'XOF',
  symbol: 'FCFA',
  locale: 'fr-CI',
} as const;
