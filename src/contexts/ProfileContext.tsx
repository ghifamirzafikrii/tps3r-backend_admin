import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { authService, type User } from '../services/authService';
import { AUTH_EVENTS, STORAGE_KEYS } from '../services/api';

// Convert User type to AdminProfile for compatibility
const userToProfile = (user: User | null): AdminProfile | null => {
  if (!user) return null;
  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role || 'Admin',
    avatar: user.avatar || '',
    avatar_url: user.avatar_url || '',
    joinDate: user.created_at || new Date().toISOString().split('T')[0],
  };
};

// Types for profile
export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  avatar_url?: string;
  joinDate: string;
  lastLogin?: string;
}

export interface ProfileContextType {
  profile: AdminProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<AdminProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  darkMode: boolean;
  toggleDarkMode: () => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('tps3r_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  /**
   * Clear profile state (used on logout)
   */
  const clearProfile = useCallback(() => {
    console.log('[ProfileContext] clearProfile called');
    setProfile(null);
    setError(null);
  }, []);

  /**
   * Fetch profile from API
   * Updates BOTH localStorage and React state
   * This is called on mount and when user wants fresh data
   */
  const doFetchProfile = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
      setError(null);
    }

    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Sesi tidak valid. Silakan login kembali.');
      }

      const response = await authService.getProfile();
      console.log('[ProfileContext] doFetchProfile response:', response);

      if (response.success && response.user) {
        // Update localStorage with fresh data from API
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

        // Update React state with fresh data
        const profileData = userToProfile(response.user);
        console.log('[ProfileContext] setProfile with fresh data:', profileData);
        setProfile(profileData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengambil profil dari server';
      setError(message);
      console.error('[ProfileContext] doFetchProfile error:', message);

      const errorObj = err as { code?: string };
      if (errorObj.code === 'UNAUTHORIZED') {
        clearProfile();
      }
    } finally {
      if (isInitial) {
        setIsLoading(false);
      }
    }
  }, [clearProfile]);

  /**
   * Fetch profile on mount (called once via useEffect without dependency array)
   */
  const fetchProfile = useCallback(async () => {
    console.log('[ProfileContext] fetchProfile called');
    await doFetchProfile(true);
  }, [doFetchProfile]);

  /**
   * Refresh profile (debounced version of fetchProfile)
   */
  const refreshProfile = useCallback(async () => {
    console.log('[ProfileContext] refreshProfile called');
    await doFetchProfile(false);
  }, [doFetchProfile]);

  /**
   * Update profile
   * Calls API, updates localStorage + state, then refreshes
   */
  const updateProfile = useCallback(async (data: Partial<AdminProfile>) => {
    console.log('[ProfileContext] updateProfile called:', data);
    setIsLoading(true);
    setError(null);

    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Sesi tidak valid. Silakan login kembali.');
      }

      // Call real API
      const response = await authService.updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      console.log('[ProfileContext] updateProfile response:', response);

      if (response.success && response.user) {
        // Update localStorage with new user data
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

        // Update React state with new user data
        const profileData = userToProfile(response.user);
        console.log('[ProfileContext] setProfile after update:', profileData);
        setProfile(profileData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui profil';
      setError(message);
      console.error('[ProfileContext] updateProfile error:', err);
      throw err;
    } finally {
      setIsLoading(false);
      console.log('[ProfileContext] updateProfile finished');
    }
  }, []);

  /**
   * Upload avatar
   * Calls API, updates localStorage + state, then refreshes
   */
  const uploadAvatar = useCallback(async (file: File) => {
    console.log('[ProfileContext] uploadAvatar called:', file.name);
    setIsLoading(true);
    setError(null);

    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Sesi tidak valid. Silakan login kembali.');
      }

      // Call real API
      const response = await authService.uploadAvatar(file);
      console.log('[ProfileContext] uploadAvatar response:', response);

      if (response.success && response.user) {
        // Update localStorage with new user data
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

        // Update React state with new user data
        const profileData = userToProfile(response.user);
        console.log('[ProfileContext] setProfile after upload:', profileData);
        setProfile(profileData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengunggah avatar';
      setError(message);
      console.error('[ProfileContext] uploadAvatar error:', err);
      throw err;
    } finally {
      setIsLoading(false);
      console.log('[ProfileContext] uploadAvatar finished');
    }
  }, []);

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem('tps3r_dark_mode', JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  /**
   * Fetch profile ONCE on mount (no dependency array)
   */
  useEffect(() => {
    console.log('[ProfileContext] useEffect mount - fetching profile');
    doFetchProfile(true);

    // Listen for logout events from Navbar/App
    const handleLogout = () => {
      console.log('[ProfileContext] logout event received');
      clearProfile();
    };

    window.addEventListener('profile:logout', handleLogout);
    return () => window.removeEventListener('profile:logout', handleLogout);
  }, [doFetchProfile, clearProfile]);

  /**
   * Listen for unauthorized events
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('[ProfileContext] unauthorized event received');
      clearProfile();
    };

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
    return () => window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
  }, [clearProfile]);

  return (
    <ProfileContext.Provider value={{
      profile,
      isLoading,
      error,
      fetchProfile,
      refreshProfile,
      updateProfile,
      uploadAvatar,
      darkMode,
      toggleDarkMode,
      clearProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export default ProfileContext;