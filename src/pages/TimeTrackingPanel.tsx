import { useState } from "react";
import { 
  Calendar as CalendarIcon, Clock, UserCheck, UserX, AlertTriangle, 
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, MapPin, 
  Camera, Plus, Search, Filter, ShieldCheck, PlaySquare
} from "lucide-react";

interface TimeTrackingPanelProps {
  userRole: "colaborador" | "lider" | "rh" | "medico" | string;
  userName: string;
}

export default function TimeTrackingPanel({ userRole, userName }: TimeTrackingPanelProps) {
  const isLeader = userRole === "lider" || userRole === "rh";
  const [activeSubTab, setActiveSubTab] = useState<string>(isLeader ? "dashboard" : "resumo");

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-teal-400" />
            Gestão de Escalas
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isLeader 
              ? "Gerencie plantões, visualize check-ins em tempo real e consolide horários." 
              : "Visualize sua escala, saldo de horas e registre seu check-in de plantão."}
          </p>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg w-full md:w-auto overflow-x-auto overflow-y-hidden">
          {(isLeader
            ? ["dashboard", "mensal", "semanal", "profissionais"]
            : ["resumo", "calendário"]
          ).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                activeSubTab === tab 
                  ? "bg-teal-500/10 text-teal-400" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLeader ? (
        activeSubTab === "dashboard" ? <LeaderDashboardView /> :
        activeSubTab === "semanal" ? <WeeklyScheduleView /> :
        activeSubTab === "mensal" ? <MonthlyScheduleView /> :
        <ProfessionalsView />
      ) : (
        activeSubTab === "calendário" ? <EmployeeCalendarView /> : <EmployeeView userName={userName} />
      )}
    </div>
  );
}

