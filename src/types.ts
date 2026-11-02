export type Language = 'pt' | 'en' | 'es';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: number;
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: 'colaborador' | 'lider' | 'rh' | 'ti' | 'inovacao' | 'sadt' | 'atendimento' | 'financeiro' | 'custos' | 'faturamento' | 'comercial' | 'marketing' | 'seguranca' | 'diretor_administrativo' | 'diretor_geral' | 'medico' | 'apresentador' | 'master' | 'engenharia_clinica' | 'sesmt' | 'juridico' | 'suprimentos';
  department?: string;
  language: Language;
  createdAt: number;
  badges?: Badge[];
  force_password_change?: boolean;
  lastLoginAt?: number;
  passwordChangedAt?: number;
}

export interface Pdi {
  id: string; // usually userId_cycle
  userId: string;
  cycle: string;
  coordinatorName: string;
  department: string;
  hierarchy: string;
  managerId: string;
  status: 'Rascunho' | 'Em Curso' | 'Aguardando Líder' | 'Aguardando RH' | 'Aprovado Final' | 'Em Revisão';
  encryptedData: string; // contains AES-encrypted stringified self-evaluation and goals
  managerFeedback: string; // stored in plain text or encrypted, usually plain text as from manager
  hrFeedback: string; // stored in plain text
  updatedAt: number;
}

// Subcollection of pdis
export interface Checkin {
  id: string;
  date: number;
  authorName: string;
  authorRole: 'colaborador' | 'lider' | 'rh';
  encryptedNote: string;
  stressLevel?: number; // 1 to 5 scale (1: Muito Baixo, 2: Baixo, 3: Normal, 4: Alto, 5: Muito Alto/Burnout)
}

export interface AppFeedback {
  userId: string;
  userName?: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface Pdi5W2HItem {
  id: string;
  oQue: string; // O que? (Ação)
  quem: string; // Quem? (Responsável)
  quando: string; // Quando? (Prazo)
  onde: string; // Onde? (Setor)
  porQue: string; // Por quê? (Justificativa)
  como: string; // Como? (Procedimento)
  quantoCusta: string; // Quanto custa? (Valor)
  progresso?: number; // % de conclusão (0 a 100)
}

export interface LearningEvidence {
  id: string;
  title: string;
  category: '70' | '20' | '10'; // 70 (Practical), 20 (Social), 10 (Formal)
  date: number;
  fileName?: string;
  fileBase64?: string; // Stored as base64 or external link
  link?: string;
  description?: string;
}

export interface DecryptedPdiData {
  strengths: string;
  improvements: string;
  shortTermGoals: string;
  longTermGoals: string;
  actionPlan: string;
  items5W2H?: Pdi5W2HItem[];
  learningEvidences?: LearningEvidence[];
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string; // added this
  likes: string[]; // array of userIds
  commentCount: number;
  createdAt: number;
}

export interface CommunityComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: number;
}

export interface MessageDispatch {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  audience: 'pacientes' | 'colaboradores' | 'todos' | string;
  channels: {
    whatsapp: boolean;
    email: boolean;
  };
  subject?: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: number;
}

// =============================================
// ENGENHARIA CLÍNICA — Tipos
// =============================================

export enum EquipmentStatus {
  OPERATIONAL = 'Operacional',
  MAINTENANCE = 'Em Manutenção',
  CALIBRATION = 'Calibração',
  DOWN = 'Inoperante',
}

export enum WorkOrderType {
  PREVENTIVE = 'Preventiva',
  CORRECTIVE = 'Corretiva',
  CALIBRATION = 'Calibração',
  INSTALLATION = 'Instalação',
}

export enum WorkOrderPriority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  CRITICAL = 'Crítica',
}

export interface Equipment {
  id: string;
  name: string;
  tag: string;
  sector: string;
  status: EquipmentStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  model: string;
  manufacturer: string;
}

export interface WorkOrder {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  status: 'Aberto' | 'Em Andamento' | 'Concluído' | 'Aguardando Peça';
  createdAt: string;
  technician?: string;
  description: string;
}

export interface KPIMetrics {
  uptime: number;
  mtbf: number;
  mttr: number;
  openOrders: number;
  totalAssets: number;
  preventiveCompliance: number;
}

export interface DailyStat {
  date: string;
  preventive: number;
  corrective: number;
}

export interface RawExcelData {
  columns: string[];
  rows: any[];
  normalized: WorkOrder[];
}

// --- Gas Management Types ---

export enum GasType {
  O2_LIQUID = 'Oxigênio Líquido',
  O2_CYLINDER_10M3 = 'Oxigênio 10m³',
  O2_CYLINDER_7M3 = 'Oxigênio 7m³',
  O2_CYLINDER_4M3 = 'Oxigênio 4m³',
  O2_CYLINDER_1M3 = 'Oxigênio 1m³ (PPU)',
  AIR_CYLINDER_10M3 = 'Ar Comprimido 10m³',
  AIR_CYLINDER_7M3 = 'Ar Comprimido 7m³',
  N2O = 'Óxido Nitroso',
  NITROGEN = 'Nitrogênio',
  CO2 = 'Dióxido de Carbono',
  ACETYLENE = 'Acetileno',
  ARGON = 'Argônio',
  HELIUM = 'Hélio',
}

export interface LiquidGasEntry {
  id: string;
  date: string;
  orderDate?: string;
  orderNumber?: string;
  invoiceDate?: string;
  invoiceNumber: string;
  volume: number;
  pricePerUnit: number;
  totalValue: number;
  boletoDueDate?: string;
  paymentStatus: 'OK' | 'NOK' | 'Pending';
}

export interface CylinderDeliveryItem {
  gasType: GasType | string;
  quantity: number;
  volume?: number;
  priceUnit: number;
  total: number;
}

export interface CylinderDelivery {
  id: string;
  date: string;
  orderDate?: string;
  orderNumber?: string;
  invoiceDate?: string;
  invoiceNumber: string;
  supplier: string;
  items: CylinderDeliveryItem[];
  totalValue: number;
}
