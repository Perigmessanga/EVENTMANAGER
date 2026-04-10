// src/components/auth/VerifyOTPForm.tsx
import { useState } from "react";

interface Props {
  email?: string;
}

export default function VerifyOTPForm({ email }: Props) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("https://api.awardsdan.com/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("OTP validé ✅");
      } else {
        setMessage(data.error || "OTP invalide ou expiré ❌");
      }
    } catch (err) {
      setMessage("Erreur réseau : impossible de vérifier l'OTP");
    }
  };

  return (
    <form onSubmit={handleVerifyOTP} className="mt-4">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Entrez le code OTP"
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="ml-2 px-4 py-2 bg-green-600 text-white rounded">
        Vérifier OTP
      </button>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </form>
  );
}
