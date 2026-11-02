import React from 'react';
import {
  BarChart2,
  Megaphone,
  Vote,
  ClipboardList,
  Rocket,
  Clock,
  FileText,
  DollarSign,
  Activity,
  Users,
  Briefcase,
  Lightbulb,
  Heart,
  BookOpen,
  MessageSquare,
  Shield,
  Scale,
  Settings,
  Lock,
  Database,
  Package,
  HeartHandshake,
  Landmark,
  ShieldCheck,
  Crown,
  MessageCircle,
  Wrench,
  LucideIcon
} from "lucide-react";

export interface NavModule {
  id: string;
  label: string | ((role: string) => string);
  shortLabel?: string | ((role: string) => string);
  icon: LucideIcon | React.ElementType;
  tourId?: string;
  colorClass?: string;
  bgClass?: string;
  category?: string;
}

// Chat Icon SVG inline component
const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

export const ALL_NAV_MODULES: NavModule[] = [
  // C-Level & Master (Diretoria Executiva)
  { id: "admin", label: "Painel Master", icon: Crown, category: "Diretoria Executiva" },
  { id: "diretor_administrativo", label: "Adm & Operação", icon: Crown, category: "Diretoria Executiva" },
  { id: "diretor_geral", label: "Diretor Clínico/Técnico", icon: Crown, colorClass: "text-yellow-400", category: "Diretoria Executiva" },
  
  // Hub de Comunicação
  { id: "avisos", label: "Mural de Avisos", icon: Megaphone, colorClass: "text-teal-400", category: "Hub de Comunicação" },
  { id: "enquetes", label: "Enquetes Rápidas", icon: Vote, colorClass: "text-teal-400", category: "Hub de Comunicação" },
  { id: "chat", label: "Chat HSF", icon: ChatIcon, colorClass: "text-teal-400", category: "Hub de Comunicação" },
  { id: "network", label: "Comunidade", icon: Users, category: "Hub de Comunicação" },

  // Monitoramento Operacional
  { id: "metrics", label: "People Analytics", icon: BarChart2, category: "Monitoramento Operacional" },
  { id: "assessment", label: "Avaliações", icon: Activity, category: "Monitoramento Operacional" },
  { id: "inovacao", label: "Hub de Inovação", icon: Lightbulb, category: "Monitoramento Operacional" },
  { id: "seguranca", label: "Engenharia e Projetos", icon: ShieldCheck, colorClass: "text-teal-400", category: "Monitoramento Operacional" },
  { id: "engenharia_clinica", label: "Eng. Clínica", icon: Wrench, colorClass: "text-cyan-400", bgClass: "bg-cyan-500/10 border-cyan-500/30", category: "Monitoramento Operacional" },

  // Pessoal e RH
  { id: "home", label: (role) => role === "colaborador" ? "Meu PDI" : role === "lider" ? "Minha Equipe" : "Monitorização", shortLabel: (role) => role === "colaborador" ? "Meu PDI" : role === "lider" ? "Equipe" : "Monitor", icon: ClipboardList, tourId: "nav-home", category: "Pessoal e RH" },
  { id: "escala", label: "Escopo / Ponto", icon: Clock, tourId: "nav-escala", category: "Pessoal e RH" },
  { id: "documentos", label: "Documentos", icon: FileText, category: "Pessoal e RH" },
  { id: "holerite", label: (role) => role === "medico" ? "Repasses" : "Financeiro", icon: DollarSign, tourId: "nav-holerite", category: "Pessoal e RH" },
  { id: "recrutamento", label: "Recrutamento", icon: Users, category: "Pessoal e RH" },
  { id: "vagas", label: "Vagas Internas", icon: Briefcase, category: "Pessoal e RH" },
  { id: "climate", label: "Clima eNPS", icon: Heart, category: "Pessoal e RH" },
  { id: "training", label: "Treinamentos", icon: BookOpen, category: "Pessoal e RH" },
  { id: "feedback", label: "Feedback 360º", icon: MessageSquare, category: "Pessoal e RH" },

  // Operação de Negócios
  { id: "sadt", label: "SADT", icon: Activity, category: "Operação de Negócios" },
  { id: "atendimento", label: "Atendimento", icon: HeartHandshake, category: "Operação de Negócios" },
  { id: "comercial", label: "Comercial / CRM", icon: HeartHandshake, category: "Operação de Negócios" },
  { id: "marketing", label: "Marketing / Ads", icon: Megaphone, category: "Operação de Negócios" },
  { id: "suprimentos", label: "Suprimentos", icon: Package, category: "Operação de Negócios" },
  { id: "juridico", label: "Jurídico", icon: Scale, colorClass: "text-[#A78177]", bgClass: "bg-[#693A32]/20 border-[#693A32]/35", category: "Operação de Negócios" },
  { id: "sesmt", label: "SESMT", icon: Shield, colorClass: "text-purple-400", bgClass: "bg-purple-500/10 border-purple-500/30", category: "Operação de Negócios" },

  // Controladoria e Finanças
  { id: "caixa", label: "Visão Geral & Caixa", icon: Activity, colorClass: "text-teal-400", category: "Controladoria e Finanças" },
  { id: "tesouraria", label: "Títulos & Tesouraria", icon: Landmark, colorClass: "text-teal-400", category: "Controladoria e Finanças" },
  { id: "faturamento", label: "Faturamento Físico", icon: DollarSign, category: "Controladoria e Finanças" },
  { id: "glosas", label: "Recursos & Glosas", icon: FileText, category: "Controladoria e Finanças" },
  { id: "dre", label: "DRE Gerencial", icon: FileText, category: "Controladoria e Finanças" },
  { id: "kpis", label: "Painel de KPIs", icon: BarChart2, colorClass: "text-teal-400", category: "Controladoria e Finanças" },
  { id: "simulador_custos", label: "Simulador de Custos", icon: Activity, category: "Controladoria e Finanças" },
  
  // Configurações e TI
  { id: "apresentacao", label: "Pitch / Reunião", icon: Rocket, colorClass: "text-purple-400", bgClass: "bg-purple-500/10 border-purple-500/30", category: "Configurações e TI" },
  { id: "backup", label: "Backup & Chaves", icon: Lock, category: "Configurações e TI" },
  { id: "acessos", label: "Acessos", icon: Shield, category: "Configurações e TI" },
  { id: "logs", label: "Arquitetura & Logs", icon: Database, category: "Configurações e TI" },
  { id: "settings", label: "Configurações", icon: Settings, category: "Configurações e TI" },
];

export const getNavModuleById = (id: string): NavModule | undefined => {
  return ALL_NAV_MODULES.find(m => m.id === id);
}
