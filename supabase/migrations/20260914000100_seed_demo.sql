-- =============================================================================
-- MillenniumClub — dados de demonstração
--
-- ATENÇÃO: conteúdo FICTÍCIO, criado apenas para popular o dashboard em
-- desenvolvimento. No fim do arquivo há um bloco comentado para remover tudo.
--
-- Números resultantes em dashboard_kpis():
--   candidatos_aguardando       23
--   entrevistas_agendadas        8
--   aprovados_mes               12
--   membros_ativos             347
--   membros_pagantes           189
--   receita_assinaturas    R$ 135.933/mês
--   oportunidades_ativas        34
--   volume_solicitado      R$ 2,4 bi
--   remuneracoes_previstas R$ 890.000
--   docs_pendentes_atrasados     3
--   renovacoes_em_7_dias         5
--   remuneracoes_paradas         2
-- =============================================================================

begin;

-- ---------------------------------------------------------------- limpeza
truncate table
  public.remunerations,
  public.subscriptions,
  public.application_notes,
  public.application_interviews,
  public.application_documents,
  public.applications,
  public.badges,
  public.opportunities,
  public.members,
  public.companies,
  public.plans,
  public.notifications,
  public.audit_logs
cascade;

-- --------------------------------------------------------------------- planos
insert into public.plans (code, name, description, price_cents, billing_interval) values
  ('associate',    'Associado',    'Acesso à rede, eventos e conteúdos exclusivos',       49700, 'month'),
  ('professional', 'Profissional', 'Associado + oportunidades, comitês e originação',     99700, 'month'),
  ('corporate',    'Corporativo',  'Para empresas e múltiplos usuários',                 249700, 'month');

-- -------------------------------------------------------------------- empresas
with n as (
  select
    array['TechVentures','InvestBR Capital','AgroTech Sul','Consultoria 360','Representa Comercial',
          'Financeira Nacional','Nova Energia','LogPrime','Saúde Integrada','Construtora Horizonte'] as nomes,
    array['Tecnologia','Financeiro','Agronegócio','Consultoria','Serviços',
          'Energia','Logística','Saúde','Construção','Varejo'] as setores,
    array['São Paulo','Rio de Janeiro','Belo Horizonte','Curitiba','Porto Alegre','Recife','Fortaleza','Florianópolis'] as cidades,
    array['SP','RJ','MG','PR','RS','PE','CE','SC'] as ufs
)
insert into public.companies (name, sector, city, state, country)
select
  n.nomes[1 + (g % 10)] || ' ' || g,
  n.setores[1 + (g % 10)],
  n.cidades[1 + (g % 8)],
  n.ufs[1 + (g % 8)],
  'Brasil'
from n, generate_series(1, 40) g;

-- --------------------------------------------------------------------- membros
-- 362 registros: 347 ativos, 8 pendentes, 5 inativos e 2 suspensos.
with n as (
  select
    array['Ana','Bruno','Carla','Daniel','Eduarda','Felipe','Gabriela','Henrique','Isabela','João',
          'Karina','Lucas','Mariana','Nelson','Olívia','Paulo','Rafael','Sofia','Thiago','Vanessa'] as nomes,
    array['Almeida','Barbosa','Costa','Dias','Esteves','Ferreira','Gomes','Henriques','Ibrahim','Jardim',
          'Lima','Moraes','Nogueira','Oliveira','Pereira','Queiroz','Ramos','Santos','Teixeira','Vieira'] as sobrenomes,
    array['CEO','Diretor(a)','Sócio(a)','Investidor(a)','Consultor(a)','Especialista','Head'] as cargos,
    array['entrepreneur','investor','consultant','specialist','originator','representative'] as papeis
),
comp as (
  select id, name, city, state, row_number() over (order by name) as rn
  from public.companies
)
insert into public.members (
  member_code, full_name, email, phone, company_id, company_name, job_title,
  primary_role, status, joined_at, city, state, country
)
select
  'MC-' || lpad(g::text, 5, '0'),
  n.nomes[1 + (g % 20)] || ' ' || n.sobrenomes[1 + (g % 20)],
  'membro' || g || '@millenniumclub.com.br',
  '(11) 9' || lpad(((g * 137) % 10000)::text, 4, '0') || '-' || lpad(((g * 53) % 10000)::text, 4, '0'),
  c.id,
  c.name,
  n.cargos[1 + (g % 7)],
  n.papeis[1 + (g % 6)]::public.primary_role,
  case
    when g <= 347 then 'active'::public.member_status
    when g <= 355 then 'pending'::public.member_status
    when g <= 360 then 'inactive'::public.member_status
    else 'suspended'::public.member_status
  end,
  now() - ((g % 700) + 10) * interval '1 day',
  c.city,
  c.state,
  'Brasil'
