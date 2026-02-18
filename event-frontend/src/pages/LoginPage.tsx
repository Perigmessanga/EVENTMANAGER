import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, user, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      if (["admin", "organizer"].includes(user.role)) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.email || !formData.password) {
      setFormError("Veuillez remplir tous les champs");
      return;
    }

    try {
      await login(formData.email, formData.password);
      
      // Récupérer l'utilisateur immédiatement après la connexion
      const state = useAuthStore.getState();
      const currentUser = state.user;
      
      console.log('[LoginPage] User logged in:', currentUser);
      console.log('[LoginPage] User role:', currentUser?.role);
      
      toast({ title: "Connexion réussie", description: "Vous êtes maintenant connecté." });
      
      // Redirection immédiate basée sur le rôle
      setTimeout(() => {
        if (currentUser && ["admin", "organizer"].includes(currentUser.role)) {
          console.log('[LoginPage] Redirecting to /admin');
          navigate("/admin");
        } else {
          console.log('[LoginPage] Redirecting to /');
          navigate("/");
        }
      }, 500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Connexion échouée";
      setFormError(errorMsg);
      toast({ title: "Connexion échouée", description: errorMsg, variant: "destructive" });
    }
  };

  const displayError = formError || error;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">T</span>
            </div>
            <span className="font-display font-bold text-2xl">Tikerama</span>
          </Link>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
          <h1 className="font-display font-bold text-2xl text-center mb-2">
            Connexion
          </h1>
          <p className="text-muted-foreground text-center mb-6 text-sm">
            Connectez-vous pour continuer
          </p>

          {/* Error Message */}
          {displayError && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 mb-4 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-blue-500 hover:underline font-medium">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}