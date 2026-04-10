import { create } from 'zustand';
import { ENDPOINTS } from '@/config/api';
import type { PaymentStatus, PaymentProvider, PaymentDetails } from '@/types';

interface PaymentState {
  status: PaymentStatus;
  details: PaymentDetails | null;
  error: string | null;
  transactionId: string | null;
  reference: string | null;
}

interface PaymentActions {
  initiatePayment: (provider: PaymentProvider, phoneNumber: string, amount: number, orderId: number) => Promise<void>;
  checkPaymentStatus: () => Promise<PaymentStatus>;
  resetPayment: () => void;
}

type PaymentStore = PaymentState & PaymentActions;

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  status: 'idle',
  details: null,
  error: null,
  transactionId: null,
  reference: null,

  initiatePayment: async (provider, phoneNumber, amount, orderId) => {
    set({ status: 'initiating', error: null });

    try {
      const token = localStorage.getItem('access_token');
      const body = {
        order: orderId,
        amount,
        payment_method: provider,
        phone_number: phoneNumber,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}${ENDPOINTS.payments.initiate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Impossible d’initier le paiement');

      const data = await response.json();

      set({
        status: 'pending',
        transactionId: String(data.transaction_id),
        reference: String(data.id),
        details: {
          provider,
          phoneNumber,
          amount,
          currency: 'XOF',
          reference: String(data.id),
          transactionId: String(data.transaction_id),
        },
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      set({ status: 'failed', error: message });
    }
  },

  checkPaymentStatus: async () => {
    const { reference } = get();
    if (!reference) return 'failed';

    set({ status: 'processing' });

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${ENDPOINTS.payments.status}${reference}/`,
        {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) throw new Error('Erreur lors de la vérification du paiement');

      const data = await response.json();

      if (data.status === 'completed') {
        set({ status: 'success' });
        return 'success';
      } else if (data.status === 'failed') {
        set({ status: 'failed', error: 'Le paiement a échoué' });
        return 'failed';
      } else {
        set({ status: 'pending' });
        return 'pending';
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      set({ status: 'failed', error: message });
      return 'failed';
    }
  },

  resetPayment: () =>
    set({ status: 'idle', error: null, details: null, transactionId: null, reference: null }),
}));