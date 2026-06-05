import React, { useState } from "react";
import { HeartHandshake, Smile, Frown, Users, Clock, AlertTriangle, TrendingUp, TrendingDown, Minus, Timer, X, User } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AtendimentoPanelProps {
  userRole: string;
  userName: string;
}

const npsData = [
  { label: 'Sem 1', nps: 72 },
  { label: 'Sem 2', nps: 75 },
  { label: 'Sem 3', nps: 68 },
  { label: 'Sem 4', nps: 78 },
];

const queueData = [
  { id: 1, sector: 'PS Adulto - Triagem', waiting: 12, maxWait: 22, sla: 15, longestPatient: { name: 'João Silva', age: 45, history: [{ date: '10/05/2026', sector: 'Ambulatório', nps: 9, comment: 'Ótimo atendimento' }] } },
  { id: 2, sector: 'PS Adulto - Consulta Médica', waiting: 28, maxWait: 65, sla: 30, longestPatient: { name: 'Maria Souza', age: 62, history: [{ date: '01/06/2026', sector: 'Recepção Central', nps: 4, comment: 'Muita demora' }, { date: '15/03/2026', sector: 'SADT', nps: 8, comment: 'Bons profissionais' }] } },
  { id: 3, sector: 'PS Infantil - Triagem', waiting: 5, maxWait: 10, sla: 15, longestPatient: { name: 'Lucas Lima', age: 8, history: [] } },
  { id: 4, sector: 'Ambulatório - Recepção', waiting: 18, maxWait: 14, sla: 20, longestPatient: { name: 'Ana Costa', age: 34, history: [{ date: '20/05/2026', sector: 'Ambulatório', nps: 10, comment: 'Excelente médico' }] } },
  { id: 5, sector: 'Internação - Admissão', waiting: 4, maxWait: 45, sla: 40, longestPatient: { name: 'Carlos Santos', age: 55, history: [{ date: '12/02/2026', sector: 'PS Adulto', nps: 7, comment: 'Razoável, mas infraestrutura antiga' }] } },
];

const triageHistoryData = [
  { time: "4h atrás", waitTime: 14 },
  { time: "3h atrás", waitTime: 18 },
  { time: "2h atrás", waitTime: 25 },
  { time: "1h atrás", waitTime: 22 },
];

