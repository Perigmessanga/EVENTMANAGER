// src/pages/order/[orderId].tsx
"use client";

import { useRouter } from "next/navigation";
import PayEventButton from "@/components/PayEventButton";

const OrderPage = ({ params }: { params: { orderId: string } }) => {
  const orderId = params.orderId;

  // Tu peux récupérer le montant et email depuis ton API / contexte
  const orderAmount = 10000;
  const customerEmail = "messangaperig3@gmail.com";

  return (
    <div>
      <h1>Commande #{orderId}</h1>
      <p>Montant : {orderAmount} XAF</p>
      <PayEventButton
        orderId={orderId}
        amount={orderAmount}
        customerEmail={customerEmail}
      />
    </div>
  );
};

export default OrderPage;