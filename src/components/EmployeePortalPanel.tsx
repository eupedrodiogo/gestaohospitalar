import React, { useState } from "react";
import { 
  FileText, Calendar, ShieldPlus, Download, CreditCard, 
  HeartPulse, Clock, Landmark, Users, TrendingUp, AlertTriangle, 
  FileCheck, DollarSign, Receipt, ArrowRightLeft 
} from "lucide-react";

interface EmployeePortalPanelProps {
  userName: string;
  userRole: "colaborador" | "lider" | "rh" | "medico" | string;
}

export default function EmployeePortalPanel({ userName, userRole }: EmployeePortalPanelProps) {
  const isHrOrLeader = userRole === "rh" || userRole === "lider";
  const [activeSubTab, setActiveSubTab] = useState<"repasses_pj" | "holerite_clt" | "beneficios">(
    userRole === "colaborador" ? "holerite_clt" : "repasses_pj"
  );

  if (isHrOrLeader) {
    return <ManagerFinanceView />;
  }

  const isMedico = userRole === "medico";
  const isColaborador = userRole === "colaborador";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
            {isMedico ? "Repasses & Notas Fiscais" : "Financeiro & Holerite"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isMedico 
              ? "Seu espaço para consultar repasses médicos e emitir NF-e."
              : "Seu espaço para consultar holerites e informações de benefícios trabalhistas."}
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {isMedico && (
          <button
            onClick={() => setActiveSubTab("repasses_pj")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === "repasses_pj"
                ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Receipt className="w-4 h-4" />
            Repasses (PJ)
          </button>
        )}
        
        {isColaborador && (
          <>
            <button
              onClick={() => setActiveSubTab("holerite_clt")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                activeSubTab === "holerite_clt"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              Holerite (CLT)
            </button>
            <button
              onClick={() => setActiveSubTab("beneficios")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                activeSubTab === "beneficios"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              Meus Benefícios
            </button>
          </>
        )}
      </div>

      {activeSubTab === "repasses_pj" && isMedico && <RepassesPJView />}
      {activeSubTab === "holerite_clt" && isColaborador && <FinanceiroView />}
      {activeSubTab === "beneficios" && isColaborador && <BeneficiosView />}

    </div>
  );
}

function RepassesPJView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="border border-slate-800 rounded-3xl p-6 bg-slate-900/50">
          <h3 className="font-display font-semibold text-sm text-slate-200 uppercase tracking-wider mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-400" />
              Previsão de Repasse (Ciclo Aberto)
            </span>
            <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-1 rounded">Vencimento: 15/06</span>
          </h3>
          
          <div className="flex items-baseline gap-2 mb-6 text-slate-100">
            <span className="text-3xl font-display font-bold">R$ 18.450,00</span>
            <span className="text-sm text-slate-500 font-bold">BRUTO</span>
          </div>

          <div className="space-y-3">
            {[
              { type: "Plantão Diurno PS (6x)", desc: "12h (07:00 as 19:00)", amount: "R$ 7.200,00" },
              { type: "Plantão Noturno UTI (4x)", desc: "Adicional Noturno Incluso", amount: "R$ 6.800,00" },
              { type: "Produção Cirúrgica (3x)", desc: "Procedimentos de Baixa Complexidade", amount: "R$ 4.450,00" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-800/50 bg-slate-900/30 gap-4 hover:border-teal-500/30 transition-colors">
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-slate-200">{item.type}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                </div>
                <span className="text-slate-300 font-bold font-mono text-sm">{item.amount}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button className="flex-1 bg-teal-500 text-slate-900 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-teal-400 transition-colors shadow-[0_0_15px_rgba(45,212,191,0.2)]">
              Anexar Nota Fiscal (NF-e)
            </button>
            <button className="flex-1 border border-slate-700 text-slate-300 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-colors">
              Detalhar Extrato
            </button>
          </div>
        </div>

        <div className="border border-slate-800 rounded-3xl p-6 bg-slate-900/30">
          <h3 className="font-display font-semibold text-sm text-slate-200 uppercase tracking-wider mb-4 flex items-center justify-between">
             Repasses Anteriores
          </h3>
          <div className="space-y-3 text-sm">
             {[
               { period: "Maio/2026", nf: "Enviada", val: "R$ 21.300,00", paid: true },
               { period: "Abril/2026", nf: "Enviada", val: "R$ 19.500,00", paid: true }
             ].map((r, i) => (
               <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-slate-800/50 bg-slate-900/50">
                 <div>
                   <p className="font-bold text-slate-300 block">{r.period}</p>
                   <p className="text-[10px] text-teal-400">NF-e Validada</p>
                 </div>
                 <div className="flex items-center gap-4">
                   <p className="font-mono text-slate-300 font-bold">{r.val}</p>
                   <button className="text-slate-400 hover:text-teal-400"><Download className="w-4 h-4"/></button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="border border-slate-800 rounded-3xl p-6 bg-slate-900/50">
           <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-teal-400" />
            Declarações Fiscais
          </h3>
          <p className="text-xs text-slate-400 mb-4 line-clamp-2">
             DIRF / Informe de Rendimentos para prestadores PJ e RPA (Ano 2025) já está disponível.
          </p>
          <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Baixar DIRF 2026
          </button>
        </div>

        <div className="border border-slate-800 rounded-3xl p-6 bg-gradient-to-br from-slate-900 to-indigo-900/10">
           <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
            Conta Corrente B2B
          </h3>
          <p className="text-xs text-slate-400 mb-4">
             Conta cadastrada paraTED/PIX dos repasses:
          </p>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
             <p className="text-xs font-bold text-slate-300">Banco Itaú (341)</p>
             <p className="text-[10px] text-slate-500 font-mono mt-1">Ag: 1234 • CC: 56789-0</p>
             <p className="text-[10px] text-slate-500 font-mono mt-0.5">CNPJ: 12.345.678/0001-99</p>
          </div>
          <button className="mt-4 text-[10px] uppercase font-bold text-indigo-400 hover:text-indigo-300">
            Solicitar Alteração
          </button>
        </div>
      </div>
    </div>
  );
}

function FinanceiroView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="border border-slate-800 rounded-3xl p-6 bg-slate-900/50">
          <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            Últimos Holerites (CLT)
          </h3>
          <div className="space-y-3">
            {[
              { month: "Maio 2026", amount: "R$ 4.250,00", type: "Salário Mensal" },
              { month: "Abril 2026", amount: "R$ 4.100,00", type: "Salário Mensal" },
              { month: "Março 2026", amount: "R$ 4.100,00", type: "Salário Mensal" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-800/50 bg-slate-900/30 gap-4">
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-slate-200">{item.month}</h4>
                  <p className="text-xs text-slate-500">{item.type} • Pagamento em {item.month.split(' ')[0] === 'Maio' ? '05/06' : item.month.split(' ')[0] === 'Abril' ? '05/05' : '05/04'}/2026</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-teal-400 font-bold font-mono text-sm">{item.amount}</span>
                  <button className="p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 transition-colors tooltip-trigger relative group">
                    <Download className="w-4 h-4" />
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-200 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Baixar PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 rounded-xl border border-slate-700 border-dashed text-slate-400 hover:text-teal-400 hover:border-teal-500/50 transition-colors text-xs font-bold uppercase tracking-wider">
            Ver Histórico Completo
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="border border-slate-800 rounded-3xl p-6 bg-slate-900/50">
           <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-teal-400" />
            Informe de Rendimentos
          </h3>
          <p className="text-xs text-slate-400 mb-4 line-clamp-2">
             O Informe de Rendimentos do ano-calendário 2025 já está disponível para sua Declaração de Imposto de Renda.
          </p>
          <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Baixar IRPF (Ano 2025)
          </button>
        </div>
      </div>
    </div>
  );
}

function BeneficiosView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border border-slate-800 rounded-3xl p-6 bg-slate-900/50 flex flex-col">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 border border-teal-500/20">
          <HeartPulse className="w-6 h-6" />
        </div>
        <h3 className="font-display font-semibold text-sm text-slate-200 mb-1">Plano de Saúde</h3>
        <p className="text-[11px] text-slate-500 mb-4 flex-1">SulAmérica Especial • Carteirinha: 1234.5678.9</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
           <span className="text-xs text-teal-400 font-bold bg-teal-500/10 px-2 py-1 rounded">Ativo</span>
           <button className="text-[10px] text-teal-400 font-bold uppercase tracking-wider hover:underline">Ver Tabela</button>
        </div>
      </div>

      <div className="border border-slate-800 rounded-3xl p-6 bg-slate-900/50 flex flex-col">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 border border-teal-500/20">
          <CreditCard className="w-6 h-6" />
        </div>
        <h3 className="font-display font-semibold text-sm text-slate-200 mb-1">Vale Alimentação / Refeição</h3>
        <p className="text-[11px] text-slate-500 mb-4 flex-1">Caju Benefícios • Próxima recarga: 01/06/2026</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
           <span className="text-xs font-mono font-bold text-slate-300">R$ 850,00</span>
           <button className="text-[10px] text-teal-400 font-bold uppercase tracking-wider hover:underline">App Caju</button>
        </div>
      </div>
    </div>
  );
}

function ManagerFinanceView() {
  const [activeTab, setActiveTab] = useState<"repasses_pj" | "folha_clt" | "dashboard">("dashboard");

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
            Gestão Financeira e Faturamento
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Consolidação de repasses médicos (PJ) e folha de pagamento (CLT/RPA).
          </p>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {(["dashboard", "repasses_pj", "folha_clt"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab 
                  ? "bg-teal-500/10 text-teal-400" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="border border-slate-800 rounded-2xl p-4 sm:p-5 bg-slate-900/50 flex flex-col justify-between">
              <div className="flex justify-between items-start gap-1">
                 <div>
                   <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Repasses Médicos<br className="sm:hidden" /> (PJ/RPA)</h4>
                 </div>
                 <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 shrink-0" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-slate-100 mt-2 sm:mt-2">R$ 1.8M</p>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-teal-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 uppercase">Competência: Maio/2026</p>
              </div>
            </div>
            
            <div className="border border-slate-800 rounded-2xl p-4 sm:p-5 bg-slate-900/50 flex flex-col justify-between">
              <div className="flex justify-between items-start gap-1">
                 <div>
                   <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Folha Funcionários<br className="sm:hidden" /> (CLT)</h4>
                 </div>
                 <Users className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 shrink-0" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-slate-100 mt-2 sm:mt-2">R$ 950K</p>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-teal-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 uppercase">Fechado e Conciliado</p>
              </div>
            </div>

            <div className="border border-slate-800 rounded-2xl p-4 sm:p-5 bg-slate-900/50 flex flex-col justify-between">
              <div className="flex justify-between items-start gap-1">
                 <div>
                   <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Notas Fiscais<br className="sm:hidden" /> Pendentes</h4>
                 </div>
                 <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-orange-400 mt-2 sm:mt-2">12</p>
                <p className="text-[9px] text-slate-500 mt-2 uppercase">Aguardando Envio (PJ)</p>
              </div>
            </div>

            <div className="border border-slate-800 rounded-2xl p-4 sm:p-5 bg-slate-900/50 flex flex-col justify-between">
              <div className="flex justify-between items-start gap-1">
                 <div>
                   <h4 className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 leading-tight">Divergências de<br className="sm:hidden" /> Produção</h4>
                 </div>
                 <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 shrink-0" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-teal-400 mt-2 sm:mt-2">4</p>
                <p className="text-[9px] text-slate-500 mt-2 uppercase">Glosa / Contestação</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="border border-slate-800 rounded-3xl p-6 bg-slate-900/30">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider">
                   Fechamento de Plantões (PJ)
                 </h3>
                 <button className="text-xs text-teal-400 font-bold bg-teal-500/10 px-3 py-1 rounded">Baixar Lote Exportação</button>
               </div>
               
               <div className="space-y-3">
                 {[
                   { n: "Dr. Henrique Souza (Clinico)", val: "R$ 14.500,00", status: "NF Conferida", color: "text-teal-400" },
                   { n: "Dra. Ana Paula (Cardio)", val: "R$ 18.200,00", status: "Aguardando NF-e", color: "text-orange-400" },
                   { n: "Dr. Lucas Martins (Centro Cirúrgico)", val: "R$ 22.100,00", status: "Divergência", color: "text-red-400" },
                 ].map((p, i) => (
                   <div key={i} className="flex justify-between items-center p-3 border border-slate-800/50 rounded-xl bg-slate-900/50">
                     <div>
                       <p className="font-bold text-slate-200 text-sm">{p.n}</p>
                       <p className={`text-[10px] uppercase font-bold mt-1 ${p.color}`}>{p.status}</p>
                     </div>
                     <span className="font-mono text-sm font-bold text-slate-300">{p.val}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="border border-slate-800 rounded-3xl p-6 bg-slate-900/30">
               <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-wider mb-6">
                 Folha de Pagamento (CLT CLT / Base)
               </h3>
               
               <div className="space-y-4">
                 <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-300 font-bold text-sm">Enfermagem Assistencial</span>
                     <span className="text-teal-400 font-mono font-bold">R$ 520.000,00</span>
                   </div>
                   <p className="text-[10px] text-slate-500">120 Colaboradores • Consolidado via Ponto Eletrônico</p>
                 </div>
                 
                 <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-300 font-bold text-sm">Administrativo & Apoio</span>
                     <span className="text-teal-400 font-mono font-bold">R$ 280.000,00</span>
                   </div>
                   <p className="text-[10px] text-slate-500">45 Colaboradores • Recepcionistas, TI, Limpeza</p>
                 </div>
               </div>
             </div>
          </div>
        </>
      )}

      {/* Placeholder states for other subtabs */}
      {activeTab === "repasses_pj" && (
        <div className="border border-slate-800 rounded-2xl bg-slate-900/50 p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
          <Receipt className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-slate-300">Detalhamento de Repasses (PJ)</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-sm">
            Aqui você visualizará as prévias de repasses por profissional, validará as Notas Fiscais emitidas contra a instituição e fará integrações de pagamento B2B.
          </p>
        </div>
      )}

      {activeTab === "folha_clt" && (
        <div className="border border-slate-800 rounded-2xl bg-slate-900/50 p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
          <Users className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-slate-300">Folha (CLT) & Benefícios</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-sm">
            Módulo de integração com sistemas de folha (Senior, TOTVS, ADP) e exportação de horas trabalhadas da enfermagem / equipes de apoio.
          </p>
        </div>
      )}
    </div>
  );
}