function EmployeeView({ userName }: { userName: string }) {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const handleCheckIn = () => {
    setIsCheckingIn(true);
    setTimeout(() => {
      setHasCheckedIn(true);
      setIsCheckingIn(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Check-in Action Card */}
        <div className="md:col-span-1 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group bg-gradient-to-br from-slate-900 to-slate-800/80 shadow-xl flex flex-col justify-center items-center text-center">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500/0 via-teal-500 to-teal-500/0 opacity-50"></div>
          
          <h3 className="font-display font-bold text-lg text-slate-100 mb-2">Seu Plantão Atual</h3>
          <p className="text-sm text-slate-400 mb-6">Pronto Socorro - 12h Diurno (07:00 - 19:00)</p>
          
          {hasCheckedIn ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4 border border-teal-500/30">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-teal-400">Check-in Confirmado</h4>
              <p className="text-xs text-slate-400 mt-1">Localização e biometria validadas às 06:55</p>
            </div>
          ) : (
            <button 
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className="w-full relative group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-teal-400 rounded-xl blur opacity-30 group-hover/btn:opacity-60 transition duration-500"></div>
              <div className="relative bg-teal-500 hover:bg-teal-400 transition-colors rounded-xl p-4 flex flex-col items-center gap-2 border border-teal-300">
                {isCheckingIn ? (
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    Validando GPS e Câmera...
                  </div>
                ) : (
                  <>
                    <PlaySquare className="w-8 h-8 text-slate-900" />
                    <span className="font-bold text-slate-900 text-lg">Fazer Check-in</span>
                    <div className="flex gap-4 text-slate-800 text-xs mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> GPS Requerido</span>
                      <span className="flex items-center gap-1"><Camera className="w-3 h-3"/> Foto Requerida</span>
                    </div>
                  </>
                )}
              </div>
            </button>
          )}
        </div>

        {/* Resumo */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/50 flex flex-col justify-between">
            <h4 className="text-xs uppercase font-bold text-slate-400">Próximos Plantões</h4>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between border-l-2 border-teal-500 pl-3">
                 <div>
                   <p className="text-sm font-bold text-slate-200">Amanhã</p>
                   <p className="text-xs text-slate-500">12x36 - Noturno (19:00 às 07:00)</p>
                 </div>
                 <span className="text-xs font-bold text-teal-400 bg-teal-400/10 px-2 py-1 rounded">PS Adulto</span>
              </div>
              <div className="flex items-center justify-between border-l-2 border-slate-700 pl-3 opacity-60">
                 <div>
                   <p className="text-sm font-bold text-slate-200">08 de Junho</p>
                   <p className="text-xs text-slate-500">12x36 - Noturno (19:00 às 07:00)</p>
                 </div>
                 <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">PS Adulto</span>
              </div>
            </div>
          </div>
          
          <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/50 flex flex-col justify-between">
            <h4 className="text-xs uppercase font-bold text-slate-400">Banco de Horas</h4>
            <div className="mt-4">
              <p className="text-3xl font-display font-bold text-teal-400">+12:30</p>
              <p className="text-sm text-slate-500 mt-1">Saldo positivo no mês de Junho</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-300 py-2 rounded-lg transition-colors">Solicitar Folga</button>
                <button className="flex-1 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-300 py-2 rounded-lg transition-colors">Ver Extrato</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderDashboardView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50">
          <h4 className="text-xs uppercase font-bold text-slate-400 flex items-center justify-between">
            Plantão Atual
            <UserCheck className="w-4 h-4 text-teal-400" />
          </h4>
          <p className="text-2xl font-display font-bold text-slate-100 mt-2">18 / 20</p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
             <div className="h-full bg-teal-500 rounded-full" style={{ width: '90%' }}></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide">Profissionais Check-in</p>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50">
          <h4 className="text-xs uppercase font-bold text-slate-400 flex items-center justify-between">
            Atrasos / Faltas
            <UserX className="w-4 h-4 text-red-400" />
          </h4>
          <p className="text-2xl font-display font-bold text-red-400 mt-2">2</p>
          <p className="text-[10px] text-slate-500 mt-3 uppercase tracking-wide">Necessita cobertura</p>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50">
          <h4 className="text-xs uppercase font-bold text-slate-400 flex items-center justify-between">
            Custos Estimados
            <AlertTriangle className="w-4 h-4 text-teal-400" />
          </h4>
          <p className="text-2xl font-display font-bold text-slate-100 mt-2">R$ 12.4K</p>
          <p className="text-[10px] text-slate-500 mt-3 uppercase tracking-wide">Plantão diurno de hoje</p>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50">
          <h4 className="text-xs uppercase font-bold text-slate-400 flex items-center justify-between">
            Conflitos Previstos
            <CalendarIcon className="w-4 h-4 text-orange-400" />
          </h4>
          <p className="text-2xl font-display font-bold text-orange-400 mt-2">3</p>
          <p className="text-[10px] text-slate-500 mt-3 uppercase tracking-wide">Na próxima semana</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/30">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-display font-semibold text-sm text-slate-200 uppercase tracking-wider">
               Check-ins Recentes (Ao Vivo)
             </h3>
             <span className="flex items-center gap-2 text-xs text-teal-400 font-bold">
               <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
               ONLINE
             </span>
           </div>
           
           <div className="space-y-3">
             {[
               { n: "Dr. João Silva", r: "Clínico Geral", s: "PS Adulto", t: "06:55", loc: true, img: true },
               { n: "Dra. Mariana Costa", r: "Pediatra", s: "PS Infantil", t: "06:58", loc: true, img: true },
               { n: "Enf. Carlos Mendes", r: "Enfermeiro", s: "UTI", t: "07:02", loc: false, img: true, warn: true },
               { n: "Tec. Amanda Souza", r: "Téc. Enfermagem", s: "Triagem", t: "07:05", loc: true, img: true }
             ].map((p, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${p.warn ? 'border-orange-500/20 bg-orange-500/5' : 'border-slate-800/50 bg-slate-900/50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
                      {p.n.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{p.n}</h4>
                      <p className="text-[10px] text-slate-500">{p.s}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-mono text-slate-300">{p.t}</span>
                    <div className="flex text-teal-400 gap-1">
                      {p.loc ? <MapPin className="w-3 h-3" /> : <MapPin className="w-3 h-3 text-orange-400" />}
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>
                </div>
             ))}
           </div>
         </div>

         <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/30">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-display font-semibold text-sm text-slate-200 uppercase tracking-wider">
               Furos na Escala (Atenção)
             </h3>
             <button className="text-xs text-teal-400 hover:text-teal-300 transition-colors">Ver Todos</button>
           </div>
           
           <div className="space-y-3">
             <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-4">
               <div className="p-2 bg-red-500/10 rounded-lg text-red-400 shrink-0">
                 <AlertTriangle className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <h4 className="text-xs font-bold text-slate-200">Falta não justificada</h4>
                 <p className="text-[10px] text-slate-400 mt-1">Dr. Henrique (Ortopedista) não realizou check-in e não atende contato.</p>
                 <div className="mt-3 flex gap-2">
                   <button className="text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded transition-colors">Tentar Contato</button>
                   <button className="text-[10px] font-bold bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 px-3 py-1 rounded transition-colors">Buscar Substituto</button>
                 </div>
               </div>
             </div>
             
             <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 flex items-start gap-4">
               <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 shrink-0">
                 <AlertTriangle className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <h4 className="text-xs font-bold text-slate-200">Atestado Recebido</h4>
                 <p className="text-[10px] text-slate-400 mt-1">Enf. Patricia enviou atestado para os próximos 3 dias (PS Adulto).</p>
                 <div className="mt-3">
                   <button className="text-[10px] font-bold bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 px-3 py-1 rounded transition-colors">Iniciar Remanejamento</button>
                 </div>
               </div>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}

function WeeklyScheduleView() {
  const days = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
  const dates = ["05", "06", "07", "08", "09", "10", "11"];
  
  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-900/50 flex flex-col overflow-hidden">
      {/* Tools */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"><ChevronLeft className="w-4 h-4"/></button>
            <span className="font-bold text-sm text-slate-200 uppercase">05 a 11 Junho 2026</span>
            <button className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"><ChevronRight className="w-4 h-4"/></button>
          </div>
          <select className="bg-slate-800 border-none text-xs rounded-lg text-slate-200 py-1.5 px-3">
            <option>Setor: Pronto Socorro</option>
            <option>Setor: UTI</option>
            <option>Setor: Centro Cirúrgico</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700">
            <Search className="w-3 h-3" /> Buscar
          </button>
          <button className="flex items-center gap-2 bg-teal-500 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
            <Plus className="w-3 h-3" /> Adicionar Plantão
          </button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[500px]">
        <div className="min-w-[900px] h-full flex flex-col">
          {/* Header Row */}
          <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-slate-800 bg-slate-900">
            <div className="p-3 border-r border-slate-800"></div>
            {days.map((d, i) => (
              <div key={d} className="p-3 border-r border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-500">{d}</p>
                <p className={`text-lg font-display font-medium ${i === 2 ? 'text-teal-400' : 'text-slate-200'}`}>{dates[i]}</p>
              </div>
            ))}
          </div>
          
          {/* Body Rows */}
          <div className="flex-1 overflow-y-auto">
            {["07:00 - 13:00", "13:00 - 19:00", "19:00 - 07:00"].map((shift, idx) => (
               <div key={idx} className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-slate-800/50">
                 <div className="p-3 border-r border-slate-800 bg-slate-900/80 flex items-center justify-center text-center">
                   <span className="text-[10px] font-bold text-slate-400 leading-tight">{shift}</span>
                 </div>
                 {[0,1,2,3,4,5,6].map(day => (
                   <div key={day} className="p-2 border-r border-slate-800/50 h-[120px] flex flex-col gap-2 hover:bg-slate-800/20 transition-colors">
                     {/* Mock Slots */}
                     {(day === 2 || day === 5 || (day === 4 && idx === 2)) ? (
                        <>
                          <div className="p-2 text-[10px] font-bold rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20 leading-tight">
                            Dr. Carlos<br/>(Clinico Geral)
                          </div>
                          {idx === 0 && day === 2 && (
                             <div className="p-2 text-[10px] font-bold rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/20 leading-tight flex items-center justify-between">
                               Falta Substituto
                               <AlertTriangle className="w-3 h-3" />
                             </div>
                          )}
                        </>
                     ) : (
                       <div className="flex-1 border-2 border-dashed border-slate-800 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-400 hover:border-slate-600 cursor-pointer transition-colors">
                         <Plus className="w-5 h-5 opacity-50" />
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthlyScheduleView() {
  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-900/50 p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
      <CalendarIcon className="w-16 h-16 text-slate-700 mb-4" />
      <h3 className="text-lg font-bold text-slate-300">Visão Mensal</h3>
      <p className="text-slate-500 text-sm mt-2 max-w-sm">
        A visão mensal completa com consolidação de horas e custos está sendo carregada na nova arquitetura.
      </p>
      <button className="mt-6 px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg text-sm font-bold transition-colors">
        Exportar Escala em Excel
      </button>
    </div>
  );
}

function ProfessionalsView() {
  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-900/50 p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
      <UserCheck className="w-16 h-16 text-slate-700 mb-4" />
      <h3 className="text-lg font-bold text-slate-300">Corpo Clínico e Profissionais</h3>
      <p className="text-slate-500 text-sm mt-2 max-w-sm">
        Gerencie valores hora/plantão, especialidades e restrições de escala para o corpo clínico.
      </p>
      <button className="mt-6 px-4 py-2 bg-teal-500 text-slate-900 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:bg-teal-400 transition-colors">
        Cadastrar Profissional
      </button>
    </div>
  );
}

function EmployeeCalendarView() {
  const [viewMode, setViewMode] = useState<"semana" | "mês">("semana");
  const days = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
  const dates = ["05", "06", "07", "08", "09", "10", "11"];
  
  // mock for month view
  const firstDayOffset = 3; // Starts on Thursday
  
  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-900/50 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"><ChevronLeft className="w-4 h-4"/></button>
            <span className="font-bold text-sm text-slate-200 uppercase">
              {viewMode === "semana" ? "05 a 11 Junho 2026" : "Junho 2026"}
            </span>
            <button className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"><ChevronRight className="w-4 h-4"/></button>
          </div>
        </div>
        <div className="flex gap-4 items-center">
           <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
             <button
               onClick={() => setViewMode("semana")}
               className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${viewMode === "semana" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"}`}
             >
               Semana
             </button>
             <button
               onClick={() => setViewMode("mês")}
               className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${viewMode === "mês" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"}`}
             >
               Mês
             </button>
           </div>
           <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors">
             <Filter className="w-3 h-3" /> Turnos
           </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {viewMode === "semana" ? (
          <div className="w-full h-full flex flex-col">
            {/* Header Row */}
            <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900">
              {days.map((d, i) => (
                <div key={d} className="p-1.5 sm:p-3 border-r border-slate-800 text-center last:border-r-0">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-500">{d.slice(0, 3)}</p>
                  <p className={`text-base sm:text-lg font-display font-medium ${i === 2 ? 'text-teal-400' : 'text-slate-200'}`}>{dates[i]}</p>
                </div>
              ))}
            </div>
            
            {/* Body Row (Full day slots for simplicity) */}
            <div className="flex-1 grid grid-cols-7">
              {[0,1,2,3,4,5,6].map(day => (
                <div key={day} className="p-1 sm:p-3 border-r border-slate-800/50 last:border-r-0 h-full min-h-[120px] sm:min-h-[150px] flex flex-col gap-1 sm:gap-2 hover:bg-slate-800/20 transition-colors">
                  {(day === 2 || day === 5) ? (
                     <div className="p-1.5 sm:p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 flex flex-col gap-1">
                       <span className="text-[8px] sm:text-[10px] font-bold tracking-wider text-teal-400 bg-teal-400/10 w-max px-1 sm:px-1.5 py-0.5 rounded">12x36</span>
                       <p className="text-[9px] sm:text-xs font-medium text-slate-300 leading-tight line-clamp-2">Pronto Socorro</p>
                       <p className="text-[8px] sm:text-[10px] text-slate-500 hidden sm:block">19:00 - 07:00</p>
                     </div>
                  ) : (
                     <div className="flex-1 rounded-lg border-2 border-dashed border-slate-800 flex items-center justify-center">
                       <span className="text-[8px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-wider hidden sm:block">Folga</span>
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            {/* Header Mês */}
            <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900">
              {days.map((d) => (
                <div key={d} className="py-2 border-r border-slate-800 text-center last:border-r-0">
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-500">{d.slice(0, 3)}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-5">
              {Array.from({length: 35}).map((_, i) => {
                const dayNum = i - firstDayOffset + 1;
                const isCurrentMonth = dayNum > 0 && dayNum <= 30;
                
                // Plantões nos dias 2, 8, 14, 20, 26 (exemplo)
                const hasShift = isCurrentMonth && [7, 10, 14, 20, 26].includes(dayNum);

                return (
                  <div key={i} className={`p-1 sm:p-2 border-r border-b border-slate-800/50 min-h-[80px] sm:min-h-[100px] flex flex-col gap-0.5 sm:gap-1 ${!isCurrentMonth ? 'bg-slate-900/30' : 'hover:bg-slate-800/20 transition-colors'}`}>
                    {isCurrentMonth && (
                      <span className={`text-[10px] sm:text-xs font-bold ${hasShift ? 'text-teal-400' : 'text-slate-400'}`}>{dayNum}</span>
                    )}
                    {hasShift && (
                      <div className="p-1 sm:p-1.5 rounded bg-teal-500/10 border border-teal-500/20 flex flex-col gap-0 sm:gap-0.5 mt-0.5 sm:mt-1 cursor-pointer hover:bg-teal-500/20 transition-colors">
                        <span className="text-[7.5px] sm:text-[9px] font-bold tracking-wider text-teal-400 line-clamp-1 leading-tight">PS</span>
                        <p className="text-[7.5px] sm:text-[9px] text-slate-500 hidden sm:block">19:00-07:00</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

