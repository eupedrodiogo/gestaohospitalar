-- Script de Migração Firestore para Supabase (PostgreSQL) com RLS
-- Execute este script no SQL Editor do painel do Supabase

-- 1. Limpar tabelas antigas para reestruturação
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.checkins CASCADE;
DROP TABLE IF EXISTS public.pdis CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 2. Recriar Tabela de Perfis de Usuário (com createdAt e camelCase)
CREATE TABLE public.user_profiles (
  "userId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT,
  language TEXT,
  "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- 3. Recriar Tabela de PDIs (com todos os campos reais do frontend)
CREATE TABLE public.pdis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES public.user_profiles("userId") ON UPDATE CASCADE ON DELETE CASCADE,
  "cycle" TEXT,
  "coordinatorName" TEXT,
  "department" TEXT,
  "hierarchy" TEXT,
  "managerId" TEXT,
  "status" TEXT,
  "encryptedData" TEXT,
  "managerFeedback" TEXT,
  "hrFeedback" TEXT,
  "updatedAt" BIGINT
);

-- 4. Recriar Tabela de Check-ins (Alinhamentos 1-on-1 com colunas reais)
CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pdi_id UUID REFERENCES public.pdis(id) ON UPDATE CASCADE ON DELETE CASCADE,
  date BIGINT DEFAULT (extract(epoch from now()) * 1000),
  "authorName" TEXT,
  "authorRole" TEXT,
  "encryptedNote" TEXT,
  "stressLevel" INT
);

-- 5. Recriar Tabela de Notificações
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES public.user_profiles("userId") ON UPDATE CASCADE ON DELETE CASCADE,
  title TEXT,
  message TEXT,
  feedback TEXT,
  read BOOLEAN DEFAULT FALSE,
  type TEXT,
  "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- 6. Habilitar publicação Realtime
alter publication supabase_realtime add table public.user_profiles;
alter publication supabase_realtime add table public.pdis;
alter publication supabase_realtime add table public.checkins;
alter publication supabase_realtime add table public.notifications;

-- 7. Ativar Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 8. Função Auxiliar para obter a Role do usuário ativo
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text AS $$
  SELECT role FROM public.user_profiles WHERE "userId" = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 9. Políticas de Segurança (RLS) para USER_PROFILES
CREATE POLICY select_profiles ON public.user_profiles 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY insert_profiles ON public.user_profiles 
  FOR INSERT TO authenticated WITH CHECK (public.get_my_role() = 'ti');

CREATE POLICY update_profiles ON public.user_profiles 
  FOR UPDATE TO authenticated USING (true) 
  WITH CHECK ("userId" = auth.uid() OR public.get_my_role() = 'ti');

CREATE POLICY delete_profiles ON public.user_profiles 
  FOR DELETE TO authenticated USING (public.get_my_role() = 'ti');

-- 10. Políticas de Segurança (RLS) para PDIS
CREATE POLICY select_pdis ON public.pdis 
  FOR SELECT TO authenticated 
  USING ("userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider', 'diretor_administrativo', 'diretor_geral'));

CREATE POLICY insert_pdis ON public.pdis 
  FOR INSERT TO authenticated 
  WITH CHECK ("userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'));

CREATE POLICY update_pdis ON public.pdis 
  FOR UPDATE TO authenticated 
  USING ("userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'))
  WITH CHECK ("userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'));

CREATE POLICY delete_pdis ON public.pdis 
  FOR DELETE TO authenticated 
  USING ("userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'));

-- 11. Políticas de Segurança (RLS) para CHECKINS
CREATE POLICY select_checkins ON public.checkins 
  FOR SELECT TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.pdis 
    WHERE pdis.id = checkins.pdi_id 
      AND (pdis."userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider', 'diretor_administrativo', 'diretor_geral'))
  ));

CREATE POLICY insert_checkins ON public.checkins 
  FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.pdis 
    WHERE pdis.id = checkins.pdi_id 
      AND (pdis."userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'))
  ));

CREATE POLICY update_checkins ON public.checkins 
  FOR UPDATE TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.pdis 
    WHERE pdis.id = checkins.pdi_id 
      AND (pdis."userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'))
  ));

CREATE POLICY delete_checkins ON public.checkins 
  FOR DELETE TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.pdis 
    WHERE pdis.id = checkins.pdi_id 
      AND (pdis."userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'))
  ));

-- 12. Políticas de Segurança (RLS) para NOTIFICATIONS
CREATE POLICY select_notifications ON public.notifications 
  FOR SELECT TO authenticated 
  USING ("userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'));

CREATE POLICY insert_notifications ON public.notifications 
  FOR INSERT TO authenticated 
  WITH CHECK ("userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'));

CREATE POLICY update_notifications ON public.notifications 
  FOR UPDATE TO authenticated 
  USING ("userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'));

CREATE POLICY delete_notifications ON public.notifications 
  FOR DELETE TO authenticated 
  USING ("userId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'lider'));