from n, generate_series(1, 362) g
join comp c on c.rn = 1 + (g % 40);

-- ----------------------------------------------------------------- assinaturas
-- 189 assinaturas ativas: 120 Associado + 64 Profissional + 5 Corporativo.
with ativos as (
  select id, row_number() over (order by member_code) as rn
  from public.members
  where status = 'active'
),
planos as (
  select id, code from public.plans
)
insert into public.subscriptions (member_id, plan_id, status, price_cents, started_at, current_period_end)
select
  a.id,
  case
    when a.rn <= 120 then (select id from planos where code = 'associate')
    when a.rn <= 184 then (select id from planos where code = 'professional')
    else (select id from planos where code = 'corporate')
  end,
  'active'::public.subscription_status,
  case
    when a.rn <= 120 then 49700
    when a.rn <= 184 then 99700
    else 249700
  end,
  now() - ((a.rn % 300) + 40) * interval '1 day',
  case
    -- 5 assinaturas vencendo nos próximos 7 dias (alerta de renovação)
    when a.rn <= 5 then now() + (a.rn * interval '1 day')
    else now() + ((a.rn % 330) + 10) * interval '1 day'
  end
from ativos a
where a.rn <= 189;

update public.members
set is_paying = true
where id in (select member_id from public.subscriptions where status = 'active');

