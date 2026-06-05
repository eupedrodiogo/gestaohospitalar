import { useState, useEffect, FormEvent } from 'react';
import { MessageSquare, Calendar, User, Briefcase, Building2, PencilLine, CheckCircle2, FileText, ArrowLeft, Plus } from 'lucide-react';
import { translations, Language } from '../utils/translations';

interface FeedbackForm {
  id?: string;
  colaboradorNome: string;
  matricula: string;
  cargo: string;
  setor: string;
  gestorName: string;
  data: string;
  tipo: 'elogiar' | 'desenvolver' | 'ambos' | '';
  motivo: string;
  planoAcao: string;
  comentariosColaborador: string;
  assinaturaGestor: string;
  assinaturaColaborador: string;
  status: 'rascunho' | 'aguardando_assinatura' | 'concluido';
  createdAt?: number;
}

interface FeedbackPanelProps {
  currentLang: Language;
  userId: string;
  userName?: string;
  userRole: 'colaborador' | 'lider' | 'rh';
  preSelectedEmployee?: string; // If navigated from "Team" dashboard
}

export default function FeedbackPanel({
  currentLang,
  userId,
  userName = 'Colaborador',
  userRole,
  preSelectedEmployee
}: FeedbackPanelProps) {
  const t = translations[currentLang];
  const [view, setView] = useState<'list' | 'form' | 'view'>('list');
  const [feedbacks, setFeedbacks] = useState<FeedbackForm[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackForm | null>(null);

  // Mock employee data for autocomplete
  const mockEmployees = [
    { nome: "Pedro (Auxiliar)", matricula: "HSF-1001", cargo: "Auxiliar", setor: "Geral" },
    { nome: "Rafael (Coordenador)", matricula: "HSF-1002", cargo: "Coordenador", setor: "Gestão" },
    { nome: "Márcia (RH)", matricula: "HSF-1003", cargo: "RH", setor: "Recursos Humanos" },
    { nome: "João (TI)", matricula: "HSF-1004", cargo: "Analista de Sistemas", setor: "TI" },
    { nome: "Maria Silva", matricula: "HSF-1005", cargo: "Coordenador", setor: "Serviço de Farmácia" },
    { nome: "Dr. João Medeiros", matricula: "HSF-1006", cargo: "Especialista", setor: "Serviço de Pediatria" }
  ];
  const [showEmployeeSuggestions, setShowEmployeeSuggestions] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<FeedbackForm>>({
    colaboradorNome: preSelectedEmployee || '',
    gestorName: userName,
    data: new Date().toISOString().split('T')[0],
    tipo: 'elogiar',
    status: 'rascunho'
  });

  useEffect(() => {
    // Load from localStorage for demo purposes
    const saved = localStorage.getItem('hsf_hr_feedbacks');
    if (saved) {
      setFeedbacks(JSON.parse(saved));
    }
    
    if (preSelectedEmployee) {
      setView('form');
      setFormData(prev => ({ ...prev, colaboradorNome: preSelectedEmployee }));
    }
  }, [preSelectedEmployee]);

  const saveFeedbacks = (newFeedbacks: FeedbackForm[]) => {
    setFeedbacks(newFeedbacks);
    localStorage.setItem('hsf_hr_feedbacks', JSON.stringify(newFeedbacks));
  };

  const handleInputChange = (field: keyof FeedbackForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newFeedback: FeedbackForm = {
      ...formData as FeedbackForm,
      id: selectedFeedback?.id || Math.random().toString(36).substr(2, 9),
      createdAt: selectedFeedback?.createdAt || Date.now(),
      status: formData.assinaturaColaborador ? 'concluido' : 'aguardando_assinatura'
    };

    if (selectedFeedback) {
      saveFeedbacks(feedbacks.map(f => f.id === newFeedback.id ? newFeedback : f));
    } else {
      saveFeedbacks([newFeedback, ...feedbacks]);
    }
    
    setView('list');
    setSelectedFeedback(null);
    setFormData({
      colaboradorNome: '',
      gestorName: userName,
      data: new Date().toISOString().split('T')[0],
      tipo: 'elogiar',
      status: 'rascunho'
    });
  };

  // Filter logic
  const visibleFeedbacks = feedbacks.filter(f => {
    if (userRole === 'rh') return true;
    if (userRole === 'lider') return f.gestorName?.trim().toLowerCase() === userName?.trim().toLowerCase();
    return f.colaboradorNome?.trim().toLowerCase() === userName?.trim().toLowerCase();
  });

  if (view === 'list') {
    return (
      <div className="w-full xl:max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-teal-400" />
              Feedbacks 1-on-1
            </h2>
            <p className="text-slate-400 mt-1">
              {userRole === 'colaborador' 
                ? "Acompanhe os feedbacks e alinhamentos recebidos de sua liderança." 
                : "Gerencie os registros de feedback contínuo da sua equipe."}
            </p>
          </div>
          
          {(userRole === 'lider' || userRole === 'rh') && (
            <button 
              onClick={() => {
                setSelectedFeedback(null);
                setFormData({
                  colaboradorNome: '',
                  gestorName: userName,
                  data: new Date().toISOString().split('T')[0],
                  tipo: 'elogiar',
                  status: 'rascunho'
                });
                setView('form');
              }}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)] flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
            >
              <Plus className="w-4 h-4" />
              Novo Feedback
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleFeedbacks.length === 0 ? (
            <div className="col-span-full card-gradient p-8 rounded-2xl border border-slate-800 text-center glow-border">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Nenhum formulário de feedback encontrado.</p>
            </div>
          ) : (
            visibleFeedbacks.map(f => (
              <div 
                key={f.id} 
                onClick={() => {
                  setSelectedFeedback(f);
                  setFormData(f);
                  setView('form');
                }}
                className="card-gradient p-5 rounded-2xl border border-slate-800 hover:border-teal-500/30 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(45,212,191,0.06)] group glow-border"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border bg-teal-500/10 text-teal-400 border-teal-500/20`}>
                    {f.tipo === 'ambos' ? 'Elogiar & Desenvolver' : f.tipo === 'elogiar' ? 'Elogiar' : f.tipo === 'desenvolver' ? 'Desenvolver' : 'Não Especificado'}
                  </span>
                  <span className="text-[10px] text-slate-500">{new Date(f.data + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                </div>
                <h4 className="font-bold text-slate-200 mb-1">{f.colaboradorNome}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{f.motivo}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${f.status === 'concluido' ? 'bg-teal-400' : 'bg-teal-400'}`} />
                     <span className="text-[10px] uppercase font-bold text-slate-500">
                       {f.status === 'concluido' ? 'Concluído' : 'Aguardando Assinatura'}
                     </span>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  const isReadOnly = view === 'view' || (userRole === 'colaborador' && selectedFeedback?.status === 'concluido');

  return (
    <div className="w-full xl:max-w-5xl mx-auto space-y-6 animate-in slide-in-from-right duration-500 pb-12">
      <button 
        onClick={() => setView('list')}
        className="flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors mb-2 focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-wider">Voltar para Lista</span>
      </button>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950 p-6 md:p-8 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <FileText className="w-48 h-48 text-teal-500 rotate-12" />
          </div>
          <div className="relative z-10 flex-1">
            <h2 className="text-3xl font-display font-bold text-slate-100 flex items-center gap-3">
               Formulário de Feedback
            </h2>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-2xl">
              {userRole === 'colaborador'
                ? "Acompanhe aqui o registro das conversas de 1-on-1 com sua liderança, preencha seus comentários e assine digitalmente os planos de ação colaborativos."
                : "Utilize este documento para registrar as conversas de 1-on-1, destacando pontos fortes (Elogiar) e áreas de melhoria (Desenvolver), definindo planos de ação claros de forma colaborativa."}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Section 1: Colaborador Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
              <User className="w-4 h-4" /> Dados do Colaborador
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome do(a) Colaborador(a)</label>
                <input 
                  type="text" 
                  required
                  disabled={isReadOnly || userRole === 'colaborador'}
                  value={formData.colaboradorNome || ''} 
                  onChange={e => {
                    handleInputChange('colaboradorNome', e.target.value);
                    setShowEmployeeSuggestions(true);
                  }}
                  onFocus={() => setShowEmployeeSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowEmployeeSuggestions(false), 200)}
                  placeholder="Busque por nome ou matrícula..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-teal-500 focus:ring-0 disabled:opacity-75 disabled:cursor-not-allowed" 
                />
                
                {/* Employee Suggestions Dropdown */}
                {showEmployeeSuggestions && !isReadOnly && userRole !== 'colaborador' && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl custom-scrollbar">
                    {mockEmployees
                      .filter(emp => 
                        emp.nome.toLowerCase().includes((formData.colaboradorNome || '').toLowerCase()) ||
                        emp.matricula.toLowerCase().includes((formData.colaboradorNome || '').toLowerCase())
                      )
                      .map((emp, idx) => (
                        <div 
                          key={idx}
                          className="px-4 py-3 hover:bg-slate-800 cursor-pointer border-b border-slate-800/50 last:border-0 transition-colors"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              colaboradorNome: emp.nome,
                              matricula: emp.matricula,
                              cargo: emp.cargo,
                              setor: emp.setor
                            }));
                            setShowEmployeeSuggestions(false);
                          }}
                        >
                          <div className="font-semibold text-sm text-slate-200">{emp.nome}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{emp.matricula} • {emp.cargo}</div>
                        </div>
                      ))}
                    {mockEmployees.filter(emp => 
                      emp.nome.toLowerCase().includes((formData.colaboradorNome || '').toLowerCase()) ||
                      emp.matricula.toLowerCase().includes((formData.colaboradorNome || '').toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-500 italic">
                        Nenhum colaborador encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matrícula</label>
                <input 
                  type="text" 
                  disabled={isReadOnly || userRole === 'colaborador'}
                  value={formData.matricula || ''} 
                  onChange={e => handleInputChange('matricula', e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-teal-500 focus:ring-0 disabled:opacity-75 disabled:cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cargo</label>
                <input 
                  type="text" 
                  disabled={isReadOnly || userRole === 'colaborador'}
                  value={formData.cargo || ''} 
                  onChange={e => handleInputChange('cargo', e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-teal-500 focus:ring-0 disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Setor</label>
                <input 
                  type="text" 
                  disabled={isReadOnly || userRole === 'colaborador'}
                  value={formData.setor || ''} 
                  onChange={e => handleInputChange('setor', e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-teal-500 focus:ring-0 disabled:opacity-75 disabled:cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gestor Imediato</label>
                <input 
                  type="text" 
                  disabled={isReadOnly || userRole === 'colaborador'}
                  value={formData.gestorName || ''} 
                  onChange={e => handleInputChange('gestorName', e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-teal-500 focus:ring-0 disabled:opacity-75 disabled:cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data</label>
                <input 
                  type="date" 
                  required
                  disabled={isReadOnly || userRole === 'colaborador'}
                  value={formData.data || ''} 
                  onChange={e => handleInputChange('data', e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-teal-500 focus:ring-0 disabled:opacity-75 disabled:cursor-not-allowed" 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Feedback Body */}
          <div className="space-y-6 pt-4">
            <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
              <MessageSquare className="w-4 h-4" /> Tipo e Motivo
            </h3>
            
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${(formData.tipo === 'elogiar' || formData.tipo === 'ambos') ? 'border-teal-500 bg-teal-500/10 text-teal-400' : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:bg-slate-900'}`}>
                <input 
                  type="checkbox" 
                  value="elogiar" 
                  disabled={isReadOnly || userRole === 'colaborador'}
                  checked={formData.tipo === 'elogiar' || formData.tipo === 'ambos'} 
                  onChange={() => {
                    const t = formData.tipo;
                    if (t === 'ambos') handleInputChange('tipo', 'desenvolver');
                    else if (t === 'elogiar') handleInputChange('tipo', '');
                    else if (t === 'desenvolver') handleInputChange('tipo', 'ambos');
                    else handleInputChange('tipo', 'elogiar');
                  }}
                  className="hidden" 
                />
                <span className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                   {(formData.tipo === 'elogiar' || formData.tipo === 'ambos') && <CheckCircle2 className="w-5 h-5" />} Elogiar
                </span>
              </label>
              
              <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${(formData.tipo === 'desenvolver' || formData.tipo === 'ambos') ? 'border-teal-500 bg-teal-500/10 text-teal-400' : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:bg-slate-900'}`}>
                <input 
                  type="checkbox" 
                  value="desenvolver" 
                  disabled={isReadOnly || userRole === 'colaborador'}
                  checked={formData.tipo === 'desenvolver' || formData.tipo === 'ambos'} 
                  onChange={() => {
                    const t = formData.tipo;
                    if (t === 'ambos') handleInputChange('tipo', 'elogiar');
                    else if (t === 'desenvolver') handleInputChange('tipo', '');
                    else if (t === 'elogiar') handleInputChange('tipo', 'ambos');
                    else handleInputChange('tipo', 'desenvolver');
                  }}
                  className="hidden" 
                />
                <span className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                  {(formData.tipo === 'desenvolver' || formData.tipo === 'ambos') && <CheckCircle2 className="w-5 h-5" />} Desenvolver
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Motivo</label>
                <textarea 
                  required
                  disabled={isReadOnly || userRole === 'colaborador'}
                  value={formData.motivo || ''} 
                  onChange={e => handleInputChange('motivo', e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-teal-500 focus:ring-0 min-h-[120px] resize-none disabled:opacity-75 disabled:cursor-not-allowed" 
                  placeholder="Descreva a situação, comportamento e impacto observado..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plano de Ação</label>
                <textarea 
                  required
                  disabled={isReadOnly || userRole === 'colaborador'}
                  value={formData.planoAcao || ''} 
                  onChange={e => handleInputChange('planoAcao', e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-teal-500 focus:ring-0 min-h-[120px] resize-none disabled:opacity-75 disabled:cursor-not-allowed" 
                  placeholder="Quais serão os próximos passos para desenvolvimento ou continuidade dos bons resultados?"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Comentários e Assinatura */}
          <div className="space-y-6 pt-4">
            <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
              <PencilLine className="w-4 h-4" /> Comentários e Assinaturas
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comentários do(a) Colaborador(a)</label>
              <textarea 
                disabled={userRole === 'lider' || userRole === 'rh' || !!formData.assinaturaColaborador}
                value={formData.comentariosColaborador || ''} 
                onChange={e => handleInputChange('comentariosColaborador', e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-teal-500 focus:ring-0 min-h-[100px] resize-none disabled:opacity-75 disabled:cursor-not-allowed placeholder:opacity-50" 
                placeholder={userRole === 'colaborador' ? "Deixe aqui seus comentários sobre o feedback recebido..." : "Espaço reservado para o colaborador..."}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
               <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-3">
                 <div className="h-16 flex items-center justify-center w-full border-b border-slate-800/80 mb-2 font-display text-lg text-slate-300">
                    {formData.assinaturaGestor ? formData.assinaturaGestor : <span className="opacity-20 italic">Rubrica Eletrônica</span>}
                 </div>
                 <div className="space-y-1">
                   <p className="text-sm font-bold text-slate-200">Assinatura Gestor(a)</p>
                   {!formData.assinaturaGestor && userRole === 'lider' ? (
                     <button type="button" onClick={() => handleInputChange('assinaturaGestor', userName)} className="text-xs text-teal-400 hover:text-teal-300 font-bold uppercase tracking-wider">Assinar Digitalmente</button>
                   ) : (
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{formData.assinaturaGestor ? "Assinado" : "Pendente"}</p>
                   )}
                 </div>
               </div>

               <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-3">
                 <div className="h-16 flex items-center justify-center w-full border-b border-slate-800/80 mb-2 font-display text-lg text-slate-300">
                    {formData.assinaturaColaborador ? formData.assinaturaColaborador : <span className="opacity-20 italic">Rubrica Eletrônica</span>}
                 </div>
                 <div className="space-y-1">
                   <p className="text-sm font-bold text-slate-200">Assinatura Colaborador(a)</p>
                   {!formData.assinaturaColaborador && userRole === 'colaborador' ? (
                     <button type="button" onClick={() => handleInputChange('assinaturaColaborador', userName)} className="text-xs text-teal-400 hover:text-teal-300 font-bold uppercase tracking-wider">Assinar Digitalmente</button>
                   ) : (
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{formData.assinaturaColaborador ? "Assinado" : "Pendente"}</p>
                   )}
                 </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Actions Footer */}
        {!isReadOnly && (
          <div className="bg-slate-950 p-6 md:px-8 border-t border-slate-800 flex justify-end gap-3">
             <button 
                type="button"
                onClick={() => setView('list')}
                className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-colors"
             >
               Cancelar
             </button>
             <button 
                type="submit"
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)] flex items-center justify-center uppercase tracking-wider text-sm"
             >
               Salvar Feedback
             </button>
          </div>
        )}
      </form>
    </div>
  );
}

