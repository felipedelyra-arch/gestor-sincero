-- 0001_inicial: tabelas de captação, consentimentos, auditoria, limite de taxa e bucket do manual.
--
-- COMO APLICAR
--   Com a CLI:    supabase link --project-ref <ref> && supabase db push
--   Sem a CLI:    Dashboard > SQL Editor > colar este arquivo inteiro e executar (roda em uma transação).
--   Depois:       enviar o PDF do manual para o bucket privado "manual" (Dashboard > Storage) e pôr o
--                 caminho do arquivo em MANUAL_STORAGE_CAMINHO.
--
-- COMO CRIAR O USUÁRIO ADMIN (exportação CSV)
--   1. Dashboard > Authentication > Users > Add user (e-mail + senha forte, "Auto Confirm User").
--      Desligue o cadastro público em Authentication > Sign In / Providers ("Allow new users to sign up").
--   2. No SQL Editor (app_metadata só é gravável pelo servidor, nunca pelo próprio usuário):
--        update auth.users
--           set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"papel":"admin"}'::jsonb
--         where email = 'EMAIL_DO_ADMIN';
--   3. O usuário precisa entrar de novo para o JWT carregar app_metadata.papel = "admin".
--
-- MODELO DE ACESSO
--   RLS ativa em todas as tabelas e NENHUMA policy: anon e authenticated não leem nem gravam nada.
--   Só o service_role (usado apenas no servidor Next.js) acessa, porque ignora RLS.
--   E-mail e WhatsApp chegam aqui já cifrados (AES-256-GCM na aplicação) e com HMAC para deduplicar.

begin;

-- ---------------------------------------------------------------------------
-- Função de apoio: atualizado_em
-- ---------------------------------------------------------------------------
create function public.tocar_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- cadastros (manual + Jornada)
-- ---------------------------------------------------------------------------
create table public.cadastros (
  id               uuid primary key default gen_random_uuid(),
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now(),
  nome             text not null check (char_length(nome) between 2 and 120),
  email_cifrado    text not null check (char_length(email_cifrado) between 1 and 1024),
  whatsapp_cifrado text not null check (char_length(whatsapp_cifrado) between 1 and 1024),
  email_hash       text not null check (email_hash ~ '^[0-9a-f]{64}$'),
  whatsapp_hash    text not null check (whatsapp_hash ~ '^[0-9a-f]{64}$'),
  empresa          text check (char_length(empresa) <= 120),
  cargo            text check (char_length(cargo) <= 80),
  variacao         text not null check (variacao in ('a', 'b')),
  utm              jsonb check (jsonb_typeof(utm) = 'object' and octet_length(utm::text) <= 4000),
  afiliado         text check (char_length(afiliado) <= 80),
  -- Só o par identifica a pessoa: mesmo e-mail com outro telefone (ou o contrário) é outro registro.
  constraint cadastros_contato_unico unique (email_hash, whatsapp_hash)
);

create index cadastros_whatsapp_hash_idx on public.cadastros (whatsapp_hash);
create index cadastros_criado_em_idx on public.cadastros (criado_em desc);

create trigger cadastros_tocar_atualizado_em
  before update on public.cadastros
  for each row execute function public.tocar_atualizado_em();

-- ---------------------------------------------------------------------------
-- pedidos_ressonancia
-- ---------------------------------------------------------------------------
create table public.pedidos_ressonancia (
  id                  uuid primary key default gen_random_uuid(),
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now(),
  nome                text not null check (char_length(nome) between 2 and 120),
  email_cifrado       text not null check (char_length(email_cifrado) between 1 and 1024),
  whatsapp_cifrado    text not null check (char_length(whatsapp_cifrado) between 1 and 1024),
  email_hash          text not null check (email_hash ~ '^[0-9a-f]{64}$'),
  whatsapp_hash       text not null check (whatsapp_hash ~ '^[0-9a-f]{64}$'),
  empresa             text not null check (char_length(empresa) between 1 and 120),
  segmento            text not null check (char_length(segmento) between 1 and 120),
  faixa_faturamento   text not null check (faixa_faturamento in (
                        'ate-360-mil', '360-mil-a-4-8-milhoes', '4-8-a-30-milhoes',
                        'acima-de-30-milhoes', 'prefiro-nao-informar')),
  numero_funcionarios text not null check (numero_funcionarios in (
                        '1-5', '6-20', '21-50', '51-200', 'mais-de-200')),
  principal_desafio   text not null check (char_length(principal_desafio) between 1 and 1000),
  utm                 jsonb check (jsonb_typeof(utm) = 'object' and octet_length(utm::text) <= 4000),
  afiliado            text check (char_length(afiliado) <= 80)
);

-- Sem unique: a mesma pessoa pode pedir diagnóstico para mais de uma empresa.
create index pedidos_ressonancia_email_hash_idx on public.pedidos_ressonancia (email_hash);
create index pedidos_ressonancia_whatsapp_hash_idx on public.pedidos_ressonancia (whatsapp_hash);
create index pedidos_ressonancia_criado_em_idx on public.pedidos_ressonancia (criado_em desc);

create trigger pedidos_ressonancia_tocar_atualizado_em
  before update on public.pedidos_ressonancia
  for each row execute function public.tocar_atualizado_em();

