import React, { createContext, useContext, useState, useEffect } from 'react';

import { authApi, LoginData } from '@/api/auth';
import { UserData } from '@/api/user';

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 恢复 token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // 获取用户信息
      authApi
        .getCurrentUser()
        .then(response => setUser(response))
        .catch(() => {
          // token 无效，清除它
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginData) => {
    const response = await authApi.login(data);
    const { access_token } = response;

    // 保存 token
    localStorage.setItem('token', access_token);
    setToken(access_token);
    const userData = await authApi.getCurrentUser();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
