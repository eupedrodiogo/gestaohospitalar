-- =========================================================================
-- Atualização do Schema Supabase: Comunidade e Mural de Avisos
-- Execute este script no SQL Editor do Supabase
-- =========================================================================

-- 1. TABELAS DO MURAL DE AVISOS (NOTICES)
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Institucional',
    priority TEXT DEFAULT 'normal',
    "authorId" UUID NOT NULL REFERENCES public.user_profiles("userId") ON DELETE CASCADE,
    "authorName" TEXT,
    "authorRole" TEXT,
    "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- Tabela para rastrear quem Leu o aviso (Relacionamento N:N)
CREATE TABLE IF NOT EXISTS public.notice_reads (
    notice_id UUID REFERENCES public.notices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles("userId") ON DELETE CASCADE,
    PRIMARY KEY (notice_id, user_id)
);

-- Tabela para curtidas em Avisos (Relacionamento N:N)
CREATE TABLE IF NOT EXISTS public.notice_likes (
    notice_id UUID REFERENCES public.notices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles("userId") ON DELETE CASCADE,
    PRIMARY KEY (notice_id, user_id)
);

-- Tabela de Comentários em Avisos
CREATE TABLE IF NOT EXISTS public.notice_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_id UUID REFERENCES public.notices(id) ON DELETE CASCADE,
    "authorId" UUID REFERENCES public.user_profiles("userId") ON DELETE CASCADE,
    "authorName" TEXT,
    "authorRole" TEXT,
    content TEXT NOT NULL,
    "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- 2. TABELAS DA COMUNIDADE (COMMUNITY POSTS)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "authorId" UUID NOT NULL REFERENCES public.user_profiles("userId") ON DELETE CASCADE,
    "authorName" TEXT,
    "authorRole" TEXT,
    content TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- Tabela para Curtidas na Comunidade
CREATE TABLE IF NOT EXISTS public.community_likes (
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles("userId") ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
);

-- Tabela para Comentários na Comunidade
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    "authorId" UUID REFERENCES public.user_profiles("userId") ON DELETE CASCADE,
    "authorName" TEXT,
    "authorRole" TEXT,
    content TEXT NOT NULL,
    "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS) E PUBLICAÇÕES
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_comments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Realtime
alter publication supabase_realtime add table public.notices;
alter publication supabase_realtime add table public.community_posts;
alter publication supabase_realtime add table public.notice_comments;
alter publication supabase_realtime add table public.community_comments;

-- 4. POLÍTICAS RLS (Simples: Todos autenticados podem interagir, Avisos com controle de criação)
-- Notices
CREATE POLICY select_notices ON public.notices FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_notices ON public.notices FOR INSERT TO authenticated WITH CHECK (public.get_my_role() IN ('ti', 'rh', 'lider', 'diretor_administrativo', 'diretor_geral'));
CREATE POLICY delete_notices ON public.notices FOR DELETE TO authenticated USING ("authorId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'diretor_geral', 'diretor_administrativo'));

-- Notice Interactions (Reads, Likes, Comments)
CREATE POLICY select_n_reads ON public.notice_reads FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_n_reads ON public.notice_reads FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY select_n_likes ON public.notice_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_n_likes ON public.notice_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY delete_n_likes ON public.notice_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY select_n_comments ON public.notice_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_n_comments ON public.notice_comments FOR INSERT TO authenticated WITH CHECK ("authorId" = auth.uid());

-- Community
CREATE POLICY select_c_posts ON public.community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_c_posts ON public.community_posts FOR INSERT TO authenticated WITH CHECK ("authorId" = auth.uid());
CREATE POLICY delete_c_posts ON public.community_posts FOR DELETE TO authenticated USING ("authorId" = auth.uid() OR public.get_my_role() IN ('ti', 'rh', 'diretor_geral', 'diretor_administrativo'));

CREATE POLICY select_c_likes ON public.community_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_c_likes ON public.community_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY delete_c_likes ON public.community_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY select_c_comments ON public.community_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_c_comments ON public.community_comments FOR INSERT TO authenticated WITH CHECK ("authorId" = auth.uid());
