import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signup as apiSignup, login as apiLogin } from '@/lib/api';
import { SignupCredentials, LoginCredentials } from '@lib/types';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  signup: (credentials: SignupCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshTokenFromStorage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const refreshTokenFromStorage = () => {
    const savedToken = localStorage.getItem('authToken');
    setToken(savedToken);
    if (savedToken && !localStorage.getItem('profileReady')) {
      localStorage.setItem('profileReady', 'true');
    }
  };

  // Load token from localStorage on mount
  useEffect(() => {
    refreshTokenFromStorage();
  }, []);

  const signup = async (credentials: SignupCredentials) => {
    const response = await apiSignup(credentials);
    // Note: We don't store token here because user needs to verify email first
    return;
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials);
    const authToken = response.access_token;
    
    // Store in both state and localStorage
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('profileReady', 'true');
    refreshTokenFromStorage();
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('profileReady');
  };

  const value = {
    token,
    isAuthenticated: !!token,
    signup,
    login,
    logout,
    refreshTokenFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
