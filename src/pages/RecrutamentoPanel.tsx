import React, { useState } from "react";
import {
  Users,
  Briefcase,
  Calendar,
  FileText,
  Search,
  Filter,
  MoreVertical,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  Star,
  FileBadge,
  StickyNote,
} from "lucide-react";

const VAGAS_MOCK = [
  {
    id: "V-1029",
    title: "Enfermeiro(a) UTI Adulto",
    department: "UTI",
    type: "Efetivo",
    status: "Aberta",
    candidates: 24,
    postedAt: "Há 2 dias",
  },
  {
    id: "V-1030",
    title: "Técnico(a) de Enfermagem",
    department: "Pronto Atendimento",
    type: "Plantonista",
    status: "Entrevistas",
    candidates: 56,
    postedAt: "Há 5 dias",
  },
  {
    id: "V-1031",
    title: "Analista de Qualidade",
    department: "Qualidade",
    type: "Efetivo",
    status: "Aberta",
    candidates: 12,
    postedAt: "Há 1 semana",
  },
  {
    id: "V-1032",
    title: "Médico(a) Cardiologista",
    department: "Ambulatório",
    type: "PJ",
    status: "Fechada",
    candidates: 8,
    postedAt: "Há 2 semanas",
  },
];

const CANDIDATOS_MOCK = [
  {
    id: "C-001",
    name: "Ana Silveira",
    role: "Enfermeira UTI",
    status: "Triagem",
    match: 92,
    date: "Hoje, 10:30",
  },
  {
    id: "C-002",
    name: "Pedro (Auxiliar)",
    role: "Técnico de Enfermagem",
    status: "Entrevista RH",
    match: 85,
    date: "Ontem, 15:45",
  },
  {
    id: "C-003",
    name: "Márcia (RH)",
    role: "Analista de Qualidade",
    status: "Proposta",
    match: 98,
    date: "25/05/2026",
  },
  {
    id: "C-004",
    name: "Rafael (Coordenador)",
    role: "Enfermeiro UTI",
    status: "Reprovado",
    match: 45,
    date: "24/05/2026",
  },
  {
    id: "C-005",
    name: "João (TI)",
    role: "Analista de Qualidade",
    status: "Triagem",
    match: 68,
    date: "26/05/2026",
  }
];

