-- =============================================================================
-- MillenniumClub — schema inicial
-- Cria o modelo de dados de membros, candidaturas, empresas, oportunidades,
-- assinaturas, remunerações, selos, notificações e auditoria, com RLS e uma
-- função agregadora usada pelo dashboard administrativo.
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- tipos (enums)
create type public.user_role as enum ('member', 'admin', 'compliance');

create type public.member_status as enum ('pending', 'active', 'inactive', 'suspended');

create type public.primary_role as enum (
  'entrepreneur', 'investor', 'consultant', 'specialist',
  'originator', 'representative', 'institutional_partner', 'service_provider'
);

create type public.application_status as enum (
  'draft', 'submitted', 'under_review', 'docs_pending', 'interview_scheduled',
  'interviewed', 'compliance_review', 'approved', 'rejected', 'suspended', 'converted'
);

create type public.document_status as enum ('pending', 'approved', 'rejected');

create type public.interview_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');

create type public.opportunity_stage as enum (
  'prospecting', 'active', 'negotiation', 'closed_won', 'closed_lost', 'paused'
);

create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'expired');

create type public.remuneration_status as enum ('pending', 'approved', 'paid', 'rejected');

create type public.badge_kind as enum (
  'verified_profile', 'founding_member', 'top_originator', 'specialist', 'referrer'
);

-- ------------------------------------------------------------------- utilidades
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --------------------------------------------------------------------- perfis
-- Espelha auth.users e guarda o papel do usuário na plataforma.
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  phone      text,
  avatar_url text,
  role       public.user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Cria o perfil automaticamente quando um usuário se cadastra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name',
             nullif(trim(concat_ws(' ',
               new.raw_user_meta_data ->> 'first_name',
               new.raw_user_meta_data ->> 'last_name')), '')),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------------- empresas
