import React, { useState, useEffect } from "react";
import { 
  ClipboardList, 
  Search, 
  Save, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  BarChart3,
  UserCheck,
  Info,
  ArrowLeft,
  Sparkles,
  Target,
  RefreshCw,
  Shield,
  X
} from "lucide-react";

const COMPETENCIES_DATA = [
  {
    name: "Comunicação Assertiva",
    items: [
      "O colaborador(a) consegue absorver informações, entender as necessidades dos colegas e validar perspectivas, criando um ambiente de confiança e colaboração.",
      "Consegue se comunicar de forma coerente atendendo os clientes internos e externos, de forma prestativa e segura.",
      "Pratica a escuta ativa, demonstrando interesse nas ideias dos colegas antes de formular sua resposta.",
      "Evita mal entendidos, transmite instruções e ideias de forma eficaz, garantindo que as mensagens sejam recebidas como pretendido, otimizando o fluxo de trabalho."
    ]
  },
  {
    name: "Comportamento e Engajamento",
    items: [
      "Planeja suas atividades definindo prioridades, organizando o ambiente e facilitando o acesso a informação.",
      "Demonstra comprometimento ao ir além de suas responsabilidades habituais para garantir que os objetivos da equipe e da instituição sejam alcançadas.",
      "Busca constantemente aprimorar suas habilidades técnicas e comportamentais para crescer profissionalmente.",
      "Possui orgulho em pertencer à instituição, demonstrando vontade de crescer a longo prazo."
    ]
  },
  {
    name: "Planejamento e Organização",
    items: [
      "Gerencia com eficiência sua rotina de trabalho, priorizando tarefas críticas e cumprindo consistentemente os prazos estabelecidos.",
      "Possui comprometimento com as normas, valores, políticas, regras e princípios vigente da instituição.",
      "Gerencia múltiplas tarefas simultaneamente, sem perder a qualidade ou o controle das entregas.",
      "Mantém o ambiente de trabalho (físico e/ou digital) organizado, facilitando o acesso as informações e otimizando a rotina da equipe."
    ]
  },
  {
    name: "Qualidade e Produtividade",
    items: [
      "Entrega resultados acima das metas estabelecidas, mantendo um bom padrão de qualidade e precisão, sem necessidade de revisão ou retrabalho.",
      "Demonstra proatividade em identificar oportunidades de melhoria nos processos, refinando a execução das tarefas e elevando o padrão de qualidade das entregas.",
      "Executa as atividades conforme os procedimentos operacionais padrão (POP's) e normas técnicas estabelecidas.",
      "Realiza suas atividades de forma completa, precisa e criteriosa, atendendo as necessidades da área."
    ]
  },
  {
    name: "Pontualidade e Assiduidade",
    items: [
      "Demonstra compromisso, mantendo um registro de assiduidade e cumprindo os horários de início, intervalo e término.",
      "É assíduo e pontual, comparecendo com regularidade e exatidão ao posto de trabalho, garantindo fluidez das atividades, respeito aos prazos e a equipe.",
      "Comunica imediatamente a liderança em caso de imprevistos que o impeçam de comparecer ao local de trabalho.",
      "Embora cumpra suas tarefas, precisa melhorar sua pontualidade e reduzir as ausências."
    ]
  },
  {
    name: "Flexibilidade e Adaptabilidade",
    items: [
      "Mostra flexibilidade ao assumir novas responsabilidade e adota novas ferramentas ou processos com facilidade, demonstrando abertura ao aprendizado contínuo.",
      "Embora execute bem as tarefas rotineiras, apresenta resistência ou dificuldade em adaptar-se a mudanças.",
      "Demonstra abertura ao novo, aceitando ideias diferentes e novas formas de trabalhar.",
      "Demonstra capacidade de antecipar problemas, elaborando planos de ação eficazes e alocando recursos de maneira inteligente para alcançar os resultados esperados."
    ]
  },
  {
    name: "Foco em Resultado",
    items: [
      "Demonstra nível de comprometimento na entrega dos resultados, superando as metas estabelecidas com qualidade e dentro do prazo.",
      "Concentra-se nos resultados assumindo compromissos com as metas e contribui com ideias e sugestões para atingir o resultado proposto.",
      "Identifica gargalos operacionais com antecedência e implementa soluções eficazes que melhoram a produtividade da equipe, demonstrando foco no resultado final.",
      "Consegue entender a importância de contribuir com os resultados sustentáveis."
    ]
  },
  {
    name: "Pensamento Criativo",
    items: [
      "Possui capacidade de pensar em alternativas que produzam resultados sustentáveis.",
      "Iniciou e/ou executou ideias criativas por conta própria.",
      "Aplica o pensamento criativo para resolver problemas diários e melhorar a eficiência do fluxo de trabalho.",
      "Constantemente se esforça para gerar resultados."
    ]
  },
  {
    name: "Habilidades Interpessoais",
    items: [
      "Pratica a empatia, se colocando no lugar dos colegas, compreendendo suas perspectivas e necessidades, facilitando na resolução de conflitos e fortalecendo os laços de equipe.",
      "Colabora eficazmente com a equipe, adaptando seu estilo de trabalho e contribuindo para objetivos comuns, mostrando flexibilidade e respeito mútuo para alcançar resultados compartilhados.",
      "Possui inteligência emocional para lidar com as situações adversas do dia a dia.",
      "Interage e mantém bom relacionamento com seus pares, superiores e outras equipes, contribuindo para o trabalho de outras áreas."
    ]
  }
];

