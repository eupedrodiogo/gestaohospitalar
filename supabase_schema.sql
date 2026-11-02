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
  "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000),
  "badges" JSONB DEFAULT '[]'::jsonb
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

-- 13. Tabela de Enquetes Rápidas
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  "createdBy" UUID REFERENCES public.user_profiles("userId"),
  "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- 14. Tabela de Participantes da Enquete (Para impedir voto duplo mantendo anonimato)
CREATE TABLE public.poll_participants (
  "pollId" UUID REFERENCES public.polls(id) ON UPDATE CASCADE ON DELETE CASCADE,
  "userId" UUID REFERENCES public.user_profiles("userId") ON UPDATE CASCADE ON DELETE CASCADE,
  "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000),
  PRIMARY KEY ("pollId", "userId")
);

-- 15. Tabela de Votos da Enquete (100% Anônimo, sem identificador de usuário)
CREATE TABLE public.poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "pollId" UUID REFERENCES public.polls(id) ON UPDATE CASCADE ON DELETE CASCADE,
  "optionIndex" INT NOT NULL,
  "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- Habilitar publicação Realtime para enquetes e votos
alter publication supabase_realtime add table public.polls;
alter publication supabase_realtime add table public.poll_votes;

-- Ativar RLS
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança para POLLS
CREATE POLICY select_polls ON public.polls 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY insert_polls ON public.polls 
  FOR INSERT TO authenticated 
  WITH CHECK (public.get_my_role() IN ('rh', 'ti'));

CREATE POLICY update_polls ON public.polls 
  FOR UPDATE TO authenticated 
  USING (public.get_my_role() IN ('rh', 'ti'))
  WITH CHECK (public.get_my_role() IN ('rh', 'ti'));

CREATE POLICY delete_polls ON public.polls 
  FOR DELETE TO authenticated 
  USING (public.get_my_role() IN ('rh', 'ti'));

-- Políticas de Segurança para POLL_PARTICIPANTS
CREATE POLICY select_poll_participants ON public.poll_participants 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY insert_poll_participants ON public.poll_participants 
  FOR INSERT TO authenticated 
  WITH CHECK ("userId" = auth.uid());

CREATE POLICY update_poll_participants ON public.poll_participants 
  FOR UPDATE TO authenticated USING (false);

CREATE POLICY delete_poll_participants ON public.poll_participants 
  FOR DELETE TO authenticated USING (false);

-- Políticas de Segurança para POLL_VOTES
CREATE POLICY select_poll_votes ON public.poll_votes 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY insert_poll_votes ON public.poll_votes 
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY update_poll_votes ON public.poll_votes 
  FOR UPDATE TO authenticated USING (false);

CREATE POLICY delete_poll_votes ON public.poll_votes 
  FOR DELETE TO authenticated USING (false);

-- 16. Tabela de Disparos de Marketing (Dispatches)
CREATE TABLE public.dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "authorId" UUID REFERENCES public.user_profiles("userId"),
  "authorName" TEXT,
  "authorRole" TEXT,
  audience TEXT NOT NULL,
  channels JSONB NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- Habilitar publicação Realtime para dispatches
alter publication supabase_realtime add table public.dispatches;

-- Ativar RLS para dispatches
ALTER TABLE public.dispatches ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança para DISPATCHES
CREATE POLICY select_dispatches ON public.dispatches 
  FOR SELECT TO authenticated 
  USING (public.get_my_role() IN ('marketing', 'ti', 'diretor_geral'));

CREATE POLICY insert_dispatches ON public.dispatches 
  FOR INSERT TO authenticated 
  WITH CHECK (public.get_my_role() = 'marketing');

CREATE POLICY update_dispatches ON public.dispatches 
  FOR UPDATE TO authenticated 
  USING (false) -- Somente Cloud Functions via API (Service Role) devem atualizar o status
  WITH CHECK (false);

CREATE POLICY delete_dispatches ON public.dispatches 
  FOR DELETE TO authenticated 
  USING (false);
