import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  Search, 
  Calendar, 
  AlertTriangle, 
  Plus, 
  Scale, 
  Lock, 
  Eye, 
  EyeOff, 
  Gavel, 
  DollarSign, 
  TrendingUp, 
  Check, 
  Briefcase, 
  X, 
  ChevronRight, 
  FileCheck, 
  AlertCircle, 
  RotateCcw,
  BookOpen,
  Filter,
  Users
} from 'lucide-react';

interface JuridicoPanelProps {
  userRole: string;
  userName: string;
}

interface Contrato {
  id: string;
  titulo: string;
  tipo: 'Fornecedor' | 'Prestação de Serviço' | 'Médico Credenciado' | 'Acordo de Confidencialidade';
  valor: number;
  dataRevisao: string;
  status: 'Pendente' | 'Sob Revisão' | 'Aprovado' | 'Impasse Legal';
  risco: 'Baixo' | 'Médio' | 'Alto';
  partes: string;
  descricao: string;
  parecerLegal?: string;
  parecerAutor?: string;
}

interface Denuncia {
  id: string;
  protocolo: string;
  dataCriacao: string;
  canal: 'Web' | 'E-mail' | 'Urna Física';
  assunto: 'Assédio / Conduta' | 'Desvio de Insumos' | 'Fraude em Plantão' | 'Vazamento de Dados';
  descricao: string;
  gravidade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  status: 'Nova' | 'Investigação' | 'Comitê de Ética' | 'Arquivada' | 'Medida Aplicada';
  investigacaoPassos: { id: string; label: string; done: boolean }[];
  historicoNotas: { data: string; autor: string; nota: string }[];
}

interface ProcessoJudicial {
  id: string;
  numero: string;
  autor: string;
  tipo: 'Trabalhista' | 'Responsabilidade Civil' | 'Regulatório' | 'Contratos';
  valorCausa: number;
  riscoPerda: 'Remota' | 'Possível' | 'Provável';
  status: 'Início' | 'Audiência Desguitada' | 'Fase de Recursos' | 'Execução';
  proximaAudiencia?: string;
  comentarioAdvogado: string;
}

