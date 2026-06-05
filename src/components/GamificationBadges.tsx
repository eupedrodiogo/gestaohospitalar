import { Award, Target, Flame, CheckCircle2 } from "lucide-react";

interface GamificationBadgesProps {
  progress: number;
  checkinsCount: number;
  status: string;
}

export default function GamificationBadges({
  progress,
  checkinsCount,
  status,
}: GamificationBadgesProps) {
  const isCompleted = status === "Aprovado Final";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {/* Badge: First steps */}
      <div
        className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 ${progress > 20 ? "bg-teal-500/10 border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.15)]" : "bg-slate-900 border-slate-800 opacity-50 grayscale"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${progress > 20 ? "bg-teal-500 text-slate-950 shadow-[0_0_10px_rgba(45,212,191,0.5)]" : "bg-slate-800 text-slate-500"}`}
        >
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h5 className="font-bold text-[10px] uppercase tracking-wider text-slate-200">
            Primeiros Passos
          </h5>
          <p className="text-[9px] text-slate-400">Iniciou o PDI</p>
        </div>
      </div>

      {/* Badge: Planner */}
      <div
        className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 ${progress === 100 ? "bg-teal-500/10 border-teal-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]" : "bg-slate-900 border-slate-800 opacity-50 grayscale"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${progress === 100 ? "bg-teal-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "bg-slate-800 text-slate-500"}`}
        >
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h5 className="font-bold text-[10px] uppercase tracking-wider text-slate-200">
            Planejador
          </h5>
          <p className="text-[9px] text-slate-400">100% Preenchido</p>
        </div>
      </div>

      {/* Badge: Consistency */}
      <div
        className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 ${checkinsCount > 0 ? "bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]" : "bg-slate-900 border-slate-800 opacity-50 grayscale"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${checkinsCount > 0 ? "bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-slate-800 text-slate-500"}`}
        >
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <h5 className="font-bold text-[10px] uppercase tracking-wider text-slate-200">
            Consistência
          </h5>
          <p className="text-[9px] text-slate-400">Feedback Contínuo</p>
        </div>
      </div>

      {/* Badge: Final Approval */}
      <div
        className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 ${isCompleted ? "bg-teal-500/10 border-teal-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "bg-slate-900 border-slate-800 opacity-50 grayscale"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? "bg-teal-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" : "bg-slate-800 text-slate-500"}`}
        >
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h5 className="font-bold text-[10px] uppercase tracking-wider text-slate-200">
            Certificado
          </h5>
          <p className="text-[9px] text-slate-400">PDI Aprovado</p>
        </div>
      </div>
    </div>
  );
}
