// frontend/src/services/paymentService.ts
import { post } from "@/lib/api-client";

export interface MockPaymentResponse {
  status: string;
  transaction_id: string;
  amount: number;
  currency: string;
  user_id: number;
}

export async function initiateMockPayment(amount: number, userId: number): Promise<MockPaymentResponse> {
  return post<MockPaymentResponse>("/api/v1/payments/mock/", {
    amount,
    currency: "XAF",
    user_id: userId
  });
}