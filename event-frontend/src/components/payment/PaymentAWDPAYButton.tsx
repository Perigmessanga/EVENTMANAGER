/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/payment/PaymentAWDPAYButton.tsx
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/api";
import { post } from "@/lib/api-client";
import { useState } from "react";

interface PaymentAWDPAYButtonProps {
  orderId: string; // ID de la commande
  amount: number;  // montant à payer
  customerEmail: string;
}

export function PaymentAWDPAYButton({ orderId, amount }: PaymentAWDPAYButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAWDPAY = async () => {
    setLoading(true);
    try {
      // 🔹 Appel backend pour initier le paiement AWDPAY
      const response = await post<{
        payment: object;
        awdpay: { checkoutUrl?: string; transactionId?: string; [key: string]: any };
      }>(ENDPOINTS.payments.initiate, {
        order_id: orderId,
        amount,
        payment_method: "awdpay",
      });

      const awdpayData = response.awdpay;

      if (!awdpayData || !awdpayData.checkoutUrl) {
        console.error("AWDPAY DATA RECEIVED:", awdpayData);
        throw new Error("AWDPAY URL manquante");
      }

      console.log("AWDPAY URL:", awdpayData.checkoutUrl);

      // 🔹 Redirection automatique vers AWDPAY
      window.location.href = awdpayData.checkoutUrl;

    } catch (error: any) {
      console.error("Erreur AWDPAY:", error);
      alert(error?.message || "Impossible d'initier le paiement AWDPAY.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
      onClick={handleAWDPAY}
      disabled={loading}
    >
      {loading ? "Chargement..." : "Payer avec AWDPAY"}
    </Button>
  );
}