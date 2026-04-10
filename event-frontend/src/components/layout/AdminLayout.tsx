import { useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { XCircle, Menu, X } from 'lucide-react';

export function AdminLayout() {
  const { user, isAuthenticated, checkAuth, hasRole } = useAuthStore();
  const navigate = useNavigate();
  // État pour ouvrir/fermer la sidebar sur mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fermer le menu mobile lors d'un changement de page
  const closeMenu = () => setIsMobileMenuOpen(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du dashboard...</p>
      </div>
    );
  }

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
          <NavLink to="/">
            <Button>Retour à l'accueil</Button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      
      {/* Overlay pour fermer le menu mobile en cliquant à côté */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-4 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex
      `}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          {/* Bouton pour fermer sur mobile uniquement */}
          <button className="md:hidden" onClick={closeMenu}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { to: "/admin", label: "Overview", end: true },
            { to: "/admin/events", label: "Événements" },
            { to: "/admin/orders", label: "Commandes" },
            { to: "/admin/tickets", label: "Tickets" },
            { to: "/admin/sales", label: "Ventes" },
            { to: "/admin/settings", label: "Paramètres" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-3 py-2 rounded transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6 gap-4 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          {/* Bouton Hamburger mobile */}
          <button 
            className="md:hidden p-2 hover:bg-accent rounded-md" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-lg md:text-2xl font-bold truncate">
            Bienvenue {user.email}
          </h1>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}