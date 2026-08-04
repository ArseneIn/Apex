import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, getCurrentUser } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('apex_access_token');
    if (token) {
      getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('apex_access_token');
          localStorage.removeItem('apex_refresh_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem('apex_access_token', data.access);
    localStorage.setItem('apex_refresh_token', data.refresh);
    const profile = await getCurrentUser();
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('apex_access_token');
    localStorage.removeItem('apex_refresh_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
