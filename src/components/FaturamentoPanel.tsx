import React, { useState } from "react";
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  AlertCircle, 
  Percent, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  ChevronRight,
  Calendar,
  RefreshCw,
  Search,
  Activity,
  Award
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface FaturamentoPanelProps {
  userRole: string;
  userName: string;
}

const denialTrendData = [
  { month: 'Jan', taxa: 3.4 },
  { month: 'Fev', taxa: 3.1 },
  { month: 'Mar', taxa: 2.8 },
  { month: 'Abr', taxa: 2.5 },
  { month: 'Mai', taxa: 2.3 },
  { month: 'Jun', taxa: 2.1 },
];

const insuranceBillingData = [
  { insurance: 'Bradesco Saúde', Faturamento: 1420000, Glosado: 89000 },
  { insurance: 'Amil S380', Faturamento: 1120000, Glosado: 54000 },
  { insurance: 'Unimed Rio', Faturamento: 1680000, Glosado: 21000 },
  { insurance: 'SulAmérica', Faturamento: 980000, Glosado: 45000 },
  { insurance: 'Cassi / Golden', Faturamento: 780000, Glosado: 32000 },
];

const initialAuditedAccounts = [
  { 
    id: 'F-9902', 
    patient: 'Manoel de Oliveira', 
    age: 72,
    insurance: 'Bradesco Saúde', 
    totalValue: 42500, 
    deniedValue: 8900, 
    status: 'Glosa Identificada', 
    item: 'Diárias de UTI excedentes sem justificativa médica em prontuário.',
    date: '28/05/2026',
    history: [
      { step: 'Auditoria Interna', status: 'Aprovado', val: '26/05/2026' },
      { step: 'Faturamento de Conta', status: 'Concluído', val: '27/05/2026' },
      { step: 'Análise da Conta', status: 'Glosa Aplicada pela Operadora', val: '28/05/2026' }
    ]
  },
  { 
    id: 'F-9903', 
    patient: 'Rita de Cássia', 
    age: 54,
    insurance: 'Amil S380', 
    totalValue: 18200, 
    deniedValue: 2400, 
    status: 'Em Recurso', 
    item: 'Uso de material termossensível (sutura cirúrgica) reprocessável.',
    date: '22/05/2026',
    history: [
      { step: 'Análise da Conta', status: 'Glosa Aplicada', val: '22/05/2026' },
      { step: 'Recurso de Glosa', status: 'Protocolado junto à operadora', val: '24/05/2026' }
    ]
  },
  { 
    id: 'F-9904', 
    patient: 'Antônio Ferreira', 
    age: 63,
    insurance: 'Unimed Rio', 
    totalValue: 145000, 
    deniedValue: 0, 
    status: 'Liberado', 
    item: 'Nenhum item glosado. Conta paga integralmente.',
    date: '18/05/2026',
    history: [
      { step: 'Faturamento', status: 'Enviado', val: '15/05/2026' },
      { step: 'Auditoria da Operadora', status: 'Liberado Sem Glosas', val: '18/05/2026' }
    ]
  },
  { 
    id: 'F-9905', 
    patient: 'Gisela Ramos', 
    age: 41,
    insurance: 'SulAmérica Especial', 
    totalValue: 67800, 
    deniedValue: 14500, 
    status: 'Aguardando Recurso', 
    item: 'Antibiótico de alto custo em dosagem prescrita sem parecer do CCIH.',
    date: '25/05/2026',
    history: [
      { step: 'Faturamento', status: 'Enviado', val: '22/05/2026' },
      { step: 'Análise Convenio', status: 'Glosa de Medicamento', val: '25/05/2026' }
    ]
  }
];

