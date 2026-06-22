'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isStudent: () => boolean;
  isPremium: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setAuth: (user, token) => {
        localStorage.setItem('fejos_token', token);
        localStorage.setItem('fejos_user', JSON.stringify(user));
        set({ user, token });
      },

      clearAuth: () => {
        localStorage.removeItem('fejos_token');
        localStorage.removeItem('fejos_user');
        set({ user: null, token: null });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      isAuthenticated: () => !!get().token && !!get().user,
      isAdmin: () => get().user?.role === 'ADMIN',
      isStudent: () => get().user?.role === 'STUDENT',
      isPremium: () =>
        get().user?.role === 'PREMIUM' || get().user?.role === 'ADMIN',
    }),
    {
      name: 'fejos-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);