const INITIAL_EMPLOYEES = [
  { id: "e1", name: "Pedro (Auxiliar)", department: "UTI Adulto", role: "Enfermeira", lastAssessment: "2025-11-10", selfEvaluation: { "Comunicação Assertiva_0": 3, "Comunicação Assertiva_1": 3, "Comunicação Assertiva_2": 3, "Comunicação Assertiva_3": 3, "Comportamento e Engajamento_0": 3, "Comportamento e Engajamento_1": 3, "Comportamento e Engajamento_2": 3, "Comportamento e Engajamento_3": 3, "Planejamento e Organização_0": 3, "Planejamento e Organização_1": 3, "Planejamento e Organização_2": 3, "Planejamento e Organização_3": 3, "Qualidade e Produtividade_0": 3, "Qualidade e Produtividade_1": 3, "Qualidade e Produtividade_2": 3, "Qualidade e Produtividade_3": 3, "Pontualidade e Assiduidade_0": 4, "Pontualidade e Assiduidade_1": 4, "Pontualidade e Assiduidade_2": 4, "Pontualidade e Assiduidade_3": 4, "Flexibilidade e Adaptabilidade_0": 3, "Flexibilidade e Adaptabilidade_1": 3, "Flexibilidade e Adaptabilidade_2": 3, "Flexibilidade e Adaptabilidade_3": 3, "Foco em Resultado_0": 3, "Foco em Resultado_1": 3, "Foco em Resultado_2": 3, "Foco em Resultado_3": 3, "Pensamento Criativo_0": 3, "Pensamento Criativo_1": 3, "Pensamento Criativo_2": 3, "Pensamento Criativo_3": 3, "Habilidades Interpessoais_0": 4, "Habilidades Interpessoais_1": 4, "Habilidades Interpessoais_2": 4, "Habilidades Interpessoais_3": 4 } },
  { id: "e2", name: "Rafael (Coordenador)", department: "Pronto Atendimento", role: "Técnico de Enfermagem", lastAssessment: "2025-05-15", selfEvaluation: { "Comunicação Assertiva_0": 2, "Comunicação Assertiva_1": 2, "Comunicação Assertiva_2": 2, "Comunicação Assertiva_3": 2, "Comportamento e Engajamento_0": 3, "Comportamento e Engajamento_1": 3, "Comportamento e Engajamento_2": 3, "Comportamento e Engajamento_3": 3, "Planejamento e Organização_0": 2, "Planejamento e Organização_1": 2, "Planejamento e Organização_2": 2, "Planejamento e Organização_3": 2, "Qualidade e Produtividade_0": 3, "Qualidade e Produtividade_1": 3, "Qualidade e Produtividade_2": 3, "Qualidade e Produtividade_3": 3, "Pontualidade e Assiduidade_0": 2, "Pontualidade e Assiduidade_1": 2, "Pontualidade e Assiduidade_2": 2, "Pontualidade e Assiduidade_3": 2, "Flexibilidade e Adaptabilidade_0": 2, "Flexibilidade e Adaptabilidade_1": 2, "Flexibilidade e Adaptabilidade_2": 2, "Flexibilidade e Adaptabilidade_3": 2, "Foco em Resultado_0": 2, "Foco em Resultado_1": 2, "Foco em Resultado_2": 2, "Foco em Resultado_3": 2, "Pensamento Criativo_0": 2, "Pensamento Criativo_1": 2, "Pensamento Criativo_2": 2, "Pensamento Criativo_3": 2, "Habilidades Interpessoais_0": 2, "Habilidades Interpessoais_1": 2, "Habilidades Interpessoais_2": 2, "Habilidades Interpessoais_3": 2 } },
  { id: "e3", name: "Márcia (RH)", department: "Qualidade", role: "Analista de Qualidade", lastAssessment: "2026-01-20", selfEvaluation: { "Comunicação Assertiva_0": 4, "Comunicação Assertiva_1": 4, "Comunicação Assertiva_2": 4, "Comunicação Assertiva_3": 4, "Comportamento e Engajamento_0": 4, "Comportamento e Engajamento_1": 4, "Comportamento e Engajamento_2": 4, "Comportamento e Engajamento_3": 4, "Planejamento e Organização_0": 3, "Planejamento e Organização_1": 3, "Planejamento e Organização_2": 3, "Planejamento e Organização_3": 3, "Qualidade e Produtividade_0": 4, "Qualidade e Produtividade_1": 4, "Qualidade e Produtividade_2": 4, "Qualidade e Produtividade_3": 4, "Pontualidade e Assiduidade_0": 3, "Pontualidade e Assiduidade_1": 3, "Pontualidade e Assiduidade_2": 3, "Pontualidade e Assiduidade_3": 3, "Flexibilidade e Adaptabilidade_0": 4, "Flexibilidade e Adaptabilidade_1": 4, "Flexibilidade e Adaptabilidade_2": 4, "Flexibilidade e Adaptabilidade_3": 4, "Foco em Resultado_0": 4, "Foco em Resultado_1": 4, "Foco em Resultado_2": 4, "Foco em Resultado_3": 4, "Pensamento Criativo_0": 3, "Pensamento Criativo_1": 3, "Pensamento Criativo_2": 3, "Pensamento Criativo_3": 3, "Habilidades Interpessoais_0": 4, "Habilidades Interpessoais_1": 4, "Habilidades Interpessoais_2": 4, "Habilidades Interpessoais_3": 4 } },
  { id: "e4", name: "João (TI)", department: "Ambulatório", role: "Médico Clínico", lastAssessment: null, selfEvaluation: null },
  { id: "e5", name: "Pedro Diogo", department: "Tecnologia", role: "Desenvolvedor", lastAssessment: null, selfEvaluation: null }
];

