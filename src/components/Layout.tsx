import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Menu, 
  X, 
  LogOut, 
  User,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Imóveis', href: '/properties', icon: Building2 },
    { name: 'Inquilinos', href: '/tenants', icon: Users },
    { name: 'Contratos', href: '/contracts', icon: FileText },
    { name: 'Financeiro', href: '/financial', icon: DollarSign },
    { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 shrink-0 items-center mt-2">
            <Logo size="sidebar" />
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200
                            ${isActive 
                              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar mobile */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800">
          <div className="flex h-16 shrink-0 items-center px-6 mt-2">
            <Logo size="sidebar" />
          </div>
          
          <nav className="flex flex-1 flex-col px-6 pb-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200
                            ${isActive 
                              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="lg:pl-72">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notificações */}
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Ver notificações</span>
                <Bell className="h-6 w-6" />
              </button>

              {/* Toggle de tema */}
              <ThemeToggle />

              {/* Separador */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-700" />

              {/* Menu do usuário */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user?.avatar || (process.env.PUBLIC_URL + '/avatar-default.png')}
                    alt=""
                  />
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                title="Sair"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo da página */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 