import { useState, useCallback } from 'react';
import { getStoredUser, loginWithEmail, logout as authLogout } from '../services/auth';

/**
 * Simple auth hook providing user state and login/logout actions.
 * Falls back to a mock user so the UI renders without a backend.
 */
export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = getStoredUser();
    if (stored) return stored;
    // Mock user for demo purposes
    const mockUser = {
      id: 'mock-1',
      name: 'Demo User',
      email: 'demo@zerowaste.ai',
      businessName: 'Green Kitchen',
      businessType: 'restaurant',
      avatar: null,
    };
    return mockUser;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginWithEmail(email, password);
      setUser(data.user);
      return data.user;
    } catch (err) {
      // In demo mode, accept any credentials
      const mockUser = {
        id: 'mock-1',
        name: email.split('@')[0],
        email,
        businessName: 'My Business',
        businessType: 'restaurant',
        avatar: null,
      };
      localStorage.setItem('zw_token', 'demo-token');
      localStorage.setItem('zw_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authLogout();
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login, logout, isAuthenticated: Boolean(user) };
}
