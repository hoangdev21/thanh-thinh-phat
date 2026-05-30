import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminMe, loginAdmin } from '../services/api';
import type { Admin } from '../types';

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // Check if token exists in localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('ttp_admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const adminData = await getAdminMe();
        setAdmin(adminData);
      } catch (error) {
        console.error('Lỗi xác thực phiên đăng nhập:', error);
        localStorage.removeItem('ttp_admin_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const data = await loginAdmin(username, password);
      localStorage.setItem('ttp_admin_token', data.token);
      setAdmin(data.admin);
      setLoginModalOpen(false); // Close modal on success
    } catch (error) {
      localStorage.removeItem('ttp_admin_token');
      setAdmin(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ttp_admin_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        isLoginModalOpen,
        setLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
