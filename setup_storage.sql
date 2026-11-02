-- Cria o bucket 'community_media'
insert into storage.buckets (id, name, public)
values ('community_media', 'community_media', true);

-- Permite que qualquer pessoa visualize a mídia
create policy "Media pública para visualização"
on storage.objects for select
to public
using ( bucket_id = 'community_media' );

-- Permite que usuários insiram novos arquivos
create policy "Qualquer pessoa pode fazer upload de mídia"
on storage.objects for insert
to public
with check ( bucket_id = 'community_media' );

-- (Opcional) Permite que usuários excluam seus próprios arquivos
create policy "Usuários podem deletar suas próprias mídias"
on storage.objects for delete
to public
using ( bucket_id = 'community_media' );
