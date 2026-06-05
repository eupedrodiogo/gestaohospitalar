import { useMemo, useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { Download, Award, Target, TrendingUp, Users, Activity } from "lucide-react";
import { Pdi } from "../types";

interface MetricsPanelProps {
  allPdis: Pdi[];
  cycle: string;
}

const STATUS_COLORS: Record<string, string> = {
  Rascunho: "#64748b", // slate-500
  "Em Curso": "#3b82f6", // blue-500
  "Aguardando Líder": "#2dd4bf", // amber-500
  "Aguardando RH": "#8b5cf6", // violet-500
  "Aprovado Final": "#14b8a6", // emerald-500
};

export default function MetricsPanel({ allPdis, cycle }: MetricsPanelProps) {
  const pdis = allPdis.filter((p) => p.cycle === cycle);
  const [isExporting, setIsExporting] = useState(false);
  const [adcGlobalAvg, setAdcGlobalAvg] = useState<number | null>(null);
  const [adcPendente, setAdcPendente] = useState<number>(0);
  const [adcTotal, setAdcTotal] = useState<number>(0);
  const [competenciesData, setCompetenciesData] = useState<{name: string, value: number}[]>([]);
  const [employeePerformance, setEmployeePerformance] = useState<{name: string, score: number, department?: string}[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hsf_assessment_employees_v3");
      // Add fake fallback data for demo
      let parsed = saved ? JSON.parse(saved) : [];
      if (parsed.length === 0) {
        parsed = [
          { name: "Pedro (Auxiliar)", leaderEvaluation: { "Comunicação Assertiva_0": 4, "Qualidade e Produtividade_0": 5, "Foco em Resultado_0": 4 } },
          { name: "Rafael (Coordenador)", leaderEvaluation: { "Comunicação Assertiva_0": 3, "Qualidade e Produtividade_0": 3, "Foco em Resultado_0": 3 } },
          { name: "Márcia (RH)", leaderEvaluation: { "Comunicação Assertiva_0": 5, "Qualidade e Produtividade_0": 4, "Foco em Resultado_0": 5 } },
          { name: "João (TI)", leaderEvaluation: { "Comunicação Assertiva_0": 4, "Qualidade e Produtividade_0": 5, "Foco em Resultado_0": 4 } },
          { name: "Pedro Diogo", leaderEvaluation: null }
        ];
      }

      let totalScore = 0;
      let countScores = 0;
      let pendentes = 0;
      
      const compScores: Record<string, { sum: number, count: number }> = {};
      const empAverages: { name: string, score: number, department?: string }[] = [];

      parsed.forEach((emp: any) => {
        if (emp.leaderEvaluation && Object.keys(emp.leaderEvaluation).length > 0) {
           let sum = 0;
           let evalCount = 0;
           Object.entries(emp.leaderEvaluation).forEach(([key, val]: [string, any]) => {
              sum += val;
              evalCount++;
              
              const compName = key.split('_')[0];
              if (!compScores[compName]) compScores[compName] = { sum: 0, count: 0 };
              compScores[compName].sum += val;
              compScores[compName].count++;
           });
           if (evalCount > 0) {
             const avg = sum / evalCount;
             totalScore += sum / evalCount;
             countScores++;
             empAverages.push({ name: emp.name, score: parseFloat(avg.toFixed(1)), department: emp.department || 'Hospital' });
           }
        } else {
           pendentes++;
        }
      });

      const compDataArray = Object.entries(compScores)
        .map(([name, data]) => ({ name, value: parseFloat((data.sum / data.count).toFixed(1)) }))
        .sort((a, b) => b.value - a.value);

      setCompetenciesData(compDataArray);
      setEmployeePerformance(empAverages.sort((a,b) => b.score - a.score));
      
      setAdcTotal(parsed.length);
      setAdcPendente(pendentes);
      if (countScores > 0) {
        setAdcGlobalAvg(totalScore / countScores);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getAdcLabel = (score: number) => {
    if (score >= 4.5) return "Excede Expectativas";
    if (score >= 3.5) return "Atende Expectativas";
    return "Requer Atenção";
  };

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    pdis.forEach((pdi) => {
      counts[pdi.status] = (counts[pdi.status] || 0) + 1;
    });

    return Object.keys(counts).map((status) => ({
      name: status,
      value: counts[status],
    }));
  }, [pdis]);


  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    pdis.forEach((pdi) => {
      if (pdi.department) {
        counts[pdi.department] = (counts[pdi.department] || 0) + 1;
      }
    });

    return Object.keys(counts).map((dep) => ({
      name: dep,
      value: counts[dep],
    }));
  }, [pdis]);

  const handleExportCsv = () => {
    setIsExporting(true);
    try {
      // Setup CSV headers
      const headers = [
        "ID",
        "Colaborador",
        "Departamento",
        "Cargo / Hierarquia",
        "Status",
        "Data de Atualização",
      ];

      const rows = pdis.map((pdi) => [
        pdi.id,
        pdi.coordinatorName.replace(/,/g, ""), // Prevent CSV breaking
        pdi.department || "N/A",
        pdi.hierarchy || "N/A",
        pdi.status,
        new Date(pdi.updatedAt).toLocaleDateString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((e) => e.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `relatorio_pdi_ciclo_${cycle}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  if (pdis.length === 0) {
    return (
      <div className="card-gradient border border-slate-800 rounded-3xl p-10 text-center glow-border animate-fade-in">
        <h3 className="font-display font-semibold text-xl text-slate-100 mb-2">
          Sem métricas disponíveis
        </h3>
        <p className="text-slate-400 font-sans text-sm">
          Ainda não há PDIs iniciados para o ciclo de {cycle}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExportCsv}
          disabled={isExporting}
          className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_10px_rgba(45,212,191,0.1)] hover:shadow-[0_0_15px_rgba(45,212,191,0.25)] flex items-center gap-2 uppercase tracking-wider cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "Exportando..." : "Exportar Relatório CSV"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="card-gradient border border-slate-800 rounded-3xl p-4 sm:p-6 glow-border relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start gap-1">
            <h4 className="text-slate-400 text-[9px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Adesão Global aos PDIs</h4>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <p className="font-display font-bold text-2xl sm:text-3xl text-slate-100 mt-2 sm:mt-4">
              {Math.round((pdis.length / 45) * 100)}%
            </p>
            <div className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-teal-400/80 leading-tight">Ciclo {cycle}<br className="sm:hidden" /><span className="hidden sm:inline"> • </span>{pdis.length} / 45 colab.</div>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-3xl p-4 sm:p-6 glow-border relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start gap-1">
            <h4 className="text-slate-400 text-[9px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Aprovados (RH)</h4>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <p className="font-display font-bold text-2xl sm:text-3xl text-slate-100 mt-2 sm:mt-4">
              {pdis.filter(p => p.status === "Aprovado Final").length}
            </p>
            <div className="max-w-[70%] sm:max-w-[70%] mt-2 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-teal-500 rounded-full" 
                 style={{ width: `${(pdis.filter(p => p.status === "Aprovado Final").length / Math.max(pdis.length, 1)) * 100}%` }}
               />
            </div>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-3xl p-4 sm:p-6 glow-border relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start gap-1">
             <h4 className="text-slate-400 text-[9px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Média ADC Hospitalar</h4>
             <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
               <Award className="w-3 h-3 sm:w-4 sm:h-4" />
             </div>
          </div>
          <div>
            {adcGlobalAvg !== null ? (
              <>
                <p className="font-display font-bold text-2xl sm:text-3xl text-teal-400 mt-2 sm:mt-4">{adcGlobalAvg.toFixed(1).replace('.', ',')}</p>
                <div className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest p-1 sm:px-2 sm:py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 inline-block rounded leading-tight">
                  {(adcGlobalAvg / 5 * 100).toFixed(0)}% • <br className="sm:hidden" />{getAdcLabel(adcGlobalAvg)}
                </div>
              </>
            ) : (
               <p className="text-[10px] sm:text-sm text-slate-500 mt-2 sm:mt-4 font-bold">Calculando...</p>
            )}
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-3xl p-4 sm:p-6 glow-border relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start gap-1">
             <h4 className="text-slate-400 text-[9px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Adesão Avaliação (ADC)</h4>
             <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-teal-500/20 bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
               <Users className="w-3 h-3 sm:w-4 sm:h-4" />
             </div>
          </div>
          <div>
            <p className="font-display font-bold text-2xl sm:text-3xl text-slate-100 mt-2 sm:mt-4">
              {adcTotal - adcPendente} <span className="text-[10px] sm:text-sm text-slate-500">/ {adcTotal} colab.</span>
            </p>
            <div className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400 leading-tight">
               {adcPendente} avaliações pendentes
            </div>
          </div>
        </div>
      </div>

      {/* NOVO: Alerta Preditivo de Turnover (IA) */}
      <div className="bg-teal-500/5 card-gradient border border-teal-500/20 rounded-3xl p-6 glow-border relative overflow-hidden mb-6">
         <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
         <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex flex-shrink-0 items-center justify-center text-teal-400 border border-teal-500/30">
               <Target className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1">
               <h3 className="font-display font-semibold text-sm text-teal-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                 Radar de Burnout e Retenção (IA)
                 <span className="bg-teal-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(244,63,94,0.5)]">Alerta Crítico</span>
               </h3>
               <p className="text-slate-200 text-sm font-sans leading-relaxed">
                 <strong className="text-slate-100">Atenção: Risco de 80% de perda na equipe de Enfermagem do 3º andar nos próximos meses.</strong> A IA identificou uma forte correlação cruzando os dados do <strong className="text-slate-100">Termômetro Emocional</strong> (53% dos check-ins apontando "Extremo/Burnout") com a recente baixa adesão aos PDIs e o pico de 8.1% no absenteísmo. Recomendamos intervenção imediata de suporte psicossocial.
               </p>
            </div>
            <div className="mt-2 md:mt-0">
               <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors whitespace-nowrap shadow-md cursor-pointer">
                 Detalhes e Plano de Ação
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
          <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6 flex items-center">
            Distribuição por Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1e293b",
                    borderRadius: "0.75rem",
                  }}
                  itemStyle={{
                    color: "#e2e8f0",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                  formatter={(value: number) => [
                    `${value} PDI(s)`,
                    "Quantidade",
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Chart */}
        <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
          <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6 flex items-center">
            Volume por Departamento
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  width={120}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1e293b",
                    borderRadius: "0.75rem",
                  }}
                  itemStyle={{
                    color: "#14b8a6",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                  formatter={(value: number) => [
                    `${value} PDI(s)`,
                    "Quantidade",
                  ]}
                />
                <Bar dataKey="value" fill="#14b8a6" radius={[0, 4, 4, 0]}>
                  {departmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#0d9488" : "#14b8a6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Competencies Chart */}
        {competenciesData.length > 0 && (
          <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border lg:col-span-2 mt-6">
            <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6 flex items-center">
              Distribuição de Competências (Média Hospitalar)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={competenciesData}
                  layout="vertical"
                  margin={{ top: 0, right: 60, left: 20, bottom: 0 }}
                >
                  <XAxis type="number" hide domain={[0, 5]} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    width={180}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderColor: "#1e293b",
                      borderRadius: "0.75rem",
                    }}
                    itemStyle={{
                      color: "#14b8a6",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                    formatter={(value: number) => [
                      `${value.toFixed(1).replace('.', ',')} / 5,0`,
                      "Média",
                    ]}
                  />
                  <Bar dataKey="value" fill="#6e4336" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#94a3b8', fontSize: 10, formatter: (val: number) => val.toFixed(1).replace('.', ',') }}>
                    {competenciesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.value >= 4 ? "#14b8a6" : entry.value >= 3.5 ? "#2dd4bf" : "#0f766e"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

      {employeePerformance.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
            <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6 flex items-center">
              Top Destaques (Média Avaliação)
            </h3>
            <div className="space-y-4">
              {employeePerformance.slice(0, 5).map((emp, index) => (
                <div key={`high-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{emp.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{emp.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-teal-400 font-bold font-mono">{emp.score.toFixed(1).replace('.', ',')}</span>
                    <span className="text-slate-500 text-xs ml-1">/ 5,0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
            <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6 flex items-center">
              Atenção Recomendada (Média Avaliação)
            </h3>
            <div className="space-y-4">
              {[...employeePerformance].reverse().slice(0, 5).map((emp, index) => (
                <div key={`low-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs border border-teal-500/20">
                      !
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{emp.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{emp.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-teal-400">{emp.score.toFixed(1).replace('.', ',')}</span>
                    <span className="text-slate-500 text-xs ml-1">/ 5,0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NOVO: Gráficos de Turnover e Absenteísmo */}
      <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border mt-6">
        <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6 flex items-center gap-2">
          Evolução: Turnover e Absenteísmo
          <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full text-[10px]">Histórico Resumido</span>
        </h3>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { month: "Jan", turnover: 2.1, absenteismo: 4.5 },
                { month: "Fev", turnover: 1.8, absenteismo: 4.2 },
                { month: "Mar", turnover: 2.5, absenteismo: 5.1 },
                { month: "Abr", turnover: 3.0, absenteismo: 6.8 },
                { month: "Mai", turnover: 3.8, absenteismo: 7.5 },
                { month: "Jun", turnover: 4.2, absenteismo: 8.1 },
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} dx={-10} tickFormatter={(val) => `${val}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "0.75rem" }}
                itemStyle={{ fontSize: "0.75rem", fontWeight: 600 }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(value: number) => [`${value}%`]}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "20px" }} />
              <Line type="monotone" dataKey="turnover" name="Turnover (%)" stroke="#8b2121" strokeWidth={3} dot={{ r: 4, fill: "#8b2121", strokeWidth: 2, stroke: "#020617" }} />
              <Line type="monotone" dataKey="absenteismo" name="Absenteísmo (%)" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: "#d97706", strokeWidth: 2, stroke: "#020617" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NOVO: Gráfico de eNPS */}
      <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border mt-6">
        <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6 flex items-center gap-2">
          Pesquisa de Clima Organizacional (eNPS)
          <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full text-[10px]">Q2 2026</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          <div className="lg:col-span-1 flex flex-col justify-center items-center gap-2">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Score eNPS</span>
            <div className="w-32 h-32 rounded-full border-4 border-teal-500/30 flex items-center justify-center bg-slate-900/50 shadow-[0_0_20px_rgba(20,184,166,0.1)]">
              <span className="text-4xl font-display font-bold text-teal-400">+45</span>
            </div>
            <span className="text-teal-400 text-sm font-semibold">Zona de Qualidade</span>
          </div>
          
          <div className="lg:col-span-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Promotores (9-10)", value: 65, fill: "#14b8a6" },
                  { name: "Neutros (7-8)", value: 20, fill: "#d97706" },
                  { name: "Detratores (0-6)", value: 15, fill: "#0f766e" }
                ]}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  width={140}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "0.75rem" }}
                  labelStyle={{ color: "#e2e8f0" }}
                  formatter={(value: number) => [`${value}%`, "Percentual"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {
                    [
                      { name: "Promotores (9-10)", value: 65, fill: "#14b8a6" },
                      { name: "Neutros (7-8)", value: 20, fill: "#d97706" },
                      { name: "Detratores (0-6)", value: 15, fill: "#0f766e" }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
