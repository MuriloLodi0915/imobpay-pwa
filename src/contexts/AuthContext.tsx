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
    // Verifica se há usuário logado no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password); // Em produção, use hash!
      if (error || !data || data.length === 0) {
        setIsLoading(false);
        return false;
      }
      setUser(data[0]);
      localStorage.setItem('user', JSON.stringify(data[0]));
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    console.log('Chamou o register:', { name, email, password }); // <-- log para debug
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, password }]) as unknown as { data: User[] | null, error: any };
      if (error || !data || data.length === 0) {
        if (error) {
          console.error('Supabase insert error:', error);
        }
        setIsLoading(false);
        return false;
      }
      setUser(data[0]);
      localStorage.setItem('user', JSON.stringify(data[0]));
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Register catch error:', err);
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
