import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse
} from 'axios';

// Base URL for Laravel API
const BASE_URL = 'http://127.0.0.1:8000/api';

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'tps3r_token',
  USER: 'tps3r_user',
} as const;

// Event emitter for auth events
export const AUTH_EVENTS = {
  UNAUTHORIZED: 'auth:unauthorized',
  TOKEN_EXPIRED: 'auth:token_expired',
} as const;

// Emit auth events
const emitAuthEvent = (event: string, message?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(event, {
        detail: { message }
      })
    );
  }
};

// Clear auth data
const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `[API] ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `[API] Response ${response.status}:`,
      response.data
    );

    // PENTING:
    // Return full AxiosResponse
    // supaya authService tetap bisa memakai response.data
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    // 401 Unauthorized
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest?._retry
    ) {
      if (originalRequest) {
        originalRequest._retry = true;
      }

      clearAuthData();

      emitAuthEvent(
        AUTH_EVENTS.UNAUTHORIZED,
        'Sesi telah berakhir. Silakan login kembali.'
      );

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject({
        message:
          'Sesi telah berakhir. Silakan login kembali.',
        code: 'UNAUTHORIZED',
      });
    }

    // 422 Validation Error
    if (error.response?.status === 422) {
      const data = error.response.data as {
        errors?: Record<string, string[]>;
      };

      const errors = data.errors
        ? Object.values(data.errors).flat().join(', ')
        : 'Validasi gagal.';

      return Promise.reject({
        message: errors,
        code: 'VALIDATION_ERROR',
      });
    }

    // 403 Forbidden
    if (error.response?.status === 403) {
      return Promise.reject({
        message:
          'Anda tidak memiliki izin untuk mengakses resource ini.',
        code: 'FORBIDDEN',
      });
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      return Promise.reject({
        message: 'Resource tidak ditemukan.',
        code: 'NOT_FOUND',
      });
    }

    // 500+
    if (
      error.response &&
      error.response.status >= 500
    ) {
      return Promise.reject({
        message:
          'Server mengalami kesalahan. Silakan coba lagi nanti.',
        code: 'SERVER_ERROR',
      });
    }

    // Network Error
    if (!error.response) {
      return Promise.reject({
        message:
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        code: 'NETWORK_ERROR',
      });
    }

    const errorData = error.response.data as {
      message?: string;
    };

    return Promise.reject({
      message:
        errorData.message ||
        error.message ||
        'Terjadi kesalahan.',
      code: 'API_ERROR',
    });
  }
);

// Generic API methods
export const apiService = {
  get: <T>(
    url: string,
    params?: Record<string, unknown>
  ) =>
    api.get<T>(url, { params }).then(
      (res) => res.data
    ),

  post: <T>(
    url: string,
    data?: unknown
  ) =>
    api.post<T>(url, data).then(
      (res) => res.data
    ),

  put: <T>(
    url: string,
    data?: unknown
  ) =>
    api.put<T>(url, data).then(
      (res) => res.data
    ),

  patch: <T>(
    url: string,
    data?: unknown
  ) =>
    api.patch<T>(url, data).then(
      (res) => res.data
    ),

  delete: <T>(url: string) =>
    api.delete<T>(url).then(
      (res) => res.data
    ),
};

export default api;