export default function JuridicoPanel({ userRole, userName }: JuridicoPanelProps) {
  const [activeTab, setActiveTab] = useState<'contratos' | 'compliance' | 'processos' | 'conformidade' | 'canal_etico'>('contratos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // --- 1. CONTRATOS STATE & MOCKS ---
  const [contratos, setContratos] = useState<Contrato[]>(() => {
    const saved = localStorage.getItem('hsf_juridico_contratos');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'CON-2026-004',
        titulo: 'Aquisição de Tomógrafo de Alta Resolução - Philips Healthcare',
        tipo: 'Fornecedor',
        valor: 1450000,
        dataRevisao: '28/05/2026',
        status: 'Pendente',
        risco: 'Médio',
        partes: 'HSF e Philips Equipamentos Hospitalares',
        descricao: 'Instalação e manutenção corretiva sob regime de comodato financeiro vinculando volume de exames mensais.',
      },
      {
        id: 'CON-2026-005',
        titulo: 'Credenciamento de Equipe Regional de Anestesiologia S/S',
        tipo: 'Prestação de Serviço',
        valor: 320000,
        dataRevisao: '12/04/2026',
        status: 'Aprovado',
        risco: 'Baixo',
        partes: 'HSF e Anestesia-Pro S/S',
        descricao: 'Prestação exclusiva de plantões anestésicos para o centro cirúrgico do pronto-socorro.',
        parecerLegal: 'Documentação nos termos previstos pelo Conselho Federal de Medicina. Contrato livre de cláusulas abusivas.',
        parecerAutor: 'Dra. Luana (Jurídico)',
      },
      {
        id: 'CON-2026-006',
        titulo: 'Termo de Confidencialidade e Guarda de Dados com Terceiro de TI',
        tipo: 'Acordo de Confidencialidade',
        valor: 0,
        dataRevisao: '01/06/2026',
        status: 'Sob Revisão',
        risco: 'Alto',
        partes: 'HSF e Tech Cloud Integradores Ltda',
        descricao: 'Transferência de controle de dados pessoais e de prontuários médicos para a nuvem pública.',
      },
    ];
  });

  // --- 2. COMPLIANCE DENUNCIAS STATE & MOCKS ---
  const [denuncias, setDenuncias] = useState<Denuncia[]>(() => {
    const saved = localStorage.getItem('hsf_juridico_denuncias');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'DEN-491',
        protocolo: 'HSF-2026-99321',
        dataCriacao: '30/05/2026',
        canal: 'Web',
        assunto: 'Assédio / Conduta',
        descricao: 'Denúncia anônima referente a assédio moral no setor de enfermaria do 4º andar (unidade coronariana). Liderança cobrando escalas extras fora do regime regular sem aviso prévio e com tom desrespeitoso.',
        gravidade: 'Critíca',
        status: 'Investigação',
        investigacaoPassos: [
          { id: '1', label: 'Triagem e validação do relato', done: true },
          { id: '2', label: 'Coleta de depoimentos testemunhais em sigilo', done: true },
          { id: '3', label: 'Entrevista formal com a coordenação envolvida', done: false },
          { id: '4', label: 'Apresentação do relatório ao Comitê de Ética', done: false },
        ],
        historicoNotas: [
          { data: '30/05/2026 14:00', autor: 'Sistema (Compliance)', nota: 'Relato recebido via portal criptografado.' },
          { data: '01/06/2026 09:30', autor: 'Comitê de Compliance', nota: 'Canal validado. Agendada ouvida de colaboradores da escala de plantão do setor de anestesia e cardiologia.' },
        ],
      },
      {
        id: 'DEN-492',
        protocolo: 'HSF-2026-99104',
        dataCriacao: '25/05/2026',
        canal: 'Urna Física',
        assunto: 'Desvio de Insumos',
        descricao: 'Insumos cirúrgicos estariam sendo requisitados acima da média histórica para o bloco B e descartados ou guardados em armários sem registro interno no sistema de almoxarifado.',
        gravidade: 'Alta',
        status: 'Comitê de Ética',
        investigacaoPassos: [
          { id: '1', label: 'Triagem e validação do relato', done: true },
          { id: '2', label: 'Coleta de depoimentos testemunhais em sigilo', done: true },
          { id: '3', label: 'Entrevista formal com a coordenação envolvida', done: true },
          { id: '4', label: 'Apresentação do relatório ao Comitê de Ética', done: true },
          { id: '5', label: 'Aplicação de medida corretiva disciplinar', done: false },
        ],
        historicoNotas: [
          { data: '25/05/2026', autor: 'Sistema (Compliance)', nota: 'Relato coletado no posto físico de auditoria.' },
          { data: '28/05/2026', autor: 'Dr. Lucas (Compliance)', nota: 'Cruzamento com relatórios de custos confirmou anomalia em seringas de alta precisão. Liderança imediata notificada com plano de rastreabilidade diária.' },
        ],
      },
    ];
  });

  // --- 3. PROCESSOS JUDICIAIS MOCKS ---
  const [processos, setProcessos] = useState<ProcessoJudicial[]>(() => {
    const saved = localStorage.getItem('hsf_juridico_processos');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'PROC-1',
        numero: '0010243-55.2026.5.02.0001',
        autor: 'Sindicato de Enfermagem de SP vs HSF',
        tipo: 'Trabalhista',
        valorCausa: 420000,
        riscoPerda: 'Possível',
        status: 'Fase de Recursos',
        comentarioAdvogado: 'Divergência quanto aos índices de insalubridade e horas extras pré-contratadas no período pré-pandêmico. Documentações de holerites já anexadas ao processo.',
      },
      {
        id: 'PROC-2',
        numero: '1004592-88.2025.8.26.0100',
        autor: 'Espólio de Paciente da Cirurgia Ortopédica',
        tipo: 'Responsabilidade Civil',
        valorCausa: 850000,
        riscoPerda: 'Remota',
        status: 'Audiência Desguitada',
        proximaAudiencia: '14/10/2026 14:30',
        comentarioAdvogado: 'Perícia preliminar do CRM indicou inexistência de erro médico. O paciente possuía histórico gravíssimo de comorbidades prévias.',
      },
      {
        id: 'PROC-3',
        numero: '0901242-12.2026.8.26.5002',
        autor: 'Distribuidora Multilaser Pro Hospitalar',
        tipo: 'Contratos',
        valorCausa: 155000,
        riscoPerda: 'Provável',
        status: 'Início',
        comentarioAdvogado: 'Cobrança por atraso justificado no fornecimento de kits de teste de glicose. Houve quebra contratual pela fabricante de matéria-prima, estamos discutindo dolo.',
      },
    ];
  });

  // --- 4. CONFORMIDADE CHECKLISTS ---
  const [checklistCompliance, setChecklistCompliance] = useState([
    { id: '1', item: 'Adequação LGPD de Prontuários (Acesso rastreado e temporário)', status: true, setor: 'TI / Diretoria' },
    { id: '2', item: 'Termos de Consentimento Informado (TCLE) assinados e anexados nos exames', status: true, setor: 'SADT / Enfermagem' },
    { id: '3', item: 'Verificação periódica de certidões e débitos tributários', status: true, setor: 'Administrativo' },
    { id: '4', item: 'Check de conformidade de EPIs e licenças de descarte biológico', status: false, setor: 'Segurança / SESMT' },
    { id: '5', item: 'Homologação e auditoria de contratos de terceirizados médicos', status: false, setor: 'SADT / Financeiro' },
  ]);

  // Persistir Dados
  useEffect(() => {
    localStorage.setItem('hsf_juridico_contratos', JSON.stringify(contratos));
  }, [contratos]);

  useEffect(() => {
    localStorage.setItem('hsf_juridico_denuncias', JSON.stringify(denuncias));
  }, [denuncias]);

  useEffect(() => {
    localStorage.setItem('hsf_juridico_processos', JSON.stringify(processos));
  }, [processos]);


  // MODAIS & INTERATION STATE
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
  const [legalResponse, setLegalResponse] = useState('');
  const [novaNotaCompliance, setNovaNotaCompliance] = useState('');
  const [showDenunciaSecret, setShowDenunciaSecret] = useState(false);
  const [isNewProcessoOpen, setIsNewProcessoOpen] = useState(false);

  // New Processo Form State
  const [newNum, setNewNum] = useState('');
  const [newAutor, setNewAutor] = useState('');
  const [newTipo, setNewTipo] = useState<'Trabalhista' | 'Responsabilidade Civil' | 'Regulatório' | 'Contratos'>('Trabalhista');
  const [newValor, setNewValor] = useState('');
  const [newRisco, setNewRisco] = useState<'Remota' | 'Possível' | 'Provável'>('Possível');
  const [newComentario, setNewComentario] = useState('');

  // Canal Etico Form State
  const [eticoNome, setEticoNome] = useState('');
  const [eticoTelefone, setEticoTelefone] = useState('');
  const [eticoEmail, setEticoEmail] = useState('');
  const [eticoRelacao, setEticoRelacao] = useState('');
  const [eticoClassificacao, setEticoClassificacao] = useState('');
  const [eticoLocal, setEticoLocal] = useState('');
  const [eticoAconteceu, setEticoAconteceu] = useState('');
  const [eticoQuem, setEticoQuem] = useState('');
  const [eticoInformacoes, setEticoInformacoes] = useState('');
  const [isEticoSubmitting, setIsEticoSubmitting] = useState(false);
  const [eticoSuccess, setEticoSuccess] = useState(false);

  const handleSubmitEtico = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eticoRelacao || !eticoClassificacao || !eticoLocal || !eticoAconteceu || !eticoQuem) {
      alert("Por favor preencha os campos obrigatórios (*).");
      return;
    }
    setIsEticoSubmitting(true);
    setTimeout(() => {
      setIsEticoSubmitting(false);
      setEticoSuccess(true);
      setEticoNome('');
      setEticoTelefone('');
      setEticoEmail('');
      setEticoRelacao('');
      setEticoClassificacao('');
      setEticoLocal('');
      setEticoAconteceu('');
      setEticoQuem('');
      setEticoInformacoes('');
    }, 1500);
  };

  // SENSITIVE ACCESS CHECK (ONLY COMPLIANCE / TI / DIRECTORS)
  const isAuthorized = ['rh', 'ti', 'diretor_administrativo', 'diretor_geral', 'juridico'].includes(userRole) || userName.toLowerCase().includes('lucas') || userName.toLowerCase().includes('advogado');

  // Emitir parecer em contrato
  const handleGravarParecer = () => {
    if (!selectedContrato) return;
    const novosContratos = contratos.map(c => {
      if (c.id === selectedContrato.id) {
        return {
          ...c,
          status: 'Aprovado' as const,
          parecerLegal: legalResponse || 'Parecer de adequação legal emitido com validade operacional imediata.',
          parecerAutor: userName,
        };
      }
      return c;
    });
    setContratos(novosContratos);
    setSelectedContrato(null);
    setLegalResponse('');
    
    // Notify
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 20, 40]);
    }
  };

  // Rejeitar contrato por inadequação ou impasse
  const handleReprovarContrato = () => {
    if (!selectedContrato) return;
    const novosContratos = contratos.map(c => {
      if (c.id === selectedContrato.id) {
        return {
          ...c,
          status: 'Impasse Legal' as const,
          parecerLegal: legalResponse || 'REJEITADO: Inadequação com as políticas estritas de proteção ao sigilo do paciente ou problemas de garantia jurídica.',
          parecerAutor: userName,
        };
      }
      return c;
    });
    setContratos(novosContratos);
    setSelectedContrato(null);
    setLegalResponse('');
  };

  // Compliance: Toggle item investigação
  const handleToggleInvestigacaoCheck = (denunciaId: string, passoId: string) => {
    const novasDenuncias = denuncias.map(d => {
      if (d.id === denunciaId) {
        const novosPassos = d.investigacaoPassos.map(p => {
          if (p.id === passoId) return { ...p, done: !p.done };
          return p;
        });
        
        // Se todos estiverem ok, avança status para "Comitê de Ética" ou "Medida Aplicada"
        const conclusos = novosPassos.filter(p => p.done).length;
        let novoStatus = d.status;
        if (conclusos === novosPassos.length) {
          novoStatus = 'Medida Aplicada';
        } else if (conclusos >= novosPassos.length - 1) {
          novoStatus = 'Comitê de Ética';
        } else {
          novoStatus = 'Investigação';
        }

        return { ...d, investigacaoPassos: novosPassos, status: novoStatus };
      }
      return d;
    });
    setDenuncias(novasDenuncias);
    // Atualiza o objeto selecionado
    const att = novasDenuncias.find(d => d.id === denunciaId);
    if (att) setSelectedDenuncia(att);
  };

  // Adicionar nota compliance
  const handleAddComplianceNota = () => {
    if (!selectedDenuncia || !novaNotaCompliance.trim()) return;
    const hoje = new Date();
    const dataFormatada = `${hoje.getDate()}/${hoje.getMonth() + 1}/${hoje.getFullYear()} ${hoje.getHours().toString().padStart(2, '0')}:${hoje.getMinutes().toString().padStart(2, '0')}`;
    
    const novasDenuncias = denuncias.map(d => {
      if (d.id === selectedDenuncia.id) {
        return {
          ...d,
          historicoNotas: [
            ...d.historicoNotas,
            { data: dataFormatada, autor: userName, nota: novaNotaCompliance }
          ]
        };
      }
      return d;
    });
    setDenuncias(novasDenuncias);
    setNovaNotaCompliance('');
    const att = novasDenuncias.find(d => d.id === selectedDenuncia.id);
    if (att) setSelectedDenuncia(att);
  };

  // Criar Processo Judicial
  const handleCriarProcesso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNum || !newAutor || !newValor) return;

    const novoProc: ProcessoJudicial = {
      id: `PROC-${Date.now()}`,
      numero: newNum,
      autor: newAutor,
      tipo: newTipo,
      valorCausa: Number(newValor),
      riscoPerda: newRisco,
      status: 'Início',
      comentarioAdvogado: newComentario || 'Análise preliminar em andamento junto aos escritórios parceiros do HSF.',
    };

    setProcessos([novoProc, ...processos]);
    setIsNewProcessoOpen(false);
    setNewNum('');
    setNewAutor('');
    setNewValor('');
    setNewComentario('');
  };

  // Obter % de Conformidade Regulatória Geral
  const conformidadePorcentagem = Math.round(
    (checklistCompliance.filter(c => c.status).length / checklistCompliance.length) * 100
  );

  // Filtragem
  const contratosFiltrados = contratos.filter(c => {
    const matchesSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || c.partes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFiltro = filtroTipo === 'Todos' || c.tipo === filtroTipo;
    return matchesSearch && matchesFiltro;
  });

  const processosFiltrados = processos.filter(p => {
    return p.numero.includes(searchTerm) || p.autor.toLowerCase().includes(searchTerm.toLowerCase()) || p.tipo.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!isAuthorized) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-slate-100 min-h-[60vh]">
        <div className="w-[84px] h-[84px] bg-[#461D15]/30 border border-[#8D5B4F]/40 flex items-center justify-center rounded-3xl mb-4 text-[#A78177] shadow-[0_4px_20px_rgba(70,29,21,0.2)]">
          <Lock className="w-10 h-10 text-[#A78177] animate-pulse" />
        </div>
        <h2 className="text-xl font-bold font-display text-slate-50 mb-2">Painel Jurídico & Compliance Premium</h2>
        <p className="text-slate-400 font-sans max-w-md text-xs leading-relaxed">
          Este módulo lida com auditorias regulatórias, litígios hospitalares e queixas anônimas confidenciais sob a tutela do **SESMT e Controladoria Geral do HSF**.
        </p>
        <p className="text-xs text-[#8D5B4F] mt-3 bg-[#461D15]/10 border border-[#693A32]/25 px-4 py-2 rounded-xl">
          Utilize as abas de simulação no topo para acessar como **Dr. Lucas**, **Márcia (RH)** ou **Diretoria Geral** para liberar visualizações.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Banner Principal - Design System HSF */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#461D15] via-[#461D15] to-[#693A32] border-b border-[#693A32]/60 p-6 sm:p-8 shrink-0">
        <div className="absolute right-0 top-0 opacity-10 font-black text-9xl tracking-tighter select-none text-white font-display pointer-events-none">
          LAW
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-md">
              <Scale className="w-7 h-7 text-[#A78177]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
                Jurídico & Compliance
                <span className="bg-[#A78177]/20 border border-[#A78177]/30 text-white font-mono px-3 py-0.5 rounded-full text-[10px] tracking-widest uppercase">
                  PREMIUM CONTROL
                </span>
              </h1>
              <p className="text-slate-300 text-xs mt-1 max-w-2xl">
                Controle de governança, conformidades regulatórias, contencioso contratual, proteção corporativa e canal direto de ouvidoria blindada do HSF.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-950/40 border border-white/5 p-3 rounded-2xl backdrop-blur-md self-start md:self-auto">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Conformidade HSF</div>
              <div className="font-bold text-lg text-white tracking-tight">{conformidadePorcentagem}% Conclusão</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#693A32] to-[#8D5B4F] flex items-center justify-center font-bold text-white text-sm shadow-[0_0_12px_rgba(105,58,50,0.4)] border border-white/10">
              {conformidadePorcentagem}%
            </div>
          </div>
        </div>

        {/* Abas Premium */}
        <div className="flex gap-1.5 mt-6 border-b border-white/5 -mb-6 pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'canal_etico', label: 'Canal Ético', count: null, icon: Lock },
            { id: 'contratos', label: 'Contratos & Pareceres', count: contratos.filter(c=>c.status==='Pendente').length, icon: FileText },
            { id: 'compliance', label: 'Integridade & Compliance', count: denuncias.filter(d=>d.status==='Nova').length, icon: Shield },
            { id: 'processos', label: 'Litígios & Processos', count: processos.length, icon: Gavel },
            { id: 'conformidade', label: 'Checklist Regulatório', count: null, icon: CheckCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 border border-[#693A32] text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#A78177]' : 'text-slate-400'}`} />
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* TAB CONTROLS SEARCH & FILTERS */}
        {activeTab !== 'conformidade' && activeTab !== 'canal_etico' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder={activeTab === 'contratos' ? 'Buscar nos termos, partes e documentos...' : activeTab === 'compliance' ? 'Buscar incidentes...' : 'Pesquisar processos...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-10 py-2.5 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#693A32] transition-colors"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'contratos' && (
                <div className="flex gap-1">
                  {['Todos', 'Fornecedor', 'Prestação de Serviço', 'Acordo de Confidencialidade'].map(tipo => (
                    <button
                      key={tipo}
                      onClick={() => setFiltroTipo(tipo)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                        filtroTipo === tipo 
                          ? 'bg-[#693A32] text-white border border-[#A78177]/20 shadow-md' 
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'processos' && (
                <button
                  onClick={() => setIsNewProcessoOpen(true)}
                  className="bg-[#693A32] hover:bg-[#8D5B4F] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 border border-[#A78177]/20 shadow-lg cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" /> Cadastrar Litígio
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- TABS RENDERS --- */}

        {/* TAB 1: CONTRATOS */}
        {activeTab === 'contratos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#A78177] flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Contratos Sob Parecer Legal ({contratosFiltrados.length})
              </h2>

              <div className="space-y-3.5">
                {contratosFiltrados.map((contrato) => (
                  <div
                    key={contrato.id}
                    className={`bg-slate-900/40 p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row justify-between gap-4 ${
                      selectedContrato?.id === contrato.id 
                        ? 'border-[#8D5B4F] shadow-[0_0_15px_rgba(141,91,79,0.1)] bg-[#461D15]/5' 
                        : 'border-slate-800/80 hover:border-[#693A32]/40'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex shrink-0 gap-1.5 items-center mb-1.5">
                        <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                          {contrato.id}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                        <span className="text-[10px] font-semibold text-[#A78177]">
                          {contrato.tipo}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          contrato.risco === 'Alto'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : contrato.risco === 'Médio'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          Risco {contrato.risco}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        {contrato.titulo}
                      </h3>

                      <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                        {contrato.descricao}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-800/50">
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Consórcio/Partes</p>
                          <p className="text-xs text-slate-300 font-semibold truncate">{contrato.partes}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Valor Total</p>
                          <p className="text-xs text-slate-300 font-bold font-mono">
                            {contrato.valor > 0 
                              ? contrato.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                              : 'Isento / Não Estimado'}
                          </p>
                        </div>
                      </div>

                      {contrato.parecerLegal && (
                        <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                          <p className="text-[9px] font-bold text-[#A78177] uppercase flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400" /> Parecer Emitido - {contrato.parecerAutor}
                          </p>
                          <p className="text-xs text-slate-300 italic mt-1 leading-relaxed">
                            "{contrato.parecerLegal}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex md:flex-col items-end gap-2 shrink-0 justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/40">
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          contrato.status === 'Aprovado'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : contrato.status === 'Sob Revisão'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : contrato.status === 'Impasse Legal'
                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                : 'bg-slate-800/45 text-slate-300 border-slate-700'
                        }`}>
                          {contrato.status}
                        </span>
                      </div>

                      {contrato.status === 'Pendente' && (
                        <button
                          onClick={() => setSelectedContrato(contrato)}
                          className="bg-slate-950 text-xs font-bold text-[#A78177] hover:text-white hover:bg-[#693A32]/20 border border-[#693A32]/45 px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
                        >
                          Emitir Parecer <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {contratosFiltrados.length === 0 && (
                  <div className="text-center p-8 bg-slate-900/20 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 text-xs">Nenhum contrato pendente de conformidade regulatória foi encontrado para o seu termo.</p>
                  </div>
                )}
              </div>
            </div>

            {/* PARECER PANEL (LADO DIREITO) */}
            <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-2xl flex flex-col h-fit">
              {selectedContrato ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-[#A78177] tracking-wider uppercase font-mono">Processar Análise</h3>
                      <p className="text-xs text-slate-400">Emita parecer técnico operacional oficial</p>
                    </div>
                    <button
                      onClick={() => setSelectedContrato(null)}
                      className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <p className="font-bold text-slate-100">{selectedContrato.id}</p>
                    <p className="font-medium text-slate-400 mt-0.5">{selectedContrato.titulo}</p>
                    <p className="font-mono text-[10px] text-slate-500 mt-2">PARTES: {selectedContrato.partes}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      Parecer e Ressalvas Oficiais
                      <span className="text-[9px] text-slate-500 font-mono">Registrado como {userName}</span>
                    </label>
                    <textarea
                      value={legalResponse}
                      onChange={(e) => setLegalResponse(e.target.value)}
                      placeholder="Ex: Cláusula de proteção integral de prontuários em total conformidade ao termo de segurança de TI e provisões da LGPD para hospitais..."
                      rows={5}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#693A32]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={handleReprovarContrato}
                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors"
                    >
                      Devolver c/ Ressalva
                    </button>
                    <button
                      onClick={handleGravarParecer}
                      className="bg-[#693A32] hover:bg-[#8D5B4F] border border-[#A78177]/20 text-white font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Chancelar e Liberar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full border border-slate-800 bg-slate-950/40 flex items-center justify-center text-slate-500 mx-auto">
                    <FileCheck className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-300 uppercase">Aguardando Seleção</h3>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed mt-1">
                      Selecione um contrato pendente de conformidade na listagem lateral para registrar pareces operacionais oficiais.
                    </p>
                  </div>
                  
                  <div className="mt-4 p-3 bg-slate-950/40 border border-[#693A32]/20 rounded-xl text-left">
                    <div className="flex gap-2 items-start text-[10px] text-slate-400">
                      <AlertCircle className="w-4 h-4 text-[#A78177] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-300">Auditoria Automática:</strong> O sistema sinaliza contratos que contenham riscos de LGPD devido ao compartilhamento de logins.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COMPLIANCE */}
        {activeTab === 'compliance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#461D15]/10 border border-[#693A32]/30 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[#A78177]" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Criptografia Ativa canal HSF Shield</h3>
                    <p className="text-[11px] text-slate-400">Canal de denúncias éticas em total sigilo para investigação de compliance.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDenunciaSecret(!showDenunciaSecret)}
                  className="bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white"
                >
                  {showDenunciaSecret ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                  {showDenunciaSecret ? 'Mascarar Senhas' : 'Ver IDs Seguros'}
                </button>
              </div>

              <div className="space-y-3">
                {denuncias.map(denuncia => (
                  <div
                    key={denuncia.id}
                    className={`bg-slate-900/40 border p-5 rounded-2xl transition-all duration-300 flex flex-col gap-3 ${
                      selectedDenuncia?.id === denuncia.id
                        ? 'border-[#8D5B4F] bg-[#461D15]/5'
                        : 'border-slate-800/80 hover:border-[#693A32]/45'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {showDenunciaSecret ? denuncia.id : `PROT-${denuncia.protocolo.substring(9)}`}
                        </span>
                        <span className="text-[10px] text-slate-500">{denuncia.dataCriacao}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                        <span className="text-xs text-[#A78177] font-semibold">{denuncia.canal}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                        <span className="text-xs text-slate-300 font-bold">{denuncia.assunto}</span>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        denuncia.gravidade === 'Crítica' || denuncia.gravidade === 'Critíca'
                          ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : denuncia.gravidade === 'Alta'
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {denuncia.gravidade}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                      {denuncia.descricao}
                    </p>

                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-800/40">
                      <div>
                        <span className="text-[9px] text-slate-500 font-mono block">Progresso Investigativo</span>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {denuncia.investigacaoPassos.map((p, idx) => (
                            <div 
                              key={p.id} 
                              className={`w-6 h-1 rounded-full ${p.done ? 'bg-[#A78177] shadow-[0_0_8px_rgba(167,129,119,0.3)]' : 'bg-slate-800'}`} 
                              title={`${p.label} - ${p.done ? 'Concluído' : 'Pendente'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          denuncia.status === 'Medida Aplicada'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-850 text-slate-400'
                        }`}>
                          {denuncia.status}
                        </span>
                        
                        <button
                          onClick={() => setSelectedDenuncia(denuncia)}
                          className="bg-slate-950 border border-slate-800 text-xs px-3 py-1.5 rounded-xl hover:bg-slate-900 font-bold text-[#A78177]"
                        >
                          Gerenciar Auditoria
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AUDITORIA DE COMPLIANCE DETAILS */}
            <div className="bg-slate-900 border border-slate-800/60 p-5 rounded-2xl">
              {selectedDenuncia ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-[#A78177] uppercase tracking-wider font-mono">Diligências do Compliance</h3>
                      <p className="text-xs text-slate-400">Processo formal e apuração de irregularidades</p>
                    </div>
                    <button onClick={() => setSelectedDenuncia(null)} className="p-1.5 hover:bg-slate-800 text-slate-400 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Ref: PROT-99-{selectedDenuncia.protocolo.slice(-5)}</span>
                      <span className="text-slate-500">Auditor: {userName}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold truncate mt-1">{selectedDenuncia.assunto}</p>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-[#A78177] uppercase tracking-widest font-mono">Checklist de Auditoria Obrigatória</span>
                    <div className="space-y-1.5">
                      {selectedDenuncia.investigacaoPassos.map(passo => (
                        <label 
                          key={passo.id} 
                          className="flex items-start gap-2.5 p-2 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/40 rounded-xl text-xs cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={passo.done}
                            onChange={() => handleToggleInvestigacaoCheck(selectedDenuncia.id, passo.id)}
                            className="mt-0.5 accent-[#693A32]"
                          />
                          <span className={passo.done ? 'text-slate-400 line-through' : 'text-slate-200'}>
                            {passo.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Historico & Add Notas */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[10px] font-bold text-slate-350 uppercase tracking-widest font-mono">Histórico Técnico de Diligência</span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {selectedDenuncia.historicoNotas.map((n, i) => (
                        <div key={i} className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/30 text-[11px]">
                          <div className="flex justify-between text-slate-500 mb-0.5">
                            <span className="font-bold text-[#A78177]">{n.autor}</span>
                            <span>{n.data}</span>
                          </div>
                          <p className="text-slate-300 italic">"{n.nota}"</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <textarea
                        value={novaNotaCompliance}
                        onChange={(e) => setNovaNotaCompliance(e.target.value)}
                        placeholder="Adicionar nota técnica em sigilo administrativo..."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#693A32]"
                      />
                      <button
                        onClick={handleAddComplianceNota}
                        className="w-full bg-[#693A32] hover:bg-[#8D5B4F] text-xs font-bold py-2 rounded-xl text-white transition-colors cursor-pointer"
                      >
                        Registrar Parecer no Processo Compliance
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-[#A78177] mx-auto animate-pulse">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase">Aguardando Auditoria</h3>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                      Selecione um relato da ouvidoria confidencial para abrir a trilha de auditoria formal da corregedoria do Hospital São Francisco.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PROCESSOS JUDICIAIS */}
        {activeTab === 'processos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Custo Total de Provisão</span>
                  <span className="text-lg font-mono font-bold text-slate-50 mt-1 block">
                    {processos.reduce((acc, curr)=>acc+curr.valorCausa, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="p-3 bg-red-400/10 text-red-400 rounded-xl border border-red-400/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Risco Provável Ativo</span>
                  <span className="text-lg font-mono font-bold text-[#A78177] mt-1 block">
                    {processos.filter(p=>p.riscoPerda==='Provável').length} Processos
                  </span>
                </div>
                <div className="p-3 bg-[#693A32]/15 text-[#A78177] rounded-xl border border-[#693A32]/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Risco Possível / Remoto</span>
                  <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">
                    {processos.filter(p=>p.riscoPerda!=='Provável').length} Processos
                  </span>
                </div>
                <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-xl border border-emerald-400/20">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-sm tracking-wider uppercase text-slate-100 flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-[#A78177]" />
                  Acompanhamento de Contenciosos e Litígios
                </h3>
                <span className="text-[11px] font-bold font-mono text-slate-500">{processosFiltrados.length} Registros</span>
              </div>

              <div className="divide-y divide-slate-800">
                {processosFiltrados.map(proc => (
                  <div key={proc.id} className="p-5 hover:bg-slate-950/40 transition-colors flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-[#A78177] bg-[#693A32]/10 border border-[#A78177]/20 px-2 py-0.5 rounded-md font-mono">
                          {proc.tipo}
                        </span>
                        <span className="font-mono text-xs text-slate-300 font-bold">{proc.numero}</span>
                        <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                        <span className="text-xs text-slate-400 font-medium">{proc.autor}</span>
                      </div>

                      <p className="text-xs text-slate-300">
                        <strong className="text-[#A78177]">Comentário Legal:</strong> "{proc.comentarioAdvogado}"
                      </p>

                      {proc.proximaAudiencia && (
                        <div className="flex items-center gap-1.5 mt-2 bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-xl w-fit text-[11px] text-[#A78177]">
                          <Calendar className="w-3.5 h-3.5" /> Próxima Audiência: <strong className="text-slate-200">{proc.proximaAudiencia}</strong>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6 shrink-0 justify-between lg:justify-end lg:w-96 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/40">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono block">Valor Provisão</span>
                        <span className="text-xs font-semibold text-slate-200 font-mono">
                          {proc.valorCausa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 font-mono block">Risco de Perda</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-0.5 block w-fit ${
                          proc.riscoPerda === 'Provável'
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : proc.riscoPerda === 'Possível'
                              ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                              : 'bg-emerald-500/15 text-emerald-450 border border-emerald-500/20'
                        }`}>
                          {proc.riscoPerda}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 font-mono block">Status Judicial</span>
                        <span className="text-xs font-semibold text-slate-300 block">{proc.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONFORMIDADE CHECKLISTS */}
        {activeTab === 'conformidade' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm tracking-wide text-slate-200 uppercase font-mono">Auditoria Regulatória de Qualidade</h3>
                  <p className="text-xs text-slate-400">Verifique os checks de adequação operacional de vigilância, Anvisa e ONA.</p>
                </div>
                
                <div className="text-center">
                  <span className="text-3xl font-bold font-mono text-[#A78177]">{conformidadePorcentagem}%</span>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono mt-0.5">Média Geral Conformidade</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {checklistCompliance.map(check => (
                  <div key={check.id} className="bg-slate-900/40 p-4 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex gap-3 items-center min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        check.status 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-red-500/10 border-red-500/30 text-rose-450'
                      }`}>
                        {check.status ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 leading-tight block">{check.item}</p>
                        <span className="text-[10px] text-[#A78177] font-bold font-mono mt-0.5 block">{check.setor}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const att = checklistCompliance.map(c => {
                          if (c.id === check.id) return { ...c, status: !c.status };
                          return c;
                        });
                        setChecklistCompliance(att);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-colors cursor-pointer ${
                        check.status
                          ? 'bg-emerald-500/10 border-[#10B981]/25 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      {check.status ? 'Homologado' : 'Marcar Concluído'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#461D15]/10 border border-[#693A32]/35 p-5 rounded-2xl">
                <h3 className="font-bold text-xs tracking-wider text-[#A78177] uppercase font-mono flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Métricas Regulatórias Premium
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  As chaves de controle do hospital sincronizam auditorias semanais cruzando as rotinas do <strong className="text-white">SESMT</strong>, <strong className="text-white">SADT</strong> e as licenças biomédicas civis. O não cumprimento pode incorrer em multas que variam entre <strong className="text-white">R$ 50k a R$ 2M</strong> conforme as regras regulatórias.
                </p>
                <div className="mt-4 pt-3 border-t border-[#693A32]/25 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-mono">Última Auditoria</span>
                    <p className="text-[11px] text-slate-300 font-semibold font-mono mt-0.5">Hoje, 05:33</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-mono">Agência Executora</span>
                    <p className="text-[11px] text-slate-300 font-semibold font-mono mt-0.5">Vigilância & Controladoria</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <h3 className="font-bold text-xs tracking-wider uppercase text-slate-300 font-mono flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4" />
                  Boletins e Legislação Hospitalar
                </h3>
                <span className="text-[10px] text-slate-500 block mb-3">Diretivas regulamentadas mais acessadas:</span>
                
                <div className="space-y-2">
                  {[
                    { tit: 'RDC Anvisa nº 63/2011', sub: 'Requisitos de Boas Práticas de Serviços de Saúde.' },
                    { tit: 'LGPD para Hospitais (Art. 11)', sub: 'Bases legais de dados pessoais sensíveis.' },
                    { tit: 'Resolução CFM nº 2.217/2018', sub: 'Código de Ética Médica para prestação e conduta.' }
                  ].map((doc, i) => (
                    <div key={i} className="p-2 bg-slate-950 border border-slate-800/60 rounded-xl text-[11px]">
                      <p className="font-bold text-[#A78177]">{doc.tit}</p>
                      <p className="text-slate-400 mt-0.5 leading-snug">{doc.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CANAL ETICO FORM */}
        {activeTab === 'canal_etico' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-8 bg-[#461D15] border-b border-[#693A32]/60">
                <h2 className="text-2xl font-bold font-display text-white mb-4">O Hospital<br/><span className="text-[#A78177]">Canal Ético</span></h2>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans mt-6">
                  <p>Este canal de comunicação é destinado a colaboradores, pacientes, fornecedores e parceiros que desejem relatar condutas ou práticas que estejam em desacordo com o Código de Ética e Conduta do Hospital São Francisco na Providência de Deus ("HSF").</p>
                  <p>As informações registradas serão analisadas pelo Comitê de Integridade do HSF, garantindo-se o sigilo das denúncias, de forma compatível com a necessidade de uma apuração justa e conforme a legislação vigente. O HSF se reserva o direito de aplicar medidas disciplinares nos casos de denúncias ou acusações de má-fé, baseadas em informações falsas.</p>
                  <p>É fundamental que o relato seja feito com base em fatos verdadeiros e que a situação apresentada represente uma possível violação ao Código de Ética e Conduta.</p>
                  <p className="font-bold text-[#A78177]">Importante: sugestões ou reclamações sobre a qualidade dos serviços prestados pelo HSF não devem ser enviadas por este canal. Para esse tipo de manifestação, entre em contato com a Ouvidoria.</p>
                </div>
              </div>
              
              <div className="p-8 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                {eticoSuccess ? (
                   <div className="text-center py-16 space-y-4">
                     <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                       <CheckCircle className="w-8 h-8" />
                     </div>
                     <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Denúncia Enviada com Sucesso</h3>
                     <p className="text-sm shadow-sm opacity-80 max-w-md mx-auto">Seu relato foi recebido pelo Comitê de Integridade e será investigado em absoluto sigilo.</p>
                     <button onClick={() => setEticoSuccess(false)} className="mt-6 px-6 py-2 bg-[#693A32] text-white font-bold rounded-xl text-sm hover:bg-[#461D15] transition-colors">Enviar Novo Relato</button>
                   </div>
                ) : (
                  <form onSubmit={handleSubmitEtico} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Nome</label>
                      <input type="text" value={eticoNome} onChange={e=>setEticoNome(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#693A32]" />
                      <span className="text-[10px] text-slate-500">(Campo opcional)</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Telefone</label>
                      <input type="text" value={eticoTelefone} onChange={e=>setEticoTelefone(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#693A32]" />
                      <span className="text-[10px] text-slate-500">(Campo opcional)</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Email</label>
                      <input type="email" value={eticoEmail} onChange={e=>setEticoEmail(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#693A32]" />
                      <span className="text-[10px] text-slate-500">(Campo opcional)</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Qual sua relação com Hospital São Francisco? <span className="text-red-500">*</span></label>
                      <select value={eticoRelacao} onChange={e=>setEticoRelacao(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#693A32]">
                        <option value="">Selecione uma opção</option>
                        <option value="Colaborador">Colaborador</option>
                        <option value="Ex-colaborador">Ex-colaborador</option>
                        <option value="Paciente">Paciente</option>
                        <option value="Fornecedor">Fornecedor</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Classificação da ocorrência <span className="text-red-500">*</span></label>
                      <select value={eticoClassificacao} onChange={e=>setEticoClassificacao(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#693A32]">
                        <option value="">Selecione uma opção</option>
                        <option value="Não conformidade">Não conformidade com os procedimentos, normas e políticas internas</option>
                        <option value="Desvio de comportamento">Desvio de comportamento</option>
                        <option value="Vazamento ou uso indevido de informações">Vazamento ou uso indevido de informações</option>
                        <option value="Roubo, furto, desvio ou uso inadequado">Roubo, furto, desvio ou uso inadequado de materiais ou ativos</option>
                        <option value="Assédio moral">Assédio moral</option>
                        <option value="Agressão física">Agressão física</option>
                        <option value="Assédio sexual">Assédio sexual</option>
                        <option value="Discriminação">Discriminação</option>
                        <option value="Favorecimento ou conflito de interesses">Favorecimento ou conflito de interesses</option>
                        <option value="Relacionamento íntimo com subordinação direta">Relacionamento íntimo com subordinação direta</option>
                        <option value="Corrupção">Pagamento ou recebimento de recursos de forma imprópria (corrupção)</option>
                        <option value="Fraude">Fraude</option>
                        <option value="Violação de Leis trabalhistas">Violação de Leis trabalhistas</option>
                        <option value="Violação de Leis ambientais">Violação de Leis ambientais e outras leis</option>
                        <option value="Saúde e segurança do trabalho">Saúde e segurança do trabalho</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Local da Ocorrência <span className="text-red-500">*</span></label>
                      <select value={eticoLocal} onChange={e=>setEticoLocal(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#693A32]">
                        <option value="">Selecione uma opção</option>
                        <option value="Nas dependências do hospital">Nas dependências do hospital</option>
                        <option value="Outro local">Outro local</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold block">O que aconteceu? <span className="text-red-500">*</span></label>
                      <textarea value={eticoAconteceu} onChange={e=>setEticoAconteceu(e.target.value)} rows={4} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#693A32]" />
                      <span className="text-[10px] text-slate-500 leading-tight block">Descreva detalhadamente o ocorrido, indicando, se possível, o nome, o cargo e o setor dos envolvidos, bem como quando o fato ocorreu e se ainda continua ocorrendo.</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Quem fez isso? (Nome, cargo e/ou setor) <span className="text-red-500">*</span></label>
                      <input type="text" value={eticoQuem} onChange={e=>setEticoQuem(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#693A32]" />
                      <span className="text-[10px] text-slate-500">(Campo obrigatório)</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Informações adicionais</label>
                      <textarea value={eticoInformacoes} onChange={e=>setEticoInformacoes(e.target.value)} rows={3} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#693A32]" />
                      <span className="text-[10px] text-slate-500">(Campo opcional)</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Anexar arquivos</label>
                      <div className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                        <Plus className="w-6 h-6 mb-2" />
                        <span className="text-xs">Drag & Drop Files, <span className="underline">Choose Files to Upload</span></span>
                        <span className="text-[10px] mt-1">Você pode enviar até 5 arquivos.</span>
                      </div>
                      <span className="text-[10px] text-slate-500">(Campo opcional)</span>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2">
                        <input type="checkbox" className="w-5 h-5 accent-[#693A32] cursor-pointer" required />
                        <span className="text-xs font-semibold mr-4">Não sou um robô</span>
                        <Shield className="w-6 h-6 text-blue-500 opacity-80" />
                      </div>
                      
                      <button type="submit" disabled={isEticoSubmitting} className="bg-[#693A32] text-white font-bold py-2 px-8 rounded hover:bg-[#461D15] transition-colors disabled:opacity-50">
                        {isEticoSubmitting ? 'Enviando...' : 'Enviar'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL CADASTRAR PROCESSO */}
      {isNewProcessoOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in scale-in duration-200">
            <div className="px-6 py-4 bg-[#461D15] border-b border-[#693A32]/60 flex items-center justify-between">
              <h3 className="font-bold font-display text-white text-sm uppercase flex items-center gap-2">
                <Gavel className="w-4 h-4 text-[#A78177]" />
                Adicionar Novo Contencioso / Processo
              </h3>
              <button onClick={() => setIsNewProcessoOpen(false)} className="text-slate-400 hover:text-white shrink-0 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCriarProcesso} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Número Único CNJ</label>
                  <input
                    type="text"
                    required
                    placeholder="0000000-00.2026.5.02.0000"
                    value={newNum}
                    onChange={(e)=>setNewNum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#693A32]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Reclamante / Autor</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do ex-colaborador ou fornecedor"
                    value={newAutor}
                    onChange={(e)=>setNewAutor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#693A32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">NaturezaJurídica</label>
                  <select
                    value={newTipo}
                    onChange={(e)=>setNewTipo(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#693A32]"
                  >
                    <option value="Trabalhista" className="bg-slate-950">Trabalhista</option>
                    <option value="Responsabilidade Civil" className="bg-slate-950">Responsabilidade Civil</option>
                    <option value="Regulatório" className="bg-slate-950">Regulatório</option>
                    <option value="Contratos" className="bg-slate-950">Contratos</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Valor da Causa (R$)</label>
                  <input
                    type="number"
                    required
                    placeholder="R$ Estimado"
                    value={newValor}
                    onChange={(e)=>setNewValor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#693A32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Prognóstico de Perda (Risco)</label>
                  <select
                    value={newRisco}
                    onChange={(e)=>setNewRisco(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#693A32]"
                  >
                    <option value="Remota" className="bg-slate-950">Remota (Baixo)</option>
                    <option value="Possível" className="bg-slate-950">Possível (Médio)</option>
                    <option value="Provável" className="bg-slate-950">Provável (Alto)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Parecer Técnico / Notas do Advogado</label>
                <textarea
                  placeholder="Parecer técnico ou histórico das audiências preliminares..."
                  value={newComentario}
                  onChange={(e)=>setNewComentario(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#693A32]"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewProcessoOpen(false)}
                  className="bg-slate-955 border border-slate-800 hover:bg-slate-800 text-slate-400 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#693A32] hover:bg-[#8D5B4F] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer border border-[#A78177]/20 shadow-md"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
