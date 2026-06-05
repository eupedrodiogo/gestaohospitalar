import React, { useState } from "react";
import { HardHat, Activity, AlertTriangle, ShieldCheck, ClipboardCheck, TrendingDown, CheckSquare, Square, XCircle, Search, CalendarDays, Clock, BellRing, X, FireExtinguisher } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

interface SegurancaTrabalhoPanelProps {
  userRole: string;
  userName: string;
}

const nrsData = [
  { id: "NR-32", name: "Segurança na Saúde", compliances: 92 },
  { id: "NR-06", name: "EPIs", compliances: 88 },
  { id: "NR-09", name: "Riscos Ambientais", compliances: 100 },
  { id: "NR-17", name: "Ergonomia", compliances: 75 },
];

const incidentTrendData = [
  { month: "Jan", incidents: 8, nearMiss: 15 },
  { month: "Fev", incidents: 5, nearMiss: 10 },
  { month: "Mar", incidents: 4, nearMiss: 8 },
  { month: "Abr", incidents: 6, nearMiss: 12 },
  { month: "Mai", incidents: 2, nearMiss: 5 },
  { month: "Jun", incidents: 1, nearMiss: 3 },
];

const incidentLog = [
  { id: "INC-042", date: "01/06/2026", type: "Acidente com Perfurocortante", desc: "Técnico de enfermagem sofreu perfuração com agulha no PS", severity: "Média", status: "Em Investigação" },
  { id: "NM-119", date: "28/05/2026", type: "Quase Acidente (Near Miss)", desc: "Piso escorregadio na recepção sem sinalização", severity: "Baixa", status: "Resolvido" },
  { id: "INC-041", date: "15/05/2026", type: "Queda de Mesmo Nível", desc: "Colaborador escorregou no refeitório", severity: "Baixa", status: "Fechado" },
];

const initialUpcomingInspections = [
  { id: "INSP-01", nr: "NR-32", desc: "Inspeção de Saúde e Segurança", date: "08/06/2026", status: "Agendado", type: "Rotina" },
  { id: "INSP-02", nr: "NR-17", desc: "Laudo Ergonômico Setor Administrativo", date: "22/06/2026", status: "Pendente", type: "Auditoria" },
  { id: "INSP-03", nr: "NR-06", desc: "Verificação de Estoque e Vencimento de EPIs", date: "05/07/2026", status: "Agendado", type: "Verificação" },
  { id: "INSP-04", nr: "NR-09", desc: "Renovação PPRA / PGR", date: "10/07/2026", status: "Agendado", type: "Documental" },
];

const initialExtinguishersData = [
  { id: "EXT-001", type: "Água Pressurizada", location: "Corredor Principal - Térreo", lastInspection: "10/05/2026", nextInspection: "10/05/2027", status: "Regular", inspector: "Samuel" },
  { id: "EXT-002", type: "CO2", location: "Sala de Servidores - 1º Andar", lastInspection: "20/05/2026", nextInspection: "20/05/2027", status: "Regular", inspector: "Samuel" },
  { id: "EXT-003", type: "Pó Químico Seco (PQS)", location: "Refeitório - Térreo", lastInspection: "15/06/2025", nextInspection: "15/06/2026", status: "Vencendo", inspector: "Ana" },
  { id: "EXT-004", type: "Espuma Mecânica", location: "Almoxarifado Geral", lastInspection: "01/02/2025", nextInspection: "01/02/2026", status: "Vencido", inspector: "Ana" },
  { id: "EXT-005", type: "Água Pressurizada", location: "Recepção Central", lastInspection: "05/04/2026", nextInspection: "05/04/2027", status: "Regular", inspector: "Samuel" },
];

