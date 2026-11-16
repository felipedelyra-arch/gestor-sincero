-- 0002_registro_atomico: gravação atômica dos dois formulários (porta RepositorioCadastros).
--
-- COMO APLICAR: igual à 0001 (supabase db push, ou colar no SQL Editor), sempre depois dela.
--
-- registrar_cadastro / registrar_pedido fazem, em uma transação só:
--   1. procuram registro da MESMA pessoa: email_hash E whatsapp_hash iguais (no pedido, também a
--      mesma empresa, sem diferenciar maiúsculas nem espaços nas pontas). Se só um dos dois coincide,
--      é tratado como outra pessoa e vira registro novo: o consentimento de um nunca cai no registro
--      de outro. A mesma pessoa pode pedir diagnóstico para mais de uma empresa;
--   2. se não existe, inserem; se existe, NÃO sobrescrevem nada, só marcam atualizado_em;
--   3. acrescentam os consentimentos e o evento de auditoria apontando para o registro.
-- Os parâmetros chegam em jsonb com as mesmas chaves das entidades do domínio (camelCase).
-- Funções "security invoker" (padrão): quem grava é o service_role, que já tem os privilégios.

begin;

-- Campos que o domínio registra e a 0001 não tinha.
alter table public.consentimentos
  add column versao_texto text check (versao_texto ~ '^[0-9a-f]{12}$');

alter table public.eventos_auditoria
  add column formulario text check (formulario in ('cadastro-jornada', 'ressonancia')),
  add column ip_hash    text check (ip_hash ~ '^[0-9a-f]{64}$'),
  -- Quem fez a ação, quando há usuário (exportação do admin): id de auth.users, sem FK para o
  -- registro sobreviver à exclusão do usuário.
  add column usuario_id uuid;

-- ---------------------------------------------------------------------------
-- Apoio: consentimentos + auditoria de um registro (usado pelas duas funções)
-- ---------------------------------------------------------------------------
create function public.anexar_registro(
  p_origem text, p_formulario text, p_id uuid, p_novo boolean,
  p_titular_hash text, p_consentimentos jsonb, p_auditoria jsonb
)
returns void
language sql
set search_path = ''
as $$
  insert into public.consentimentos
    (titular_hash, origem, registro_id, canal, concedido, texto_exibido, versao_texto, criado_em, ip_hash)
  select p_titular_hash, p_origem, p_id, c->>'canal', (c->>'aceito')::boolean, c->>'texto',
         c->>'versaoTexto', (c->>'data')::timestamptz, c->>'ipHash'
    from jsonb_array_elements(p_consentimentos) as c;

  insert into public.eventos_auditoria (criado_em, tipo, registro_id, formulario, ip_hash)
  values ((p_auditoria->>'data')::timestamptz,
          case when p_novo then 'registro_criado' else 'registro_atualizado' end,
          p_id, p_formulario, p_auditoria->>'ipHash');
$$;

-- ---------------------------------------------------------------------------
-- registrar_cadastro
-- ---------------------------------------------------------------------------
create function public.registrar_cadastro(p_cadastro jsonb, p_consentimentos jsonb, p_auditoria jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_email text := p_cadastro->>'emailHash';
  v_whats text := p_cadastro->>'whatsappHash';
  v_id    uuid;
  v_novo  boolean := false;
begin
  if v_email is null or v_whats is null then
    raise exception 'registrar_cadastro: parametros invalidos';
  end if;

  -- Envios simultâneos da mesma pessoa esperam aqui (e o unique do par garante no banco).
  perform pg_advisory_xact_lock(hashtextextended('cadastro:' || v_email || ':' || v_whats, 0));

  select c.id into v_id
    from public.cadastros c
   where c.email_hash = v_email and c.whatsapp_hash = v_whats;

  if v_id is null then
    insert into public.cadastros
      (nome, email_cifrado, whatsapp_cifrado, email_hash, whatsapp_hash, empresa, cargo, variacao, utm, afiliado)
    values
      (p_cadastro->>'nome', p_cadastro->>'emailCifrado', p_cadastro->>'whatsappCifrado', v_email, v_whats,
       p_cadastro->>'empresa', p_cadastro->>'cargo', p_cadastro->>'variacao',
       nullif(p_cadastro->'utm', 'null'::jsonb), p_cadastro->>'afiliado')
    returning id into v_id;
    v_novo := true;
  else
    update public.cadastros set atualizado_em = now() where id = v_id;
  end if;

  perform public.anexar_registro('cadastro', 'cadastro-jornada', v_id, v_novo, v_email, p_consentimentos, p_auditoria);
  return jsonb_build_object('id', v_id, 'novo', v_novo);
end;
$$;

-- ---------------------------------------------------------------------------
-- registrar_pedido (Ressonância Digital): mesmas regras, por pessoa + empresa
-- ---------------------------------------------------------------------------
create function public.registrar_pedido(p_pedido jsonb, p_consentimentos jsonb, p_auditoria jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_email text := p_pedido->>'emailHash';
  v_whats text := p_pedido->>'whatsappHash';
  v_empresa text := lower(btrim(p_pedido->>'empresa'));
  v_id    uuid;
  v_novo  boolean := false;
begin
  if v_email is null or v_whats is null or v_empresa is null then
    raise exception 'registrar_pedido: parametros invalidos';
  end if;

  -- Sem unique nesta tabela: é esta trava que impede o duplo clique de gravar dois pedidos iguais.
  perform pg_advisory_xact_lock(hashtextextended('pedido:' || v_email || ':' || v_whats || ':' || v_empresa, 0));

  select p.id into v_id
    from public.pedidos_ressonancia p
   where p.email_hash = v_email and p.whatsapp_hash = v_whats and lower(btrim(p.empresa)) = v_empresa
   order by p.criado_em
   limit 1;

  if v_id is null then
    insert into public.pedidos_ressonancia
      (nome, email_cifrado, whatsapp_cifrado, email_hash, whatsapp_hash, empresa, segmento,
       faixa_faturamento, numero_funcionarios, principal_desafio, utm, afiliado)
    values
      (p_pedido->>'nome', p_pedido->>'emailCifrado', p_pedido->>'whatsappCifrado', v_email, v_whats,
       p_pedido->>'empresa', p_pedido->>'segmento', p_pedido->>'faixaFaturamento',
       p_pedido->>'numeroFuncionarios', p_pedido->>'principalDesafio',
       nullif(p_pedido->'utm', 'null'::jsonb), p_pedido->>'afiliado')
    returning id into v_id;
    v_novo := true;
  else
    update public.pedidos_ressonancia set atualizado_em = now() where id = v_id;
  end if;

  perform public.anexar_registro('ressonancia', 'ressonancia', v_id, v_novo, v_email, p_consentimentos, p_auditoria);
  return jsonb_build_object('id', v_id, 'novo', v_novo);
end;
$$;

-- Funções nascem executáveis por PUBLIC: tirar e devolver só ao service_role.
revoke all on function public.anexar_registro(text, text, uuid, boolean, text, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.registrar_cadastro(jsonb, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.registrar_pedido(jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.anexar_registro(text, text, uuid, boolean, text, jsonb, jsonb) to service_role;
grant execute on function public.registrar_cadastro(jsonb, jsonb, jsonb) to service_role;
grant execute on function public.registrar_pedido(jsonb, jsonb, jsonb) to service_role;

commit;

-- CONFERÊNCIA depois de aplicar (só service_role e o dono devem aparecer):
--   select routine_name, grantee from information_schema.routine_privileges
--    where routine_schema = 'public' and routine_name like 'registrar_%';
