import api, { STORAGE_KEYS } from './api';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  avatar?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  token?: string;
  access_token?: string;
  token_type?: string;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface UploadAvatarResponse {
  success: boolean;
  message: string;
  user: User;
}

// Auth Service
export const authService = {
  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('[authService] login called with:', credentials.email);
    // api is the axios instance, returns AxiosResponse
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    console.log('[authService] login response:', response.data);

    // Support both 'token' (custom) and 'access_token' (Laravel default)
    const token = response.data.token || response.data.access_token;
    if (response.data.success && token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      console.log('[authService] Token stored successfully');
    } else {
      console.log('[authService] Token NOT stored. success:', response.data.success, 'token:', token);
    }

    return response.data;
  },

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    console.log('[authService] getProfile called');
    const response = await api.get<ProfileResponse>('/auth/profile');
    console.log('[authService] getProfile response:', response.data);
    return response.data;
  },

  /**
   * Update user profile
   * PUT /api/auth/profile/update
   */
  updateProfile: async (data: Partial<User>): Promise<UpdateProfileResponse> => {
    console.log('[authService] updateProfile called with:', data);
    const response = await api.put<UpdateProfileResponse>('/auth/profile/update', data);
    console.log('[authService] updateProfile response:', response.data);

    if (response.data.success && response.data.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }

    return response.data;
  },

  /**
   * Upload avatar
   * POST /api/auth/profile/upload-avatar
   * DO NOT set Content-Type manually - Axios handles multipart boundary automatically
   */
  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    console.log('[authService] uploadAvatar called with file:', file.name, file.size, file.type);
    const formData = new FormData();
    formData.append('avatar', file);

    // NOTE: Do NOT set Content-Type header manually for multipart/form-data
    // Axios sets the correct Content-Type with boundary automatically
    const response = await api.post<UploadAvatarResponse>(
      '/auth/profile/upload-avatar',
      formData
    );
    console.log('[authService] uploadAvatar response:', response.data);

    if (response.data.success && response.data.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }

    return response.data;
  },

  /**
   * Get current logged in user from localStorage
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Get auth token
   */
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout: async (): Promise<void> => {
    console.log('[authService] logout called');
    try {
      await api.post<LogoutResponse>('/auth/logout');
      console.log('[authService] logout API success');
    } catch (error) {
      console.warn('[authService] logout API failed, clearing local data:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      console.log('[authService] localStorage cleared');
    }
  },

  /**
   * Update user data in localStorage
   */
  updateCurrentUser: (user: Partial<User>): void => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...user };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
  },
};

export default authService;