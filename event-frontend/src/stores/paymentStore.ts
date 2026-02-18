import { create } from 'zustand';
import type { PaymentStatus, PaymentProvider, PaymentDetails } from '@/types';

// Minimum time between payment attempts (5 minutes)
const PAYMENT_COOLDOWN = 5 * 60 * 1000;

interface PaymentState {
  status: PaymentStatus;
  details: PaymentDetails | null;
  error: string | null;
  transactionId: string | null;
  reference: string | null;
  lastAttemptTime: number | null;
  pollingInterval: number | null;
}

interface PaymentActions {
  initiatePayment: (provider: PaymentProvider, phoneNumber: string, amount: number) => Promise<void>;
  checkPaymentStatus: () => Promise<PaymentStatus>;
  confirmPayment: () => Promise<void>;
  cancelPayment: () => void;
  resetPayment: () => void;
  canRetryPayment: () => boolean;
  getTimeUntilRetry: () => number;
  setStatus: (status: PaymentStatus) => void;
  setError: (error: string | null) => void;
}

type PaymentStore = PaymentState & PaymentActions;

// Generate unique reference for idempotency
const generateReference = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TKR-${timestamp}-${random}`.toUpperCase();
};

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  // State
  status: 'idle',
  details: null,
  error: null,
  transactionId: null,
  reference: null,
  lastAttemptTime: null,
  pollingInterval: null,

  // Actions
  initiatePayment: async (provider: PaymentProvider, phoneNumber: string, amount: number) => {
    const { canRetryPayment, lastAttemptTime } = get();
    
    // Prevent duplicate payments
    if (!canRetryPayment() && lastAttemptTime) {
      const remaining = Math.ceil((PAYMENT_COOLDOWN - (Date.now() - lastAttemptTime)) / 1000);
      set({
        error: `Veuillez patienter ${remaining}s avant de réessayer.`,
      });
      return;
    }

    const reference = generateReference();
    
    set({
      status: 'initiating',
      error: null,
      reference,
      lastAttemptTime: Date.now(),
      details: {
        provider,
        phoneNumber,
        amount,
        currency: 'XOF',
        reference,
      },
    });

    try {
      // Simulate API call to initiate payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would call the Mobile Money API
      const transactionId = `TXN-${Date.now()}`;
      
      set({
        status: 'pending',
        transactionId,
        details: {
          provider,
          phoneNumber,
          amount,
          currency: 'XOF',
          reference,
          transactionId,
        },
      });
      
      // Start polling for status (in a real app)
      // This simulates the user confirming on their phone
    } catch (error) {
      set({
        status: 'failed',
        error: 'Échec de l\'initiation du paiement. Veuillez réessayer.',
      });
    }
  },

  checkPaymentStatus: async () => {
    const { transactionId, status } = get();
    
    if (!transactionId || status === 'success' || status === 'failed') {
      return status;
    }

    set({ status: 'processing' });

    try {
      // Simulate status check
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo: randomly succeed or stay pending
      const random = Math.random();
      let newStatus: PaymentStatus;
      
      if (random > 0.5) {
        newStatus = 'success';
      } else if (random > 0.1) {
        newStatus = 'pending';
      } else {
        newStatus = 'failed';
        set({ error: 'Le paiement a été refusé.' });
      }
      
      set({ status: newStatus });
      return newStatus;
    } catch {
      set({
        status: 'failed',
        error: 'Erreur de vérification du paiement.',
      });
      return 'failed';
    }
  },

  confirmPayment: async () => {
    set({ status: 'processing' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      set({ status: 'success' });
    } catch {
      set({
        status: 'failed',
        error: 'Échec de la confirmation du paiement.',
      });
    }
  },

  cancelPayment: () => {
    set({
      status: 'idle',
      error: null,
      transactionId: null,
      reference: null,
      details: null,
    });
  },

  resetPayment: () => {
    set({
      status: 'idle',
      details: null,
      error: null,
      transactionId: null,
      reference: null,
      lastAttemptTime: null,
      pollingInterval: null,
    });
  },

  canRetryPayment: () => {
    const { lastAttemptTime, status } = get();
    
    if (status === 'success') return false;
    if (!lastAttemptTime) return true;
    
    return Date.now() - lastAttemptTime >= PAYMENT_COOLDOWN;
  },

  getTimeUntilRetry: () => {
    const { lastAttemptTime } = get();
    if (!lastAttemptTime) return 0;
    
    const elapsed = Date.now() - lastAttemptTime;
    return Math.max(0, PAYMENT_COOLDOWN - elapsed);
  },

  setStatus: (status: PaymentStatus) => set({ status }),
  setError: (error: string | null) => set({ error }),
}));
