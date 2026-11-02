-- Tabela para armazenar as mensagens do Chat Corporativo
create table public.direct_messages (
    id uuid default gen_random_uuid() primary key,
    sender_id uuid references public.user_profiles("userId") on delete cascade not null,
    receiver_id uuid references public.user_profiles("userId") on delete cascade not null,
    content text not null,
    is_read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativa o RLS (Row Level Security)
alter table public.direct_messages enable row level security;

-- Política de Inserção: O remetente tem que ser o usuário logado
create policy "Usuários podem enviar mensagens"
on public.direct_messages for insert
to authenticated
with check ( auth.uid() = sender_id );

-- Política de Seleção: O usuário logado deve ser o remetente ou o destinatário
create policy "Usuários podem ver suas próprias conversas"
on public.direct_messages for select
to authenticated
using ( auth.uid() = sender_id or auth.uid() = receiver_id );

-- Política de Atualização (marcar como lida): O destinatário pode atualizar
create policy "Destinatários podem marcar como lida"
on public.direct_messages for update
to authenticated
using ( auth.uid() = receiver_id )
with check ( auth.uid() = receiver_id );

-- Política de Deleção: O usuário pode apagar qualquer mensagem da sua própria conversa
create policy "Usuários podem apagar mensagens da própria conversa"
on public.direct_messages for delete
to authenticated
using ( auth.uid() = sender_id or auth.uid() = receiver_id );
