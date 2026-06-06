import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authService, type User } from '../services/authService';
import { STORAGE_KEYS } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  /**
   * Load profile from API and update localStorage
   */
  const doLoadProfile = useCallback(async () => {
    console.log('[AuthContext] doLoadProfile START');
    try {
      const response = await authService.getProfile();
      console.log('[AuthContext] doLoadProfile response:', response);

      if (response.success && response.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('[AuthContext] doLoadProfile error:', error);
      const errorObj = error as { code?: string };
      if (errorObj?.code === 'UNAUTHORIZED') {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      // Always set isLoading to false when doLoadProfile completes
      // This ensures the app doesn't get stuck in loading state
      setIsLoading(false);
    }
  }, []);

  /**
   * Initialize auth on mount ONLY
   * No dependency on doLoadProfile to avoid re-runs
   */
  useEffect(() => {
    console.log('[AuthContext] useEffect mount');
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      console.log('[AuthContext] token check:', !!token, token ? '(token exists)' : '(no token)');

      if (!token) {
        console.log('[AuthContext] No token, setting isLoading to false');
        setIsLoading(false);
        return;
      }

      console.log('[AuthContext] Token found, calling doLoadProfile');
      await doLoadProfile();
      console.log('[AuthContext] doLoadProfile complete, setting isLoading to false');
      setIsLoading(false);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Login
   */
  const login = useCallback(async (email: string, password: string) => {
    console.log('[AuthContext] login called:', email);
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      console.log('[AuthContext] login response:', response);

      if (response.success) {
        // User data is already stored in localStorage by authService.login()
        // We don't need to call doLoadProfile() here since we have the user data
        // Just update the React state AND set isLoading to false BEFORE returning
        // This is critical to avoid race condition with ProtectedRoute
        const user = response.user;
        setUser(user);
        setIsAuthenticated(true);
        // Set isLoading to false immediately so ProtectedRoute sees correct state
        setIsLoading(false);
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message };
    } catch (error) {
      const err = error as { message?: string };
      return { success: false, message: err.message || 'Login gagal.' };
    } finally {
      // isLoading is already set to false in the success case above
      // Only set to false here for failure cases
      if (!localStorage.getItem(STORAGE_KEYS.TOKEN)) {
        setIsLoading(false);
      }
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    console.log('[AuthContext] logout called');
    setIsLoading(true);

    try {
      await authService.logout();
      console.log('[AuthContext] logout API done');
    } catch (error) {
      console.warn('[AuthContext] logout API failed:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      console.log('[AuthContext] logout complete, localStorage cleared');
    }
  }, []);

  /**
   * Refresh user from API
   */
  const refreshUser = useCallback(async () => {
    console.log('[AuthContext] refreshUser called');
    await doLoadProfile();
  }, [doLoadProfile]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const isTokenValid = (): boolean => authService.isAuthenticated();
export const getToken = (): string | null => authService.getToken();
export const getCurrentUser = (): User | null => authService.getCurrentUser();

export const clearToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};