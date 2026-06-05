import React, { useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Handshake, 
  Activity, 
  PhoneCall,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface ComercialPanelProps {
  userRole: string;
  userName: string;
}

const pipelineData = [
  { stage: 'Prospect', Contatos: 145 },
  { stage: 'Qualificação', Contatos: 82 },
  { stage: 'Proposta', Contatos: 45 },
  { stage: 'Negociação', Contatos: 24 },
  { stage: 'Fechamento', Contatos: 12 },
];

const performanceData = [
  { month: 'Jan', Vendas: 120, Meta: 100 },
  { month: 'Fev', Vendas: 98, Meta: 110 },
  { month: 'Mar', Vendas: 145, Meta: 120 },
  { month: 'Abr', Vendas: 130, Meta: 130 },
  { month: 'Mai', Vendas: 160, Meta: 140 },
  { month: 'Jun', Vendas: 190, Meta: 150 },
];

export default function ComercialPanel({ userRole, userName }: ComercialPanelProps) {
  const [activeTab, setActiveTab] = useState<'kpi' | 'pipeline' | 'crm'>('kpi');
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-teal-400" />
            Comercial e Vendas
          </h1>
          <p className="text-sm text-slate-400 mt-1">Bem-vindo(a), {userName}. Gestão de funil, metas e prospecção.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atingimento de Meta</h3>
          </div>
          <div className="text-2xl font-semibold text-slate-100 mb-1">112%</div>
          <p className="text-xs text-teal-400 font-medium">+12% vs. último mês</p>
        </div>

        <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
          <div className="flex items-center gap-2 mb-2">
            <Handshake className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Novos Contratos</h3>
          </div>
          <div className="text-2xl font-semibold text-slate-100 mb-1">28</div>
          <p className="text-xs text-teal-400 font-medium">+4 vs. último mês</p>
        </div>
        
        <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
          <div className="flex items-center gap-2 mb-2">
            <PhoneCall className="w-4 h-4 text-teal-500" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ligações Ativas</h3>
          </div>
          <div className="text-2xl font-semibold text-slate-100 mb-1">1,405</div>
          <p className="text-xs text-slate-500 font-medium">Equipe de Inside Sales</p>
        </div>

        <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taxa de Conversão</h3>
          </div>
          <div className="text-2xl font-semibold text-slate-100 mb-1">8.2%</div>
          <p className="text-xs text-teal-400 font-medium">+0.5% vs. último mês</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Evolução de Vendas vs Meta</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Vendas" stroke="#6e4336" strokeWidth={3} dot={{ r: 4, fill: "#6e4336", strokeWidth: 2, stroke: "#0f172a" }} />
                <Line type="monotone" dataKey="Meta" stroke="#888888" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              Gestão de Contas (CRM - Resumo)
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { client: "Unimed Seguros", status: "Em Negociação", value: "R$ 450k/ano", prob: "80%", priority: "Alta" },
              { client: "Bradesco Saúde", status: "Proposta Enviada", value: "R$ 1.2M/ano", prob: "45%", priority: "Alta" },
              { client: "Amil Assistência", status: "Fechamento", value: "R$ 800k/ano", prob: "95%", priority: "Média" },
              { client: "SulAmérica", status: "Qualificação", value: "R$ 550k/ano", prob: "20%", priority: "Média" },
              { client: "Porto Seguro", status: "Renovação", value: "R$ 380k/ano", prob: "99%", priority: "Baixa" }
            ].map((deal, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:bg-slate-800/50 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200 text-sm mb-0.5">{deal.client}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      deal.status === 'Em Negociação' ? 'bg-teal-500/10 text-teal-400' :
                      deal.status === 'Proposta Enviada' ? 'bg-teal-500/10 text-teal-400' :
                      deal.status === 'Fechamento' ? 'bg-teal-500/10 text-teal-400' :
                      deal.status === 'Renovação' ? 'bg-teal-500/10 text-teal-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {deal.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Prioridade {deal.priority}</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 text-left sm:text-right">
                  <div className="font-mono text-sm text-slate-300 font-medium">{deal.value}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Probab. {deal.prob}</div>
                </div>
              </div>
            ))}
            <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:text-teal-400 hover:border-teal-500/30 hover:bg-teal-500/5 transition-all text-xs font-bold uppercase tracking-wider mt-2">
              Ver CRM Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
