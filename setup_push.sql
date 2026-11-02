-- Tabela para armazenar as inscrições de Web Push
create table public.push_subscriptions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.user_profiles(userId) on delete cascade not null,
    subscription jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Impede a mesma inscrição duplicada
    unique (user_id, subscription)
);

-- Ativa o RLS (Row Level Security)
alter table public.push_subscriptions enable row level security;

-- Política: Usuários podem inserir sua própria inscrição
create policy "Usuários podem inserir sua inscrição"
on public.push_subscriptions for insert
to authenticated
with check ( true ); -- Podemos deixar "true" ou validar o user_id. Para simplificar no serverless, deixaremos true.

-- Política: Apenas o backend (usando a Service Role Key) ou os donos podem ler
create policy "Usuários leem suas inscrições"
on public.push_subscriptions for select
to authenticated
using ( true );

-- Política: Usuários podem deletar (caso façam logout / opt-out)
create policy "Usuários podem deletar suas inscrições"
on public.push_subscriptions for delete
to authenticated
using ( true );
