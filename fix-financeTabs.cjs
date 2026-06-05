const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace financeiro references with individual tabs in main areas

// 1. In the Main Content area, intercept the old financeiro block.
// Instead of just `{activeTab === "financeiro"}`, we should allow any of the new tabs
code = code.replace(
  /\{\s*activeTab === "financeiro" && \(\s*<FinanceiroPanel userRole=\{profile\.role\} userName=\{profile\.name\} \/>\s*\)\s*\}/,
  `{["financeiro", "caixa", "tesouraria", "glosas", "dre"].includes(activeTab) && (
            <FinanceiroPanel 
              userRole={profile.role} 
              userName={profile.name} 
              currentTab={activeTab === "financeiro" ? "caixa" : activeTab as any} 
              onTabChange={(tab) => setActiveTab(tab)}
            />
          )}`
);

// 2. In sidebar
const sidebarFinanceiro = `{isTabAllowed("financeiro", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("financeiro")}
              className={\`w-full flex items-center \${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer \${
                activeTab === "financeiro"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }\`}
              title={!isSidebarExpanded ? "Gestão Financeira" : undefined}
            >
              <Coins className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Gestão Financeira</span>
              )}
            </button>
          )}`;

const newSidebarFinanceiro = `{isTabAllowed("financeiro", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("financeiro")}
              className={\`w-full flex items-center \${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer \${
                ["financeiro", "caixa", "tesouraria", "glosas", "dre"].includes(activeTab)
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }\`}
              title={!isSidebarExpanded ? "Gestão Financeira" : undefined}
            >
              <Coins className="w-[20px] h-[20px] shrink-0" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Gestão Financeira</span>
              )}
            </button>
          )}

          {isTabAllowed("caixa", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("caixa")}
              className={\`w-full flex items-center \${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer \${
                activeTab === "caixa"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }\`}
              title={!isSidebarExpanded ? "Visão Geral & Caixa" : undefined}
            >
              <Activity className="w-[20px] h-[20px] shrink-0 text-teal-400" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Visão Geral & Caixa</span>
              )}
            </button>
          )}

          {isTabAllowed("tesouraria", profile?.role || "") && (
            <button
              onClick={() => setActiveTab("tesouraria")}
              className={\`w-full flex items-center \${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer \${
                activeTab === "tesouraria"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }\`}
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
              className={\`w-full flex items-center \${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} gap-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer \${
                activeTab === "glosas"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent"
              }\`}
              title={!isSidebarExpanded ? "Auditoria & Glosas" : undefined}
            >
              <ShieldCheck className="w-[20px] h-[20px] shrink-0 text-teal-400" />
              {isSidebarExpanded && (
                <span className="whitespace-nowrap">Auditoria & Glosas</span>
              )}
            </button>
          )}`;

code = code.replace(sidebarFinanceiro, newSidebarFinanceiro);

const mobileGridMenu = `{isTabAllowed("financeiro", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("financeiro");
                    setShowMoreTabs(false);
                  }}
                  className={\`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 \${
                    activeTab === "financeiro"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }\`}
                >
                  <Coins
                    className={\`w-6 h-6 \${activeTab === "financeiro" ? "text-teal-400" : "text-teal-500"}\`}
                  />
                  <span
                    className={\`text-[10px] font-bold uppercase tracking-wider text-center \${activeTab === "financeiro" ? "text-teal-400" : "text-slate-300"}\`}
                  >
                    Finanças
                  </span>
                </button>
              )}`;

const newMobileGridMenu = `{isTabAllowed("financeiro", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("financeiro");
                    setShowMoreTabs(false);
                  }}
                  className={\`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 \${
                    ["financeiro", "caixa", "tesouraria", "glosas", "dre"].includes(activeTab)
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }\`}
                >
                  <Coins
                    className={\`w-6 h-6 \${["financeiro", "caixa", "tesouraria", "glosas", "dre"].includes(activeTab) ? "text-teal-400" : "text-teal-500"}\`}
                  />
                  <span
                    className={\`text-[10px] font-bold uppercase tracking-wider text-center \${["financeiro", "caixa", "tesouraria", "glosas", "dre"].includes(activeTab) ? "text-teal-400" : "text-slate-300"}\`}
                  >
                    Finanças
                  </span>
                </button>
              )}

              {isTabAllowed("caixa", profile?.role || "") && (
                <button
                  onClick={() => {
                    setActiveTab("caixa");
                    setShowMoreTabs(false);
                  }}
                  className={\`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 \${
                    activeTab === "caixa"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }\`}
                >
                  <Activity
                    className={\`w-6 h-6 \${activeTab === "caixa" ? "text-teal-400" : "text-teal-500"}\`}
                  />
                  <span
                    className={\`text-[10px] font-bold uppercase tracking-wider text-center \${activeTab === "caixa" ? "text-teal-400" : "text-slate-300"}\`}
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
                  className={\`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 \${
                    activeTab === "tesouraria"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }\`}
                >
                  <Landmark
                    className={\`w-6 h-6 \${activeTab === "tesouraria" ? "text-teal-400" : "text-teal-500"}\`}
                  />
                  <span
                    className={\`text-[10px] font-bold uppercase tracking-wider text-center \${activeTab === "tesouraria" ? "text-teal-400" : "text-slate-300"}\`}
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
                  className={\`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 \${
                    activeTab === "glosas"
                      ? "bg-teal-500/15 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
                      : "bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }\`}
                >
                  <ShieldCheck
                    className={\`w-6 h-6 \${activeTab === "glosas" ? "text-teal-400" : "text-teal-500"}\`}
                  />
                  <span
                    className={\`text-[10px] font-bold uppercase tracking-wider text-center \${activeTab === "glosas" ? "text-teal-400" : "text-slate-300"}\`}
                  >
                    Glosas
                  </span>
                </button>
              )}
              `;

code = code.replace(mobileGridMenu, newMobileGridMenu);

const iconImports = `import {
  Bell,
  CheckCircle,
  Menu,
  Shield,
  FileText,
  MessageSquare as ChartNoAxesCombined,
  Home,
  Users,
  Settings,
  HeartPulse,
  Brain,
  Activity,
  LogOut,
  Target,
  ArrowRight,
  Stethoscope,
  Clock,
  Calendar,
  ClipboardList,
  AlertCircle,
  Trophy,
  Award,
  Zap,
  Star as CheckStar,
  LineChart,
  Megaphone,
  Mic,
  SmilePlus,
  Send,
  X,
  Plus,
  ThumbsUp,
  Presentation,
  CheckCircle2,
  BookOpen,
  Briefcase,
  PlayCircle,
  FileCheck,
  CloudSun,
  ShieldAlert,
  Save,
  Network,
  Scale,
  Lightbulb,
  Building2,
  Syringe,
  BarChart2,
  HeartHandshake,
  Keypad,
  Coins,
  Package,
  CircleDollarSign,
  Smartphone,
  Eye,
  Server,
  MoreHorizontal,
  Landmark,
  ShieldCheck,
} from "lucide-react";`;

if(!code.includes("Landmark")) {
  code = code.replace(/import \{[\s\S]*?\} from "lucide-react";/, iconImports);
}

// Modify More tab includes logic to keep it highlighted when inside a financeiro sub-tab
code = code.replace(/"financeiro"/g, '"financeiro", "caixa", "tesouraria", "glosas"');

fs.writeFileSync('src/App.tsx', code, 'utf8');

