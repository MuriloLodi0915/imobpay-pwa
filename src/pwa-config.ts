// Configurações centralizadas do PWA
export const PWA_CONFIG = {
  // Informações básicas
  name: 'ImobPay - Gestão Imobiliária',
  shortName: 'ImobPay',
  description: 'Sistema completo de gestão imobiliária com controle de propriedades, inquilinos, contratos e financeiro',
  
  // Cores
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  
  // Configurações de display
  display: 'standalone' as const,
  orientation: 'portrait-primary' as const,
  
  // URLs
  startUrl: '/',
  scope: '/',
  
  // Idioma
  lang: 'pt-BR',
  
  // Categorias
  categories: ['business', 'finance', 'productivity'],
  
  // Ícones
  icons: {
    '16x16': '/icon-16x16.png',
    '32x32': '/icon-32x32.png',
    '192x192': '/icon-192x192.png',
    '512x512': '/icon-512x512.png',
    'apple-touch': '/apple-touch-icon.png',
  },
  
  // Shortcuts
  shortcuts: [
    {
      name: 'Dashboard',
      shortName: 'Dashboard',
      description: 'Acessar o dashboard principal',
      url: '/dashboard',
      icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
    },
    {
      name: 'Propriedades',
      shortName: 'Propriedades',
      description: 'Gerenciar propriedades',
      url: '/properties',
      icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
    },
    {
      name: 'Inquilinos',
      shortName: 'Inquilinos',
      description: 'Gerenciar inquilinos',
      url: '/tenants',
      icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
    },
    {
      name: 'Financeiro',
      shortName: 'Financeiro',
      description: 'Acessar área financeira',
      url: '/financial',
      icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
    }
  ],
  
  // Configurações do Service Worker
  sw: {
    cacheName: 'imobpay-v1.0.0',
    urlsToCache: [
      '/',
      '/static/js/bundle.js',
      '/static/css/main.css',
      '/manifest.json',
      '/icon-192x192.png',
      '/icon-512x512.png',
      '/apple-touch-icon.png'
    ]
  },
  
  // Configurações de notificação
  notifications: {
    defaultIcon: '/icon-192x192.png',
    defaultBadge: '/icon-192x192.png',
    defaultVibrate: [100, 50, 100],
    defaultActions: [
      {
        action: 'explore',
        title: 'Ver detalhes',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icon-192x192.png'
      }
    ]
  }
};

// Tipos para TypeScript
export interface PWAShortcut {
  name: string;
  shortName: string;
  description: string;
  url: string;
  icons: Array<{
    src: string;
    sizes: string;
  }>;
}

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary' | 'natural' | 'any';
  startUrl: string;
  scope: string;
  lang: string;
  categories: string[];
  icons: Record<string, string>;
  shortcuts: PWAShortcut[];
  sw: {
    cacheName: string;
    urlsToCache: string[];
  };
  notifications: {
    defaultIcon: string;
    defaultBadge: string;
    defaultVibrate: number[];
    defaultActions: Array<{
      action: string;
      title: string;
      icon: string;
    }>;
  };
} 