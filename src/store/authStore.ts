import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSession } from '../types/auth';


interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

/**
 * Nama key ini HARUS sama dengan AUTH_STORAGE_KEY di src/api/axiosClient.ts
 * karena interceptor membaca langsung dari LocalStorage di key ini.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isAuthenticated: false,
      setSession: (session) => set({ session, isAuthenticated: true }),
      clearSession: () => set({ session: null, isAuthenticated: false }),
    }),
    {
      name: 'taskflow_auth',
    }
  )
);
