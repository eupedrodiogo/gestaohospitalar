import React, { useRef, useState } from 'react';
import { Download, Upload, Shield, Lock, Copy, Check, RefreshCw, Globe } from 'lucide-react';
import { translations, Language } from '../utils/translations';
import { generateRandomPassphrase } from '../utils/crypto';

interface BackupPanelProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  passphrase: string;
  onPassphraseChange: (newPass: string) => void;
  onExportBackup: () => void;
  onImportBackup: (fileContent: string) => Promise<boolean>;
}

export default function BackupPanel({
  currentLang,
  onLangChange,
  passphrase,
  onPassphraseChange,
  onExportBackup,
  onImportBackup,
}: BackupPanelProps) {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [manualPass, setManualPass] = useState(passphrase);

  const handleCopy = () => {
    navigator.clipboard.writeText(passphrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    const newKey = generateRandomPassphrase();
    onPassphraseChange(newKey);
    setManualPass(newKey);
  };

  const handleApplyManualPass = () => {
    if (manualPass.trim()) {
      onPassphraseChange(manualPass.trim());
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          const success = await onImportBackup(content);
          if (success) {
            setImportStatus('success');
          } else {
            setImportStatus('error');
          }
        } catch {
          setImportStatus('error');
        }
      }
    };
    reader.readAsText(file);
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="backup-crypto-panel" className="w-full xl:max-w-7xl mx-auto px-4 sm:px-0 pt-4 space-y-6">
      
      {/* System Preferences Card */}
      <div className="card-gradient rounded-2xl shadow-xl border border-slate-800 overflow-hidden glow-border">
        <div className="bg-slate-900/50 text-white p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-teal-500/10 border border-teal-500/30 p-2 rounded-lg">
            <Globe className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base sm:text-lg">Preferências do Sistema</h2>
            <p className="text-[11px] text-slate-400 font-sans">Configurações de idioma e localização</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6 text-left">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" />
              Idioma da Interface
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Altere o idioma de exibição do sistema. Note que dados de outras pessoas podem continuar no idioma original.
            </p>
            <div className="bg-slate-900 rounded-lg p-2 border border-slate-800 w-full sm:w-64">
              <select
                value={currentLang}
                onChange={(e) => onLangChange(e.target.value as Language)}
                className="bg-transparent text-slate-200 outline-none text-sm font-semibold cursor-pointer w-full p-1"
              >
                <option value="pt" className="bg-slate-950 text-slate-100">Português (PT 🇧🇷)</option>
                <option value="en" className="bg-slate-950 text-slate-100">English (EN 🇺🇸)</option>
                <option value="es" className="bg-slate-950 text-slate-100">Español (ES 🇪🇸)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* End-To-End Encryption Card */}
      <div className="card-gradient rounded-2xl shadow-xl border border-slate-800 overflow-hidden glow-border">
        <div className="bg-slate-900/50 text-white p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-teal-500/10 border border-teal-500/30 p-2 rounded-lg">
            <Shield className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base sm:text-lg">{t.e2eeStatus}</h2>
            <p className="text-[11px] text-slate-400 font-sans">{t.savedSecurely}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6 text-left">
          <p className="text-slate-450 text-sm leading-relaxed font-sans">
            {t.e2eeStatusDesc}
          </p>

          {/* Device Secret Keys */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-400" />
              {t.passphraseTitle}
            </h3>
            
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {t.passphraseExplain}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={manualPass}
                  onChange={(e) => setManualPass(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-3 pr-10 text-sm font-mono text-slate-200 focus:border-teal-550 focus:ring-0"
                  placeholder={t.passphrasePlaceholder}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute right-2 top-2.5 text-slate-500 hover:text-slate-350"
                >
                  {copied ? <Check className="w-5 h-5 text-teal-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleApplyManualPass}
                  className="bg-teal-500 hover:bg-teal-450 hover:scale-102 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)] cursor-pointer"
                >
                  {t.applyKey}
                </button>
                <button
                  onClick={handleRegenerate}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 p-2.5 rounded-lg transition-colors cursor-pointer"
                  title={t.regeneratePassphrase}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            {copied && (
              <p className="text-[11px] text-teal-450 font-semibold">{t.copiedSuccess}</p>
            )}
          </div>
        </div>
      </div>

      {/* Backup and Restore Actions Card */}
      <div className="card-gradient rounded-2xl shadow-xl border border-slate-800 overflow-hidden glow-border">
        <div className="p-5 border-b border-slate-800 bg-slate-900/40 text-left">
          <h2 className="font-display font-semibold text-slate-250 text-base flex items-center gap-2">
            <Download className="w-5 h-5 text-teal-400" />
            {t.backupTitle}
          </h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Export Action */}
          <div className="border border-slate-800 bg-slate-900/20 p-5 rounded-xl hover:border-teal-500/30 transition-all text-center space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-450 flex items-center justify-center mx-auto mb-3 border border-teal-555/20">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-slate-200 text-sm">Download Backup</h3>
              <p className="text-xs text-slate-450 mt-1">
                Gere uma cópia offline segura contendo todas as metas em formato descriptografado legível.
              </p>
            </div>
            <button
              onClick={onExportBackup}
              className="w-full bg-teal-500 hover:bg-teal-450 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(45,212,191,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              {t.exportBackupBtn}
            </button>
          </div>

          {/* Import / Restore Action */}
          <div className="border border-slate-800 bg-slate-900/20 p-5 rounded-xl hover:border-teal-500/30 transition-all text-center space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-teal-550/10 text-teal-450 flex items-center justify-center mx-auto mb-3 border border-teal-500/20">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-slate-200 text-sm">Carregar Backup</h3>
              <p className="text-xs text-slate-450 mt-1">
                Restoure planos arquivados ou metas sincronizadas offline a partir de um backup JSON.
              </p>
            </div>
            <div>
              <button
                onClick={triggerUploadClick}
                className="w-full bg-slate-900 hover:bg-slate-805 border border-slate-800 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-400" />
                {t.importBackupBtn}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {importStatus === 'success' && (
          <div className="mx-6 mb-6 p-3.5 bg-teal-500/10 border border-teal-500/30 text-teal-450 text-xs rounded-xl font-medium">
            {t.restoreSuccess}
          </div>
        )}
        {importStatus === 'error' && (
          <div className="mx-6 mb-6 p-3.5 bg-teal-500/10 border border-teal-500/30 text-teal-450 text-xs rounded-xl font-medium">
            {t.restoreError}
          </div>
        )}
      </div>

    </div>
  );
}
