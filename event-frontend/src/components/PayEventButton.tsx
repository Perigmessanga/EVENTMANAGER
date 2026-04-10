// src/components/PayEventButton.tsx
"use client";

import React from "react";
import { useAWDPay } from "../hooks/useAWDPay";

interface PayEventButtonProps {
  orderId: string;
  amount: number;
  customerEmail: string;
}

const PayEventButton: React.FC<PayEventButtonProps> = ({
  orderId,
  amount,
  customerEmail,
}) => {
  const { initiatePayment, loading } = useAWDPay();

  const handlePayment = async () => {
    try {
      const awdData = await initiatePayment({
        orderId,
        amount,
        customerEmail,
        paymentMethod: "AWDPAY",
      });

      // AWDPAY devrait retourner l'URL de checkout
      if (awdData.checkoutUrl) {
        window.location.href = awdData.checkoutUrl;
      } else {
        alert("Impossible de lancer le paiement, réessayez.");
      }
    } catch (err) {
      console.error("Erreur paiement:", err);
    }
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? "Chargement..." : "Payer avec AWDPAY"}
    </button>
  );
};

export default PayEventButton;