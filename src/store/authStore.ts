import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { tokenStorage } from '../services/tokenStorage';
import { apiClient } from '../services/apiClient';

export type UserRole = 'customer' | 'owner' | 'admin';
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface User {
    uuid: string;
    email: string;
    role: UserRole;
    created_at: string;
    status?: string;
}

interface AuthState {
    user: User | null;
    status: AuthStatus;
    error: string | null;
}

interface AuthActions {
    initAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60;

function getErrorMessage(error: unknown, fallbackMessage: string): string {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const maybeResponse = (error as { response?: { data?: { error?: string } } }).response;
        if (maybeResponse?.data?.error) {
            return maybeResponse.data.error;
        }
    }
    return fallbackMessage;
}

export const useAuthStore = create<AuthStore>((set) => ({
    // --- State ---
    user: null,
    status: 'loading',
    error: null,

    // --- Actions ---
    initAuth: async () => {
        const token = tokenStorage.getToken();
        if (!token) {
            set({ user: null, status: 'unauthenticated' });
            return;
        }
        try {
            const response = await apiClient.get<User>('/user/me');
            set({ user: response.data, status: 'authenticated' });
        } catch {
            tokenStorage.clearTokens();
            set({ user: null, status: 'unauthenticated' });
        }
    },

    login: async (email, password) => {
        set({ error: null, status: 'loading' });
        try {
            const loginResponse = await apiClient.post('/tokens', { email, password });
            const token: string = loginResponse.data.token;
            tokenStorage.setTokens(token, DEFAULT_TOKEN_TTL_SECONDS);

            const userResponse = await apiClient.get<User>('/user/me');
            set({ user: userResponse.data, status: 'authenticated' });
        } catch (error) {
            tokenStorage.clearTokens();
            const message = getErrorMessage(error, 'Login failed');
            set({ user: null, status: 'unauthenticated', error: message });
            throw new Error(message);
        }
    },

    register: async (email, password, role) => {
        set({ error: null, status: 'loading' });
        try {
            const response = await apiClient.post('/registrations', { email, password, role });
            const userData: User = {
                uuid: response.data.uuid,
                email: response.data.email,
                role: response.data.role,
                created_at: response.data.created_at,
            };
            const token: string = response.data.token;
            tokenStorage.setTokens(token, DEFAULT_TOKEN_TTL_SECONDS);
            set({ user: userData, status: 'authenticated' });
        } catch (error) {
            tokenStorage.clearTokens();
            const message = getErrorMessage(error, 'Registration failed');
            set({ user: null, status: 'unauthenticated', error: message });
            throw new Error(message);
        }
    },

    logout: () => {
        tokenStorage.clearTokens();
        set({ user: null, status: 'unauthenticated', error: null });
    },

    clearError: () => set({ error: null }),
}));

// --- Pre-defined selectors ---
export const useAuthUser = () => useAuthStore((s) => s.user);
export const useAuthStatus = () => useAuthStore((s) => s.status);
export const useAuthError = () => useAuthStore((s) => s.error);
export const useIsAuthenticated = () => useAuthStore((s) => s.status === 'authenticated');
export const useIsAuthPending = () => useAuthStore((s) => s.status === 'loading');
export const useUserRole = () => useAuthStore((s) => s.user?.role ?? null);
export const useAuthActions = () =>
    useAuthStore(
        useShallow((s) => ({
            initAuth: s.initAuth,
            login: s.login,
            register: s.register,
            logout: s.logout,
            clearError: s.clearError,
        }))
    );
