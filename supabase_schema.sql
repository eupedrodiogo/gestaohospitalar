-- Script de Migração Firestore para Supabase (PostgreSQL)
-- Execute este script no SQL Editor do painel do Supabase

-- 1. Tabela de Perfis de Usuário
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT,
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de PDIs
CREATE TABLE public.pdis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  status TEXT,
  encrypted_data TEXT, -- Caso os campos estejam encriptados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Check-ins (Antiga subcoleção)
CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pdi_id UUID REFERENCES public.pdis(id) ON DELETE CASCADE,
  encrypted_data TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Notificações
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar o Realtime para todas as tabelas (necessário para substituir o onSnapshot)
alter publication supabase_realtime add table public.user_profiles;
alter publication supabase_realtime add table public.pdis;
alter publication supabase_realtime add table public.checkins;
alter publication supabase_realtime add table public.notifications;
