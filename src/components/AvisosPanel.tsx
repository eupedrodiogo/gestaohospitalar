import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Trash2,
  Plus,
  ThumbsUp,
  MessageSquare,
  Search,
  AlertCircle,
  Clock,
  Send,
  User,
  ShieldAlert,
  Volume2,
  CheckCircle2,
  Eye,
  Info,
  Calendar,
  X
} from "lucide-react";

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: number;
}

interface Aviso {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: "urgente" | "normal";
  authorId: string;
  authorName: string;
  authorRole: string;
  likes: string[];
  readBy: string[];
  createdAt: number;
}

interface AvisosPanelProps {
  userRole: string;
  userName: string;
  userId: string;
}

// Default Seed/Demo Data when Firebase is empty or offline
const DEMO_AVISOS: Aviso[] = [
  {
    id: "demo-1",
    title: "Atualização Crítica do Sistema de Prontuário Eletrônico",
    content: "Prezada equipe do hospital, informamos que no dia 05/06 às 22:00 realizaremos uma manutenção preventiva programada no sistema de prontuários. Estima-se uma indisponibilidade de até 40 minutos. Por favor, utilizem as fichas físicas de contingência durante este período.",
    category: "TI & Sistemas",
    priority: "urgente",
    authorId: "ti-sys",
    authorName: "Suporte TI Hospital",
    authorRole: "ti",
    likes: ["demo-user-1"],
    readBy: ["demo-user-2"],
    createdAt: Date.now() - 3600000 * 4 // 4 hours ago
  },
  {
    id: "demo-2",
    title: "Campanha de Vacinação contra Influenza - Colaboradores",
    content: "A partir de amanhã, o setor de Medicina do Trabalho disponibilizará doses de vacinação contra a Influenza para todos os colaboradores do hospital. Dirija-se ao Bloco C das 08h às 17h munido de sua carteirinha de vacinação e crachá.",
    category: "Institucional",
    priority: "normal",
    authorId: "rh-med",
    authorName: "Recursos Humanos & SESMT",
    authorRole: "rh",
    likes: ["demo-user-1", "demo-user-3"],
    readBy: ["demo-user-1"],
    createdAt: Date.now() - 3600000 * 24 // 24 hours ago
  },
  {
    id: "demo-3",
    title: "Nova Regulamentação de Plantões Médicos e Enfermagem",
    content: "Diretoria clínica divulga novas regras para transição de plantão que devem ser seguidas de forma imediata. O checklist de passagem de plantão à beira do leito passa a ser obrigatório em todas as alas de internação da UTI.",
    category: "Escala & Plantões",
    priority: "urgente",
    authorId: "diretoria-c",
    authorName: "Dr. Roberto Neves",
    authorRole: "diretor_geral",
    likes: [],
    readBy: [],
    createdAt: Date.now() - 3600000 * 48 // 48 hours ago
  }
];

const DEMO_COMMENTS: Record<string, Comment[]> = {
  "demo-1": [
    {
      id: "c1",
      authorId: "user-1",
      authorName: "Enf. Amanda Silva",
      authorRole: "lider",
      content: "Entendido, já avisei os técnicos de plantão na ala UTI A.",
      createdAt: Date.now() - 3600000 * 3
    }
  ],
  "demo-2": [
    {
      id: "c2",
      authorId: "user-2",
      authorName: "Dr. Carlos Andrade",
      authorRole: "colaborador",
      content: "Excelente iniciativa! Estarei lá amanhã cedo.",
      createdAt: Date.now() - 3600000 * 12
    }
  ]
};

