import React, { useState, useEffect } from "react";
import { Activity, Clock, Stethoscope, FileText, CheckCircle2, AlertTriangle, BarChart3, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SadtPanelProps {
  userRole: string;
  userName: string;
}

const tatExceededData7d = [
  { label: 'Seg', count: 4 },
  { label: 'Ter', count: 7 },
  { label: 'Qua', count: 3 },
  { label: 'Qui', count: 8 },
  { label: 'Sex', count: 2 },
  { label: 'Sáb', count: 5 },
  { label: 'Dom', count: 6 }
];

const tatExceededData30d = [
  { label: 'Sem 1', count: 25 },
  { label: 'Sem 2', count: 32 },
  { label: 'Sem 3', count: 18 },
  { label: 'Sem 4', count: 21 },
];

const tatExceededDataMonth = [
  { label: 'Dia 1-5', count: 15 },
  { label: 'Dia 6-10', count: 20 },
  { label: 'Dia 11-15', count: 12 },
  { label: 'Dia 16-20', count: 28 },
  { label: 'Dia 21-25', count: 17 },
  { label: 'Dia 26-30', count: 24 }
];

const doctorProductivityData = [
  { id: 1, name: 'Dr. Carlos Souza', specialty: 'Radiologia', volume: 145, avgTat: 42, trend: 'up' },
  { id: 2, name: 'Dra. Fernanda Lima', specialty: 'Ultrassonografia', volume: 89, avgTat: 28, trend: 'down' },
  { id: 3, name: 'Dr. Roberto Costa', specialty: 'Tomografia', volume: 112, avgTat: 55, trend: 'stable' },
  { id: 4, name: 'Dra. Julia Mendes', specialty: 'Ressonância', volume: 64, avgTat: 75, trend: 'up' },
];

type ChartPeriod = '7d' | '30d' | 'month';

export default function SadtPanel({ userRole, userName }: SadtPanelProps) {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('7d');
  
  const getChartData = () => {
    switch (chartPeriod) {
      case '30d': return tatExceededData30d;
      case 'month': return tatExceededDataMonth;
      case '7d':
      default: return tatExceededData7d;
    }
  };

  const [exams, setExams] = useState([
    { id: 'RX-1029', type: 'Raio-X Tórax', status: 'Aguardando', timeMinutes: 58, urg: 'Alta' },
    { id: 'TC-4402', type: 'Tomografia', status: 'Em Análise', timeMinutes: 25, urg: 'Média' },
    { id: 'US-8812', type: 'Ultrassom AB', status: 'Liberado', timeMinutes: 5, urg: 'Baixa' }
  ]);

  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Simula a passagem do tempo
    const interval = setInterval(() => {
      setExams(prev => prev.map(ex => {
        if (ex.status !== 'Liberado') {
          return { ...ex, timeMinutes: ex.timeMinutes + 1 };
        }
        return ex;
      }));
    }, 5000); // 1 minuto a cada 5 segundos para fins de demonstração rápida
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newAlerts = exams
      .filter(ex => ex.urg === 'Alta' && ex.status !== 'Liberado' && ex.timeMinutes > 60)
      .map(ex => `Alerta Crítico: TAT excedeu 60 minutos para exame de Emergência! (${ex.id} - ${ex.timeMinutes} min)`);
    setAlerts(newAlerts);
  }, [exams]);

  return (
    <div className="space-y-6 text-left animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
            <Activity className="w-6 h-6 text-teal-400" />
            Supervisão SADT
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Métricas de Serviço de Apoio Diagnóstico Terapêutico
          </p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3 mb-6">
          {alerts.map((alert, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 animate-pulse">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-bold">{alert}</p>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Exames Realizados<br className="sm:hidden" /> (Hoje)</h4>
          <div className="mt-2">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400">142</p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">+12% vs ontem</p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Laudos<br className="sm:hidden" /> Pendentes</h4>
          <div className="mt-2">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400">28</p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">Dentro do SLA</p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Tempo Médio<br className="sm:hidden" /> (TAT)</h4>
          <div className="mt-2">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400">45m</p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">Emergência</p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Equipamentos<br className="sm:hidden" /> Online</h4>
          <div className="mt-2">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400">100%</p>
            <p className="text-[9px] sm:text-[11px] text-teal-500/80 mt-1 leading-tight line-clamp-1">Operacional</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Exams List */}
        <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Fila de Liberação
          </h3>
          <div className="space-y-4">
            {exams.map(exam => (
              <div key={exam.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${exam.urg === 'Alta' && exam.timeMinutes > 60 ? 'bg-teal-500/10 border-teal-500/50' : 'bg-slate-900/50 border-slate-800'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${exam.urg === 'Alta' && exam.timeMinutes > 60 ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{exam.type}</p>
                    <p className="text-xs text-slate-500">{exam.id} • {exam.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    exam.urg === 'Alta' ? 'bg-teal-500/10 text-teal-400' :
                    exam.urg === 'Média' ? 'bg-teal-500/10 text-teal-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {exam.urg}
                  </span>
                  <p className={`text-xs mt-1 font-bold ${exam.timeMinutes > 60 && exam.urg === 'Alta' ? 'text-teal-400' : 'text-slate-500'}`}>{exam.timeMinutes} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border bg-gradient-to-br from-slate-900 via-slate-900 to-teal-900/10">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-xl transition-colors text-left group">
              <div>
                <p className="text-sm font-bold text-teal-400">Aprovar Lote de Exames (12)</p>
                <p className="text-xs text-teal-400/70 mt-1">Assinar digitalmente laudos pendentes</p>
              </div>
              <Activity className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-colors text-left">
              <div>
                <p className="text-sm font-bold text-slate-300">Relatório de Produtividade</p>
                <p className="text-xs text-slate-500 mt-1">Gerar PDF com métricas diárias</p>
              </div>
              <FileText className="w-5 h-5 text-slate-500" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-colors text-left">
              <div>
                <p className="text-sm font-bold text-slate-300">Chamado Técnico</p>
                <p className="text-xs text-slate-500 mt-1">Reportar falha em equipamento</p>
              </div>
              <Clock className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* SLA Exceeded Chart */}
      <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            Exames de Emergência com TAT &gt; 60 min
          </h3>
          <select 
            value={chartPeriod}
            onChange={(e) => setChartPeriod(e.target.value as ChartPeriod)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg focus:ring-indigo-500 focus:border-teal-500 block p-2"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="month">Mês atual</option>
          </select>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => Math.round(val).toString()} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#fb7185' }}
                labelStyle={{ color: '#f1f5f9', fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Bar dataKey="count" fill="#8b2121" radius={[4, 4, 0, 0]} name="Exames Excedidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Medical Team Productivity */}
      <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          Produtividade da Equipe Médica
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 px-1 sm:px-4 font-medium">Equipe Médica</th>
                <th className="pb-3 px-1 sm:px-4 font-medium text-center">Vol. (Laudos)</th>
                <th className="pb-3 px-1 sm:px-4 font-medium text-right">TAT Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {doctorProductivityData.map((doc) => (
                <tr key={doc.id} className="group hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 px-1 sm:px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                        {doc.name.split(' ')[1].charAt(0)}{doc.name.split(' ')[2]?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.specialty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-1 sm:px-4 text-center">
                    <p className="text-sm font-bold text-slate-300">{doc.volume}</p>
                  </td>
                  <td className="py-4 px-1 sm:px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`text-sm font-bold ${doc.avgTat > 60 ? 'text-teal-400' : doc.avgTat > 45 ? 'text-teal-400' : 'text-teal-400'}`}>
                        {doc.avgTat}m
                      </span>
                      {doc.trend === 'up' && <TrendingUp className="w-3 h-3 text-teal-400" />}
                      {doc.trend === 'down' && <TrendingDown className="w-3 h-3 text-teal-400" />}
                      {doc.trend === 'stable' && <Minus className="w-3 h-3 text-slate-500" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