-- --------------------------------------------------------------- candidaturas
-- 70 candidaturas; 23 aguardando análise e 12 aprovadas neste mês.
with n as (
  select
    array['Ana','Bruno','Carla','Daniel','Eduarda','Felipe','Gabriela','Henrique','Isabela','João',
          'Karina','Lucas','Mariana','Nelson','Olívia','Paulo','Rafael','Sofia','Thiago','Vanessa'] as nomes,
    array['Almeida','Barbosa','Costa','Dias','Esteves','Ferreira','Gomes','Henriques','Ibrahim','Jardim',
          'Lima','Moraes','Nogueira','Oliveira','Pereira','Queiroz','Ramos','Santos','Teixeira','Vieira'] as sobrenomes,
    array['Tecnologia','Financeiro','Agronegócio','Consultoria','Energia','Saúde','Logística','Construção'] as setores,
    array['indication','event','linkedin','press','search'] as origens
),
comp as (
  select id, name, city, state, row_number() over (order by name) as rn
  from public.companies
),
apps as (
  select
    g,
    case
      when g <= 23 then (array['submitted','under_review','compliance_review'])[1 + (g % 3)]::public.application_status
      when g <= 35 then 'approved'::public.application_status
      when g <= 40 then 'interview_scheduled'::public.application_status
      when g <= 45 then 'interviewed'::public.application_status
      when g <= 50 then 'docs_pending'::public.application_status
      when g <= 58 then 'rejected'::public.application_status
      when g <= 62 then 'converted'::public.application_status
      else 'rejected'::public.application_status
    end as status
  from generate_series(1, 70) g
)
insert into public.applications (
  code, full_name, email, phone, job_title, company_name, company_id, city, state,
  primary_role, sectors, network_objective, contribution, signup_source, referred_by,
  status, score, submitted_at, decided_at, privacy_policy_accepted, truthfulness_confirmed
)
select
  'APP-' || to_char(now(), 'YYYY') || '-' || lpad(a.g::text, 4, '0'),
  n.nomes[1 + (a.g % 20)] || ' ' || n.sobrenomes[1 + (a.g % 20)],
  'candidato' || a.g || '@exemplo.com.br',
  '(11) 9' || lpad(((a.g * 211) % 10000)::text, 4, '0') || '-' || lpad(((a.g * 79) % 10000)::text, 4, '0'),
  (array['CEO','Diretor(a)','Sócio(a)','Investidor(a)','Consultor(a)','Especialista'])[1 + (a.g % 6)],
  c.name,
  c.id,
  c.city,
  c.state,
  (array['entrepreneur','investor','consultant','specialist','originator','representative'])[1 + (a.g % 6)]::public.primary_role,
  n.setores[1 + (a.g % 8)],
  'Busco ampliar a rede no setor de ' || n.setores[1 + (a.g % 8)] || '.',
  'Network, capital e experiência em ' || n.setores[1 + (a.g % 8)] || '.',
  n.origens[1 + (a.g % 5)],
  case when a.g % 4 = 0 then null else 'Membro Indicador ' || (a.g % 12) end,
  a.status,
  (50 + ((a.g * 7) % 50))::smallint,
  now() - ((a.g % 40) + 1) * interval '1 day',
  case
    -- aprovadas neste mês → decididas dentro do mês corrente
    when a.status = 'approved' then date_trunc('month', now()) + (a.g % 10) * interval '1 day'
    when a.status in ('converted', 'rejected') then now() - ((a.g % 40) + 2) * interval '1 day'
    else null
  end,
  true,
  true
from n, apps a
join comp c on c.rn = 1 + (a.g % 40);

-- ------------------------------------------------------ documentos e entrevistas
-- 3 documentos pendentes há mais de 7 dias (alerta de documentação).
with pendentes as (
  select id, row_number() over (order by code) as rn
  from public.applications
  where status = 'docs_pending'
)
insert into public.application_documents (application_id, name, doc_type, status, created_at)
select p.id, d.name, d.doc_type, d.status::public.document_status, d.created_at
from pendentes p
join (
  values
    (1, 'CPF', 'pf', 'approved', now() - interval '31 days'),
    (2, 'Contrato social da empresa', 'pj', 'pending', now() - interval '12 days'),
    (3, 'Declaração de imposto de renda', 'pf', 'pending', now() - interval '12 days'),
    (4, 'Comprovante de residência', 'pf', 'pending', now() - interval '12 days'),
    (5, 'Comprovante de faturamento', 'pj', 'pending', now() - interval '2 days')
) as d(rn, name, doc_type, status, created_at) on d.rn = p.rn;

-- 8 entrevistas agendadas para os próximos dias.
with alvo as (
  select id, row_number() over (order by code) as rn
  from public.applications
)
insert into public.application_interviews (application_id, title, scheduled_at, duration_minutes, status, location)
select
  t.id,
  'Entrevista de screening',
  now() + (d.rn * interval '1 day') + interval '14 hours',
  30,
  'scheduled'::public.interview_status,
  'Videoconferência'
from alvo t
join (values (1),(2),(3),(4),(5),(6),(7),(8)) as d(rn) on d.rn = t.rn;

-- Notas internas de exemplo.
insert into public.application_notes (application_id, author_name, content, is_internal, created_at)
select
  a.id,
  'Admin Master',
  'Perfil forte em ' || coalesce(a.sectors, 'negócios') || '. Histórico consistente. Recomendo aprovação.',
  true,
  now() - interval '2 days'
from public.applications a
order by a.code
limit 3;

