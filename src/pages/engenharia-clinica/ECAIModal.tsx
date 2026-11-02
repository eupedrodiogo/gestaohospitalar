import React from 'react';
import { X, BrainCircuit, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  data: {
    summary: string;
    recommendations: string[];
    riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Desconhecido';
  } | null;
}

const riskConfig = {
  Baixo: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', icon: CheckCircle2 },
  Médio: { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', icon: AlertTriangle },
  Alto: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', icon: AlertTriangle },
  Desconhecido: { color: 'text-slate-400', bg: 'bg-slate-400/10 border-slate-400/30', icon: AlertTriangle },
};

export const ECAIModal: React.FC<Props> = ({ isOpen, onClose, isLoading, data }) => {
  if (!isOpen) return null;

  const risk = data?.riskLevel ?? 'Desconhecido';
  const cfg = riskConfig[risk] || riskConfig['Desconhecido'];
  const RiskIcon = cfg.icon;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!isLoading ? onClose : undefined} />
      <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-teal-900/40 to-cyan-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <BrainCircuit className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Análise de IA</h2>
              <p className="text-xs text-slate-400">Engenharia Clínica — Diagnóstico de OS</p>
            </div>
          </div>
          {!isLoading && (
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-12 w-12 text-teal-400 animate-spin" />
              <p className="text-slate-300 font-medium">Analisando dados...</p>
              <p className="text-slate-500 text-sm text-center">A IA está processando suas ordens de serviço e identificando padrões de risco.</p>
            </div>
          ) : data ? (
            <div className="space-y-5">
              {/* Risk Level */}
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${cfg.bg}`}>
                <RiskIcon className={`h-6 w-6 ${cfg.color} shrink-0`} />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Nível de Risco Global</p>
                  <p className={`text-lg font-bold ${cfg.color}`}>{risk}</p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">Resumo</h3>
                <p className="text-slate-200 text-sm leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  {data.summary}
                </p>
              </div>

              {/* Recommendations */}
              {data.recommendations?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">Recomendações</h3>
                  <ul className="space-y-2">
                    {data.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 text-sm text-slate-200">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-xs flex items-center justify-center font-bold mt-0.5">
                          {i + 1}
                        </span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">Nenhum dado disponível.</p>
          )}
        </div>

        {!isLoading && (
          <div className="px-6 py-4 border-t border-slate-700/50 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors text-sm">
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ECAIModal;
