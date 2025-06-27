import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de autenticação
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular login - em produção, isso seria uma chamada para API
    if (email === 'admin@imobpay.com' && password === 'admin123') {
      const mockUser: User = {
        id: '1',
        name: 'Administrador',
        email: 'admin@imobpay.com',
        role: 'admin',
        avatar: process.env.PUBLIC_URL + '/avatar-default.png'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simular registro - em produção, isso seria uma chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se o email já existe (simulação)
      const existingUser = localStorage.getItem('user');
      if (existingUser) {
        const user = JSON.parse(existingUser);
        if (user.email === email) {
          setIsLoading(false);
          return false; // Email já existe
        }
      }
      
      // Criar novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}; 