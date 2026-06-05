import React, { useState } from 'react';
import { Lightbulb, Send, ThumbsUp, MessageSquare, Star, Sparkles } from 'lucide-react';

export default function InnovationPanel({ userRole, userName }: { userRole: string; userName: string }) {
  const [ideas, setIdeas] = useState([
    {
      id: 4,
      title: "Análise de Clima em Micro-pulsos",
      description: "Em vez de uma grande pesquisa semestral (Climate Survey), integrar micro-perguntas (1 ou 2) semanais diretamente na tela principal do colaborador para mensurar o humor e clima em tempo real sem sobrecarga.",
      author: "Assistente de IA HSF",
      isAI: true,
      likes: 18,
      status: "Sugerida",
      category: "Clima Organizacional",
      createdAt: "Hoje"
    },
    {
      id: 5,
      title: "Mentoria Inteligente (Matchmaking)",
      description: "Usar os dados do Painel de Assessment para conectar automaticamente lideranças com altas notas em determinadas competências (ex: Liderança) com colaboradores buscando se desenvolver exatamente nessas áreas.",
      author: "Assistente de IA HSF",
      isAI: true,
      likes: 24,
      status: "Nova Ideia",
      category: "Desenvolvimento",
      createdAt: "Hoje"
    },
    {
      id: 1,
      title: "Integração de Escalas com Google Agenda",
      description: "Permitir que os plantões do sistema de ponto sincem automaticamente com o Google Calendar das equipes, reduzindo faltas e confusão de horários.",
      author: "Dra. Helena Souza",
      isAI: false,
      likes: 14,
      status: "Em Análise",
      category: "Produtividade",
      createdAt: "28/05/2026"
    },
    {
      id: 2,
      title: "Gamificação: Recompensas em Vale-Cultura",
      description: "Transformar as badges de excelência (Gamificação) em pequenos bônus como ingressos de cinema ou vale-livros.",
      author: "Comitê de Inovação",
      isAI: false,
      likes: 32,
      status: "Aprovado",
      category: "Engajamento",
      createdAt: "22/05/2026"
    },
    {
      id: 3,
      title: "IA para Triagem Documental no Recrutamento",
      description: "Utilizar IA para analisar currículos e certificados anexados na nova aba de Vagas Internas, pontuando os requisitos de forma automatizada.",
      author: "Comitê de Inovação",
      isAI: false,
      likes: 8,
      status: "Nova",
      category: "Tecnologia",
      createdAt: "28/05/2026"
    }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    
    setIdeas([{
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      author: userName,
      isAI: false,
      likes: 0,
      status: "Nova",
      category: "Sugestão",
      createdAt: new Date().toLocaleDateString('pt-BR')
    }, ...ideas]);
    
    setNewTitle("");
    setNewDesc("");
    alert("Ideia / Melhoria enviada com sucesso!");
  };

  const handleLike = (id: number) => {
    setIdeas(ideas.map(idea => idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea));
  };

  return (
    <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-teal-400" />
          Hub de Inovação & Melhorias
        </h2>
        <p className="text-slate-400 text-sm">
          Apresente suas ideias para a evolução da plataforma ou confira o que está sendo pensado para o futuro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Formulário de Submissão */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-teal-500" />
              Sugerir Nova Ideia
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Título da Ideia</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-teal-500/50 transition-colors"
                  placeholder="Ex: Novo módulo de..."
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Descrição</label>
                <textarea 
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-teal-500/50 transition-colors resize-none"
                  placeholder="Descreva como funcionaria e os benefícios..."
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Publicar Ideia
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Feed de Ideias */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-200">Ideias Recentes</h3>
            <div className="flex gap-2">
              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-md">Mais Votadas</span>
              <span className="bg-teal-500/10 text-teal-400 text-xs px-2 py-1 rounded-md border border-teal-500/20">Recentes</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {ideas.map((idea) => (
              <div key={idea.id} className={`bg-slate-900 border rounded-2xl p-6 hover:border-slate-700 transition-colors ${idea.isAI ? 'border-teal-500/30' : 'border-slate-800'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-slate-800 text-slate-300 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                        {idea.category}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border
                        ${idea.status === 'Aprovado' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 
                          idea.status === 'Em Análise' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 
                          'bg-teal-500/10 text-teal-400 border-teal-500/20'}
                      `}>
                        {idea.status}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-100">{idea.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">{idea.createdAt}</span>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {idea.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Autor</span>
                    <span className={`text-sm font-medium flex items-center gap-1.5 ${idea.isAI ? 'text-teal-400' : 'text-slate-300'}`}>
                      {idea.isAI && <Sparkles className="w-3.5 h-3.5" />}
                      {idea.author}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs font-medium">Discutir</span>
                    </button>
                    <button 
                      onClick={() => handleLike(idea.id)}
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs font-bold">{idea.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