export default function FaturamentoPanel({ userRole, userName }: FaturamentoPanelProps) {
  const [selectedAccount, setSelectedAccount] = useState<typeof initialAuditedAccounts[0] | null>(null);
  const [accounts, setAccounts] = useState(initialAuditedAccounts);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRecorrerGlosa = (accountId: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return { 
          ...acc, 
          status: 'Em Recurso',
          history: [
            ...acc.history,
            { step: 'Recurso de Glosa', status: `Protocolado manualmente por ${userName} via painel HSF`, val: new Date().toLocaleDateString('pt-BR') }
          ]
        };
      }
      return acc;
    }));
    // Also update selectedAccount modal
    setSelectedAccount(prev => {
      if (prev && prev.id === accountId) {
        return {
          ...prev,
          status: 'Em Recurso',
          history: [
            ...prev.history,
            { step: 'Recurso de Glosa', status: `Protocolado manualmente por ${userName} via painel HSF`, val: new Date().toLocaleDateString('pt-BR') }
          ]
        };
      }
      return prev;
    });
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    acc.insurance.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-fade-in pb-20 md:pb-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
            <Coins className="w-6 h-6 text-teal-500" />
            Faturamento e Auditoria de Glosas
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Gestão do Faturamento do Hospital, Conciliação com Operadoras e Controle de Perdas (Glosas Médicas e Administrativas)
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Volume Faturado do Mês</h4>
          <div className="mt-2 text-teal-400">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 flex items-center gap-1.5">
              R$ 4,98M
            </p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">
              +4.8% vs faturamento de decolagem
            </p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Contas sob Auditoria</h4>
          <div className="mt-2 text-slate-300">
            <p className="text-xl sm:text-2xl font-display font-bold text-slate-200">
              R$ 384k
            </p>
            <p className="text-[9px] sm:text-[11px] text-teal-400/80 mt-1 leading-tight line-clamp-1 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Enviadas para as Operadoras
            </p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Taxa de Glosas Consolidada</h4>
          <div className="mt-2 text-teal-450">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-450 flex items-center gap-1.5">
              2,1%
              <span className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-1.5 py-0.5 rounded">META OK</span>
            </p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">
              Meta HSF: abaixo de 3.0%
            </p>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
          <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Recuperação de Glosas</h4>
          <div className="mt-2 text-teal-400">
            <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 flex items-center gap-1.5">
              R$ 158.400
            </p>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">
              Recuperado de recursos procedentes
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Claim Denials Trend */}
        <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Percent className="w-4 h-4 text-teal-500" />
              Índice de Glosas Primárias por Mês
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Glosa inicial imposta pelas operadoras de convênio no HSF</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={denialTrendData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 4]} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
                  formatter={(value: any) => [`${value}%`, 'Taxa de Glosa']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="taxa" 
                  stroke="#a1796c" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#2dd4bf', stroke: '#1e293b', strokeWidth: 2 }}
                  name="Glosa Primária (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Faturamento vs Glosas por Operadora */}
        <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-400" />
              Faturamento Faturado vs Glosas Emitidas por Convênio
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Indicadores de faturamento sob a ótica de recuperação e auditoria</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insuranceBillingData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="insurance" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} formatter={(val: any) => `R$${(val / 1000)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
                  formatter={(value: any) => [`R$ ${value.toLocaleString()}`, 'Valor']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Faturamento" fill="#2f6e46" radius={[4, 4, 0, 0]} name="Faturamento Realizado (R$)" />
                <Bar dataKey="Glosado" fill="#8b2121" radius={[4, 4, 0, 0]} name="Montante Glosado (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Audited Accounts & Denials Table */}
      <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-450" />
              Controle de Recursos de Glosas & Auditoria Técnica
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Visão analítica de faturamento por paciente e operadora de plano de saúde</p>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Buscar por paciente, convênio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none text-slate-200"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 px-4 font-medium">Cód. Conta</th>
                <th className="pb-3 px-4 font-medium">Paciente / Convênio</th>
                <th className="pb-3 px-4 font-medium text-right">Valor Hospitalar</th>
                <th className="pb-3 px-4 font-medium text-right">Glosa Identificada</th>
                <th className="pb-3 px-4 font-medium text-center">Status Interno</th>
                <th className="pb-3 px-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAccounts.map((acc) => {
                const isCritical = acc.deniedValue > 5000;
                const isSuccess = acc.deniedValue === 0;
                
                return (
                  <tr key={acc.id} className="group hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-slate-400">
                      {acc.id}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-slate-200">{acc.patient}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{acc.insurance} • {acc.age} anos</p>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-300">
                      R$ {acc.totalValue.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold">
                      {isSuccess ? (
                        <span className="text-teal-400">R$ 0</span>
                      ) : (
                        <span className={isCritical ? "text-teal-450" : "text-teal-400"}>
                          R$ {acc.deniedValue.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                          acc.status === 'Liberado' ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 
                          acc.status === 'Em Recurso' ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 
                          isCritical ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 
                          'bg-teal-500/10 border-teal-500/30 text-teal-500'
                        }`}>
                          {acc.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => setSelectedAccount(acc)}
                        className="p-1.5 rounded-lg bg-slate-880 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                        title="Ver Detalhes e Recorrer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Details & Audit Progress Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-start justify-between bg-gradient-to-r from-slate-900 to-slate-800/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
                    {selectedAccount.patient}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Conta {selectedAccount.id} • {selectedAccount.insurance}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              {/* Cost Highlight */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Valor Cobrado</span>
                  <p className="text-xl font-display font-extrabold text-slate-200 mt-1">R$ {selectedAccount.totalValue.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Glosa Identificada</span>
                  <p className="text-xl font-display font-extrabold text-teal-450 mt-1">R$ {selectedAccount.deniedValue.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              {/* Technical Justification */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-teal-500" />
                  Motivo Técnico da Glosa (Faturamento)
                </h4>
                <div className="bg-slate-950/20 p-4 rounded-2xl border border-slate-800 text-sm text-slate-400 italic">
                  "{selectedAccount.item}"
                </div>
              </div>

              {/* Progress History */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  Histórico de Faturamento e Auditoria
                </h4>
                
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {selectedAccount.history.map((hist, index) => (
                    <div key={index} className="flex gap-4 items-start relative pl-1">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shrink-0 z-10">
                        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                      </div>
                      <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 flex-1 flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-slate-300">{hist.step}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{hist.status}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-600">{hist.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/90 flex justify-between gap-3">
              {selectedAccount.deniedValue > 0 && selectedAccount.status !== 'Em Recurso' ? (
                <button
                  onClick={() => handleRecorrerGlosa(selectedAccount.id)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-teal-500 hover:bg-teal-450 text-slate-950 transition-colors shadow-lg flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  Contestar & Recorrer Glosa
                </button>
              ) : (
                <div className="text-xs text-teal-400 flex items-center gap-1.5 font-semibold px-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Tudo regularizado ou em status de recurso.
                </div>
              )}
              
              <button
                onClick={() => setSelectedAccount(null)}
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