const getCompetencyScore = (evalObj: Record<string, number> | null | undefined, competencyName: string): number | null => {
  if (!evalObj) return null;
  let compSum = 0;
  let compCount = 0;
  for (let i = 0; i < 4; i++) {
    const v = evalObj[`${competencyName}_${i}`];
    if (v !== undefined) {
      compSum += v;
      compCount++;
    }
  }
  if (compCount > 0) return compSum / compCount;
  if (evalObj[competencyName] !== undefined) return evalObj[competencyName];
  return null;
};

const getGlobalAverage = (evalObj: Record<string, number> | null | undefined): string => {
  if (!evalObj || Object.keys(evalObj).length === 0) return "0.0";
  let sum = 0;
  let count = 0;
  COMPETENCIES_DATA.forEach(c => {
    const score = getCompetencyScore(evalObj, c.name);
    if (score !== null) {
      sum += score;
      count++;
    }
  });
  return count > 0 ? (sum / count).toFixed(1) : "0.0";
};

const getScoreLabel = (scoreStr: string) => {
  const score = parseFloat(scoreStr);
  if (isNaN(score)) return "";
  if (score >= 3.5) return "SUPERA";
  if (score >= 2.5) return "ATENDE";
  if (score >= 1.5) return "ATENDE PARCIALMENTE";
  return "NÃO ATENDE";
};

const AssessmentInstructions = () => (
  <div className="mb-8 bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
      <Info className="w-32 h-32 text-teal-500" />
    </div>
    
    <div className="relative z-10 flex flex-col gap-6">
      <div>
        <h4 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2 uppercase tracking-widest">
          <Info className="w-5 h-5 text-teal-400" />
          Instruções
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed text-justify mb-5 font-medium">
          ESTE FORMULÁRIO SERÁ UTILIZADO PARA REALIZAR A AVALIAÇÃO DE COMPETÊNCIAS DO COLABORADOR(A). LEIA A COMPETÊNCIA E SEUS DESDOBRAMENTOS COM ATENÇÃO PARA QUE A NOTA ATRIBUÍDA SEJA JUSTA, COERENTE E DE ACORDO COM AS ENTREGAS REALIZADAS POR CADA UM DA EQUIPE. ESSA AVALIAÇÃO É INDIVIDUAL E NÃO DE TODA A EQUIPE, POR ISSO É IMPORTANTE REFLETIR ACERCA DOS RESULTADOS INDIVIDUAIS.
        </p>
        <p className="text-sm text-slate-300 font-bold uppercase tracking-wide">
          ASSINALE AO LADO DE CADA ÍTEM, A NOTA QUE ATRIBUI DE ACORDO COM A LEGENDA ABAIXO:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/50 border border-slate-800/80 p-5 rounded-xl flex flex-col gap-3 transition-colors hover:bg-slate-950/80">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-8 h-8 shrink-0 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm">1</span> 
            <span className="font-bold text-slate-200 text-[11px] tracking-wider uppercase">NÃO ATENDE</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            O desempenho apresentado está abaixo do esperado para a função. Há dificuldades frequentes no cumprimento das atividades, tendo necessidade constante de orientação, falhas no processo prejudicando os resultados. Requer melhorias significativas e acompanhamento mais próximo.
          </p>
        </div>
        
        <div className="bg-slate-950/50 border border-slate-800/80 p-5 rounded-xl flex flex-col gap-3 transition-colors hover:bg-slate-950/80">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-8 h-8 shrink-0 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm">2</span> 
            <span className="font-bold text-slate-200 text-[11px] tracking-wider uppercase">ATENDE PARCIALMENTE</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            O desempenho atende parcialmente às expectativas. Executa as atividades básicas, porém com inconsistências, necessidade ocasional de orientação e oportunidades claras de aprimoramento. Com maior dedicação e desenvolvimento, pode alcançar melhores resultados.
          </p>
        </div>

        <div className="bg-slate-950/50 border border-slate-800/80 p-5 rounded-xl flex flex-col gap-3 transition-colors hover:bg-slate-950/80">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-8 h-8 shrink-0 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm">3</span> 
            <span className="font-bold text-slate-200 text-[11px] tracking-wider uppercase">ATENDE</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            O desempenho atende as expectativas. Executa suas atividades com qualidade, responsabilidade e autonomia na maior parte do tempo, contribuindo positivamente para os resultados e para o trabalho em equipe.
          </p>
        </div>

        <div className="bg-slate-950/50 border border-slate-800/80 p-5 rounded-xl flex flex-col gap-3 transition-colors hover:bg-slate-950/80">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-8 h-8 shrink-0 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm">4</span> 
            <span className="font-bold text-slate-200 text-[11px] tracking-wider uppercase">SUPERA</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            O desempenho supera as expectativas. Demonstra alto nível de qualidade, comprometimento e iniciativa, executando as atividades com excelência, autonomia e constância. Serve como referência positiva e contribui significativamente para a melhoria dos resultados e processos.
          </p>
        </div>
      </div>
    </div>
  </div>
);

