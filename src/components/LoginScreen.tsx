import React, { useState } from 'react';
import { translations, Language } from '../utils/translations';
import { UserProfile } from '../types';
import { Mail, User, Shield, Briefcase, ChevronRight, AlertCircle, ExternalLink, RefreshCw, Palette } from 'lucide-react';

interface LoginScreenProps {
  currentLang: Language;
  onLoginSuccess: (profile: Omit<UserProfile, 'userId' | 'createdAt'>) => void;
  authError?: string | null;
  projectId?: string;
  isRetryingAuth?: boolean;
  onRetryAuth?: () => void;
  onActivateOfflineMode?: (name: string, email: string, role: string) => void;
  currentTheme: "hsf" | "dark" | "light" | "hsf-dark" | "dark-hsf";
  setCurrentTheme: (theme: "hsf" | "dark" | "light" | "hsf-dark" | "dark-hsf") => void;
}

export default function LoginScreen({ 
  currentLang, 
  onLoginSuccess,
  authError,
  projectId = 'gen-lang-client-0746295906',
  isRetryingAuth = false,
  onRetryAuth,
  onActivateOfflineMode,
  currentTheme,
  setCurrentTheme
}: LoginScreenProps) {
  const t = translations[currentLang];
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<string>('colaborador');
  const [hierarchy, setHierarchy] = useState('Especialista');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    onLoginSuccess({
      email: email.trim(),
      name: name.trim(),
      role,
      language: currentLang,
    });
  };

  const hierarchyOptions = [
    { value: 'Diretor', label: t.hDir },
    { value: 'Gestor', label: t.hGestor },
    { value: 'Coordenador', label: t.hCoord },
    { value: 'Supervisor', label: t.hSup },
    { value: 'Especialista', label: t.hEsp },
    { value: 'Técnico', label: t.hTec },
  ];

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const themeOptions = [
    { value: 'hsf', label: 'Cores HSF (Padrão)', icon: '🏥' },
    { value: 'hsf-dark', label: 'HSF Fundo Escuro', icon: '🌙' },
    { value: 'dark-hsf', label: 'Tech Dark + HSF Accent', icon: '🛸' },
    { value: 'light', label: 'Modo Claro', icon: '☀️' },
    { value: 'dark', label: 'Tech Dark', icon: '🌌' },
  ];

  const toggleThemeDropdown = () => setIsThemeDropdownOpen(!isThemeDropdownOpen);

  const handleThemeChange = (themeValue: any) => {
    setCurrentTheme(themeValue);
    setIsThemeDropdownOpen(false);
  };

  return (
    <div id="login-container" className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 select-none bg-slate-950 relative">
      
      {/* Premium Theme Selector */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="relative">
          <button
            type="button"
            onClick={toggleThemeDropdown}
            className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md rounded-full px-3 py-2 sm:px-4 sm:py-2 border border-slate-800/50 shadow-sm hover:border-slate-500 hover:bg-slate-800 transition-all duration-300 group"
            title="Identidade Visual"
          >
            <Palette className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-colors" />
            <span className="hidden sm:block text-[10px] font-semibold text-slate-400 group-hover:text-slate-200 tracking-wide uppercase">
              {themeOptions.find(t => t.value === currentTheme)?.label || 'Theme'}
            </span>
          </button>

          {isThemeDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsThemeDropdownOpen(false)}></div>
              <div className="absolute bottom-full right-0 mb-2 w-48 sm:w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl overflow-hidden py-1 z-50 transform origin-bottom-right transition-all">
                <div className="px-4 py-2 border-b border-slate-800 mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Identidade Visual</span>
                </div>
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/80 transition-colors ${
                      currentTheme === option.value ? 'bg-slate-800/50 text-teal-400' : 'text-slate-300'
                    }`}
                  >
                    <span className="text-sm">{option.icon}</span>
                    <span className="text-xs font-medium tracking-wide">{option.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full max-w-lg card-gradient rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden transform transition-all glow-border mt-8">
        {/* Banner */}
        <div className="bg-slate-900/50 p-6 text-center space-y-3 relative border-b border-slate-800">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 active-glow pointer-events-none"></div>
          <div className="flex justify-center transition-all duration-300 hover:scale-[1.02]">
            {/* Mobile Logo */}
            <div className="sm:hidden transition-all duration-300 hover:scale-[1.02] mb-1 bg-white p-1.5 rounded-xl shadow-sm" style={{ backgroundColor: '#ffffff' }}>
              <img 
                src="https://hospitalsaofranciscorj.com.br/wp-content/uploads/2022/04/Logo-HSF-Mini-color-400x250.png" 
                alt="Hospital São Francisco"
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Desktop Logo */}
            <div className="hidden sm:flex bg-white px-4 py-2 rounded-2xl max-w-[340px] mx-auto shadow-sm items-center justify-center h-14 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
              <img 
                src="https://hospitalsaofranciscorj.com.br/wp-content/uploads/2025/07/Logo-HSF-SELO-0NA1.png" 
                alt="Hospital São Francisco"
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h2 className="font-display font-semibold text-xl tracking-tight text-white">{t.loginTitle}</h2>
          <p className="text-xs text-slate-400 font-sans max-w-xs mx-auto">{t.loginSubtitle}</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 relative">
          {/* Autenticação Anônima Error / Block */}
          {authError && (
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-4 sm:p-5 space-y-3.5 text-left text-slate-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wide">
                    {authError === 'admin-restricted-operation'
                      ? 'Autenticação Anônima Desativada'
                      : 'Erro de Autenticação Firebase'}
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-normal mt-1">
                    {authError === 'admin-restricted-operation'
                      ? 'A autenticação silenciosa falhou porque o provedor "Anônimo" (Anonymous sign-in) está desativado no console do seu projeto Firebase.'
                      : `Houve uma falha na conexão com os serviços do Firebase: ${authError}`}
                  </p>
                </div>
              </div>

              {authError === 'admin-restricted-operation' && (
                <div className="pt-2.5 border-t border-slate-900 space-y-3 text-[11.5px] text-zinc-300">
                  <div className="font-bold text-teal-300/80 text-[10px] uppercase tracking-wider">
                    Como ativar em 30 segundos no Console:
                  </div>
                  <ol className="list-decimal pl-4.5 space-y-1.5 leading-relaxed text-slate-400">
                    <li>
                      Clique no botão abaixo para abrir o painel <span className="text-slate-250 font-medium font-mono bg-slate-900 px-1 py-0.5 rounded">Sign-in method</span> da sua conta.
                    </li>
                    <li>
                      Pressione <span className="text-slate-250 font-medium">Adicionar novo provedor</span> (Add new provider).
                    </li>
                    <li>
                      Escolha <span className="text-slate-250 font-medium">Anônimo</span> (Anonymous), marque a caixa para <span className="text-slate-250 font-medium">Ativar</span> (Enable) e salve.
                    </li>
                  </ol>
                  
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={`https://console.firebase.google.com/project/${projectId}/authentication/providers`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Abrir Firebase Console</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      
                      {onRetryAuth && (
                        <button
                          type="button"
                          onClick={onRetryAuth}
                          disabled={isRetryingAuth}
                          className="flex-1 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-teal-400 font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRetryingAuth ? 'animate-spin' : ''}`} />
                          <span>{isRetryingAuth ? 'Processando...' : 'Tentar Novamente'}</span>
                        </button>
                      )}
                    </div>

                    {onActivateOfflineMode && (
                      <button
                        type="button"
                        onClick={() => {
                          onActivateOfflineMode(
                            name.trim() || 'Pedro (Auxiliar)',
                            email.trim() || 'pedro@saofrancisco.com.br',
                            role
                          );
                        }}
                        className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                      >
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span>Ignorar e Entrar no Modo de Demonstração (Simular Offline)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Test Login Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 p-4 rounded-xl border border-teal-500/20 bg-teal-500/5">
            <div className="w-full text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-1">
              Acesso Rápido de Teste
            </div>
            {[
              { id: 'apresentador', label: 'Apresentador', name: 'Pedro Diogo (Apresentador)', email: 'pedrodiogo.mello@gmail.com' },
              { id: 'colaborador', label: 'Colab / Base', name: 'Pedro (Auxiliar)', email: 'pedro@saofrancisco.com.br' },
              { id: 'medico', label: 'Médico (PJ/CLT)', name: 'Dr. Marcos (Plantonista)', email: 'marcos@saofrancisco.com.br' },
              { id: 'lider', label: 'Líder', name: 'Rafael (Coordenador)', email: 'rafael@saofrancisco.com.br' },
              { id: 'rh', label: 'RH', name: 'Márcia (RH)', email: 'marcia@saofrancisco.com.br' },
              { id: 'ti', label: 'TI', name: 'João (TI)', email: 'joao@saofrancisco.com.br' },
              { id: 'sesmt', label: 'Medicina', name: 'Dr. Lucas (Med. Trab)', email: 'lucas@saofrancisco.com.br' }
            ].map((role, idx) => (
              <button
                key={`${role.id}-${idx}`}
                type="button"
                onClick={() => {
                  if (onActivateOfflineMode) {
                    onActivateOfflineMode(
                      role.name,
                      role.email,
                      role.id as any
                    );
                  } else {
                    onLoginSuccess({
                      email: role.email,
                      name: role.name,
                      role: role.id as any,
                      language: currentLang,
                    });
                  }
                }}
                className="flex-1 min-w-[70px] bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-[10px] uppercase py-2 px-2 rounded-lg transition-colors cursor-pointer"
              >
                {role.label}
              </button>
            ))}
          </div>

          {/* Email input */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.enterEmail}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@spitalsaofrancisco.com.br"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-teal-500 focus:ring-0 text-slate-200 placeholder-slate-650"
              />
            </div>
          </div>

          {/* Name input */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.enterName}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dra. Mariana Silva"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-teal-500 focus:ring-0 text-slate-200 placeholder-slate-650"
              />
            </div>
          </div>

          {/* Hierarchy designation dropdown */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.filterHierarchy}
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <select
                value={hierarchy}
                onChange={(e) => setHierarchy(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-teal-500 focus:ring-0 text-slate-205 appearance-none cursor-pointer"
              >
                {hierarchyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-950 text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Access profile roles selectors */}
          <div className="space-y-2 pt-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.selectRole}
            </label>
            
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: 'colaborador', title: 'Colaborador', desc: t.roleColaborador },
                { id: 'lider', title: 'Líder / Gestor', desc: t.roleLider },
                { id: 'rh', title: 'Diretoria / RH', desc: t.roleRH },
                { id: 'ti', title: 'Equipe de TI', desc: t.roleTi },
                { id: 'apresentador', title: 'Apresentador / Pitch', desc: 'Acesso exclusivo para apresentação e demonstração' },
                { id: 'sesmt', title: 'Medicina do Trabalho', desc: 'Gerenciar saúde e ergonomia dos colaboradores' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`w-full p-3.5 rounded-xl text-left border flex items-start gap-3 transition-all ${
                    role === item.id
                      ? 'bg-teal-500/10 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.08)] text-teal-400'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <input
                    type="radio"
                    checked={role === item.id}
                    readOnly
                    className="mt-1 h-4 w-4 text-teal-500 border-slate-700 focus:ring-teal-450 bg-slate-950"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-105">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!!authError}
            className={`group w-full font-bold text-xs uppercase tracking-[0.2em] py-4 px-6 rounded-xl transition-all duration-500 flex items-center justify-center gap-3 mt-6 select-none relative overflow-hidden ${
              authError
                ? 'bg-slate-900/50 text-slate-500 border border-slate-800 cursor-not-allowed shadow-none backdrop-blur-sm'
                : 'bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 bg-[length:200%_auto] hover:bg-right text-white shadow-xl shadow-teal-900/20 hover:shadow-teal-500/30 border border-teal-500/30 hover:border-teal-400/50 hover:-translate-y-0.5'
            }`}
          >
            {!authError && (
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out"></div>
              </div>
            )}
            <Shield className={`w-4 h-4 relative z-10 ${authError ? 'text-slate-500' : 'text-teal-100 group-hover:text-white transition-colors duration-300'}`} />
            <span className="relative z-10 text-teal-50 group-hover:text-white transition-colors duration-300">
              {authError ? 'Ative o Login Anônimo no Firebase...' : t.accessButton}
            </span>
            <ChevronRight className="w-4 h-4 relative z-10 text-teal-300/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </button>
        </form>
      </div>

      <div className="w-full flex justify-center pb-8 pt-12">
        <div className="flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-500">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-500/30 to-transparent mb-4"></div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-1.5">
            Engenharia de Produto
          </p>
          <p className="text-xs text-slate-300 font-bold tracking-widest">
            PEDRO DIOGO
          </p>
        </div>
      </div>
    </div>
  );
}
