import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner-toast";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { register, user, isAuthenticated, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      if (["admin", "organizer"].includes(user.role)) {
        navigate("/admin");
      } else {
        navigate("/my-tickets");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      await register({
        email,
        password,
        password_confirm: passwordConfirm,
        firstName,
        lastName,
      });
      toast.success("Inscription réussie !");
      // Redirection gérée automatiquement par useEffect
    } catch (err) {
      console.error(err);
      toast.error("Échec de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              Prénom
            </label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Nom
            </label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-1">
              Confirmer le mot de passe
            </label>
            <Input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;