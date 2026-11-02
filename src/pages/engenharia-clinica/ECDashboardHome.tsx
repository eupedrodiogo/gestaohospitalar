import React, { useState, useMemo } from 'react';
import {
  Activity, Clock, Wrench, Filter, XCircle, BrainCircuit,
  AlertOctagon, AlertTriangle, ShieldCheck, MoreHorizontal, Upload, Plus,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkOrderPriority, WorkOrderType, WorkOrder, RawExcelData } from '../../types';

interface Props {
  onAnalyze: () => void;
  onNewOrder: () => void;
  onImportExcel: () => void;
  searchQuery: string;
  orders: WorkOrder[];
  rawExcelData: RawExcelData | null;
  isRawView: boolean;
  setIsRawView: (v: boolean) => void;
  isImporting: boolean;
}

const MOCK_CHART_DATA = [
  { date: 'Seg', preventive: 4, corrective: 2 },
  { date: 'Ter', preventive: 3, corrective: 1 },
  { date: 'Qua', preventive: 5, corrective: 3 },
  { date: 'Qui', preventive: 2, corrective: 4 },
  { date: 'Sex', preventive: 6, corrective: 1 },
  { date: 'Sáb', preventive: 4, corrective: 2 },
  { date: 'Dom', preventive: 3, corrective: 0 },
];

const priorityConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  [WorkOrderPriority.CRITICAL]: { label: 'Crítica', color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: AlertOctagon },
  [WorkOrderPriority.HIGH]: { label: 'Alta', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30', icon: AlertTriangle },
  [WorkOrderPriority.MEDIUM]: { label: 'Média', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: Activity },
  [WorkOrderPriority.LOW]: { label: 'Baixa', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', icon: ShieldCheck },
};

const statusColor: Record<string, string> = {
  'Aberto': 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  'Em Andamento': 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  'Concluído': 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  'Aguardando Peça': 'bg-orange-400/10 text-orange-400 border-orange-400/30',
};

export const ECDashboardHome: React.FC<Props> = ({
  onAnalyze, onNewOrder, onImportExcel, searchQuery, orders, rawExcelData, isRawView, setIsRawView, isImporting,
}) => {
  const [filterType, setFilterType] = useState('Todos');
  const [filterPriority, setFilterPriority] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const filteredOrders = useMemo(() => orders.filter((o) => {
    const matchType = filterType === 'Todos' || o.type === filterType;
    const matchPriority = filterPriority === 'Todos' || o.priority === filterPriority;
    const matchStatus = filterStatus === 'Todos' || o.status === filterStatus;
    const sl = searchQuery.toLowerCase();
    const matchSearch = !searchQuery
      || o.equipmentName.toLowerCase().includes(sl)
      || o.id.toLowerCase().includes(sl)
      || (o.description?.toLowerCase().includes(sl))
      || (o.technician?.toLowerCase().includes(sl));
    return matchType && matchPriority && matchStatus && matchSearch;
  }), [orders, filterType, filterPriority, filterStatus, searchQuery]);

  const openCount = orders.filter((o) => o.status !== 'Concluído').length;
  const criticalCount = orders.filter((o) => o.priority === WorkOrderPriority.CRITICAL && o.status !== 'Concluído').length;
  const uniqueAssets = new Set(orders.map((o) => o.equipmentId)).size;
  const preventive = orders.filter((o) => o.type === WorkOrderType.PREVENTIVE);
  const compliance = preventive.length > 0
    ? Math.round((preventive.filter((o) => o.status === 'Concluído').length / preventive.length) * 100)
    : 0;

  const hasFilters = filterType !== 'Todos' || filterPriority !== 'Todos' || filterStatus !== 'Todos';

  const kpis = [
    { label: 'OS Abertas', value: openCount, sub: 'ordens ativas', icon: ClipboardListIcon, color: 'from-blue-500 to-blue-600' },
    { label: 'Críticas', value: criticalCount, sub: 'requerem ação imediata', icon: AlertOctagon, color: 'from-red-500 to-red-600' },
    { label: 'Ativos', value: uniqueAssets, sub: 'equipamentos cadastrados', icon: Wrench, color: 'from-teal-500 to-cyan-600' },
    { label: 'Preventiva', value: `${compliance}%`, sub: 'compliance', icon: ShieldCheck, color: 'from-emerald-500 to-green-600' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-center">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${k.color} shadow-lg flex-shrink-0`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{k.value}</p>
                <p className="text-xs text-slate-400">{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action bar + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onNewOrder}
            className="flex items-center gap-2 justify-center px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-xl shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" /> Nova OS
          </button>
          <button
            onClick={onImportExcel}
            disabled={isImporting}
            className="flex items-center gap-2 justify-center px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium rounded-xl transition-all"
          >
            <Upload className="h-4 w-4" />
            {isImporting ? 'Importando...' : 'Importar Excel'}
          </button>
          <button
            onClick={onAnalyze}
            className="flex items-center gap-2 justify-center px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-medium rounded-xl transition-all"
          >
            <BrainCircuit className="h-4 w-4" /> Análise IA
          </button>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-sm font-semibold text-slate-300 mb-3">Ordens de Serviço — 7 dias</p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="gPrev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCorr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
              <Area type="monotone" dataKey="preventive" name="Preventiva" stroke="#14b8a6" fill="url(#gPrev)" strokeWidth={2} />
              <Area type="monotone" dataKey="corrective" name="Corretiva" stroke="#f97316" fill="url(#gCorr)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Filter className="h-4 w-4 text-slate-400" />
        <select
          value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm outline-none focus:border-teal-500"
        >
          <option value="Todos">Todos os Tipos</option>
          {Object.values(WorkOrderType).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm outline-none focus:border-teal-500"
        >
          <option value="Todos">Todas as Prioridades</option>
          {Object.values(WorkOrderPriority).map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm outline-none focus:border-teal-500"
        >
          <option value="Todos">Todos os Status</option>
          {['Aberto', 'Em Andamento', 'Concluído', 'Aguardando Peça'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setFilterType('Todos'); setFilterPriority('Todos'); setFilterStatus('Todos'); }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            <XCircle className="h-4 w-4" /> Limpar
          </button>
        )}
        <span className="ml-auto text-xs text-slate-500">{filteredOrders.length} resultado(s)</span>
      </div>

      {/* Table / Raw View toggle */}
      {rawExcelData && (
        <div className="flex gap-2">
          <button onClick={() => setIsRawView(false)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!isRawView ? 'bg-teal-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            Visualização Normal
          </button>
          <button onClick={() => setIsRawView(true)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isRawView ? 'bg-teal-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            Dados Brutos Excel
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-white">Ordens de Serviço</h3>
          <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">{filteredOrders.length}</span>
        </div>
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Wrench className="h-12 w-12 mb-3 opacity-20" />
              <p className="font-medium">Nenhuma OS encontrada</p>
              <p className="text-sm mt-1">Tente ajustar os filtros ou criar uma nova OS.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['ID', 'Equipamento', 'Tipo', 'Prioridade', 'Status', 'Técnico', 'Data', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const pCfg = priorityConfig[order.priority] || priorityConfig[WorkOrderPriority.MEDIUM];
                  const PIcon = pCfg.icon;
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">{order.id.slice(0, 10)}...</td>
                      <td className="px-4 py-3 text-white font-medium whitespace-nowrap max-w-[180px] truncate">{order.equipmentName}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{order.type}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${pCfg.color}`}>
                          <PIcon className="h-3 w-3" />
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor[order.status] || 'bg-slate-400/10 text-slate-400 border-slate-400/30'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{order.technician || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper icon
const ClipboardListIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

export default ECDashboardHome;
