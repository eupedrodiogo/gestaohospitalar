import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Vote,
  Plus,
  Trash2,
  CheckCircle2,
  BarChart2,
  PieChart,
  HelpCircle,
  X,
  AlertCircle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface QuickPollsPanelProps {
  userRole: string;
  userName: string;
  userId: string;
}

interface Poll {
  id: string;
  question: string;
  options: string[];
  active: boolean;
  createdBy: string;
  createdAt: number;
}

interface PollResult {
  pollId: string;
  counts: number[];
}

const COLORS = ['#2dd4bf', '#818cf8', '#f472b6', '#fbbf24', '#a78bfa', '#34d399', '#f87171'];

export default function QuickPollsPanel({ userRole, userName, userId }: QuickPollsPanelProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [myVotedPolls, setMyVotedPolls] = useState<Set<string>>(new Set());
  const [pollResults, setPollResults] = useState<PollResult[]>([]);
  
  // Create Poll State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManagePolls = userRole === "rh" || userRole === "ti";
  const canViewResults = ["rh", "lider", "diretor_geral", "diretor_administrativo", "ti"].includes(userRole);

  const fetchData = async () => {
    try {
      // Fetch Polls
      const { data: pollsData, error: pollsError } = await supabase
        .from("polls")
        .select("*")
        .order("createdAt", { ascending: false });

      if (pollsError) throw pollsError;
      if (pollsData) setPolls(pollsData);

      // Fetch User's participations
      const { data: partData, error: partError } = await supabase
        .from("poll_participants")
        .select("pollId")
        .eq("userId", userId);

      if (partError) throw partError;
      if (partData) {
        setMyVotedPolls(new Set(partData.map((p) => p.pollId)));
      }

      // If user can view results, fetch votes
      if (canViewResults) {
        const { data: votesData, error: votesError } = await supabase
          .from("poll_votes")
          .select("pollId, optionIndex");

        if (votesError) throw votesError;
        
        if (votesData && pollsData) {
          const results: PollResult[] = pollsData.map(poll => {
            const counts = new Array((poll.options as string[]).length).fill(0);
            votesData.forEach(v => {
              if (v.pollId === poll.id) {
                counts[v.optionIndex]++;
              }
            });
            return { pollId: poll.id, counts };
          });
          setPollResults(results);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar enquetes:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up realtime subscriptions
    const channel = supabase.channel('polls_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_participants' }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, userRole]);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = newOptions.filter(o => o.trim() !== "");
    if (!newQuestion.trim() || validOptions.length < 2) return;

    setIsSubmitting(true);
    try {
      await supabase.from("polls").insert({
        question: newQuestion.trim(),
        options: validOptions,
        active: true,
        createdBy: userId,
        createdAt: Date.now()
      });
      setShowCreateModal(false);
      setNewQuestion("");
      setNewOptions(["", ""]);
    } catch (err) {
      console.error("Erro ao criar enquete:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePollStatus = async (pollId: string, currentStatus: boolean) => {
    try {
      await supabase.from("polls").update({ active: !currentStatus }).eq("id", pollId);
    } catch (err) {
      console.error("Erro ao alterar status da enquete:", err);
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    if (myVotedPolls.has(pollId)) return;

    // Optimistic update
    setMyVotedPolls(prev => new Set(prev).add(pollId));

    try {
      // Insert participation (link to user)
      await supabase.from("poll_participants").insert({
        pollId,
        userId,
        createdAt: Date.now()
      });

      // Insert vote (anonymous)
      await supabase.from("poll_votes").insert({
        pollId,
        optionIndex,
        createdAt: Date.now()
      });
    } catch (err) {
      console.error("Erro ao votar:", err);
      // Revert optimistic update
      setMyVotedPolls(prev => {
        const newSet = new Set(prev);
        newSet.delete(pollId);
        return newSet;
      });
    }
  };

  const activePolls = polls.filter(p => p.active);
  const inactivePolls = polls.filter(p => !p.active);
  const pendingPolls = activePolls.filter(p => !myVotedPolls.has(p.id));
  const completedPolls = activePolls.filter(p => myVotedPolls.has(p.id));

  return (
    <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
            <Vote className="w-6 h-6 text-teal-400" />
            Enquetes Rápidas
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Participe das votações anônimas e contribua com sua opinião para a gestão do hospital.
          </p>
        </div>
        
        {canManagePolls && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(45,212,191,0.25)]"
          >
            <Plus className="w-4 h-4" />
            Nova Enquete
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Lado Esquerdo: Área de Votação (Para todos) */}
        <div className="flex-1 flex flex-col gap-6">
          {pendingPolls.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Votações Pendentes
              </h3>
              {pendingPolls.map(poll => (
                <div key={poll.id} className="bg-slate-900 border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.05)] rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-slate-100 mb-4">{poll.question}</h4>
                  <div className="space-y-3">
                    {poll.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleVote(poll.id, idx)}
                        className="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-teal-500/50 hover:bg-teal-500/10 text-slate-300 font-medium transition-all group flex items-center justify-between"
                      >
                        <span>{opt}</span>
                        <CheckCircle2 className="w-5 h-5 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center">Seu voto é 100% anônimo.</p>
                </div>
              ))}
            </div>
          )}

          {pendingPolls.length === 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-300">Tudo em dia!</h3>
              <p className="text-slate-500 text-sm mt-1">Você não tem enquetes pendentes para votar no momento.</p>
            </div>
          )}

          {/* Voted Polls List */}
          {completedPolls.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Enquetes que você participou (Ativas)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedPolls.map(poll => (
                  <div key={poll.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
                      <Vote className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-300 line-clamp-1">{poll.question}</p>
                      <p className="text-xs text-teal-400 font-medium mt-0.5">Voto computado com sucesso</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lado Direito: Resultados (Apenas Gestores/RH) */}
        {canViewResults && (
          <div className="w-full lg:w-[45%] flex flex-col gap-6">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-400" />
              Resultados em Tempo Real
            </h3>
            
            {polls.length === 0 && (
              <p className="text-slate-500 text-sm">Nenhuma enquete criada ainda.</p>
            )}

            {polls.map(poll => {
              const res = pollResults.find(r => r.pollId === poll.id);
              const counts = res?.counts || new Array(poll.options.length).fill(0);
              const totalVotes = counts.reduce((a, b) => a + b, 0);

              const chartData = poll.options.map((opt, i) => ({
                name: opt.length > 15 ? opt.substring(0, 15) + "..." : opt,
                fullName: opt,
                votos: counts[i]
              }));

              return (
                <div key={poll.id} className={`bg-slate-900 border rounded-2xl p-5 ${poll.active ? "border-slate-800" : "border-slate-800/50 opacity-70"}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 leading-snug">{poll.question}</h4>
                      <p className="text-xs text-slate-400 mt-1">Total: {totalVotes} voto{totalVotes !== 1 && 's'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!poll.active && (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-bold uppercase tracking-wider">Encerrada</span>
                      )}
                      {canManagePolls && (
                        <button
                          onClick={() => handleTogglePollStatus(poll.id, poll.active)}
                          className="text-xs font-bold px-2 py-1 bg-slate-950 border border-slate-700 rounded hover:border-slate-500 text-slate-300 transition-colors"
                        >
                          {poll.active ? "Encerrar" : "Reabrir"}
                        </button>
                      )}
                    </div>
                  </div>

                  {totalVotes > 0 ? (
                    <div className="h-48 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                          <Tooltip 
                            cursor={{ fill: '#0f172a' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl">
                                    <p className="text-xs font-bold text-slate-300 mb-1">{payload[0].payload.fullName}</p>
                                    <p className="text-sm font-bold text-teal-400">{payload[0].value} voto{payload[0].value !== 1 ? 's' : ''}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="votos" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center border-t border-slate-800/50 mt-4">
                      <span className="text-xs text-slate-500">Aguardando votos...</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Criação de Enquete */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                Criar Nova Enquete
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider block mb-1.5">Pergunta da Enquete *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Qual o melhor dia para a confraternização?"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider block mb-1.5 flex justify-between">
                  <span>Opções de Resposta *</span>
                  <span className="text-slate-500 font-normal normal-case">Mínimo 2 opções</span>
                </label>
                <div className="space-y-2">
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Opção ${i + 1}`}
                        className="flex-grow px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-teal-500"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[i] = e.target.value;
                          setNewOptions(updated);
                        }}
                      />
                      {newOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setNewOptions(newOptions.filter((_, idx) => idx !== i))}
                          className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-red-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {newOptions.length < 10 && (
                  <button
                    type="button"
                    onClick={() => setNewOptions([...newOptions, ""])}
                    className="mt-3 text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Opção
                  </button>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 text-sm font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newQuestion.trim() || newOptions.filter(o => o.trim()).length < 2}
                  className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 px-6 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  {isSubmitting ? "Publicando..." : "Publicar Enquete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
