import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  language: 'en' | 'te';
  setLanguage: (lang: 'en' | 'te') => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  demoLogin: (role: 'citizen' | 'admin') => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  isLoading: boolean;
  t: (en: string, te: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('prajaai_token'));
  const [language, setLanguageState] = useState<'en' | 'te'>((localStorage.getItem('prajaai_lang') as 'en' | 'te') || 'en');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setLanguage = (lang: 'en' | 'te') => {
    setLanguageState(lang);
    localStorage.setItem('prajaai_lang', lang);
  };

  const t = (en: string, te: string): string => {
    return language === 'te' ? te : en;
  };

  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('prajaai_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error("Token verification failed, logging out", err);
          logout();
        }
      }
      setIsLoading(false);
    };
    fetchMe();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('prajaai_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('prajaai_token');
    setToken(null);
    setUser(null);
  };

  const demoLogin = async (role: 'citizen' | 'admin') => {
    setIsLoading(true);
    try {
      const username = role === 'admin' ? 'admin' : 'citizen';
      const password = role === 'admin' ? 'admin123' : 'citizen123';
      const res = await api.post('/auth/login', { username_or_email: username, password });
      login(res.data.access_token, res.data.user);
    } catch (err) {
      console.error("Demo login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    const res = await api.put('/auth/profile', profileData);
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{ user, token, language, setLanguage, login, logout, demoLogin, updateProfile, isLoading, t }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
