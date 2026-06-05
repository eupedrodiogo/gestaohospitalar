import React, { useState } from 'react';
import { Heart, Send, CheckCircle2, ListTodo, Presentation, Play } from 'lucide-react';

export default function ClimateSurveyPanel({ userRole, userName }: { userRole: string; userName: string }) {
  const [activeSurvey, setActiveSurvey] = useState(true);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (score !== null) {
      setSubmitted(true);
      setActiveSurvey(false);
    }
  };

  const startNewSurvey = () => {
    setActiveSurvey(true);
    setSubmitted(false);
    setScore(null);
    setFeedback("");
    alert("Nova Pesquisa de Clima disparada para todos os colaboradores.");
  };

  return (
    <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
          <Heart className="w-6 h-6 text-teal-400" />
          Clima Organizacional (eNPS)
        </h2>
        <p className="text-slate-400 text-sm">Pesquisa trimestral de engajamento e satisfação.</p>
      </div>

      {userRole === "rh" ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Painel de Controle de Pesquisas</h3>
              <p className="text-sm text-slate-400">Gerencie campanhas de eNPS ativas.</p>
            </div>
            <button 
              onClick={startNewSurvey}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              Disparar Nova Pesquisa
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden group">
              <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Total de<br className="sm:hidden" /> Envios</span>
              <div className="mt-2">
                <span className="text-teal-400 text-xl sm:text-2xl font-display font-bold block">142</span>
                <span className="text-slate-500 text-[9px] sm:text-[11px] line-clamp-1 leading-tight mt-1">Colaboradores ativos</span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden group">
              <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Respondidas</span>
              <div className="mt-2">
                <span className="text-teal-400 text-xl sm:text-2xl font-display font-bold block">89</span>
                <span className="text-slate-500 text-[9px] sm:text-[11px] line-clamp-1 leading-tight mt-1">62.6% engajamento</span>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden group">
              <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Pendentes</span>
              <div className="mt-2">
                <span className="text-teal-400 text-xl sm:text-2xl font-display font-bold block">53</span>
                <span className="text-slate-500 text-[9px] sm:text-[11px] line-clamp-1 leading-tight mt-1">Aguardando resposta</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {activeSurvey && !submitted && (
            <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(20,184,166,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-teal-500/10 text-teal-400 px-3 py-1 rounded-bl-xl font-bold text-xs border-b border-l border-teal-500/20">
                ATIVA
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Pesquisa Q2 2026</h3>
              <p className="text-slate-400 mb-8 max-w-2xl">
                Olá, {userName}. Sua opinião é fundamental para melhorarmos continuamente. 
                <strong>Esta pesquisa é 100% anônima.</strong> De 0 a 10, o quanto você recomendaria o 
                hospital como um bom lugar para trabalhar?
              </p>

              <div className="flex flex-wrap justify-between gap-2 max-w-2xl mx-auto mb-8">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setScore(num)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all text-sm
                      ${score === num 
                        ? "bg-teal-500 text-slate-950 scale-110 shadow-[0_0_15px_rgba(20,184,166,0.4)]" 
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
                <div className="w-full flex justify-between px-2 text-xs text-slate-500 font-medium mt-2">
                  <span>0 - Não recomendaria</span>
                  <span>10 - Com certeza recomendaria</span>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <label className="text-sm font-bold text-slate-300 block">
                  O que motiva a sua nota? (Opcional)
                </label>
                <textarea
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 outline-none focus:border-teal-500/50 resize-none h-24 text-sm transition-colors"
                  placeholder="Deixe aqui seus comentários sugestões de melhoria..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    disabled={score === null}
                    onClick={handleSubmit}
                    className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Pesquisa Anônima
                  </button>
                </div>
              </div>
            </div>
          )}

          {submitted && (
            <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Obrigado pela sua contribuição!</h3>
              <p className="text-slate-400 max-w-md">
                Seu feedback anônimo foi registrado com sucesso. 
                Ele nos ajuda a construir um ambiente de trabalho cada vez melhor.
              </p>
            </div>
          )}

          {!activeSurvey && !submitted && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 py-16">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                <ListTodo className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Nenhuma pesquisa ativa no momento</h3>
              <p className="text-slate-400">Você será notificado quando a próxima Pesquisa de Clima estiver disponível.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
