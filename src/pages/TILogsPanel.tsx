import React from 'react';
import { Database, Filter, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export default function TILogsPanel() {
  const logs = [
    { id: 1, type: 'info', message: 'Sistema iniciado no ambiente de produção.', time: '28/05/2026 12:00:01', source: 'Core' },
    { id: 2, type: 'warning', message: 'Falha de sincronização no nó secundário.', time: '28/05/2026 11:45:12', source: 'SyncEngine' },
    { id: 3, type: 'error', message: 'Acesso negado: Tentativa de login inválida repetida.', time: '28/05/2026 11:15:40', source: 'AuthModule' },
    { id: 4, type: 'info', message: 'Backup diário concluído com sucesso (3.2 GB).', time: '28/05/2026 03:00:00', source: 'Storage' },
    { id: 5, type: 'info', message: 'Atualização de política de segurança carregada.', time: '27/05/2026 23:30:10', source: 'Security' },
  ];

  return (
    <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
          <Database className="w-6 h-6 text-teal-400" />
          Arquitetura &amp; Logs
        </h2>
        <p className="text-slate-400 text-sm">Visualização de logs do sistema e status de componentes.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Status da<br className="sm:hidden" /> API</span>
          <div className="mt-2">
            <span className="text-teal-400 text-xl sm:text-2xl font-display font-bold block">Online</span>
            <span className="text-slate-500 text-[9px] sm:text-[11px] line-clamp-1 leading-tight mt-1">Uptime: 99.99%</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Erros<br className="sm:hidden" /> (24h)</span>
          <div className="mt-2">
            <span className="text-teal-400 text-xl sm:text-2xl font-display font-bold block">3</span>
            <span className="text-slate-500 text-[9px] sm:text-[11px] line-clamp-1 leading-tight mt-1">-12% em relação a ontem</span>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-tight">Armazenamento<br className="sm:hidden" /> local</span>
          <div className="mt-2">
            <span className="text-slate-200 text-xl sm:text-2xl font-display font-bold block">4.1 GB</span>
            <span className="text-slate-500 text-[9px] sm:text-[11px] line-clamp-1 leading-tight mt-1">82% utilizado</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden font-mono text-sm relative">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
          <span className="text-slate-300 font-bold font-sans">Terminal de Eventos</span>
          <button className="text-slate-400 hover:text-teal-400 flex items-center gap-1 font-sans text-xs transition-colors">
            <Filter className="w-3 h-3" />
            Filtrar
          </button>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto max-h-[400px]">
          {logs.map(log => (
            <div key={log.id} className="flex gap-4 items-start py-1 border-b border-slate-800/30 last:border-0 hover:bg-slate-900/50 px-2 rounded -mx-2">
              <span className="text-slate-500 shrink-0 select-none">[{log.time}]</span>
              <span className="text-slate-600 shrink-0 w-24">[{log.source}]</span>
              <span className="flex-grow flex items-center gap-2">
                {log.type === 'info' && <Info className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                {log.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                {log.type === 'error' && <ShieldAlert className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                <span className={`
                  ${log.type === 'info' ? 'text-slate-300' : ''}
                  ${log.type === 'warning' ? 'text-teal-300' : ''}
                  ${log.type === 'error' ? 'text-teal-400 font-bold' : ''}
                `}>
                  {log.message}
                </span>
              </span>
            </div>
          ))}
          <div className="flex gap-2 items-center py-2 text-slate-500">
            <span className="animate-pulse">_</span>
            Aguardando novos eventos...
          </div>
        </div>
      </div>
    </div>
  );
}