interface AssessmentPanelProps {
  userRole?: string;
  userName?: string;
}

function AssessmentPanelInner({ userRole, userName, showUpdatesModal, setShowUpdatesModal }: AssessmentPanelProps & { showUpdatesModal: boolean, setShowUpdatesModal: (v: boolean) => void }) {

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("hsf_assessment_employees_v3");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge in any elements from INITIAL_EMPLOYEES that might be missing locally
      const missing = INITIAL_EMPLOYEES.filter(initEmp => !parsed.some((p: any) => p.id === initEmp.id));
      return [...parsed, ...missing];
    }
    return INITIAL_EMPLOYEES;
  });

  // Save to localStorage whenever employees change
  React.useEffect(() => {
    localStorage.setItem("hsf_assessment_employees_v3", JSON.stringify(employees));
  }, [employees]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState<"list" | "evaluate" | "view-evaluations" | "view-leader-evaluation" | "success">("list");
  
  // State for the 9 competencies evaluation (1 to 5 scale)
  const [evaluation, setEvaluation] = useState<Record<string, number>>({});

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchedEmployee = userName 
    ? employees.find(e => e.name.toLowerCase().includes(userName.split(' ')[0].toLowerCase()))
    : undefined;
  
  const activeEmployee = employees.find(e => e.id === selectedUser) 
    || matchedEmployee 
    || employees.find(e => e.name.toLowerCase().includes("pedro"))
    || employees[1]; // ultimate fallback

  const startEvaluation = (id: string) => {
    setSelectedUser(id);
    setEvaluation({});
    setStep("evaluate");
  };

  const handleScoreChange = (competency: string, score: number) => {
    setEvaluation(prev => ({ ...prev, [competency]: score }));
  };

  const submitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeEmployee) {
      if (userRole === "rh" || userRole === "lider") {
        // Leader/HR is evaluating
        const today = new Date().toISOString().split('T')[0];
        setEmployees(prev => prev.map(emp => 
          emp.id === activeEmployee.id ? { ...emp, lastAssessment: today, leaderEvaluation: evaluation } : emp
        ));
      } else {
        // Collaborator is auto-evaluating
        setEmployees(prev => prev.map(emp => 
          emp.id === activeEmployee.id ? { ...emp, selfEvaluation: evaluation } : emp
        ));
      }
    }
    // Simulate saving the evaluation
    setStep("success");
    // Removed auto timeout so user can read the message
  };

  const allCompetenciesScored = COMPETENCIES_DATA.every(c => 
    c.items.every((_, i) => evaluation[`${c.name}_${i}`] !== undefined)
  );
  
  const averageScore = getGlobalAverage(evaluation);

  if (step === "success") {
    return (
      <div className="w-full flex-grow flex items-center justify-center animate-in fade-in duration-500">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center text-center max-w-2xl shadow-2xl">
          <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mb-6 border border-teal-500/30">
            <CheckCircle2 className="w-10 h-10 text-teal-400" />
          </div>
          <h3 className="text-2xl font-display font-bold text-slate-100 mb-6 uppercase tracking-wider text-teal-400">
            Parabéns por concluir a avaliação {userRole === 'lider' || userRole === 'rh' ? `do seu colaborador(a)` : `com sucesso`}!
          </h3>
          <div className="flex flex-col items-center gap-2 mb-6 p-4 bg-slate-950/50 rounded-xl border border-slate-800/80 w-full">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nota Final</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-display font-bold text-slate-100">{averageScore}</span>
              <span className="text-[11px] font-bold px-3 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase">
                {getScoreLabel(averageScore)}
              </span>
            </div>
          </div>
          <p className="text-slate-300 font-medium leading-relaxed mb-8">
            Será importante inserir no formulário de feedback todos os pontos de atenção, elogios e considerações importantes, pois após esse momento de avaliação, o colaborador(a) irá utilizar de forma assertiva e com qualidade, todas as informações recebidas para a construção dos seus planos de ação e do PDI 2026.
          </p>
          <button
            onClick={() => {
              setStep("list");
              setSelectedUser(null);
            }}
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-4 rounded-xl transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(45,212,191,0.2)]"
          >
            Voltar para o Painel
          </button>
        </div>
      </div>
    );
  }

  if (step === "list" && (userRole === "rh" || userRole === "lider")) {
    return (
      <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
              <Activity className="w-6 h-6 text-teal-400" />
              Gestão de Avaliações
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Visão gerencial do progresso das avaliações de competências.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 -rotate-12" />
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Avaliações<br className="sm:hidden"/>Concluídas</p>
            <div className="flex items-baseline gap-2 sm:gap-3 mt-1 sm:mt-2">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">85%</h3>
              <span className="text-[9px] sm:text-[10px] bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                +12%
              </span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 rotate-12" />
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Média Geral<br className="sm:hidden"/>Global</p>
            <div className="flex items-baseline gap-1 sm:gap-3 mt-1 sm:mt-2">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">3.2</h3>
              <span className="text-[10px] sm:text-sm font-medium text-slate-500 -ml-1">/ 4.0</span>
              <span className="text-[8px] sm:text-[10px] font-bold px-1 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 ml-auto leading-tight text-center">
                <span className="hidden sm:inline">{getScoreLabel('3.2')}</span>
                <span className="sm:hidden">OK</span>
              </span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <UserCheck className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 rotate-6" />
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Colaboradores<br className="sm:hidden"/>Elegíveis</p>
            <div className="flex items-baseline gap-2 sm:gap-3 mt-1 sm:mt-2">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">{employees.length}</h3>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 rotate-12" />
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Maior<br className="sm:hidden"/>Competência</p>
            <div className="flex items-baseline gap-2 sm:gap-3 mt-1 sm:mt-2">
              <h4 className="text-sm sm:text-md font-bold text-slate-200 leading-tight">Qualidade e<br className="sm:hidden"/>Produtividade</h4>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-100">Status por Colaborador</h3>
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar colaborador ou departamento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="pb-3 px-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Colaborador</th>
                  <th className="pb-3 px-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Departamento</th>
                  <th className="pb-3 px-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Cargo</th>
                  <th className="pb-3 px-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Autoavaliação</th>
                  <th className="pb-3 px-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Última Avaliação</th>
                  <th className="pb-3 px-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                          {employee.name.split(" ").map(n => n[0]).join("").substring(0,2)}
                        </div>
                        <span className="font-bold text-slate-200">{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{employee.department}</td>
                    <td className="py-4 px-4 text-slate-400 text-xs">{employee.role}</td>
                    <td className="py-4 px-4">
                      {employee.selfEvaluation && Object.keys(employee.selfEvaluation).length > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 text-[10px] font-bold text-slate-300 border border-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-teal-400" />
                          Feita ({getGlobalAverage(employee.selfEvaluation as Record<string, number>)})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 text-[10px] font-bold text-teal-400 border border-teal-500/20">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {employee.lastAssessment ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 text-[10px] font-bold text-slate-300 border border-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-teal-400" />
                          {employee.lastAssessment}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 text-[10px] font-bold text-teal-400 border border-teal-500/20">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedUser(employee.id);
                            setStep("view-evaluations");
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-1.5 px-3 rounded-lg transition-all text-[11px] border border-slate-700 w-full sm:w-auto text-center"
                        >
                          Ver Autoavaliação
                        </button>
                        {userRole === "lider" && (
                          employee.leaderEvaluation ? (
                            <button 
                              onClick={() => {
                                setSelectedUser(employee.id);
                                setStep("view-leader-evaluation");
                              }}
                              className="bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-400 font-bold py-1.5 px-3 rounded-lg transition-all text-[11px] border border-teal-500/20 hover:border-teal-500 shadow-sm w-full sm:w-auto text-center"
                            >
                              Ver Minha Avaliação
                            </button>
                          ) : (
                            <button 
                              onClick={() => startEvaluation(employee.id)}
                              className="bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-200 font-bold py-1.5 px-3 rounded-lg transition-all text-[11px] border border-slate-700 hover:border-teal-500 shadow-sm hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] w-full sm:w-auto text-center"
                            >
                              Avaliar Colaborador
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                      Nenhum colaborador encontrado com "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (step === "evaluate" && activeEmployee) {
    return (
      <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-6 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={() => setStep("list")}
              className="text-slate-400 hover:text-slate-200 text-sm font-semibold mb-2 flex items-center gap-1 transition-colors"
            >
              &larr; Voltar para a lista
            </button>
            <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-teal-400" />
              Avaliação de Competências
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Avaliando o desempenho de {activeEmployee.name}
            </p>
          </div>
          
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Média Geral</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-teal-400 flex items-center gap-1">
                  {averageScore} <span className="text-xs text-slate-500">/ 4.0</span>
                </p>
                {averageScore !== "0.0" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    {getScoreLabel(averageScore)}
                  </span>
                )}
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-slate-700" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800">
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-lg font-bold text-slate-300 shadow-inner">
              {activeEmployee.name.split(" ").map(n => n[0]).join("").substring(0,2)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{activeEmployee.name}</h3>
              <p className="text-sm text-teal-400 font-medium">{activeEmployee.role} &bull; {activeEmployee.department}</p>
            </div>
          </div>

          <AssessmentInstructions />

          <form onSubmit={submitEvaluation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {COMPETENCIES_DATA.map((competency) => {
                const selfScore = getCompetencyScore(activeEmployee.selfEvaluation as any, competency.name);
                return (
                  <div key={competency.name} className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl block">
                    <div className="flex items-start justify-between mb-4">
                      <label className="text-sm font-bold text-slate-300 block">{competency.name}</label>
                      {userRole === "lider" && selfScore !== null && (
                        <div className="text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-1 flex items-center gap-1.5 text-slate-400">
                          <span>Auto:</span>
                          <span className="font-bold text-teal-400">{selfScore.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col divide-y divide-slate-800/60">
                      {competency.items.map((item, index) => {
                        const itemKey = `${competency.name}_${index}`;
                        return (
                          <div key={itemKey} className="flex flex-col gap-3 py-5 first:pt-2 last:pb-2">
                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{item}</p>
                            <div className="flex justify-between items-center gap-2 mt-1">
                              {[1, 2, 3, 4].map((score) => (
                                <button
                                  key={score}
                                  type="button"
                                  onClick={() => handleScoreChange(itemKey, score)}
                                  className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all ${
                                    evaluation[itemKey] === score
                                      ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.3)] scale-105"
                                      : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 border border-slate-700/50"
                                  }`}
                                >
                                  {score}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={!allCompetenciesScored}
                className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-base font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)] py-3 px-8 rounded-xl transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvar Avaliação
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (step === "view-evaluations" && activeEmployee) {
    const selfEval = (activeEmployee as any).selfEvaluation;

    return (
      <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-6 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={() => setStep("list")}
              className="text-slate-400 hover:text-slate-200 text-sm font-semibold mb-2 flex items-center gap-1 transition-colors"
            >
              &larr; Voltar para a lista
            </button>
            <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-teal-400" />
              Autoavaliação do Colaborador
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Visualizando a autoavaliação de {activeEmployee.name}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-lg font-bold text-slate-300 shadow-inner">
              {activeEmployee.name.split(" ").map(n => n[0]).join("").substring(0,2)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{activeEmployee.name}</h3>
              <p className="text-sm text-teal-400 font-medium">{activeEmployee.role} &bull; {activeEmployee.department}</p>
            </div>
          </div>

          {!selfEval || Object.keys(selfEval).length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">Autoavaliação Pendente</h3>
              <p className="text-slate-400 text-sm max-w-sm">O colaborador ainda não realizou sua autoavaliação deste ciclo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {COMPETENCIES_DATA.map((competency) => {
                const globalScore = getCompetencyScore(selfEval, competency.name);
                return (
                  <div key={competency.name} className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl block">
                    <div className="flex items-start justify-between mb-4">
                      <label className="text-sm font-bold text-slate-300 block">{competency.name}</label>
                      {globalScore !== null && (
                        <div className="text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-1 flex items-center gap-1.5 text-slate-400">
                          <span>Média:</span>
                          <span className="font-bold text-teal-400">{globalScore.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col divide-y divide-slate-800/60">
                      {competency.items.map((item, index) => {
                        const itemKey = `${competency.name}_${index}`;
                        // fallback to older version that used just competency.name
                        const scoreValue = selfEval[itemKey] !== undefined ? selfEval[itemKey] : selfEval[competency.name];
                        return (
                          <div key={itemKey} className="flex flex-col gap-3 py-5 first:pt-2 last:pb-2">
                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{item}</p>
                            <div className="flex justify-between items-center gap-2 mt-1">
                              {[1, 2, 3, 4].map((score) => (
                                <div
                                  key={score}
                                  className={`flex-1 h-8 rounded-md text-sm font-bold flex items-center justify-center transition-all ${
                                    scoreValue === score
                                      ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.3)] scale-105"
                                      : "bg-slate-800/50 text-slate-500 border border-slate-700/50"
                                  }`}
                                >
                                  {score}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "view-leader-evaluation" && activeEmployee) {
    const leaderEval = (activeEmployee as any).leaderEvaluation;

    return (
      <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-6 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => {
                setStep("list");
                setSelectedUser(null);
              }}
              className="flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors mb-4 focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider">Voltar para Tabela</span>
            </button>
            <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-teal-400" />
              Minha Avaliação do Colaborador
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Visualizando a avaliação que você realizou para {activeEmployee.name}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-lg font-bold text-slate-300 shadow-inner">
              {activeEmployee.name.split(" ").map(n => n[0]).join("").substring(0,2)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{activeEmployee.name}</h3>
              <p className="text-sm text-teal-400 font-medium">{activeEmployee.role} &bull; {activeEmployee.department}</p>
            </div>
          </div>

          {!leaderEval || Object.keys(leaderEval).length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">Avaliação Pendente</h3>
              <p className="text-slate-400 text-sm max-w-sm">A avaliação do colaborador ainda não foi realizada neste ciclo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {COMPETENCIES_DATA.map((competency) => {
                const globalScore = getCompetencyScore(leaderEval, competency.name);
                return (
                  <div key={competency.name} className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl block">
                    <div className="flex items-start justify-between mb-4">
                      <label className="text-sm font-bold text-slate-300 block">{competency.name}</label>
                      {globalScore !== null && (
                        <div className="text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-1 flex items-center gap-1.5 text-slate-400">
                          <span>Média:</span>
                          <span className="font-bold text-teal-400">{globalScore.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col divide-y divide-slate-800/60">
                      {competency.items.map((item, index) => {
                        const itemKey = `${competency.name}_${index}`;
                        const scoreValue = leaderEval[itemKey] !== undefined ? leaderEval[itemKey] : leaderEval[competency.name];
                        return (
                          <div key={itemKey} className="flex flex-col gap-3 py-5 first:pt-2 last:pb-2">
                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{item}</p>
                            <div className="flex justify-between items-center gap-2 mt-1">
                              {[1, 2, 3, 4].map((score) => (
                                <div
                                  key={score}
                                  className={`flex-1 h-8 rounded-md text-sm font-bold flex items-center justify-center transition-all ${
                                    scoreValue === score
                                      ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.3)] scale-105"
                                      : "bg-slate-800/50 text-slate-500 border border-slate-700/50"
                                  }`}
                                >
                                  {score}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Not RH/Lider: view self evaluation directly
  if (activeEmployee?.selfEvaluation && step !== "evaluate") {
    // If they already evaluated, show the view-evaluations screen as default instead of the form
    return (
      <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-6 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-teal-400" />
              Minha Autoavaliação
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Você já realizou sua autoavaliação deste ciclo.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-lg font-bold text-slate-300 shadow-inner">
              {activeEmployee.name.split(" ").map(n => n[0]).join("").substring(0,2)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{activeEmployee.name}</h3>
              <p className="text-sm text-teal-400 font-medium">{activeEmployee.role} &bull; {activeEmployee.department}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => {
                  setEvaluation(activeEmployee.selfEvaluation || {});
                  setStep("evaluate");
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-xl transition-all text-sm border border-slate-700"
              >
                Refazer Autoavaliação
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {COMPETENCIES_DATA.map((competency) => {
              const globalScore = getCompetencyScore(activeEmployee.selfEvaluation as any, competency.name);
              return (
                <div key={competency.name} className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl block">
                  <div className="flex items-start justify-between mb-4">
                    <label className="text-sm font-bold text-slate-300 block">{competency.name}</label>
                    {globalScore !== null && (
                      <div className="text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-1 flex items-center gap-1.5 text-slate-400">
                        <span>Média:</span>
                        <span className="font-bold text-teal-400">{globalScore.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col divide-y divide-slate-800/60">
                    {competency.items.map((item, index) => {
                      const itemKey = `${competency.name}_${index}`;
                      const scoreValue = activeEmployee.selfEvaluation![itemKey] !== undefined ? activeEmployee.selfEvaluation![itemKey] : activeEmployee.selfEvaluation![competency.name];
                      return (
                        <div key={itemKey} className="flex flex-col gap-3 py-5 first:pt-2 last:pb-2">
                          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{item}</p>
                          <div className="flex justify-between items-center gap-2 mt-1">
                            {[1, 2, 3, 4].map((score) => (
                              <div
                                key={score}
                                className={`flex-1 h-8 rounded-md text-sm font-bold flex items-center justify-center transition-all ${
                                  scoreValue === score
                                    ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.3)] scale-105"
                                    : "bg-slate-800/50 text-slate-500 border border-slate-700/50"
                                }`}
                              >
                                {score}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Not RH: show self evaluation form directly
  return (
    <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-6 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-teal-400" />
            Minha Autoavaliação
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Avalie seu desempenho nas 9 competências institucionais.
          </p>
        </div>
        
        <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Média Geral</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-teal-400 flex items-center gap-1">
                {averageScore} <span className="text-xs text-slate-500">/ 4.0</span>
              </p>
              {averageScore !== "0.0" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  {getScoreLabel(averageScore)}
                </span>
              )}
            </div>
          </div>
          <BarChart3 className="w-8 h-8 text-slate-700" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <AssessmentInstructions />

        <form onSubmit={submitEvaluation} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {COMPETENCIES_DATA.map((competency) => {
              const globalScore = getCompetencyScore(evaluation as any, competency.name);
              return (
                <div key={competency.name} className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl block">
                  <div className="flex items-start justify-between mb-4">
                    <label className="text-sm font-bold text-slate-300 block">{competency.name}</label>
                    {globalScore !== null && (
                      <div className="text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-1 flex items-center gap-1.5 text-slate-400">
                        <span>Sua Média:</span>
                        <span className="font-bold text-teal-400">{globalScore.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col divide-y divide-slate-800/60">
                    {competency.items.map((item, index) => {
                      const itemKey = `${competency.name}_${index}`;
                      return (
                        <div key={itemKey} className="flex flex-col gap-3 py-5 first:pt-2 last:pb-2">
                          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{item}</p>
                          <div className="flex justify-between items-center gap-2 mt-1">
                            {[1, 2, 3, 4].map((score) => (
                              <button
                                key={score}
                                type="button"
                                onClick={() => handleScoreChange(itemKey, score)}
                                className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all ${
                                  evaluation[itemKey] === score
                                    ? "bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.3)] scale-105"
                                    : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 border border-slate-700/50"
                                }`}
                              >
                                {score}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={!allCompetenciesScored}
              className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-base font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)] py-3 px-8 rounded-xl transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Enviar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AssessmentPanel(props: AssessmentPanelProps) {
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);

  useEffect(() => {
    // Only check once on mount
    const hasSeenUpdates = sessionStorage.getItem('hsf_has_seen_updates_modal');
    if (!hasSeenUpdates) {
      setShowUpdatesModal(true);
      sessionStorage.setItem('hsf_has_seen_updates_modal', 'true');
    }
  }, []);

  return (
    <>
      <AssessmentPanelInner {...props} showUpdatesModal={showUpdatesModal} setShowUpdatesModal={setShowUpdatesModal} />
      
      {/* Premium System Updates Modal */}
      {showUpdatesModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6 backdrop-blur-sm bg-black/60 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl max-h-[95vh] flex flex-col bg-slate-900 border border-teal-500/20 rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500 ease-out">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400 z-20"></div>
            
            <button 
              onClick={() => setShowUpdatesModal(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-10 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700 flex-1">
              <div className="flex items-start md:items-center gap-4 mb-8 pr-8">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex flex-shrink-0 items-center justify-center mt-1 md:mt-0">
                  <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-slate-100">Novidades do Sistema</h2>
                  <p className="text-xs md:text-sm text-teal-400 font-medium">Veja as últimas atualizações adicionadas ao seu perfil</p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex gap-4 p-4 md:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
                   <div className="mt-1 shrink-0">
                      <Target className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-200 mb-1 text-sm md:text-base">Módulo de PDI e Metas Premium</h4>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">O plano de desenvolvimento individual agora possui acompanhamento aprimorado, visualização de metas a curto e longo prazo, e métricas em tempo real.</p>
                   </div>
                </div>
                
                <div className="flex gap-4 p-4 md:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
                   <div className="mt-1 shrink-0">
                      <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-200 mb-1 text-sm md:text-base">Sincronização Contínua Automática</h4>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Suas modificações e atualizações agora são salvas de forma autônoma sem necessidade de recarregamento, garantindo que nenhum progresso seja perdido.</p>
                   </div>
                </div>

                <div className="flex gap-4 p-4 md:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
                   <div className="mt-1 shrink-0">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-200 mb-1 text-sm md:text-base">Segurança e Privacidade Avançada</h4>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Aprimoramento nas permissões de usuário e visualização de equipe restrita, mantendo total sigilo nas avaliações e no seu planejamento estratégico.</p>
                   </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setShowUpdatesModal(false)}
                  className="w-full md:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
                >
                  Entendi, Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
