import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isStandalone: boolean;
  canShowNotification: boolean;
  notificationPermission: NotificationPermission;
}

interface PWAActions {
  installApp: () => Promise<void>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, options?: NotificationOptions) => void;
  syncData: () => Promise<void>;
}

export const usePWA = (): PWAState & PWAActions => {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    canShowNotification: 'Notification' in window,
    notificationPermission: 'default' as NotificationPermission,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Verificar permissão de notificação
  useEffect(() => {
    if ('Notification' in window) {
      setState(prev => ({
        ...prev,
        notificationPermission: Notification.permission,
      }));
    }
  }, []);

  // Monitorar eventos de instalação
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState(prev => ({ ...prev, isInstallable: true }));
    };

    const handleAppInstalled = () => {
      setState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false 
      }));
      setDeferredPrompt(null);
    };

    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, isStandalone: e.matches }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  // Função para instalar o app
  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('Não há prompt de instalação disponível');
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
        setState(prev => ({ 
          ...prev, 
          isInstalled: true, 
          isInstallable: false 
        }));
      } else {
        console.log('Usuário recusou a instalação');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erro ao instalar app:', error);
    }
  }, [deferredPrompt]);

  // Função para solicitar permissão de notificação
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.log('Notificações não são suportadas');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ 
        ...prev, 
        notificationPermission: permission 
      }));
      return permission;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return 'denied';
    }
  }, []);

  // Função para mostrar notificação
  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.log('Notificações não estão disponíveis ou não foram permitidas');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
    }
  }, []);

  // Função para sincronizar dados
  const syncData = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker não é suportado');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      // Verificar se o background sync está disponível
      if ('sync' in registration) {
        await (registration as any).sync.register('background-sync');
        console.log('Sincronização em background registrada');
      } else {
        console.log('Background sync não é suportado');
      }
    } catch (error) {
      console.error('Erro ao registrar sincronização:', error);
    }
  }, []);

  return {
    ...state,
    installApp,
    requestNotificationPermission,
    showNotification,
    syncData,
  };
}; 