export default function AvisosPanel({ userRole, userName, userId }: AvisosPanelProps) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedPriority, setSelectedPriority] = useState<"Todos" | "urgente" | "normal">("Todos");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  // Create state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Institucional");
  const [newPriority, setNewPriority] = useState<"normal" | "urgente">("normal");
  const [loading, setLoading] = useState(false);
  
  // Comment state
  const [activeAvisoComments, setActiveAvisoComments] = useState<string | null>(null);
  const [newCommentVal, setNewCommentVal] = useState("");

  const categories = [
    "Todos",
    "Institucional",
    "TI & Sistemas",
    "Escala & Plantões",
    "Educação & Treinamento",
    "Segurança & Higiene",
    "Financeiro & Custos"
  ];

  const canPostNotices = ["rh", "lider", "ti", "diretor_administrativo", "diretor_geral"].includes(userRole);

  useEffect(() => {
    try {
      const localStored = localStorage.getItem("hospital_avisos");
      if (localStored) {
        setAvisos(JSON.parse(localStored));
      } else {
        setAvisos(DEMO_AVISOS);
        localStorage.setItem("hospital_avisos", JSON.stringify(DEMO_AVISOS));
      }

      const localComm = localStorage.getItem("hospital_avisos_comments");
      if (localComm) {
        setCommentsMap(JSON.parse(localComm));
      } else {
        setCommentsMap(DEMO_COMMENTS);
        localStorage.setItem("hospital_avisos_comments", JSON.stringify(DEMO_COMMENTS));
      }
    } catch (error) {
      console.warn("Storage warning: ", error);
    }
  }, []);

  // Fetch comments for active aviso
  useEffect(() => {
    if (!activeAvisoComments) return;
    // Commens are already loaded in state
  }, [activeAvisoComments]);

  // Handle Mark as Read
  const handleMarkAsRead = async (id: string, currentReads: string[]) => {
    if (currentReads.includes(userId)) return;

    const newReads = [...currentReads, userId];

    const updated = avisos.map(aviso => {
      if (aviso.id === id) {
        return { ...aviso, readBy: newReads };
      }
      return aviso;
    });
    setAvisos(updated);
    localStorage.setItem("hospital_avisos", JSON.stringify(updated));
  };

  // Toggle Like Status
  const handleLikeToggle = async (id: string, currentLikes: string[]) => {
    const isLiked = currentLikes.includes(userId);
    const newLikes = isLiked
      ? currentLikes.filter(u => u !== userId)
      : [...currentLikes, userId];

    const updated = avisos.map(aviso => {
      if (aviso.id === id) {
        return { ...aviso, likes: newLikes };
      }
      return aviso;
    });
    setAvisos(updated);
    localStorage.setItem("hospital_avisos", JSON.stringify(updated));
  };

  // Create notice
  const handlePostAviso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setLoading(true);
    const avisoData = {
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      priority: newPriority,
      authorId: userId,
      authorName: userName,
      authorRole: userRole,
      likes: [] as string[],
      readBy: [userId] as string[], // Creator automatically read it
      createdAt: Date.now()
    };
    
    try {
      const localId = "local-" + Date.now();
      const createdAviso: Aviso = {
        id: localId,
        ...avisoData
      };
      
      const updated = [createdAviso, ...avisos];
      setAvisos(updated);
      localStorage.setItem("hospital_avisos", JSON.stringify(updated));

      setNewTitle("");
      setNewContent("");
      setNewCategory("Institucional");
      setNewPriority("normal");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error publishing notice: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete notice
  const handleDeleteAviso = async (id: string) => {
    if (!confirm("Deseja mesmo remover permanentemente este aviso?")) return;

    const updated = avisos.filter(a => a.id !== id);
    setAvisos(updated);
    localStorage.setItem("hospital_avisos", JSON.stringify(updated));
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent, avisoId: string) => {
    e.preventDefault();
    if (!newCommentVal.trim()) return;

    const commData = {
      authorId: userId,
      authorName: userName,
      authorRole: userRole,
      content: newCommentVal.trim(),
      createdAt: Date.now()
    };

    const currentCommList = commentsMap[avisoId] || [];
    const newComment: Comment = {
      id: "comm-" + Date.now(),
      ...commData
    };
    const updatedMap = {
      ...commentsMap,
      [avisoId]: [...currentCommList, newComment]
    };
    setCommentsMap(updatedMap);
    localStorage.setItem("hospital_avisos_comments", JSON.stringify(updatedMap));
    setNewCommentVal("");
  };

  // Filter lists
  const filteredAvisos = avisos.filter(aviso => {
    const matchesSearch = aviso.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          aviso.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          aviso.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || aviso.category === selectedCategory;
    const matchesPriority = selectedPriority === "Todos" || aviso.priority === selectedPriority;
    const matchesUnread = !showUnreadOnly || !aviso.readBy.includes(userId);
    return matchesSearch && matchesCategory && matchesPriority && matchesUnread;
  });

  const urgentCount = avisos.filter(a => a.priority === "urgente").length;
  const unreadCount = avisos.filter(a => !a.readBy.includes(userId)).length;

  return (
    <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header section with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-teal-400 animate-pulse" />
            Mural de Avisos
          </h2>
          <p className="text-slate-400 text-sm">
            Fique por dentro das atualizações, comunicados de escala, orientações e avisos oficiais do hospital.
          </p>
        </div>
        
        {canPostNotices && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(45,212,191,0.25)]"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            Publicar Comunicado
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
        <button 
          onClick={() => {
            setSelectedCategory("Todos");
            setSelectedPriority("Todos");
            setShowUnreadOnly(false);
            setSearchTerm("");
          }}
          className={`bg-slate-900 border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 ${(!showUnreadOnly && selectedPriority === "Todos") ? "border-slate-600/60 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "border-slate-800/80"}`}
        >
          <div className="flex justify-between items-start mb-1 sm:mb-2 w-full gap-1">
            <span className="text-slate-400 text-center sm:text-left text-[10px] sm:text-xs font-bold uppercase tracking-tighter sm:tracking-wider leading-tight w-full break-words line-clamp-2">Total de<br className="hidden sm:block" /> Comunicados</span>
            <div className="hidden sm:block bg-slate-950 p-1.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-800 shrink-0">
              <Volume2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400" />
            </div>
          </div>
          <span className="text-slate-200 text-center sm:text-left text-xl sm:text-2xl font-display font-bold block w-full">{avisos.length}</span>
        </button>

        <button 
          onClick={() => {
            setSelectedPriority("urgente");
            setShowUnreadOnly(false);
          }}
          className={`bg-slate-900 border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-amber-900/60 ${(!showUnreadOnly && selectedPriority === "urgente") ? "border-amber-700/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]" : "border-slate-800/80"}`}
        >
          <div className="flex justify-between items-start mb-1 sm:mb-2 w-full gap-1">
            <span className="text-amber-400 text-center sm:text-left text-[10px] sm:text-xs font-bold uppercase tracking-tighter sm:tracking-wider leading-tight w-full break-words line-clamp-2">Avisos<br className="hidden sm:block" /> Urgentes</span>
            <div className="hidden sm:block bg-amber-950/20 p-1.5 sm:p-3 rounded-lg sm:rounded-xl border border-amber-900/40 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-500" />
            </div>
          </div>
          <span className="text-amber-350 text-center sm:text-left text-xl sm:text-2xl font-display font-bold block w-full">{urgentCount}</span>
        </button>

        <button 
          onClick={() => {
            setShowUnreadOnly(true);
            setSelectedPriority("Todos");
          }}
          className={`bg-slate-900 border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-teal-900/60 ${showUnreadOnly ? "border-teal-700/60 shadow-[0_0_15px_rgba(45,212,191,0.1)]" : "border-slate-800/80"}`}
        >
          <div className="flex justify-between items-start mb-1 sm:mb-2 w-full gap-1">
            <span className="text-teal-400 text-center sm:text-left text-[10px] sm:text-xs font-bold uppercase tracking-tighter sm:tracking-wider leading-tight w-full break-words line-clamp-2">Não Lidos<br className="hidden sm:block" /> Por Você</span>
            <div className="hidden sm:block bg-teal-950/20 p-1.5 sm:p-3 rounded-lg sm:rounded-xl border border-teal-900/40 shrink-0">
              <AlertCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-teal-400" />
            </div>
          </div>
          <span className="text-teal-400 text-center sm:text-left text-xl sm:text-2xl font-display font-bold block w-full">{unreadCount}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex bg-slate-900/60 p-2 sm:p-3 rounded-2xl border border-slate-800/60 transition-all duration-300">
        {isSearchExpanded ? (
          <div className="relative flex-grow flex items-center animate-in fade-in zoom-in-95 duration-200">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Pesquisar por título, corpo ou autor..."
              className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-teal-500 transition-all duration-300 placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={() => {
                setIsSearchExpanded(false);
                setSearchTerm("");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-2 w-full animate-in fade-in zoom-in-95 duration-200 min-w-0">
            <button
              onClick={() => setIsSearchExpanded(true)}
              className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all focus:outline-none shrink-0"
              title="Pesquisar"
            >
              <Search className="w-4 h-4" />
            </button>

            <select
              className="flex-grow px-3 py-2 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-sm focus:outline-none focus:border-teal-500 truncate"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Todos">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-sm focus:outline-none focus:border-teal-500 max-w-[120px] sm:max-w-[160px] truncate shrink-0"
              value={selectedPriority}
              onChange={(e: any) => setSelectedPriority(e.target.value)}
            >
              <option value="Todos">Todas Prioridades</option>
              <option value="urgente">Urgente</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        )}
      </div>

      {/* Feed Area */}
      <div className="flex flex-col gap-6">
        {filteredAvisos.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
            <Megaphone className="w-12 h-12 text-slate-600 mb-2" />
            <span className="text-slate-300 font-bold block text-lg">Nenhum aviso encontrado</span>
            <p className="text-slate-500 text-sm max-w-md">
              Não há avisos para os filtros selecionados ou nenhuma publicação foi enviada ainda.
            </p>
          </div>
        ) : (
          filteredAvisos.map((aviso) => {
            const isRead = aviso.readBy.includes(userId);
            const isLiked = aviso.likes.includes(userId);
            const avisoComments = commentsMap[aviso.id] || [];
            const showCommentsSection = activeAvisoComments === aviso.id;

            return (
              <div
                key={aviso.id}
                onClick={() => handleMarkAsRead(aviso.id, aviso.readBy)}
                className={`relative bg-slate-900 border transition-all duration-300 rounded-2xl overflow-hidden ${
                  aviso.priority === "urgente"
                    ? "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                    : "border-slate-800 hover:border-slate-700 hover:shadow-lg"
                } ${!isRead ? "ring-2 ring-teal-500/30" : ""}`}
              >
                {/* Header Flag / Urgency Accent */}
                {aviso.priority === "urgente" && (
                  <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 animate-bounce" />
                      Aviso Urgente e Obrigatório
                    </span>
                    {!isRead && (
                      <span className="bg-teal-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-extrabold animate-pulse">
                        Novo
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Notice Meta (Author, Date, Category) */}
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800 text-teal-400 select-none">
                        {aviso.authorRole === "ti" ? (
                          <span className="text-xs font-mono font-bold uppercase">TI</span>
                        ) : aviso.authorRole === "diretor_geral" || aviso.authorRole === "diretor_administrativo" ? (
                          <span className="text-xs font-mono font-bold uppercase">DIR</span>
                        ) : (
                          <span className="text-xs font-mono font-bold uppercase">
                            {aviso.authorRole.substring(0, 2)}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-200 block text-sm leading-tight">
                          {aviso.authorName}
                        </span>
                        <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                          Cargo / Setor: {aviso.authorRole.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(aviso.createdAt).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>

                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border bg-slate-950 border-slate-850 text-teal-400 tracking-wider">
                        {aviso.category}
                      </span>
                    </div>
                  </div>

                  {/* Notice Title and Body */}
                  <h3 className="text-xl font-display font-bold text-slate-100 mb-3 tracking-tight">
                    {aviso.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                    {aviso.content}
                  </p>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-slate-800/60 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeToggle(aviso.id, aviso.likes);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                          isLiked
                            ? "bg-teal-500/15 border-teal-500/40 text-teal-400"
                            : "bg-slate-950/60 border-slate-850 text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-xs font-bold">{aviso.likes.length}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAvisoComments(
                            activeAvisoComments === aviso.id ? null : aviso.id
                          );
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                          showCommentsSection
                            ? "bg-teal-500/15 border-teal-500/40 text-teal-400"
                            : "bg-slate-950/60 border-slate-850 text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-bold">{avisoComments.length}</span>
                      </button>
                    </div>

                    {/* Readers count display */}
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-slate-500" />
                        Lido por {aviso.readBy.length} pessoas
                      </span>

                      {/* Deletable if they are authorized to manage avisos or is creator */}
                      {(canPostNotices || aviso.authorId === userId) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAviso(aviso.id);
                          }}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 px-2 py-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Comments Section */}
                {showCommentsSection && (
                  <div className="bg-slate-950/80 p-5 border-t border-slate-800/80 animate-in slide-in-from-top-3 duration-250">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      Comentários e Dúvidas ({avisoComments.length})
                    </h4>

                    {/* Comments Feed */}
                    <div className="flex flex-col gap-4.5 max-h-56 overflow-y-auto mb-4 scrollbar-thin pr-1">
                      {avisoComments.length === 0 ? (
                        <div className="text-slate-500 text-xs py-2 italic">
                          Ainda não há respostas para este comunicado. Seja o primeiro a comentar ou sinalizar dúvida!
                        </div>
                      ) : (
                        avisoComments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                            <div className="w-6.5 h-6.5 text-[10px] uppercase font-bold select-none rounded-full bg-slate-950 border border-slate-800 text-teal-400 flex items-center justify-center shrink-0">
                              {comment.authorName.charAt(0)}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-slate-200">
                                  {comment.authorName}
                                  <span className="ml-1.5 px-1 py-0.2 bg-slate-950 rounded text-[9px] uppercase font-bold text-slate-400 border border-slate-850">
                                    {comment.authorRole}
                                  </span>
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Write comment input */}
                    <form
                      onSubmit={(e) => handleAddComment(e, aviso.id)}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Escreva sua observação, pergunta ou feedback..."
                        className="flex-grow px-3 py-2 bg-slate-905 border border-slate-800 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                        value={newCommentVal}
                        onChange={(e) => setNewCommentVal(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={!newCommentVal.trim()}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-3.5 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Notice Board Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-250">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-bold text-slate-200">Publicar Novo Comunicado Oficial</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostAviso} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider block mb-1.5">
                  Título do Comunicado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Novo Fluxo de Coleta de Exames na UTI A"
                  maxLength={150}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 text-xs font-bold uppercase tracking-wider block mb-1.5">
                    Categoria *
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-teal-500"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Institucional">Institucional</option>
                    <option value="TI & Sistemas">TI & Sistemas</option>
                    <option value="Escala & Plantões">Escala & Plantões</option>
                    <option value="Educação & Treinamento">Educação & Treinamento</option>
                    <option value="Segurança & Higiene">Segurança & Higiene</option>
                    <option value="Financeiro & Custos">Financeiro & Custos</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 text-xs font-bold uppercase tracking-wider block mb-1.5">
                    Prioridade *
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewPriority("normal")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                        newPriority === "normal"
                          ? "bg-slate-950 border-teal-500/50 text-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.05)]"
                          : "bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-400"
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPriority("urgente")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                        newPriority === "urgente"
                          ? "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.05)]"
                          : "bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-400"
                      }`}
                    >
                      ⚠️ Urgente
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider block mb-1.5">
                  Conteúdo do Aviso *
                </label>
                <textarea
                  required
                  placeholder="Escreva as informações detalhadas aqui..."
                  rows={6}
                  maxLength={5000}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
                <span className="text-slate-500 text-[10px] flex justify-end mt-1">
                  Máximo 5000 caracteres.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 text-sm font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !newTitle.trim() || !newContent.trim()}
                  className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                >
                  {loading ? "Publicando..." : "Publicar Aviso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
