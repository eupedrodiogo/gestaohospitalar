import { useState, useEffect } from "react";
import {
  Building2,
  Bell,
  Shield,
  Globe,
  Users,
  User,
  ArrowLeftRight,
  Calendar,
  Palette,
  LogOut,
  Coins,
  Sliders,
  TrendingUp,
  Megaphone,
  HardHat,
  Briefcase,
  Crown,
  Scale,
  Package
} from "lucide-react";
import { translations, Language } from "../utils/translations";
import { useTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  currentLang: Language;
  currentRole: "colaborador" | "lider" | "rh" | "ti" | "inovacao" | "sadt" | "atendimento" | "financeiro" | "custos" | "faturamento" | "comercial" | "marketing" | "seguranca" | "diretor_administrativo" | "diretor_geral" | "sesmt" | "juridico" | "suprimentos" | "apresentador" | "master" | "medico";
  onRoleChange: (role: "colaborador" | "lider" | "rh" | "ti" | "inovacao" | "sadt" | "atendimento" | "financeiro" | "custos" | "faturamento" | "comercial" | "marketing" | "seguranca" | "diretor_administrativo" | "diretor_geral" | "sesmt" | "juridico" | "suprimentos" | "apresentador" | "master" | "medico") => void;
  currentCycle: string;
  onCycleChange: (cycle: string) => void;
  unreadCount: number;
  userName?: string;
  onShowNotif: () => void;
  isOfflineDemo?: boolean;
  onExitOfflineDemo?: () => void;
  currentTheme?: "hsf" | "dark" | "light" | "hsf-dark" | "dark-hsf";
  setCurrentTheme?: (theme: "hsf" | "dark" | "light" | "hsf-dark" | "dark-hsf") => void;
  onLogout?: () => void;
}

