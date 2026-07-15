import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials } from '../types/auth';
import { loginRequest } from '../api/authApi';

export function useLogin() {
    const setSession = useAuthStore((s) => s.setSession);

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => loginRequest(credentials),
        onSuccess: (session) => {
            setSession(session);
        },
    });
}

export function useLogout() {
    const clearSession = useAuthStore((s) => s.clearSession);
    return () => clearSession();
}
