import React, { useState, useEffect } from 'react';
import { Shield, FileText, CheckCircle, Search, Calendar, UserPlus, AlertTriangle, Settings, Plus, Trash2, GripVertical, Save } from 'lucide-react';

interface SesmtPanelProps {
  userRole: string;
  userName: string;
}

export default function SesmtPanel({ userRole, userName }: SesmtPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"registros" | "formulario">("registros");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newColaborador, setNewColaborador] = useState("");
  const [newDepartamento, setNewDepartamento] = useState("Geral");

  const [formFields, setFormFields] = useState([
    { id: '1', title: 'Como você avalia seu nível de estresse atual (1-5)?', type: 'scale', required: true },
    { id: '2', title: 'Como está o seu relacionamento com a equipe e gestão? (1-5)', type: 'scale', required: true },
    { id: '3', title: 'O seu posto de trabalho possui mobiliário confortável e ergonômico?', type: 'boolean', required: true },
    { id: '4', title: 'Você sente alguma dor física recorrente durante o trabalho?', type: 'boolean', required: true },
    { id: '5', title: 'Algum relato adicional sobre sua saúde física ou mental?', type: 'text', required: false },
  ]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const loadAssessments = () => {
    const stored = localStorage.getItem("hsf_psycho_assessments");
    if (stored) return JSON.parse(stored);
    return [
      { id: 1, name: "Pedro (Auxiliar)", department: "Geral", date: "29/05/2026", status: "Aguardando", risk: "Não avaliado" },
      { id: 2, name: "Rafael (Coordenador)", department: "Enfermagem", date: "15/10/2026", status: "Em Análise", risk: "Baixo" },
      { id: 3, name: "Márcia (RH)", department: "Medicina", date: "12/10/2026", status: "Concluído", risk: "Médio" },
      { id: 4, name: "João (TI)", department: "Administrativo", date: "10/10/2026", status: "Aguardando", risk: "Não avaliado" }
    ];
  };

  const [assessments, setAssessments] = useState<any[]>(loadAssessments);

  useEffect(() => {
    localStorage.setItem("hsf_psycho_assessments", JSON.stringify(assessments));
  }, [assessments]);

  // Handle storage mock sync
  useEffect(() => {
    const handleStorage = () => setAssessments(loadAssessments());
    window.addEventListener('storage', handleStorage);
    // Custom event to trigger re-render on same window
    window.addEventListener('update_psycho', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('update_psycho', handleStorage);
    };
  }, []);

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColaborador.trim()) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);

    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const newAssessment = {
      id: Date.now(),
      name: newColaborador,
      department: newDepartamento,
      date: dateStr,
      status: "Aguardando",
      risk: "Não avaliado"
    };

    setAssessments([newAssessment, ...assessments]);
    setIsNewModalOpen(false);
    setNewColaborador("");
    setNewDepartamento("Geral");
  };

  const pendingAssessments = assessments.filter(a => a.name === userName && a.status === "Aguardando");
  const [formValues, setFormValues] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    setIsSubmitting(true);
    
    setTimeout(() => {
      let risk = "Baixo";
      if (formValues['1'] >= 4 || formValues['2'] === 'Sim') risk = "Médio";
      if (formValues['1'] === 5 && formValues['2'] === 'Sim') risk = "Alto";

      const updatedAssessments = assessments.map(a => 
        a.id === selectedAssessment?.id ? { ...a, status: "Em Análise", risk, answers: formValues } : a
      );
      
      localStorage.setItem("hsf_psycho_assessments", JSON.stringify(updatedAssessments));
      setAssessments(updatedAssessments);
      window.dispatchEvent(new Event("update_psycho"));
      
      setIsSubmitting(false);
      setSelectedAssessment(null);
    }, 1000);
  };

  if (!["rh", "lider", "colaborador", "sesmt"].includes(userRole)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-slate-100">
        <Shield className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold font-display mb-2">Acesso Restrito</h2>
        <p className="text-slate-400 font-sans max-w-md">
          O módulo de Avaliação de Saúde Ocupacional é restrito a profissionais autorizados devido à confidencialidade das informações.
        </p>
      </div>
    );
  }

  if (userRole === "colaborador") {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-950 font-sans text-slate-100 p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              Saúde Ocupacional (SESMT)
            </h2>
            <p className="text-slate-400 mt-2">
              Acompanhamento de bem-estar e saúde mental para a base de 1.300 colaboradores do HSF.
            </p>
          </div>

          {pendingAssessments.length > 0 ? (
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6 md:p-8 animate-in zoom-in-95">
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0 mt-1 md:mt-0">
                    <AlertTriangle className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-teal-400 font-bold text-lg">Ação Necessária</h3>
                    <p className="text-teal-400/80 mt-1">Você tem {pendingAssessments.length} formulário(s) pendente(s) aguardando sua resposta.</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                    setSelectedAssessment(pendingAssessments[0]);
                  }}
                  className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border border-teal-500/50 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap active:scale-95 w-full md:w-auto text-center shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  Responder Formulário
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Tudo em dia!</h3>
              <p className="text-slate-400 max-w-md">
                Você não possui avaliações pendentes. Sua saúde e bem-estar são prioridade.
              </p>
            </div>
          )}
        </div>

        {selectedAssessment && pendingAssessments.find(a => a.id === selectedAssessment.id) && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-slate-100">Avaliação de Saúde Ocupacional</h3>
                    <p className="text-sm text-slate-400">Pendente desde {selectedAssessment.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                    setSelectedAssessment(null);
                  }}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-2"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmitAssessment} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  <p className="text-sm text-slate-300 border-l-4 border-purple-500 pl-4 py-1 bg-slate-800/30 rounded-r-lg">
                    Suas respostas são confidenciais e tratadas pela equipe de Recursos Humanos para apoiar seu bem-estar na instituição.
                  </p>

                  <div className="space-y-5">
                    {formFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-bold text-slate-200">
                          {field.title} {field.required && <span className="text-teal-400">*</span>}
                        </label>
                        
                        {field.type === 'scale' && (
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setFormValues({...formValues, [field.id]: num})}
                                className={`flex-1 py-3 rounded-lg border font-bold transition-colors ${
                                  formValues[field.id] === num 
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {field.type === 'boolean' && (
                          <div className="flex gap-2">
                            {['Sim', 'Não'].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setFormValues({...formValues, [field.id]: opt})}
                                className={`flex-1 py-3 rounded-lg border font-bold transition-colors ${
                                  formValues[field.id] === opt 
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {field.type === 'text' && (
                          <textarea
                            value={formValues[field.id] || ''}
                            onChange={(e) => setFormValues({...formValues, [field.id]: e.target.value})}
                            required={field.required}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors min-h-[100px] resize-none"
                            placeholder="Digite sua resposta..."
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3 shrink-0">
                  <button 
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                      setSelectedAssessment(null);
                    }}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || formFields.filter(f => f.required).some(f => !formValues[f.id])}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                      isSubmitting || formFields.filter(f => f.required).some(f => !formValues[f.id])
                        ? 'bg-purple-600/50 text-white/50 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-95 shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin shrink-0"/>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Enviar Respostas
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 font-sans text-slate-100 animate-in fade-in duration-500">
      <div className="flex-none p-6 md:p-8 bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold font-display text-slate-50">Avaliação de Saúde Ocupacional</h1>
            </div>
            <p className="text-slate-400 text-sm">Gestão de relatórios psicossociais e bem-estar do colaborador.</p>
          </div>
          <div className="flex bg-slate-950 rounded-xl p-1 shadow-inner border border-slate-800">
            <button
              onClick={() => setActiveTab("registros")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === "registros" ? "bg-purple-600 text-white shadow-md shadow-purple-900/20" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Registros
            </button>
            <button
              onClick={() => setActiveTab("formulario")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === "formulario" ? "bg-purple-600 text-white shadow-md shadow-purple-900/20" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Settings className="w-4 h-4" />
              Gestão do Formulário
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {activeTab === "registros" ? (
            <>
              {/* Dashboard Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h3 className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider line-clamp-2 leading-tight">Concluídas<br className="sm:hidden" />este mês</h3>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-slate-100 mt-1 sm:mt-2">24</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h3 className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider line-clamp-2 leading-tight">Agendadas</h3>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-slate-100 mt-1 sm:mt-2">8</p>
                </div>
                <div className="col-span-2 md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h3 className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider line-clamp-2 leading-tight">Atenção<br className="sm:hidden" />Requerida</h3>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-slate-100 mt-1 sm:mt-2">3</p>
                </div>
              </div>

              {/* List Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h3 className="font-semibold font-display text-lg">Registros Recentes</h3>
                  <div className="flex w-full sm:w-auto items-center gap-3">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Buscar colaborador..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                        setIsNewModalOpen(true);
                      }}
                      className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold py-2 px-3 sm:px-4 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-200 whitespace-nowrap"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Nova Avaliação</span>
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Colaborador</th>
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Risco</th>
                        <th className="px-6 py-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {assessments.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-200">{item.name}</div>
                            <div className="text-[11px] text-slate-500">{item.department}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{item.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              item.status === 'Concluído' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                              item.status === 'Em Análise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                              'bg-teal-500/10 text-teal-400 border-teal-500/20'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                              item.risk === 'Alto' ? 'text-teal-400' :
                              item.risk === 'Médio' ? 'text-teal-400' :
                              item.risk === 'Baixo' ? 'text-teal-400' :
                              'text-slate-500'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                item.risk === 'Alto' ? 'bg-teal-400' :
                                item.risk === 'Médio' ? 'bg-teal-400' :
                                item.risk === 'Baixo' ? 'bg-teal-400' :
                                'bg-slate-500'
                              }`} />
                              {item.risk}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => setSelectedAssessment(item)}
                              className="text-purple-400 hover:text-purple-300 active:scale-95 text-[11px] font-bold uppercase tracking-wider bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg transition-all duration-200"
                            >
                              Acessar Prontuário
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-in fade-in duration-300">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold font-display text-lg">Construtor de Formulário</h3>
                  <p className="text-sm text-slate-400 mt-1">Defina as perguntas que compõem a avaliação ergonômica e psicossocial de todos os colaboradores.</p>
                </div>
                <button
                  onClick={() => {
                    const newField = {
                      id: Date.now().toString(),
                      title: "Nova Pergunta",
                      type: "text",
                      required: false
                    };
                    setFormFields([...formFields, newField]);
                  }}
                  className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-sm font-bold py-2 px-4 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-200 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mt-px" />
                  Adicionar
                </button>
              </div>

              <div className="p-6 space-y-4">
                {formFields.map((field, index) => (
                  <div key={field.id} className="relative group bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-start gap-4 transition-all hover:bg-slate-800/60 hover:border-slate-600">
                    <div className="hidden md:flex cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 p-2 -ml-2">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                          ENUNCIADO DA PERGUNTA {index + 1}
                        </label>
                        <input
                          type="text"
                          value={field.title}
                          onChange={(e) => {
                            const newFields = [...formFields];
                            newFields[index].title = e.target.value;
                            setFormFields(newFields);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="Digite aqui o título da pergunta..."
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">TIPO DE RESPOSTA</label>
                          <div className="relative">
                            <select
                              value={field.type}
                              onChange={(e) => {
                                const newFields = [...formFields];
                                newFields[index].type = e.target.value;
                                setFormFields(newFields);
                              }}
                              className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-purple-500 transition-colors"
                            >
                              <option value="text">Texto Livre / Dissertativa</option>
                              <option value="scale">Escala Numérica (1 a 5)</option>
                              <option value="boolean">Sim / Não</option>
                            </select>
                            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">▼</span>
                          </div>
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer h-[42px] px-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => {
                                const newFields = [...formFields];
                                newFields[index].required = e.target.checked;
                                setFormFields(newFields);
                              }}
                              className="w-4 h-4 rounded text-purple-600 bg-slate-950 border-slate-700 focus:ring-purple-600 focus:ring-offset-slate-900"
                            />
                            Obrigatória
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-end gap-2 shrink-0 md:pt-6">
                      <button 
                        onClick={() => {
                          const newFields = formFields.filter((_, i) => i !== index);
                          setFormFields(newFields);
                        }}
                        className="p-2 text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 active:scale-95 rounded-lg transition-all duration-200"
                        title="Remover Campo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-800 bg-slate-900 flex items-center justify-between rounded-b-2xl">
                {saveSuccess ? (
                  <div className="flex items-center gap-2 text-teal-400 text-sm font-bold animate-in fade-in slide-in-from-left-2">
                    <CheckCircle className="w-5 h-5" />
                    Formulário salvo com sucesso!
                  </div>
                ) : (
                  <div></div>
                )}
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-200 ${
                    isSaving 
                      ? 'bg-purple-600/50 text-white/50 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-500 active:scale-95 text-white'
                  }`}
                >
                  {isSaving ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Salvando...' : 'Salvar Alterações do Formulário'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <form onSubmit={handleCreateAssessment}>
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-slate-100">Nova Avaliação</h3>
                    <p className="text-sm text-slate-400">Enviar formulário para colaborador</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5 hidden" />
                  ✕
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    Nome do Colaborador
                  </label>
                  <input
                    type="text"
                    required
                    value={newColaborador}
                    onChange={(e) => setNewColaborador(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Ex: Carlos Silva"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    Departamento
                  </label>
                  <div className="relative">
                    <select
                      value={newDepartamento}
                      onChange={(e) => setNewDepartamento(e.target.value)}
                      className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="Geral">Geral</option>
                      <option value="Enfermagem">Enfermagem</option>
                      <option value="Medicina">Medicina</option>
                      <option value="Limpeza">Limpeza</option>
                      <option value="Administrativo">Administrativo</option>
                    </select>
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">▼</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 active:scale-95 text-white transition-all duration-200 flex items-center gap-2"
                >
                  Disparar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAssessment && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-slate-100">Prontuário Médico & Ergonômico</h3>
                  <p className="text-sm text-slate-400">{selectedAssessment.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAssessment(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors p-2"
              >
                <Trash2 className="w-5 h-5 hidden" /> {/* Hidden icon for sizing */}
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Data da Avaliação</p>
                  <p className="font-medium text-slate-200">{selectedAssessment.date}</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nível de Risco</p>
                  <p className={`font-medium ${
                    selectedAssessment.risk === 'Alto' ? 'text-teal-400' :
                    selectedAssessment.risk === 'Médio' ? 'text-teal-400' :
                    selectedAssessment.risk === 'Baixo' ? 'text-teal-400' :
                    'text-slate-400'
                  }`}>{selectedAssessment.risk}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">Respostas do Colaborador</h4>
                
                <div className="space-y-5">
                  {formFields.map(field => (
                    <div key={field.id}>
                      <p className="text-xs font-medium text-slate-400 mb-1.5">{field.id}. {field.title}</p>
                      <p className="text-sm text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
                        {selectedAssessment.answers && selectedAssessment.answers[field.id] 
                          ? selectedAssessment.answers[field.id] 
                          : 'Aguardando resposta...'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedAssessment(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all duration-200"
              >
                Fechar
              </button>
              <button 
                onClick={() => alert('Consulta agendada!')}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 active:scale-95 text-white transition-all duration-200 flex items-center gap-2"
              >
                Agendar Acompanhamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
