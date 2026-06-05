import React, { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  FileText, 
  BarChart2, 
  TrendingUp as TrendUpIcon, 
  AlertCircle, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle, 
  Sliders, 
  Briefcase, 
  Crown,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Coins
} from "lucide-react";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  BarChart, 
  Bar, 
  LineChart,
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

interface DiretoriaPanelProps {
  userRole: "diretor_administrativo" | "diretor_geral" | string;
  userName: string;
}

// Data from FinanceiroPanel: Cash flow representation
const monthlyCashFlow = [
  { month: "Jan", Receitas: 4800000, Despesas: 3900000, Saldo: 900000 },
  { month: "Fev", Receitas: 4950000, Despesas: 4100000, Saldo: 850000 },
  { month: "Mar", Receitas: 5100000, Despesas: 4200000, Saldo: 900000 },
  { month: "Abr", Receitas: 4980000, Despesas: 4050000, Saldo: 930000 },
  { month: "Mai", Receitas: 5200000, Despesas: 4150000, Saldo: 1050000 },
  { month: "Jun", Receitas: 5400000, Despesas: 4250000, Saldo: 1150000 },
];

// Data from CustosPanel: Department Costs and Revenue
const costCentersData = [
  { department: "Pronto Socorro", Custo: 850000, Faturamento: 1100000, Margem: 250000 },
  { department: "UTI Adulto", Custo: 1200000, Faturamento: 1450000, Margem: 250000 },
  { department: "Centro Cirúrgico", Custo: 950000, Faturamento: 1700000, Margem: 750000 },
  { department: "SADT / Exames", Custo: 450000, Faturamento: 680000, Margem: 230000 },
  { department: "Internações", Custo: 750000, Faturamento: 1050000, Margem: 300000 },
];

// Data from FaturamentoPanel: Denial Trend Data (%)
const denialTrends = [
  { month: "Jan", taxa: 3.4 },
  { month: "Fev", taxa: 3.1 },
  { month: "Mar", taxa: 2.8 },
  { month: "Abr", taxa: 2.5 },
  { month: "Mai", taxa: 2.3 },
  { month: "Jun", taxa: 2.1 },
];

// Data from FaturamentoPanel: Insurance billing distribution
const insuranceData = [
  { name: "Bradesco Saúde", value: 1420000, glosa: 89000 },
  { name: "Amil S380", value: 1120000, glosa: 54000 },
  { name: "Unimed Rio", value: 1680000, glosa: 21000 },
  { name: "SulAmérica", value: 980000, glosa: 45000 },
  { name: "Cassi / Golden", value: 780000, glosa: 32000 },
];

const COLORS = ["#14b8a6", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];

