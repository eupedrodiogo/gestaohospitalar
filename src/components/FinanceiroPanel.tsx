import React, { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  X, 
  Calendar,
  Search,
  Eye,
  Plus,
  Filter,
  DollarSign as MoneyIcon,
  Briefcase,
  AlertCircle,
  BarChart4,
  Activity,
  FileText,
  Landmark,
  ShieldCheck
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface FinanceiroPanelProps {
  userRole: string;
  userName: string;
  currentTab?: "caixa" | "tesouraria" | "dre" | "glosas";
  onTabChange?: (tab: string) => void;
}

// Cash flow projection data (Recebidos vs Pagos)
const cashFlowData = [
  { month: 'Jan', Receitas: 4800000, Despesas: 3900000, Saldo: 900000 },
  { month: 'Fev', Receitas: 4950000, Despesas: 4100000, Saldo: 850000 },
  { month: 'Mar', Receitas: 5100000, Despesas: 4200000, Saldo: 900000 },
  { month: 'Abr', Receitas: 4980000, Despesas: 4050000, Saldo: 930000 },
  { month: 'Mai', Receitas: 5200000, Despesas: 4150000, Saldo: 1050000 },
  { month: 'Jun', Receitas: 5400000, Despesas: 4250000, Saldo: 1150000 },
];

const dreData = [
  { item: 'Receita Operacional Bruta', valor: 5400000, pct: 100 },
  { item: '(-) Deduções, Glosas e Impostos', valor: -320000, pct: -5.9 },
  { item: 'Receita Operacional Líquida', valor: 5080000, pct: 94.1 },
  { item: '(-) Custos Assistenciais (Insumos, OPME)', valor: -1850000, pct: -34.3 },
  { item: '(-) Custos com Pessoal e Equipe médica', valor: -2100000, pct: -38.9 },
  { item: '(=) Resultado Bruto HSF', valor: 1130000, pct: 20.9 },
  { item: '(-) Despesas Administrativas & Opex', valor: -250000, pct: -4.6 },
  { item: '(=) EBITDA Projetado', valor: 880000, pct: 16.3 },
  { item: '(-) Depreciação e Amortização', valor: -120000, pct: -2.2 },
  { item: '(=) Lucro Líquido do Exercício', valor: 760000, pct: 14.1 },
];

const dreMensalData = [
  { name: 'Receita Bruta', valor: 5400000 },
  { name: 'Deduções', valor: 320000 },
  { name: 'Custos Assist.', valor: 1850000 },
  { name: 'Pessoal', valor: 2100000 },
  { name: 'Desp. Adm', valor: 250000 },
  { name: 'Lucro', valor: 760000 }
];

const initialBills = [
  { id: 'P-1120', type: 'Pagar', description: 'Fornecedor de Órteses Cardiologia Ltda', category: 'Insumos Hospitalares', value: 125000, dueDate: '05/06/2026', status: 'Aguardando Autorização', recipient: 'Bco do Brasil - Ag. 2291' },
  { id: 'P-1121', type: 'Pagar', description: 'Manutenção Preventiva de Tomógrafo Philips', category: 'Contratos / Manutenção', value: 38400, dueDate: '10/06/2026', status: 'Agendado', recipient: 'Philips Medical S.A.' },
  { id: 'P-1122', type: 'Pagar', description: 'Gases Medicinais White Martins', category: 'Gases / Gases Medicinais', value: 74200, dueDate: '12/06/2026', status: 'Aprovado para Pagamento', recipient: 'White Martins Gases S.A.' },
  { id: 'P-1123', type: 'Pagar', description: 'Limpeza e Higienização - Grupo Lider', category: 'Serviços Terceirizados', value: 92000, dueDate: '15/06/2026', status: 'Pendente N.F.', recipient: 'Grupo Lider Serv.' },
  { id: 'R-2250', type: 'Receber', description: 'Faturamento Bradesco Saúde - Lote 55', category: 'Repasse Convenio', value: 1380000, dueDate: '15/06/2026', status: 'Confirmado Operadora', sender: 'Bradesco Saúde e Seguros' },
  { id: 'R-2251', type: 'Receber', description: 'Faturamento Unimed Lote Integrado 91', category: 'Repasse Convenio', value: 1650000, dueDate: '18/06/2026', status: 'Em Processamento', sender: 'Unimed Cooperativa Rio' },
  { id: 'R-2252', type: 'Receber', description: 'Particular - Cirurgia Bariátrica Auditada', category: 'Particular / SADT', value: 45000, dueDate: '03/06/2026', status: 'Pendente Conciliação', sender: 'F. de Assis Ferreira' },
  { id: 'R-2253', type: 'Receber', description: 'SUS - Produção PAI Teto Fixo Março', category: 'Repasse Público', value: 852000, dueDate: '20/06/2026', status: 'Em Processamento', sender: 'Ministério da Saúde' },
];

export default function FinanceiroPanel({ userRole, userName, currentTab, onTabChange }: FinanceiroPanelProps) {
  const [bills, setBills] = useState(initialBills);
  const [filterType, setFilterType] = useState<'Todos' | 'Pagar' | 'Receber'>('Todos');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState<typeof initialBills[0] | null>(null);
  
  const mappedTab = currentTab === "caixa" ? "visao_geral" : currentTab === "tesouraria" ? "tesouraria" : currentTab === "dre" ? "dre" : currentTab === "glosas" ? "glosas" : "visao_geral";
  const activeTab = mappedTab;

  const handlePayAction = (billId: string) => {
    setBills(prev => prev.map(bill => {
      if (bill.id === billId) {
        return { 
          ...bill, 
          status: bill.type === 'Pagar' ? 'Aprovado para Pagamento' : 'Pago / Conciliado'
        };
      }
      return bill;
    }));
    setSelectedBill(null);
  };

  const filteredBills = bills.filter(bill => {
    const matchesType = filterType === 'Todos' || bill.type === filterType;
    const matchesSearch = bill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left animate-fade-in pb-20 md:pb-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-teal-500" />
            Gestão Financeira Hospitalar
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Planejamento Orçamentário, Contas a Pagar, Contas a Receber, Fluxo de Caixa e DRE
          </p>
        </div>
      </div>

      {activeTab === "visao_geral" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
              <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Saldo de Caixa HSF</h4>
              <div className="mt-2 text-teal-400">
                <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 flex items-center gap-1.5">
                  R$ 5,24M
                </p>
                <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">
                  Disponibilidade imediata (Tesouraria)
                </p>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
              <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Contas a Receber (30d)</h4>
              <div className="mt-2 text-teal-400">
                <p className="text-xl sm:text-2xl font-display font-bold text-teal-400">
                  R$ 3,87M
                </p>
                <p className="text-[9px] sm:text-[11px] text-teal-400 mt-1 leading-tight line-clamp-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Repasses de Convênios & SUS
                </p>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
              <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Contas a Pagar (30d)</h4>
              <div className="mt-2 text-teal-450">
                <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 flex items-center gap-1.5">
                  R$ 1,32M
                </p>
                <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1 flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5" /> Fornecedores & Serviços
                </p>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-2xl p-4 sm:p-5 glow-border flex flex-col justify-between relative overflow-hidden group">
              <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Margem EBITDA Realizada</h4>
              <div className="mt-2 text-teal-500">
                <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 flex items-center gap-1.5">
                  16,3%
                  <span className="text-[10px] bg-teal-500/10 text-teal-450 border border-teal-500/20 px-1.5 py-0.5 rounded">SAUDÁVEL</span>
                </p>
                <p className="text-[9px] sm:text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">
                  Alinhado com planejamento HSF
                </p>
              </div>
            </div>
          </div>

          {/* Cash Flow Projection */}
          <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-500" />
                  Fluxo de Caixa Semestral Proporcional
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Histórico e projeção de solvência e geração liquida de caixa</p>
              </div>
              <div className="text-right text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-teal-400 font-bold">
                Superávit Médio: R$ 930k / mês
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 15, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2f6e46" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2f6e46" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b2121" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#8b2121" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} formatter={(val: any) => `R$${(val / 1000000).toFixed(1)}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
                    formatter={(value: any) => [`R$ ${value.toLocaleString()}`, 'Valor']}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="Receitas" stroke="#2f6e46" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReceitas)" name="Receitas / Repasses" />
                  <Area type="monotone" dataKey="Despesas" stroke="#8b2121" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDespesas)" name="Despesas / Custos" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tesouraria" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
           {/* Financial Accounts: Payable / Receivable Ledger */}
           <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-400" />
                  Controle de Títulos (A Pagar / A Receber)
                </h3>
                <p className="text-xs text-slate-500 mt-1">Autorização, liquidação e acompanhamento de vencimentos no HSF</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-xl text-xs font-bold hover:bg-teal-500/20 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Lançar Documento
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                {(['Todos', 'Pagar', 'Receber'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterType === t 
                        ? 'bg-slate-800 text-teal-400 border border-slate-700/50' 
                        : 'text-slate-400 hover:text-slate-200 bg-transparent'
                    }`}
                  >
                    {t === 'Todos' ? 'Todos' : t === 'Pagar' ? 'Contas a Pagar' : 'Contas a Receber'}
                  </button>
                ))}
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar por descrição, credor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 text-xs rounded-xl pl-8 pr-3 py-2 outline-none text-slate-200"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Table list */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {filteredBills.length === 0 && (
                <div className="text-center text-slate-500 text-xs py-8 border border-dashed border-slate-800 rounded-xl">
                  Nenhum título encontrado com os filtros selecionados.
                </div>
              )}
              {filteredBills.map((b) => (
                <div 
                  key={b.id} 
                  className="bg-slate-950/40 p-3 sm:p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      b.type === 'Pagar' 
                        ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
                        : 'bg-teal-500/10 border-teal-500/20 text-teal-450'
                    }`}>
                      {b.type === 'Pagar' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{b.description}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono">{b.id}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tight">{b.category}</span>
                        <span className="text-[10px] text-slate-600">•</span>
                        <span className="text-[10px] text-slate-400 font-medium">Vencimento: {b.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end">
                    <p className="text-sm font-mono font-bold text-slate-200">
                      R$ {b.value.toLocaleString('pt-BR')}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.5 ${
                        b.status.includes('Confirmado') || b.status.includes('Aprovado') ? "bg-teal-500/10 text-teal-400" :
                        b.status.includes('Pendente') ? "bg-orange-500/10 text-orange-400" : "bg-slate-800 text-slate-400"
                      }`}>
                        {b.status}
                      </span>
                      <button 
                        onClick={() => setSelectedBill(b)}
                        className="text-[10px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 transition-colors bg-teal-500/10 hover:bg-teal-500/20 px-2 py-1 rounded"
                      >
                         <Eye className="w-3 h-3" /> Gerenciar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {activeTab === "dre" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border flex flex-col justify-between">
            <div>
              <div className="mb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-teal-500" />
                    Demonstração do Resultado Projetada
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Mapeamento operacional e margens acumuladas (Mês corrente)</p>
                </div>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded">
                  Junho 2026
                </span>
              </div>

              <div className="divide-y divide-slate-800/80 text-xs">
                {dreData.map((d, index) => {
                  const isPositive = d.valor >= 0;
                  const isHeading = d.item.startsWith('(=)') || d.item.startsWith('Receita Operacional Bruta');
                  
                  return (
                    <div 
                      key={index} 
                      className={`py-3 flex items-center justify-between ${
                        isHeading ? "font-bold text-slate-100 bg-slate-900/30 px-3 rounded-lg my-1 border border-slate-800/50" : "text-slate-400 px-3"
                      }`}
                    >
                      <span>{d.item}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className={isPositive ? "text-slate-300" : "text-teal-400"}>
                          R$ {Math.abs(d.valor).toLocaleString('pt-BR')}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded w-12 text-right ${
                          d.pct >= 0 ? "bg-teal-500/10 text-teal-400" : "bg-teal-500/10 text-teal-450"
                        }`}>
                          {d.pct > 0 ? `+${d.pct}%` : `${d.pct}%`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-850 text-[11px] text-slate-500 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-teal-500" />
              <span>Dados projetados sob regras do comitê econômico financeiro do Hospital São Francisco.</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart4 className="w-4 h-4 text-teal-500" />
                Composição do Resultado
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dreMensalData} margin={{ top: 10, right: 10, left: 15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} interval={0} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} formatter={(val: any) => `R$ ${(val / 1000000).toFixed(1)}M`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      formatter={(value: any) => [`R$ ${value.toLocaleString()}`, 'Valor']}
                    />
                    <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                      {
                        dreMensalData.map((entry, index) => (
                          <cell key={`cell-${index}`} fill={entry.name === 'Custos Assist.' || entry.name === 'Pessoal' || entry.name === 'Desp. Adm' || entry.name === 'Deduções' ? '#0f766e' : '#14b8a6'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border text-center flex flex-col justify-center items-center h-48">
              <div className="p-4 bg-teal-500/10 rounded-full mb-3 text-teal-400 border border-teal-500/20">
                <MoneyIcon className="w-8 h-8" />
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                EBITDA ACUMULADO NO ANO
              </p>
              <h2 className="text-3xl font-bold font-display text-teal-400">R$ 4.75M</h2>
              <p className="text-[10px] text-teal-500 mt-2 font-medium bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                +12% vs. Ano Anterior
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "glosas" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full border border-orange-500/20 bg-orange-500/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-4 items-start">
               <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 mt-1 md:mt-0 shadow-lg shadow-orange-500/10">
                 <ShieldCheck className="w-8 h-8 text-orange-400" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-orange-400">Recurso de Glosas e Auditoria</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Análise e recuperação de glosas de convênios. Atualmente com <strong className="text-orange-300">R$ 320.000,00</strong> retidos aguardando recurso na esteira da qualidade.
                  </p>
               </div>
            </div>
            <button className="whitespace-nowrap px-6 py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl transition-all shadow-lg flex items-center gap-2">
              Painel de Glosas Avançado
            </button>
          </div>

          <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 leading-tight mb-4">Glosas por Motivo</h4>
            <div className="space-y-4">
               <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Ausência de Checagem Enfermagem</span>
                  <span className="text-white font-mono text-right">R$ 145.000</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">OPME - Divergência de N.F.</span>
                  <span className="text-white font-mono text-right">R$ 95.000</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Taxas e Diárias Extraordinárias</span>
                  <span className="text-white font-mono text-right">R$ 48.000</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Outros (Administrativo)</span>
                  <span className="text-white font-mono text-right">R$ 32.000</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border col-span-1 lg:col-span-2">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 leading-tight mb-4">Mural de Recuperação</h4>
            
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between mb-3 border-l-4 border-l-teal-500">
               <div>
                  <p className="text-xs font-bold text-slate-200">Bradesco Saúde (Lote 52) - OPME Recuperado</p>
                  <p className="text-[10px] text-slate-500 mt-1">Recurso Aceito • Entra no próximo repasse.</p>
               </div>
               <span className="text-teal-400 font-mono text-sm font-bold">+ R$ 28.500</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between mb-3 border-l-4 border-l-orange-500">
               <div>
                  <p className="text-xs font-bold text-slate-200">Unimed - Hemodinâmica Glosa Técnica</p>
                  <p className="text-[10px] text-slate-500 mt-1">Aguardando parecer do Médico Auditor HSF.</p>
               </div>
               <span className="text-orange-400 font-mono text-sm font-bold">R$ 15.300 em análise</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between border-l-4 border-l-slate-700">
               <div>
                  <p className="text-xs font-bold text-slate-200">SulAmérica - Diárias UTI</p>
                  <p className="text-[10px] text-slate-500 mt-1">Apresentação de Prontuário em andamento.</p>
               </div>
               <span className="text-slate-400 font-mono text-sm font-bold">R$ 8.900 documentar</span>
            </div>
          </div>
        </div>
      )}

      {/* Bill Manager Details Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800/80 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  selectedBill.type === 'Pagar' 
                    ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
                    : 'bg-teal-500/10 border-teal-500/20 text-teal-450'
                }`}>
                  {selectedBill.type === 'Pagar' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    {selectedBill.id} - Gestão de Título
                  </h3>
                  <p className="text-[11px] text-slate-500 uppercase tracking-tight font-semibold">
                    Contas a {selectedBill.type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBill(null)}
                className="p-1 rounded-full hover:bg-slate-850 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500">Descrição / Favorecido</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5">{selectedBill.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500">Valor do Título</span>
                  <p className="text-sm font-extrabold text-slate-100 mt-0.5 flex items-center gap-2">
                    R$ {selectedBill.value.toLocaleString('pt-BR')} 
                    <button className="text-[10px] text-teal-400 bg-teal-500/10 px-1 py-0.5 rounded cursor-pointer underline">Ver N.F.</button>
                  </p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500">Vencimento</span>
                  <p className="text-sm font-extrabold text-teal-400 mt-0.5">{selectedBill.dueDate}</p>
                </div>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500">Destinatário Bancário / Favorecido</span>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedBill.type === 'Pagar' ? selectedBill.recipient : selectedBill.sender}</p>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500">Status Financeiro</span>
                <p className="text-xs mt-0.5">
                  <span className={`inline-block px-2.5 py-1 border rounded font-bold text-[10px] uppercase ${
                    selectedBill.status.includes('Confirmado') || selectedBill.status.includes('Aprovado') ? "bg-teal-500/10 border-teal-500/20 text-teal-400" :
                    selectedBill.status.includes('Pendente') ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}>
                    {selectedBill.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex justify-end gap-2 text-right">
              <button
                onClick={() => setSelectedBill(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Voltar
              </button>
              
              {selectedBill.status !== 'Pago / Conciliado' && !selectedBill.status.includes('Aprovado') && (
                <button
                  onClick={() => handlePayAction(selectedBill.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2f6e46] hover:bg-teal-500 text-slate-950 transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedBill.type === 'Pagar' ? 'Liberar Pagamento' : 'Conciliar Título'}
                </button>
              )}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
