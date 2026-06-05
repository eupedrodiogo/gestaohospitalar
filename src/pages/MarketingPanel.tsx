import React, { useState } from "react";
import { 
  Megaphone,
  Instagram,
  Heart,
  Share2,
  MousePointerClick,
  Eye,
  Globe,
  TrendingUp,
  Image as ImageIcon,
  LayoutGrid,
  KanbanSquare,
  Clock,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface MarketingPanelProps {
  userRole: string;
  userName: string;
}

const trafficData = [
  { month: 'Seg', Instagram: 12000, Website: 15400, LinkedIn: 4200 },
  { month: 'Ter', Instagram: 18500, Website: 16200, LinkedIn: 5100 },
  { month: 'Qua', Instagram: 14200, Website: 17800, LinkedIn: 4800 },
  { month: 'Qui', Instagram: 22100, Website: 19500, LinkedIn: 6200 },
  { month: 'Sex', Instagram: 25400, Website: 21000, LinkedIn: 5900 },
  { month: 'Sáb', Instagram: 32000, Website: 14500, LinkedIn: 3100 },
  { month: 'Dom', Instagram: 28500, Website: 12100, LinkedIn: 2800 },
];

type KanbanTask = {
  id: string;
  title: string;
  type: string;
  column: 'backlog' | 'todo' | 'doing' | 'review' | 'done';
  date: string;
  priority: 'Baixa' | 'Média' | 'Alta';
};

const initialTasks: KanbanTask[] = [
  { id: '1', title: 'Campanha de Vacinação Bivalente', type: 'Social Media', column: 'done', date: '15/Out', priority: 'Alta' },
  { id: '2', title: 'Arte para o Dia do Médico', type: 'Design', column: 'review', date: '18/Out', priority: 'Média' },
  { id: '3', title: 'Copy: Novo equipamento de ressonância', type: 'Conteúdo', column: 'doing', date: '21/Out', priority: 'Alta' },
  { id: '4', title: 'Fotos da fachada Nova Maternidade', type: 'Audiovisual', column: 'doing', date: '22/Out', priority: 'Média' },
  { id: '5', title: 'Newsletter Outubro Rosa', type: 'E-mail', column: 'todo', date: '25/Out', priority: 'Alta' },
  { id: '6', title: 'Atualização banners do site', type: 'Web', column: 'todo', date: '26/Out', priority: 'Baixa' },
  { id: '7', title: 'Campanha Novembro Azul', type: 'Campanha', column: 'backlog', date: '01/Nov', priority: 'Alta' },
  { id: '8', title: 'Vídeo Institucional 2026', type: 'Audiovisual', column: 'backlog', date: '15/Nov', priority: 'Média' },
];

export default function MarketingPanel({ userRole, userName }: MarketingPanelProps) {
  const [activeTab, setActiveTab] = useState<'kpi' | 'kanban'>('kpi');
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);

  const columns = [
    { id: 'backlog', title: 'Backlog & Ideias', color: 'border-slate-800/60', bg: 'bg-slate-900/50' },
    { id: 'todo', title: 'A Fazer', color: 'border-slate-800/60', bg: 'bg-slate-900/50' },
    { id: 'doing', title: 'Em Produção', color: 'border-slate-800/60', bg: 'bg-slate-900/50' },
    { id: 'review', title: 'Revisão', color: 'border-slate-800/60', bg: 'bg-slate-900/50' },
    { id: 'done', title: 'Publicado', color: 'border-slate-800/60', bg: 'bg-slate-900/50' },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column: columnId as any } : t));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-teal-400" />
            Marketing e Comunicação
          </h1>
          <p className="text-sm text-slate-400 mt-1">Bem-vindo(a), {userName}. Monitoramento de campanhas e assets visuais.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'kpi'
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'kanban'
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
            }`}
          >
            <KanbanSquare className="w-4 h-4" />
            Kanban de Campanhas
          </button>
        </div>
      </div>

      {activeTab === 'kpi' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alcance Total</h3>
              </div>
              <div className="text-2xl font-semibold text-slate-100 mb-1">142K</div>
              <p className="text-xs text-teal-400 font-medium">+8% últimos 7 dias</p>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tráfego Site</h3>
              </div>
              <div className="text-2xl font-semibold text-slate-100 mb-1">45.2K</div>
              <p className="text-xs text-teal-400 font-medium">+12% tráfego orgânico</p>
            </div>
            
            <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engajamento</h3>
              </div>
              <div className="text-2xl font-semibold text-slate-100 mb-1">5.4%</div>
              <p className="text-xs text-teal-400 font-medium">Acima da média setorial</p>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
              <div className="flex items-center gap-2 mb-2">
                <MousePointerClick className="w-4 h-4 text-teal-500" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leads Gerados</h3>
              </div>
              <div className="text-2xl font-semibold text-slate-100 mb-1">324</div>
              <p className="text-xs text-slate-500 font-medium">Campanha Outubro Rosa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Tráfego por Canal (Últimos 7 dias)</h3>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInsta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6e4336" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6e4336" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorWeb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a1796c" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a1796c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" dataKey="Instagram" stroke="#6e4336" strokeWidth={2} fillOpacity={1} fill="url(#colorInsta)" />
                    <Area type="monotone" dataKey="Website" stroke="#a1796c" strokeWidth={2} fillOpacity={1} fill="url(#colorWeb)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-5 glow-border">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-teal-400" />
                  Campanhas Ativas & Assets
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
                  Ver Todos
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { title: "Mês da Saúde Preventiva", type: "Social Media / Reels", status: "Rodando", budget: "R$ 15k", cpc: "R$ 0.45" },
                  { title: "Nova Maternidade HSF", type: "Google Ads / Display", status: "Em Revisão", budget: "R$ 50k", cpc: "-" },
                  { title: "Chek-up Executivo B2B", type: "LinkedIn Ads", status: "Rodando", budget: "R$ 25k", cpc: "R$ 2.10" },
                  { title: "Vídeo Institucional 2026", type: "Produção / YouTube", status: "Pré-Produção", budget: "R$ 80k", cpc: "-" },
                ].map((camp, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-800/50 transition">
                    <div>
                      <h4 className="font-semibold text-slate-200 text-sm">{camp.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{camp.type}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${camp.status === 'Rodando' ? 'text-teal-400 bg-teal-500/10' : camp.status === 'Em Revisão' ? 'text-teal-400 bg-teal-500/10' : 'text-teal-400 bg-teal-500/10'}`}>
                          {camp.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex grid-cols-2 gap-4 md:text-right">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Budget</div>
                        <div className="text-sm font-semibold text-slate-200">{camp.budget}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">CPC Médio</div>
                        <div className="text-sm font-semibold text-slate-300">{camp.cpc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-2 px-2 snap-x h-[calc(100vh-220px)] min-h-[500px]">
          {columns.map(column => (
            <div 
              key={column.id} 
              className={`flex flex-col min-w-[300px] max-w-[300px] rounded-3xl border ${column.color} card-gradient p-4 snap-start glow-border`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">{column.title}</span>
                <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.column === column.id).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 pb-4">
                {tasks.filter(t => t.column === column.id).map(task => (
                  <div 
                    key={task.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-teal-500/30 p-4 rounded-2xl cursor-grab active:cursor-grabbing transition-all hover:shadow-lg hover:shadow-teal-500/5 group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        task.type === 'Social Media' ? 'bg-teal-500/10 text-teal-400' :
                        task.type === 'Design' ? 'bg-purple-500/10 text-purple-400' :
                        task.type === 'Conteúdo' ? 'bg-teal-500/10 text-teal-400' :
                        task.type === 'E-mail' ? 'bg-teal-500/10 text-teal-400' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {task.type}
                      </span>
                      <button className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-3 leading-snug">{task.title}</h4>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900/50 px-2 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{task.date}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${
                        task.priority === 'Alta' ? 'text-teal-400' :
                        task.priority === 'Média' ? 'text-teal-400' :
                        'text-teal-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-700 hover:border-slate-500 text-slate-500 hover:text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer group">
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-wider">Add Card</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
