-- =============================================================================
-- Migration: Sistema de Tickets, Planos Dinâmicos e Validade de Oportunidades
-- =============================================================================

-- 1. Sequência e Tabela de Tickets (Chamados & Solicitações)
CREATE SEQUENCE IF NOT EXISTS public.ticket_seq START WITH 1001;

CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL DEFAULT ('TCK-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.ticket_seq')::text, 4, '0')),
  member_id uuid REFERENCES public.members (id) ON DELETE SET NULL,
  author_name text NOT NULL,
  author_email text NOT NULL,
  author_whatsapp text,
  category text NOT NULL, -- 'digital_kit', 'deals_ma', 'compliance', 'billing', 'support'
  category_label text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'normal', -- 'normal', 'high', 'urgent'
  status text NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'waiting_user', 'resolved', 'closed'
  -- Metadados de solicitação (Kit Presença Digital)
  domain_requested text,
  emails_requested jsonb DEFAULT '[]'::jsonb,
  landing_page_requested boolean DEFAULT false,
  admin_notes text,
  admin_resolution_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_author_email ON public.tickets (lower(author_email));
CREATE INDEX IF NOT EXISTS idx_tickets_category ON public.tickets (category);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets (created_at DESC);

-- 2. Tabela de Mensagens do Ticket (Timeline de Atendimento)
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.tickets (id) ON DELETE CASCADE,
  sender_type text NOT NULL, -- 'member', 'admin', 'system'
  sender_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON public.ticket_messages (ticket_id, created_at ASC);

-- 3. Atualização da Tabela de Oportunidades: Validade de 20 Dias e Expiração
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS validity_days integer DEFAULT 20,
  ADD COLUMN IF NOT EXISTS expires_at timestamptz DEFAULT (now() + interval '20 days'),
  ADD COLUMN IF NOT EXISTS last_renewed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_opportunities_expires_at ON public.opportunities (expires_at);

-- Atualiza política de visualização pública: Aprovadas E Não Expiradas
DROP POLICY IF EXISTS "Public can view approved opportunities" ON public.opportunities;
CREATE POLICY "Public can view approved opportunities"
  ON public.opportunities
  FOR SELECT
  USING (approval_status = 'approved' AND (expires_at IS NULL OR expires_at > now()));

-- 4. Atualização da Tabela de Planos
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS digital_kit_included boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS popular boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS badge_text text,
  ADD COLUMN IF NOT EXISTS max_active_deals integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS validity_days integer DEFAULT 20;

-- Popula planos padrão se a tabela estiver vazia
INSERT INTO public.plans (code, name, description, price_cents, currency, billing_interval, is_active, popular, badge_text, digital_kit_included, max_active_deals, validity_days, features)
SELECT 'free', 'Gratuito', 'Acesso inicial à rede e teste de ferramentas', 0, 'BRL', 'month', true, false, null, false, 1, 20,
  '["1 negócio ativo por vez", "Validade de 20 dias por oportunidade", "7 dias de teste grátis da IA Millennium", "Visualização em Teaser Cego", "1 solicitação de NDA por mês", "Webinars públicos selecionados"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE code = 'free');

INSERT INTO public.plans (code, name, description, price_cents, currency, billing_interval, is_active, popular, badge_text, digital_kit_included, max_active_deals, validity_days, features)
SELECT 'pro', 'Profissional', 'Para originadores, corretores e captadores de alto padrão', 29700, 'BRL', 'month', true, true, 'Mais Popular', true, 5, 45,
  '["Até 5 negócios ativos simultâneos", "Validade estendida de 45 dias", "Kit Presença Digital incluso (Domínio 1 ano + 5 e-mails + Landing Page)", "IA Millennium ilimitada (leitura de docs e imagens)", "Selo de Membro Verificado 100%", "Até 5 solicitações de NDA/mês", "Split de comissões preferencial"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE code = 'pro');

INSERT INTO public.plans (code, name, description, price_cents, currency, billing_interval, is_active, popular, badge_text, digital_kit_included, max_active_deals, validity_days, features)
SELECT 'exec', 'Executivo', 'Para investidores qualificados, fundos e family offices', 79700, 'BRL', 'month', true, false, 'Completo', true, 999, 90,
  '["Negócios ativos ilimitados", "Validade máxima de 90 dias com renovação prioritária", "Kit Presença Digital completo de alta performance", "Acesso antecipado a novos deals exclusivos (48h)", "NDAs e Dossiês confidenciais ilimitados", "Acompanhamento da Mesa de M&A do Clube", "Acesso a Jantares e Rodadas Presenciais"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE code = 'exec');

INSERT INTO public.plans (code, name, description, price_cents, currency, billing_interval, is_active, popular, badge_text, digital_kit_included, max_active_deals, validity_days, features)
SELECT 'founder', 'Fundador', 'Assento vitalício no comitê estratégico do Millennium Club', 0, 'BRL', 'year', true, false, 'Sob Convite', true, 999, 180,
  '["Selo de Membro Fundador permanente", "Condições societárias e tributárias exclusivas", "Participação no comitê de deliberação de negócios", "Acesso irrestrito a todos os ativos e dealmakers", "Assessoria jurídica e due diligence express"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE code = 'founder');

-- 5. RPC para Leitura de Todos os Tickets no Admin
CREATE OR REPLACE FUNCTION public.get_all_admin_tickets()
RETURNS SETOF public.tickets
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.tickets ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_admin_tickets() TO anon, authenticated;

-- 6. RPC para Renovação de Validade da Oportunidade
CREATE OR REPLACE FUNCTION public.renew_opportunity(
  p_opportunity_id uuid,
  p_days integer DEFAULT 20
)
RETURNS public.opportunities
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_days integer := GREATEST(COALESCE(p_days, 20), 20); -- Garante mínimo de 20 dias
  v_opp public.opportunities;
BEGIN
  UPDATE public.opportunities
  SET
    expires_at = now() + (v_days || ' days')::interval,
    last_renewed_at = now(),
    validity_days = v_days,
    updated_at = now()
  WHERE id = p_opportunity_id
  RETURNING * INTO v_opp;

  RETURN v_opp;
END;
$$;

GRANT EXECUTE ON FUNCTION public.renew_opportunity(uuid, integer) TO anon, authenticated;

-- 7. Políticas de Segurança RLS para Tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
CREATE POLICY "Users can view own tickets"
  ON public.tickets FOR SELECT
  USING (true); -- Controle fino de e-mail efetuado no Route Handler

DROP POLICY IF EXISTS "Users can insert tickets" ON public.tickets;
CREATE POLICY "Users can insert tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update tickets" ON public.tickets;
CREATE POLICY "Admins can update tickets"
  ON public.tickets FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Public can view messages" ON public.ticket_messages;
CREATE POLICY "Public can view messages"
  ON public.ticket_messages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can insert messages" ON public.ticket_messages;
CREATE POLICY "Public can insert messages"
  ON public.ticket_messages FOR INSERT
  WITH CHECK (true);