-- --------------------------------------------------------------- oportunidades
-- 26 ativas (R$ 2,4 bi) + 8 em negociação (R$ 800 mi).
with vals as (
  select
    array[50000000,60000000,70000000,80000000,90000000,100000000,110000000,120000000,
          130000000,140000000,100000000,90000000,60000000]::numeric[] as ativos,
    array[80000000,90000000,100000000,110000000,120000000,130000000,90000000,80000000]::numeric[] as negociacao
),
comp as (
  select id, row_number() over (order by name) as rn
  from public.companies
)
insert into public.opportunities (title, summary, company_id, sector, stage, requested_volume, expected_close_at)
select
  'Oportunidade ' || lpad(g::text, 3, '0') || ' — ' || case when g % 2 = 0 then 'Captação' else 'M&A' end,
  'Operação de ' || case when g % 2 = 0 then 'captação de recursos' else 'fusão e aquisição' end || ' no setor.',
  c.id,
  (array['Tecnologia','Financeiro','Agronegócio','Energia','Logística','Saúde','Construção','Varejo'])[1 + (g % 8)],
  'active'::public.opportunity_stage,
  v.ativos[1 + (g % 13)],
  now() + ((g % 90) + 15) * interval '1 day'
from vals v, generate_series(0, 25) g
join comp c on c.rn = 1 + (g % 40);

with vals as (
  select array[80000000,90000000,100000000,110000000,120000000,130000000,90000000,80000000]::numeric[] as negociacao
),
comp as (
  select id, row_number() over (order by name) as rn
  from public.companies
)
insert into public.opportunities (title, summary, company_id, sector, stage, requested_volume, expected_close_at)
select
  'Oportunidade ' || lpad((100 + g)::text, 3, '0') || ' — Negociação',
  'Operação em fase final de negociação.',
  c.id,
  (array['Tecnologia','Financeiro','Agronegócio','Energia','Logística','Saúde','Construção','Varejo'])[1 + (g % 8)],
  'negotiation'::public.opportunity_stage,
  v.negociacao[1 + (g % 8)],
  now() + ((g % 45) + 5) * interval '1 day'
from vals v, generate_series(0, 7) g
join comp c on c.rn = 1 + (g % 40);

-- ---------------------------------------------------------------- remunerações
-- Previstas R$ 890.000 (660.000 pendentes + 230.000 aprovadas);
-- 2 pendentes com mais de 10 dias aguardando aprovação.
with opp as (
  select id, row_number() over (order by id) as rn from public.opportunities
),
mem as (
  select id, row_number() over (order by member_code) as rn from public.members where status = 'active'
)
insert into public.remunerations (
  opportunity_id, member_id, description, amount, status, created_at, approved_at, due_date, paid_at
)
select
  (select id from opp where rn = v.rn),
  (select id from mem where rn = v.rn),
  v.description,
  v.amount,
  v.status::public.remuneration_status,
  v.created_at,
  v.approved_at,
  v.due_date,
  v.paid_at