export default function Header({
  currentLang,
  currentRole,
  onRoleChange,
  currentCycle,
  onCycleChange,
  unreadCount,
  userName = "Colaborador",
  onShowNotif,
  isOfflineDemo = false,
  onExitOfflineDemo,
  onLogout,
}: HeaderProps) {
  const { currentTheme, setCurrentTheme } = useTheme();
  const t = translations[currentLang];
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [showSecretThemes, setShowSecretThemes] = useState(false);
  
  const publicThemeOptions = [
    { value: 'light', label: 'Claro Padrão', icon: '☀️' },
    { value: 'dark', label: 'Escuro Padrão', icon: '🌌' },
  ];

  const secretThemeOptions = [
    { value: 'hsf', label: 'Cores HSF', icon: '🏥' },
    { value: 'hsf-dark', label: 'Fundo Escuro HSF', icon: '🌙' },
    { value: 'dark-hsf', label: 'Tech Dark + HSF', icon: '🛸' },
  ];

  const themeOptions = showSecretThemes 
    ? [...publicThemeOptions, ...secretThemeOptions] 
    : publicThemeOptions;

  const roles = [
    { id: "colaborador", label: t.roleColaborador },
    { id: "lider", label: t.roleLider },
    { id: "rh", label: t.roleRH },
    { id: "ti", label: t.roleTi },
    { id: "inovacao", label: "Inovação / Hub" },
    { id: "sadt", label: "SADT" },
    { id: "atendimento", label: "Atendimento" },
    { id: "financeiro", label: "Gestão Financeira" },
    { id: "faturamento", label: "Faturamento & Glosas" },
    { id: "custos", label: "Custos e Controladoria" },
    { id: "comercial", label: "Comercial" },
    { id: "marketing", label: "Marketing / Comunicação" },
    { id: "seguranca", label: "Segurança do Trabalho" },
    { id: "sesmt", label: "Medicina do Trabalho" },
    { id: "juridico", label: "Jurídico & Compliance" },
    { id: "diretor_administrativo", label: "Diretor Administrativo" },
    { id: "diretor_geral", label: "Diretor Geral" },
    { id: "suprimentos", label: "Suprimentos / Logística" },
    { id: "apresentador", label: "Apresentador (Pitch)" },
  ] as const;

  const getRoleDetails = (roleId: string) => {
    switch (roleId) {
      case "colaborador":
        return {
          name: "Pedro (Auxiliar)",
          dept: "Almoxarifado",
          icon: <User className="w-4 h-4" />,
          isClinical: true,
          colorClass: "border-teal-500/10 hover:border-teal-500/30 hover:bg-teal-500/5",
          activeClass: "bg-teal-500/15 border-teal-500/50 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)]",
        };
      case "lider":
        return {
          name: "Rafael (Coordenador)",
          dept: "Almoxarifado",
          icon: <Users className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "rh":
        return {
          name: "Márcia (RH)",
          dept: "Recursos Humanos",
          icon: <Building2 className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "ti":
        return {
          name: "João (TI)",
          dept: "Segurança e TI",
          icon: <Shield className="w-4 h-4" />,
          isClinical: true,
          colorClass: "border-teal-500/10 hover:border-teal-500/30 hover:bg-teal-500/5",
          activeClass: "bg-teal-500/15 border-teal-500/50 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)]",
        };
      case "inovacao":
        return {
          name: "Inovação",
          dept: "Hub de Ideias",
          icon: <Globe className="w-4 h-4" />,
          isClinical: true,
          colorClass: "border-teal-500/10 hover:border-teal-500/30 hover:bg-teal-500/5",
          activeClass: "bg-teal-500/15 border-teal-500/50 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)]",
        };
      case "sadt":
        return {
          name: "Daniela (SADT)",
          dept: "Apoio Diagnóstico",
          icon: <Shield className="w-4 h-4" />,
          isClinical: true,
          colorClass: "border-teal-500/10 hover:border-teal-500/30 hover:bg-teal-500/5",
          activeClass: "bg-teal-500/15 border-teal-500/50 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)]",
        };
      case "atendimento":
        return {
          name: "Andréa (Atend.)",
          dept: "Exp. do Cliente",
          icon: <Users className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "financeiro":
        return {
          name: "Johnny (Gerente)",
          dept: "Financeiro & DRE",
          icon: <Coins className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "faturamento":
        return {
          name: "Luis (Coord.)",
          dept: "Faturamento & Glosas",
          icon: <Coins className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "custos":
        return {
          name: "Victor (Coord.)",
          dept: "Custos e Controladoria",
          icon: <Sliders className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "comercial":
        return {
          name: "Ingrid (Comercial)",
          dept: "Relac. e Vendas",
          icon: <TrendingUp className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "marketing":
        return {
          name: "Bruno (Mkt)",
          dept: "Marketing & Brand",
          icon: <Megaphone className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "seguranca":
        return {
          name: "Samuel (Seg.)",
          dept: "Riscos Ambientais",
          icon: <HardHat className="w-4 h-4" />,
          isClinical: true,
          colorClass: "border-teal-500/10 hover:border-teal-500/30 hover:bg-teal-500/5",
          activeClass: "bg-teal-500/15 border-teal-500/50 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)]",
        };
      case "sesmt":
        return {
          name: "Dr. Lucas (Med.)",
          dept: "Medicina do Trabalho",
          icon: <Shield className="w-4 h-4" />,
          isClinical: true,
          colorClass: "border-teal-500/10 hover:border-teal-500/30 hover:bg-teal-500/5",
          activeClass: "bg-teal-500/15 border-teal-500/50 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)]",
        };
      case "juridico":
        return {
          name: "Dr. Alexandre (Compliance)",
          dept: "Jurídico e Compliance",
          icon: <Scale className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "diretor_administrativo":
        return {
          name: "Jociliano (Dir.)",
          dept: "Dir. Administrativa",
          icon: <Briefcase className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "diretor_geral":
        return {
          name: "Carlos (Geral)",
          dept: "Diretoria Geral",
          icon: <Crown className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-[#693A32]/25 hover:border-[#8D5B4F]/45 hover:bg-[#461D15]/5",
          activeClass: "bg-[#461D15]/30 border-[#693A32]/60 text-white shadow-[0_0_12px_rgba(70,29,21,0.25)]",
        };
      case "suprimentos":
        return {
          name: "Luiza (Gerente)",
          dept: "Suprimentos e Logística",
          icon: <Package className="w-4 h-4" />,
          isClinical: true,
          colorClass: "border-teal-500/10 hover:border-teal-500/30 hover:bg-teal-500/5",
          activeClass: "bg-teal-500/15 border-teal-500/50 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)]",
        };
      case "apresentador":
        return {
          name: "Pedro Diogo (Apresentador)",
          dept: "Showcase / Demonstração",
          icon: <Crown className="w-4 h-4" />,
          isClinical: false,
          colorClass: "border-purple-500/10 hover:border-purple-500/30 hover:bg-purple-500/5",
          activeClass: "bg-purple-500/15 border-purple-500/50 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]",
        };
      default:
        return {
          name: "João (TI)",
          dept: "Segurança e TI",
          icon: <Shield className="w-4 h-4" />,
          isClinical: true,
          colorClass: "border-teal-500/10 hover:border-teal-500/30 hover:bg-teal-500/5",
          activeClass: "bg-teal-500/15 border-teal-500/50 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)]",
        };
    }
  };

  return (
    <div className="sticky top-0 z-40">
      {/* Brand Top Bar */}
      {currentTheme === "hsf" && (
        <div className="bg-[#512E26] h-8 w-full flex items-center justify-end px-4 md:px-6">
          <div className="flex gap-3 h-4 opacity-80">
            {/* Fake social icon placeholders for resemblance */}
            <div className="w-4 h-4 bg-white/20 rounded"></div>
            <div className="w-4 h-4 bg-white/20 rounded"></div>
            <div className="w-4 h-4 bg-white/20 rounded"></div>
          </div>
        </div>
      )}
      <header
        id="app-header"
        className="bg-slate-900 border-b border-slate-800 text-slate-100 transition-colors"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Hospital Branding */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div
              className={`flex items-center justify-center transition-all duration-300 hover:scale-[1.02] ${
                currentTheme?.includes("hsf") 
                  ? "bg-white shadow-sm px-2 py-1 md:px-3 md:py-1.5 rounded-xl md:rounded-2xl" 
                  : "px-1"
              }`}
              style={currentTheme?.includes("hsf") ? { backgroundColor: "#ffffff" } : {}}
            >
              {currentTheme?.includes("hsf") ? (
                <>
                  <img
                    src="https://hospitalsaofranciscorj.com.br/wp-content/uploads/2022/04/Logo-HSF-Mini-color-400x250.png"
                    alt="Hospital São Francisco"
                    className="h-8 md:hidden w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src="https://hospitalsaofranciscorj.com.br/wp-content/uploads/2025/07/Logo-HSF-SELO-0NA1.png"
                    alt="Hospital São Francisco"
                    className="hidden md:block h-9 lg:h-11 w-auto object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                </>
              ) : (
                <img
                  src={currentTheme === 'light' ? '/logo_light.png' : '/logo_dark.png'}
                  alt="Gestão Hospitalar"
                  className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
                />
              )}
            </div>
            <div>
              {isOfflineDemo && (
                <button
                  type="button"
                  onClick={onExitOfflineDemo}
                  className="text-[9px] bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 py-1 px-2 rounded font-bold font-sans tracking-wide transition-all cursor-pointer flex items-center gap-1.5"
                  title="Modo Demonstração ativo localmente. Clique para sair e reconectar."
                >
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping"></span>
                  <span>Modo Demo (Sair)</span>
                </button>
              )}
            </div>
          </div>

          {/* Global Control Tools */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Premium Theme Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="hidden sm:flex items-center gap-2 bg-slate-900/80 rounded-full px-3 py-1.5 border border-slate-700/50 hover:border-slate-500 hover:bg-slate-800 transition-all duration-300"
                title="Identidade Visual"
              >
                <Palette className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[11px] font-semibold text-slate-300 tracking-wide">
                  {themeOptions.find(t => t.value === currentTheme)?.label || 'Theme'}
                </span>
              </button>

              {isThemeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsThemeDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl overflow-hidden py-2 z-50 transform origin-top-right transition-all">
                    <div 
                      className="px-4 py-2 border-b border-slate-800 mb-1"
                      onDoubleClick={() => setShowSecretThemes(true)}
                      title="Duplo clique para opções avançadas"
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest select-none cursor-default">Aparência</span>
                    </div>
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setCurrentTheme(option.value as any);
                          setIsThemeDropdownOpen(false);
                        }}
                        className={`w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-slate-800/80 transition-colors ${
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

            {/* Cycle Selector */}
            <div className="hidden lg:flex items-center bg-slate-900 rounded-lg px-2.5 py-1.5 border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-teal-400 mr-2" />
              <select
                value={currentCycle}
                onChange={(e) => onCycleChange(e.target.value)}
                className="bg-transparent text-slate-100 outline-none text-xs font-semibold cursor-pointer"
              >
                <option value="2026" className="bg-slate-950 text-slate-100">
                  {t.activeCycle}
                </option>
                <option value="2025" className="bg-slate-950 text-slate-100">
                  {t.historicCycle}
                </option>
              </select>
            </div>

            {/* Active User Profile */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-4 border-l border-slate-800">
              <div className="hidden sm:flex flex-col items-end justify-center">
                <span className="text-[11px] font-bold text-slate-200 leading-tight">
                  {userName || getRoleDetails(currentRole).name}
                </span>
                <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">
                  {currentRole === 'master' ? 'Acesso Master' : getRoleDetails(currentRole).dept}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-teal-400 border border-slate-700/50 shadow-sm shrink-0">
                {currentRole === 'master' ? <Crown className="w-4 h-4" /> : getRoleDetails(currentRole).icon}
              </div>
            </div>

            {/* Notifications Button */}
            {currentRole === "colaborador" && (
              <button
                onClick={onShowNotif}
                className="p-2 rounded-full hover:bg-slate-900 text-slate-400 hover:text-white transition-colors relative"
                title="Notificações"
              >
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-teal-400 rounded-full border-2 border-slate-950 animate-pulse"></span>
                )}
              </button>
            )}

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-teal-500/10 text-slate-400 hover:text-teal-400 transition-colors relative"
                title="Sair"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
