import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export function AdminLayout() {
  const { user, isAuthenticated, checkAuth, hasRole } = useAuthStore();
  const navigate = useNavigate();

  // Vérifie l'authentification au montage
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirige si non authentifié
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Affiche un loader tant que l'utilisateur n'est pas chargé
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du dashboard...</p>
      </div>
    );
  }

  // Vérifie le rôle
  if (!hasRole(['admin', 'organizer'])) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-4">Accès refusé</h1>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas les droits d'accès à cette section.
          </p>
          <Link to="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Dashboard pour admin/organizer
  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 bg-card border-b border-border">
        <h1 className="text-xl font-bold">Bienvenue {user.email}</h1>
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}