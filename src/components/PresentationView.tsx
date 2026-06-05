import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { 
  ChevronRight, 
  ChevronLeft, 
  Rocket, 
  Server, 
  TrendingDown, 
  Users, 
  CloudRain, 
  Database,
  Building,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lightbulb,
  Clock,
  CheckCircle,
  Briefcase,
  TrendingUp,
  FlaskConical,
  ShieldAlert,
  PlayCircle,
  FileSpreadsheet,
  RefreshCw,
  FileCode
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Line
} from "recharts";

const projectionMensal = [
  { mes: "Mês 1", OpexCloud: 300, MeuAumento: 2000, TotalOPEX: 2300, CapexEsperado: 50000 },
  { mes: "Mês 3", OpexCloud: 900, MeuAumento: 6000, TotalOPEX: 6900, CapexEsperado: 50000 },
  { mes: "Mês 6", OpexCloud: 1800, MeuAumento: 12000, TotalOPEX: 13800, CapexEsperado: 50000 },
  { mes: "Mês 12", OpexCloud: 3600, MeuAumento: 24000, TotalOPEX: 27600, CapexEsperado: 50000 },
];


export function PresentationView() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const slides = [
    {
      title: "Transformação Digital no HSF",
      subtitle: "Implementando inovação, eficiência e escalabilidade com tecnologia serverless.",
      icon: Rocket,
      content: (
        <div className="space-y-6 flex flex-col items-center text-center w-full">
          <div className="p-6 bg-teal-500/20 rounded-full mb-4">
            <Building className="w-20 h-20 text-teal-400" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-100 uppercase tracking-tight">
            Hospital São Francisco
          </h2>
          <p className="text-xl text-teal-400 font-medium tracking-wide">
            na Providência de Deus
          </p>
          <div className="max-w-2xl mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <p className="text-slate-300 leading-relaxed text-lg">
              Uma proposta de evolução tecnológica para conectar 1.300+ colaboradores, integrar processos do PDI ao Financeiro e preparar nossa infraestrutura para o futuro.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "O Cenário Atual & O Desafio",
      subtitle: "Compreendendo nossas limitações físicas e operacionais.",
      icon: Target,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          <div className="space-y-6">
            <div className="p-6 bg-slate-800/60 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
                <Server className="w-6 h-6 text-teal-400" /> Infraestrutura Limitada
              </h3>
              <p className="text-slate-300">
                Nosso servidor físico atual não suporta a carga de um aplicativo dinâmico para 1.300 colaboradores e dezenas de centros de custo. O custo de manter hardware on-premise é alto e inflexível.
              </p>
            </div>
            <div className="p-6 bg-slate-800/60 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-teal-400" /> Processos Manuais
              </h3>
              <p className="text-slate-300">
                Muitos processos (recrutamento, avaliações, feedbacks, escalas) dependem de sistemas segmentados ou planilhas, dificultando a análise de dados e a agilidade da gestão hospitalar.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Server className="w-32 h-32" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-2">Hospital em Números</h4>
              <ul className="space-y-4 relative z-10 mt-6">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="text-slate-200"><strong className="text-slate-100 text-lg">1.300+</strong> Colaboradores Ativos</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="text-slate-200"><strong className="text-slate-100 text-lg">260</strong> Leitos Totais (140 Ativos)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="text-slate-200"><strong className="text-slate-100 text-lg">70 a 90</strong> Centros de Custo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Solução Cloud: Vercel + Supabase",
      subtitle: "A arquitetura ideal para escalar com segurança e baixo custo inicial.",
      icon: CloudRain,
      content: (
        <div className="flex flex-col space-y-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supabase */}
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-500/60 transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-900/50 rounded-xl leading-none">
                    <Database className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-100">Supabase</h3>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-100 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                  Banco de Dados
                </span>
              </div>
              <p className="text-slate-200 mb-6 font-medium">BaaS open-source com PostgreSQL robusto, perfeito para dados relacionais complexos como escalas, centros de custo e PDIs.</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Autenticação Segura Integrada</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-500" /> Real-time subscriptions</li>
                <li className="flex items-center gap-2"><Database className="w-4 h-4 text-emerald-500" /> Banco relacional (SQL) ideal para saúde</li>
              </ul>
            </div>

            {/* Vercel */}
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 relative overflow-hidden group hover:border-slate-500 transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-900/50 rounded-xl leading-none text-slate-100">
                    <svg viewBox="0 0 76 65" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor"/></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-100">Vercel</h3>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-100 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                  Hospedagem / Frontend
                </span>
              </div>
              <p className="text-slate-200 mb-6 font-medium">Plataforma Serverless desenvolvida para o framework Next.js/React. Entrega a aplicação instantaneamente na nuvem.</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-slate-100" /> Deploy automático a cada atualização</li>
                <li className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-slate-100" /> Escala global automática (CDN)</li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-slate-100" /> Não precisa gerenciar infraestrutura</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/50">
             <div className="text-center mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-700/50">Tecnologia Confiada por Gigantes</span>
             </div>
             <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Meta */}
                <svg className="h-6" viewBox="0 0 464 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M78.68 18.59c-6.84-2.82-14.73-3.62-22.95-3.62-24.87 0-42.61 14.8-49.85 41.77-5.07-28.74-21.72-41.77-44.41-41.77-6.07 0-11.87 1.4-16.79 3.01v19.46c3.42-1.31 7.23-2.01 11.25-2.01 14.53 0 20.97 8.35 17.51 30.68L-52 100H-19.4L1 18.5c0-1.6 0-2.4 1.2-2.4 2 0 5.6 3.6 5.6 15.6V100h32v-65.7c0-11.604 2.8-15.6 5.6-15.6 1.2 0 1.2.8 1.2 2.4l-19.6 78.9h32.4l20.4-81.41zM111.41 14.97c27.69 0 44.92 18.3 44.92 42.48s-17.23 42.55-44.92 42.55c-27.13 0-44.75-18.37-44.75-42.55s17.62-42.48 44.75-42.48zm0 65.65c9.92 0 14.28-7.9 14.28-23.17 0-14.86-4.36-22.69-14.28-22.69-9.52 0-13.88 7.83-13.88 22.69 0 15.27 4.36 23.17 13.88 23.17zM200 18.5l-20.4 81.5H147.2l20.4-81.5zm19.69-13.6L223.4 0h-32l-3.71 4.9zm13.11 13.6c-13.48 0-25.13 8.31-29.35 15.9l-16.5 65.6H219.6l20.4-81.5zm44.2 81.5c10.45 0 20.37-2.91 28.59-7.24L301.62 76c-8.94 4.53-17.63 7.03-26.68 7.03-12.79 0-19.06-8.58-16.74-27.3.2-1.61.38-3.08.55-4.48h45.24c.73-5.32 1.09-10.37 1.09-15.02 0-24.18-12.18-36.23-33.84-36.23-28.16 0-45.98 19.3-51.27 45.4C213.9 76.5 233.15 100 263.22 100zm6.54-62.44c11.05 0 16.32 7.15 16.32 18.2 0 2.2-.18 4.67-.54 7.27h-28.71C254.91 44.59 260.1 37.56 269.76 37.56z" fill="#f1f5f9"/></svg>
                {/* Mozilla */}
                <span className="text-2xl font-bold font-serif italic text-slate-200">Mozilla</span>
                {/* 1Password */}
                <span className="text-xl font-bold text-slate-200">1Password</span>
                {/* Under Armour */}
                <span className="text-lg font-black tracking-widest text-slate-200">UNDER ARMOUR</span>
                {/* PwC */}
                <span className="text-2xl font-serif font-black text-slate-200 tracking-tighter">pwc</span>
                {/* Nextjs implicitly */}
                <svg className="h-6" viewBox="0 0 180 180" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M90 171.3C45.1 171.3 8.7 134.9 8.7 90C8.7 45.1 45.1 8.7 90 8.7C134.9 8.7 171.3 45.1 171.3 90C171.3 134.9 134.9 171.3 90 171.3ZM90 0C40.3 0 0 40.3 0 90C0 139.7 40.3 180 90 180C139.7 180 180 139.7 180 90C180 40.3 139.7 0 90 0ZM145.4 126.7L145.3 126.6C145.3 126.5 145.2 126.4 145.2 126.2C130.4 105 104.9 66.8 68.6 14.8C67.6 13.5 66.2 12.8 64.7 12.8H53.5C51.1 12.8 49.6 15 50.4 17.2L116 117.8L61.6 30H50L112.5 130.6L143 176C144.3 178 147 178.6 148.9 177.3C150.9 175.9 151.4 173.2 150.1 171.3L145.4 126.7ZM148.2 30H136.6L84.8 113.8H96.4L148.2 30Z" fill="#f1f5f9"/></svg>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Análise Financeira: CAPEX vs OPEX",
      subtitle: "Por que a nuvem é a decisão financeira mais inteligente.",
      icon: TrendingDown,
      content: (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
          
          {/* Top text cards collapsed slightly to save space */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2"><Server className="w-4 h-4 text-slate-500" /> Servidor Físico + Dev (Tradicional)</h3>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full text-[10px] font-bold border border-slate-700">CAPEX Alto</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Investimento imediato de <strong>~R$ 50.000</strong> em hardware e licenças, + contratação de desenvolvedor sênior de mercado. Depreciação rápida e custos de manutenção física contínuos.
              </p>
            </div>
            
            <div className="p-4 bg-teal-950/20 rounded-2xl border border-teal-500/20 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm md:text-base font-bold text-teal-400 flex items-center gap-2"><CloudRain className="w-4 h-4" /> Nuvem + Promoção Interna</h3>
                <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded-full text-[10px] font-bold">OPEX Sustentável</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Infraestrutura na nuvem (<strong>~R$ 300/mês</strong>) + Promoção interna. Custo marginal super barato, escala infinita e infraestrutura já autogerenciada sem dores de cabeça.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* The Promotion Box */}
            <div className="md:col-span-1 p-5 md:p-6 bg-slate-800/60 border border-slate-700 rounded-2xl flex flex-col shadow-[0_0_30px_rgba(45,212,191,0.02)]">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                <h4 className="text-base font-bold text-slate-100">Impacto da Promoção</h4>
              </div>
              <p className="text-xs text-slate-400 mb-5">
                Passando da função de Almoxarifado para liderar a Inovação/Tecnologia internamente, retemos o conhecimento no HSF sem custos de consultoria externa.
              </p>
              
              <div className="space-y-3 mt-auto">
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                  <span className="text-xs font-semibold text-slate-400">Salário Atual (Almoxarifado)</span>
                  <span className="text-sm font-medium text-slate-300">R$ 2.500</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                  <span className="text-xs font-semibold text-teal-400/80">Novo Salário (Ex: Inovação)</span>
                  <span className="text-sm font-bold text-teal-400">~ R$ 4.500</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold text-slate-100 uppercase tracking-widest">Impacto Mensal Real</span>
                  <span className="text-base font-black text-slate-100 p-1 px-2 rounded bg-slate-700/50">+ R$ 2.000</span>
                </div>
                <div className="text-[10px] text-center text-slate-500 mt-2">
                  (R$ 2.000 salarial + R$ 300 nuvem = R$ 2.300/mês total)
                </div>
              </div>
            </div>

            {/* The Chart */}
            <div className="md:col-span-2 p-5 md:p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex flex-col">
              <h4 className="text-base font-bold text-slate-100 mb-1">Projeção Mensal do OPEX Total (1º Ano)</h4>
              <p className="text-xs text-slate-400 mb-6">Comparação do custo progressivo do novo modelo (Promoção + Nuvem) vs. Custo imediato do Servidor Físico</p>
              
              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={projectionMensal} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="mes" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => value ? `R$ ${value/1000}k` : 'R$ 0'} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#f1f5f9' }}
                      formatter={(value: any, name: string) => {
                        if (value === null || value === undefined) return ["R$ 0", name];
                        return [`R$ ${Number(value).toLocaleString('pt-BR')}`, name];
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="TotalOPEX" name="OPEX Acumulado (Salário + Nuvem)" fill="#2dd4bf" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Line type="stepAfter" dataKey="CapexEsperado" name="Custo Fixo CAPEX (Servidor Físico)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Plano de Transição & Timeline de Migração",
      subtitle: "Evolução alinhada para focar na Inovação e no Gigante Potencial do HSF.",
      icon: Lightbulb,
      content: (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="relative w-full max-w-4xl mx-auto py-2"
        >
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-[40px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500/50 via-slate-700 to-teal-500/50" />

          {/* Step 1 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 }
            }}
            className="relative pl-16 md:pl-20 mb-8 md:mb-10 group"
          >
            <div className="absolute left-6 md:left-[40px] top-3 -translate-x-1/2 w-4 h-4 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)] border-2 border-slate-950 z-10" />
            
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 hover:border-teal-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="p-2 bg-slate-900/50 rounded-lg text-teal-400">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-100">Treinamento & Sucessão (Almoxarifado)</h3>
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-3">
                Jovem aprendiz de alto potencial sendo treinado e avaliado com sucesso. Já atua ativamente, pronto para assumir com excelência e dar continuidade às rotinas atuais do Almoxarifado sem impactos negativos.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-200 text-[10px] md:text-xs font-bold border border-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-400" /> RH e Coordenação Alinhados
                </span>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 }
            }}
            className="relative pl-16 md:pl-20 mb-8 md:mb-10 group"
          >
            <div className="absolute left-6 md:left-[40px] top-3 -translate-x-1/2 w-4 h-4 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)] border-2 border-slate-950 z-10" />
            
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 hover:border-teal-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="p-2 bg-slate-900/50 rounded-lg text-teal-400">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-100">Pitch & Apresentação na Diretoria</h3>
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-3">
                Apresentação do projeto com intermédio da coordenação de RH. O hospital possui um potencial gigante sendo limitado por processos burocráticos.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-200 text-[10px] md:text-xs font-bold border border-slate-700">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" /> Viabilidade e defesa pela Coord. de Custos
                </span>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 }
            }}
            className="relative pl-16 md:pl-20 mb-8 md:mb-10 group"
          >
            <div className="absolute left-6 md:left-[40px] top-3 -translate-x-1/2 w-4 h-4 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)] border-2 border-slate-950 z-10" />
            
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 hover:border-teal-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="p-2 bg-slate-900/50 rounded-lg text-teal-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-100">Gargalo de Tempo & Oportunidade</h3>
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Desenvolvo hoje com um agente de inteligência artificial em apenas <strong className="text-slate-100">±2 horas livres por noite</strong> — equilibrando o projeto TeraNexus e meu filho nascendo entre julho/agosto. Preciso de dedicação integral para escalar essas soluções e destravar o verdadeiro potencial tecnológico do HSF.
              </p>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 }
            }}
            className="relative pl-16 md:pl-20 group pb-4"
          >
            <div className="absolute left-6 md:left-[40px] top-3 -translate-x-1/2 w-4 h-4 bg-teal-400 rounded-full shadow-[0_0_20px_rgba(45,212,191,0.8)] border-2 border-slate-950 z-10" />
            <div className="absolute left-6 md:left-[40px] top-3 -translate-x-1/2 w-8 h-8 rounded-full bg-teal-400/20 animate-ping z-0" />
            
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-teal-500/80 hover:border-teal-400 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-900/50 rounded-lg text-teal-400">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="text-base md:text-xl font-bold text-teal-400">Novo Papel: Inovação e Tecnologia</h3>
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Migração da área de Almoxarifado para atuar 100% focado no desenvolvimento contínuo (App, Vercel, Supabase). Unificação das áreas (RH, Finanças, Faturamento) e modernização digital para <strong>ajudar o hospital a atingir todo o seu potencial e se destacar no mercado.</strong>
              </p>
            </div>
          </motion.div>

        </motion.div>
      )
    },
    {
      title: "Migração de Dados: O Fim das Planilhas",
      subtitle: "Estratégia segura para tratar, converter e migrar nossos dados atuais do Excel para a Nuvem.",
      icon: FileSpreadsheet,
      content: (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
             
             {/* Passado: Excel */}
             <div className="p-6 bg-slate-800/60 border border-slate-700 rounded-2xl flex flex-col items-center text-center">
                 <div className="p-4 bg-emerald-900/40 rounded-full mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                 </div>
                 <h4 className="text-slate-100 font-bold mb-2">Planilhas Atuais</h4>
                 <p className="text-xs text-slate-400 flex-1">Dados isolados em arquivos Excel (.xlsx, .csv), com fórmulas quebradas, duplicações e erros de digitação.</p>
             </div>

             {/* Processo: Tratamento e IA */}
             <div className="relative flex flex-col justify-center items-center py-4">
                 <div className="absolute top-1/2 left-0 w-full h-px bg-slate-700 -z-10 hidden md:block"></div>
                 <div className="p-3 bg-slate-900 border border-slate-700 rounded-full mb-2 z-10 md:bg-slate-900 hidden md:block">
                     <ArrowRight className="w-5 h-5 text-slate-400" />
                 </div>
                 <div className="p-5 bg-teal-950/30 border border-teal-500/30 rounded-xl text-center w-full z-10 mt-auto mb-auto bg-slate-900 md:bg-transparent">
                     <RefreshCw className="w-5 h-5 text-teal-400 mx-auto mb-2" />
                     <h4 className="text-sm font-bold text-teal-400 mb-1">Tratamento de Dados</h4>
                     <p className="text-[10px] text-slate-300">Higienização via scripts</p>
                 </div>
                 <div className="p-3 bg-slate-900 border border-slate-700 rounded-full mt-2 z-10 hidden md:block">
                     <ArrowRight className="w-5 h-5 text-slate-400" />
                 </div>
             </div>

             {/* Futuro: Nuvem/PostgreSQL */}
             <div className="p-6 bg-slate-800/60 border border-teal-500/50 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
                 <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-full mb-4 relative z-10">
                    <Database className="w-8 h-8 text-teal-400" />
                 </div>
                 <h4 className="text-slate-100 font-bold mb-2 relative z-10">Banco Centralizado</h4>
                 <p className="text-xs text-slate-300 flex-1 relative z-10">Dados estruturados e seguros no Supabase (PostgreSQL), disponíveis na Nuvem e em tempo real.</p>
             </div>
          </div>

          <div className="mt-2 p-6 bg-slate-800/40 border border-slate-700/80 rounded-2xl flex border-l-4 border-l-teal-500 shadow-lg">
             <div className="pr-6 border-r border-slate-700 mr-6 hidden sm:flex flex-col justify-center items-center">
               <FileCode className="w-10 h-10 text-teal-400/50 mb-2" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Scripting</span>
             </div>
             <div>
               <h3 className="text-base md:text-lg font-bold text-slate-100 mb-4">Plano de Ação para a Migração</h3>
               <ul className="space-y-4">
                 <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">1</div>
                   <p className="text-xs md:text-sm text-slate-300 leading-relaxed"><strong className="text-slate-100 block mb-0.5">Auditoria e Exportação:</strong> Exportar os dados de planilhas para arquivos em formato base (CSV). Fazer um mapeamento dos dados inconsistentes, duplicados ou em branco.</p>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">2</div>
                   <p className="text-xs md:text-sm text-slate-300 leading-relaxed"><strong className="text-slate-100 block mb-0.5">Higienização com Automação e I.A.:</strong> O tratamento pesado <strong>não será manual</strong>. Usarei nosso próprio Agente (I.A.) para gerar scripts automatizados (ex: Python/Node) capazes de tratar CPFs, padronizar nomes e remover caracteres inválidos em lote, limpando milhares de linhas em segundos.</p>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-bold flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.2)]">3</div>
                   <p className="text-xs md:text-sm text-slate-300 leading-relaxed"><strong className="text-teal-400 block mb-0.5">Upload em Lote (Seeding) Seguro:</strong> Os dados limpos serão validados localmente e inseridos no novo banco de dados no Supabase. O novo App já nascerá povoado com o histórico institucional.</p>
                 </li>
               </ul>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Plano B: Prova de Conceito (PoC)",
      subtitle: "Validação da tecnologia com risco zero para a instituição.",
      icon: FlaskConical,
      content: (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
          <div className="text-center p-6 bg-slate-800/40 border border-slate-700/80 rounded-2xl w-full flex flex-col justify-center items-center shadow-[0_0_30px_rgba(251,146,60,0.02)]">
            <ShieldAlert className="w-10 h-10 text-teal-400 mb-4" />
            <h4 className="text-xl font-black text-slate-100 mb-2">E se houver receio em aprovar a mudança em definitivo agora?</h4>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Caso a diretoria ache prudente não aprovar a promoção oficial de imediato, minha proposta comercial é fazermos um <strong>período de testes (PoC - Proof of Concept) de 3 meses.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="p-5 bg-slate-800/60 rounded-2xl border border-slate-700 relative overflow-hidden">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-slate-900/50 rounded-lg text-slate-100">
                    <Clock className="w-5 h-5" />
                 </div>
                 <h3 className="text-base font-bold text-slate-100">Como funciona o Plano B?</h3>
               </div>
               <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                   <div>
                     <strong className="text-slate-100">Segurança Jurídica (Zero Desvio de Função):</strong> Para proteger o HSF, o RH pode formalizar um <strong>Aditivo de Projeto Temporário</strong> (ou alteração provisória para "Assistente de Projetos/Inovação"). Isso respalda legalmente a atuação por 3 meses.
                   </div>
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                   <div>
                     <strong className="text-slate-100">Atuação Segura e Híbrida:</strong> Minhas demandas do Almoxarifado continuam assistidas. Dedico as horas aprovadas no aditivo exclusivamente à área-piloto do projeto.
                   </div>
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                   <div>
                     <strong className="text-slate-100">Foco Total na Entrega:</strong> Escolhemos 1 grande dor atual (ex: Avaliações do PDI) para resolver 100% na prática durante a PoC.
                   </div>
                 </li>
               </ul>
            </div>

            <div className="p-5 bg-teal-950/20 rounded-2xl border border-teal-500/30 relative overflow-hidden">
               <div className="absolute -bottom-4 -right-4 opacity-5">
                 <CheckCircle className="w-40 h-40 text-teal-400" />
               </div>
               <div className="flex items-center gap-3 mb-4 relative z-10">
                 <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
                    <Target className="w-5 h-5" />
                 </div>
                 <h3 className="text-base font-bold text-slate-100">Gatilho de Sucesso</h3>
               </div>
               <p className="text-xs sm:text-sm text-slate-300 mb-4 relative z-10 leading-relaxed">
                 O objetivo do <strong>Plano B</strong> é comprovar o enorme potencial do impacto da I.A. + Nuvem no HSF, medindo na prática a economia de tempo e financeira.<br/><br/>
                 Ao final dos 3 meses, se os gestores validarem a entrega, <strong>efetivamos oficialmente o Plano A</strong> (Aumento e transição para Inovação/Tecnologia).
               </p>
               
               <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 text-teal-400 rounded-full text-xs font-bold border border-teal-500/20 relative z-10">
                 <PlayCircle className="w-4 h-4" /> Risco zero, retorno medido.
               </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    // Swipe left (next slide)
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }
    
    // Swipe right (previous slide)
    if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const current = slides[currentSlide];
  const Icon = current.icon;

  return (
    <div 
      className="flex flex-col min-h-screen sm:min-h-[calc(100vh-0rem)] bg-slate-950/40 rounded-none sm:rounded-3xl border-0 sm:border-slate-800 overflow-hidden relative shadow-2xl"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={() => {
          localStorage.removeItem("hsf_pdi_offline_mode");
          window.location.reload();
        }}
        className="absolute top-4 right-4 z-50 p-2 bg-slate-900/50 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-full transition-colors backdrop-blur-sm"
        title="Sair do Modo Apresentação"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest px-2">Sair</span>
      </button>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-teal-900/20 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800/60 relative z-10 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
            <Icon className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-slate-100">{current.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{current.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-full border border-slate-800 text-xs font-bold text-slate-400 tracking-widest">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-8 lg:p-12 overflow-y-auto relative z-10 flex flex-col">
        <div className="my-auto w-full">
          {current.content}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between p-6 border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md relative z-10">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
            currentSlide === 0 
              ? "opacity-50 cursor-not-allowed bg-slate-900 text-slate-500" 
              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === i ? "bg-teal-400 ring-4 ring-teal-500/20" : "bg-slate-700 hover:bg-slate-600"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
            currentSlide === slides.length - 1
              ? "opacity-50 cursor-not-allowed bg-slate-900 text-slate-500"
              : "bg-teal-500 text-slate-950 hover:bg-teal-400 hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]"
          }`}
        >
          Próximo <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
