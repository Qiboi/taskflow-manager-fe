import axios from 'axios';

const AUTH_STORAGE_KEY = 'taskflow_auth';

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

/**
 * Request interceptor
 */
apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.session?.token;
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // sesi rusak/tidak valid, biarkan request tanpa header
    }
  }
  return config;
});

/**
 * Response interceptor
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
