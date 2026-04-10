/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { API_CONFIG, ENDPOINTS } from "@/config/api";

interface InitiatePaymentProps {
  orderId: string;
  amount: number;
  customerEmail: string;
  paymentMethod: "AWDPAY";
}

interface AWDPayResponse {
  checkoutUrl?: string;
  [key: string]: any;
}

export const useAWDPay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (data: InitiatePaymentProps): Promise<AWDPayResponse> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.post<{
        payment: object;
        awdpay: AWDPayResponse;
      }>(
        `${API_CONFIG.baseUrl}${ENDPOINTS.payments.initiate}`,
        data,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        }
      );

      return res.data.awdpay;
    } catch (err) {
      let message = "Erreur lors du paiement";

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.error || err.message;
      }

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading, error };
};