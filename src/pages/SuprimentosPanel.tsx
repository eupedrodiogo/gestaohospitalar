import React, { useState } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Factory,
  Stethoscope,
  Briefcase,
  BarChart3,
  Pill,
  Microscope,
  Search,
  Target,
  ClipboardList,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface SuprimentosPanelProps {
  userRole: string;
  userName: string;
}

type SubTab =
  | "inicial"
  | "analise"
  | "almoxarifado"
  | "contratos"
  | "farmacia"
  | "laboratorio"
  | "swot"
  | "auditoria";

const savingData = [
  { item: "Atadura Esteril Crepom 15cmx1,8m" },
  { item: "Avental Cirurgico Sms Azul 40gr" },
  { item: "Avental Cirurgico Sms Azul 40gr Gg" },
  { item: "Avental Desc. Branco Polipropileno 30gr Ref:adbrd/adbrd" },
  { item: "Avental Descartavel Nao Esteril 20gr (amarelo)" },
  { item: "Avental Laminado 30gr Ref: Aba30 (banho Covid)" },
  { item: "Beckplater 5l (detergente Neutro)" },
  { item: "Campo Cirurgico Individual Laminado 1,00x1,70" },
];

const conformidadeData = [
  { name: "CONFORME", value: 75, color: "var(--theme-teal-400)" },
  { name: "NÃO AVALIADO", value: 15, color: "#f59e0b" },
  { name: "NÃO CONFORME", value: 10, color: "#ef4444" },
];

export default function SuprimentosPanel({
  userRole,
  userName,
}: SuprimentosPanelProps) {
  const [activeTab, setActiveTab] = useState<SubTab>("inicial");

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <Package className="w-8 h-8 text-teal-400" />
            Suprimentos & Logística
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Painel Executivo de Gestão de Suprimentos • Especializado
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
        {[
          { id: "inicial", label: "Inicial", icon: BarChart3 },
          { id: "analise", label: "Análise Crítica", icon: Target },
          { id: "almoxarifado", label: "Almoxarifado", icon: Package },
          { id: "contratos", label: "Contratos", icon: Briefcase },
          { id: "farmacia", label: "Farmácia", icon: Pill },
          { id: "laboratorio", label: "Laboratório", icon: Microscope },
          { id: "swot", label: "SWOT", icon: Search },
          {
            id: "auditoria",
            label: "Auditoria Terceiros",
            icon: ClipboardList,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SubTab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? "bg-teal-500/15 border border-teal-500/50 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="uppercase">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "inicial" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Total Previsto
              </h3>
              <p className="text-2xl font-display font-medium text-slate-100 mb-1">
                R$ 6.689.168,37
              </p>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingDown className="w-16 h-16 text-teal-400" />
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Índice sem Movimento
              </h3>
              <p className="text-2xl font-display font-medium text-teal-400 mb-1">
                6,50%
              </p>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Total Efetivo
              </h3>
              <p className="text-2xl font-display font-medium text-slate-100 mb-1">
                R$ 6.387.078,31
              </p>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="w-16 h-16 text-amber-500" />
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Valor Itens Sem Mov.
              </h3>
              <p className="text-2xl font-display font-medium text-amber-500 mb-1">
                R$ 291.878,02
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border flex flex-col justify-center bg-slate-900/40 relative overflow-hidden">
              <div className="text-center mb-6 relative z-10">
                <p className="text-3xl font-display font-medium text-teal-400">
                  R$ 62.718,02
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Saving Total
                </p>
              </div>
              <div className="space-y-4 relative z-10 w-full">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-center items-center">
                  <p className="text-slate-500 italic text-xs mb-1">
                    (Em branco)
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Saving Consumo
                  </p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-center items-center">
                  <p className="text-slate-500 italic text-xs mb-1">
                    (Em branco)
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Saving Contratos
                  </p>
                </div>
                <div className="bg-teal-500/10 p-4 rounded-xl border border-teal-500/30 text-center shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                  <p className="text-teal-400 font-bold text-base mb-1">
                    R$ 62.718,02
                  </p>
                  <p className="text-[10px] font-bold text-teal-500 uppercase tracking-wider">
                    Saving Pontual
                  </p>
                </div>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border lg:col-span-1">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-400" />
                Top Itens (Descrição)
              </h3>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {savingData.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-xs text-slate-300 font-medium transition-colors cursor-default"
                  >
                    {s.item}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Conformidade da Inspeção
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={conformidadeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {conformidadeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "farmacia" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Total Previsto Farmácia
              </h3>
              <p className="text-xl font-display font-medium text-slate-100 mb-1">
                R$ 2.436.756,97
              </p>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                % Efetivado
              </h3>
              <p className="text-2xl font-display font-medium text-teal-400 mb-1">
                94,11%
              </p>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Rep. Itens Sem Mov.
              </h3>
              <p className="text-2xl font-display font-medium text-slate-100 mb-1">
                1,95%
              </p>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border relative">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Disp. Não Padrão
              </h3>
              <p className="text-2xl font-display font-medium text-amber-500 mb-1">
                0,53%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                Compra Mensal vs Meta
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: "Jan", compra: 2457000, meta: 1320000 },
                      { name: "Fev", compra: 2314000, meta: 1320000 },
                      { name: "Mar", compra: 1217000, meta: 1320000 },
                      { name: "Abr", compra: 1250000, meta: 1320000 },
                      { name: "Mai", compra: 1424000, meta: 1320000 },
                      { name: "Jun", compra: 1315000, meta: 1320000 },
                    ]}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) =>
                        `R$ ${(val / 1000000).toFixed(1)}M`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="compra"
                      stroke="var(--theme-teal-400)"
                      fill="var(--theme-teal-400)"
                      fillOpacity={0.15}
                      name="Compra Efetiva"
                    />
                    <Area
                      type="step"
                      dataKey="meta"
                      stroke="#f59e0b"
                      fill="none"
                      strokeWidth={2}
                      name="Teto (Meta)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border relative">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-400" />
                Giro Financeiro Medicamentos
              </h3>
              <div className="h-64 flex flex-col justify-center items-center">
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#1e293b"
                      strokeWidth="24"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="var(--theme-teal-400)"
                      strokeWidth="24"
                      fill="none"
                      strokeDasharray="502"
                      strokeDashoffset="115"
                      className="shadow-[0_0_15px_rgba(20,184,166,0.5)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-display font-bold text-teal-400">
                      0.77
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-teal-500/80 font-bold tracking-wider text-xs uppercase mb-1">
                    Giro Saudável
                  </p>
                  <p className="text-slate-400 text-xs text-center border border-slate-700 bg-slate-800/50 rounded px-2 py-1">
                    Meta Institucional: &gt; 1.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Em desenvolvimento */}
      {activeTab !== "inicial" && activeTab !== "farmacia" && (
        <div className="flex flex-col items-center justify-center p-20 card-gradient border border-slate-800 rounded-3xl glow-border">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-700">
            <AlertTriangle className="w-10 h-10 text-teal-500/40" />
          </div>
          <h3 className="text-xl font-display font-medium text-slate-100 mb-2">
            Módulo em Integração
          </h3>
          <p className="text-slate-400 text-sm text-center max-w-md">
            Os paineis de <strong>{activeTab.toUpperCase()}</strong> já estão
            sendo mapeados do Power BI para esta visualização premium em Tempo
            Real. Você será notificado quando concluído.
          </p>
        </div>
      )}
    </div>
  );
}
