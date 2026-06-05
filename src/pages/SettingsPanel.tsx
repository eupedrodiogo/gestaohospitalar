import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Smartphone,
  CheckCircle2,
  Lock,
  Eye,
  LogOut,
  HelpCircle,
  Globe,
  Monitor,
  Sparkles,
  RefreshCw,
  X,
  Target
} from 'lucide-react';
import { auth } from '../lib/firebase';

interface SettingsPanelProps {
  userName: string;
  userRole: string;
}

export default function SettingsPanel({ userName, userRole }: SettingsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'notifications' | 'security' | 'appearance'>('profile');
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);

  useEffect(() => {
    // Show the updates modal when the profile is accessed for the first time
    const hasSeenUpdates = sessionStorage.getItem('hsf_has_seen_updates_modal');
    if (!hasSeenUpdates && activeSubTab === 'profile') {
      setShowUpdatesModal(true);
      sessionStorage.setItem('hsf_has_seen_updates_modal', 'true');
    }
  }, [activeSubTab]);

  const handleSave = () => {
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const menuItems = [
    { id: 'profile', label: 'Meu Perfil', icon: User, desc: 'Informações pessoais e cargo' },
    { id: 'appearance', label: 'Aparência', icon: Monitor, desc: 'Tema e interface' },
    { id: 'notifications', label: 'Notificações', icon: Bell, desc: 'Alertas e comunicações do sistema' },
    { id: 'security', label: 'Segurança', icon: Shield, desc: 'Senha e 2FA' },
  ] as const;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-full flex flex-col pt-8 md:pt-12 animate-in fade-in duration-500">
      {/* Premium System Updates Modal */}
      {showUpdatesModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6 backdrop-blur-sm bg-black/60 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl max-h-[95vh] flex flex-col bg-slate-900 border border-teal-500/20 rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500 ease-out">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400 z-20"></div>
            
            <button 
              onClick={() => setShowUpdatesModal(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-10 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700 flex-1">
              <div className="flex items-start md:items-center gap-4 mb-8 pr-8">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex flex-shrink-0 items-center justify-center mt-1 md:mt-0">
                  <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-slate-100">Novidades do Sistema</h2>
                  <p className="text-xs md:text-sm text-teal-400 font-medium">Veja as últimas atualizações adicionadas ao seu perfil</p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex gap-4 p-4 md:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
                   <div className="mt-1 shrink-0">
                      <Target className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-200 mb-1 text-sm md:text-base">Módulo de PDI e Metas Premium</h4>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">O plano de desenvolvimento individual agora possui acompanhamento aprimorado, visualização de metas a curto e longo prazo, e métricas em tempo real.</p>
                   </div>
                </div>
                
                <div className="flex gap-4 p-4 md:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
                   <div className="mt-1 shrink-0">
                      <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-200 mb-1 text-sm md:text-base">Sincronização Contínua Automática</h4>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Suas modificações e atualizações agora são salvas de forma autônoma sem necessidade de recarregamento, garantindo que nenhum progresso seja perdido.</p>
                   </div>
                </div>

                <div className="flex gap-4 p-4 md:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
                   <div className="mt-1 shrink-0">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-200 mb-1 text-sm md:text-base">Segurança e Privacidade Avançada</h4>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Aprimoramento nas permissões de usuário e visualização de equipe restrita, mantendo total sigilo nas avaliações e no seu planejamento estratégico.</p>
                   </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setShowUpdatesModal(false)}
                  className="w-full md:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
                >
                  Entendi, Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-8 px-4 md:px-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-100 flex items-center gap-3">
            <Settings className="w-8 h-8 text-teal-400" />
            Configurações
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium tracking-wide">
            Gerencie suas preferências de uso da inteligência unificada.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-32">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto h-full">
          {/* Menu Lateral das Configs */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeSubTab === item.id
                    ? 'bg-teal-500/10 border border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.05)]'
                    : 'bg-slate-900/40 border border-transparent hover:bg-slate-800/60 hover:border-slate-700/50'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeSubTab === item.id ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800/80 text-slate-400'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className={`text-sm font-bold ${activeSubTab === item.id ? 'text-teal-400' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                </div>
              </button>
            ))}

            <div className="mt-8 pt-6 border-t border-slate-800">
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 bg-red-400/5 hover:bg-red-400/10 transition-colors"
               >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-bold">Encerrar Sessão</span>
              </button>
            </div>
          </div>

          {/* Painel de Conteúdo das Configs */}
          <div className="flex-1 bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl min-h-[500px]">
             
            {activeSubTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                  <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 text-2xl font-bold uppercase">
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{userName}</h3>
                    <span className="text-sm text-teal-400 font-medium uppercase tracking-widest">{userRole}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-400">Nome Completo</label>
                    <input type="text" readOnly value={userName} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-400">Nível de Acesso (Cargo)</label>
                    <input type="text" readOnly value={userRole.toUpperCase()} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none cursor-not-allowed" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={handleSave} className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)]">
                    Solicitar Alteração
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("hsf_has_seen_onboarding_v2");
                      localStorage.removeItem("hsf_has_seen_assistant_intro");
                      sessionStorage.removeItem("hsf_has_seen_updates_modal");
                      window.location.reload();
                    }} 
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-sm font-bold rounded-xl transition-all"
                  >
                    Reiniciar Tutoriais (Modo Demo)
                  </button>
                </div>
              </div>
            )}

            {activeSubTab === 'appearance' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-slate-400" />
                  Preferências de Aparência
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <button className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-teal-500/10 border border-teal-500/50 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent"></div>
                      <div className="relative z-10 w-full h-24 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-4 bg-slate-800"></div>
                        <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40"></div>
                      </div>
                      <div className="flex items-center gap-2 z-10">
                        <CheckCircle2 className="w-5 h-5 text-teal-400" />
                        <span className="font-bold text-teal-400 tracking-wide">Dark Mode Premium</span>
                      </div>
                   </button>
                   <button className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 transition-colors opacity-50 cursor-not-allowed">
                      <div className="w-full h-24 bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center overflow-hidden relative">
                         <div className="absolute inset-x-0 top-0 h-4 bg-slate-300"></div>
                      </div>
                      <span className="font-bold text-slate-400 tracking-wide">Light Mode (Em Breve)</span>
                   </button>
                </div>
              </div>
            )}

            {activeSubTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6">
                  <Bell className="w-5 h-5 text-slate-400" />
                  Configurações de Alertas
                </h3>
                
                {[
                  { id: 'notif_feedback', title: 'Feedbacks e PDI', desc: 'Alertas quando seu PDI for avaliado ou receber comentário.' },
                  { id: 'notif_vagas', title: 'Novas Vagas Internas', desc: 'Notifique-se sobre vagas condizentes com seu perfil.' },
                  { id: 'notif_gestao', title: 'Métricas da Equipe', desc: 'Avisos semanais de evolução na Área.' },
                  { id: 'notif_climate', title: 'Pesquisas de Clima', desc: 'Ser lembrado de preencher a pesquisa periódica.' }
                ].map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                     <div>
                        <div className="font-bold text-slate-200 text-sm">{item.title}</div>
                        <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                     </label>
                  </div>
                ))}
                
                <div className="pt-4">
                  <button onClick={handleSave} className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl transition-all">
                    Salvar Alterações
                  </button>
                </div>
              </div>
            )}

            {activeSubTab === 'security' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
                  <Shield className="w-5 h-5 text-slate-400" />
                  Segurança da Conta
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                     <Lock className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                     <div>
                        <h4 className="text-sm font-bold text-teal-400">Autenticação Padrão Google</h4>
                        <p className="text-xs text-teal-400/80 mt-1">Como você já loga através do seu provedor de e-mail corporativo ou social, a troca de senhas deve ser feita diretamente com <span className="font-bold">seu provedor de email</span>. O HSF não armazena sua senha de forma independente.</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-xl border border-slate-700/50 bg-slate-800/30">
                     <Smartphone className="w-8 h-8 text-teal-400" />
                     <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-200">Autenticação em Duas Etapas (2FA)</h4>
                        <p className="text-xs text-slate-400 mt-1">Adicione uma camada extra de segurança.</p>
                     </div>
                     <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-lg transition-colors">
                        Configurar
                     </button>
                  </div>
                  
                   <div className="flex items-center gap-4 p-5 rounded-xl border border-slate-700/50 bg-slate-800/30">
                     <Eye className="w-8 h-8 text-slate-500" />
                     <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-200">Sessões Ativas</h4>
                        <p className="text-xs text-slate-400 mt-1">Gerencie onde você está conectado.</p>
                     </div>
                     <button className="px-4 py-2 bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-bold rounded-lg transition-colors">
                        Ver Sessões
                     </button>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Toast */}
            {showSavedMsg && (
              <div className="fixed bottom-8 right-8 bg-teal-500/90 text-slate-950 font-bold px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
                 <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                 Configurações atualizadas com sucesso!
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}