create table public.companies (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  legal_name text,
  tax_id     text,
  sector     text,
  country    text default 'Brasil',
  state      text,
  city       text,
  website    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index companies_name_idx on public.companies (lower(name));

create trigger companies_set_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

-- --------------------------------------------------------------------- membros
create table public.members (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid references public.profiles (id) on delete set null,
  member_code  text unique,
  full_name    text not null,
  email        text not null,
  phone        text,
  company_id   uuid references public.companies (id) on delete set null,
  company_name text,
  job_title    text,
  primary_role public.primary_role,
  status       public.member_status not null default 'pending',
  is_paying    boolean not null default false,
  avatar_url   text,
  city         text,
  state        text,
  country      text default 'Brasil',
  joined_at    timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index members_status_idx on public.members (status);
create index members_profile_idx on public.members (profile_id);
create index members_joined_idx on public.members (joined_at desc);

create trigger members_set_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

-- --------------------------------------------------------------- candidaturas
-- Espelha os campos do formulário público em /candidatura.
create table public.applications (
  id                    uuid primary key default gen_random_uuid(),
  code                  text unique,
  -- etapa 1: informações básicas
  full_name             text not null,
  email                 text not null,
  phone                 text,
  whatsapp              text,
  job_title             text,
  company_name          text,
  company_id            uuid references public.companies (id) on delete set null,
  country               text default 'Brasil',
  state                 text,
  city                  text,
  linkedin              text,
  website               text,
  languages             text,
  timezone              text default 'America/Sao_Paulo',
  -- etapa 2: perfil profissional
  primary_role          public.primary_role,
  additional_roles      text,
  sectors               text,
  executive_bio         text,
  professional_history  text,
  competencies          text,
  key_results           text,
  professional_references text,
  -- etapa 3: negócios e investimento
  network_objective     text,
  interest_sectors      text,
  interest_regions      text,
  min_ticket            numeric(14, 2),
  max_ticket            numeric(14, 2),
  revenue_bracket       text,
  business_stages       text,
  preferred_models      text,
  participation_interests text,
  -- etapa 4: contribuição e consentimento
  contribution          text,
  committee_interests   text,
  referred_by           text,
  signup_source         text,
  privacy_policy_accepted boolean not null default false,
  marketing_consent     boolean not null default false,
  truthfulness_confirmed boolean not null default false,
  -- pipeline
  status                public.application_status not null default 'submitted',
  score                 smallint check (score is null or score between 0 and 100),
  reviewer_id           uuid references public.profiles (id) on delete set null,
  converted_member_id   uuid references public.members (id) on delete set null,
  submitted_at          timestamptz default now(),
  decided_at            timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index applications_status_idx on public.applications (status);
create index applications_submitted_idx on public.applications (submitted_at desc);
create index applications_email_idx on public.applications (lower(email));

create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

create table public.application_documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  name           text not null,
  doc_type       text,
  file_path      text,
  status         public.document_status not null default 'pending',
  requested_at   timestamptz,
  reviewed_at    timestamptz,
  reviewed_by    uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now()
);

create index application_documents_application_idx
  on public.application_documents (application_id, status);

create table public.application_interviews (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  title          text not null default 'Entrevista de screening',
  scheduled_at   timestamptz not null,
  duration_minutes integer default 30,
  status         public.interview_status not null default 'scheduled',
  interviewer_id uuid references public.profiles (id) on delete set null,
  location       text,
  notes          text,
  created_at     timestamptz not null default now()
);

create index application_interviews_schedule_idx
  on public.application_interviews (scheduled_at, status);

create table public.application_notes (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  author_id      uuid references public.profiles (id) on delete set null,
  author_name    text,
  content        text not null,
  is_internal    boolean not null default true,
  created_at     timestamptz not null default now()
);

create index application_notes_application_idx
  on public.application_notes (application_id, created_at desc);

-- ---------------------------------------------------------------------- planos
create table public.plans (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,
  name         text not null,
  description  text,
  price_cents  integer not null default 0,
  currency     text not null default 'BRL',
  billing_interval text not null default 'month',
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------- assinaturas
create table public.subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  member_id          uuid not null references public.members (id) on delete cascade,
  plan_id            uuid references public.plans (id) on delete set null,
  status             public.subscription_status not null default 'active',
  price_cents        integer not null default 0,
  currency           text not null default 'BRL',
  started_at         timestamptz not null default now(),
  current_period_end timestamptz,
  canceled_at        timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index subscriptions_status_idx on public.subscriptions (status);
create index subscriptions_member_idx on public.subscriptions (member_id);
create index subscriptions_renewal_idx on public.subscriptions (current_period_end);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- --------------------------------------------------------------- oportunidades
create table public.opportunities (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  summary          text,
  company_id       uuid references public.companies (id) on delete set null,
  owner_member_id  uuid references public.members (id) on delete set null,
  sector           text,
  stage            public.opportunity_stage not null default 'prospecting',
  requested_volume numeric(14, 2),
  currency         text not null default 'BRL',
  expected_close_at timestamptz,
  closed_at        timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index opportunities_stage_idx on public.opportunities (stage);
create index opportunities_owner_idx on public.opportunities (owner_member_id);

create trigger opportunities_set_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- remunerações
create table public.remunerations (
  id             uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities (id) on delete set null,
  member_id      uuid references public.members (id) on delete set null,
  description    text,
  amount         numeric(14, 2) not null default 0,
  currency       text not null default 'BRL',
  status         public.remuneration_status not null default 'pending',
  due_date       timestamptz,
  approved_at    timestamptz,
  approved_by    uuid references public.profiles (id) on delete set null,
  paid_at        timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index remunerations_status_idx on public.remunerations (status);
create index remunerations_member_idx on public.remunerations (member_id);

create trigger remunerations_set_updated_at
  before update on public.remunerations
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------- selos
create table public.badges (
  id         uuid primary key default gen_random_uuid(),
  member_id  uuid references public.members (id) on delete cascade,
  kind       public.badge_kind not null,
  label      text not null,
  issued_at  timestamptz not null default now(),
  issued_by  uuid references public.profiles (id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index badges_member_idx on public.badges (member_id);

-- ----------------------------------------------------------------- notificações
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles (id) on delete cascade,
  title      text not null,
  body       text,
  kind       text not null default 'info',
  href       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

-- ------------------------------------------------------------------- auditoria
create table public.audit_logs (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references public.profiles (id) on delete set null,
  actor_name text,
  action     text not null,
  entity     text,
  entity_id  text,
  description text,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_created_idx on public.audit_logs (created_at desc);

-- ------------------------------------------------------------------- util RLS
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'compliance')
  );
$$;

-- ------------------------------------------------------------------------- RLS
alter table public.profiles               enable row level security;
alter table public.companies              enable row level security;
alter table public.members                enable row level security;
alter table public.applications           enable row level security;
alter table public.application_documents  enable row level security;
alter table public.application_interviews enable row level security;
alter table public.application_notes      enable row level security;
alter table public.plans                  enable row level security;
alter table public.subscriptions          enable row level security;
alter table public.opportunities          enable row level security;
alter table public.remunerations          enable row level security;
alter table public.badges                 enable row level security;
alter table public.notifications          enable row level security;
alter table public.audit_logs             enable row level security;

-- profiles: cada um vê e edita o próprio; administradores veem todos.
create policy profiles_select_own on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_all on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- companies: leitura para membros autenticados, escrita para administradores.
create policy companies_select_auth on public.companies
  for select to authenticated using (true);
create policy companies_admin_write on public.companies
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- members: o próprio membro ou administradores.
create policy members_select_own on public.members
  for select to authenticated using (profile_id = auth.uid() or public.is_admin());
create policy members_admin_all on public.members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- applications: o formulário público pode enviar; só admin lê.
create policy applications_public_insert on public.applications
  for insert to anon, authenticated with check (true);
create policy applications_admin_read on public.applications
  for select to authenticated using (public.is_admin());
create policy applications_admin_write on public.applications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy applications_admin_delete on public.applications
  for delete to authenticated using (public.is_admin());

-- documentos, entrevistas e notas: exclusivo de administradores.
create policy application_documents_admin on public.application_documents
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy application_interviews_admin on public.application_interviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy application_notes_admin on public.application_notes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- plans: preços são públicos (página /planos).
create policy plans_public_read on public.plans
  for select to anon, authenticated using (is_active);
create policy plans_admin_write on public.plans
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- subscriptions: o próprio membro ou administradores.
create policy subscriptions_select_own on public.subscriptions
  for select to authenticated using (
    public.is_admin()
    or exists (select 1 from public.members m where m.id = member_id and m.profile_id = auth.uid())
  );
create policy subscriptions_admin_write on public.subscriptions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- opportunities: visíveis para membros autenticados, gerenciadas por administradores.
create policy opportunities_select_auth on public.opportunities
  for select to authenticated using (true);
create policy opportunities_admin_write on public.opportunities
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- remunerations: o próprio membro ou administradores.
create policy remunerations_select_own on public.remunerations
  for select to authenticated using (
    public.is_admin()
    or exists (select 1 from public.members m where m.id = member_id and m.profile_id = auth.uid())
  );
create policy remunerations_admin_write on public.remunerations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- badges: selos podem ser exibidos publicamente.
create policy badges_public_read on public.badges
  for select to anon, authenticated using (true);
create policy badges_admin_write on public.badges
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- notifications: cada usuário vê as suas.
create policy notifications_own on public.notifications
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy notifications_own_update on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notifications_admin_write on public.notifications
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- audit_logs: leitura administrativa.
create policy audit_logs_admin_read on public.audit_logs
  for select to authenticated using (public.is_admin());
create policy audit_logs_admin_write on public.audit_logs
  for insert to authenticated with check (public.is_admin());

-- ------------------------------------------------------- KPIs do dashboard
-- Agrega os indicadores exibidos em /admin em uma única chamada.
create or replace function public.dashboard_kpis()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
with
  applications_waiting as (
    select count(*)::int as total
    from public.applications
    where status in ('submitted', 'under_review', 'compliance_review')
  ),
  interviews_scheduled as (
    select count(*)::int as total
    from public.application_interviews
    where status = 'scheduled' and scheduled_at >= now()
  ),
  approved_this_month as (
    select count(*)::int as total
    from public.applications
    where status in ('approved', 'converted')
      and coalesce(decided_at, updated_at) >= date_trunc('month', now())
  ),
  members_active as (
    select count(*)::int as total from public.members where status = 'active'
  ),
  members_paying as (
    select count(distinct s.member_id)::int as total
    from public.subscriptions s
    join public.members m on m.id = s.member_id
    where s.status in ('active', 'trialing') and m.status = 'active'
  ),
  opportunities_open as (
    select
      count(*)::int as total,
      coalesce(sum(requested_volume) filter (where stage = 'active'), 0)::numeric as volume_active,
      coalesce(sum(requested_volume) filter (where stage = 'negotiation'), 0)::numeric as volume_negotiation
    from public.opportunities
    where stage in ('active', 'negotiation')
  ),
  subscription_revenue as (
    select coalesce(sum(price_cents), 0)::bigint as cents
    from public.subscriptions
    where status in ('active', 'trialing')
  ),
  remunerations_open as (
    select
      coalesce(sum(amount) filter (where status in ('pending', 'approved')), 0)::numeric as forecast,
      coalesce(sum(amount) filter (where status = 'approved'), 0)::numeric as payable
    from public.remunerations
  ),
  docs_pending_late as (
    select count(*)::int as total
    from public.application_documents d
    join public.applications a on a.id = d.application_id
    where d.status = 'pending'
      and d.created_at < now() - interval '7 days'
      and a.status not in ('approved', 'rejected', 'converted')
  ),
  renewals_soon as (
    select count(*)::int as total
    from public.subscriptions
    where status in ('active', 'trialing')
      and current_period_end is not null
      and current_period_end between now() and now() + interval '7 days'
  ),
  remunerations_stale as (
    select count(*)::int as total
    from public.remunerations
    where status = 'pending' and created_at < now() - interval '10 days'
  ),
  recent_activity as (
    select coalesce(jsonb_agg(entry order by entry ->> 'at' desc), '[]'::jsonb) as items
    from (
      select jsonb_build_object(
        'title', l.action,
        'description', coalesce(l.description, ''),
        'at', l.created_at
      ) as entry
      from public.audit_logs l
      order by l.created_at desc
      limit 5
    ) t
  )
select jsonb_build_object(
  'candidatos_aguardando', (select total from applications_waiting),
  'entrevistas_agendadas', (select total from interviews_scheduled),
  'aprovados_mes', (select total from approved_this_month),
  'membros_ativos', (select total from members_active),
  'membros_pagantes', (select total from members_paying),
  'meta_membros', 500,
  'oportunidades_ativas', (select total from opportunities_open),
  'volume_solicitado', (select volume_active from opportunities_open),
  'volume_negociacao', (select volume_negotiation from opportunities_open),
  'receita_assinaturas_cents', (select cents from subscription_revenue),
  'remuneracoes_previstas', (select forecast from remunerations_open),
  'remuneracoes_a_pagar', (select payable from remunerations_open),
  'docs_pendentes_atrasados', (select total from docs_pending_late),
  'renovacoes_em_7_dias', (select total from renewals_soon),
  'remuneracoes_paradas', (select total from remunerations_stale),
  'atividade_recente', (select items from recent_activity)
);
$$;

grant execute on function public.dashboard_kpis() to anon, authenticated;