from (
  values
    -- aprovadas (a pagar): R$ 230.000
    (1,  'Comissão de originação — Captação TechVentures',       50000.00, 'approved', now() - interval '25 days', now() - interval '6 days',  now() + interval '5 days',  null::timestamptz),
    (2,  'Comissão de originação — M&A AgroTech Sul',            50000.00, 'approved', now() - interval '22 days', now() - interval '4 days',  now() + interval '8 days',  null::timestamptz),
    (3,  'Remuneração por intermediação — LogPrime',             50000.00, 'approved', now() - interval '18 days', now() - interval '3 days',  now() + interval '12 days', null::timestamptz),
    (4,  'Remuneração por intermediação — Nova Energia',         50000.00, 'approved', now() - interval '15 days', now() - interval '2 days',  now() + interval '15 days', null::timestamptz),
    (5,  'Consultoria pontual — Construtora Horizonte',          30000.00, 'approved', now() - interval '12 days', now() - interval '1 day',   now() + interval '20 days', null::timestamptz),
    -- pendentes antigas (aguardando aprovação há > 10 dias)
    (6,  'Comissão de originação — Saúde Integrada',            110000.00, 'pending',  now() - interval '22 days', null, now() + interval '30 days', null::timestamptz),
    (7,  'Comissão de originação — Financeira Nacional',        110000.00, 'pending',  now() - interval '18 days', null, now() + interval '30 days', null::timestamptz),
    -- pendentes recentes
    (8,  'Originação — Consultoria 360',                        110000.00, 'pending',  now() - interval '3 days',  null, now() + interval '30 days', null::timestamptz),
    (9,  'Originação — Representa Comercial',                   110000.00, 'pending',  now() - interval '2 days',  null, now() + interval '30 days', null::timestamptz),
    (10, 'Originação — InvestBR Capital',                       110000.00, 'pending',  now() - interval '2 days',  null, now() + interval '30 days', null::timestamptz),
    (11, 'Originação — AgroTech Sul',                           110000.00, 'pending',  now() - interval '1 day',   null, now() + interval '30 days', null::timestamptz)
) as v(rn, description, amount, status, created_at, approved_at, due_date, paid_at);

-- ----------------------------------------------------------------------- selos
with mem as (
  select id, row_number() over (order by member_code) as rn
  from public.members
  where status = 'active'
)
insert into public.badges (member_id, kind, label)
select m.id, d.kind::public.badge_kind, d.label
from mem m
join (
  values
    (1,  'founding_member',  'Membro Fundador'),
    (2,  'verified_profile', 'Perfil Verificado'),
    (3,  'top_originator',   'Top Originador 2026'),
    (4,  'specialist',       'Especialista em Agronegócio'),
    (5,  'verified_profile', 'Perfil Verificado'),
    (6,  'referrer',         'Indicador Ativo'),
    (7,  'founding_member',  'Membro Fundador'),
    (8,  'verified_profile', 'Perfil Verificado'),
    (9,  'top_originator',   'Top Originador 2026'),
    (10, 'specialist',       'Especialista em Tecnologia'),
    (11, 'verified_profile', 'Perfil Verificado'),
    (12, 'referrer',         'Indicador Ativo')
) as d(rn, kind, label) on d.rn = m.rn;

-- ------------------------------------------------------------------ auditoria
insert into public.audit_logs (actor_name, action, entity, entity_id, description, created_at) values
  ('Admin Master', 'Candidatura aprovada',    'application',  'APP-2026-0024', 'Maria Santos — Investidora em FinTech',              now() - interval '15 minutes'),
  ('Admin Master', 'Entrevista agendada',     'application',  'APP-2026-0036', 'Ana Paula Costa — amanhã às 14:00',                  now() - interval '1 hour'),
  ('Admin Master', 'Selo emitido',            'badge',        'verified_profile', 'Perfil Verificado para Carlos Silva',             now() - interval '2 hours'),
  ('Admin Master', 'Nova assinatura',         'subscription', null,            'Plano Profissional — TechVentures Ltda',             now() - interval '3 hours'),
  ('Compliance',   'Documentos solicitados',  'application',  'APP-2026-0046', 'Contrato social atualizado',                         now() - interval '4 hours'),
  ('Admin Master', 'Membro ativado',          'member',       'MC-00042',      'Conversão de candidatura aprovada',                  now() - interval '6 hours');

commit;

-- =============================================================================
-- Como remover os dados de demonstração (rodar no SQL Editor do Supabase):
--
--   truncate table
--     public.remunerations, public.subscriptions, public.opportunities,
--     public.application_notes, public.application_interviews,
--     public.application_documents, public.applications, public.badges,
--     public.members, public.companies, public.plans, public.notifications,
--     public.audit_logs
--   cascade;
--
-- Os dados de autenticação (auth.users e public.profiles) não são afetados.
-- =============================================================================
