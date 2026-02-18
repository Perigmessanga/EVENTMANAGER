import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function AuthGuard() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return null;
}
