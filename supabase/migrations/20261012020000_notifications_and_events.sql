-- =============================================================================
-- Migration: Sistema de Notificações In-App e Gestão de Eventos com RSVP
-- =============================================================================

-- 1. TABELA DE NOTIFICAÇÕES IN-APP
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
  user_email text NOT NULL,
  type text NOT NULL DEFAULT 'system', 
  -- Tipos: 'opportunity_approved', 'opportunity_rejected', 'opportunity_expiring', 
  --        'ticket_reply', 'ticket_created', 'event_rsvp', 'system', 'welcome'
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  action_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_email ON public.notifications (lower(user_email), created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications (read);

-- Políticas RLS para Notificações
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR lower(user_email) = lower(auth.jwt() ->> 'email')
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Users can update their own notifications read status" ON public.notifications;
CREATE POLICY "Users can update their own notifications read status"
  ON public.notifications
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR lower(user_email) = lower(auth.jwt() ->> 'email')
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Service and admins can insert notifications" ON public.notifications;
CREATE POLICY "Service and admins can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- 2. TABELA DE EVENTOS
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'webinar', -- 'presencial', 'seminario', 'webinar'
  category_label text NOT NULL DEFAULT 'Webinar Online',
  date text NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  speakers jsonb DEFAULT '[]'::jsonb,
  description text NOT NULL,
  capacity text NOT NULL DEFAULT '100 participantes',
  max_attendees integer DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_category ON public.events (category);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON public.events (is_active);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events (created_at DESC);

-- Políticas RLS para Eventos
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active events" ON public.events;
CREATE POLICY "Public can view active events"
  ON public.events
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events"
  ON public.events
  FOR ALL
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 3. TABELA DE RSVPs (INSCRIÇÕES EM EVENTOS)
CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  user_email text NOT NULL,
  user_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_event_user UNIQUE (event_id, user_email)
);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event ON public.event_rsvps (event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_email ON public.event_rsvps (lower(user_email));

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view and manage their RSVPs" ON public.event_rsvps;
CREATE POLICY "Users can view and manage their RSVPs"
  ON public.event_rsvps
  FOR ALL
  USING (
    auth.uid() = user_id 
    OR lower(user_email) = lower(auth.jwt() ->> 'email')
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- 4. POVOAMENTO INICIAL DE EVENTOS (Se não existirem)
INSERT INTO public.events (id, title, category, category_label, date, time, location, speakers, description, capacity, max_attendees, is_active)
SELECT 
  'a0000001-0000-0000-0000-000000000001'::uuid,
  'Mesa Redonda: Estruturação de Transações de Energia Solar & Crédito',
  'webinar',
  'Webinar Online',
  '25 de Outubro, 2026',
  '19:00 - 20:30 (BRT)',
  'Transmissão Zoom Exclusiva para Membros',
  '["Dr. Marcelo Guimarães (Especialista M&A)", "Ana Paula Siqueira (VP Originação Solar)"]'::jsonb,
  'Discussão prática sobre precificação de passivos fotovoltaicos, securitização de créditos de energia e estruturação de PPAs de longo prazo.',
  '100 vagas online',
  100,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title ILIKE '%Mesa Redonda: Estruturação de Transações de Energia Solar%');

INSERT INTO public.events (id, title, category, category_label, date, time, location, speakers, description, capacity, max_attendees, is_active)
SELECT 
  'a0000002-0000-0000-0000-000000000002'::uuid,
  'Seminário Anual de Mercado Imobiliário & Redes Hoteleiras',
  'seminario',
  'Seminário',
  '10 de Novembro, 2026',
  '09:00 - 18:00 (BRT)',
  'Hotel Unique - São Paulo, SP',
  '["Carlos Eduardo Nobre (CEO Fund)", "Fernanda Lins (Diretora Real Estate)"]'::jsonb,
  'Encontro presencial de executivos para debater o cenário de M&A hoteleiro, retrofit de empreendimentos e oportunidades buy-side no Brasil.',
  '120 convidados presenciais',
  120,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title ILIKE '%Seminário Anual de Mercado Imobiliário%');

INSERT INTO public.events (id, title, category, category_label, date, time, location, speakers, description, capacity, max_attendees, is_active)
SELECT 
  'a0000003-0000-0000-0000-000000000003'::uuid,
  'Rodada Fechada de Co-Investimento & Societário para Projetos RSU',
  'presencial',
  'Evento Presencial',
  '22 de Novembro, 2026',
  '15:00 - 19:30 (BRT)',
  'Clube Millennium HQ - Faria Lima, SP',
  '["Comitê de Admissão & Originação RSU"]'::jsonb,
  'Apresentação restrita de 3 projetos de usinas de resíduos sólidos urbanos pré-operacionais buscando parceiros equity e de tecnologia.',
  '35 investidores qualificados',
  35,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title ILIKE '%Rodada Fechada de Co-Investimento%');

INSERT INTO public.events (id, title, category, category_label, date, time, location, speakers, description, capacity, max_attendees, is_active)
SELECT 
  'a0000004-0000-0000-0000-000000000004'::uuid,
  'Webinar: Créditos de Carbono VERRA & Descarbonização Corporativa',
  'webinar',
  'Webinar Online',
  '05 de Dezembro, 2026',
  '17:00 - 18:15 (BRT)',
  'Plataforma Virtual Millennium',
  '["Gabriel Ramos (Head ESG)", "Juliana Santos (Auditora Verra)"]'::jsonb,
  'Análise de tendências de preços de carbono no mercado voluntário e estratégias de liquidez para ativos de conservação florestal.',
  '200 participantes',
  200,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title ILIKE '%Webinar: Créditos de Carbono VERRA%');