export default function RecrutamentoPanel() {
  const [activeSegment, setActiveSegment] = useState<"vagas" | "candidatos" | "pipeline">("vagas");
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState(CANDIDATOS_MOCK);
  const [vagas, setVagas] = useState(VAGAS_MOCK);
  
  const [isNewVagaOpen, setIsNewVagaOpen] = useState(false);
  const [newVagaForm, setNewVagaForm] = useState({ title: "", department: "", type: "Efetivo" });
  
  const [selectedCandidate, setSelectedCandidate] = useState<typeof CANDIDATOS_MOCK[0] | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData("text/plain");
    if (!candidateId) return;

    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status } : c))
    );
  };

  const filteredVagas = vagas.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
            <Users className="w-6 h-6 text-teal-400" />
            Recrutamento e Seleção
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Gestão de vagas, candidatos e processo seletivo do Hospital.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold py-2 px-4 rounded-xl transition-all border border-slate-700">
            Relatórios
          </button>
          <button 
            onClick={() => setIsNewVagaOpen(true)}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)] py-2 px-4 rounded-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Vaga
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 rotate-12" />
          </div>
          <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Vagas<br className="sm:hidden" />Abertas</p>
          <div className="flex items-baseline gap-2 sm:gap-3 mt-1 sm:mt-2">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">12</h3>
            <span className="text-[9px] sm:text-[10px] bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 -rotate-12" />
          </div>
          <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Candidatos</p>
          <div className="flex items-baseline gap-2 sm:gap-3 mt-1 sm:mt-2">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">184</h3>
            <span className="text-[9px] sm:text-[10px] bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +15%
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 -rotate-6" />
          </div>
          <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Entrevistas</p>
          <div className="flex items-baseline gap-2 sm:gap-3 mt-1 sm:mt-2">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">28</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 rotate-6" />
          </div>
          <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">SLA (Dias)</p>
          <div className="flex items-baseline gap-2 sm:gap-3 mt-1 sm:mt-2">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">18</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-800 px-2 pt-2">
              <button
                onClick={() => setActiveSegment("vagas")}
                className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 ${
                  activeSegment === "vagas"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Vagas
              </button>
              <button
                onClick={() => setActiveSegment("candidatos")}
                className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 ${
                  activeSegment === "candidatos"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Candidatos (Banco)
              </button>
              <button
                onClick={() => setActiveSegment("pipeline")}
                className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 ${
                  activeSegment === "pipeline"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Pipeline (Kanban)
              </button>
            </div>

            {/* List Controls */}
            <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-slate-800/50">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder={`Buscar ${activeSegment}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
                />
              </div>
              <button className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shrink-0">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>

            {/* Content List */}
            <div className="flex-grow overflow-y-auto min-h-[300px]">
              {activeSegment === "vagas" && (
                <div className="divide-y divide-slate-800/50">
                  {filteredVagas.map((vaga) => (
                    <div key={vaga.id} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5 text-teal-500/70" />
                        </div>
                        <div>
                          <h4 className="text-slate-100 font-bold text-sm flex items-center gap-2">
                            {vaga.title}
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                              {vaga.id}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                            <span>{vaga.department}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span>{vaga.type}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {vaga.postedAt}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Candidatos</p>
                          <p className="text-sm font-semibold text-slate-200">{vaga.candidates}</p>
                        </div>
                        <div className="w-24 text-center">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded inline-block w-full text-center ${
                            vaga.status === "Aberta" ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" :
                            vaga.status === "Entrevistas" ? "bg-teal-500/10 text-teal-500 border border-teal-500/20" :
                            "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}>
                            {vaga.status}
                          </span>
                        </div>
                        <button className="text-slate-500 hover:text-slate-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSegment === "candidatos" && (
                <div className="divide-y divide-slate-800/50">
                  {filteredCandidates.map((c, i) => (
                    <div 
                      key={c.id || i} 
                      onClick={() => setSelectedCandidate(c)}
                      className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                          {c.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h4 className="text-slate-100 font-bold text-sm tracking-tight">{c.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{c.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Match</p>
                          <p className={`text-sm font-bold ${c.match > 80 ? 'text-teal-400' : c.match > 60 ? 'text-teal-400' : 'text-red-400'}`}>
                            {c.match}%
                          </p>
                        </div>
                        <div className="w-24 text-center">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded inline-block w-full text-center ${
                            c.status === "Aprovada" ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" :
                            c.status === "Reprovado" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="text-[10px] text-slate-500">{c.date}</p>
                        </div>
                        <button className="text-slate-500 hover:text-slate-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSegment === "pipeline" && (
                <div className="p-4 overflow-x-auto">
                  <div className="flex gap-4 min-w-max pb-4">
                    {[
                      { id: "Triagem", label: "Triagem" },
                      { id: "Entrevista RH", label: "Entrevista RH" },
                      { id: "Entrevista Gestor", label: "Entrevista Gestor" },
                      { id: "Proposta", label: "Proposta" },
                    ].map((col) => {
                      const colCandidates = filteredCandidates.filter((c) => c.status === col.id);
                      return (
                        <div
                          key={col.id}
                          className="w-64 bg-slate-950/50 border border-slate-800/80 rounded-xl flex flex-col max-h-[500px]"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, col.id)}
                        >
                          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-300">{col.label}</h4>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                              {colCandidates.length}
                            </span>
                          </div>
                          <div className="p-3 flex-grow overflow-y-auto space-y-3">
                            {colCandidates.length === 0 ? (
                              <div className="flex items-center justify-center py-4">
                                <p className="text-[10px] text-slate-600 font-medium">Nenhum candidato</p>
                              </div>
                            ) : (
                              colCandidates.map((c) => (
                                <div
                                  key={c.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, c.id)}
                                  onClick={() => setSelectedCandidate(c)}
                                  className="bg-slate-900 border border-slate-700/50 p-3 rounded-lg hover:border-teal-500/50 transition-colors cursor-grab active:cursor-grabbing group shadow-sm hover:shadow-md"
                                >
                                  <h5 className="text-xs font-bold text-slate-200">{c.name}</h5>
                                  <p className="text-[10px] text-slate-400 mt-1">{c.role}</p>
                                  {c.date && <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.date}</div>}
                                  <div className="flex items-center justify-between mt-3">
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${c.match >= 90 ? 'text-teal-400 bg-teal-500/10' : c.match >= 80 ? 'text-teal-400 bg-teal-500/10' : c.match >= 70 ? 'text-teal-400 bg-teal-500/10' : 'text-slate-400 bg-slate-800/50'}`}>Match: {c.match}%</span>
                                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                      {c.name.split(" ").map(n => n[0]).join("").substring(0,2)}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-display font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-teal-500" />
              Agenda de Hoje
            </h3>
            <div className="space-y-3">
              <div className="border-l-2 border-teal-500 pl-3 py-1">
                <p className="text-xs font-bold text-slate-300">10:30</p>
                <p className="text-sm font-medium text-slate-100 mt-1">Entrevista Técnica</p>
                <p className="text-[11px] text-slate-400">Ana Silveira - UTI Adulto</p>
              </div>
              <div className="border-l-2 border-teal-500 pl-3 py-1">
                <p className="text-xs font-bold text-slate-300">14:00</p>
                <p className="text-sm font-medium text-slate-100 mt-1">Alinhamento de Perfil</p>
                <p className="text-[11px] text-slate-400">Com Gestão - Qualidade</p>
              </div>
              <div className="border-l-2 border-teal-500 pl-3 py-1">
                <p className="text-xs font-bold text-slate-300">15:45</p>
                <p className="text-sm font-medium text-slate-100 mt-1">Entrevista Final</p>
                <p className="text-[11px] text-slate-400">Márcia (RH) - Analista Sênior</p>
              </div>
            </div>
            <button className="w-full mt-4 bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold py-2 rounded-xl hover:bg-slate-800 transition-colors">
              Ver Agenda Completa
            </button>
          </div>

          <div className="bg-teal-500/5 border border-teal-500/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Integração de Software</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Conecte o seu ATS ou LinkedIn para importar candidatos automaticamente e sincronizar status.
                </p>
                <button className="mt-3 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors uppercase tracking-wider">
                  Configurar Integrações
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nova Vaga Modal */}
      {isNewVagaOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                Nova Vaga
              </h3>
              <button onClick={() => setIsNewVagaOpen(false)} className="text-slate-500 hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              setVagas(prev => [{
                id: `V-${1033 + prev.length}`,
                title: newVagaForm.title,
                department: newVagaForm.department,
                type: newVagaForm.type,
                status: "Aberta",
                candidates: 0,
                postedAt: "Agora"
              }, ...prev]);
              setIsNewVagaOpen(false);
              setNewVagaForm({ title: "", department: "", type: "Efetivo" });
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Título da Vaga</label>
                <input 
                  type="text" 
                  value={newVagaForm.title}
                  onChange={e => setNewVagaForm({...newVagaForm, title: e.target.value})}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
                  placeholder="Ex: Enfermeiro(a) Chefe"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Departamento</label>
                <input 
                  type="text" 
                  value={newVagaForm.department}
                  onChange={e => setNewVagaForm({...newVagaForm, department: e.target.value})}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
                  placeholder="Ex: Pediatria"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Tipo de Contrato</label>
                <select 
                  value={newVagaForm.type}
                  onChange={e => setNewVagaForm({...newVagaForm, type: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
                >
                  <option value="Efetivo">Efetivo</option>
                  <option value="Plantonista">Plantonista</option>
                  <option value="PJ">PJ</option>
                  <option value="Temporário">Temporário</option>
                </select>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsNewVagaOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors"
                >
                  Criar Vaga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Profile Slide-over */}
      {selectedCandidate && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
            onClick={() => setSelectedCandidate(null)}
          />
          {/* Slide-over */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/50 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xl font-bold text-slate-300 shadow-inner">
                  {selectedCandidate.name.split(" ").map((n: string) => n[0]).join("").substring(0,2)}
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-100">{selectedCandidate.name}</h3>
                  <p className="text-sm text-teal-400 font-medium">{selectedCandidate.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors p-2 rounded-full hover:bg-slate-800/50"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow space-y-8">
              {/* Status & Match */}
              <div className="flex gap-4">
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Status Atual</span>
                  <span className="text-sm font-semibold text-slate-200">{selectedCandidate.status}</span>
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Score de Match</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${selectedCandidate.match >= 90 ? 'text-teal-400' : selectedCandidate.match >= 80 ? 'text-teal-400' : selectedCandidate.match >= 70 ? 'text-teal-400' : 'text-slate-400'}`}>
                      {selectedCandidate.match}%
                    </span>
                    <TrendingUp className={`w-4 h-4 ${selectedCandidate.match >= 80 ? 'text-teal-500' : 'text-teal-500'}`} />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Contato
                </h4>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300 truncate">{selectedCandidate.name.toLowerCase().replace(" ", ".")}@email.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">(11) 98765-4321</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">São Paulo, SP</span>
                  </div>
                </div>
              </div>

              {/* Competencies */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Competências Atingidas
                </h4>
                <div className="space-y-3">
                  {[
                    { name: 'Experiência Específica', score: 95 },
                    { name: 'Formação Acadêmica', score: 100 },
                    { name: 'Fit Cultural', score: 85 },
                    { name: 'Soft Skills', score: 80 }
                  ].map((comp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{comp.name}</span>
                        <span className="text-teal-400 font-bold">{comp.score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${comp.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <FileBadge className="w-4 h-4" /> Resumo do Currículo
                </h4>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
                  Profissional com mais de 5 anos de experiência na área, com sólido background técnico e vivência em equipes multidisciplinares. Histórico de excelência no atendimento e foco em resultados.
                </div>
              </div>

              {/* Interview Notes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <StickyNote className="w-4 h-4" /> Notas de Entrevista
                </h4>
                <textarea 
                  className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 resize-none transition-all"
                  placeholder="Adicione suas observações sobre o candidato aqui..."
                  defaultValue={selectedCandidate.status === 'Proposta' ? 'Excelente comunicação e perfil técnico. Muita aderência aos nossos valores.' : ''}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md sticky bottom-0">
              <div className="flex gap-3">
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl transition-colors">
                  Avançar Etapa
                </button>
                <button className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                  Fazer Oferta
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
