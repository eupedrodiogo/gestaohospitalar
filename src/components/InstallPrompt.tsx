import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Opcional: Só mostra o prompt se não tiver dispensado antes
      const hasDismissed = localStorage.getItem('hsf_dismissed_install');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('hsf_dismissed_install', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[90] animate-in slide-in-from-bottom-5 fade-in duration-300 bg-slate-900 border border-slate-700 shadow-2xl p-4 rounded-xl max-w-sm flex flex-col gap-3">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="bg-teal-500/20 p-2 rounded-lg text-teal-400">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-100">Instalar App HSF</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Instale o GenteGestão para acesso mais rápido, suporte offline e notificações integradas.
          </p>
        </div>
      </div>
      <button 
        onClick={handleInstallClick}
        className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors active:scale-95"
      >
        Instalar Agora
      </button>
    </div>
  );
}
