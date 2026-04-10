/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { post, get } from "@/lib/api-client";
import { ENDPOINTS } from "@/config/api";
import type { User, UserRole, LoginResponse, RegisterResponse } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpStep: boolean; // true si en attente de validation OTP
}

interface RegisterData {
  email: string;
  password: string;
  password_confirm?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
}

type AuthStore = AuthState & {
  register: (data: RegisterData) => Promise<void>;
  requestEmailOtp: (email: string) => Promise<void>;
  verifyEmailOtp: (email: string, otp_code: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
      otpStep: false, // au départ pas d'OTP

      /**
       * INSCRIPTION
       */
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const payload = {
            email: data.email,
            username: data.username || data.email.split("@")[0],
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            password: data.password,
            password_confirm: data.password_confirm || data.password,
          };

          await post<RegisterResponse>(ENDPOINTS.auth.register, payload);

          // Après inscription, passer à l'étape OTP
          set({ otpStep: true, isLoading: false });
        } catch (err: any) {
          const errorMsg = err instanceof Error ? err.message : "Erreur lors de l'inscription";
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      /**
       * ENVOI OTP PAR EMAIL
       */
      requestEmailOtp: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await post(ENDPOINTS.auth.requestEmailOtp, { email });
          set({ isLoading: false });
        } catch (err: any) {
          const errorMsg = err instanceof Error ? err.message : "Impossible d'envoyer l'OTP par email";
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      /**
       * VERIFICATION OTP
       */
      verifyEmailOtp: async (email: string, otp_code: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await post<LoginResponse>(ENDPOINTS.auth.verifyEmailOtp, { email, otp_code });

          set({
            user: response.user,
            accessToken: response.access,
            refreshToken: response.refresh,
            isAuthenticated: true,
            otpStep: false,
            isLoading: false,
          });

          // Stocker tokens et user
          localStorage.setItem("access_token", response.access);
          localStorage.setItem("refresh_token", response.refresh);
          localStorage.setItem("user", JSON.stringify(response.user));
        } catch (err: any) {
          const errorMsg = err instanceof Error ? err.message : "OTP invalide ou expiré";
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      /**
       * LOGIN classique après activation du compte
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await post<LoginResponse>(ENDPOINTS.auth.login, { email, password });

          set({
            user: response.user,
            accessToken: response.access,
            refreshToken: response.refresh,
            isAuthenticated: true,
            isLoading: false,
            otpStep: false,
          });

          localStorage.setItem("access_token", response.access);
          localStorage.setItem("refresh_token", response.refresh);
          localStorage.setItem("user", JSON.stringify(response.user));
        } catch (err: any) {
          const errorMsg = err instanceof Error ? err.message : "Échec de connexion";
          set({ error: errorMsg, isLoading: false });
          throw err;
        }
      },

      /**
       * LOGOUT
       */
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          otpStep: false,
          error: null,
        });
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      },

      setError: (error) => set({ error }),

      checkAuth: async () => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        try {
          const user = await get<User>(ENDPOINTS.auth.me);
          set({ user, accessToken, isAuthenticated: true });
        } catch {
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
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
      name: "tikerama-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
