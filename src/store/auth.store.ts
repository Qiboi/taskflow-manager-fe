import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthSession, User } from "../types/auth";


type AuthState = {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (session: AuthSession) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: (session) =>
                set({
                    token: session.token,
                    user: session.user,
                    isAuthenticated: true,
                }),
            logout: () =>
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "taskflow-auth",
            storage: createJSONStorage(() => localStorage),
        }
    )
);