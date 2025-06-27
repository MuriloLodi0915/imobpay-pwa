import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../supabaseClient';

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
        avatar: '/avatar-default.png'
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
      // Verifica se o email já existe no Supabase
      const { data: existing, error: selectError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single();
      if (selectError && selectError.code !== 'PGRST116') {
        // Erro diferente de "row not found"
        setIsLoading(false);
        console.error('Erro ao verificar email:', selectError.message);
        return false;
      }
      if (existing) {
        setIsLoading(false);
        return false; // Email já existe
      }
      // Insere novo usuário
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ name, email, password }])
        .select()
        .single();
      if (error) {
        setIsLoading(false);
        console.error('Erro ao cadastrar usuário:', error.message);
        return false;
      }
      // Cria objeto User local
      const newUser: User = {
        id: data.id?.toString() || Date.now().toString(),
        name: data.name,
        email: data.email,
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setIsLoading(false);
      console.error('Erro inesperado ao cadastrar:', error.message);
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