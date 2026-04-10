// src/components/auth/SendOTPForm.tsx
import { useState } from "react";

export default function SendOTPForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://api.awardsdan.com/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("OTP envoyé avec succès !");
      } else {
        setMessage(data.error || "Erreur lors de l'envoi de l'OTP");
      }
    } catch (err) {
      setMessage("Erreur réseau : impossible d'envoyer l'OTP");
    }
  };

  return (
    <form onSubmit={handleSendOTP}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
        Envoyer OTP
      </button>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </form>
  );
}
