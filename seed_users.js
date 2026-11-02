import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Requer SUPABASE_SERVICE_ROLE_KEY no .env
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const usersToCreate = [
  { id: 'colaborador', label: 'Pedro (Almox.)', username: 'pedro', department: 'Almoxarifado' },
  { id: 'lider', label: 'Rafael (Coord.)', username: 'rafael', department: 'Geral' },
  { id: 'rh', label: 'Márcia (RH)', username: 'marcia', department: 'Recursos Humanos' },
  { id: 'ti', label: 'João (TI)', username: 'joao', department: 'Segurança e TI' },
  { id: 'inovacao', label: 'Inovação', username: 'inovacao', department: 'Hub de Ideias' },
  { id: 'sadt', label: 'Daniela (SADT)', username: 'daniela', department: 'Apoio Diagnóstico' },
  { id: 'atendimento', label: 'Andréa (Atend.)', username: 'andrea', department: 'Exp. do Cliente' },
  { id: 'financeiro', label: 'Johnny (Financ.)', username: 'johnny', department: 'Gestão Financeira' },
  { id: 'faturamento', label: 'Luis (Fatur.)', username: 'luis', department: 'Faturamento & Glosas' },
  { id: 'custos', label: 'Victor (Custos)', username: 'victor', department: 'Custos e Controladoria' },
  { id: 'comercial', label: 'Ingrid (Comerc.)', username: 'ingrid', department: 'Comercial' },
  { id: 'marketing', label: 'Bruno (Mkt)', username: 'bruno', department: 'Marketing & Brand' },
  { id: 'seguranca', label: 'Samuel (Seg. Trab.)', username: 'samuel', department: 'Segurança do Trabalho' },
  { id: 'sesmt', label: 'Dr. Lucas (Med. Trab.)', username: 'lucas', department: 'Medicina do Trabalho' },
  { id: 'juridico', label: 'Dr. Alexandre (Comp.)', username: 'alexandre', department: 'Jurídico e Compliance' },
  { id: 'diretor_administrativo', label: 'Jociliano (Dir. Adm.)', username: 'jociliano', department: 'Diretoria Administrativa' },
  { id: 'diretor_geral', label: 'Carlos (Geral)', username: 'carlos', department: 'Diretoria Geral' },
  { id: 'suprimentos', label: 'Luiza (Suprim.)', username: 'luiza', department: 'Suprimentos e Logística' },
  { id: 'apresentador', label: 'Pedro (Apresentador)', username: 'pedrodiogo', department: 'Geral' }
];

async function seed() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("ERRO: SUPABASE_SERVICE_ROLE_KEY não encontrada no .env. Não será possível inserir dados ignorando RLS.");
    return;
  }
  
  console.log("Iniciando criação de usuários de teste...");
  for (const u of usersToCreate) {
    const email = `${u.username}@hsf.local`;
    console.log(`Criando: ${email} ...`);
    
    // 1. Criar Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: 'senha123',
      email_confirm: true
    });
    
    if (authError) {
      console.log(`  -> Erro Auth (pode já existir): ${authError.message}`);
    } else {
      console.log(`  -> Auth User criado com sucesso. ID: ${authData.user.id}`);
      
      // 2. Inserir Profile
      const { error: dbError } = await supabaseAdmin.from('user_profiles').insert([{
        userId: authData.user.id,
        name: u.label,
        email: email,
        role: u.id,
        department: u.department,
        language: 'pt'
      }]);
      
      if (dbError) {
        console.log(`  -> Erro Profile: ${dbError.message}`);
      } else {
        console.log(`  -> Profile inserido com sucesso!`);
      }
    }
  }
  console.log("Finalizado!");
}

seed();