export default function AtendimentoPanel({ userRole, userName }: AtendimentoPanelProps) {
  const [selectedPatient, setSelectedPatient] = useState<typeof queueData[0]['longestPatient'] | null>(null);

  return (
    <div className="space-y-6 text-left animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
            <HeartHandshake className="w-6 h-6 text-teal-400" />
            Experiência do Cliente
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Métricas de Atendimento, Ocupação dos 140 Leitos Ativos e Satisfação (NPS)
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">NPS<br className="sm:hidden" /> Geral</h4>
          <div className="mt-2 text-teal-400">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 flex items-center gap-2">78 <Smile className="w-4 h-4" /></p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">+3 pts vs mês ant.</p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Tempo de<br className="sm:hidden" /> Espera</h4>
          <div className="mt-2 text-teal-400">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 flex items-center gap-2">12m <Clock className="w-4 h-4" /></p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">Média Recepção</p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Ouvidoria<br className="sm:hidden" /> Abertas</h4>
          <div className="mt-2 text-teal-400">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 flex items-center gap-2">5 <AlertTriangle className="w-4 h-4" /></p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">Sem criticidade alta</p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Atendimentos<br className="sm:hidden" /> Dia</h4>
          <div className="mt-2 text-teal-400">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 flex items-center gap-2">342 <Users className="w-4 h-4" /></p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">Fluxo estável</p>
          </div>
        </div>
      </div>

      {/* Triage Wait Time Sparkline Chart */}
      <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              Tempo de Espera na Triagem (Últimas 4 Horas)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Variação do tempo médio de espera no Pronto Atendimento</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            Pico: 25m
          </div>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={triageHistoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="m" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#2dd4bf' }}
                labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
                formatter={(value: any) => [`${value} minutos`, 'Tempo de Espera']}
              />
              <Bar dataKey="waitTime" fill="#a1796c" radius={[4, 4, 0, 0]} name="Tempo de Espera" maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* NPS Chart */}
        <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Smile className="w-4 h-4 text-slate-400" />
            Evolução NPS (Mês)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={npsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fb7185' }}
                  labelStyle={{ color: '#f1f5f9', fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Bar dataKey="nps" fill="#6e4336" radius={[4, 4, 0, 0]} name="NPS Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avaliações Recentes */}
        <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border bg-gradient-to-br from-slate-900 via-slate-900 to-teal-900/10">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-slate-400" />
            Últimas Avaliações
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-teal-500/20 text-teal-400 px-2 py-1 rounded text-xs font-bold">Nota 10</div>
                  <span className="text-sm text-slate-300 font-medium">Recepção Central</span>
                </div>
                <span className="text-xs text-slate-500">Há 10 min</span>
              </div>
              <p className="text-sm text-slate-400">"Atendimento muito rápido e equipe super atenciosa, mesmo com a emergência cheia."</p>
            </div>
            
            <div className="p-4 bg-slate-900/50 rounded-xl border border-teal-900/30 border">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-teal-500/20 text-teal-400 px-2 py-1 rounded text-xs font-bold">Nota 4</div>
                  <span className="text-sm text-slate-300 font-medium">Pronto Socorro</span>
                </div>
                <span className="text-xs text-slate-500">Há 45 min</span>
              </div>
              <p className="text-sm text-slate-400">"Muito tempo aguardando triagem, faltou informação sobre a demora."</p>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-teal-500/20 text-teal-400 px-2 py-1 rounded text-xs font-bold">Nota 9</div>
                  <span className="text-sm text-slate-300 font-medium">Ambulatório</span>
                </div>
                <span className="text-xs text-slate-500">Há 2 horas</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Queue Monitoring */}
      <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Timer className="w-4 h-4 text-slate-400" />
            Tempo de Espera por Setor (Tempo Real)
          </h3>
          <span className="text-xs font-medium px-3 py-1 bg-slate-800 text-slate-300 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Atualizado agora
          </span>
        </div>
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 px-4 font-medium whitespace-nowrap">Setor / Ponto de Contato</th>
                <th className="pb-3 px-4 font-medium text-center whitespace-nowrap">Pacientes na Fila</th>
                <th className="pb-3 px-4 font-medium text-right whitespace-nowrap">Maior Espera</th>
                <th className="pb-3 px-4 font-medium whitespace-nowrap">Paciente Mais Antigo</th>
                <th className="pb-3 px-4 font-medium text-center whitespace-nowrap">Status SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {queueData.map((queue) => {
                const isCritical = queue.maxWait > queue.sla * 1.5;
                const isWarning = queue.maxWait > queue.sla && !isCritical;
                
                return (
                  <tr key={queue.id} className="group hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-slate-200">{queue.sector}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="text-sm font-bold text-slate-300">{queue.waiting}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className={`text-sm font-bold ${isCritical ? 'text-teal-400' : isWarning ? 'text-teal-400' : 'text-teal-400'}`}>
                        {queue.maxWait}m
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={() => setSelectedPatient(queue.longestPatient)}
                        className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        <User className="w-4 h-4" />
                        <span>{queue.longestPatient.name}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <span className={`text-[10px] whitespace-nowrap font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                          isCritical ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 
                          isWarning ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 
                          'bg-teal-500/10 border-teal-500/30 text-teal-400'
                        }`}>
                          {isCritical ? 'Crítico' : isWarning ? 'Atenção' : 'Dentro do SLA'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prontuário de Satisfação Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-start justify-between bg-gradient-to-r from-slate-900 to-slate-800/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
                    {selectedPatient.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {selectedPatient.age} anos • Prontuário de Satisfação
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                Histórico de Avaliações (NPS)
              </h4>
              
              {selectedPatient.history.length === 0 ? (
                <div className="text-center py-8 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                  <HeartHandshake className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Nenhum histórico de avaliação encontrado para este paciente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedPatient.history.map((record, index) => {
                    const isPromoter = record.nps >= 9;
                    const isPassive = record.nps >= 7 && record.nps <= 8;
                    const isDetractor = record.nps <= 6;
                    
                    return (
                      <div key={index} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 relative overflow-hidden group">
                        {/* Status Color Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPromoter ? 'bg-teal-500' : isPassive ? 'bg-teal-400' : 'bg-teal-500'}`} />
                        
                        <div className="pl-3">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                isPromoter ? 'bg-teal-500/20 text-teal-400' : 
                                isPassive ? 'bg-teal-500/20 text-teal-400' : 
                                'bg-teal-500/20 text-teal-400'
                              }`}>
                                Nota {record.nps}
                              </span>
                              <span className="text-sm text-slate-300 font-medium">{record.sector}</span>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">{record.date}</span>
                          </div>
                          {record.comment ? (
                            <p className="text-sm text-slate-400 italic">"{record.comment}"</p>
                          ) : (
                            <p className="text-sm text-slate-600 italic">Sem comentário adicional.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/90 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Fechar
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
