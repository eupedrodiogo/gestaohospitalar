import { useState } from "react";
import { 
  FileText, CheckCircle2, AlertTriangle, Clock, 
  Upload, Search, Filter, ChevronRight, XCircle, FileSignature, 
  ShieldCheck, BrainCircuit, ExternalLink, Download
} from "lucide-react";

interface CredentialingPipelineProps {
  userRole: "colaborador" | "lider" | "rh" | "medico" | string;
  userName: string;
}

export default function CredentialingPipeline({ userRole, userName }: CredentialingPipelineProps) {
  const isLeaderOrHR = userRole === "lider" || userRole === "rh";
  const [activeTab, setActiveTab] = useState<"dashboard" | "meus_docs" | "pendencias">("dashboard");

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
            Esteira Credencial & Documentos
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isLeaderOrHR 
              ? "Validação de CRM, gestão de contratos e análise de documentos via IA." 
              : "Faça upload de seus documentos, assine contratos e acompanhe seu credenciamento."}
          </p>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {(isLeaderOrHR ? ["dashboard", "pendencias"] : ["meus_docs"]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab 
                  ? "bg-teal-500/10 text-teal-400" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {isLeaderOrHR ? (
        activeTab === "dashboard" ? <ManagerDashboardView /> : <PendingApprovalsView />
      ) : (
        <EmployeeDocumentsView userName={userName} userRole={userRole} />
      )}
    </div>
  );
}

