// types/payment.ts

import type { PaymentDetails, PaymentStatus } from './index';

export interface PaymentAPI {
  initiate: (details: PaymentDetails) => Promise<{ transactionId: string; reference: string }>;
  status: (transactionId: string) => Promise<{ status: PaymentStatus }>;
  confirm: (transactionId: string) => Promise<{ success: boolean }>;
}