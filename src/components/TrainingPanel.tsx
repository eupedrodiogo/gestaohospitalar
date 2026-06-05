import React, { useState } from "react";
import { BookOpen, ExternalLink, PlayCircle, CheckCircle2, Award, Users, TrendingUp, Presentation, AlertCircle, Clock, Play, RefreshCcw, X, Printer } from "lucide-react";

interface TrainingPanelProps {
  userName: string;
  userRole?: string;
}

export default function TrainingPanel({ userName, userRole }: TrainingPanelProps) {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courses, setCourses] = useState([
    {
      id: "course_1",
      title: "Segurança do Paciente e Prevenção de Eventos Adversos",
      description:
        "Treinamento obrigatório abordando os 6 protocolos internacionais de segurança do paciente para o ambiente hospitalar.",
      platform: "Plataforma Interna",
      videoId: "HttPzmSU1tg",
      duration: "4 horas",
      status: "completed",
    },
    {
      id: "course_2",
      title: "LGPD na Saúde: Tratamento de Dados Sensíveis",
      description:
        "Aprenda como aplicar as regras da Lei Geral de Proteção de Dados (LGPD) no dia a dia do atendimento ao paciente.",
      platform: "Plataforma Interna",
      videoId: "hOZCUY5SlEc",
      duration: "2 horas",
      status: "in_progress",
      progress: 60,
    },
    {
      id: "course_3",
      title: "Humanização no Atendimento em Saúde",
      description:
        "Técnicas de comunicação empática e ferramentas para melhorar a jornada de atendimento e recepção hospitalar.",
      platform: "Plataforma Interna",
      videoId: "IAgRw58Wsdo",
      duration: "3 horas",
      status: "pending",
    },
    {
      id: "course_4",
      title: "Prevenção e Controle de Infecção Hospitalar (SCIH)",
      description:
        "Boas práticas e rotinas fundamentais para a prevenção e controle de infecções baseadas nos guias da ANVISA.",
      platform: "Plataforma Interna",
      videoId: "ojC86IR5Uak",
      duration: "5 horas",
      status: "pending",
    },
  ]);

  const handleMarkAsCompleted = () => {
    if (!selectedCourse) return;
    setCourses(prev => prev.map(c => 
      c.id === selectedCourse.id 
        ? { ...c, status: "completed", progress: 100 } 
        : c
    ));
    setSelectedCourse((prev: any) => ({ ...prev, status: "completed", progress: 100 }));
  };

  if (userRole === "rh") {
    return (
      <div className="w-full xl:max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
              <Presentation className="w-6 h-6 text-teal-400" />
              Gestão de Treinamentos
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Visão gerencial da educação continuada e compliance dos 1.300 colaboradores da operação hospitalar.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold py-2 px-4 rounded-xl transition-all border border-slate-700">
              Relatórios
            </button>
            <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)] py-2 px-4 rounded-xl transition-all">
              Atribuir Curso
            </button>
          </div>
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 -rotate-12" />
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Compliance<br className="sm:hidden"/>Institucional</p>
            <div className="flex items-baseline gap-2 sm:gap-3 mt-1 sm:mt-2">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">82%</h3>
              <span className="text-[9px] sm:text-[10px] bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +5%
              </span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 rotate-12" />
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Horas de<br className="sm:hidden"/>Treinamento</p>
            <div className="flex items-baseline gap-2 sm:gap-3 mt-1 sm:mt-2">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">1.240</h3>
              <span className="text-[10px] sm:text-sm font-medium text-slate-500 -ml-1">hrs</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 rotate-6" />
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Trilhas em<br className="sm:hidden"/>Andamento</p>
            <div className="flex items-baseline gap-2 sm:gap-3 mt-1 sm:mt-2">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">345</h3>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 -rotate-12" />
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-2 leading-tight">Pendências<br className="sm:hidden"/>Críticas</p>
            <div className="flex items-baseline gap-1 sm:gap-3 mt-1 sm:mt-2">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-teal-400">18</h3>
              <span className="text-[9px] sm:text-sm font-medium text-slate-500 -ml-1 leading-tight"><span className="hidden sm:inline">colaboradores</span><span className="sm:hidden">colab.</span></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Courses */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-200 text-sm mb-4">Cursos Mais Realizados (Mês)</h3>
            <div className="space-y-4">
              {[
                { title: "Segurança do Paciente e Prevenção", concluidos: 142, andamento: 45 },
                { title: "LGPD na Saúde", concluidos: 98, andamento: 110 },
                { title: "Prevenção e Controle de Infecções (SCIH)", concluidos: 85, andamento: 20 },
                { title: "Humanização no Atendimento", concluidos: 64, andamento: 15 }
              ].map((course, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                  <span className="text-xs font-semibold text-slate-300">{course.title}</span>
                  <div className="flex items-center gap-3 text-[10px] font-bold">
                    <span className="text-teal-400 bg-teal-500/10 px-2 py-1 rounded w-20 text-center">{course.concluidos} Concluídos</span>
                    <span className="text-teal-400 bg-teal-500/10 px-2 py-1 rounded w-20 text-center">{course.andamento} Cursando</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-200 text-sm mb-4">Adesão por Setor</h3>
            <div className="space-y-4">
              {[
                { dept: "UTI Adulto", progress: 92 },
                { dept: "Pronto Atendimento", progress: 85 },
                { dept: "Ambulatório", progress: 78 },
                { dept: "Recepção / Apoio", progress: 65 },
                { dept: "Administrativo", progress: 60 }
              ].map((dept, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{dept.dept}</span>
                    <span className={dept.progress >= 80 ? "text-teal-400" : dept.progress >= 70 ? "text-teal-400" : "text-teal-600"}>{dept.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${dept.progress >= 80 ? "bg-teal-500" : dept.progress >= 70 ? "bg-teal-400" : "bg-teal-600"}`}
                      style={{ width: `${dept.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full xl:max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="card-gradient rounded-3xl p-6 border border-slate-800 shadow-xl glow-border">
        <h2 className="text-xl font-display font-semibold text-slate-100 flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          Treinamentos e Cursos
        </h2>
        <p className="text-sm text-slate-400 font-sans">
          Olá, {userName}. Aqui você tem acesso aos cursos e qualificações
          recomendadas para impulsionar seu PDI na nossa plataforma de
          desenvolvimento institucional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-md font-bold text-slate-200 uppercase tracking-wider text-xs mb-3 flex items-center gap-2 font-display">
            Trilhas Recomendadas
          </h3>
          
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-teal-500/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100">
                        {course.title}
                      </h4>
                      {course.status === "completed" && (
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Concluído
                        </span>
                      )}
                      {course.status === "in_progress" && (
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20">
                          <PlayCircle className="w-3 h-3" /> Em Andamento
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-400 leading-relaxed max-w-prose">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-slate-500 pt-2">
                      <span>Plataforma: {course.platform}</span>
                      <span>Carga Horária: {course.duration}</span>
                    </div>

                    {course.status === "in_progress" && (
                      <div className="pt-2">
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1 overflow-hidden">
                          <div
                            className="bg-teal-400 h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-teal-400">{course.progress}% concluído</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:pl-4 md:border-l border-slate-800 flex items-center justify-center shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase rounded-lg transition-colors border border-slate-700"
                    >
                      {course.status === "completed" ? "Revisar Conteúdo" : course.status === "in_progress" ? "Continuar Curso" : "Acessar Curso"}
                      {course.status === "completed" ? <RefreshCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-gradient p-5 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-slate-200 text-sm mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-400" /> Meu Progresso
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 text-center">
                <span className="block text-2xl font-display font-bold text-slate-100 mb-1">12h</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Carga Horária Anual</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 text-center">
                <span className="block text-2xl font-display font-bold text-slate-100 mb-1">1</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Curso Concluído</span>
              </div>
            </div>
          </div>
          
          <div className="card-gradient p-5 rounded-2xl border border-slate-800">
             <h3 className="font-bold text-slate-200 text-sm mb-2">
              Lembrete Institucional
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              A realização dos cursos institucionais recomendados impacta positivamente a avaliação do seu Plano de Desenvolvimento Individual. Recomendamos manter sua carga horária em dia.
            </p>
          </div>
        </div>
      </div>

      {/* Internal Video Player Modal Mock */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="bg-teal-500/10 text-teal-400 p-2 rounded-xl">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">{selectedCourse.title}</h3>
                  <p className="text-xs text-slate-400">Plataforma Interna</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative flex-grow bg-black aspect-video flex items-center justify-center overflow-hidden group">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube-nocookie.com/embed/${selectedCourse.videoId}?modestbranding=1&rel=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&playsinline=1&autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="scale-[1.02] pointer-events-auto"
              ></iframe>
              
              {/* Invisible overlays to block clicking on YouTube native UI elements */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-transparent z-10 cursor-pointer" onClick={(e) => e.stopPropagation()}></div>
              <div className="absolute bottom-0 right-0 w-64 h-20 bg-transparent z-10 cursor-pointer" onClick={(e) => e.stopPropagation()}></div>
              <div className="absolute bottom-0 left-0 w-32 h-16 bg-transparent z-10 cursor-pointer" onClick={(e) => e.stopPropagation()}></div>
            </div>
            
            <div className="p-6 bg-slate-900 overflow-y-auto">
              <h4 className="font-bold text-slate-200 mb-2">Sobre este módulo</h4>
              <p className="text-sm text-slate-400 mb-6">
                {selectedCourse.description}
              </p>
              
              <div className="flex gap-4">
                {selectedCourse.status !== "completed" && (
                  <button 
                    onClick={handleMarkAsCompleted}
                    className="px-6 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl hover:bg-teal-400 transition-colors"
                  >
                    Marcar como concluído
                  </button>
                )}
                {selectedCourse.status === "completed" && (
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-slate-200 font-bold rounded-xl hover:bg-slate-700 transition-colors border-2 border-slate-700"
                  >
                    <Printer className="w-5 h-5" />
                    Imprimir Certificado
                  </button>
                )}
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="px-6 py-2 bg-slate-800 text-slate-200 font-bold rounded-xl hover:bg-slate-700 transition-colors ml-auto"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
          
          {/* Printable Certificate Template */}
          <div id="print-certificate" className="hidden print:flex flex-col items-center justify-center h-full bg-white p-12 w-full text-slate-900 border-8 border-double border-teal-800 relative z-50">
            <div className="flex w-full items-center justify-between border-b pb-8 border-slate-300">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-teal-800 text-white flex items-center justify-center rounded-full font-bold text-2xl">
                  HSF
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-serif text-teal-900">Hospital São Francisco</h1>
                  <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase">Na Providência de Deus</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-widest">Certificado</h2>
                <p className="text-sm text-slate-500 font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center text-center py-20 w-3/4 mx-auto space-y-10">
              <h3 className="text-5xl font-serif text-teal-900 leading-tight">Certificado de Conclusão</h3>
              
              <p className="text-2xl text-slate-700">Certificamos para os devidos fins que</p>
              
              <h4 className="text-4xl font-bold text-slate-900 border-b-2 border-teal-500 pb-2 px-10 inline-block uppercase">
                {userName.replace(/\s*\(.*\)\s*/g, '')}
              </h4>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                concluiu com êxito o treinamento institucional corporativo <br/>
                <strong className="text-3xl text-teal-800 block mt-4 mb-2">{selectedCourse.title}</strong>
                com carga horária total de <strong>{selectedCourse.duration}</strong>, promovido pela plataforma de desenvolvimento institucional.
              </p>
            </div>
            
            <div className="w-full pt-12 flex items-end justify-between mt-auto px-10">
              <div>
                <p className="text-lg font-bold text-slate-800">Data de Conclusão</p>
                <p className="text-slate-600 font-mono text-xl">{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="text-center">
                <div className="border-b-2 border-slate-800 w-64 mx-auto mb-2 relative">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-30 pointer-events-none">
                    <Award className="w-16 h-16 text-teal-900" />
                  </div>
                </div>
                <p className="font-bold text-slate-800 text-lg">Diretoria Geral</p>
                <p className="text-slate-500 text-sm">Hospital São Francisco</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