export default function DiretoriaPanel({ userRole, userName }: DiretoriaPanelProps) {
  // Tabs: Visão Geral, Financeiro, Custos, Faturamento
  const [activeSubTab, setActiveSubTab] = useState<"geral" | "financeiro" | "custos" | "faturamento">("geral");

  // What-If Scenario Levers
  const [reductionOPEX, setReductionOPEX] = useState(5); // % of cost savings on OPME/supplies
  const [glosaRecoveryRate, setGlosaRecoveryRate] = useState(40); // % of denied bills successfully recovered
  const [occupancyRate, setOccupancyRate] = useState(82); // target hospital bed occupancy %

  // Calculation logic based on inputs:
  const baseMonthlyRevenue = 5400000;
  const baseMonthlyExpenses = 4250000;
  const baseEBITDA = baseMonthlyRevenue - baseMonthlyExpenses; // 1,150,000

  // Simulated results
  const simulatedOPEXSavings = Math.round(baseMonthlyExpenses * (reductionOPEX / 100) * 0.45); // Assuming OPEX is 45% of total expenses
  const simulatedGlosaRecovery = Math.round(241000 * (glosaRecoveryRate / 100)); // Total active glosa around 241k
  const simulatedOccupancyImpact = Math.round((occupancyRate - 80) * 28000); // 28k additional revenue per point above 80%

  const totalSimulatedSavings = Math.max(0, simulatedOPEXSavings + simulatedGlosaRecovery + simulatedOccupancyImpact);
  const simulatedNewEBITDA = baseEBITDA + totalSimulatedSavings;
  const simulatedMarginPercent = ((simulatedNewEBITDA / baseMonthlyRevenue) * 100).toFixed(1);

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in pb-20 md:pb-0 font-sans">
      
      {/* Header Container */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-500/10 text-teal-400 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 border border-teal-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Painel de Decisão Estratégica
            </span>
            <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-500/20">
              HSF Executive Board
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-100 flex items-center gap-3">
            {userRole === "diretor_geral" ? (
              <Crown className="w-7 h-7 text-amber-400" />
            ) : (
              <Briefcase className="w-7 h-7 text-teal-400" />
            )}
            Cockpit de Diretoria Hospitalar
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Consolidado estratégico integrado para {userName} • Dados integrados de <strong>Financeiro</strong>, <strong>Custos</strong> e <strong>Faturamento</strong>.
          </p>
        </div>

        {/* Global Select Tab Controls */}
        <div className="flex flex-wrap gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setActiveSubTab("geral")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "geral"
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Visão Consolidada
          </button>
          <button
            onClick={() => setActiveSubTab("financeiro")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "financeiro"
                ? "bg-slate-800 text-teal-400 border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            F. de Caixa & DRE
          </button>
          <button
            onClick={() => setActiveSubTab("custos")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "custos"
                ? "bg-slate-800 text-teal-400 border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Custos Setoriais
          </button>
          <button
            onClick={() => setActiveSubTab("faturamento")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "faturamento"
                ? "bg-slate-800 text-teal-400 border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Faturamento & Glosas
          </button>
        </div>
      </div>

      {/* Primary KPI Row - Integrated Strategy Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Faturamento Mensal Consolidado */}
        <div className="card-gradient border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all pointer-events-none" />
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faturamento Consolidado</span>
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">R$ 5,40M</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +3.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">Acumulado dos 5 principais convênios da rede</p>
        </div>

        {/* KPI 2: Custos de Operação Médicos/Gerais */}
        <div className="card-gradient border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all pointer-events-none" />
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Despesas / Custos Totais</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">R$ 4,20M</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -2.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">Insumos, OPME, salários e recursos básicos</p>
        </div>

        {/* KPI 3: EBITDA e Margem Médicas */}
        <div className="card-gradient border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">EBITDA Hospitalar</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">R$ 1,20M</span>
            <span className="text-xs font-semibold text-teal-400 bg-teal-550/10 px-1.5 py-0.5 rounded text-[10px]">
              Margem: 22.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">Superavit bruto gerado pela operação da unidade</p>
        </div>

        {/* KPI 4: Taxa de Glosa & Perdas Auditoria */}
        <div className="card-gradient border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Taxa de Glosa (Média)</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">2,1%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -1.3% p.p.
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">Melhor histórico consecutivo nos últimos 6 meses</p>
        </div>
      </div>

      {/* Main Dashboard Layout section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Dynamic Charts based on Selected SubTab */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SubTab View 1: GERAl - Combined Cockpit Charts */}
          {activeSubTab === "geral" && (
            <div className="space-y-6">
              
              {/* Integrated Finance performance plot */}
              <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Desempenho Financeiro Consolidado</h3>
                    <p className="text-xs text-slate-400">Fluxo agregativo de receitas, despesas operacionais e saldo mensal</p>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-teal-400 border border-slate-700 px-2 py-0.5 rounded font-mono">Semestre Atual</span>
                </div>
                
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyCashFlow} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f1f5f9", borderRadius: "12px", fontSize: "12px" }}
                        formatter={(value: any) => [formatCurrency(value), ""]}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                      <Bar dataKey="Receitas" fill="#14b8a6" barSize={24} name="Receita Bruta" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Despesas" fill="#f43f5e" barSize={14} name="Custos Totais" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="Saldo" stroke="#a855f7" strokeWidth={3} name="Superávit Operacional" dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost centers comparison chart */}
              <div className="card-gradient border border-slate-800 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Custo Operacional vs Faturamento Gerado</h3>
                    <p className="text-xs text-slate-400">Performance financeira e margem de contribuição por centro de custo médico</p>
                  </div>
                  <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded font-mono">Eficiência Setorial</span>
                </div>

                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costCentersData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="department" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `R$ ${value / 1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f1f5f9", borderRadius: "12px", fontSize: "12px" }}
                        formatter={(value: any) => [formatCurrency(value), ""]}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                      <Bar dataKey="Faturamento" fill="#3b82f6" name="Faturamento Produzido" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Custo" fill="#ea580c" name="Custo Direto Absorvido" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* SubTab View 2: FINANCEIRO (Cashflow projections & DRE Analysis) */}
          {activeSubTab === "financeiro" && (
            <div className="space-y-6">
              <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border">
                <h3 className="text-base font-bold text-slate-100 mb-1">Demonstração Simplificada do Resultado (DRE)</h3>
                <p className="text-xs text-slate-400 mb-4 font-mono">Visão Realística consolidada do ciclo hospitalar Corrente</p>

                <div className="space-y-3">
                  {[
                    { label: "Receita Operacional Bruta", value: 5400000, percentage: "100%", isSub: false, isPos: true },
                    { label: "(-) Impostos, Deduções e Glosas", value: -320000, percentage: "-5.9%", isSub: true, isPos: false },
                    { label: "Receita Operacional Líquida (ROL)", value: 5080000, percentage: "94.1%", isSub: false, isPos: true },
                    { label: "(-) Custos de Equipe e Médicos", value: -2100000, percentage: "-38.9%", isSub: true, isPos: false },
                    { label: "(-) Materiais Assistenciais, OPME e Insumos", value: -1850000, percentage: "-34.3%", isSub: true, isPos: false },
                    { label: "Margem de Contribuição Bruta", value: 1130000, percentage: "20.9%", isSub: false, isPos: true },
                    { label: "(-) OPEX e Despesas de Apoio Adm", value: -250000, percentage: "-4.6%", isSub: true, isPos: false },
                    { label: "EBITDA Hospitalar Provisório", value: 880000, percentage: "16.3%", isSub: false, isPos: true, highlight: true },
                  ].map((row, idx) => (
                    <div 
                      key={idx} 
                      className={`flex justify-between items-center p-2.5 rounded-xl transition-all ${
                        row.highlight 
                          ? "bg-teal-500/10 border border-teal-500/20 text-teal-300 font-bold" 
                          : row.isSub 
                          ? "pl-8 text-slate-400 bg-slate-950/20" 
                          : "text-slate-200 bg-slate-900/60 font-semibold"
                      }`}
                    >
                      <span className="text-xs">{row.label}</span>
                      <div className="flex items-center gap-4 font-mono text-xs">
                        <span className={row.highlight ? "text-teal-400" : row.value < 0 ? "text-rose-400" : "text-emerald-400"}>
                          {formatCurrency(row.value)}
                        </span>
                        <span className="text-[10px] text-slate-500 w-10 text-right">{row.percentage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary cash trend area chart */}
              <div className="card-gradient border border-slate-800 rounded-2xl p-5">
                <h3 className="text-base font-bold text-slate-100 mb-1">Margem de Superávit Hospitalar (Histórico)</h3>
                <p className="text-xs text-slate-400 mb-4">Percentuais e saldos líquidos em conta de custodeio institucional</p>
                
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyCashFlow} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f1f5f9", borderRadius: "12px", fontSize: "12px" }}
                        formatter={(value: any) => [formatCurrency(value), "Saldo de Caixa"]}
                      />
                      <Line type="monotone" dataKey="Saldo" stroke="#14b8a6" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* SubTab View 3: CUSTOS (Deep analysis of cost centers) */}
          {activeSubTab === "custos" && (
            <div className="space-y-6">
              
              {/* Cost and waste indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-gradient border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Desperdício Estimado Recorrente</h4>
                  <p className="text-2xl font-bold font-mono text-amber-500">R$ 145.200</p>
                  <p className="text-xs text-slate-500 mt-2">Principalmente atribuído a perdas na gasoterapia e gases especiais (14%) e insumos cirúrgicos sem fracionamento.</p>
                </div>
                <div className="card-gradient border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Centro Cirúrgico (Mais lucrativo)</h4>
                  <p className="text-2xl font-bold font-mono text-indigo-400">R$ 750.000</p>
                  <p className="text-xs text-slate-500 mt-2">Margem operacional de 44% sobre o faturamento setorial acumulado. Foco no aumento de volume cirúrgico.</p>
                </div>
              </div>

              {/* OPME costs by specialization block */}
              <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Distribuição de Custo de Alto Risco (OPME)</h3>
                    <p className="text-xs text-slate-400">Órteses, Próteses e Materiais Especiais em processamento</p>
                  </div>
                  <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">Alerta Monitoramento</span>
                </div>

                <div className="space-y-4">
                  {[
                    { spec: "Hemodinâmica Vascular", val: 820000, pct: 85, state: "Atenção de Custos" },
                    { spec: "Ortopedia & Traumatologia", val: 650000, pct: 68, state: "Regular" },
                    { spec: "Neurologia Avançada", val: 480000, pct: 50, state: "Controlado" },
                    { spec: "Cardiologia Crítica", val: 350000, pct: 36, state: "Controlado" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-200">{item.spec}</span>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-slate-400">{formatCurrency(item.val)}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            item.val > 600000 ? "bg-rose-500/10 text-rose-400" : "bg-slate-800 text-slate-400"
                          }`}>{item.state}</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.val > 600000 ? "bg-gradient-to-r from-orange-500 to-rose-500" : "bg-gradient-to-r from-teal-500 to-blue-500"
                          }`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SubTab View 4: FATURAMENTO (Billing profiles, Health companies and Denial rates) */}
          {activeSubTab === "faturamento" && (
            <div className="space-y-6">
              
              {/* Core analytics for Billings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Billing per insurance company */}
                <div className="card-gradient border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-base font-bold text-slate-100 mb-1">Faturamento Bruto por Convênio</h3>
                  <p className="text-xs text-slate-400 mb-3">Rateio de receitas geradas pelas operadoras de saúde</p>
                  
                  <div className="h-[200px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={insuranceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {insuranceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f1f5f9", borderRadius: "8px", fontSize: "11px" }}
                          formatter={(value: any) => [formatCurrency(value), "Faturado"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {insuranceData.map((d, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-slate-400 truncate">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Glosa history trend line */}
                <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border">
                  <h3 className="text-base font-bold text-slate-100 mb-1">Evolução do Índice de Glosa</h3>
                  <p className="text-xs text-slate-400 mb-4">Acompanhamento de relatórios médicos de auditoria externa (%)</p>
                  
                  <div className="h-[210px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={denialTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 4]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f1f5f9", borderRadius: "12px", fontSize: "11px" }}
                          formatter={(value: any) => [`${value}%`, "Taxa de Glosa"]}
                        />
                        <Line type="monotone" dataKey="taxa" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Table of Health insurance Audited summary stats */}
              <div className="card-gradient border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-100 mb-3">Detalhamento de Faturamento e Glosas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="text-[10px] uppercase text-slate-500 bg-slate-950/40 font-mono">
                      <tr>
                        <th className="p-3">Operadora / Convênio</th>
                        <th className="p-3">Faturamento Bruto</th>
                        <th className="p-3 text-right">Glosa Aplicada</th>
                        <th className="p-3 text-right">Índice Glosa</th>
                        <th className="p-3 text-right">Status Recurso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {insuranceData.map((d, index) => {
                        const rate = ((d.glosa / d.value) * 100).toFixed(1);
                        return (
                          <tr key={index} className="hover:bg-slate-900/55 transition-all">
                            <td className="p-3 font-semibold text-slate-200">{d.name}</td>
                            <td className="p-3 font-mono">{formatCurrency(d.value)}</td>
                            <td className="p-3 text-right font-mono text-amber-500">{formatCurrency(d.glosa)}</td>
                            <td className="p-3 text-right font-mono font-bold text-slate-400">{rate}%</td>
                            <td className="p-3 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                d.glosa > 50000 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-teal-500/10 text-teal-400"
                              }`}>
                                {d.glosa > 50000 ? "Auditoria Crítica" : "Conciliado"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right 1 Column: What-If Strategic Simulator Panel */}
        <div className="space-y-6">
          
          {/* Decision Simulation Area */}
          <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-teal-400/20">
              <Sliders className="w-12 h-12" />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-100 leading-snug">Simulador Estratégico HSF</h3>
                <p className="text-[11px] text-slate-400">Impacto em tempo real sobre EBITDA e Margem</p>
              </div>
            </div>

            {/* Slider 1: OPEX Cost Saved */}
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Redução Desperdício OPME / OPEX</span>
                <span className="font-mono text-teal-400 font-bold">{reductionOPEX}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="25" 
                step="1"
                value={reductionOPEX} 
                onChange={(e) => setReductionOPEX(Number(e.target.value))}
                className="w-full accent-teal-400 h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Aperfeiçoamento contratual e padronização de órteses/próteses</p>
            </div>

            {/* Slider 2: Glosa Recovery rate from total active denials */}
            <div className="space-y-2 mt-5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Conversão de Glosas Recorridas</span>
                <span className="font-mono text-teal-400 font-bold">{glosaRecoveryRate}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="90" 
                step="5"
                value={glosaRecoveryRate} 
                onChange={(e) => setGlosaRecoveryRate(Number(e.target.value))}
                className="w-full accent-teal-400 h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Recurso ativo manual de lotes Bradesco e Unimed</p>
            </div>

            {/* Slider 3: Target Bed occupancy rate */}
            <div className="space-y-2 mt-5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Ocupação de Leitos Alvo</span>
                <span className="font-mono text-teal-400 font-bold">{occupancyRate}%</span>
              </div>
              <input 
                type="range" 
                min="70" 
                max="95" 
                step="1"
                value={occupancyRate} 
                onChange={(e) => setOccupancyRate(Number(e.target.value))}
                className="w-full accent-teal-400 h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Melhoria do giro de leitos no Pronto Atendimento e UTI</p>
            </div>

            {/* Simulated Margin Outcome */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 mt-6 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Resultado Simulado</span>
                <span className="text-[10px] bg-teal-500/10 text-teal-400 px-1.5 py-0.2 rounded font-bold font-mono">DRE PROJETADO</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-slate-300">Nova Margem de Lucro:</span>
                <span className="text-base font-bold text-teal-400 font-mono">{simulatedMarginPercent}%</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-slate-300">Superávit Estimado (Mês):</span>
                <span className="text-sm font-bold text-slate-100 font-mono">{formatCurrency(simulatedNewEBITDA)}</span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-slate-900">
                <span className="text-[11px] text-indigo-400 font-bold">Ganho Operacional Criado:</span>
                <span className="text-xs font-bold text-indigo-400 font-mono">+{formatCurrency(totalSimulatedSavings)}</span>
              </div>
            </div>
          </div>

          {/* Active Custom Recommendations Tailored to Director Roles */}
          <div className="card-gradient border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Coins className="w-4 h-4 text-teal-400" />
              Recomendações e Plano Geral de Ação
            </h3>

            {/* Adaptive Content depending on logged in Director */}
            {userRole === "diretor_administrativo" ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Planos de controle operacional em andamento para o Diretor Administrativo <strong>Jociliano</strong>:
                </p>

                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Auditoria de Gases (O2)
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Manutenção preventiva agendada para a central de White Martins para corrigir perda de pressão de <strong>14%</strong> de desperdício estimado.
                  </p>
                </div>

                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-teal-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    Medicamentos de Alto Custo
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Expansão da triagem e fracionamento farmacológico de dose unitária na UTI. Queda projetada de despesas em insumos de até R$ 42.000 mensais.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Decisões institucionais e comerciais críticas monitoradas pelo Diretor Geral <strong>Carlos</strong>:
                </p>

                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-indigo-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Contrato Unimed Rio Lote 91
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Remessa de R$ 1.650.000 em processamento. Auditoria interna liberou sem recusas adicionais. Reunião de conciliação agendada com diretoria comercial.
                  </p>
                </div>

                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Alocação UTI Adulto
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Custo direto fixado em R$ 1,20M contra Faturamento de R$ 1,45M (margem estreita de 20%). Recomendado alinhar custos fixos assistenciais.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Operational Sector Warnings (Global Channel) */}
          <div className="card-gradient border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avisos urgentes de controle</h4>
            
            <div className="flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-slate-400 text-[11px]">
                <strong className="text-slate-200">Glosas Ativas:</strong> R$ 143.000 em contas auditadas Bradesco e Amil aguardando recurso manual.
              </p>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-slate-400 text-[11px]">
                <strong className="text-slate-200">OPME Otimizada:</strong> Implantação de fracionamento reduziu perdas de antibióticos para apenas 2%.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
