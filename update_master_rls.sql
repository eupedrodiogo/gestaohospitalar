-- Script para atualizar as políticas RLS do Supabase para o perfil 'master'
-- Execute no SQL Editor do Supabase

-- 1. Políticas de Segurança (RLS) para USER_PROFILES
DROP POLICY IF EXISTS insert_profiles ON public.user_profiles;
CREATE POLICY insert_profiles ON public.user_profiles 
  FOR INSERT TO authenticated WITH CHECK (public.get_my_role() IN ('ti', 'master'));

DROP POLICY IF EXISTS update_profiles ON public.user_profiles;
CREATE POLICY update_profiles ON public.user_profiles 
  FOR UPDATE TO authenticated USING (true) 
  WITH CHECK ("userId" = auth.uid() OR public.get_my_role() IN ('ti', 'master'));

DROP POLICY IF EXISTS delete_profiles ON public.user_profiles;
CREATE POLICY delete_profiles ON public.user_profiles 
  FOR DELETE TO authenticated USING (public.get_my_role() IN ('ti', 'master'));

-- 2. Políticas de Segurança (RLS) para PDIS
DROP POLICY IF EXISTS select_pdis ON public.pdis;
CREATE POLICY select_pdis ON public.pdis 
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider', 'diretor_administrativo', 'diretor_geral'));

DROP POLICY IF EXISTS insert_pdis ON public.pdis;
CREATE POLICY insert_pdis ON public.pdis 
  FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'));

DROP POLICY IF EXISTS update_pdis ON public.pdis;
CREATE POLICY update_pdis ON public.pdis 
  FOR UPDATE TO authenticated 
  USING (user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'))
  WITH CHECK (user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'));

DROP POLICY IF EXISTS delete_pdis ON public.pdis;
CREATE POLICY delete_pdis ON public.pdis 
  FOR DELETE TO authenticated 
  USING (user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'));

-- 3. Políticas de Segurança (RLS) para CHECKINS
DROP POLICY IF EXISTS select_checkins ON public.checkins;
CREATE POLICY select_checkins ON public.checkins 
  FOR SELECT TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.pdis 
    WHERE pdis.id = checkins.pdi_id 
      AND (pdis.user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider', 'diretor_administrativo', 'diretor_geral'))
  ));

DROP POLICY IF EXISTS insert_checkins ON public.checkins;
CREATE POLICY insert_checkins ON public.checkins 
  FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.pdis 
    WHERE pdis.id = checkins.pdi_id 
      AND (pdis.user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'))
  ));

DROP POLICY IF EXISTS update_checkins ON public.checkins;
CREATE POLICY update_checkins ON public.checkins 
  FOR UPDATE TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.pdis 
    WHERE pdis.id = checkins.pdi_id 
      AND (pdis.user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'))
  ));

DROP POLICY IF EXISTS delete_checkins ON public.checkins;
CREATE POLICY delete_checkins ON public.checkins 
  FOR DELETE TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.pdis 
    WHERE pdis.id = checkins.pdi_id 
      AND (pdis.user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'))
  ));

-- 4. Políticas de Segurança (RLS) para NOTIFICATIONS
DROP POLICY IF EXISTS select_notifications ON public.notifications;
CREATE POLICY select_notifications ON public.notifications 
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'));

DROP POLICY IF EXISTS insert_notifications ON public.notifications;
CREATE POLICY insert_notifications ON public.notifications 
  FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'));

DROP POLICY IF EXISTS update_notifications ON public.notifications;
CREATE POLICY update_notifications ON public.notifications 
  FOR UPDATE TO authenticated 
  USING (user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'));

DROP POLICY IF EXISTS delete_notifications ON public.notifications;
CREATE POLICY delete_notifications ON public.notifications 
  FOR DELETE TO authenticated 
  USING (user_id = auth.uid() OR public.get_my_role() IN ('ti', 'master', 'rh', 'lider'));

-- 5. Políticas de Segurança (RLS) para POLLS
DROP POLICY IF EXISTS insert_polls ON public.polls;
CREATE POLICY insert_polls ON public.polls 
  FOR INSERT TO authenticated 
  WITH CHECK (public.get_my_role() IN ('rh', 'ti', 'master'));

DROP POLICY IF EXISTS update_polls ON public.polls;
CREATE POLICY update_polls ON public.polls 
  FOR UPDATE TO authenticated 
  USING (public.get_my_role() IN ('rh', 'ti', 'master'))
  WITH CHECK (public.get_my_role() IN ('rh', 'ti', 'master'));

DROP POLICY IF EXISTS delete_polls ON public.polls;
CREATE POLICY delete_polls ON public.polls 
  FOR DELETE TO authenticated 
  USING (public.get_my_role() IN ('rh', 'ti', 'master'));

-- Fim do script
