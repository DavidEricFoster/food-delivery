import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from './tokenStorage';

const API_BASE_URL = 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include credentials for CORS
});

// Request interceptor for automatically adding the JWT
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenStorage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: unknown) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const statusCode = error?.response?.status;
        if (statusCode === 401 || statusCode === 403) {
            tokenStorage.clearTokens();
            if (window.location.pathname !== '/signin') {
                window.location.href = '/signin';
            }
        }
        return Promise.reject(error);
    }
);