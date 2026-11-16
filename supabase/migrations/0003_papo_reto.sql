-- 0003_papo_reto: conversa do "Papo reto" guardada SÓ com consentimento (ADR 0003).
--
-- COMO APLICAR: igual à 0001 e à 0002, sempre depois delas.
--
-- As respostas (tema, opção ou número) e os ids das regras de contradição disparadas chegam cifrados (AES-256-GCM na
-- aplicação): o banco nunca vê a conversa em claro. O texto livre do visitante nunca é gravado.
-- A função de gravação apaga antes tudo o que tem mais de 30 dias, então não há agendador.
-- RLS ativa e nenhuma policy: só o service_role (servidor) acessa.

begin;

create table public.papo_reto (
  id                    uuid primary key default gen_random_uuid(),
  sessao                uuid not null,
  criada_em             timestamptz not null default now(),
  respostas_cifradas   text not null check (char_length(respostas_cifradas) between 1 and 40000),
  regras_cifradas text not null check (char_length(regras_cifradas) between 1 and 40000),
  recomendacao          text not null check (recomendacao in ('jornada', 'ressonancia', 'mentoria')),
  -- Só existe linha de quem consentiu: o check impede gravar sem aceite.
  consentimento         boolean not null default true check (consentimento),
  constraint papo_reto_sessao_unica unique (sessao)
);

create index papo_reto_criada_em_idx on public.papo_reto (criada_em);

alter table public.papo_reto enable row level security;
revoke all on table public.papo_reto from public, anon, authenticated;
grant select, insert, update, delete on table public.papo_reto to service_role;

create function public.registrar_papo_reto(p_sessao uuid, p_respostas text, p_regras text, p_recomendacao text)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if p_sessao is null or p_respostas is null or p_regras is null or p_recomendacao is null then
    raise exception 'registrar_papo_reto: parametros invalidos';
  end if;

  delete from public.papo_reto where criada_em < now() - interval '30 days';

  -- Reenvio da mesma sessão não duplica nem sobrescreve.
  insert into public.papo_reto (sessao, respostas_cifradas, regras_cifradas, recomendacao)
  values (p_sessao, p_respostas, p_regras, p_recomendacao)
  on conflict (sessao) do nothing;
end;
$$;

revoke all on function public.registrar_papo_reto(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.registrar_papo_reto(uuid, text, text, text) to service_role;

commit;

-- CONFERÊNCIA depois de aplicar: papo_reto com rowsecurity = true e zero policies.
--   select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename = 'papo_reto';
--   select count(*) from pg_policies where schemaname = 'public' and tablename = 'papo_reto';
