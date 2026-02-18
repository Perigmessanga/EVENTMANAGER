import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { post, get } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';
import type { User, UserRole, LoginResponse, RegisterResponse } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface RegisterData {
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  password: string;
  password_confirm?: string;
}

type AuthStore = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, otp_code: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  requestPhoneOtp: (phone: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, getState) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await post<LoginResponse>(ENDPOINTS.auth.login, { email, password });
          set({
            user: response.user,
            accessToken: response.access,
            refreshToken: response.refresh,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Échec de connexion.', isLoading: false });
          throw error;
        }
      },

      loginWithPhone: async (phone, otp_code) => {
        set({ isLoading: true, error: null });
        try {
          const response = await post<LoginResponse>(ENDPOINTS.auth.loginPhoneOtp, { phone, otp_code });
          set({
            user: response.user,
            accessToken: response.access,
            refreshToken: response.refresh,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Code OTP invalide.', isLoading: false });
          throw error;
        }
      },

      requestPhoneOtp: async (phone) => {
        set({ isLoading: true, error: null });
        try {
          await post(ENDPOINTS.auth.requestPhoneOtp, { phone });
          set({ isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Impossible de demander l\'OTP.', isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const payload = {
            email: data.email,
            username: data.username || data.email.split('@')[0],
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: data.phone || '',
            password: data.password,
            password_confirm: data.password_confirm || data.password,
          };

          const response = await post<RegisterResponse>(ENDPOINTS.auth.register, payload);

          set({
            user: response.user,
            accessToken: response.access,
            refreshToken: response.refresh,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
          set({ error: errorMsg, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, error: null });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      },

      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      checkAuth: async () => {
        const state = getState();
        const accessToken = state.accessToken || localStorage.getItem('access_token');
        if (!accessToken) {
          set({ isAuthenticated: false });
          return;
        }
        try {
          const user = await get<User>(ENDPOINTS.auth.me);
          set({ user, accessToken, isAuthenticated: true });
        } catch {
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
        }
      },

      hasRole: (role) => {
        const { user } = getState();
        if (!user) return false;
        if (Array.isArray(role)) return role.includes(user.role);
        return user.role === role;
      },
    }),
    {
      name: 'tikerama-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);