-- ---------------------------------------------------------------------------
-- consentimentos (prova LGPD: uma linha por canal e por envio; nunca atualizar, só inserir)
-- registro_id aponta para cadastros.id ou pedidos_ressonancia.id conforme "origem" (sem FK por isso).
-- ---------------------------------------------------------------------------
create table public.consentimentos (
  id            uuid primary key default gen_random_uuid(),
  titular_hash  text not null check (titular_hash ~ '^[0-9a-f]{64}$'),
  origem        text not null check (origem in ('cadastro', 'ressonancia')),
  registro_id   uuid not null,
  canal         text not null check (canal in ('whatsapp', 'email', 'privacidade')),
  concedido     boolean not null,
  texto_exibido text not null check (char_length(texto_exibido) between 1 and 2000),
  criado_em     timestamptz not null default now(),
  ip_hash       text check (ip_hash ~ '^[0-9a-f]{64}$')
);

create index consentimentos_titular_hash_idx on public.consentimentos (titular_hash);
create index consentimentos_registro_id_idx on public.consentimentos (registro_id);
create index consentimentos_criado_em_idx on public.consentimentos (criado_em desc);

-- ---------------------------------------------------------------------------
-- eventos_auditoria (detalhe NUNCA carrega dado pessoal: só ids, tipos e contagens)
-- ---------------------------------------------------------------------------
create table public.eventos_auditoria (
  id          uuid primary key default gen_random_uuid(),
  criado_em   timestamptz not null default now(),
  tipo        text not null check (char_length(tipo) between 1 and 80),
  registro_id uuid,
  detalhe     jsonb check (jsonb_typeof(detalhe) = 'object' and octet_length(detalhe::text) <= 4000)
);

create index eventos_auditoria_criado_em_idx on public.eventos_auditoria (criado_em desc);
create index eventos_auditoria_registro_id_idx on public.eventos_auditoria (registro_id);

-- ---------------------------------------------------------------------------
-- limites_taxa + consumir_limite (janela fixa por chave; a chave já vem com o IP em hash)
-- ---------------------------------------------------------------------------
create table public.limites_taxa (
  chave     text primary key check (char_length(chave) between 1 and 200),
  expira_em timestamptz not null,
  contagem  integer not null default 1 check (contagem >= 1)
);

create index limites_taxa_expira_em_idx on public.limites_taxa (expira_em);

-- Devolve true se a chamada cabe no limite. A contagem é um único comando (insert ... on conflict
-- do update): a linha fica travada durante a atualização, então chamadas simultâneas não perdem contagem.
-- Cada chamada também apaga janelas vencidas (de qualquer chave): o hash de IP não fica guardado além
-- da janela mais o intervalo até a próxima chamada, sem depender de agendador.
create function public.consumir_limite(p_chave text, p_max integer, p_janela_segundos integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_contagem integer;
begin
  if p_chave is null or char_length(p_chave) not between 1 and 200
     or p_max is null or p_max < 1
     or p_janela_segundos is null or p_janela_segundos < 1 then
    raise exception 'consumir_limite: parametros invalidos';
  end if;

  -- Em lotes e pulando linhas travadas: barato e sem esperar outra chamada.
  delete from public.limites_taxa
   where chave in (
     select v.chave from public.limites_taxa v
      where v.expira_em <= now()
      order by v.expira_em
      limit 200
      for update skip locked);

  insert into public.limites_taxa as l (chave, expira_em, contagem)
  values (p_chave, now() + make_interval(secs => p_janela_segundos), 1)
  on conflict (chave) do update
    -- Linha vencida que a limpeza pulou (travada por outra chamada): recomeça a janela.
    set expira_em = case
          when l.expira_em <= now() then now() + make_interval(secs => p_janela_segundos)
          else l.expira_em
        end,
        contagem = case
          when l.expira_em <= now() then 1
          -- teto evita estouro de integer sob ataque prolongado
          else least(l.contagem + 1, 1000000)
        end
  returning l.contagem into v_contagem;

  return v_contagem <= p_max;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS e privilégios: nega tudo a anon/authenticated; só service_role
-- ---------------------------------------------------------------------------
alter table public.cadastros           enable row level security;
alter table public.pedidos_ressonancia enable row level security;
alter table public.consentimentos      enable row level security;
alter table public.eventos_auditoria   enable row level security;
alter table public.limites_taxa        enable row level security;
-- Nenhuma policy de propósito: com RLS ativa e sem policy, nada passa para quem não ignora RLS.

revoke all on table
  public.cadastros,
  public.pedidos_ressonancia,
  public.consentimentos,
  public.eventos_auditoria,
  public.limites_taxa
from public, anon, authenticated;

grant select, insert, update, delete on table
  public.cadastros,
  public.pedidos_ressonancia,
  public.consentimentos,
  public.eventos_auditoria,
  public.limites_taxa
to service_role;

-- Funções nascem executáveis por PUBLIC no Postgres: tirar e devolver só ao service_role.
revoke all on function public.consumir_limite(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consumir_limite(text, integer, integer) to service_role;
revoke all on function public.tocar_atualizado_em() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: bucket privado do manual. storage.objects já tem RLS ativa e não criamos policy,
-- então o arquivo só sai por URL assinada gerada no servidor com o service_role.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('manual', 'manual', false, 52428800, array['application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

commit;

-- CONFERÊNCIA depois de aplicar (deve listar as 5 tabelas com rowsecurity = true e zero policies):
--   select tablename, rowsecurity from pg_tables where schemaname = 'public';
--   select count(*) from pg_policies where schemaname = 'public';
--   select grantee, privilege_type from information_schema.role_table_grants
--    where table_schema = 'public' and grantee in ('anon', 'authenticated');   -- zero linhas
