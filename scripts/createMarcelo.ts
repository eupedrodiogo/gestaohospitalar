import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

async function createMarcelo() {
  console.log('Logando como TI (joao@hsf.local)...');
  const { data: tiSession, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'joao@hsf.local',
    password: 'senha123'
  });

  if (loginError) {
    console.error('Erro ao logar TI:', loginError);
    return;
  }
  
  console.log('Logado como TI. Inserindo perfil do Marcelo...');
  
  const { error: profileError } = await supabase.from('user_profiles').insert({
    userId: 'dbe7ccc1-d8f4-496c-9e6a-c85eacfe0741', // ID que já foi gerado na execução anterior
    email: 'marcelo@hsf.local',
    name: 'Marcelo (Eng. Clín.)',
    role: 'engenharia_clinica',
    language: 'pt',
    createdAt: Date.now()
  });

  if (profileError) {
    console.error('Erro ao criar perfil:', profileError.message);
  } else {
    console.log('Perfil criado com sucesso!');
  }
}

createMarcelo();
