import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = ('standalone' in window.navigator) && ((window.navigator as any).standalone === true);

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      const hasDismissed = localStorage.getItem('hsf_pwa_dismissed');
      if (!hasDismissed) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    }

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Update UI notify the user they can install the PWA
      const hasDismissed = localStorage.getItem('hsf_pwa_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) return;
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('hsf_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:bottom-10 md:right-10 z-[100] animate-in slide-in-from-bottom-8 fade-in duration-500 md:w-[400px] max-w-sm mx-auto">
      <div className="bg-[#461D15] border border-[#693A32] shadow-2xl rounded-2xl overflow-hidden shadow-black/50">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-[#FAFAFA] rounded-xl flex items-center justify-center shrink-0 border-2 border-[#8D5B4F]/30 p-1">
              <img 
                src="https://hospitalsaofranciscorj.com.br/wp-content/uploads/2022/04/Logo-HSF-Mini-color-400x250.png" 
                alt="HSF Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-[#FAFAFA] text-base leading-tight">Instalar Aplicativo Nativo</h3>
                <span className="text-[9px] uppercase tracking-wider font-bold bg-[#693A32] text-[#A78177] px-2 py-0.5 rounded border border-[#8D5B4F]/30 shrink-0">
                  PORTAL RH
                </span>
              </div>
              <p className="text-sm text-[#A78177] leading-snug pr-4">
                Acesse a plataforma de Gente & Gestão com mais rapidez e recursos offline, direto da sua tela inicial.
              </p>
            </div>
          </div>

          {isIOS ? (
            <div className="bg-[#693A32] p-3 rounded-xl mt-4 mb-4">
              <p className="text-xs text-[#FAFAFA] text-center">
                Para instalar no iOS, toque em <Share className="inline-block w-4 h-4 mx-1 align-text-bottom" /> Compartilhar e depois em <strong>Adicionar à Tela de Início</strong>.
              </p>
            </div>
          ) : null}
          
          <div className="flex items-center gap-3 mt-6">
            <button 
              onClick={handleDismiss}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold text-[#FAFAFA]/70 hover:text-[#FAFAFA] hover:bg-[#693A32] transition-colors ${isIOS ? 'w-full bg-[#693A32]/50' : 'w-1/3'}`}
            >
              {isIOS ? 'Entendi' : 'Agora não'}
            </button>
            {!isIOS && (
              <button 
                onClick={handleInstallClick}
                className="flex-grow bg-[#FAFAFA] hover:bg-white text-[#461D15] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <Download className="w-4 h-4" />
                Instalar App
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
