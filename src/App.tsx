import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  FormEvent,
  ChangeEvent,
} from "react";
import {
  Plus,
  Search,
  ClipboardList,
  Clock,
  ArrowLeft,
  Activity,
  Printer,
  Sparkles,
  Loader2,
  Check,
  User,
  Users,
  Shield,
  Download,
  Upload,
  AlertCircle,
  MessageSquare,
  Send,
  Sliders,
  Star,
  ChevronRight,
  ChevronLeft,
  Lock,
  HelpCircle,
  BarChart2,
  Bell,
  BookOpen,
  Database,
  Terminal,
  Settings,
  Heart,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Lightbulb,
  X,
  HeartHandshake,
  Coins,
  TrendingUp,
  Megaphone,
  HardHat,
  Crown,
  Scale,
  FileCheck,
  Trash2,
  Package,
  FileText,
  DollarSign,
  Rocket,
  Landmark,
  ShieldCheck,
  Activity
} from "lucide-react";
import { PresentationView } from "./components/PresentationView";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

import { supabase } from "./lib/supabase";

import { Language, translations } from "./utils/translations";
import { UserProfile, Pdi, Checkin, DecryptedPdiData, Pdi5W2HItem, LearningEvidence } from "./types";
import {
  encryptText,
  decryptText,
  generateRandomPassphrase,
} from "./utils/crypto";

// Subcomponents
import Header from "./components/Header";
import LoginScreen from "./pages/LoginScreen";
import BackupPanel from "./pages/BackupPanel";
import FeedbackPanel from "./pages/FeedbackPanel";
import MetricsPanel from "./pages/MetricsPanel";
import GamificationBadges from "./components/GamificationBadges";

import TrainingPanel from "./pages/TrainingPanel";
import RecrutamentoPanel from "./pages/RecrutamentoPanel";
import AssessmentPanel from "./pages/AssessmentPanel";
import TIAccessPanel from "./pages/TIAccessPanel";
import TILogsPanel from "./pages/TILogsPanel";
import ClimateSurveyPanel from "./pages/ClimateSurveyPanel";
import VagasPanel from "./pages/VagasPanel";
import InnovationPanel from "./pages/InnovationPanel";
import AIAssistantWidget from "./components/AIAssistantWidget";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import OnboardingTour from "./components/OnboardingTour";
import EmployeeProfileView from "./components/EmployeeProfileView";
import TimeTrackingPanel from "./pages/TimeTrackingPanel";
import CredentialingPipeline from "./components/CredentialingPipeline";
import EmployeePortalPanel from "./pages/EmployeePortalPanel";
import SadtPanel from "./pages/SadtPanel";
import AtendimentoPanel from "./pages/AtendimentoPanel";
import FinanceiroPanel from "./pages/FinanceiroPanel";
import FaturamentoPanel from "./pages/FaturamentoPanel";
import CustosPanel from "./pages/CustosPanel";
import ComercialPanel from "./pages/ComercialPanel";
import MarketingPanel from "./pages/MarketingPanel";
import SettingsPanel from "./pages/SettingsPanel";
import SesmtPanel from "./pages/SesmtPanel";
import JuridicoPanel from "./pages/JuridicoPanel";
import SegurancaTrabalhoPanel from "./pages/SegurancaTrabalhoPanel";
import AvisosPanel from "./pages/AvisosPanel";
import DiretoriaAdministrativaPanel from "./pages/DiretoriaAdministrativaPanel";
import DiretoriaGeralPanel from "./pages/DiretoriaGeralPanel";
import NetworkPanel from "./pages/NetworkPanel";

import SuprimentosPanel from "./pages/SuprimentosPanel";

export const getInitialTab = (role: string) => {
  if (role === "apresentador") return "apresentacao";
  if (role === "colaborador") return "avisos";
  if (role === "sesmt") return "sesmt";
  if (role === "juridico") return "juridico";
  if (role === "ti") return "backup";
  if (role === "inovacao") return "inovacao";
  if (role === "sadt") return "sadt";
  if (role === "atendimento") return "atendimento";
  if (role === "financeiro") return "avisos";
  if (role === "faturamento") return "faturamento";
  if (role === "custos") return "dre";
  if (role === "comercial") return "comercial";
  if (role === "marketing") return "marketing";
  if (role === "seguranca") return "seguranca";
  if (role === "diretor_administrativo") return "diretor_administrativo";
  if (role === "diretor_geral") return "diretor_geral";
  if (role === "suprimentos") return "suprimentos";
  return "home";
};

const getEmployeeAssessmentInfo = (employeeName: string) => {
  try {
    const saved = localStorage.getItem("hsf_assessment_employees_v3");
    if (saved) {
      const parsed = JSON.parse(saved);
      const emp = parsed.find((p: any) => p.name === employeeName);
      
      let source: 'leader' | 'self' | null = null;
      let evalToUse = null;

      if (emp?.leaderEvaluation && Object.keys(emp.leaderEvaluation).length > 0) {
        evalToUse = emp.leaderEvaluation;
        source = 'leader';
      } else if (emp?.employeeEvaluation && Object.keys(emp.employeeEvaluation).length > 0) {
        evalToUse = emp.employeeEvaluation;
        source = 'self';
      }

      if (evalToUse && source) {
        const COMPETENCIES = [
          "Comunicação Assertiva",
          "Comportamento e Engajamento",
          "Planejamento e Organização",
          "Qualidade e Produtividade",
          "Pontualidade e Assiduidade",
          "Flexibilidade e Adaptabilidade",
          "Foco em Resultado",
          "Pensamento Criativo",
          "Habilidades Interpessoais",
        ];
        let sum = 0;
        let count = 0;
        COMPETENCIES.forEach((c) => {
          let compSum = 0;
          let compCount = 0;
          for (let i = 0; i < 4; i++) {
            if (evalToUse[`${c}_${i}`] !== undefined) {
              compSum += evalToUse[`${c}_${i}`];
              compCount++;
            }
          }
          if (compCount > 0) {
            sum += compSum / compCount;
            count++;
          } else if (evalToUse[c] !== undefined) {
            sum += evalToUse[c];
            count++;
          }
        });

        if (count > 0) {
          const score = (sum / count).toFixed(1);
          const numScore = parseFloat(score);
          let label = "NÃO ATENDE";
          if (numScore >= 3.5) label = "SUPERA";
          else if (numScore >= 2.5) label = "ATENDE";
          else if (numScore >= 1.5) label = "ATENDE PARCIALMENTE";

          return { score, label, source };
        }
      }
    }
  } catch (e) {}
  return null;
};

export const ALLOWED_TABS_BY_ROLE: Record<string, string[]> = {
  colaborador: [
    "home",
    "escala",
    "documentos",
    "holerite",
    "assessment",
    "network",
    "vagas",
    "climate",
    "training",
    "feedback",
    "sesmt",
    "avisos",
    "settings",
  ],
  medico: [
    "escala",
    "documentos",
    "holerite",
    "avisos",
    "settings",
  ],
  lider: [
    "home",
    "escala",
    "documentos",
    "holerite",
    "assessment",
    "network",
    "metrics",
    "vagas",
    "climate",
    "training",
    "feedback",
    "sesmt",
    "avisos",
    "settings",
  ],
  rh: [
    "home",
    "escala",
    "documentos",
    "holerite",
    "assessment",
    "network",
    "metrics",
    "recrutamento",
    "vagas",
    "climate",
    "training",
    "feedback",
    "avisos",
    "settings",
  ],
  sesmt: [
    "sesmt",
    "network",
    "avisos",
    "settings",
  ],
  juridico: [
    "juridico",
    "network",
    "avisos",
    "settings",
  ],
  ti: [
    "backup",
    "acessos",
    "network",
    "logs",
    "avisos",
    "settings",
  ],
  inovacao: [
    "inovacao",
    "network",
    "avisos",
    "settings",
  ],
  sadt: [
    "sadt",
    "network",
    "avisos",
    "settings",
  ],
  atendimento: [
    "atendimento",
    "network",
    "avisos",
    "settings",
  ],
  financeiro: [
    "caixa",
    "tesouraria",
    "dre",
    "glosas",
    "network",
    "avisos",
    "settings",
  ],
  faturamento: [
    "faturamento",
    "network",
    "avisos",
    "settings",
  ],
  custos: [
    "dre",
    "kpis",
    "simulador_custos",
    "network",
    "avisos",
    "settings",
  ],
  comercial: [
    "comercial",
    "network",
    "avisos",
    "settings",
  ],
  marketing: [
    "marketing",
    "network",
    "avisos",
    "settings",
  ],
  seguranca: [
    "seguranca",
    "network",
    "avisos",
    "settings",
  ],
  diretor_administrativo: [
    "diretor_administrativo",
    "network",
    "caixa",
    "tesouraria",
    "glosas",
    "faturamento",
    "dre",
    "kpis",
    "simulador_custos",
    "avisos",
    "settings",
  ],
  diretor_geral: [
    "diretor_geral",
    "network",
    "caixa",
    "tesouraria",
    "glosas",
    "faturamento",
    "dre",
    "kpis",
    "simulador_custos",
    "avisos",
    "settings",
  ],
  suprimentos: [
    "suprimentos",
    "network",
    "avisos",
    "settings",
  ],
  apresentador: [
    "apresentacao",
    "settings",
  ],
};

export function isTabAllowed(tab: string, role: string): boolean {
  if (!role) return false;
  const allowed = ALLOWED_TABS_BY_ROLE[role];
  if (!allowed) return false;
  return allowed.includes(tab);
}

