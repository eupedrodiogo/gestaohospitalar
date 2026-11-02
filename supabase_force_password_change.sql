ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT FALSE;

-- Opcional: Se desejar forçar todos os usuários existentes a trocarem a senha, mude DEFAULT FALSE para DEFAULT TRUE.
-- Atualmente está FALSE para não impactar os usuários que já utilizam o sistema.
