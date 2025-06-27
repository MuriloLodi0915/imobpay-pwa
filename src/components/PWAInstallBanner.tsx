import React, { useState } from 'react';
import { usePWA } from '../hooks/usePWA';

const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(true);

  if (!isInstallable || isInstalled || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    try {
      await installApp();
      setIsVisible(false);
    } catch (error) {
      console.error('Erro ao instalar app:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Salvar no localStorage para não mostrar novamente por um tempo
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Instalar ImobPay</h3>
            <p className="text-xs text-gray-500">Acesse rapidamente pelo app</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDismiss}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1"
          >
            Agora não
          </button>
          <button
            onClick={handleInstall}
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner; 