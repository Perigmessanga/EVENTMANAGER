// ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, checkAuth, hasRole } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      console.log('[ProtectedRoute] Starting verification...');
      await checkAuth(); // Vérifie token + récupère user depuis /auth/me/
      setChecking(false);
    };
    verify();
  }, [checkAuth]);

  // Afficher un loader pendant la vérification
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Vérification de l'accès...</p>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié → rediriger vers login
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Vérification du rôle
  if (requiredRole && user && !hasRole(requiredRole)) {
    console.log('[ProtectedRoute] Access denied for role:', user.role);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas les droits d'accès à cette page. (Rôle: {user.role})
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => window.location.assign("/")}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Accès autorisé → afficher les enfants
  return <>{children}</>;
};