export default function App() {
  const [isOfflineDemo, setIsOfflineDemo] = useState<boolean>(() => {
    return localStorage.getItem("hsf_pdi_offline_mode") === "true";
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>("pt");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRetryingAuth, setIsRetryingAuth] = useState(false);

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem("hsf_has_seen_onboarding_v2") !== "true";
  });

  const handleOnboardingComplete = () => {
    localStorage.setItem("hsf_has_seen_onboarding_v2", "true");
    setShowOnboarding(false);
  };

  // Theme is now managed by ThemeProvider

  // E2EE Cryptography Passphrase
  const [passphrase, setPassphrase] = useState<string>(() => {
    const saved = localStorage.getItem("hsf_pdi_e2ee_key");
    return saved || generateRandomPassphrase();
  });

  // Cycle and Active tab
  const [activeTab, setActiveTab] = useState<string>("home");

  useEffect(() => {
    if (profile?.role) {
      if (!isTabAllowed(activeTab, profile.role)) {
        const allowed = ALLOWED_TABS_BY_ROLE[profile.role];
        if (allowed && allowed.length > 0) {
          setActiveTab(allowed[0]);
        }
      }
    }
  }, [profile?.role, activeTab]);
  const [selectedCycle, setSelectedCycle] = useState("2026");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    return localStorage.getItem("hsf_sidebar_expanded") !== "false";
  });
  const [showMoreTabs, setShowMoreTabs] = useState(false);

  // Firestore Sync States
  const [allPdis, setAllPdis] = useState<Pdi[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);

  // Detailed UI controllers
  const [selectedPdi, setSelectedPdi] = useState<Pdi | null>(null);
  const currentPdiIdRef = useRef<string | null>(null);
  const [selectedEmployeeProfile, setSelectedEmployeeProfile] =
    useState<Pdi | null>(null);
  const [targetFeedbackEmployee, setTargetFeedbackEmployee] = useState<
    string | undefined
  >();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHierarchy, setFilterHierarchy] = useState("Todos");
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [pushPermission, setPushPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default",
  );
  const [toastMessage, setToastMessage] = useState("");

  // Active PDI Forms Decrypted Cache
  const [decryptedCache, setDecryptedCache] = useState<
    Record<string, DecryptedPdiData>
  >({});
  const [checkinsCache, setCheckinsCache] = useState<Record<string, Checkin[]>>(
    {},
  );

  // Active inputs for forms (state buffers to prevent lag during decryption)
  const [localFormData, setLocalFormData] = useState<DecryptedPdiData>({
    strengths: "",
    improvements: "",
    shortTermGoals: "",
    longTermGoals: "",
    actionPlan: "",
  });
  const [localFeedback, setLocalFeedback] = useState({ manager: "", hr: "" });
  const [newCheckin, setNewCheckin] = useState("");
  const [newStressLevel, setNewStressLevel] = useState<number>(3);
  const [addCheckinLoading, setAddCheckinLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved",
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pdiToReset, setPdiToReset] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiWarning, setAiWarning] = useState("");

  const t = translations[currentLang];

  const previousNotifsLength = useRef(0);

  // Push notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Trigger push on new notification
  useEffect(() => {
    if (
      notifications.length > previousNotifsLength.current &&
      previousNotifsLength.current !== 0
    ) {
      // Find the newest unread notification
      const latest = notifications[0]; // because we sort by createdAt descending
      if (latest && !latest.read && latest.createdAt > Date.now() - 5000) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(latest.title, {
            body: latest.message,
            icon: "/icon.png",
          });
        }
      }
    }
    previousNotifsLength.current = notifications.length;
  }, [notifications]);

  // Calculated state
  const pdisByCycle = allPdis.filter(
    (p) => (p.cycle || "2026") === selectedCycle,
  );
  const myPdi = pdisByCycle.find((p) => p.userId === currentUser?.uid);
  const myTeamPdis = pdisByCycle.filter(
    (p) => p.managerId === currentUser?.uid || profile?.role === "lider",
  );
  const filteredPdis = pdisByCycle.filter((p) => {
    const matchesSearch =
      p.coordinatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHierarchy =
      filterHierarchy === "Todos" || p.hierarchy === filterHierarchy;
    return matchesSearch && matchesHierarchy;
  });

  // Helper to trigger Toast Banner alert
  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  }

  // Handle local E2EE key update
  const handlePassphraseChange = (newKey: string) => {
    setPassphrase(newKey);
    localStorage.setItem("hsf_pdi_e2ee_key", newKey);
    showToast(t.savedSecurely);
    // Reload active decrypted cache immediately
    setDecryptedCache({});
  };

  // 1. Initial State Observer and anonymous auth setup
  useEffect(() => {
    if (isOfflineDemo) {
      setCurrentUser({
        uid: "offline_user_id",
        email: "profissional@saofrancisco.com.br",
      });
      const storedProfiles = localStorage.getItem("hsf_offline_profiles");
      if (storedProfiles) {
        const list = JSON.parse(storedProfiles);
        const myProfile = list.find((p: any) => p.userId === "offline_user_id");
        if (myProfile) {
          setProfile(myProfile);
          setCurrentLang(myProfile.language || "pt");
          setActiveTab(getInitialTab(myProfile.role));
        }
      }
      setIsAuthReady(true);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const sbUser = session?.user;
      if (sbUser) {
        // Map Supabase User to expected currentUser format
        setCurrentUser({ uid: sbUser.id, email: sbUser.email || "anon@saofrancisco.com.br" } as any);
        setAuthError(null);
        
        // Load existing user profile doc via Supabase
        try {
          const { data, error } = await supabase.from("user_profiles").select("*").eq("id", sbUser.id).single();
          if (data) {
            const profData = data as UserProfile;
            setProfile(profData);
            setCurrentLang(profData.language || "pt");
            setActiveTab(getInitialTab(profData.role));
          }
        } catch (err) {
          console.warn("Could not load userProfile:", err);
        }
      } else {
        // Trigger silent anonymous signin via Supabase
        try {
          const { error: signInError } = await supabase.auth.signInAnonymously();
          if (signInError) throw signInError;
          setAuthError(null);
        } catch (err: any) {
          console.error("Supabase Anonymous auth failed: ", err);
          const errMsg = err?.code || err?.message || String(err);
          setAuthError(errMsg);
        }
      }
      setIsAuthReady(true);
    });

    return () => { subscription.unsubscribe(); };
  }, [isOfflineDemo]);

  const handleRetryAuth = async () => {
    setIsRetryingAuth(true);
    try {
      const { error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) throw signInError;
      setAuthError(null);
    } catch (err: any) {
      console.error("Supabase Anonymous auth retry failed: ", err);
      const errMsg = err?.code || err?.message || String(err);
      setAuthError(errMsg);
    } finally {
      setIsRetryingAuth(false);
    }
  };

  const handleActivateOfflineMode = (
    name: string,
    email: string,
    role: "colaborador" | "lider" | "rh" | "ti" | "inovacao" | "sadt" | "atendimento" | "financeiro" | "custos" | "faturamento" | "comercial" | "marketing" | "seguranca" | "diretor_administrativo" | "diretor_geral" | "medico",
  ) => {
    localStorage.setItem("hsf_pdi_offline_mode", "true");
    setIsOfflineDemo(true);
    setAuthError(null);

    const prof: UserProfile = {
      userId: "offline_user_id",
      email: email,
      name: name,
      role: role,
      language: currentLang,
      createdAt: Date.now(),
    };

    // Save/update this profile in localStorage
    const stored = localStorage.getItem("hsf_offline_profiles");
    let profilesList: UserProfile[] = stored ? JSON.parse(stored) : [];
    
    // Migrate stored mock director profiles if they use outdated names
    profilesList = profilesList.map((p) => {
      if (p.userId === "mock_hospital_diretor_adm") {
        return {
          ...p,
          name: "Jociliano (Dir. Adm)",
          email: "jociliano@saofrancisco.com.br"
        };
      }
      if (p.userId === "mock_hospital_diretor_geral") {
        return {
          ...p,
          name: "Carlos (Dir. Geral)",
          email: "carlos@saofrancisco.com.br"
        };
      }
      return p;
    });

    profilesList = profilesList.filter((p) => p.userId !== "offline_user_id");
    profilesList.unshift(prof);

    // Also populate default helper seed profiles so lists aren't empty!
    if (!profilesList.some((p) => p.userId === "mock_hospital_lider")) {
      profilesList.push({
        userId: "mock_hospital_lider",
        name: "Rafael (Coordenador)",
        email: "rafael@saofrancisco.com.br",
        role: "lider",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_rh")) {
      profilesList.push({
        userId: "mock_hospital_rh",
        name: "Márcia (RH)",
        email: "marcia@saofrancisco.com.br",
        role: "rh",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_ti")) {
      profilesList.push({
        userId: "mock_hospital_ti",
        name: "João (TI)",
        email: "joao@saofrancisco.com.br",
        role: "ti",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_sadt")) {
      profilesList.push({
        userId: "mock_hospital_sadt",
        name: "Daniela (SADT)",
        email: "daniela@saofrancisco.com.br",
        role: "sadt",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_atendimento")) {
      profilesList.push({
        userId: "mock_hospital_atendimento",
        name: "Andréa (Atend.)",
        email: "andrea@saofrancisco.com.br",
        role: "atendimento",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_inovacao")) {
      profilesList.push({
        userId: "mock_hospital_inovacao",
        name: "Marina (Inovação)",
        email: "marina@saofrancisco.com.br",
        role: "inovacao",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_financeiro")) {
      profilesList.push({
        userId: "mock_hospital_financeiro",
        name: "Johnny (Gerente)",
        email: "johnny@saofrancisco.com.br",
        role: "financeiro",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_faturamento")) {
      profilesList.push({
        userId: "mock_hospital_faturamento",
        name: "Luis (Coord. Fat.)",
        email: "luis@saofrancisco.com.br",
        role: "faturamento",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_custos")) {
      profilesList.push({
        userId: "mock_hospital_custos",
        name: "Victor (Coord. Custos e Controladoria)",
        email: "victor@saofrancisco.com.br",
        role: "custos",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_comercial")) {
      profilesList.push({
        userId: "mock_hospital_comercial",
        name: "Ingrid (Comercial)",
        email: "ingrid@saofrancisco.com.br",
        role: "comercial",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_marketing")) {
      profilesList.push({
        userId: "mock_hospital_marketing",
        name: "Bruno (Marketing)",
        email: "bruno@saofrancisco.com.br",
        role: "marketing",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_seguranca")) {
      profilesList.push({
        userId: "mock_hospital_seguranca",
        name: "Samuel (Segurança)",
        email: "samuel@saofrancisco.com.br",
        role: "seguranca",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_diretor_adm")) {
      profilesList.push({
        userId: "mock_hospital_diretor_adm",
        name: "Jociliano (Dir. Adm)",
        email: "jociliano@saofrancisco.com.br",
        role: "diretor_administrativo",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    if (!profilesList.some((p) => p.userId === "mock_hospital_diretor_geral")) {
      profilesList.push({
        userId: "mock_hospital_diretor_geral",
        name: "Carlos (Dir. Geral)",
        email: "carlos@saofrancisco.com.br",
        role: "diretor_geral",
        language: currentLang,
        createdAt: Date.now(),
      });
    }
    localStorage.setItem("hsf_offline_profiles", JSON.stringify(profilesList));

    setAllProfiles(profilesList);
    setProfile(prof);
    setCurrentLang(prof.language);
    setActiveTab(getInitialTab(prof.role));

    // Seed some PDIs and checkins so lists work beautifully
    const storedPdis = localStorage.getItem("hsf_offline_pdimocks_v6");
    if (!storedPdis) {
      const mockEncrypt = (obj: any) =>
        `ENC:${window.btoa(encodeURIComponent(JSON.stringify(obj)))}`;

      const pdisList: Pdi[] = [
        {
          id: "report_offline_user_2026",
          userId: "offline_user_id",
          cycle: "2026",
          coordinatorName: "Pedro (Auxiliar)",
          department: "Serviço de Emergência",
          hierarchy: "Técnico",
          managerId: "mock_hospital_lider",
          status: "Aguardando RH",
          encryptedData: mockEncrypt({
            strengths:
              "Excelente resiliência no pronto atendimento. Domínio ótimo de triagem.",
            improvements:
              "Comunicação com acompanhantes em momentos de tensão.",
            shortTermGoals:
              "Completar o curso interno de humanização no atendimento.",
            longTermGoals: "Tornar-se enfermeiro chefe do plantão.",
            actionPlan:
              "- Participar dos workshops mensais do RH\n- Simulações de comunicação de más notícias",
          }),
          managerFeedback: "Ótimo início no primeiro trimestre.",
          hrFeedback: "",
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem("hsf_offline_pdimocks_v6", JSON.stringify(pdisList));
      setAllPdis(pdisList);

      // Populate checkins for Joao
      const joaoCheckins: Checkin[] = [
        {
          id: "checkin_1",
          date: Date.now() - 86400000 * 5,
          authorName: "Dr. João Medeiros",
          authorRole: "colaborador",
          encryptedNote: mockEncrypt(
            "Iniciei as reuniões com a equipe de enfermagem. O clima está melhorando.",
          ),
        },
        {
          id: "checkin_2",
          date: Date.now() - 86400000 * 2,
          authorName: "Rafael (Coordenador)",
          authorRole: "lider",
          encryptedNote: mockEncrypt(
            "Excelente progresso João, continue mantendo o canal aberto com a equipe do plantão noturno.",
          ),
        },
      ];
      localStorage.setItem(
        "hsf_offline_checkins_report_joao_2026",
        JSON.stringify(joaoCheckins),
      );

      const offlineCheckins: Checkin[] = [];
      localStorage.setItem(
        "hsf_offline_checkins_report_offline_user_2026",
        JSON.stringify(offlineCheckins),
      );
    } else {
      setAllPdis(JSON.parse(storedPdis));
    }

    const storedNotifs = localStorage.getItem("hsf_offline_notifications");
    if (!storedNotifs) {
      const notifsList = [
        {
          id: "not_1",
          userId: "offline_user_id",
          title: "Boas-vindas ao PDI HSF",
          message:
            "Inicie seu Plano de Desenvolvimento Individual do Hospital São Francisco.",
          read: false,
          createdAt: Date.now(),
        },
      ];
      localStorage.setItem(
        "hsf_offline_notifications",
        JSON.stringify(notifsList),
      );
      setNotifications(notifsList);
    }

    setCurrentUser({ uid: "offline_user_id", email: email });
    showToast("Acessado no Modo de Demonstração (Salvo Localmente)");
  };

  const handleExitOfflineMode = () => {
    localStorage.removeItem("hsf_pdi_offline_mode");
    setIsOfflineDemo(false);
    setCurrentUser(null);
    setProfile(null);
    setAllProfiles([]);
    setAllPdis([]);
    setNotifications([]);
    window.location.reload();
  };

  // 2. Real-time Firebase Firestore subscriptions
  useEffect(() => {
    if (!currentUser || !profile) return;

    if (isOfflineDemo) {
      const storedProfiles = localStorage.getItem("hsf_offline_profiles");
      if (storedProfiles) setAllProfiles(JSON.parse(storedProfiles));

      const storedPdis = localStorage.getItem("hsf_offline_pdimocks_v6");
      if (storedPdis) {
        setAllPdis(JSON.parse(storedPdis));
      } else {
        // Fallback for mock generation if activated directly without going through login screen
        const mockEncrypt = (obj: any) =>
          `ENC:${window.btoa(encodeURIComponent(JSON.stringify(obj)))}`;
        const pdisList: Pdi[] = [
          {
            id: "report_offline_user_2026",
            userId: "offline_user_id",
            cycle: "2026",
            coordinatorName: "Pedro (Auxiliar)",
            department: "Serviço de Emergência",
            hierarchy: "Técnico",
            managerId: "mock_hospital_lider",
            status: "Aguardando RH",
            encryptedData: mockEncrypt({
              strengths: "Excelente resiliência no pronto atendimento.",
              improvements:
                "Comunicação com acompanhantes em momentos de tensão.",
              shortTermGoals:
                "Completar o curso interno de humanização no atendimento.",
              longTermGoals: "Tornar-se enfermeiro chefe do plantão.",
              actionPlan: "- Participar dos workshops",
            }),
            managerFeedback: "Ótimo início.",
            hrFeedback: "",
            updatedAt: Date.now(),
          },
        ];
        localStorage.setItem(
          "hsf_offline_pdimocks_v6",
          JSON.stringify(pdisList),
        );
        setAllPdis(pdisList);

        const offlineCheckins: Checkin[] = [];
        localStorage.setItem(
          "hsf_offline_checkins_report_offline_user_2026",
          JSON.stringify(offlineCheckins),
        );
      }

      const storedNotifs = localStorage.getItem("hsf_offline_notifications");
      if (storedNotifs) {
        const list = JSON.parse(storedNotifs).filter(
          (n: any) => n.userId === currentUser.uid,
        );
        setNotifications(list);
      }
      return () => {};
    }

    // Listen to Profiles (needed for list and role matching)
    // Fetch initial data for all three tables
    const fetchInitialData = async () => {
      try {
        const [profRes, pdiRes, notifRes] = await Promise.all([
          supabase.from("user_profiles").select("*"),
          supabase.from("pdis").select("*"),
          supabase.from("notifications").select("*").eq("userId", currentUser.uid).order("createdAt", { ascending: false })
        ]);
        if (profRes.data) setAllProfiles(profRes.data as UserProfile[]);
        if (pdiRes.data) setAllPdis(pdiRes.data as Pdi[]);
        if (notifRes.data) setNotifications(notifRes.data as any[]);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais do Supabase:", err);
      }
    };

    fetchInitialData();

    // Subscribe to realtime changes
    const channel = supabase.channel('app_realtime_main')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, () => {
        supabase.from("user_profiles").select("*").then(({data}) => {
          if(data) setAllProfiles(data as UserProfile[]);
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pdis' }, () => {
        supabase.from("pdis").select("*").then(({data}) => {
          if(data) setAllPdis(data as Pdi[]);
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `userId=eq.${currentUser.uid}` }, () => {
        supabase.from("notifications").select("*").eq("userId", currentUser.uid).order("createdAt", { ascending: false }).then(({data}) => {
          if(data) setNotifications(data as any[]);
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, profile, isOfflineDemo]);

  // Decrypt PDI records whenever passphrase or allPdis changes
  useEffect(() => {
    const decryptAll = async () => {
      const cache: Record<string, DecryptedPdiData> = {};
      for (const pdi of allPdis) {
        if (pdi.encryptedData) {
          try {
            const raw = await decryptText(pdi.encryptedData, passphrase);
            let parsed;
            try {
              parsed = JSON.parse(raw);
            } catch {
              // Fallback to try parsing it directly if it wasn't encrypted properly
              parsed = JSON.parse(pdi.encryptedData);
            }
            cache[pdi.id] = {
              strengths: parsed.strengths || "",
              improvements: parsed.improvements || "",
              shortTermGoals: parsed.shortTermGoals || "",
              longTermGoals: parsed.longTermGoals || "",
              actionPlan: parsed.actionPlan || "",
            };
          } catch {
            cache[pdi.id] = {
              strengths: "[Erro de Descriptografia]",
              improvements: "[Erro de Descriptografia]",
              shortTermGoals: "[Erro de Descriptografia]",
              longTermGoals: "[Erro de Descriptografia]",
              actionPlan: "[Erro de Descriptografia]",
            };
          }
        } else {
          cache[pdi.id] = {
            strengths: "",
            improvements: "",
            shortTermGoals: "",
            longTermGoals: "",
            actionPlan: "",
          };
        }
      }
      setDecryptedCache(cache);
    };

    if (allPdis.length > 0) {
      decryptAll();
    }
  }, [allPdis, passphrase]);

  // Fetch Check-ins subcollection whenever a PDI is selected
  useEffect(() => {
    const targetPdi = selectedPdi || myPdi;
    if (!targetPdi) return;

    if (isOfflineDemo) {
      const storedCheckinsKey = `hsf_offline_checkins_${targetPdi.id}`;
      const stored = localStorage.getItem(storedCheckinsKey);
      let list: Checkin[] = stored ? JSON.parse(stored) : [];

      const decryptAndSort = async () => {
        const resolved: Checkin[] = [];
        for (const item of list) {
          try {
            const dec = await decryptText(item.encryptedNote, passphrase);
            resolved.push({ ...item, encryptedNote: dec });
          } catch {
            resolved.push({
              ...item,
              encryptedNote: item.encryptedNote || "[Erro de Decodificação]",
            });
          }
        }
        resolved.sort((a, b) => a.date - b.date);
        setCheckinsCache((prev) => ({ ...prev, [targetPdi.id]: resolved }));
      };
      decryptAndSort();
      return () => {};
    }

    const fetchCheckins = async () => {
      const { data } = await supabase.from("checkins").select("*").eq("pdi_id", targetPdi.id);
      if (data) {
        const list: Checkin[] = [];
        for (const item of data) {
          try {
            const decryptedNote = await decryptText(item.encryptedNote, passphrase);
            list.push({ ...item, encryptedNote: decryptedNote });
          } catch {
            list.push({ ...item, encryptedNote: "[Erro ao decodificar nota de checkin]" });
          }
        }
        list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setCheckinsCache((prev) => ({ ...prev, [targetPdi.id]: list }));
      }
    };
    
    fetchCheckins();

    const channel = supabase.channel(`checkins_${targetPdi.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checkins', filter: `pdi_id=eq.${targetPdi.id}` }, () => {
        fetchCheckins();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedPdi, myPdi, passphrase, isOfflineDemo]);

  useEffect(() => {
    currentPdiIdRef.current = null;
  }, [passphrase]);

  // Load selected PDI's decrypted form fields into local buffer state initially
  useEffect(() => {
    const target = selectedPdi || myPdi;
    if (target && target.id !== currentPdiIdRef.current) {
      currentPdiIdRef.current = target.id;
      const decrypted = decryptedCache[target.id] || {
        strengths: "",
        improvements: "",
        shortTermGoals: "",
        longTermGoals: "",
        actionPlan: "",
      };
      setLocalFormData(decrypted);
      setLocalFeedback({
        manager: target.managerFeedback || "",
        hr: target.hrFeedback || "",
      });
    }
  }, [selectedPdi, myPdi, decryptedCache]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-hsf-brown-50">
        <Activity className="w-10 h-10 animate-spin text-hsf-brown-850" />
        <p className="mt-4 text-xs font-semibold text-hsf-brown-800 uppercase tracking-widest font-mono">
          Hospital São Francisco • Carregando...
        </p>
      </div>
    );
  }

  // Handle secure profile login check
  const handleLoginCheck = async (email: string) => {
    if (!currentUser) return;

    if (isOfflineDemo) {
      const stored = localStorage.getItem("hsf_offline_profiles");
      let list = stored ? JSON.parse(stored) : [];
      const profileMock = list.find((p: any) => p.email.toLowerCase() === email.toLowerCase());

      if (profileMock) {
        // Vincula o usuário offline
        const updatedProfile = { ...profileMock, userId: currentUser.uid };
        setProfile(updatedProfile);
        setCurrentLang(updatedProfile.language || "pt");
        showToast("Acesso Liberado no Modo de Demonstração!");
      } else {
        setAuthError("Acesso Restrito: Seu e-mail não está cadastrado. Solicite acesso à equipe de TI.");
      }
      return;
    }

    try {
      // Verifica no Supabase se a equipe de TI já cadastrou o e-mail
      const { data, error } = await supabase.from("user_profiles").select("*").eq("email", email).single();

      if (error || !data) {
        setAuthError("Acesso Restrito: Seu e-mail não foi encontrado na base de colaboradores. Entre em contato com a equipe de TI do Hospital São Francisco para liberar seu acesso.");
        return;
      }

      // Se encontrou, garantimos que o perfil carrega no sistema
      const profData = data as UserProfile;
      setProfile(profData);
      setCurrentLang(profData.language || "pt");
      showToast("Acesso Liberado com sucesso!");
    } catch (e) {
      console.error(e);
      setAuthError("Erro ao validar credenciais. Tente novamente ou contate a TI.");
    }
  };

  if (!profile) {
    return (
      <LoginScreen
        currentLang={currentLang}
        onLoginSuccess={handleLoginCheck}
        authError={authError}
        projectId="gen-lang-client-0746295906"
        isRetryingAuth={isRetryingAuth}
        onRetryAuth={handleRetryAuth}
        onActivateOfflineMode={handleActivateOfflineMode}
      />
    );
  }

  // Notifications control
  const unreadCount = notifications.filter((n) => !n.read).length;
  const toggleNotifMenu = () => setNotifMenuOpen(!notifMenuOpen);

  const markAllNotifsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    if (isOfflineDemo) {
      const storedNotifs = localStorage.getItem("hsf_offline_notifications");
      if (storedNotifs) {
        const list = JSON.parse(storedNotifs);
        const updated = list.map((n: any) => ({ ...n, read: true }));
        localStorage.setItem(
          "hsf_offline_notifications",
          JSON.stringify(updated),
        );
        setNotifications(updated);
      }
      return;
    }
    try {
      // In a real app we'd batch these
      await Promise.all(
        unreadIds.map((id) =>
          supabase.from("notifications").update({ read: true }).eq("id", id)
        ),
      );
    } catch {}
  };

  const markNotifRead = async (id: string) => {
    if (isOfflineDemo) {
      const storedNotifs = localStorage.getItem("hsf_offline_notifications");
      if (storedNotifs) {
        const list = JSON.parse(storedNotifs);
        const updated = list.map((n: any) =>
          n.id === id ? { ...n, read: true } : n,
        );
        localStorage.setItem(
          "hsf_offline_notifications",
          JSON.stringify(updated),
        );
        setNotifications(updated);
      }
      return;
    }
    try {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
    } catch (e) {
      console.warn(e);
    }
  };

  // Create PDI record
  const handleCreateNewPdi = async () => {
    const pdiId = `${currentUser.uid}_${selectedCycle}`;
    setSaveStatus("saving");

    // Encrypt empty strings initially
    const freshData: DecryptedPdiData = {
      strengths: "",
      improvements: "",
      shortTermGoals: "",
      longTermGoals: "",
      actionPlan: "",
    };
    const cipherText = await encryptText(JSON.stringify(freshData), passphrase);

    const newPdi: Pdi = {
      id: pdiId,
      userId: currentUser.uid,
      cycle: selectedCycle,
      coordinatorName: profile.name,
      department: "Serviço de Saúde HSF",
      hierarchy: profile.role === "colaborador" ? "Especialista" : "Gestor",
      managerId: "mock_hospital_lider", // Associa ao líder simulado
      status: "Rascunho",
      encryptedData: cipherText,
      managerFeedback: "",
      hrFeedback: "",
      updatedAt: Date.now(),
    };

    // Optimistic update for instant UI feedback
    setAllPdis((prev) => [newPdi, ...prev.filter((p) => p.id !== pdiId)]);
    setSelectedPdi(newPdi);

    if (isOfflineDemo) {
      const stored = localStorage.getItem("hsf_offline_pdimocks_v6");
      const list: Pdi[] = stored ? JSON.parse(stored) : [];
      const updatedList = [newPdi, ...list.filter((p) => p.id !== pdiId)];
      localStorage.setItem(
        "hsf_offline_pdimocks_v6",
        JSON.stringify(updatedList),
      );
      setSaveStatus("saved");
      showToast(
        "PDI 2026 inicializado com Criptografia de Ponta-a-Ponta localmente!",
      );
      return;
    }

    try {
      const updatePromise = supabase.from("pdis").upsert({ id: pdiId, user_id: currentUser.uid, ...newPdi });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout inicializando PDI")), 10000)
      );

      await Promise.race([updatePromise, timeoutPromise]);
      
      setSaveStatus("saved");
      showToast("PDI 2026 inicializado com Criptografia de Ponta-a-Ponta!");
    } catch (error: any) {
      setSaveStatus("error");
      console.error("Create PDI Error:", error);
      console.error(error);
    }
  };

  // Perform automatic real-time save trigger on fields
  const triggerAutoSave = async (updatedFields: Partial<DecryptedPdiData>) => {
    const targetPdi = selectedPdi || myPdi;
    if (!targetPdi || profile?.role !== "colaborador") return;
    setSaveStatus("saving");

    const currentDecrypted = decryptedCache[targetPdi.id] || {
      strengths: "",
      improvements: "",
      shortTermGoals: "",
      longTermGoals: "",
      actionPlan: "",
    };

    const merged = { ...currentDecrypted, ...updatedFields };

    try {
      // Encrypt client-side
      const ciphertext = await Promise.race([
        encryptText(JSON.stringify(merged), passphrase),
        new Promise<string>((_, reject) => setTimeout(() => reject(new Error("Timeout encrypting")), 3000))
      ]);

      let nextStatus = targetPdi.status;
      let statusChanged = false;
      if (nextStatus === "Rascunho") {
        const hasText = Object.values(merged).some(
          (v: any) => typeof v === "string" && v.trim() !== "",
        );
        if (hasText) {
          nextStatus = "Em Curso";
          statusChanged = true;
        }
      }

      const updatePayload: Partial<Pdi> = {
        encryptedData: ciphertext,
        updatedAt: Date.now(),
      };

      if (statusChanged) updatePayload.status = nextStatus;

      if (isOfflineDemo) {
        const stored = localStorage.getItem("hsf_offline_pdimocks_v6");
        const list: Pdi[] = stored ? JSON.parse(stored) : [];
        let finalUpdatedPdi: Pdi | null = null;
        const updatedList = list.map((p) => {
          if (p.id === targetPdi.id) {
            finalUpdatedPdi = { ...p, ...updatePayload };
            return finalUpdatedPdi;
          }
          return p;
        });

        if (finalUpdatedPdi) {
          localStorage.setItem(
            "hsf_offline_pdimocks_v6",
            JSON.stringify(updatedList),
          );
          if (selectedPdi) setSelectedPdi(finalUpdatedPdi);
          setAllPdis(updatedList);
        }
        setSaveStatus("saved");
        return;
      }

      const updatePromise = supabase.from("pdis").update(updatePayload).eq("id", targetPdi.id);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout autosalvando")), 10000)
      );

      await Promise.race([updatePromise, timeoutPromise]);

      setSaveStatus("saved");
    } catch (e: any) {
      console.error("AutoSave Error:", e);
      setSaveStatus("error");
      showToast("Erro no salvamento automático: " + (e.message || "Verifique a conexão."));
    }
  };

  // Update Status / Evaluate of a specific PDI
  const handleUpdateStatusAndFeedback = async (
    newStatus: Pdi["status"],
    managerFback?: string,
    hrFback?: string,
  ) => {
    const targetPdi = selectedPdi || myPdi;
    if (!targetPdi) return;
    setSaveStatus("saving");

    const updatePayload: Partial<Pdi> = {
      status: newStatus,
      updatedAt: Date.now(),
    };

    if (managerFback !== undefined)
      updatePayload.managerFeedback = managerFback;
    if (hrFback !== undefined) updatePayload.hrFeedback = hrFback;

    if (isOfflineDemo) {
      const stored = localStorage.getItem("hsf_offline_pdimocks_v6");
      const list: Pdi[] = stored ? JSON.parse(stored) : [];
      let finalUpdatedPdi: Pdi | null = null;
      const updatedList = list.map((p) => {
        if (p.id === targetPdi.id) {
          finalUpdatedPdi = { ...p, ...updatePayload };
          return finalUpdatedPdi;
        }
        return p;
      });

      if (finalUpdatedPdi) {
        localStorage.setItem(
          "hsf_offline_pdimocks_v6",
          JSON.stringify(updatedList),
        );
        if (selectedPdi) setSelectedPdi(finalUpdatedPdi);
        setAllPdis(updatedList);
      }

      if (profile?.role !== "colaborador") {
        const feedbackMsg = managerFback || hrFback || "Status alterado";
        const newNotif = {
          id: `notif_${Date.now()}`,
          userId: targetPdi.userId,
          title: `Atualização de Status: PDI ${targetPdi.cycle}`,
          message: `O status do seu PDI foi atualizado para [${newStatus}]. Faça login para ver mais detalhes.`,
          feedback: feedbackMsg,
          read: false,
          createdAt: Date.now(),
        };
        const storedNotifs = localStorage.getItem("hsf_offline_notifications");
        const notifs: any[] = storedNotifs ? JSON.parse(storedNotifs) : [];
        notifs.unshift(newNotif);
        localStorage.setItem(
          "hsf_offline_notifications",
          JSON.stringify(notifs),
        );
        setNotifications(notifs);
      }

      setSaveStatus("saved");
      if (profile?.role === "colaborador" && newStatus === "Aguardando Líder") {
        setShowSuccessModal(true);
      } else {
        showToast("Processo do profissional atualizado e assinado localmente!");
      }
      return;
    }

    try {
      const updatePromise = supabase.from("pdis").update(updatePayload).eq("id", targetPdi.id);

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout atingido conectando ao Firebase.")), 10000)
      );

      await Promise.race([updatePromise, timeoutPromise]);

      setSaveStatus("saved");
      const localUpdatedPdi = { ...targetPdi, ...updatePayload };
      if (selectedPdi) {
        setSelectedPdi(localUpdatedPdi);
      }
      setAllPdis((prev) => 
        prev.map((p) => p.id === targetPdi.id ? localUpdatedPdi : p)
      );

      // Secure access audit notification: Send real-time mail/notif to colleague
      if (profile?.role !== "colaborador") {
        const feedbackMsg = managerFback || hrFback || "Status alterado";
        await supabase.from("notifications").insert([{
          userId: targetPdi.userId,
          title: `Atualização de Status: PDI ${targetPdi.cycle}`,
          message: `O status do seu PDI foi atualizado para [${newStatus}]. Faça login para ver mais detalhes.`,
          feedback: feedbackMsg,
          read: false,
        }]);
      }
      if (profile?.role === "colaborador" && newStatus === "Aguardando Líder") {
        setShowSuccessModal(true);
      } else {
        showToast(
          "Processo do profissional atualizado e assinado auditavelmente!",
        );
      }
    } catch (e: any) {
      console.error("Erro ao atualizar status:", e);
      setSaveStatus("error");
      showToast("Falha ao enviar: " + (e.message || "Tente novamente."));
    }
  };

  // Add 1-on-1 Check-in notes
  const handleAddCheckIn = async (overridePdi?: Pdi | null, e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetPdi = overridePdi || selectedPdi || myPdi;
    if (!targetPdi || !newCheckin.trim()) return;
    setAddCheckinLoading(true);

    try {
      const encryptedNote = await encryptText(newCheckin.trim(), passphrase);
      const checkinId = `checkin_${Date.now()}`;

      const item: Checkin = {
        id: checkinId,
        date: Date.now(),
        authorName: profile?.name || "Colaborador",
        authorRole: profile?.role || "colaborador",
        encryptedNote,
        stressLevel: newStressLevel,
      };

      if (isOfflineDemo) {
        const storedCheckinsKey = `hsf_offline_checkins_${targetPdi.id}`;
        const stored = localStorage.getItem(storedCheckinsKey);
        const list: Checkin[] = stored ? JSON.parse(stored) : [];
        list.push(item);
        localStorage.setItem(storedCheckinsKey, JSON.stringify(list));

        // Update local checkinsCache
        setCheckinsCache((prev) => ({
          ...prev,
          [targetPdi.id]: [
            ...(prev[targetPdi.id] || []),
            { ...item, encryptedNote: newCheckin.trim() },
          ],
        }));

        setNewCheckin("");
        setNewStressLevel(3);

        if (profile?.role !== "colaborador") {
          const newNotif = {
            id: `notif_${Date.now()}`,
            userId: targetPdi.userId,
            title: "Nova nota de Alinhamento (1-on-1)",
            message: `${profile?.name} adicionou um registo contínuo ao seu ciclo de metas.`,
            read: false,
            createdAt: Date.now(),
          };
          const storedNotifs = localStorage.getItem(
            "hsf_offline_notifications",
          );
          const notifs: any[] = storedNotifs ? JSON.parse(storedNotifs) : [];
          notifs.unshift(newNotif);
          localStorage.setItem(
            "hsf_offline_notifications",
            JSON.stringify(notifs),
          );
          setNotifications(notifs);
        }

        showToast("Nota de acompanhamento selada e criptografada localmente!");
        setAddCheckinLoading(false);
        return;
      }

      await supabase.from("checkins").insert([{ ...item, pdi_id: targetPdi.id }]);
      setNewCheckin("");
      setNewStressLevel(3);

      // Notify other parties
      if (profile?.role !== "colaborador") {
        await supabase.from("notifications").insert([{
          userId: targetPdi.userId,
          title: "Nova nota de Alinhamento (1-on-1)",
          message: `${profile?.name} adicionou um registo contínuo ao seu ciclo de metas.`,
          read: false,
        }]);
      }
      showToast("Nota de acompanhamento selada e criptografada com sucesso!");
    } catch (e) {
      console.error(e);
    } finally {
      setAddCheckinLoading(false);
    }
  };

  const handleExecuteResetPdi = async () => {
    if (!pdiToReset) return;
    const targetPdiId = pdiToReset;
    setPdiToReset(null);

    try {
      if (isOfflineDemo) {
        const stored = localStorage.getItem("hsf_offline_pdimocks_v6");
        let list: Pdi[] = stored ? JSON.parse(stored) : [];
        list = list.filter(p => p.id !== targetPdiId);
        localStorage.setItem("hsf_offline_pdimocks_v6", JSON.stringify(list));
        setAllPdis(list);
        if (selectedPdi?.id === targetPdiId) {
          setSelectedPdi(null);
        }
        showToast("PDI reiniciado (excluído localmente) com sucesso!");
        return;
      }

      // If firebase
      await supabase.from("pdis").delete().eq("id", targetPdiId);
      if (selectedPdi?.id === targetPdiId) {
        setSelectedPdi(null);
      }
      showToast("PDI excluído e ciclo reiniciado com sucesso!");
    } catch (e: any) {
      console.error(e);
      showToast("Erro ao excluir PDI: " + (e.message || "Tente novamente."));
    }
  };

  // Generate automated goals using server-side Gemini API proxy route to keep key completely hidden
  const handleAiSmartGoals = async () => {
    setAiWarning("");
    if (!localFormData.improvements.trim()) {
      setAiWarning(t.aiWarning);
      return;
    }
    setAiGenerating(true);

    try {
      const res = await fetch("/api/ai-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          improvements: localFormData.improvements,
          language: currentLang,
        }),
      });
      const data = await res.json();
      if (data.short && data.long) {
        const updated = {
          ...localFormData,
          shortTermGoals: data.short,
          longTermGoals: data.long,
        };
        setLocalFormData(updated);
        await triggerAutoSave({
          shortTermGoals: data.short,
          longTermGoals: data.long,
        });
        showToast("Metas SMART personalizadas inseridas no plano!");
      }
    } catch (err) {
      console.error(err);
      setAiWarning(
        "Ocorreu um erro ao consultar o assistente de IA. Tente preencher manualmente.",
      );
    } finally {
      setAiGenerating(false);
    }
  };

  // Manual Backup Export: Downloads decrypted Pdi data and metadata to a text json file
  const handleExportBackup = () => {
    // Generate structural backup package
    const backupObj = {
      exportDate: new Date().toISOString(),
      profile: {
        name: profile.name,
        email: profile.email,
        role: profile.role,
        language: profile.language,
      },
      pdis: allPdis.map((p) => ({
        cycle: p.cycle,
        status: p.status,
        managerFeedback: p.managerFeedback,
        hrFeedback: p.hrFeedback,
        decrypted: decryptedCache[p.id] || null,
      })),
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `PDI_BACKUP_HSF_${profile.name.replace(/\s+/g, "_")}_${selectedCycle}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(t.backupSuccess);
  };

  // Backup Import: Restores document from JSON file
  const handleImportBackup = async (fileContent: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(fileContent);
      if (!parsed.pdis || !Array.isArray(parsed.pdis)) return false;

      if (isOfflineDemo) {
        const stored = localStorage.getItem("hsf_offline_pdimocks_v6");
        let list: Pdi[] = stored ? JSON.parse(stored) : [];

        for (const item of parsed.pdis) {
          if (item.decrypted) {
            const pdiId = `${currentUser.uid}_${item.cycle || "2026"}`;
            const ciphertext = await encryptText(
              JSON.stringify(item.decrypted),
              passphrase,
            );

            const newPdi: Pdi = {
              id: pdiId,
              userId: currentUser.uid,
              cycle: item.cycle || "2026",
              coordinatorName: profile.name,
              department: "Serviço de Saúde HSF (Restaurado)",
              hierarchy: "Especialista",
              managerId: "mock_hospital_lider",
              status: item.status || "Rascunho",
              encryptedData: ciphertext,
              managerFeedback: item.managerFeedback || "",
              hrFeedback: item.hrFeedback || "",
              updatedAt: Date.now(),
            };
            list = [newPdi, ...list.filter((p) => p.id !== pdiId)];
          }
        }
        localStorage.setItem("hsf_offline_pdimocks_v6", JSON.stringify(list));
        setAllPdis(list);
        return true;
      }

      for (const item of parsed.pdis) {
        if (item.decrypted) {
          const pdiId = `${currentUser.uid}_${item.cycle || "2026"}`;
          const ciphertext = await encryptText(
            JSON.stringify(item.decrypted),
            passphrase,
          );

          await supabase.from("pdis").upsert({
              id: pdiId,
              user_id: currentUser.uid,
              cycle: item.cycle || "2026",
              coordinatorName: profile.name,
              department: "Serviço de Saúde HSF (Restaurado)",
              hierarchy: "Especialista",
              managerId: "mock_hospital_lider",
              status: item.status || "Rascunho",
              encryptedData: ciphertext,
              managerFeedback: item.managerFeedback || "",
              hrFeedback: item.hrFeedback || "",
          });
        }
      }
      return true;
    } catch {
      return false;
    }
  };

  const targetPdiForDisabling = selectedPdi || myPdi;
  const isFormDisabled =
    profile.role !== "colaborador" ||
    ["Aguardando Líder", "Aguardando RH", "Aprovado Final"].includes(
      targetPdiForDisabling?.status || "",
    );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-teal-500/30 transition-colors duration-300">
      {/* Dynamic Toast Alerts */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] animate-bounce bg-slate-900 border border-slate-800 shadow-[0_0_20px_rgba(45,212,191,0.2)] text-teal-400 p-4 border-l-4 border-teal-505 rounded-xl max-w-sm flex items-center gap-3">
          <Shield className="w-5 h-5 text-teal-400 shrink-0" />
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Corporate Header */}
      <Header
        currentLang={currentLang}
        currentRole={profile.role}
        onRoleChange={(newRole) => {
          let newName = profile?.name || "";
          let newEmail = profile?.email || "";
          let newUserId = profile?.userId || "offline_user_id";

          if (newRole === "colaborador") {
            newName = "Pedro (Auxiliar)";
            newEmail = "pedro@saofrancisco.com.br";
            newUserId = "offline_user_id";
          } else if (newRole === "lider") {
            newName = "Rafael (Coordenador)";
            newEmail = "rafael@saofrancisco.com.br";
            newUserId = "mock_hospital_lider";
          } else if (newRole === "rh") {
            newName = "Márcia (RH)";
            newEmail = "marcia@saofrancisco.com.br";
            newUserId = "mock_hospital_rh";
          } else if (newRole === "ti") {
            newName = "João (TI)";
            newEmail = "joao@saofrancisco.com.br";
            newUserId = "mock_hospital_ti";
          } else if (newRole === "inovacao") {
            newName = "Marina (Inovação)";
            newEmail = "marina@saofrancisco.com.br";
            newUserId = "mock_hospital_inovacao";
          } else if (newRole === "sadt") {
            newName = "Daniela (SADT)";
            newEmail = "daniela@saofrancisco.com.br";
            newUserId = "mock_hospital_sadt";
          } else if (newRole === "atendimento") {
            newName = "Andréa (Atend.)";
            newEmail = "andrea@saofrancisco.com.br";
            newUserId = "mock_hospital_atendimento";
          } else if (newRole === "financeiro") {
            newName = "Johnny (Gerente)";
            newEmail = "johnny@saofrancisco.com.br";
            newUserId = "mock_hospital_financeiro";
          } else if (newRole === "faturamento") {
            newName = "Luis (Coord. Fat.)";
            newEmail = "luis@saofrancisco.com.br";
            newUserId = "mock_hospital_faturamento";
          } else if (newRole === "custos") {
            newName = "Victor (Coord. Custos e Controladoria)";
            newEmail = "victor@saofrancisco.com.br";
            newUserId = "mock_hospital_custos";
          } else if (newRole === "comercial") {
            newName = "Ingrid (Comercial)";
            newEmail = "ingrid@saofrancisco.com.br";
            newUserId = "mock_hospital_comercial";
          } else if (newRole === "marketing") {
            newName = "Bruno (Marketing)";
            newEmail = "bruno@saofrancisco.com.br";
            newUserId = "mock_hospital_marketing";
          } else if (newRole === "seguranca") {
            newName = "Samuel (Segurança)";
            newEmail = "samuel@saofrancisco.com.br";
            newUserId = "mock_hospital_seguranca";
          } else if (newRole === "diretor_administrativo") {
            newName = "Jociliano (Dir. Adm)";
            newEmail = "jociliano@saofrancisco.com.br";
            newUserId = "mock_hospital_diretor_adm";
          } else if (newRole === "diretor_geral") {
            newName = "Carlos (Dir. Geral)";
            newEmail = "carlos@saofrancisco.com.br";
            newUserId = "mock_hospital_diretor_geral";
          } else if (newRole === "apresentador") {
            newName = "Pedro Diogo (Apresentador)";
            newEmail = "pedrodiogo.mello@gmail.com";
            newUserId = "mock_hospital_apresentador";
          }

          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  role: newRole,
                  name: newName,
                  email: newEmail,
                  userId: newUserId,
                }
              : null,
          );
          setSelectedPdi(null);
          setActiveTab(getInitialTab(newRole));
        }}
        currentCycle={selectedCycle}
        onCycleChange={setSelectedCycle}
        unreadCount={unreadCount}
        userName={profile.name}
        onShowNotif={toggleNotifMenu}
        isOfflineDemo={isOfflineDemo}
        onExitOfflineDemo={handleExitOfflineMode}

        onLogout={() => {
          setProfile(null);
          localStorage.removeItem("hsf_pdi_offline_mode");
          setIsOfflineDemo(false);
          setAuthError(null);
        }}
      />

      {/* Premium Notifications Drawer */}
      {notifMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] transition-opacity"
            onClick={() => setNotifMenuOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 bottom-0 w-[85vw] sm:w-[400px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl z-[110] p-4 sm:p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] sm:pt-6 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 pb-4 border-b border-slate-800/80 gap-3 sm:gap-0 shrink-0">
              <div>
                <h3 className="font-display font-bold text-slate-100 text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-400" />
                  Central de Avisos
                </h3>
                {unreadCount > 0 && (
                  <p className="text-[10px] text-teal-400 mt-1 font-medium tracking-wide">
                    {unreadCount} aviso{unreadCount > 1 ? "s" : ""} não lido
                    {unreadCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                {"Notification" in window && pushPermission !== "denied" && (
                  <button
                    onClick={() => {
                      if (typeof navigator !== "undefined" && navigator.vibrate)
                        navigator.vibrate(50);
                      if (pushPermission === "granted") return;
                      Notification.requestPermission().then((p) => {
                        setPushPermission(p);
                        if (p === "granted") {
                          new Notification("Notificações Push Ativadas!", {
                            icon: "/icon.png",
                          });
                          if ("serviceWorker" in navigator) {
                            navigator.serviceWorker
                              .register("/sw.js")
                              .then((registration) => {
                                console.log(
                                  "ServiceWorker registration successful with scope: ",
                                  registration.scope,
                                );
                              })
                              .catch((err) => {
                                console.log(
                                  "ServiceWorker registration failed: ",
                                  err,
                                );
                              });
                          }
                        }
                      });
                    }}
                    className={`text-[9px] transition-all uppercase font-bold tracking-wider border px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                      pushPermission === "granted"
                        ? "text-teal-400 border-teal-500/30 bg-teal-500/10 cursor-default"
                        : "text-slate-400 hover:text-white border-slate-700 hover:bg-slate-800 cursor-pointer active:scale-95"
                    }`}
                  >
                    {pushPermission === "granted" ? (
                      <>
                        <Check className="w-3 h-3" /> Push Ativo
                      </>
                    ) : (
                      <>
                        <Bell className="w-3 h-3" /> Ativar Push
                      </>
                    )}
                  </button>
                )}
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotifsRead}
                    className="text-[10px] text-slate-400 hover:text-teal-400 transition-colors uppercase font-bold tracking-wider cursor-pointer flex items-center gap-1 px-1"
                  >
                    <Check className="w-3 h-3" /> Marcar Lidas
                  </button>
                )}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 custom-scrollbar pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-16 space-y-3 flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-2 shadow-inner border border-slate-700/50">
                    <Bell className="w-6 h-6 text-slate-500 opacity-50" />
                  </div>
                  <p className="text-sm text-slate-300 font-semibold tracking-wide">
                    Tudo em dia!
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Nenhuma atividade recente no seu ciclo.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotifRead(n.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      !n.read
                        ? "bg-slate-800/40 border-teal-500/30 shadow-[0_4px_20px_rgba(20,184,166,0.05)] hover:bg-slate-800/60"
                        : "bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/40"
                    }`}
                  >
                    {!n.read && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/80 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                    )}
                    <h4 className="text-[13px] font-bold text-slate-200 flex items-start justify-between gap-3">
                      <span className="flex items-start gap-2 leading-tight flex-1">
                        <AlertCircle
                          className={`w-4 h-4 shrink-0 mt-0.5 ${!n.read ? "text-teal-400" : "text-slate-500"}`}
                        />
                        <span className="tracking-wide">{n.title}</span>
                      </span>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)] shrink-0 mt-1 mr-1"></span>
                      )}
                    </h4>
                    <p
                      className={`text-[12px] mt-2.5 leading-relaxed pl-6 ${!n.read ? "text-slate-300" : "text-slate-400"}`}
                    >
                      {n.message}
                    </p>
                    {n.feedback && (
                      <div className="mt-3 ml-6 text-[11px] bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 text-teal-100 font-sans italic backdrop-blur-sm shadow-inner group-hover:border-slate-700 transition-colors">
                        <span className="font-semibold block mb-1 text-teal-400 uppercase tracking-wider text-[9px]">
                          Parecer do Gestor:
                        </span>
                        {n.feedback}
                      </div>
                    )}
                    <span className="text-[10px] text-slate-500 font-medium block mt-4 ml-6 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Clock className="w-3 h-3" />
                      {new Date(n.createdAt).toLocaleString(
                        currentLang === "en"
                          ? "en-US"
                          : currentLang === "es"
                            ? "es-ES"
                            : "pt-BR",
                        { dateStyle: "short", timeStyle: "short" },
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 shrink-0">
              <button
                onClick={() => setNotifMenuOpen(false)}
                className="w-full bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white py-3.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Grid View */}
      <div className={`flex-grow flex flex-col md:flex-row ${
        activeTab === "apresentacao" 
          ? "w-full" 
          : "max-w-[1600px] mx-auto w-full px-4 text-left md:px-6 py-6 gap-6 md:gap-8"
      }`}>
        {/* Sidebar Navigation (Desktop) */}
        {activeTab !== "apresentacao" && (
        <aside
          className={`hidden md:flex flex-col gap-3 shrink-0 border-r border-slate-800 pr-2 transition-all duration-300 relative ${
            isSidebarExpanded ? "w-44" : "w-[4rem]"
          }`}
        >
          <button
            onClick={() => {
              const newValue = !isSidebarExpanded;
              setIsSidebarExpanded(newValue);
              localStorage.setItem("hsf_sidebar_expanded", newValue.toString());
            }}
            className="absolute -right-3.5 top-3 bg-slate-900 border border-slate-700 rounded-full p-1.5 text-slate-400 hover:text-slate-100 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 hover:border-teal-500/50 hover:bg-slate-800"
            title={isSidebarExpanded ? "Ocultar Menu" : "Expandir Menu"}
          >
            {isSidebarExpanded ? (
              <ChevronLeft className="w-4 h-4 text-teal-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-teal-400" />
            )}
          </button>

          {isTabAllowed("metrics", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("metrics")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "metrics"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "People Analytics" : undefined}
            >
              <BarChart2 className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap flex leading-tight">People<br/>Analytics</span>
              )}
            </button>
          )}

          {isTabAllowed("avisos", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("avisos")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "avisos"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Mural de Avisos" : undefined}
            >
              <Megaphone className="w-[20px] h-[20px] shrink-0 text-teal-400" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap tracking-tighter">
                  Mural de Avisos
                </span>
              )}
            </button>
          )}

          {isTabAllowed("home", profile?.role || "") && (
            <button
              data-tour="nav-home"
              onClick={() => {
                setActiveTab("home");
                setSelectedPdi(null);
              }}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "home"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={
                !isSidebarExpanded
                  ? profile.role === "colaborador"
                    ? "Meu PDI"
                    : profile.role === "lider"
                      ? "Minha Equipe"
                      : "Monitorização"
                  : undefined
              }
            >
              <ClipboardList className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">
                  {profile.role === "colaborador"
                    ? "Meu PDI"
                    : profile.role === "lider"
                      ? "Minha Equipe"
                      : "Monitorização"}
                </span>
              )}
            </button>
          )}

          {isTabAllowed("apresentacao", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("apresentacao")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "apresentacao"
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Pitch / Reunião" : undefined}
            >
              <Rocket className="w-[20px] h-[20px] shrink-0 text-purple-400" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Pitch / Reunião</span>
              )}
            </button>
          )}

          {isTabAllowed("escala", profile?.role || "") && (
            <button
              data-tour="nav-escala"
              onClick={() => setActiveTab("escala")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "escala"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Escala" : undefined}
            >
              <Clock className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Escopo / Ponto</span>
              )}
            </button>
          )}

          {isTabAllowed("documentos", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("documentos")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "documentos"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Documentos" : undefined}
            >
              <FileText className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Documentos</span>
              )}
            </button>
          )}

          {isTabAllowed("holerite", profile?.role || "") && (
            <button
              data-tour="nav-holerite"
              onClick={() => setActiveTab("holerite")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "holerite"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? (profile?.role === "medico" ? "Repasses" : "Financeiro") : undefined}
            >
              <DollarSign className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">{profile?.role === "medico" ? "Repasses" : "Financeiro"}</span>
              )}
            </button>
          )}

          {isTabAllowed("assessment", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("assessment")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "assessment"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Avaliações" : undefined}
            >
              <Activity className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap tracking-tighter">
                  Avaliações
                </span>
              )}
            </button>
          )}

          {profile && ["rh", "lider", "colaborador"].includes(profile.role) && (
            <div className="pt-2 border-t border-slate-800/50 mt-2">
              <button
                onClick={() => setShowMoreTabs(!showMoreTabs)}
                className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  showMoreTabs ||
                  [
                    "recrutamento",
                    "vagas",
                    "climate",
                    "training",
                    "feedback",
                    "inovacao"
                  ].includes(activeTab)
                    ? "text-slate-100 bg-slate-900/40"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40"
                }`}
                title={!isSidebarExpanded ? "Mais Módulos" : undefined}
              >
                <MoreHorizontal className="w-[20px] h-[20px] shrink-0" />
                {isSidebarExpanded && (
                  <span className="whitespace-nowrap flex-grow text-left">
                    Mais Módulos
                  </span>
                )}
                {isSidebarExpanded &&
                  (showMoreTabs ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  ))}
              </button>

              {showMoreTabs && (
                <div className="flex flex-col gap-1 mt-1 pl-1">
                  {isTabAllowed("recrutamento", profile?.role || "") && (
                    <button
                      onClick={() => setActiveTab("recrutamento")}
                      className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        activeTab === "recrutamento"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                      }`}
                      title={!isSidebarExpanded ? "Recrutamento" : undefined}
                    >
                      <Users className="w-[20px] h-[20px] shrink-0" />
                      {isSidebarExpanded && (
                        <span className="whitespace-nowrap tracking-tighter">
                          Recrutamento
                        </span>
                      )}
                    </button>
                  )}
                  {isTabAllowed("vagas", profile?.role || "") && (
                    <button
                      onClick={() => setActiveTab("vagas")}
                      className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        activeTab === "vagas"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                      }`}
                      title={!isSidebarExpanded ? "Vagas Internas" : undefined}
                    >
                      <Briefcase className="w-[20px] h-[20px] shrink-0" />
                      {isSidebarExpanded && (
                        <span className="whitespace-nowrap tracking-tighter">
                          Vagas Internas
                        </span>
                      )}
                    </button>
                  )}
                  {isTabAllowed("inovacao", profile?.role || "") && (
                    <button
                      onClick={() => setActiveTab("inovacao")}
                      className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        activeTab === "inovacao"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                      }`}
                      title={!isSidebarExpanded ? "Hub de Inovação" : undefined}
                    >
                      <Lightbulb className="w-[20px] h-[20px] shrink-0" />
                      {isSidebarExpanded && (
                        <span className="whitespace-nowrap tracking-tighter">
                          Hub de Inovação
                        </span>
                      )}
                    </button>
                  )}
                  {isTabAllowed("climate", profile?.role || "") && (
                    <button
                      onClick={() => setActiveTab("climate")}
                      className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        activeTab === "climate"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                      }`}
                      title={!isSidebarExpanded ? "Clima eNPS" : undefined}
                    >
                      <Heart className="w-[20px] h-[20px] shrink-0" />
                      {isSidebarExpanded && (
                        <span className="whitespace-nowrap tracking-tighter">
                          Clima eNPS
                        </span>
                      )}
                    </button>
                  )}
                  {isTabAllowed("training", profile?.role || "") && (
                    <button
                      onClick={() => setActiveTab("training")}
                      className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        activeTab === "training"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                      }`}
                      title={!isSidebarExpanded ? "Treinamentos" : undefined}
                    >
                      <BookOpen className="w-[20px] h-[20px] shrink-0" />
                      {isSidebarExpanded && (
                        <span className="whitespace-nowrap tracking-tighter">
                          Treinamentos
                        </span>
                      )}
                    </button>
                  )}
                  {isTabAllowed("feedback", profile?.role || "") && (
                    <button
                      onClick={() => {
                        setTargetFeedbackEmployee(undefined);
                        setActiveTab("feedback");
                      }}
                      className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        activeTab === "feedback"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                      }`}
                      title={!isSidebarExpanded ? t.feedbackTab : undefined}
                    >
                      <MessageSquare className="w-[20px] h-[20px] shrink-0" />
                      {isSidebarExpanded && (
                        <span className="whitespace-nowrap">{t.feedbackTab}</span>
                      )}
                    </button>
                  )}

                  {isTabAllowed("sesmt", profile?.role || "") && (
                    <button
                      onClick={() => setActiveTab("sesmt")}
                      className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        activeTab === "sesmt"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                      }`}
                      title={!isSidebarExpanded ? "SESMT" : undefined}
                    >
                      <Shield className="w-[20px] h-[20px] shrink-0" />
                      {isSidebarExpanded && (
                        <span className="whitespace-nowrap truncate">
                          SESMT
                        </span>
                      )}
                    </button>
                  )}

                  {isTabAllowed("juridico", profile?.role || "") && (
                    <button
                      onClick={() => setActiveTab("juridico")}
                      className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        activeTab === "juridico"
                          ? "bg-[#693A32]/20 text-white border border-[#693A32]/35"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                      }`}
                      title={!isSidebarExpanded ? "Jurídico" : undefined}
                    >
                      <Scale className="w-[20px] h-[20px] shrink-0 text-[#A78177]" />
                      {isSidebarExpanded && (
                        <span className="whitespace-nowrap truncate">
                          Jurídico
                        </span>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      activeTab === "settings"
                        ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                    }`}
                    title={!isSidebarExpanded ? "Configurações" : undefined}
                  >
                    <Settings className="w-[20px] h-[20px] shrink-0" />
                    {isSidebarExpanded && (
                      <span className="whitespace-nowrap">Configurações</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {profile.role === "ti" && (
            <>
              <button
                onClick={() => setActiveTab("backup")}
                className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === "backup"
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                }`}
                title={!isSidebarExpanded ? t.backupTab : undefined}
              >
                <Lock className="w-[20px] h-[20px] shrink-0" />
                {isSidebarExpanded && (
                  <span className="whitespace-nowrap">{t.backupTab}</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("acessos")}
                className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === "acessos"
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                }`}
                title={!isSidebarExpanded ? "Acessos" : undefined}
              >
                <Shield className="w-[20px] h-[20px] shrink-0" />
                {isSidebarExpanded && (
                  <span className="whitespace-nowrap">Acessos</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === "logs"
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
                }`}
                title={!isSidebarExpanded ? "Arquitetura & Logs" : undefined}
              >
                <Database className="w-[20px] h-[20px] shrink-0" />
                {isSidebarExpanded && (
                  <span className="whitespace-nowrap tracking-tighter">
                    Arquitetura & Logs
                  </span>
                )}
              </button>
            </>
          )}

          {profile.role === "inovacao" && (
            <button
              onClick={() => setActiveTab("inovacao")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "inovacao"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Hub de Inovação" : undefined}
            >
              <Lightbulb className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Hub de Inovação</span>
              )}
            </button>
          )}
          {isTabAllowed("suprimentos", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("suprimentos")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "suprimentos"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Suprimentos & Logística" : undefined}
            >
              <Package className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Suprimentos</span>
              )}
            </button>
          )}

          {isTabAllowed("sadt", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("sadt")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "sadt"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "SADT" : undefined}
            >
              <Activity className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">SADT</span>
              )}
            </button>
          )}
          {isTabAllowed("atendimento", profile?.role || "") && (
            <button
               onClick={() => setActiveTab("atendimento")}
               className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                 activeTab === "atendimento"
                   ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                   : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
               }`}
               title={!isSidebarExpanded ? "Atendimento" : undefined}
             >
               <HeartHandshake className="w-[20px] h-[20px] shrink-0" />
               {isSidebarExpanded && (
                 <span className="whitespace-nowrap">Atendimento</span>
               )}
             </button>
           )}

          {isTabAllowed("caixa", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("caixa")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "caixa"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Visão Geral & Caixa" : undefined}
            >
              <Activity className="w-[20px] h-[20px] shrink-0 text-teal-400" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Visão Geral & Caixa</span>
              )}
            </button>
          )}

          {isTabAllowed("dre", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("dre")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "dre"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "DRE Gerencial" : undefined}
            >
              <FileText className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">DRE Gerencial</span>
              )}
            </button>
          )}

          {isTabAllowed("tesouraria", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("tesouraria")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "tesouraria"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Títulos & Tesouraria" : undefined}
            >
              <Landmark className="w-[20px] h-[20px] shrink-0 text-teal-400" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Títulos & Tesouraria</span>
              )}
            </button>
          )}

          {isTabAllowed("glosas", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("glosas")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "glosas"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Auditoria & Glosas" : undefined}
            >
              <ShieldCheck className="w-[20px] h-[20px] shrink-0 text-teal-400" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Auditoria & Glosas</span>
              )}
            </button>
          )}

          {isTabAllowed("faturamento", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("faturamento")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "faturamento"
                  ? "bg-teal-500/10 text-teal-500 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Faturamento e Glosas" : undefined}
            >
              <BarChart2 className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Faturamento e Glosas</span>
              )}
            </button>
          )}

          {isTabAllowed("kpis", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("kpis")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "kpis"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Cockpit de KPIs" : undefined}
            >
              <Activity className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Cockpit KPIs</span>
              )}
            </button>
          )}

          {isTabAllowed("simulador_custos", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("simulador_custos")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "simulador_custos"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Simulador" : undefined}
            >
              <Sliders className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Simulador</span>
              )}
            </button>
          )}

          {isTabAllowed("comercial", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("comercial")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "comercial"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Comercial" : undefined}
            >
              <TrendingUp className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Comercial</span>
              )}
            </button>
          )}

          {isTabAllowed("marketing", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("marketing")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "marketing"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Marketing" : undefined}
            >
              <Megaphone className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Marketing</span>
              )}
            </button>
          )}

          {isTabAllowed("seguranca", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("seguranca")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "seguranca"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Segurança do Trabalho" : undefined}
            >
              <HardHat className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Segurança do Trab.</span>
              )}
            </button>
          )}

          {isTabAllowed("diretor_administrativo", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("diretor_administrativo")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-2.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "diretor_administrativo"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-400/30 shadow-[0_0_12px_rgba(45,212,191,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Diretoria Adm." : undefined}
            >
              <Briefcase className="w-[18px] h-[18px] shrink-0 text-teal-400" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap text-teal-400">Cockpit Diretoria</span>
              )}
            </button>
          )}

          {isTabAllowed("diretor_geral", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("diretor_geral")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-2.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "diretor_geral"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Diretoria Geral" : undefined}
            >
              <Crown className="w-[18px] h-[18px] shrink-0 text-amber-400" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap text-amber-400">Cockpit Geral</span>
              )}
            </button>
          )}

          {isTabAllowed("network", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("network")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "network"
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Rede Social HSF" : undefined}
            >
              <HeartHandshake className="w-[20px] h-[20px] shrink-0 text-rose-400" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap tracking-tighter">
                  Comunidade HSF
                </span>
              )}
            </button>
          )}



          <div className="mt-auto pt-4 border-t border-slate-800/50">
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "settings"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }`}
              title={!isSidebarExpanded ? "Configurações" : undefined}
            >
              <Settings className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap tracking-tighter">
                  Configurações
                </span>
              )}
            </button>
          </div>
        </aside>
        )}

        {/* Dynamic Display Panels */}
        <section className={`flex-grow ${activeTab === "apresentacao" ? "" : "pb-24 md:pb-0"}`}>
          {activeTab === "escala" && (
            <TimeTrackingPanel
              userRole={profile.role}
              userName={profile.name}
            />
          )}

          {activeTab === "documentos" && (
            <CredentialingPipeline
              userRole={profile.role}
              userName={profile.name}
            />
          )}

          {activeTab === "holerite" && (
            <EmployeePortalPanel
              userName={profile.name}
              userRole={profile.role}
            />
          )}

          {activeTab === "metrics" && (
            <MetricsPanel allPdis={allPdis} cycle={selectedCycle} />
          )}

          {activeTab === "climate" && (
            <ClimateSurveyPanel
              userRole={profile.role}
              userName={profile.name}
            />
          )}

          {activeTab === "assessment" && (
            <AssessmentPanel userRole={profile.role} userName={profile.name} />
          )}

          {activeTab === "recrutamento" && <RecrutamentoPanel />}

          {activeTab === "vagas" && (
            <VagasPanel userRole={profile.role} userName={profile.name} />
          )}

          {activeTab === "inovacao" && (
            <InnovationPanel userRole={profile.role} userName={profile.name} />
          )}

          {activeTab === "suprimentos" && (
            <SuprimentosPanel userRole={profile.role} userName={profile.name} />
          )}

          {activeTab === "sadt" && (
            <SadtPanel userRole={profile.role} userName={profile.name} />
          )}

          {activeTab === "atendimento" && (
            <AtendimentoPanel userRole={profile.role} userName={profile.name} />
          )}

          {["financeiro", "caixa", "tesouraria", "glosas", (profile.role === "financeiro" ? "dre" : "")].includes(activeTab) && (
            <FinanceiroPanel 
              userRole={profile.role} 
              userName={profile.name} 
              currentTab={activeTab === "financeiro" ? "caixa" : activeTab as any} 
              onTabChange={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "faturamento" && (
            <FaturamentoPanel userRole={profile.role} userName={profile.name} />
          )}

          {(activeTab === "dre" || activeTab === "kpis" || activeTab === "simulador_custos") && profile.role !== "financeiro" && (
            <CustosPanel userRole={profile.role} userName={profile.name} activeTab={activeTab} />
          )}

          {activeTab === "comercial" && (
            <ComercialPanel userRole={profile.role} userName={profile.name} />
          )}

          {activeTab === "marketing" && (
            <MarketingPanel userRole={profile.role} userName={profile.name} />
          )}

          {activeTab === "seguranca" && (
            <SegurancaTrabalhoPanel userRole={profile.role} userName={profile.name} />
          )}

          {activeTab === "diretor_administrativo" && (
            <DiretoriaAdministrativaPanel userRole={profile.role} userName={profile.name} />
          )}

          {activeTab === "diretor_geral" && (
            <DiretoriaGeralPanel userRole={profile.role} userName={profile.name} />
          )}

          {activeTab === "settings" && (
            <SettingsPanel userName={profile.name} userRole={profile.role} />
          )}

          {activeTab === "apresentacao" && (
            <PresentationView />
          )}

          {activeTab === "sesmt" && (
            <SesmtPanel
              userRole={profile.role}
              userName={profile.name}
            />
          )}

          {activeTab === "juridico" && (
            <JuridicoPanel
              userRole={profile.role}
              userName={profile.name}
            />
          )}

          {activeTab === "network" && profile && (
            <NetworkPanel currentUser={profile} />
          )}

          {activeTab === "avisos" && (
            <AvisosPanel
              userId={currentUser?.uid || "colaborador-id"}
              userRole={profile?.role || "colaborador"}
              userName={profile?.name || "Colaborador"}
            />
          )}

          {activeTab === "backup" && (
            <BackupPanel
              currentLang={currentLang}
              onLangChange={setCurrentLang}
              passphrase={passphrase}
              onPassphraseChange={handlePassphraseChange}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
            />
          )}

          {activeTab === "acessos" && <TIAccessPanel />}

          {activeTab === "logs" && <TILogsPanel />}

          {activeTab === "feedback" && (
            <FeedbackPanel
              currentLang={currentLang}
              userId={currentUser.uid}
              userName={profile.name}
              userRole={profile.role}
              preSelectedEmployee={targetFeedbackEmployee}
            />
          )}

          {activeTab === "training" && (
            <TrainingPanel userName={profile.name} userRole={profile.role} />
          )}

          {activeTab === "home" && (
            <>
              {/* Profile - Colaborador Home */}
              {profile.role === "colaborador" && (
                <div>
                  {!myPdi ? (
                    <div className="text-center py-20 card-gradient border border-slate-800 rounded-3xl max-w-xl mx-auto space-y-6 glow-border">
                      <div className="w-20 h-20 bg-teal-500/10 border border-teal-500/20 mx-auto rounded-full flex items-center justify-center text-teal-400">
                        <ClipboardList className="w-10 h-10 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-display font-bold text-xl text-slate-100">
                          {t.emptyPdiTitle}
                        </h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
                          {t.emptyPdiSubtitle.replace("{year}", selectedCycle)}
                        </p>
                      </div>
                      <button
                        onClick={handleCreateNewPdi}
                        className="hidden md:inline-flex bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(45,212,191,0.25)] transition-all items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-slate-950" />
                        {t.createPdiBtn.replace("{year}", selectedCycle)}
                      </button>

                      {/* Floating Action Button (Mobile) */}
                      <button
                        onClick={handleCreateNewPdi}
                        className="md:hidden fixed bottom-20 right-4 bg-teal-500 text-slate-950 px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgba(45,212,191,0.3)] flex items-center gap-2 z-40 active:scale-95 transition-transform"
                      >
                        <Plus className="w-5 h-5 text-slate-950" />
                        <span className="font-bold text-sm tracking-wide">
                          Novo PDI
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full xl:max-w-7xl mx-auto space-y-6">
                      {/* Active collaborator PDI header */}
                      <div className="card-gradient p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left glow-border animate-fade-in">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-slate-100 flex items-center gap-2">
                            {t.title}
                            <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/30 py-0.5 px-2 rounded-md font-black tracking-widest uppercase">
                              {selectedCycle}
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                            Responsável: {profile.name} (Eu) • Hospital São
                            Francisco na Providência de Deus
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] uppercase bg-teal-500/10 text-teal-450 border border-teal-500/30 px-2 py-1 rounded font-extrabold tracking-wider">
                              {myPdi.status}
                            </span>
                            {saveStatus === "saving" && (
                              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin text-teal-450" />
                                Salvando...
                              </span>
                            )}
                            {saveStatus === "saved" && (
                              <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                                ✓ {t.savedSecurely}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPdiToReset(myPdi.id)}
                            className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                            Reiniciar Avaliação
                          </button>
                          {["Aprovado Final", "Aguardando RH"].includes(
                            myPdi.status,
                          ) && (
                            <button
                              onClick={() => window.print()}
                              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                            >
                              <Printer className="w-4 h-4 text-slate-400" />
                              {t.exportPdfBtn}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Decryption status info banner */}
                      <div className="bg-teal-500/5 border border-teal-500/25 rounded-xl p-4 flex items-start gap-2.5">
                        <Shield className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed text-left font-sans">
                          Este PDI está criptografado de ponta-a-ponta na nuvem
                          do Hospital utilizando sua chave secreta local. Suas
                          metas e feedbacks de 1-on-1 estão seguros contra
                          leituras externas.
                        </p>
                      </div>

                      {/* Main editable Form fields */}
                      <FormEditor
                        localFormData={localFormData}
                        setLocalFormData={setLocalFormData}
                        isFormDisabled={isFormDisabled}
                        triggerAutoSave={triggerAutoSave}
                        saveStatus={saveStatus}
                        t={t}
                        currentLang={currentLang}
                        handleAiSmartGoals={handleAiSmartGoals}
                        aiGenerating={aiGenerating}
                        aiWarning={aiWarning}
                        selectedPdi={myPdi}
                        localFeedback={localFeedback}
                        checkins={checkinsCache[myPdi.id] || []}
                        newCheckin={newCheckin}
                        setNewCheckin={setNewCheckin}
                        newStressLevel={newStressLevel}
                        setNewStressLevel={setNewStressLevel}
                        handleAddCheckIn={handleAddCheckIn}
                        addCheckinLoading={addCheckinLoading}
                        profile={profile}
                        onUpdateStatus={() =>
                          handleUpdateStatusAndFeedback("Aguardando Líder")
                        }
                      />

                      {/* Printable Template invisible in screen layout */}
                      <PrintableTemplate
                        pdi={myPdi}
                        decrypted={decryptedCache[myPdi.id]}
                        t={t}
                        checkins={checkinsCache[myPdi.id] || []}
                        currentUserName={profile.name}
                        currentUserRole={profile.role}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Profile - Líder direct reports panel */}
              {profile.role === "lider" && (
                <div className="space-y-6">
                  {selectedEmployeeProfile ? (
                    <EmployeeProfileView
                      employeePdi={selectedEmployeeProfile}
                      onBack={() => setSelectedEmployeeProfile(null)}
                      assessmentInfo={getEmployeeAssessmentInfo(
                        selectedEmployeeProfile.coordinatorName,
                      )}
                      checkins={checkinsCache[selectedEmployeeProfile.id] || []}
                    />
                  ) : selectedPdi ? (
                    <div className="w-full xl:max-w-7xl mx-auto space-y-4 text-left">
                      {/* Navigate back link */}
                      <button
                        onClick={() => setSelectedPdi(null)}
                        className="flex items-center gap-1 text-xs font-bold text-teal-400 hover:underline cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 text-teal-400" />
                        Voltar para os Liderados
                      </button>

                      {/* Review details header banner */}
                      <div className="card-gradient p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glow-border">
                        <div>
                          <h3 className="font-display font-semibold text-base text-slate-100 flex items-center gap-2">
                            Avaliação: {selectedPdi.coordinatorName}{" "}
                            {selectedPdi.userId === currentUser?.uid
                              ? "(Eu)"
                              : ""}
                            <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/30 py-0.5 px-2 rounded-md font-black tracking-widest uppercase">
                              {selectedCycle}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5 font-sans">
                            Hierarquia: {selectedPdi.hierarchy} •{" "}
                            {selectedPdi.department}
                          </p>
                          <div className="mt-2.5 flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded tracking-wider">
                              {selectedPdi.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPdiToReset(selectedPdi.id)}
                            className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors cursor-pointer shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                            Reiniciar
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-205 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors cursor-pointer shadow-md"
                          >
                            <Printer className="w-4 h-4 text-slate-400" />
                            {t.exportPdfBtn}
                          </button>
                        </div>
                      </div>

                      {/* Read fields editor - disabled */}
                      <FormEditor
                        localFormData={localFormData}
                        setLocalFormData={setLocalFormData}
                        isFormDisabled={true}
                        triggerAutoSave={triggerAutoSave}
                        saveStatus={saveStatus}
                        t={t}
                        currentLang={currentLang}
                        handleAiSmartGoals={() => {}}
                        aiGenerating={false}
                        aiWarning=""
                        selectedPdi={selectedPdi}
                        localFeedback={localFeedback}
                        checkins={checkinsCache[selectedPdi.id] || []}
                        newCheckin={newCheckin}
                        setNewCheckin={setNewCheckin}
                        newStressLevel={newStressLevel}
                        setNewStressLevel={setNewStressLevel}
                        handleAddCheckIn={handleAddCheckIn}
                        addCheckinLoading={addCheckinLoading}
                        profile={profile}
                        onUpdateStatus={() => {}}
                      />

                      {/* Leader Review feedback inputs */}
                      {selectedPdi.status === "Aguardando Líder" && (
                        <div className="card-gradient p-6 rounded-2xl border border-slate-800 space-y-4 glow-border">
                          <h4 className="font-display font-semibold text-slate-200 text-sm">
                            {t.pdiSec4}
                          </h4>
                          <textarea
                            value={localFeedback.manager}
                            onChange={(e) =>
                              setLocalFeedback((prev) => ({
                                ...prev,
                                manager: e.target.value,
                              }))
                            }
                            placeholder="Alinhe ações institucionais e sugira revisões se necessário..."
                            className="w-full bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl p-4 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 resize-none h-28 text-slate-100 placeholder-slate-400 shadow-sm"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() =>
                                handleUpdateStatusAndFeedback(
                                  "Em Revisão",
                                  localFeedback.manager,
                                )
                              }
                              className="bg-teal-500/10 border border-teal-200/20 hover:bg-teal-500/20 text-teal-455 px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all shadow-sm cursor-pointer"
                            >
                              {t.requestRevision}
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatusAndFeedback(
                                  "Aguardando RH",
                                  localFeedback.manager,
                                )
                              }
                              className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(45,212,191,0.25)] cursor-pointer"
                            >
                              {t.approveSendToHr}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Printable template */}
                      <PrintableTemplate
                        pdi={selectedPdi}
                        decrypted={decryptedCache[selectedPdi.id]}
                        t={t}
                        checkins={checkinsCache[selectedPdi.id] || []}
                        currentUserName={profile.name}
                        currentUserRole={profile.role}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <div className="border-b border-slate-800 pb-3 font-sans">
                        <h2 className="font-display font-semibold text-lg text-slate-100">
                          {t.myTeamTitle}
                        </h2>
                        <p className="text-xs text-slate-400">
                          {t.myTeamSubtitle}
                        </p>
                      </div>

                      {myTeamPdis.length === 0 ? (
                        <p className="text-center text-slate-500 py-10 text-xs font-sans">
                          Nenhum colaborador direto possui processos iniciados
                          neste ciclo.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {myTeamPdis.map((p) => {
                            const assessment = getEmployeeAssessmentInfo(
                              p.coordinatorName,
                            );
                            return (
                              <div
                                key={p.id}
                                className="card-gradient border border-slate-800 hover:border-teal-500/30 active:scale-[0.98] active:bg-slate-900/80 p-5 rounded-2xl transition-all hover:shadow-[0_0_15px_rgba(45,212,191,0.06)] space-y-4 text-left flex flex-col justify-between glow-border relative"
                              >
                                <div className="space-y-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-display font-semibold text-slate-250 text-sm">
                                      {p.coordinatorName}
                                    </h4>
                                    {assessment ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-teal-400 font-bold lowercase">
                                          media nota{" "}
                                          {assessment.score.replace(".", ",")}
                                        </span>
                                        <span className="text-[11px] text-teal-400 font-bold lowercase">
                                          {assessment.label}
                                        </span>
                                      </div>
                                    ) : (
                                      <span
                                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border ${
                                          p.status === "Aprovado Final"
                                            ? "bg-teal-500/10 text-teal-400 border-teal-500/25"
                                            : "bg-slate-955 text-slate-400 border-slate-805"
                                        }`}
                                      >
                                        {p.status}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-450 font-sans">
                                    Departamento: {p.department} •{" "}
                                    {p.hierarchy || "Colaborador"}
                                  </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 pt-3 mt-auto border-t border-slate-805">
                                  <button
                                    onClick={() => setSelectedPdi(p)}
                                    className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg bg-transparent border border-slate-700 text-slate-300 hover:text-teal-400 hover:border-teal-500 transition-colors"
                                  >
                                    pdi
                                  </button>
                                  <button
                                    onClick={() => setActiveTab("assessment")}
                                    className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg bg-transparent border border-slate-700 text-slate-300 hover:text-teal-400 hover:border-teal-500 transition-colors"
                                  >
                                    adc
                                  </button>
                                  <button
                                    onClick={() => {
                                      setTargetFeedbackEmployee(
                                        p.coordinatorName,
                                      );
                                      setSelectedPdi(null);
                                      setActiveTab("feedback");
                                    }}
                                    className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg bg-transparent border border-slate-700 text-slate-300 hover:text-teal-400 hover:border-teal-500 transition-colors"
                                  >
                                    feedback
                                  </button>

                                  <div className="ml-auto">
                                    <button
                                      onClick={() =>
                                        setSelectedEmployeeProfile(p)
                                      }
                                      className="text-teal-500 hover:text-teal-400 text-xs font-semibold lowercase flex items-center gap-1 bg-teal-500/5 hover:bg-teal-500/10 px-3 py-1.5 rounded-lg transition-colors border border-teal-500/10"
                                    >
                                      ver perfil completo
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Profile - Recursos Humanos Global dashboard */}
              {profile.role === "rh" && (
                <div className="space-y-6">
                  {selectedEmployeeProfile ? (
                    <EmployeeProfileView
                      employeePdi={selectedEmployeeProfile}
                      onBack={() => setSelectedEmployeeProfile(null)}
                      assessmentInfo={getEmployeeAssessmentInfo(
                        selectedEmployeeProfile.coordinatorName,
                      )}
                      checkins={checkinsCache[selectedEmployeeProfile.id] || []}
                    />
                  ) : selectedPdi ? (
                    <div className="w-full xl:max-w-7xl mx-auto space-y-4 text-left">
                      {/* Back to list */}
                      <button
                        onClick={() => setSelectedPdi(null)}
                        className="flex items-center gap-1 text-xs font-bold text-teal-400 hover:underline cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 text-teal-400" />
                        Voltar à Monitorização Global
                      </button>

                      {/* Selected Pdi information */}
                      <div className="card-gradient p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glow-border text-left">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-slate-100 font-sans flex items-center gap-2">
                            Processo: {selectedPdi.coordinatorName}{" "}
                            {selectedPdi.userId === currentUser?.uid
                              ? "(Eu)"
                              : ""}
                            <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/30 py-0.5 px-2 rounded-md font-black tracking-widest uppercase">
                              {selectedCycle}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Vínculo: {selectedPdi.department} •{" "}
                            {selectedPdi.hierarchy}
                          </p>
                          <div className="mt-2.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/25">
                              {selectedPdi.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPdiToReset(selectedPdi.id)}
                            className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                            Reiniciar
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-205 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                          >
                            <Printer className="w-4 h-4 text-slate-400" />
                            {t.exportPdfBtn}
                          </button>
                        </div>
                      </div>

                      {/* Display read fields */}
                      <FormEditor
                        localFormData={localFormData}
                        setLocalFormData={setLocalFormData}
                        isFormDisabled={true}
                        triggerAutoSave={triggerAutoSave}
                        saveStatus={saveStatus}
                        t={t}
                        currentLang={currentLang}
                        handleAiSmartGoals={() => {}}
                        aiGenerating={false}
                        aiWarning=""
                        selectedPdi={selectedPdi}
                        localFeedback={localFeedback}
                        checkins={checkinsCache[selectedPdi.id] || []}
                        newCheckin={newCheckin}
                        setNewCheckin={setNewCheckin}
                        newStressLevel={newStressLevel}
                        setNewStressLevel={setNewStressLevel}
                        handleAddCheckIn={handleAddCheckIn}
                        addCheckinLoading={addCheckinLoading}
                        profile={profile}
                        onUpdateStatus={() => {}}
                      />

                      {/* Admin RH evaluations control inputs */}
                      {selectedPdi.status === "Aguardando RH" && (
                        <div className="card-gradient p-6 rounded-2xl border border-slate-800 space-y-4 glow-border text-left">
                          <h4 className="font-display font-semibold text-slate-200 text-sm font-sans">
                            {t.pdiSec5}
                          </h4>
                          <textarea
                            value={localFeedback.hr}
                            onChange={(e) =>
                              setLocalFeedback((prev) => ({
                                ...prev,
                                hr: e.target.value,
                              }))
                            }
                            placeholder="Adicione um parecer corporativo de conformidade de RH..."
                            className="w-full bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl p-4 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 resize-none h-28 text-slate-100 placeholder-slate-400 shadow-sm"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() =>
                                handleUpdateStatusAndFeedback(
                                  "Em Revisão",
                                  undefined,
                                  localFeedback.hr,
                                )
                              }
                              className="bg-teal-500/10 border border-teal-500/25 hover:bg-teal-500/20 text-teal-455 px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all shadow-sm cursor-pointer"
                            >
                              Devolver para Ajustes
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatusAndFeedback(
                                  "Aprovado Final",
                                  undefined,
                                  localFeedback.hr,
                                )
                              }
                              className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(45,212,191,0.25)] flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-4 h-4 text-slate-955" />
                              {t.approveFinal}
                            </button>
                          </div>
                        </div>
                      )}

                      <PrintableTemplate
                        pdi={selectedPdi}
                        decrypted={decryptedCache[selectedPdi.id]}
                        t={t}
                        checkins={checkinsCache[selectedPdi.id] || []}
                        currentUserName={profile.name}
                        currentUserRole={profile.role}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4 text-left font-sans animate-fade-in">
                      {/* Search filters and search */}
                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                          <h2 className="font-display font-semibold text-lg text-slate-100">
                            {t.hrGlobalTitle}
                          </h2>
                          <p className="text-xs text-slate-400">
                            {t.hrGlobalSubtitle}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder={t.searchPlaceholder}
                              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs w-full sm:w-56 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <select
                            value={filterHierarchy}
                            onChange={(e) => setFilterHierarchy(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-slate-205 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-teal-500 cursor-pointer"
                          >
                            <option value="Todos">{t.allHierarchies}</option>
                            <option value="Diretor">{t.hDir}</option>
                            <option value="Gestor">{t.hGestor}</option>
                            <option value="Coordenador">{t.hCoord}</option>
                            <option value="Supervisor">{t.hSup}</option>
                            <option value="Especialista">{t.hEsp}</option>
                            <option value="Técnico">{t.hTec}</option>
                          </select>
                        </div>
                      </div>

                      {/* Display PDIs in card format */}
                      {filteredPdis.length === 0 ? (
                        <p className="text-center text-slate-500 py-10 text-xs font-sans">
                          Nenhum plano corresponde aos filtros aplicados.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {filteredPdis.map((p) => {
                            const assessment = getEmployeeAssessmentInfo(
                              p.coordinatorName,
                            );
                            return (
                              <div
                                key={p.id}
                                className="card-gradient border border-slate-800 hover:border-teal-500/30 active:scale-[0.98] active:bg-slate-900/80 p-5 rounded-2xl transition-all hover:shadow-[0_0_15px_rgba(45,212,191,0.06)] space-y-4 text-left flex flex-col justify-between glow-border relative"
                              >
                                <div className="space-y-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-display font-semibold text-slate-250 text-sm">
                                      {p.coordinatorName}
                                    </h4>
                                    {assessment ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-teal-400 font-bold lowercase">
                                          media nota{" "}
                                          {assessment.score.replace(".", ",")}
                                        </span>
                                        <span className="text-[11px] text-teal-400 font-bold lowercase">
                                          {assessment.label}
                                        </span>
                                      </div>
                                    ) : (
                                      <span
                                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border ${
                                          p.status === "Aprovado Final"
                                            ? "bg-teal-500/10 text-teal-400 border-teal-500/25"
                                            : "bg-slate-955 text-slate-400 border-slate-805"
                                        }`}
                                      >
                                        {p.status}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-450 font-sans">
                                    Departamento: {p.department} •{" "}
                                    {p.hierarchy || "Colaborador"}
                                  </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 pt-3 mt-auto border-t border-slate-805">
                                  <button
                                    onClick={() => setSelectedPdi(p)}
                                    className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg bg-transparent border border-slate-700 text-slate-300 hover:text-teal-400 hover:border-teal-500 transition-colors"
                                  >
                                    pdi
                                  </button>
                                  <button
                                    onClick={() => setActiveTab("assessment")}
                                    className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg bg-transparent border border-slate-700 text-slate-300 hover:text-teal-400 hover:border-teal-500 transition-colors"
                                  >
                                    adc
                                  </button>
                                  <button
                                    onClick={() => {
                                      setTargetFeedbackEmployee(
                                        p.coordinatorName,
                                      );
                                      setSelectedPdi(null);
                                      setActiveTab("feedback");
                                    }}
                                    className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg bg-transparent border border-slate-700 text-slate-300 hover:text-teal-400 hover:border-teal-500 transition-colors"
                                  >
                                    feedback
                                  </button>

                                  <div className="ml-auto">
                                    <button
                                      onClick={() =>
                                        setSelectedEmployeeProfile(p)
                                      }
                                      className="text-teal-500 hover:text-teal-400 text-xs font-semibold lowercase flex items-center gap-1 bg-teal-500/5 hover:bg-teal-500/10 px-3 py-1.5 rounded-lg transition-colors border border-teal-500/10"
                                    >
                                      ver perfil completo
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Mobile Bottom Navigation */}
      {activeTab !== "apresentacao" && (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-md border-t border-slate-900 z-50 elevation-16 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-[72px] w-full px-2">
          {profile?.role === "medico" ? (
            <>
              {isTabAllowed("escala", profile.role) && (
                <button
                  data-tour="nav-escala"
                  onClick={() => setActiveTab("escala")}
                  className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
                >
                  <div
                    className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "escala" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                  >
                    <Clock className="w-[22px] h-[22px]" />
                  </div>
                  <span
                    className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "escala" ? "text-teal-400" : "text-slate-500"}`}
                  >
                    Ponto
                  </span>
                </button>
              )}

              {isTabAllowed("documentos", profile.role) && (
                <button
                  onClick={() => setActiveTab("documentos")}
                  className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
                >
                  <div
                    className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "documentos" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                  >
                    <FileText className="w-[22px] h-[22px]" />
                  </div>
                  <span
                    className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "documentos" ? "text-teal-400" : "text-slate-500"}`}
                  >
                    Docs
                  </span>
                </button>
              )}

              {isTabAllowed("holerite", profile.role) && (
                <button
                  data-tour="nav-holerite"
                  onClick={() => setActiveTab("holerite")}
                  className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
                >
                  <div
                    className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "holerite" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                  >
                    <DollarSign className="w-[22px] h-[22px]" />
                  </div>
                  <span
                    className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "holerite" ? "text-teal-400" : "text-slate-500"}`}
                  >
                    {profile?.role === "medico" ? "Repasses" : "Financeiro"}
                  </span>
                </button>
              )}

              {isTabAllowed("avisos", profile.role) && (
                <button
                  onClick={() => setActiveTab("avisos")}
                  className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
                >
                  <div
                    className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "avisos" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                  >
                    <Megaphone className="w-[22px] h-[22px]" />
                  </div>
                  <span
                    className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "avisos" ? "text-teal-400" : "text-slate-500"} text-center leading-tight`}
                  >
                    Mural
                  </span>
                </button>
              )}

              {isTabAllowed("settings", profile.role) && (
                <button
                  onClick={() => setActiveTab("settings")}
                  className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
                >
                  <div
                    className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "settings" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                  >
                    <Settings className="w-[22px] h-[22px]" />
                  </div>
                  <span
                    className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "settings" ? "text-teal-400" : "text-slate-500"}`}
                  >
                    Config
                  </span>
                </button>
              )}
            </>
          ) : (
            <>
              {isTabAllowed("avisos", profile?.role || "") && (
                <button
                  onClick={() => setActiveTab("avisos")}
                  className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
                >
                  <div
                    className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "avisos" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                  >
                    <Megaphone className="w-[22px] h-[22px]" />
                  </div>
                  <span
                    className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "avisos" ? "text-teal-400" : "text-slate-500"} text-center leading-tight`}
                  >
                    Mural
                  </span>
                </button>
              )}

          {isTabAllowed("escala", profile?.role || "") && (
            <button
              data-tour="nav-escala"
              onClick={() => setActiveTab("escala")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "escala" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Clock className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "escala" ? "text-teal-400" : "text-slate-500"}`}
              >
                Ponto
              </span>
            </button>
          )}

          {isTabAllowed("apresentacao", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("apresentacao")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "apresentacao" ? "bg-purple-500/15 text-purple-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Rocket className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "apresentacao" ? "text-purple-400" : "text-slate-500"}`}
              >
                Pitch
              </span>
            </button>
          )}

          {isTabAllowed("home", profile?.role || "") && (
            <button
              data-tour="nav-home"
              onClick={() => {
                setActiveTab("home");
                setSelectedPdi(null);
              }}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "home" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <ClipboardList className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "home" ? "text-teal-400" : "text-slate-500"} text-center leading-tight`}
              >
                {profile?.role === "colaborador"
                  ? "Meu PDI"
                  : profile?.role === "lider"
                    ? "Minha Equipe"
                    : "Monitorização"}
              </span>
            </button>
          )}

          {isTabAllowed("assessment", profile?.role || "") && (
            <button
              data-tour="nav-assessment"
              onClick={() => setActiveTab("assessment")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "assessment" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Activity className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "assessment" ? "text-teal-400" : "text-slate-500"}`}
              >
                Avaliação
              </span>
            </button>
          )}

          {isTabAllowed("feedback", profile?.role || "") && (
            <button
              data-tour="nav-feedback"
              onClick={() => {
                setTargetFeedbackEmployee(undefined);
                setActiveTab("feedback");
              }}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "feedback" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <MessageSquare className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "feedback" ? "text-teal-400" : "text-slate-500"}`}
              >
                Feedbacks
              </span>
            </button>
          )}

          {profile.role === "ti" && (
            <>
              <button
                onClick={() => setActiveTab("backup")}
                className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
              >
                <div
                  className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "backup" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                >
                  <Lock className="w-[22px] h-[22px]" />
                </div>
                <span
                  className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "backup" ? "text-teal-400" : "text-slate-500"}`}
                >
                  Segurança
                </span>
              </button>

              <button
                onClick={() => setActiveTab("acessos")}
                className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
              >
                <div
                  className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "acessos" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                >
                  <Shield className="w-[22px] h-[22px]" />
                </div>
                <span
                  className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "acessos" ? "text-teal-400" : "text-slate-500"}`}
                >
                  Acessos
                </span>
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
              >
                <div
                  className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "logs" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                >
                  <Database className="w-[22px] h-[22px]" />
                </div>
                <span
                  className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "logs" ? "text-teal-400" : "text-slate-500"}`}
                >
                  Logs
                </span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
              >
                <div
                  className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "settings" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                >
                  <Settings className="w-[22px] h-[22px]" />
                </div>
                <span
                  className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "settings" ? "text-teal-400" : "text-slate-500"}`}
                >
                  Config
                </span>
              </button>
            </>
          )}
          {isTabAllowed("inovacao", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("inovacao")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "inovacao" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Lightbulb className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "inovacao" ? "text-teal-400" : "text-slate-500"}`}
              >
                Inovação
              </span>
            </button>
          )}
          {isTabAllowed("suprimentos", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("suprimentos")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "suprimentos" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Package className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "suprimentos" ? "text-teal-400" : "text-slate-500"}`}
              >
                Suprimentos
              </span>
            </button>
          )}
          {isTabAllowed("sadt", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("sadt")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "sadt" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Activity className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "sadt" ? "text-teal-400" : "text-slate-500"}`}
              >
                SADT
              </span>
            </button>
          )}
          {isTabAllowed("atendimento", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("atendimento")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "atendimento" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <HeartHandshake className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "atendimento" ? "text-teal-400" : "text-slate-500"}`}
              >
                Atend
              </span>
            </button>
          )}
          {isTabAllowed("caixa", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("caixa")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "caixa" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Activity className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "caixa" ? "text-teal-400" : "text-slate-500"}`}
              >
                Caixa
              </span>
            </button>
          )}

          {isTabAllowed("dre", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("dre")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "dre" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <FileText className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "dre" ? "text-teal-400" : "text-slate-500"}`}
              >
                DRE
              </span>
            </button>
          )}

          {isTabAllowed("tesouraria", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("tesouraria")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "tesouraria" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Landmark className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "tesouraria" ? "text-teal-400" : "text-slate-500"}`}
              >
                Tesouraria
              </span>
            </button>
          )}

          {isTabAllowed("glosas", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("glosas")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "glosas" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <ShieldCheck className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "glosas" ? "text-teal-400" : "text-slate-500"}`}
              >
                Glosas
              </span>
            </button>
          )}

          {isTabAllowed("comercial", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("comercial")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "comercial" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <TrendingUp className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "comercial" ? "text-teal-400" : "text-slate-500"}`}
              >
                Comercial
              </span>
            </button>
          )}

          {isTabAllowed("marketing", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("marketing")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "marketing" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Megaphone className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "marketing" ? "text-teal-400" : "text-slate-500"}`}
              >
                Marketing
              </span>
            </button>
          )}

          {isTabAllowed("seguranca", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("seguranca")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "seguranca" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <HardHat className="w-[22px] h-[22px]" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "seguranca" ? "text-teal-400" : "text-slate-500"}`}
              >
                Segurança
              </span>
            </button>
          )}

          {isTabAllowed("diretor_administrativo", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("diretor_administrativo")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "diretor_administrativo" ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Briefcase className="w-[22px] h-[22px] text-teal-400" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "diretor_administrativo" ? "text-teal-400" : "text-slate-500"}`}
              >
                Cockpit
              </span>
            </button>
          )}

          {isTabAllowed("diretor_geral", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("diretor_geral")}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div
                className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${activeTab === "diretor_geral" ? "bg-amber-500/15 text-amber-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
              >
                <Crown className="w-[22px] h-[22px] text-amber-400" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors ${activeTab === "diretor_geral" ? "text-amber-400" : "text-slate-500"}`}
              >
                Cockpit
              </span>
            </button>
          )}

          {profile && profile.role !== "medico" && (
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              <button
                data-tour="nav-more"
                onClick={() => setShowMoreTabs(!showMoreTabs)}
                className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
              >
                <div
                  className={`py-1 px-5 rounded-full transition-all duration-300 flex items-center justify-center ${["documentos", "holerite", "metrics", "recrutamento", "vagas", "climate", "training", "inovacao", "sadt", "atendimento", "financeiro", "caixa", "tesouraria", "glosas", "faturamento", "dre", "kpis", "simulador_custos", "comercial", "marketing", "seguranca", "diretor_administrativo", "diretor_geral", "sesmt", "juridico", "network", "suprimentos", "settings"].includes(activeTab) || showMoreTabs ? "bg-teal-500/15 text-teal-400 scale-110" : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}`}
                >
                  <MoreHorizontal className="w-[22px] h-[22px]" />
                </div>
                <span
                  className={`text-[11px] font-medium tracking-wide transition-colors ${["documentos", "holerite", "metrics", "recrutamento", "vagas", "climate", "training", "inovacao", "sadt", "atendimento", "financeiro", "caixa", "tesouraria", "glosas", "faturamento", "dre", "kpis", "simulador_custos", "comercial", "marketing", "seguranca", "diretor_administrativo", "diretor_geral", "sesmt", "juridico", "network", "suprimentos", "settings"].includes(activeTab) || showMoreTabs ? "text-teal-400" : "text-slate-500"}`}
                >
                  Mais
                </span>
              </button>

              {/* Removed showMoreTabs mobile drawer from here to prevent nested backdrop-filter issues in WebKit */}
            </div>
          )}
            </>
          )}
        </div>
      </nav>
      )}

      {/* Mobile Drawer (Mais Módulos) rendered outside the nav containing block */}
      {showMoreTabs && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[80] animate-in fade-in duration-300"
            onClick={() => setShowMoreTabs(false)}
          ></div>
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700/50 rounded-t-[2.5rem] shadow-2xl flex flex-col z-[90] overflow-hidden animate-in slide-in-from-bottom-full duration-300 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
            </div>

            <div className="px-6 pb-2 flex justify-between items-center">
              <h3 className="font-display font-bold text-slate-100 text-[13px] tracking-widest uppercase">
                Módulos Adicionais
              </h3>
              <button
                onClick={() => setShowMoreTabs(false)}
                className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pt-2 pb-8 grid grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto mt-2">
              {isTabAllowed("apresentacao", profile?.role || "") && (
              <button
                onClick={() => {
                  setActiveTab("apresentacao");
                  setShowMoreTabs(false);
                }}
                className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                  activeTab === "apresentacao"
                    ? "bg-purple-500/15 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                    : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                }`}
              >
                <Rocket
                  className={`w-6 h-6 ${activeTab === "apresentacao" ? "text-purple-400" : "text-slate-400"}`}
                />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "apresentacao" ? "text-purple-400" : "text-slate-300"}`}
                >
                  Pitch
                </span>
              </button>
              )}

              {isTabAllowed("documentos", profile?.role || "") && profile?.role !== "medico" && (
                <button
                  onClick={() => {
                    setActiveTab("documentos");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "documentos"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <FileText
                    className={`w-6 h-6 ${activeTab === "documentos" ? "text-teal-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "documentos" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Docs
                  </span>
                </button>
              )}

              {isTabAllowed("holerite", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("holerite");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "holerite"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <DollarSign
                    className={`w-6 h-6 ${activeTab === "holerite" ? "text-teal-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "holerite" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    {profile?.role === "medico" ? "Repasses" : "Financeiro"}
                  </span>
                </button>
              )}

              {isTabAllowed("assessment", profile?.role || "") && profile?.role !== "colaborador" && profile?.role !== "medico" && (
                <button
                  onClick={() => {
                    setActiveTab("assessment");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "assessment"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Activity
                    className={`w-6 h-6 ${activeTab === "assessment" ? "text-teal-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "assessment" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Avaliação
                  </span>
                </button>
              )}

              {isTabAllowed("metrics", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("metrics");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "metrics"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <BarChart2
                    className={`w-6 h-6 ${activeTab === "metrics" ? "text-teal-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider text-center leading-tight ${activeTab === "metrics" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    People<br/>Analytics
                  </span>
                </button>
              )}

              {isTabAllowed("recrutamento", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("recrutamento");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "recrutamento"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Users
                    className={`w-6 h-6 ${activeTab === "recrutamento" ? "text-teal-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "recrutamento" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Seleção
                  </span>
                </button>
              )}

              {isTabAllowed("vagas", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("vagas");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "vagas"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Briefcase
                    className={`w-6 h-6 ${activeTab === "vagas" ? "text-teal-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "vagas" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Vagas
                  </span>
                </button>
              )}

              {isTabAllowed("inovacao", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("inovacao");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "inovacao"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Lightbulb
                    className={`w-6 h-6 ${activeTab === "inovacao" ? "text-teal-400" : "text-teal-400/80"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "inovacao" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Inovação
                  </span>
                </button>
              )}

              {isTabAllowed("suprimentos", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("suprimentos");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "suprimentos"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Package
                    className={`w-6 h-6 ${activeTab === "suprimentos" ? "text-teal-400" : "text-teal-400/80"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "suprimentos" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Suprimentos
                  </span>
                </button>
              )}

              {isTabAllowed("sadt", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("sadt");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "sadt"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Activity
                    className={`w-6 h-6 ${activeTab === "sadt" ? "text-teal-400" : "text-teal-400/80"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "sadt" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    SADT
                  </span>
                </button>
              )}

              {isTabAllowed("atendimento", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("atendimento");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "atendimento"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <HeartHandshake
                    className={`w-6 h-6 ${activeTab === "atendimento" ? "text-teal-400" : "text-teal-400/80"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "atendimento" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Atendimento
                  </span>
                </button>
              )}

              {isTabAllowed("caixa", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("caixa");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "caixa"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Activity
                    className={`w-6 h-6 ${activeTab === "caixa" ? "text-teal-400" : "text-teal-500"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "caixa" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Caixa
                  </span>
                </button>
              )}
              
              {isTabAllowed("tesouraria", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("tesouraria");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "tesouraria"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Landmark
                    className={`w-6 h-6 ${activeTab === "tesouraria" ? "text-teal-400" : "text-teal-500"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "tesouraria" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Tesouraria
                  </span>
                </button>
              )}

              {isTabAllowed("glosas", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("glosas");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "glosas"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <ShieldCheck
                    className={`w-6 h-6 ${activeTab === "glosas" ? "text-teal-400" : "text-teal-500"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "glosas" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Glosas
                  </span>
                </button>
              )}
              

              {isTabAllowed("faturamento", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("faturamento");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "faturamento"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <BarChart2
                    className={`w-6 h-6 ${activeTab === "faturamento" ? "text-teal-400" : "text-teal-500"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "faturamento" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Faturamento
                  </span>
                </button>
              )}

              {isTabAllowed("dre", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("dre");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "dre"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <FileText
                    className={`w-6 h-6 ${activeTab === "dre" ? "text-teal-400" : "text-teal-450"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "dre" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    DRE Gerencial
                  </span>
                </button>
              )}

              {isTabAllowed("kpis", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("kpis");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "kpis"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Activity
                    className={`w-6 h-6 ${activeTab === "kpis" ? "text-teal-400" : "text-teal-450"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "kpis" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Cockpit KPIs
                  </span>
                </button>
              )}

              {isTabAllowed("simulador_custos", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("simulador_custos");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "simulador_custos"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Sliders
                    className={`w-6 h-6 ${activeTab === "simulador_custos" ? "text-teal-400" : "text-teal-450"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "simulador_custos" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Simulador
                  </span>
                </button>
              )}

              {isTabAllowed("comercial", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("comercial");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "comercial"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <TrendingUp
                    className={`w-6 h-6 ${activeTab === "comercial" ? "text-teal-400" : "text-teal-400/80"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "comercial" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Comercial
                  </span>
                </button>
              )}

              {isTabAllowed("marketing", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("marketing");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "marketing"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Megaphone
                    className={`w-6 h-6 ${activeTab === "marketing" ? "text-teal-400" : "text-teal-400/80"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "marketing" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Marketing
                  </span>
                </button>
              )}

              {isTabAllowed("seguranca", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("seguranca");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "seguranca"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <HardHat
                    className={`w-6 h-6 ${activeTab === "seguranca" ? "text-teal-400" : "text-teal-400/80"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center flex-col justify-center items-center ${activeTab === "seguranca" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Segurança
                  </span>
                </button>
              )}

              {isTabAllowed("climate", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("climate");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "climate"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${activeTab === "climate" ? "text-teal-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "climate" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Clima
                  </span>
                </button>
              )}

              {isTabAllowed("training", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("training");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "training"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <BookOpen
                    className={`w-6 h-6 ${activeTab === "training" ? "text-teal-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "training" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Cursos
                  </span>
                </button>
              )}

              {isTabAllowed("feedback", profile?.role || "") && profile?.role !== "colaborador" && profile?.role !== "medico" && (
                <button
                  onClick={() => {
                    setTargetFeedbackEmployee(undefined);
                    setActiveTab("feedback");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "feedback"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-855"
                  }`}
                >
                  <MessageSquare
                    className={`w-6 h-6 ${activeTab === "feedback" ? "text-teal-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "feedback" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Feedbacks
                  </span>
                </button>
              )}

              {isTabAllowed("sesmt", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("sesmt");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "sesmt"
                      ? "bg-purple-500/15 border-purple-500/40 shadow-[0_0_15px_rgba(147,51,234,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Shield
                    className={`w-6 h-6 ${activeTab === "sesmt" ? "text-purple-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "sesmt" ? "text-purple-400" : "text-slate-300"}`}
                  >
                    SESMT
                  </span>
                </button>
              )}

              {isTabAllowed("juridico", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("juridico");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "juridico"
                      ? "bg-[#693A32]/25 border-[#8D5B4F]/40 shadow-[0_0_15px_rgba(141,91,79,0.15)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Scale
                    className={`w-6 h-6 ${activeTab === "juridico" ? "text-[#A78177]" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "juridico" ? "text-[#A78177]" : "text-slate-300"}`}
                  >
                    Jurídico
                  </span>
                </button>
              )}

              {isTabAllowed("network", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("network");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "network"
                      ? "bg-rose-500/15 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <HeartHandshake
                    className={`w-6 h-6 ${activeTab === "network" ? "text-rose-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "network" ? "text-rose-400" : "text-slate-300"}`}
                  >
                    Comunidade
                  </span>
                </button>
              )}



              {isTabAllowed("settings", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setShowMoreTabs(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                    activeTab === "settings"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <Settings
                    className={`w-6 h-6 ${activeTab === "settings" ? "text-teal-400" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center ${activeTab === "settings" ? "text-teal-400" : "text-slate-300"}`}
                  >
                    Configurações
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Premium Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-950 border border-teal-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(45,212,191,0.15)] flex flex-col items-center text-center space-y-6 glow-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500/10 via-teal-400 to-teal-500/10"></div>

            <div className="w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center relative mb-2">
              <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping opacity-50"></div>
              <Check className="w-10 h-10 text-teal-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-display font-semibold text-slate-100 tracking-tight">
                PDI Submetido
              </h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                Seu Plano de Desenvolvimento Individual foi assinado
                digitalmente e enviado para avaliação do seu Líder com sucesso.
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedPdi(null);
              }}
              className="mt-4 w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)]"
            >
              Voltar ao Painel
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {pdiToReset && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-950 border border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col items-center text-center space-y-6 glow-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/10 via-red-400 to-red-500/10"></div>

            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center relative mb-2">
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-50"></div>
              <Trash2 className="w-10 h-10 text-red-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-display font-semibold text-slate-100 tracking-tight">
                Você tem certeza?
              </h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                Você deseja reiniciar este processo de PDI? Todos os dados da avaliação serão excluídos. Esta ação é irreversível.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full mt-4">
              <button
                onClick={() => setPdiToReset(null)}
                className="flex-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-6 py-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteResetPdi}
                className="flex-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 px-6 py-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {showOnboarding && profile && (
        <OnboardingTour
          userName={profile.name}
          onComplete={handleOnboardingComplete}
        />
      )}

      {profile && (
        <AIAssistantWidget userName={profile.name} userRole={profile.role} />
      )}

      <PWAInstallPrompt />
    </div>
  );
}

// Subcomponent: Form Editor for PDIs
interface FormEditorProps {
  localFormData: DecryptedPdiData;
  setLocalFormData: Dispatch<SetStateAction<DecryptedPdiData>>;
  isFormDisabled: boolean;
  triggerAutoSave: (updatedFields: Partial<DecryptedPdiData>) => Promise<void>;
  saveStatus: "saved" | "saving" | "error";
  t: any;
  currentLang: Language;
  handleAiSmartGoals: () => void | Promise<void>;
  aiGenerating: boolean;
  aiWarning: string;
  selectedPdi: Pdi;
  localFeedback: { manager: string; hr: string };
  checkins: Checkin[];
  newCheckin: string;
  setNewCheckin: Dispatch<SetStateAction<string>>;
  newStressLevel: number;
  setNewStressLevel: Dispatch<SetStateAction<number>>;
  handleAddCheckIn: (overridePdi?: Pdi | null, e?: any) => Promise<void>;
  addCheckinLoading: boolean;
  profile: UserProfile;
  onUpdateStatus: () => void;
}

function FormEditor({
  localFormData,
  setLocalFormData,
  isFormDisabled,
  triggerAutoSave,
  saveStatus,
  t,
  currentLang,
  handleAiSmartGoals,
  aiGenerating,
  aiWarning,
  selectedPdi,
  localFeedback,
  checkins,
  newCheckin,
  setNewCheckin,
  newStressLevel,
  setNewStressLevel,
  handleAddCheckIn,
  addCheckinLoading,
  profile,
  onUpdateStatus,
}: FormEditorProps) {
  const [summaryGenerating, setSummaryGenerating] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [displayLimit, setDisplayLimit] = useState(3);

  const sortedCheckins = [...checkins].sort((a, b) => b.date - a.date);
  const visibleCheckins = sortedCheckins.slice(0, displayLimit);

  const handleGenerateSummary = async () => {
    if (checkins.length === 0) return;
    setSummaryGenerating(true);
    setExecutiveSummary("");
    try {
      const notes = checkins.map((c) => c.encryptedNote);
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, language: currentLang }),
      });
      if (res.ok) {
        const data = await res.json();
        setExecutiveSummary(data.summary);
      } else {
        setExecutiveSummary("Erro na geração. Verifique os logs.");
      }
    } catch {
      setExecutiveSummary("Erro ao conectar à API para o resumo executivo.");
    } finally {
      setSummaryGenerating(false);
    }
  };

  useEffect(() => {
    if (isFormDisabled) return;
    const timeoutId = setTimeout(() => {
      triggerAutoSave(localFormData);
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [localFormData, isFormDisabled]);

  const items5W2H = localFormData.items5W2H || [];
  
  // Calculate average progress of all 5W2H items
  const progress = items5W2H.length > 0
    ? Math.round(items5W2H.reduce((acc, item) => acc + (item.progresso || 0), 0) / items5W2H.length)
    : 0;

  const isLocked = selectedPdi.status === "Aprovado Final";

  const handleUpdate5W2H = (index: number, field: keyof Pdi5W2HItem, value: any) => {
    const newItems = [...items5W2H];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalFormData(prev => ({ ...prev, items5W2H: newItems }));
  };

  const handleAdd5W2HItem = () => {
    const newItem: Pdi5W2HItem = { 
      id: Date.now().toString(), 
      oQue: '', 
      quem: '', 
      quando: '', 
      onde: '', 
      porQue: '', 
      como: '', 
      quantoCusta: '', 
      progresso: 0 
    };
    setLocalFormData(prev => ({ ...prev, items5W2H: [...(prev.items5W2H || []), newItem] }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items5W2H];
    newItems.splice(index, 1);
    setLocalFormData(prev => ({ ...prev, items5W2H: newItems }));
    triggerAutoSave({ items5W2H: newItems });
  };

  const learningEvidences = localFormData.learningEvidences || [];

  const handleUpdateLearningEvidence = (index: number, field: keyof LearningEvidence, value: any) => {
    const newItems = [...learningEvidences];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalFormData(prev => ({ ...prev, learningEvidences: newItems }));
  };

  const handleAddLearningEvidence = () => {
    const newItem: LearningEvidence = {
      id: Date.now().toString(),
      title: '',
      category: '70',
      date: Date.now()
    };
    const newItems = [...learningEvidences, newItem];
    setLocalFormData(prev => ({ ...prev, learningEvidences: newItems }));
    triggerAutoSave({ learningEvidences: newItems });
  };

  const handleRemoveLearningEvidence = (index: number) => {
    const newItems = learningEvidences.filter((_, i) => i !== index);
    setLocalFormData(prev => ({ ...prev, learningEvidences: newItems }));
    triggerAutoSave({ learningEvidences: newItems });
  };

  const handleFileUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Arquivo muito grande. O limite é 2MB para esta demonstração.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newItems = [...learningEvidences];
      newItems[index] = { ...newItems[index], fileBase64: e.target?.result as string, fileName: file.name };
      setLocalFormData(prev => ({ ...prev, learningEvidences: newItems }));
      triggerAutoSave({ learningEvidences: newItems });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Gamification progress */}
      {(profile.role === "colaborador" || profile.role === "lider") && (
        <GamificationBadges
          progress={progress}
          checkinsCount={checkins.length}
          status={selectedPdi.status}
        />
      )}

      {/* PLANO DE DESENVOLVIMENTO INDIVIDUAL (PDI) - 5W2H */}
      <div className="bg-[#FAFAFA] dark:bg-slate-900 border-2 border-[#8D5B4F] rounded-xl overflow-hidden shadow-lg mt-8">
        <div className="bg-[#693A32] p-4 text-center border-b border-[#461D15]">
          <h3 className="text-white font-bold uppercase tracking-wider text-sm md:text-base">
            Plano de Desenvolvimento Individual (PDI) - 5W2H
          </h3>
        </div>
        
        <div className="p-4">
          {items5W2H.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-20 text-[#693A32]" />
              <p className="text-sm font-semibold">Nenhum plano de ação definido.</p>
              <p className="text-xs mt-1">Crie a primeira ação do 5W2H para começar o PDI.</p>
            </div>
          ) : (
            <div>
              {/* Dashboard de Indicadores do 5W2H */}
              {(() => {
                let low = 0, medium = 0, high = 0;
                items5W2H.forEach(item => {
                  const p = item.progresso || 0;
                  if (p <= 30) low++;
                  else if (p <= 70) medium++;
                  else high++;
                });
                
                const progressStats = [
                  { name: '0-30%', value: low, color: '#f43f5e' },
                  { name: '31-70%', value: medium, color: '#f59e0b' },
                  { name: '71-100%', value: high, color: '#10b981' }
                ].filter(d => d.value > 0);

                return (
                  <div className="mb-6 bg-white dark:bg-slate-950 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-1/3 flex justify-center flex-col items-center">
                       <h4 className="text-[#693A32] dark:text-[#A78177] font-bold text-xs uppercase tracking-wide mb-2">Visão Geral</h4>
                       <div className="h-44 w-full max-w-[200px]">
                          {progressStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie data={progressStats} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} stroke="none">
                                   {progressStats.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                                 </Pie>
                                 <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <span className="text-xs text-slate-400">Sem dados</span>
                            </div>
                          )}
                       </div>
                    </div>
                    <div className="w-full md:w-2/3">
                       <h4 className="text-[#693A32] dark:text-[#A78177] font-bold text-sm md:text-base uppercase tracking-wide mb-4">Progresso das Ações</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                          <div className="bg-slate-50 dark:bg-slate-900 border-l-[5px] border-[#f43f5e] rounded-r-xl p-3.5 shadow-sm">
                             <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">
                               Inicial <span className="text-[9px] font-medium lowercase bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded ml-1">0-30%</span>
                             </div>
                             <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{low}</span>
                                <span className="text-xs text-slate-400 font-medium">ações</span>
                             </div>
                          </div>
                          
                          <div className="bg-slate-50 dark:bg-slate-900 border-l-[5px] border-[#f59e0b] rounded-r-xl p-3.5 shadow-sm">
                             <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">
                               Em Andamento <span className="text-[9px] font-medium lowercase bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded ml-1">31-70%</span>
                             </div>
                             <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{medium}</span>
                                <span className="text-xs text-slate-400 font-medium">ações</span>
                             </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-900 border-l-[5px] border-[#10b981] rounded-r-xl p-3.5 shadow-sm">
                             <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">
                               Concluídas <span className="text-[9px] font-medium lowercase bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded ml-1">71-100%</span>
                             </div>
                             <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{high}</span>
                                <span className="text-xs text-slate-400 font-medium">ações</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                );
              })()}

              {/* Desktop view (Table layout) - hidden on mobile/tablet */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#A78177]/20 border-b-2 border-[#8D5B4F]">
                      <th className="p-3 text-xs font-bold text-[#461D15] dark:text-[#A78177] uppercase w-44">O que? <span className="block font-normal text-[10px]">(Ação)</span></th>
                      <th className="p-3 text-xs font-bold text-[#461D15] dark:text-[#A78177] uppercase w-36">Quem? <span className="block font-normal text-[10px]">(Responsável)</span></th>
                      <th className="p-3 text-xs font-bold text-[#461D15] dark:text-[#A78177] uppercase w-28">Quando? <span className="block font-normal text-[10px]">(Prazo)</span></th>
                      <th className="p-3 text-xs font-bold text-[#461D15] dark:text-[#A78177] uppercase w-28">Onde? <span className="block font-normal text-[10px]">(Setor)</span></th>
                      <th className="p-3 text-xs font-bold text-[#461D15] dark:text-[#A78177] uppercase w-44">Por quê? <span className="block font-normal text-[10px]">(Justificativa)</span></th>
                      <th className="p-3 text-xs font-bold text-[#461D15] dark:text-[#A78177] uppercase w-44">Como? <span className="block font-normal text-[10px]">(Procedimento)</span></th>
                      <th className="p-3 text-xs font-bold text-[#461D15] dark:text-[#A78177] uppercase w-28">Quanto custa? <span className="block font-normal text-[10px]">(Valor)</span></th>
                      <th className="p-3 text-xs font-bold text-[#461D15] dark:text-[#A78177] uppercase w-36">Progresso <span className="block font-normal text-[10px]">(Conclusão)</span></th>
                      {!isFormDisabled && <th className="p-3 w-8"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#8D5B4F]/20">
                    {items5W2H.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-[#A78177]/5 transition-colors group">
                        <td className="p-2 align-top">
                          <textarea value={item.oQue} onChange={(e) => handleUpdate5W2H(idx, 'oQue', e.target.value)} onBlur={() => triggerAutoSave({ items5W2H })} disabled={isFormDisabled} className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 resize-none h-16 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" placeholder="Ação..." />
                        </td>
                        <td className="p-2 align-top">
                          <textarea value={item.quem} onChange={(e) => handleUpdate5W2H(idx, 'quem', e.target.value)} onBlur={() => triggerAutoSave({ items5W2H })} disabled={isFormDisabled} className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 resize-none h-16 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" placeholder="Ação..." />
                        </td>
                        <td className="p-2 align-top">
                          <input type="text" value={item.quando} onChange={(e) => handleUpdate5W2H(idx, 'quando', e.target.value)} onBlur={() => triggerAutoSave({ items5W2H })} disabled={isFormDisabled} className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" placeholder="Ex: Dez/26" />
                        </td>
                        <td className="p-2 align-top">
                          <input type="text" value={item.onde} onChange={(e) => handleUpdate5W2H(idx, 'onde', e.target.value)} onBlur={() => triggerAutoSave({ items5W2H })} disabled={isFormDisabled} className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" placeholder="Setor..." />
                        </td>
                        <td className="p-2 align-top">
                          <textarea value={item.porQue} onChange={(e) => handleUpdate5W2H(idx, 'porQue', e.target.value)} onBlur={() => triggerAutoSave({ items5W2H })} disabled={isFormDisabled} className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 resize-none h-16 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" placeholder="Justificativa..." />
                        </td>
                        <td className="p-2 align-top">
                          <textarea value={item.como} onChange={(e) => handleUpdate5W2H(idx, 'como', e.target.value)} onBlur={() => triggerAutoSave({ items5W2H })} disabled={isFormDisabled} className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 resize-none h-16 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" placeholder="Procedimento..." />
                        </td>
                        <td className="p-2 align-top">
                          <input type="text" value={item.quantoCusta} onChange={(e) => handleUpdate5W2H(idx, 'quantoCusta', e.target.value)} onBlur={() => triggerAutoSave({ items5W2H })} disabled={isFormDisabled} className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" placeholder="R$ 0,00" />
                        </td>
                        <td className="p-2 align-top">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-[#461D15] dark:text-slate-300">
                              <span>{item.progresso !== undefined ? item.progresso : 0}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              step="5" 
                              value={item.progresso !== undefined ? item.progresso : 0} 
                              onChange={(e) => handleUpdate5W2H(idx, 'progresso', parseInt(e.target.value, 10))} 
                              onMouseUp={() => triggerAutoSave({ items5W2H })}
                              onTouchEnd={() => triggerAutoSave({ items5W2H })}
                              disabled={isFormDisabled}
                              className="w-full accent-[#693A32] h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                            />
                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mt-0.5">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  (item.progresso || 0) === 100 
                                    ? 'bg-emerald-500' 
                                    : (item.progresso || 0) >= 50 
                                      ? 'bg-amber-500' 
                                      : 'bg-[#693A32]'
                                }`}
                                style={{ width: `${item.progresso !== undefined ? item.progresso : 0}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        {!isFormDisabled && (
                          <td className="p-2 align-middle w-8 text-center">
                            <button onClick={() => handleRemoveItem(idx)} className="text-red-450 hover:text-red-600 transition-colors p-1 rounded opacity-0 group-hover:opacity-100 disabled:opacity-50" disabled={isFormDisabled}>
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View (Grid of Cards Layout) - displayed on mobile and tablet */}
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                {items5W2H.map((item, idx) => (
                  <div key={item.id || idx} className="bg-white dark:bg-slate-950 border border-[#8D5B4F]/40 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                      <span className="text-xs font-bold text-[#693A32] dark:text-[#A78177] uppercase tracking-wide">
                        Ação #{idx + 1}
                      </span>
                      {!isFormDisabled && (
                        <button 
                          onClick={() => handleRemoveItem(idx)} 
                          className="text-red-455 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                          disabled={isFormDisabled}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      {/* What? -> ColSpan 2 */}
                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase">
                          O que? <span className="text-slate-400 capitalize font-normal dark:text-slate-500">(Ação)</span>
                        </label>
                        <textarea 
                          value={item.oQue} 
                          onChange={(e) => handleUpdate5W2H(idx, 'oQue', e.target.value)} 
                          onBlur={() => triggerAutoSave({ items5W2H })} 
                          disabled={isFormDisabled} 
                          className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 resize-none h-14 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" 
                          placeholder="Ação..." 
                        />
                      </div>

                      {/* Who? */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase">
                          Quem? <span className="text-slate-400 capitalize font-normal dark:text-slate-500">(Responsável)</span>
                        </label>
                        <input 
                          type="text" 
                          value={item.quem} 
                          onChange={(e) => handleUpdate5W2H(idx, 'quem', e.target.value)} 
                          onBlur={() => triggerAutoSave({ items5W2H })} 
                          disabled={isFormDisabled} 
                          className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" 
                          placeholder="Responsável..." 
                        />
                      </div>

                      {/* When? */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase">
                          Quando? <span className="text-slate-400 capitalize font-normal dark:text-slate-500">(Prazo)</span>
                        </label>
                        <input 
                          type="text" 
                          value={item.quando} 
                          onChange={(e) => handleUpdate5W2H(idx, 'quando', e.target.value)} 
                          onBlur={() => triggerAutoSave({ items5W2H })} 
                          disabled={isFormDisabled} 
                          className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" 
                          placeholder="Ex: Dez/26" 
                        />
                      </div>

                      {/* Where? */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase">
                          Onde? <span className="text-slate-400 capitalize font-normal dark:text-slate-500">(Setor)</span>
                        </label>
                        <input 
                          type="text" 
                          value={item.onde} 
                          onChange={(e) => handleUpdate5W2H(idx, 'onde', e.target.value)} 
                          onBlur={() => triggerAutoSave({ items5W2H })} 
                          disabled={isFormDisabled} 
                          className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" 
                          placeholder="Setor..." 
                        />
                      </div>

                      {/* How Much? */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase">
                          Quanto custa? <span className="text-slate-400 capitalize font-normal dark:text-slate-500">(Valor)</span>
                        </label>
                        <input 
                          type="text" 
                          value={item.quantoCusta} 
                          onChange={(e) => handleUpdate5W2H(idx, 'quantoCusta', e.target.value)} 
                          onBlur={() => triggerAutoSave({ items5W2H })} 
                          disabled={isFormDisabled} 
                          className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" 
                          placeholder="R$ 0,00" 
                        />
                      </div>

                      {/* Why? -> ColSpan 2 */}
                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase">
                          Por quê? <span className="text-slate-400 capitalize font-normal dark:text-slate-500">(Justificativa)</span>
                        </label>
                        <textarea 
                          value={item.porQue} 
                          onChange={(e) => handleUpdate5W2H(idx, 'porQue', e.target.value)} 
                          onBlur={() => triggerAutoSave({ items5W2H })} 
                          disabled={isFormDisabled} 
                          className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 resize-none h-14 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" 
                          placeholder="Justificativa..." 
                        />
                      </div>

                      {/* How? -> ColSpan 2 */}
                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase">
                          Como? <span className="text-slate-400 capitalize font-normal dark:text-slate-500">(Procedimento)</span>
                        </label>
                        <textarea 
                          value={item.como} 
                          onChange={(e) => handleUpdate5W2H(idx, 'como', e.target.value)} 
                          onBlur={() => triggerAutoSave({ items5W2H })} 
                          disabled={isFormDisabled} 
                          className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 resize-none h-14 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" 
                          placeholder="Procedimento..." 
                        />
                      </div>

                      {/* Progress bar and slider -> ColSpan 2 */}
                      <div className="sm:col-span-2 flex flex-col gap-1 border-t border-slate-100 dark:border-slate-800 pt-3 mt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase">
                            Progresso
                          </label>
                          <span className="text-xs font-bold text-[#693A32] dark:text-slate-300">
                            {item.progresso !== undefined ? item.progresso : 0}%
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="5" 
                          value={item.progresso !== undefined ? item.progresso : 0} 
                          onChange={(e) => handleUpdate5W2H(idx, 'progresso', parseInt(e.target.value, 10))} 
                          onMouseUp={() => triggerAutoSave({ items5W2H })}
                          onTouchEnd={() => triggerAutoSave({ items5W2H })}
                          disabled={isFormDisabled}
                          className="w-full accent-[#693A32] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        />
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              (item.progresso || 0) === 100 
                                ? 'bg-emerald-500' 
                                : (item.progresso || 0) >= 50 
                                  ? 'bg-amber-500' 
                                  : 'bg-[#693A32]'
                            }`}
                            style={{ width: `${item.progresso !== undefined ? item.progresso : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {!isFormDisabled && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-[#8D5B4F]/20 flex justify-center">
             <button
                type="button"
                onClick={handleAdd5W2HItem}
                className="bg-[#693A32] hover:bg-[#461D15] text-white font-bold text-xs uppercase px-4 py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
             >
                <Plus className="w-4 h-4" />
                Adicionar Ação
             </button>
          </div>
        )}
      </div>

      {/* Modelo de Aprendizagem 70:20:10 */}
      <div className="bg-[#FAFAFA] dark:bg-slate-900 border-2 border-[#8D5B4F] rounded-xl overflow-hidden shadow-lg mt-8 mb-8">
        <div className="bg-[#693A32] p-4 text-center border-b border-[#461D15] flex items-center justify-center gap-2">
          <BookOpen className="w-5 h-5 text-white" />
          <h3 className="text-white font-bold uppercase tracking-wider text-sm md:text-base">
            Jornada de Aprendizagem (Modelo 70:20:10)
          </h3>
        </div>
        <div className="p-4 md:p-6">
          <div className="mb-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
            <p>Mapeie suas iniciativas de desenvolvimento conforme o padrão de eficiência em aprendizagem de adultos:</p>
            <ul className="mt-2 space-y-1">
              <li><strong className="text-[#693A32] dark:text-[#A78177]">70% Prática:</strong> Desafios no trabalho, novos projetos, resolução de problemas reais.</li>
              <li><strong className="text-[#693A32] dark:text-[#A78177]">20% Troca de Experiências:</strong> Mentoria, feedback, observação de colegas.</li>
              <li><strong className="text-[#693A32] dark:text-[#A78177]">10% Teoria:</strong> Cursos, treinamentos formais, livros, certificações.</li>
            </ul>
          </div>

          <div className="space-y-4">
            {learningEvidences.map((evidence, idx) => (
              <div key={evidence.id} className="bg-white dark:bg-slate-950 border border-[#8D5B4F]/40 rounded-xl p-4 shadow-sm relative group">
                {!isFormDisabled && (
                  <button
                    onClick={() => handleRemoveLearningEvidence(idx)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase mb-1 block">Categoria</label>
                    <div className="flex gap-2">
                       {['70', '20', '10'].map(cat => (
                         <label key={cat} className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${evidence.category === cat ? "bg-[#693A32] border-[#693A32] text-white" : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"} ${isFormDisabled ? "opacity-75 pointer-events-none" : ""}`}>
                           <input type="radio" value={cat} checked={evidence.category === cat} onChange={() => { handleUpdateLearningEvidence(idx, 'category', cat); triggerAutoSave({ learningEvidences: [...learningEvidences] }); }} className="hidden" disabled={isFormDisabled} />
                           {cat === '70' && "70% (Prática)"}
                           {cat === '20' && "20% (Trocas)"}
                           {cat === '10' && "10% (Teoria)"}
                         </label>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase mb-1 block">Título / Iniciativa</label>
                    <input type="text" value={evidence.title} onChange={(e) => handleUpdateLearningEvidence(idx, 'title', e.target.value)} onBlur={() => triggerAutoSave({ learningEvidences: [...learningEvidences] })} disabled={isFormDisabled} className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" placeholder="Ex: Projeto Implantação de Prontuário, Curso de Liderança..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase mb-1 block">Descrição / Aprendizado</label>
                    <textarea value={evidence.description || ''} onChange={(e) => handleUpdateLearningEvidence(idx, 'description', e.target.value)} onBlur={() => triggerAutoSave({ learningEvidences: [...learningEvidences] })} disabled={isFormDisabled} className="w-full bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 resize-none h-16 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" placeholder="Descreva brevemente o que foi feito e os aprendizados..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-[#461D15] dark:text-[#A78177] uppercase mb-1 block">Comprovação (Certificados / Documentos)</label>
                    <div className="flex flex-col sm:flex-row gap-3 items-center mt-1">
                      {evidence.fileBase64 ? (
                        <div className="flex items-center gap-2 p-2 px-3 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-400 rounded-lg text-xs font-semibold w-full sm:w-auto overflow-hidden">
                          <FileCheck className="w-4 h-4 shrink-0" />
                          <span className="truncate max-w-[200px]">{evidence.fileName}</span>
                          {!isFormDisabled && (
                             <button type="button" onClick={() => { handleUpdateLearningEvidence(idx, 'fileBase64', undefined); handleUpdateLearningEvidence(idx, 'fileName', undefined); triggerAutoSave({ learningEvidences: [...learningEvidences] }); }} className="ml-2 hover:text-red-500">
                               <X className="w-4 h-4" />
                             </button>
                          )}
                        </div>
                      ) : (
                        <div className="relative flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto px-4 py-2 rounded-lg cursor-pointer">
                           <Upload className="w-4 h-4 text-slate-500 mr-2" />
                           <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{isFormDisabled ? "Nenhum arquivo" : "Fazer Upload (Max 2MB)"}</span>
                           {!isFormDisabled && (
                             <input type="file" disabled={isFormDisabled} onChange={(e) => handleFileUpload(idx, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,image/*" />
                           )}
                        </div>
                      )}
                      
                      <div className="text-xs text-center text-slate-500 w-full sm:w-auto px-2 font-bold">— OU —</div>

                      <input type="url" value={evidence.link || ''} onChange={(e) => handleUpdateLearningEvidence(idx, 'link', e.target.value)} onBlur={() => triggerAutoSave({ learningEvidences: [...learningEvidences] })} disabled={isFormDisabled} className="w-full flex-1 bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#693A32] focus:ring-0 disabled:opacity-70  placeholder:text-slate-500 dark:placeholder:text-slate-400 backdrop-blur-sm" placeholder="Cole um link para o Drive / Pasta na nuvem..." />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isFormDisabled && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleAddLearningEvidence}
                className="bg-[#693A32] hover:bg-[#461D15] text-white font-bold text-xs uppercase px-4 py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Adicionar Aprendizado
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Leader & RH viewable feedbacks (Shown inside main form once exists) */}
      {!isLocked && !!selectedPdi.managerFeedback && (
        <div className="card-gradient p-6 rounded-2xl border border-slate-800 border-l-4 border-l-teal-500 text-left space-y-2.5 glow-border">
          <h4 className="font-display font-semibold text-xs text-teal-400 uppercase tracking-wider">
            {t.pdiSec4}
          </h4>
          <p className="text-xs text-slate-300 font-sans italic whitespace-pre-wrap leading-relaxed">
            {selectedPdi.managerFeedback}
          </p>
        </div>
      )}

      {!isLocked && !!selectedPdi.hrFeedback && (
        <div className="card-gradient p-6 rounded-2xl border border-slate-800 border-l-4 border-l-teal-500 text-left space-y-2.5 glow-border">
          <h4 className="font-display font-semibold text-xs text-teal-400 uppercase tracking-wider">
            {t.pdiSec5}
          </h4>
          <p className="text-xs text-slate-300 font-sans italic whitespace-pre-wrap leading-relaxed">
            {selectedPdi.hrFeedback}
          </p>
        </div>
      )}

      {/* Continuous Alignments & 1-on-1s Section (Unlocked ONLY during phase 'Aprovado Final' for action track) */}
      {selectedPdi.status !== "Rascunho" && (
        <div className="card-gradient p-6 rounded-2xl border border-slate-800 text-left space-y-6 glow-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
            <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-3">
              <span className="text-teal-400 font-sans">{t.pdiSec6}</span>
              {isLocked && (
                <span className="text-[9px] bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded tracking-widest font-extrabold uppercase animate-pulse border border-teal-500/25">
                  Fase de Execução
                </span>
              )}
            </h4>
            {profile?.role === "lider" && checkins.length > 0 && (
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={summaryGenerating}
                className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm ml-auto"
              >
                {summaryGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {summaryGenerating
                  ? "Analisando..."
                  : "Gerar Resumo Executivo da IA"}
              </button>
            )}
          </div>

          {executiveSummary && (
            <div className="bg-teal-950/40 border border-teal-500/30 rounded-xl p-4 space-y-2 animate-in fade-in zoom-in duration-300">
              <h5 className="text-[10px] uppercase font-bold tracking-widest text-teal-400 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Resumo Executivo (IA)
              </h5>
              <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {executiveSummary}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            {sortedCheckins.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6 font-sans">
                {t.noCheckins}
              </p>
            ) : (
              <>
                {visibleCheckins.map((item, idx) => {
                  const isAuthorOwner =
                    item.authorName === profile.name &&
                    item.authorRole === profile.role;
                  const getRoleDisplay = (role: string) => {
                    if (role === "lider") return "Líder";
                    if (role === "rh") return "RH";
                    if (role === "colaborador") return "Colaborador";
                    return role ? role.toUpperCase() : "GESTOR";
                  };

                  return (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-805/60 p-4 rounded-xl shadow-md space-y-2 relative"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm border ${
                            isAuthorOwner
                              ? "bg-teal-500 text-slate-950 border-teal-400"
                              : "bg-slate-800 text-slate-200 border-slate-700"
                          }`}
                        >
                          {item.authorName}{" "}
                          {isAuthorOwner
                            ? "(Eu)"
                            : `[${getRoleDisplay(item.authorRole)}]`}
                        </span>
                        <span className="text-[9px] text-slate-550 font-medium font-sans">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap mt-1">
                        {item.encryptedNote}
                      </p>
                    </div>
                  );
                })}
                {displayLimit < sortedCheckins.length && (
                  <button
                    type="button"
                    onClick={() => setDisplayLimit((prev) => prev + 5)}
                    className="w-full py-2.5 mt-2 bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 transition-all cursor-pointer"
                  >
                    Ver anotações anteriores...
                  </button>
                )}
              </>
            )}
          </div>

          {/* Add alignment note */}
          {(profile.role === "colaborador" || profile.role === "lider") && (
            <div className="flex flex-col gap-3 p-4 bg-slate-800/20 rounded-xl border border-slate-700/50">
              <div className="flex gap-2 items-end">
                <textarea
                  value={newCheckin}
                  onChange={(e) => setNewCheckin(e.target.value)}
                  placeholder={t.addCheckinPlaceholder}
                  className="flex-grow bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:ring-1 focus:ring-teal-500/20 focus:border-teal-500 resize-none h-[44px] min-h-[44px] max-h-20 shadow-sm"
                />
                <button
                  type="button"
                  onClick={(e) => handleAddCheckIn(selectedPdi, e)}
                  disabled={addCheckinLoading || !newCheckin.trim()}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 p-3 rounded-xl disabled:bg-slate-850 disabled:text-slate-600 shrink-0 select-none cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Action for collaborator */}
      {profile.role === "colaborador" && !isLocked && (
        <div className="pt-4 flex flex-col items-center justify-between gap-4 border-t border-slate-805 flex-wrap font-sans text-left">
          <div className="flex justify-between items-center w-full mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Progresso de Preenchimento: {progress}%
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mb-2 border border-slate-800/40">
            <div
              className="h-full bg-teal-500 transition-all duration-300 shadow-[0_0_8px_#2dd4bf]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button
            type="button"
            onClick={onUpdateStatus}
            disabled={
              progress < 100 ||
              ["Aguardando Líder", "Aguardando RH"].includes(
                selectedPdi.status,
              ) ||
              saveStatus === "saving"
            }
            className={`font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all w-full sm:w-auto ml-auto flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(45,212,191,0.15)]
              ${
                progress < 100 || saveStatus === "saving"
                  ? "bg-slate-900 text-slate-600 shadow-none cursor-not-allowed border border-transparent"
                  : ["Aguardando Líder", "Aguardando RH"].includes(
                        selectedPdi.status,
                      )
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-none cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-400 text-slate-950 hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] cursor-pointer border border-transparent"
              }`}
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : ["Aguardando Líder", "Aguardando RH"].includes(
                selectedPdi.status,
              ) ? (
              <>
                <Check className="w-4 h-4" />
                Enviado com Sucesso
              </>
            ) : selectedPdi.status === "Rascunho" ? (
              "Ativar e Submeter Plano"
            ) : selectedPdi.status === "Em Revisão" ? (
              "Re-enviar para Avaliação"
            ) : (
              t.sendToManager
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Printable Template designed exclusively for physical or hardcopy prints matching corporate A4 margins
interface PrintableTemplateProps {
  pdi: Pdi;
  decrypted: DecryptedPdiData | undefined;
  t: any;
  checkins: Checkin[];
  currentUserName?: string;
  currentUserRole?: string;
}

function PrintableTemplate({
  pdi,
  decrypted,
  t,
  checkins,
  currentUserName,
  currentUserRole,
}: PrintableTemplateProps) {
  if (!pdi) return null;

  return (
    <div
      id="print-template"
      className="hidden print:block p-10 bg-white text-slate-900 space-y-8 font-sans max-w-4xl mx-auto h-full select-all"
      style={{ backgroundColor: "#ffffff", color: "#000000" }}
    >
      {/* Printable Header */}
      <div className="border-b-2 border-slate-700 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            Plano de Desenvolvimento Individual
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Hospital São Francisco na Providência de Deus
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-slate-800">CICLO {pdi.cycle}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Estado: {pdi.status}
          </p>
        </div>
      </div>

      {/* Metadata */}
      <table className="w-full text-left text-xs border-collapse">
        <tbody>
          <tr>
            <th className="py-2.5 border-b border-slate-200 text-slate-500 uppercase font-bold w-1/4">
              Colaborador
            </th>
            <td className="py-2.5 border-b border-slate-200 font-bold text-slate-900">
              {pdi.coordinatorName}
            </td>
          </tr>
          <tr>
            <th className="py-2.5 border-b border-slate-200 text-slate-500 uppercase font-bold">
              Unidade/Setor
            </th>
            <td className="py-2.5 border-b border-slate-200 text-slate-900">
              {pdi.department}
            </td>
          </tr>
          <tr>
            <th className="py-2.5 border-b border-slate-200 text-slate-500 uppercase font-bold">
              Nível Cargo
            </th>
            <td className="py-2.5 border-b border-slate-200 text-slate-900">
              {pdi.hierarchy || "---"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Ficha Elements */}
      {/* 5W2H Table */}
      <div className="border border-[#461D15] mb-6 mt-6 break-inside-avoid">
        <div className="bg-[#693A32] text-white text-xs font-bold text-center py-1.5 uppercase tracking-wide border-b border-[#461D15]">
          PLANO DE DESENVOLVIMENTO INDIVIDUAL (PDI) - 5W2H
        </div>
        <table className="w-full text-left text-[9px] border-collapse bg-white">
          <thead>
            <tr className="bg-[#A78177]/20">
              <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[13%]">O que?<br/><span className="font-normal">(Ação)</span></th>
              <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[13%]">Quem?<br/><span className="font-normal">(Responsável)</span></th>
              <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[10%]">Quando?<br/><span className="font-normal">(Prazo)</span></th>
              <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[10%]">Onde?<br/><span className="font-normal">(Setor)</span></th>
              <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[16%]">Por quê?<br/><span className="font-normal">(Justificativa)</span></th>
              <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[16%]">Como?<br/><span className="font-normal">(Procedimento)</span></th>
              <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[10%]">Quanto custa?<br/><span className="font-normal">(Valor)</span></th>
              <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[12%]">Progresso<br/><span className="font-normal">(Conclusão)</span></th>
            </tr>
          </thead>
          <tbody>
            {!decrypted?.items5W2H || decrypted.items5W2H.length === 0 ? (
              <tr>
                <td colSpan={8} className="border border-[#461D15] p-4 text-center text-slate-500">Nenhum plano de ação definido.</td>
              </tr>
            ) : (
              decrypted.items5W2H.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-[#461D15] p-2 text-black align-top whitespace-pre-wrap">{item.oQue || "—"}</td>
                  <td className="border border-[#461D15] p-2 text-black align-top whitespace-pre-wrap">{item.quem || "—"}</td>
                  <td className="border border-[#461D15] p-2 text-black align-top whitespace-pre-wrap text-center">{item.quando || "—"}</td>
                  <td className="border border-[#461D15] p-2 text-black align-top whitespace-pre-wrap text-center">{item.onde || "—"}</td>
                  <td className="border border-[#461D15] p-2 text-black align-top whitespace-pre-wrap">{item.porQue || "—"}</td>
                  <td className="border border-[#461D15] p-2 text-black align-top whitespace-pre-wrap">{item.como || "—"}</td>
                  <td className="border border-[#461D15] p-2 text-black align-top whitespace-pre-wrap text-center">{item.quantoCusta || "—"}</td>
                  <td className="border border-[#461D15] p-2 text-black align-top">
                    <div className="flex flex-col gap-1 items-center justify-center">
                      <span className="font-bold text-[8px]">{item.progresso !== undefined ? item.progresso : 0}%</span>
                      <div className="w-16 bg-slate-100 border border-slate-300 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#693A32] h-full"
                          style={{ width: `${item.progresso !== undefined ? item.progresso : 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modelo 70:20:10 na Impressão */}
      {decrypted?.learningEvidences && decrypted.learningEvidences.length > 0 && (
        <div className="border border-[#461D15] mb-6 mt-6 break-inside-avoid">
          <div className="bg-[#693A32] text-white text-xs font-bold text-center py-1.5 uppercase tracking-wide border-b border-[#461D15]">
            JORNADA DE APRENDIZAGEM (MODELO 70:20:10)
          </div>
          <table className="w-full text-left text-[9px] border-collapse bg-white">
            <thead>
              <tr className="bg-[#A78177]/20">
                <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[15%]">Categoria</th>
                <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[25%]">Iniciativa / Título</th>
                <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[35%]">Descrição (Aprendizados)</th>
                <th className="border border-[#461D15] p-2 text-center text-[#461D15] w-[25%]">Comprovação</th>
              </tr>
            </thead>
            <tbody>
              {decrypted.learningEvidences.map((evidence, idx) => (
                <tr key={idx}>
                  <td className="border border-[#461D15] p-2 text-black align-top font-bold text-center">
                    {evidence.category === '70' ? '70% (Prática)' : evidence.category === '20' ? '20% (Trocas)' : '10% (Teoria)'}
                  </td>
                  <td className="border border-[#461D15] p-2 text-black align-top whitespace-pre-wrap">{evidence.title || "—"}</td>
                  <td className="border border-[#461D15] p-2 text-black align-top whitespace-pre-wrap">{evidence.description || "—"}</td>
                  <td className="border border-[#461D15] p-2 text-black align-top">
                    {evidence.fileBase64 ? (
                      <span className="italic">📁 {evidence.fileName} (Anexado a plataforma)</span>
                    ) : evidence.link ? (
                      <a href={evidence.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{evidence.link}</a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Feedbacks */}
      <div className="space-y-4">
        {pdi.managerFeedback && (
          <div className="break-inside-avoid border border-[#461D15]">
            <div className="bg-[#A78177]/20 border-b border-[#461D15] px-3 py-1.5 text-[10px] font-bold text-[#461D15] uppercase">
              Parecer Técnico da Liderança Direta
            </div>
            <p className="text-[10px] leading-relaxed text-slate-800 p-3 bg-white italic whitespace-pre-wrap">
              {pdi.managerFeedback}
            </p>
          </div>
        )}

        {pdi.hrFeedback && (
          <div className="break-inside-avoid border border-[#461D15]">
            <div className="bg-[#A78177]/20 border-b border-[#461D15] px-3 py-1.5 text-[10px] font-bold text-[#461D15] uppercase">
              Parecer e Validação de Recursos Humanos
            </div>
            <p className="text-[10px] leading-relaxed text-slate-800 p-3 bg-white italic whitespace-pre-wrap">
              {pdi.hrFeedback}
            </p>
          </div>
        )}
      </div>

        {/* Check-ins timeline on Print */}
        {checkins.length > 0 && (
          <div>
            <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider border-b border-slate-300 pb-1 mb-2">
              8. Notas de Acompanhamento (Check-ins Trimestrais)
            </h3>
            <div className="space-y-4">
              {[...checkins]
                .sort((a, b) => b.date - a.date)
                .map((ci) => (
                  <div
                    key={ci.id}
                    className="p-2 border-l-2 border-slate-400 pl-3"
                  >
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                      <span>
                        {ci.authorName}{" "}
                        {ci.authorName === currentUserName &&
                        ci.authorRole === currentUserRole
                          ? "(Eu)"
                          : `(${ci.authorRole.toUpperCase()})`}
                      </span>
                      <span>{new Date(ci.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-850 whitespace-pre-wrap">
                      {ci.encryptedNote}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Signatures */}
      <div className="pt-16 grid grid-cols-3 gap-8">
        <div className="text-center border-t border-slate-750 pt-2 text-[10px] text-slate-500 flex flex-col justify-between h-14">
          <span>{t.signatureColaborador}</span>
          <span>{t.dateLabel}</span>
        </div>
        <div className="text-center border-t border-slate-750 pt-2 text-[10px] text-slate-500 flex flex-col justify-between h-14">
          <span>{t.signatureLider}</span>
          <span>{t.dateLabel}</span>
        </div>
        <div className="text-center border-t border-slate-750 pt-2 text-[10px] text-slate-500 flex flex-col justify-between h-14">
          <span>{t.signatureHr}</span>
          <span>{t.dateLabel}</span>
        </div>
      </div>
    </div>
  );
}