export default function SegurancaTrabalhoPanel({ userRole, userName }: SegurancaTrabalhoPanelProps) {
  const [activeTab, setActiveTab] = useState<'kpi' | 'incidentes' | 'calendario' | 'extintores'>('kpi');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [selectedExtinguisher, setSelectedExtinguisher] = useState<typeof initialExtinguishersData[0] | null>(null);
  const [checklistState, setChecklistState] = useState<Record<string, Record<string, boolean>>>({});
  const [inspections, setInspections] = useState(initialUpcomingInspections);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newInspection, setNewInspection] = useState({ nr: '', desc: '', date: '', type: 'Rotina' });
  const [scheduleError, setScheduleError] = useState('');
  const [extinguishers, setExtinguishers] = useState(initialExtinguishersData);
  const [showNewExtinguisherModal, setShowNewExtinguisherModal] = useState(false);
  const [newExtinguisher, setNewExtinguisher] = useState({ type: '', location: '', lastInspection: '', nextInspection: '', inspector: userName.split(' ')[0] });
  const [extinguisherError, setExtinguisherError] = useState('');

  const handleOpenExtinguisher = (ext: typeof initialExtinguishersData[0]) => {
    setSelectedExtinguisher(ext);
    if (!checklistState[ext.id]) {
      setChecklistState(prev => ({
        ...prev,
        [ext.id]: {
          pressao: true,
          lacre: true,
          cilindro: true,
          mangueira: true,
          sinalizacao: true
        }
      }));
    }
  };

  const toggleChecklistItem = (id: string, key: string) => {
    setChecklistState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: !prev[id][key]
      }
    }));
  };

  const today = new Date("2026-06-02T00:00:00");
  const urgentInspections = inspections.filter(insp => {
    if (dismissedAlerts.includes(insp.id)) return false;
    const [d, m, y] = insp.date.split('/');
    const inspDate = new Date(`${y}-${m}-${d}T00:00:00`);
    const diffTime = inspDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const totalExtinguishers = extinguishers.length;
  const regularExtinguishers = extinguishers.filter(ext => ext.status === 'Regular').length;
  const compliancePercentage = totalExtinguishers === 0 ? 0 : Math.round((regularExtinguishers / totalExtinguishers) * 100);
  const criticalExtinguisher = extinguishers.find(ext => ext.status === 'Vencido') || extinguishers.find(ext => ext.status === 'Vencendo');

  return (
    <div className="space-y-6 text-left animate-fade-in pb-20 md:pb-0 SegurancaTrabalhoPanel">
      {urgentInspections.length > 0 && (
        <div className="flex flex-col gap-3 mb-2">
          {urgentInspections.map(insp => (
            <div key={insp.id} className="relative bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-start gap-4 animate-in slide-in-from-top-4 fade-in duration-300">
              <div className="bg-orange-500/20 p-2 rounded-lg shrink-0">
                <BellRing className="w-5 h-5 text-orange-400 animate-pulse" />
              </div>
              <div className="flex-1 pr-6">
                <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
                  Aviso: Inspeção Próxima ({insp.nr})
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  A inspeção <span className="font-semibold text-slate-200">"{insp.desc}"</span> está programada para o dia <span className="font-semibold text-slate-200">{insp.date}</span> (em menos de 7 dias).
                </p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setActiveTab('calendario')} className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 px-3 py-1.5 rounded-lg transition-colors">
                    Ver Calendário
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setDismissedAlerts(prev => [...prev, insp.id])}
                className="absolute top-4 right-4 text-orange-400/50 hover:text-orange-400 transition-colors"
                title="Ignorar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
            <HardHat className="w-6 h-6 text-teal-400" />
            Segurança do Trabalho
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Gestão de riscos, EPIs e compliance normativo.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3.5 md:gap-4 shadow-sm w-full md:w-auto animate-in fade-in zoom-in-95 duration-500">
          {/* Seção 1: Estatísticas e Mini Gráfico */}
          <div className="flex items-center justify-between md:justify-start gap-3 md:gap-4">
            {/* Bloco 1: Percentual de Conformidade */}
            <div className="flex items-center gap-2 md:gap-3 pr-2.5 md:pr-4 border-r border-slate-800 shrink-0">
              <div className={`p-1.5 md:p-2 rounded-lg ${compliancePercentage === 100 ? 'bg-[#2f6e46]/20 text-[#2f6e46]' : compliancePercentage >= 80 ? 'bg-orange-500/20 text-orange-400' : 'bg-[#8b2121]/20 text-[#8b2121]'} shrink-0`}>
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <span className="block text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-tight max-w-[80px] md:max-w-none">Conformidade (Extintores)</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base md:text-xl font-display font-bold text-slate-200">{compliancePercentage}%</span>
                </div>
              </div>
            </div>

            {/* Bloco 2: Contadores */}
            <div className="flex flex-col gap-0.5 text-[11px] md:text-xs font-medium min-w-[70px] md:min-w-[90px] shrink-0">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2f6e46] shrink-0"></span>
                  <span className="text-slate-400">Regular</span>
                </div>
                <span className="text-slate-200 font-bold">{regularExtinguishers}</span>
              </div>
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${totalExtinguishers - regularExtinguishers > 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></span>
                  <span className="text-slate-400">Pendentes</span>
                </div>
                <span className="text-slate-200 font-bold">{totalExtinguishers - regularExtinguishers}</span>
              </div>
            </div>

            {/* Bloco 3: Gráfico Torta */}
            <div className="w-[38px] h-[38px] md:w-[46px] md:h-[46px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Regular', value: regularExtinguishers },
                      { name: 'Pendentes', value: totalExtinguishers - regularExtinguishers }
                    ]}
                    innerRadius={10}
                    outerRadius={17}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#2f6e46" />
                    <Cell fill={totalExtinguishers - regularExtinguishers > 0 ? '#f97316' : '#334155'} />
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px', fontSize: '11px', padding: '4px 8px' }}
                     itemStyle={{ color: '#e2e8f0' }}
                     labelStyle={{ display: 'none' }}
                     formatter={(value: number, name: string) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Divisor horizontal para dispositivos móveis */}
          <div className="h-px bg-slate-800/80 w-full md:hidden"></div>

          {/* Seção 2: Recomendação Inteligente */}
          <div className="flex items-center justify-between md:justify-start gap-4 p-0 md:pl-4 md:border-l md:border-slate-800 shrink-0 w-full md:w-auto">
            {criticalExtinguisher ? (
              <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto animate-[pulse_3s_infinite]">
                <div className="flex flex-col text-left max-w-[200px] md:max-w-[130px]">
                  <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3 text-orange-400 animate-pulse" /> Recomenda-se
                  </span>
                  <span className="text-[11.5px] font-bold text-slate-200 leading-tight mt-0.5 truncate block w-full">
                    Regularizar {criticalExtinguisher.id}
                  </span>
                  <span className="text-[9px] text-slate-500 leading-none mt-0.5 truncate block w-full">
                    {criticalExtinguisher.location.split(' - ')[0]}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('extintores');
                    handleOpenExtinguisher(criticalExtinguisher);
                  }}
                  className="bg-orange-500 hover:bg-orange-400 text-slate-950 p-1.5 md:p-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-md shadow-orange-500/10 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                  title={`Iniciar vistoria no extintor ${criticalExtinguisher.id}`}
                >
                  <ClipboardCheck className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
                <div className="flex flex-col text-left max-w-[200px] md:max-w-[130px]">
                  <span className="text-[9px] text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-teal-400" /> Sistema Seguro
                  </span>
                  <span className="text-[11.5px] font-bold text-slate-200 leading-tight mt-0.5">
                    Todos em dia
                  </span>
                  <span className="text-[9px] text-slate-500 leading-none mt-0.5">
                    100% conformidade
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('extintores');
                    setShowNewExtinguisherModal(true);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 p-1.5 md:p-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                  title="Registrar novo extintor"
                >
                  <FireExtinguisher className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Dias Sem Acidentes<br className="sm:hidden" /> com Afastamento</h4>
          <div className="mt-2 text-teal-400">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 flex items-center gap-2">42 <ShieldCheck className="w-4 h-4" /></p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">Meta: 100 dias</p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Taxa de<br className="sm:hidden" /> Frequência</h4>
          <div className="mt-2 text-slate-100">
            <p className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2">4.5 <Activity className="w-4 h-4 text-slate-400" /></p>
            <p className="text-[9px] sm:text-[11px] text-teal-400 mt-1 leading-tight line-clamp-1 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> -12% vs mês ant.</p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Adesão à<br className="sm:hidden" /> NR-32</h4>
          <div className="mt-2">
            <p className="text-xl sm:text-2xl font-display font-bold text-slate-100">92%</p>
            <p className="text-[9px] sm:text-[11px] text-teal-400 mt-1 leading-tight line-clamp-1 flex items-center gap-1"><CheckSquare className="w-3 h-3" /> Alto Padrão</p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group border-orange-500/30">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Inspeções<br className="sm:hidden" /> Pendentes</h4>
          <div className="mt-2 text-orange-400">
            <p className="text-xl sm:text-2xl font-display font-bold text-orange-400 flex items-center gap-2">3 <AlertTriangle className="w-4 h-4" /></p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">Prioridade Alta</p>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-900/50 p-1 rounded-xl w-fit border border-slate-800 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'kpi' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('calendario')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'calendario' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Calendário de Inspeções
        </button>
        <button
          onClick={() => setActiveTab('extintores')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'extintores' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Gestão de Extintores
        </button>
        <button
          onClick={() => setActiveTab('incidentes')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'incidentes' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Relatório de Incidentes
        </button>
      </div>

      {activeTab === 'kpi' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-slate-100">Tendência de Incidentes</h3>
                  <p className="text-xs text-slate-400">Acidentes vs Near Misses (Últimos 6 meses)</p>
                </div>
                <Activity className="w-5 h-5 text-teal-400 opacity-50" />
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incidentTrendData}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b2121" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b2121" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="incidents" name="Acidentes" stroke="#8b2121" strokeWidth={2} fillOpacity={1} fill="url(#colorInc)" />
                    <Area type="monotone" dataKey="nearMiss" name="Quase Acidente" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#colorNm)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-slate-100">Compliance NRs</h3>
                  <p className="text-xs text-slate-400">Adesão por Norma Regulamentadora (%)</p>
                </div>
                <ClipboardCheck className="w-5 h-5 text-teal-400 opacity-50" />
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nrsData} maxBarSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="id" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip
                      cursor={{ fill: '#1e293b', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px' }}
                    />
                    <Bar dataKey="compliances" name="% Adesão" fill="#2f6e46" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-slate-100 flex items-center gap-2">
                  Mapa de Calor de Riscos
                </h3>
                <p className="text-xs text-slate-400">Pendências de NRs por Setor Hospitalar</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {[
                { sector: 'Pronto Socorro', riskLevel: 'high', pending: 8, label: 'Crítico' },
                { sector: 'Refeitório', riskLevel: 'high', pending: 6, label: 'Crítico' },
                { sector: 'Centro Cirúrgico', riskLevel: 'medium', pending: 4, label: 'Atenção' },
                { sector: 'UTI', riskLevel: 'medium', pending: 3, label: 'Atenção' },
                { sector: 'Enfermaria', riskLevel: 'low', pending: 1, label: 'Controlado' },
                { sector: 'Administrativo', riskLevel: 'low', pending: 0, label: 'Controlado' },
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                  item.riskLevel === 'high' ? 'bg-[#8b2121]/20 border-[#8b2121]/40 hover:bg-[#8b2121]/30' : 
                  item.riskLevel === 'medium' ? 'bg-[#d97706]/20 border-[#d97706]/40 hover:bg-[#d97706]/30' : 
                  'bg-[#2f6e46]/20 border-[#2f6e46]/40 hover:bg-[#2f6e46]/30'
                }`}>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${
                      item.riskLevel === 'high' ? 'bg-[#8b2121]/30 text-red-300' :
                      item.riskLevel === 'medium' ? 'bg-[#d97706]/30 text-orange-300' :
                      'bg-[#2f6e46]/30 text-green-300'
                    }`}>
                      {item.label}
                    </span>
                    <h4 className="text-sm font-bold text-slate-200 leading-tight">{item.sector}</h4>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <span className="text-xs text-slate-400 font-medium tracking-wide">Pendências</span>
                    <span className={`text-2xl font-display font-bold leading-none ${
                      item.riskLevel === 'high' ? 'text-red-400' :
                      item.riskLevel === 'medium' ? 'text-orange-400' :
                      'text-green-400'
                    }`}>{item.pending}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendario' && (
        <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-display font-bold text-slate-100 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-teal-400" />
                Calendário de Inspeções NRs
              </h3>
              <p className="text-xs text-slate-400 mt-1">Datas programadas para vistorias e renovações de laudos.</p>
            </div>
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 px-4 py-2 rounded-lg text-sm font-medium border border-teal-500/20 transition-colors"
            >
              + Agendar Inspeção
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inspections.map((insp) => (
              <div key={insp.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex gap-4 hover:border-slate-700 transition-colors">
                <div className="flex flex-col items-center justify-center bg-slate-800/80 rounded-lg min-w-[70px] p-2 border border-slate-700">
                  <span className="text-xs text-slate-400 uppercase font-bold">{insp.date.split('/')[1] === '06' ? 'JUN' : 'JUL'}</span>
                  <span className="text-2xl font-display font-bold text-slate-100 leading-none my-1">{insp.date.split('/')[0]}</span>
                  <span className="text-[10px] text-slate-500">2026</span>
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30">
                      {insp.nr}
                    </span>
                    <span className={`text-[10px] font-medium flex items-center gap-1 ${insp.status === 'Agendado' ? 'text-blue-400' : 'text-orange-400'}`}>
                      <Clock className="w-3 h-3" /> {insp.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mt-1">{insp.desc}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">Tipo: {insp.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'extintores' && (
        <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-display font-bold text-slate-100 flex items-center gap-2">
                <FireExtinguisher className="w-5 h-5 text-teal-400" />
                Gestão de Extintores
              </h3>
              <p className="text-xs text-slate-400 mt-1">Controle de localização, tipo e vencimento de extintores.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Buscar por ID ou Local..." className="bg-slate-900 border border-slate-700 text-sm rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500 w-full" />
              </div>
              <button 
                onClick={() => setShowNewExtinguisherModal(true)}
                className="bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 px-4 py-2 rounded-lg text-sm font-medium border border-teal-500/20 transition-colors whitespace-nowrap"
              >
                + Novo Registro
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-medium px-2">ID / Tipo</th>
                  <th className="pb-3 font-medium px-2">Localização</th>
                  <th className="pb-3 font-medium px-2">Última Inspeção</th>
                  <th className="pb-3 font-medium px-2">Próximo Vencimento</th>
                  <th className="pb-3 font-medium px-2">Responsável</th>
                  <th className="pb-3 font-medium px-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {extinguishers.map((ext) => (
                  <tr key={ext.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-2">
                      <div className="text-sm font-medium text-slate-200">{ext.id}</div>
                      <div className="text-xs text-slate-500">{ext.type}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-sm text-slate-300 flex items-center gap-2">
                        {ext.location}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-sm text-slate-400">{ext.lastInspection}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-sm text-slate-400 font-medium">{ext.nextInspection}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-sm text-slate-300 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-700">
                          {ext.inspector.charAt(0)}
                        </div>
                        {ext.inspector}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ext.status === "Regular" ? "bg-[#2f6e46]/20 text-[#2f6e46] border border-[#2f6e46]/30" : 
                          ext.status === "Vencendo" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : 
                          "bg-[#8b2121]/20 text-[#8b2121] border border-[#8b2121]/30"
                        }`}>
                          {ext.status === 'Vencendo' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {ext.status}
                        </span>
                        <button 
                          onClick={() => handleOpenExtinguisher(ext)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg border border-slate-700 transition-colors"
                          title="Ver Ficha de Vistoria"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedExtinguisher && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h3 className="font-display font-bold text-slate-100 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-teal-400" />
                Vistoria: {selectedExtinguisher.id}
              </h3>
              <button 
                onClick={() => setSelectedExtinguisher(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Local</span>
                  <span className="text-sm font-medium text-slate-200">{selectedExtinguisher.location}</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Tipo</span>
                  <span className="text-sm font-medium text-slate-200">{selectedExtinguisher.type}</span>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Checklist de Manutenção</h4>
                
                <button 
                  onClick={() => toggleChecklistItem(selectedExtinguisher.id, 'pressao')}
                  className="w-full flex items-center justify-between text-sm py-2 px-3 hover:bg-slate-800 rounded-lg group transition-colors border border-transparent hover:border-slate-700"
                >
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors">Pressão do Manômetro</span>
                  <span className={`flex items-center gap-1.5 transition-colors ${checklistState[selectedExtinguisher.id]?.pressao ? 'text-teal-400' : 'text-slate-500'}`}>
                    {checklistState[selectedExtinguisher.id]?.pressao ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />} 
                    <span className="w-5 text-left">{checklistState[selectedExtinguisher.id]?.pressao ? 'OK' : '--'}</span>
                  </span>
                </button>
                <button 
                  onClick={() => toggleChecklistItem(selectedExtinguisher.id, 'lacre')}
                  className="w-full flex items-center justify-between text-sm py-2 px-3 hover:bg-slate-800 rounded-lg group transition-colors border border-transparent hover:border-slate-700"
                >
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors">Lacre Intacto</span>
                  <span className={`flex items-center gap-1.5 transition-colors ${checklistState[selectedExtinguisher.id]?.lacre ? 'text-teal-400' : 'text-slate-500'}`}>
                    {checklistState[selectedExtinguisher.id]?.lacre ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />} 
                    <span className="w-5 text-left">{checklistState[selectedExtinguisher.id]?.lacre ? 'OK' : '--'}</span>
                  </span>
                </button>
                <button 
                  onClick={() => toggleChecklistItem(selectedExtinguisher.id, 'cilindro')}
                  className="w-full flex items-center justify-between text-sm py-2 px-3 hover:bg-slate-800 rounded-lg group transition-colors border border-transparent hover:border-slate-700"
                >
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors">Condições do Cilindro</span>
                  <span className={`flex items-center gap-1.5 transition-colors ${checklistState[selectedExtinguisher.id]?.cilindro ? 'text-teal-400' : 'text-slate-500'}`}>
                    {checklistState[selectedExtinguisher.id]?.cilindro ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />} 
                    <span className="w-5 text-left">{checklistState[selectedExtinguisher.id]?.cilindro ? 'OK' : '--'}</span>
                  </span>
                </button>
                <button 
                  onClick={() => toggleChecklistItem(selectedExtinguisher.id, 'mangueira')}
                  className="w-full flex items-center justify-between text-sm py-2 px-3 hover:bg-slate-800 rounded-lg group transition-colors border border-transparent hover:border-slate-700"
                >
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors">Mangueira / Esguicho</span>
                  <span className={`flex items-center gap-1.5 transition-colors ${checklistState[selectedExtinguisher.id]?.mangueira ? 'text-teal-400' : 'text-slate-500'}`}>
                    {checklistState[selectedExtinguisher.id]?.mangueira ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />} 
                    <span className="w-5 text-left">{checklistState[selectedExtinguisher.id]?.mangueira ? 'OK' : '--'}</span>
                  </span>
                </button>
                <button 
                  onClick={() => toggleChecklistItem(selectedExtinguisher.id, 'sinalizacao')}
                  className="w-full flex items-center justify-between text-sm py-2 px-3 hover:bg-slate-800 rounded-lg group transition-colors border border-transparent hover:border-slate-700"
                >
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors">Sinalização Adequada</span>
                  <span className={`flex items-center gap-1.5 transition-colors ${checklistState[selectedExtinguisher.id]?.sinalizacao ? 'text-teal-400' : 'text-slate-500'}`}>
                    {checklistState[selectedExtinguisher.id]?.sinalizacao ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />} 
                    <span className="w-5 text-left">{checklistState[selectedExtinguisher.id]?.sinalizacao ? 'OK' : '--'}</span>
                  </span>
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 border border-slate-700">
                    {selectedExtinguisher.inspector.charAt(0)}
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Inspecionado por</span>
                    <span className="text-sm font-medium text-slate-200">{selectedExtinguisher.inspector}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Data</span>
                  <span className="text-sm font-medium text-slate-200">{selectedExtinguisher.lastInspection}</span>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-800 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedExtinguisher(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setExtinguishers(prev => prev.map(ext => {
                    if (ext.id === selectedExtinguisher.id) {
                      return {
                        ...ext,
                        status: "Regular",
                        lastInspection: "02/06/2026",
                        nextInspection: "02/06/2027",
                        inspector: userName.split(' ')[0]
                      };
                    }
                    return ext;
                  }));
                  setSelectedExtinguisher(null);
                }}
                className="bg-teal-500 hover:bg-teal-400 text-teal-950 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Salvar Vistoria
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'incidentes' && (
        <div className="card-gradient border border-slate-800 rounded-2xl p-5 glow-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-display font-bold text-slate-100 flex items-center gap-2">
                Registro de Incidentes
              </h3>
              <p className="text-xs text-slate-400 mt-1">Logs recentes de segurança do trabalho.</p>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Buscar ID..." className="bg-slate-900 border border-slate-700 text-sm rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500 w-full" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-medium px-2">ID / Data</th>
                  <th className="pb-3 font-medium px-2">Tipo / Descrição</th>
                  <th className="pb-3 font-medium px-2">Gravidade</th>
                  <th className="pb-3 font-medium px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {incidentLog.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-2">
                      <div className="text-sm font-medium text-slate-200">{inc.id}</div>
                      <div className="text-xs text-slate-500">{inc.date}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-sm text-slate-300">{inc.type}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{inc.desc}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === "Alta" ? "bg-[#8b2121]/20 text-[#8b2121] border border-[#8b2121]/30" : 
                        inc.severity === "Média" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : 
                        "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                      }`}>
                        {inc.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        inc.status === "Resolvido" || inc.status === "Fechado" ? "bg-[#2f6e46]/20 text-[#2f6e46] border border-[#2f6e46]/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h3 className="font-display font-bold text-slate-100 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-teal-400" />
                Agendar Nova Inspeção
              </h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Norma Regulamentadora (NR) <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Ex: NR-32" 
                    value={newInspection.nr}
                    onChange={(e) => setNewInspection({...newInspection, nr: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Descrição <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Descrição da inspeção..." 
                    value={newInspection.desc}
                    onChange={(e) => setNewInspection({...newInspection, desc: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Data Programada <span className="text-red-400">*</span></label>
                  <input 
                    type="date"
                    min={today.toISOString().split('T')[0]}
                    value={newInspection.date ? newInspection.date.split('/').reverse().join('-') : ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        setNewInspection({...newInspection, date: ''});
                      } else {
                        const [year, month, day] = e.target.value.split('-');
                        setNewInspection({...newInspection, date: `${day}/${month}/${year}`});
                      }
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Tipo de Inspeção</label>
                  <select 
                    value={newInspection.type}
                    onChange={(e) => setNewInspection({...newInspection, type: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                  >
                    <option value="Rotina">Rotina</option>
                    <option value="Auditoria">Auditoria</option>
                    <option value="Verificação">Verificação</option>
                    <option value="Documental">Documental</option>
                  </select>
                </div>
              </div>
            </div>
            
            {scheduleError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mx-5 mb-4 text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {scheduleError}
              </div>
            )}
            
            <div className="p-5 border-t border-slate-800 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowScheduleModal(false);
                  setScheduleError('');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (!newInspection.nr || !newInspection.desc || !newInspection.date) {
                    setScheduleError("Preencha todos os campos obrigatórios.");
                    return;
                  }
                  
                  const selectedDate = new Date(newInspection.date.split('/').reverse().join('-') + 'T00:00:00');
                  const todayDate = new Date(today);
                  todayDate.setHours(0,0,0,0);
                  if (selectedDate < todayDate) {
                     setScheduleError("A data não pode ser no passado.");
                     return;
                  }

                  setInspections([
                    ...inspections, 
                    { 
                      ...newInspection, 
                      id: `INSP-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`, 
                      status: "Agendado" 
                    }
                  ]);
                  setShowScheduleModal(false);
                  setNewInspection({ nr: '', desc: '', date: '', type: 'Rotina' });
                  setScheduleError('');
                }}
                className="bg-teal-500 hover:bg-teal-400 text-teal-950 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Salvar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
      {showNewExtinguisherModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h3 className="font-display font-bold text-slate-100 flex items-center gap-2">
                <FireExtinguisher className="w-5 h-5 text-teal-400" />
                Registrar Extintor
              </h3>
              <button 
                onClick={() => setShowNewExtinguisherModal(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Localização <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Ex: Corredor A - 1º Andar" 
                    value={newExtinguisher.location}
                    onChange={(e) => setNewExtinguisher({...newExtinguisher, location: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Tipo <span className="text-red-400">*</span></label>
                  <select 
                    value={newExtinguisher.type}
                    onChange={(e) => setNewExtinguisher({...newExtinguisher, type: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                  >
                    <option value="" disabled>Selecione o tipo</option>
                    <option value="Água Pressurizada">Água Pressurizada</option>
                    <option value="Pó Químico Seco (PQS)">Pó Químico Seco (PQS)</option>
                    <option value="CO2">CO2</option>
                    <option value="Espuma Mecânica">Espuma Mecânica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Última Inspeção <span className="text-red-400">*</span></label>
                  <input 
                    type="date"
                    max={today.toISOString().split('T')[0]}
                    value={newExtinguisher.lastInspection ? newExtinguisher.lastInspection.split('/').reverse().join('-') : ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        setNewExtinguisher({...newExtinguisher, lastInspection: ''});
                      } else {
                        const [year, month, day] = e.target.value.split('-');
                        setNewExtinguisher({...newExtinguisher, lastInspection: `${day}/${month}/${year}`});
                      }
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Próximo Vencimento <span className="text-red-400">*</span></label>
                  <input 
                    type="date"
                    value={newExtinguisher.nextInspection ? newExtinguisher.nextInspection.split('/').reverse().join('-') : ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        setNewExtinguisher({...newExtinguisher, nextInspection: ''});
                      } else {
                        const [year, month, day] = e.target.value.split('-');
                        setNewExtinguisher({...newExtinguisher, nextInspection: `${day}/${month}/${year}`});
                      }
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {extinguisherError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mx-5 mb-4 text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {extinguisherError}
              </div>
            )}
            
            <div className="p-5 border-t border-slate-800 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowNewExtinguisherModal(false);
                  setExtinguisherError('');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (!newExtinguisher.location || !newExtinguisher.type || !newExtinguisher.lastInspection || !newExtinguisher.nextInspection) {
                    setExtinguisherError("Preencha todos os campos obrigatórios.");
                    return;
                  }
                  
                  const lastDate = new Date(newExtinguisher.lastInspection.split('/').reverse().join('-') + 'T00:00:00');
                  const nextDate = new Date(newExtinguisher.nextInspection.split('/').reverse().join('-') + 'T00:00:00');
                  const todayDate = new Date(today);
                  todayDate.setHours(0,0,0,0);
                  
                  if (lastDate > todayDate) {
                     setExtinguisherError("A última inspeção não pode ser no futuro.");
                     return;
                  }
                  
                  if (nextDate <= lastDate) {
                    setExtinguisherError("O vencimento deve ser posterior à última inspeção.");
                    return;
                  }

                  let status = "Regular";
                  const diffTime = nextDate.getTime() - todayDate.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  if (diffDays <= 0) {
                    status = "Vencido";
                  } else if (diffDays <= 30) {
                    status = "Vencendo";
                  }

                  setExtinguishers([
                    ...extinguishers, 
                    { 
                      ...newExtinguisher,
                      id: `EXT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`, 
                      status
                    }
                  ]);
                  setShowNewExtinguisherModal(false);
                  setNewExtinguisher({ type: '', location: '', lastInspection: '', nextInspection: '', inspector: userName.split(' ')[0] });
                  setExtinguisherError('');
                }}
                className="bg-teal-500 hover:bg-teal-400 text-teal-950 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Salvar Extintor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
