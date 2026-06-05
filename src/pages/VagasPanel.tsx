import React, { useState } from 'react';
import { Briefcase, Plus, MapPin, Building, Clock, CheckCircle2, Users } from 'lucide-react';

type Vaga = {
  id: number;
  title: string;
  department: string;
  type: string;
  location: string;
  postedAt: string;
  candidates: number;
  status: 'aberta' | 'fechada';
};

export default function VagasPanel({ userRole, userName }: { userRole: string; userName: string }) {
  const [vagas, setVagas] = useState<Vaga[]>([
    { id: 1, title: 'Enfermeiro(a) Sênior - UTI', department: 'Enfermagem', type: 'Tempo Integral', location: 'Unidade Central', postedAt: '20/05/2026', candidates: 4, status: 'aberta' },
    { id: 2, title: 'Coordenador(a) de Qualidade', department: 'Qualidade e Segurança', type: 'Tempo Integral', location: 'Administrativo', postedAt: '25/05/2026', candidates: 12, status: 'aberta' },
    { id: 3, title: 'Recepcionista Pleno', department: 'Atendimento', type: 'Tempo Integral', location: 'Unidade Norte', postedAt: '27/05/2026', candidates: 0, status: 'aberta' },
  ]);

  const [applied, setApplied] = useState<Record<number, boolean>>({});

  const handleApply = (id: number) => {
    setApplied(prev => ({ ...prev, [id]: true }));
    setVagas(prev => prev.map(v => v.id === id ? { ...v, candidates: v.candidates + 1 } : v));
    alert('Candidatura enviada com sucesso! Seu histórico de avaliações (PDI) foi anexado automaticamente e enviado ao RH para análise.');
  };

  return (
    <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-teal-400" />
          Vagas Internas
        </h2>
        <p className="text-slate-400 text-sm">Oportunidades de promoção e transferência exclusivas para os 1.300 colaboradores do HSF.</p>
      </div>

      {userRole === "rh" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Painel do Recrutador</h3>
              <p className="text-sm text-slate-400">Gerencie as vagas internas abertas.</p>
            </div>
            <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Publicar Vaga
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden group">
              <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Vagas<br className="sm:hidden" /> Abertas</span>
              <div className="mt-1 sm:mt-2">
                <span className="text-teal-400 text-xl sm:text-2xl font-display font-bold block">{vagas.filter(v => v.status === 'aberta').length}</span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden group">
              <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Candidaturas<br className="sm:hidden" /> Ativas</span>
              <div className="mt-1 sm:mt-2">
                <span className="text-teal-400 text-xl sm:text-2xl font-display font-bold block">{vagas.reduce((acc, curr) => acc + curr.candidates, 0)}</span>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden group">
              <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Entrevistas<br className="sm:hidden" /> Agendadas</span>
              <div className="mt-1 sm:mt-2">
                <span className="text-teal-400 text-xl sm:text-2xl font-display font-bold block">5</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vagas.map((vaga) => (
          <div key={vaga.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-teal-500/30 transition-colors">
            <div className="p-6 flex-grow flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100">{vaga.title}</h3>
                <span className="text-teal-400 text-sm font-medium">{vaga.department}</span>
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-slate-400">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500" /> {vaga.location}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" /> {vaga.type}</span>
              </div>

              {userRole === 'rh' ? (
                <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4 text-teal-400" />
                    <strong>{vaga.candidates}</strong> candidaturas
                  </div>
                  <button className="text-teal-400 font-medium hover:text-teal-300 transition-colors">
                    Ver Candidatos
                  </button>
                </div>
              ) : (
                <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between text-sm">
                  <span className="text-slate-500 text-xs">Publicado em {vaga.postedAt}</span>
                  {applied[vaga.id] ? (
                    <span className="flex items-center gap-1 text-teal-400 font-bold bg-teal-500/10 px-3 py-1 rounded-full text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      Inscrito
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleApply(vaga.id)}
                      className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-1.5 rounded-lg font-bold transition-colors text-xs"
                    >
                      Candidatar-se
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
