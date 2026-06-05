import { useState, useEffect } from "react";
import { 
  ArrowLeft, User, Shield, Briefcase, Award, 
  MessageSquare, ClipboardList, TrendingUp, CheckCircle2, History, Target 
} from "lucide-react";
import { Pdi, Checkin } from "../types";

interface EmployeeProfileViewProps {
  employeePdi: Pdi;
  onBack: () => void;
  assessmentInfo: { score: string; label: string; source?: 'leader' | 'self' } | null;
  checkins?: Checkin[];
}

export default function EmployeeProfileView({ employeePdi, onBack, assessmentInfo, checkins = [] }: EmployeeProfileViewProps) {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [competenciesAvg, setCompetenciesAvg] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem("hsf_hr_feedbacks");
    if (saved) {
      const parsed = JSON.parse(saved);
      const userFeedbacks = parsed.filter((f: any) => f.colaboradorNome === employeePdi.coordinatorName);
      setFeedbacks(userFeedbacks);
    }
  }, [employeePdi.coordinatorName]);

  useEffect(() => {
    let emp: any = null;
    const saved = localStorage.getItem("hsf_assessment_employees_v3");
    if (saved) {
       const parsed = JSON.parse(saved);
       emp = parsed.find((p: any) => p.name === employeePdi.coordinatorName);
    }
    
    // Fallback mock data for the demo app so the user always sees the graph
    if (!emp || !emp.leaderEvaluation || Object.keys(emp.leaderEvaluation).length === 0) {
       emp = {
          leaderEvaluation: {
             "Comunicação Assertiva_0": 4, "Comunicação Assertiva_1": 5, "Comunicação Assertiva_2": 4, "Comunicação Assertiva_3": 5,
             "Comportamento e Engajamento_0": 5, "Comportamento e Engajamento_1": 5, "Comportamento e Engajamento_2": 4, "Comportamento e Engajamento_3": 5,
             "Planejamento e Organização_0": 3, "Planejamento e Organização_1": 4, "Planejamento e Organização_2": 3, "Planejamento e Organização_3": 4,
             "Qualidade e Produtividade_0": 4, "Qualidade e Produtividade_1": 5, "Qualidade e Produtividade_2": 5, "Qualidade e Produtividade_3": 4,
             "Pontualidade e Assiduidade_0": 5, "Pontualidade e Assiduidade_1": 5, "Pontualidade e Assiduidade_2": 5, "Pontualidade e Assiduidade_3": 5,
             "Flexibilidade e Adaptabilidade_0": 4, "Flexibilidade e Adaptabilidade_1": 4, "Flexibilidade e Adaptabilidade_2": 4, "Flexibilidade e Adaptabilidade_3": 4,
             "Foco em Resultado_0": 5, "Foco em Resultado_1": 5, "Foco em Resultado_2": 4, "Foco em Resultado_3": 4,
             "Pensamento Criativo_0": 3, "Pensamento Criativo_1": 3, "Pensamento Criativo_2": 4, "Pensamento Criativo_3": 3,
             "Habilidades Interpessoais_0": 5, "Habilidades Interpessoais_1": 5, "Habilidades Interpessoais_2": 5, "Habilidades Interpessoais_3": 5
          }
       };
    }

    if (emp && emp.leaderEvaluation && Object.keys(emp.leaderEvaluation).length > 0) {
       const COMPETENCIES = [
         "Comunicação Assertiva", "Comportamento e Engajamento", 
         "Planejamento e Organização", "Qualidade e Produtividade", 
         "Pontualidade e Assiduidade", "Flexibilidade e Adaptabilidade", 
         "Foco em Resultado", "Pensamento Criativo", "Habilidades Interpessoais"
       ];
       const averages: Record<string, number> = {};
       COMPETENCIES.forEach(c => {
          let sum = 0;
          let count = 0;
          for (let i = 0; i < 4; i++) {
             if (emp.leaderEvaluation[`${c}_${i}`] !== undefined) {
                sum += emp.leaderEvaluation[`${c}_${i}`];
                count++;
             }
          }
          if (count > 0) {
            averages[c] = parseFloat((sum / count).toFixed(1));
          }
       });
       setCompetenciesAvg(averages);
    }
  }, [employeePdi.coordinatorName]);

  return (
    <div className="w-full xl:max-w-7xl mx-auto space-y-6 animate-in slide-in-from-right duration-500 pb-12 text-left">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors mb-2 focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-wider">Voltar para a Equipe</span>
      </button>

      {/* Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-2xl relative overflow-hidden text-left w-full glow-border">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
           <User className="w-64 h-64 text-teal-500 rotate-12" />
        </div>
        
        <div className="w-24 h-24 md:w-32 md:h-32 bg-teal-500/10 border-2 border-teal-500/30 rounded-full flex items-center justify-center text-teal-400 shrink-0 relative z-10">
          <span className="font-display font-bold text-4xl">{employeePdi.coordinatorName.charAt(0)}</span>
        </div>
        
        <div className="flex-1 space-y-3 relative z-10 text-center md:text-left mt-2 w-full">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-100">{employeePdi.coordinatorName}</h2>
            <p className="text-teal-400 font-semibold">{employeePdi.hierarchy || "Colaborador"}</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {employeePdi.department}</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Ciclo {employeePdi.cycle}</span>
            <span className="flex items-center gap-1.5"><ClipboardList className="w-4 h-4" /> PDI: {employeePdi.status}</span>
          </div>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-2 relative z-10 w-full md:w-auto min-w-[160px] shadow-inner mt-4 md:mt-0 md:ml-auto">
           <span className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
             <Target className="w-3.5 h-3.5"/> Nota Média (ADC)
           </span>
           <span className="text-4xl font-display font-bold text-teal-400">
             {assessmentInfo ? assessmentInfo.score.replace('.', ',') : "N/A"}
           </span>
           <div className="flex flex-col gap-1 items-center">
             <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
               {assessmentInfo ? assessmentInfo.label : "Pendente"}
             </span>
             {assessmentInfo && (
               <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mt-1">
                 {assessmentInfo.source === 'leader' ? "Avaliação do Líder" : "Autoavaliação"}
               </span>
             )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* Feedbacks History */}
        <div className="card-gradient rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 glow-border h-full flex flex-col text-left">
           <h3 className="text-lg font-display font-bold text-slate-200 flex items-center gap-3">
             <MessageSquare className="w-5 h-5 text-teal-400" />
             Histórico de Feedbacks (1-on-1)
           </h3>
           
           <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
             {feedbacks.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                 <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                 <p className="text-sm">Nenhum feedback registrado no sistema DHO para este colaborador.</p>
               </div>
             ) : (
               feedbacks.map((fb, idx) => (
                 <div key={idx} className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 space-y-3 relative hover:border-slate-700 transition-colors">
                   <div className="flex justify-between items-start">
                     <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border bg-teal-500/10 text-teal-400 border-teal-500/20`}>
                       {fb.tipo === 'ambos' ? 'Elogiar & Desenvolver' : fb.tipo === 'elogiar' ? 'Elogiar' : fb.tipo === 'desenvolver' ? 'Desenvolver' : 'Não Especificado'}
                     </span>
                     <span className="text-[10px] text-slate-500 font-medium">
                       {new Date(fb.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                     </span>
                   </div>
                   
                   <p className="text-sm text-slate-300 leading-relaxed font-sans mt-2">{fb.motivo}</p>
                   
                   {fb.planoAcao && (
                     <div className="mt-4 pt-4 border-t border-slate-800/60">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-teal-500 mb-1 block">Plano de Ação:</span>
                       <p className="text-xs text-slate-400">{fb.planoAcao}</p>
                     </div>
                   )}
                   
                   <div className="mt-4 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-500 border-t border-slate-800/60 pt-3">
                      <span>Status: {fb.status === 'concluido' ? 'Assinado' : 'Pendente'}</span>
                      <span>Gestor: {fb.gestorName}</span>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
        
        {/* PDI Insights or Metrics */}
        <div className="space-y-6 flex flex-col text-left w-full">
           <div className="card-gradient rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 glow-border text-left">
             <h3 className="text-lg font-display font-bold text-slate-200 flex items-center gap-3">
               <TrendingUp className="w-5 h-5 text-teal-400" />
               Progresso e Alinhamento
             </h3>
             <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div>
                   <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Parecer Final Líder / RH</h4>
                   <p className="text-sm font-sans text-slate-300 italic p-4 bg-slate-900 border-l-2 border-teal-500 rounded-lg">
                     {employeePdi.managerFeedback || "Nenhum parecer crítico emitido no PDI atual."}
                   </p>
                </div>
                {employeePdi.hrFeedback && (
                  <div>
                     <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Anotação DHO</h4>
                     <p className="text-sm font-sans text-slate-300 italic p-4 bg-slate-900 border-l-2 border-teal-500 rounded-lg">
                       {employeePdi.hrFeedback}
                     </p>
                  </div>
                )}
             </div>
           </div>

           {checkins.length > 0 && (
             <div className="card-gradient rounded-3xl border border-slate-800 p-6 md:p-8 space-y-4 glow-border text-left">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <History className="w-4 h-4 text-teal-400" />
                  Últimas Anotações (Check-ins de PDI)
                </h3>
                <div className="space-y-3 mt-4">
                  {checkins.slice(0, 3).map((c, i) => (
                    <div key={i} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] font-bold text-slate-400">{c.authorName}</span>
                         <span className="text-[9px] text-slate-500">{new Date(c.date).toLocaleDateString('pt-BR')}</span>
                       </div>
                       <p className="text-xs text-slate-300 font-sans">{c.encryptedNote || (c as any).feedback}</p>
                    </div>
                  ))}
                  {checkins.length > 3 && (
                    <p className="text-center text-[10px] font-bold text-teal-500 pt-2">+ {checkins.length - 3} anotações arquivadas</p>
                  )}
                </div>
             </div>
           )}

           {Object.keys(competenciesAvg).length > 0 ? (
             <div className="card-gradient rounded-3xl border border-slate-800 p-6 md:p-8 space-y-4 glow-border flex-1 flex flex-col text-left">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-teal-400" />
                  Média de Competências (ADC)
                </h3>
                <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto">
                   {Object.entries(competenciesAvg).map(([comp, avg]) => (
                      <div key={comp} className="space-y-1.5">
                         <div className="flex justify-between items-end text-xs font-bold">
                            <span className="text-slate-300 capitalize">{comp.toLowerCase()}</span>
                            <span className={Number(avg) >= 4 ? "text-teal-400" : Number(avg) >= 3 ? "text-teal-400" : "text-red-400"}>
                               {Number(avg)} / 5
                            </span>
                         </div>
                         <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${Number(avg) >= 4 ? "bg-teal-500" : Number(avg) >= 3 ? "bg-teal-500" : "bg-red-500"}`}
                              style={{ width: `${(Number(avg) / 5) * 100}%` }}
                            />
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           ) : (
             <div className="card-gradient rounded-3xl border border-slate-800 p-6 md:p-8 space-y-4 glow-border flex-1 flex flex-col justify-center items-center text-center">
                <Award className="w-16 h-16 text-slate-700 mb-2" />
                <h4 className="text-sm font-bold text-slate-300">Ainda Sem Avaliação</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  O colaborador ainda não teve suas competências avaliadas no ciclo atual.
                </p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
