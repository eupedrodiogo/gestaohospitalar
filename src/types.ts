export type Language = 'pt' | 'en' | 'es';

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: 'colaborador' | 'lider' | 'rh' | 'ti' | 'inovacao' | 'sadt' | 'atendimento' | 'financeiro' | 'custos' | 'faturamento' | 'comercial' | 'marketing' | 'seguranca' | 'diretor_administrativo' | 'diretor_geral' | 'medico' | 'apresentador';
  department?: string;
  language: Language;
  createdAt: number;
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

