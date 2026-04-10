// src/pages/RegisterPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    requestEmailOtp,
    verifyEmailOtp,
    isAuthenticated,
    user,
    isLoading,
    error,
  } = useAuthStore();

  const [step, setStep] = useState<"register" | "otp" | "done">("register");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
  });

  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(
        user.role === "admin" || user.role === "organizer" ? "/admin" : "/my-tickets"
      );
    }
  }, [isAuthenticated, user, navigate]);

  // Gestion des champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission inscription
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        password_confirm: formData.passwordConfirm,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Envoyer OTP après inscription
      await requestEmailOtp(formData.email);
      toast.success("Code OTP envoyé par email !");
      setStep("otp");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message || "Échec de l'inscription. Vérifiez vos informations.");
    }
  };

  // Soumission OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmailOtp(formData.email, otpCode);
      toast.success("Email vérifié, compte activé !");
      setStep("done");
      navigate("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message || "OTP invalide ou expiré.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {step === "register" ? "Inscription" : "Vérification OTP"}
        </h1>

        {/* ------------------- Étape Inscription ------------------- */}
        {step === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              placeholder="Prénom"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Nom"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            {/* Password */}
            <div className="relative">
              <Input
                placeholder="Mot de passe"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                placeholder="Confirmer le mot de passe"
                name="passwordConfirm"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Masquer" : "Afficher"}
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>
        )}

        {/* ------------------- Étape OTP ------------------- */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Input
              placeholder="Entrez le code OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Vérification..." : "Vérifier OTP"}
            </Button>
          </form>
        )}

        {/* ------------------- Lien vers login ------------------- */}
        {step === "register" && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Connectez-vous
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