function EmployeeDocumentsView({ userName, userRole }: { userName: string, userRole: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const isMedico = userRole === "medico";

  const docs = isMedico ? [
    { title: "CRM / CRM-PJ", status: "Validado", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", icon: ShieldCheck, date: "Expedido: 01/2026 - Val. Indeterminada" },
    { title: "Comprovante de Especialidade", status: "Validado", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", icon: CheckCircle2, date: "Tít. Especialista - 2024" },
    { title: "Contrato de Prestação (PJ)", status: "Pendente Assinatura", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: FileSignature, date: "Aguardando sua assinatura digital" },
    { title: "Seguro de Responsabilidade Civil", status: "Em Análise", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Clock, date: "Enviado há 2 horas" }
  ] : [
    { title: "Documento de Identidade (RG/CNH)", status: "Validado", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", icon: ShieldCheck, date: "Validado em 01/2026" },
    { title: "Carteira de Trabalho (CTPS Digital)", status: "Validado", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", icon: CheckCircle2, date: "Conferido e arquivado" },
    { title: "Contrato de Trabalho (CLT)", status: "Pendente Assinatura", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: FileSignature, date: "Aguardando sua assinatura digital" },
    { title: "Atestado de Saúde Ocupacional (ASO)", status: "Em Análise", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Clock, date: "Enviado há 2 horas" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Upload Action Card */}
        <div className="md:col-span-1 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group bg-gradient-to-br from-slate-900 to-slate-800/80 shadow-xl flex flex-col items-center text-center">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500/0 via-teal-500 to-teal-500/0 opacity-50"></div>
          
          <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 border border-teal-500/20">
            <Upload className="w-8 h-8" />
          </div>
          
          <h3 className="font-display font-bold text-lg text-slate-100 mb-2">Enviar Documento</h3>
          <p className="text-xs text-slate-400 mb-6">{isMedico ? "CRM, Especialização, Seguro de Responsabilidade, etc." : "RG, CPF, Comprovante de Residência, ASO, etc."}</p>
          
          <button 
            onClick={() => setIsUploading(true)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition-colors border border-slate-700 hover:border-teal-500/50 flex items-center justify-center gap-2"
          >
            Selecionar Arquivo
          </button>
          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-4">
            <BrainCircuit className="w-3 h-3" /> IA validará a validade e especialidade automaticamente.
          </p>
        </div>

        {/* Documents Status */}
        <div className="md:col-span-2 border border-slate-800 rounded-2xl p-6 bg-slate-900/50">
          <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            Meus Documentos & Contratos
          </h3>
          
          <div className="space-y-3">
            {docs.map((doc, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${doc.border} bg-slate-900/50 overflow-hidden relative`}>
                {doc.status === "Pendente Assinatura" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                )}
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${doc.bg} ${doc.color}`}>
                    <doc.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{doc.title}</h4>
                    <p className="text-xs text-slate-400">{doc.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${doc.bg} ${doc.color}`}>
                    {doc.status}
                  </span>
                  {doc.status === "Pendente Assinatura" && (
                    <button className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1">
                      Assinar <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagerDashboardView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50">
          <h4 className="text-xs uppercase font-bold text-slate-400 flex items-center justify-between">
            Credenciamento
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </h4>
          <p className="text-2xl font-display font-bold text-slate-100 mt-2">Corpo Clínico 100%</p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
             <div className="h-full bg-teal-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide">Médicos Aprovados e Verificados</p>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50">
          <h4 className="text-xs uppercase font-bold text-slate-400 flex items-center justify-between">
            CRMs Vencidos/Cassados
            <ShieldCheck className="w-4 h-4 text-orange-400" />
          </h4>
          <p className="text-2xl font-display font-bold text-orange-400 mt-2">0</p>
          <p className="text-[10px] text-slate-500 mt-3 uppercase tracking-wide">Monitoramento Automático Ativo</p>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50">
          <h4 className="text-xs uppercase font-bold text-slate-400 flex items-center justify-between">
            Processos de Onboarding
            <FileSignature className="w-4 h-4 text-blue-400" />
          </h4>
          <p className="text-2xl font-display font-bold text-blue-400 mt-2">4</p>
          <p className="text-[10px] text-slate-500 mt-3 uppercase tracking-wide">Novos Médicos Em Credenciamento</p>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50">
          <h4 className="text-xs uppercase font-bold text-slate-400 flex items-center justify-between">
            Alertas de AI
            <BrainCircuit className="w-4 h-4 text-teal-400" />
          </h4>
          <p className="text-2xl font-display font-bold text-teal-400 mt-2">2</p>
          <p className="text-[10px] text-slate-500 mt-3 uppercase tracking-wide">Documentos inconsistentes detectados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Tabela de Credenciamentos Recentes */}
         <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/30">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-display font-semibold text-sm text-slate-200 uppercase tracking-wider">
               Processos em Andamento
             </h3>
             <button className="text-xs font-bold text-teal-400">Ver Lista Completa</button>
           </div>
           
           <div className="space-y-4 text-sm">
             {[
               { n: "Dra. Carolina Nunes", esp: "Neurologista", step: "Assinatura Contrato", p: 75, warn: false },
               { n: "Dr. Roberto Silva", esp: "Cirurgião Geral", step: "Aguardando Seg. Responsab.", p: 40, warn: true },
               { n: "Dr. Márcio Oliveira", esp: "Pediatra", step: "Verificando Especialidade", p: 20, warn: false }
             ].map((m, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-200">{m.n}</p>
                      <p className="text-[10px] text-slate-500">{m.esp}</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold ${m.warn ? 'text-orange-400' : 'text-slate-400'}`}>
                      {m.step}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.warn ? 'bg-orange-500' : 'bg-teal-500'}`} style={{ width: `${m.p}%` }}></div>
                  </div>
                </div>
             ))}
           </div>
         </div>

         {/* Alertas de Monitoramento de IA */}
         <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/30">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-display font-semibold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
               Monitoramento IA <BrainCircuit className="w-4 h-4 text-teal-400" />
             </h3>
             <span className="flex items-center gap-2 text-xs text-teal-400 font-bold">
               <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
               RODANDO
             </span>
           </div>
           
           <div className="space-y-3">
             <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 flex items-start gap-4">
               <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 shrink-0">
                 <AlertTriangle className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <h4 className="text-xs font-bold text-slate-200">Divergência de Especialidade</h4>
                 <p className="text-[10px] text-slate-400 mt-1">O diploma de título de especialista de "Dr. Paulo S." não confere com o Registro de Qualificação de Especialista (RQE). Documento rejeitado automaticamente.</p>
                 <div className="mt-3">
                   <button className="text-[10px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 px-3 py-1 rounded transition-colors">Verificar Manualmente</button>
                 </div>
               </div>
             </div>
             
             <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 flex items-start gap-4">
               <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 shrink-0">
                 <CheckCircle2 className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <h4 className="text-xs font-bold text-slate-200">Varredura Diária Concluída</h4>
                 <p className="text-[10px] text-slate-400 mt-1">125 PRONTUÁRIOS MÉDICOS checados contra Conselho Federal de Medicina (CFM). 100% regulares.</p>
               </div>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}

function PendingApprovalsView() {
  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-900/50 flex flex-col overflow-hidden">
      {/* Tools */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="bg-slate-800 border-none text-xs rounded-lg text-slate-200 py-1.5 px-3">
            <option>Status: Todos</option>
            <option>Status: Pendente Análise</option>
            <option>Status: Divergência (IA)</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700">
            <Search className="w-3 h-3" /> Buscar
          </button>
          <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700">
            <Filter className="w-3 h-3" /> Filtrar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[500px]">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-500">
            <tr>
              <th className="px-6 py-4">Profissional</th>
              <th className="px-6 py-4">Tipo Documento</th>
              <th className="px-6 py-4">Envio</th>
              <th className="px-6 py-4">Análise IA</th>
              <th className="px-6 py-4">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {[
              { n: "Dr. Márcio Oliveira", doc: "Título Especialista (Pediatria)", date: "Hoje, 10:45", ai: "Sucesso. Extrato Validado (98%)", aiWarn: false },
              { n: "Dra. Carolina Nunes", doc: "Contrato Assinado PJ", date: "Ontem, 16:30", ai: "Assinatura Digital Válida ICP-Brasil", aiWarn: false },
              { n: "Dr. Filipe Barros", doc: "CRM / RG", date: "Ontem, 14:20", ai: "Baixa Resolução. Foto Incompatível.", aiWarn: true },
            ].map((d, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-200 block">{d.n}</span>
                </td>
                <td className="px-6 py-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{d.doc}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs">
                  {d.date}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {d.aiWarn ? <AlertTriangle className="w-4 h-4 text-orange-400"/> : <CheckCircle2 className="w-4 h-4 text-teal-400"/>}
                    <span className={`text-xs ${d.aiWarn ? 'text-orange-400' : 'text-teal-400'}`}>{d.ai}</span>
                  </div>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors" title="Visualizar">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded transition-colors font-bold text-xs" title="Aprovar/Resolver">
                    Analisar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
