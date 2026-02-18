import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, checkAuth, hasRole } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      console.log('[ProtectedRoute] Starting verification...');
      await checkAuth();
      
      const state = useAuthStore.getState();
      console.log('[ProtectedRoute] After checkAuth - user:', state.user);
      console.log('[ProtectedRoute] After checkAuth - isAuthenticated:', state.isAuthenticated);
      console.log('[ProtectedRoute] After checkAuth - requiredRole:', requiredRole);
      
      if (state.user && requiredRole) {
        const hasAccess = state.hasRole(requiredRole);
        console.log('[ProtectedRoute] Role check:', state.user.role, 'vs', requiredRole, '-> hasAccess:', hasAccess);
      }
      
      setChecking(false);
    };
    verify();
  }, [checkAuth, requiredRole]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Vérification de l'accès...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to login');
    navigate("/login");
    return null;
  }

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
            onClick={() => navigate("/")}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};