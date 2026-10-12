-- =============================================================================
-- Migration: Atualização da tabela de oportunidades e suporte à moderação
-- =============================================================================

-- 1. Permite estágios flexíveis de texto se a coluna stage for enum
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'opportunities' AND column_name = 'stage' AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE public.opportunities ALTER COLUMN stage DROP DEFAULT;
    ALTER TABLE public.opportunities ALTER COLUMN stage TYPE text USING stage::text;
    ALTER TABLE public.opportunities ALTER COLUMN stage SET DEFAULT 'Ativa';
  END IF;
END $$;

-- 2. Adiciona colunas para categorias, mandato, autor, mídias e moderação
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS is_mandatary_declared boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS category_label text,
  ADD COLUMN IF NOT EXISTS category_icon text,
  ADD COLUMN IF NOT EXISTS volume text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS details text,
  ADD COLUMN IF NOT EXISTS highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS gallery_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS document_pdf_name text,
  ADD COLUMN IF NOT EXISTS document_pdf_size text,
  ADD COLUMN IF NOT EXISTS document_pdf_url text,
  ADD COLUMN IF NOT EXISTS author_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by text,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS admin_notes text;

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_opportunities_approval_status ON public.opportunities (approval_status);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities (category);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities (created_at DESC);

-- 4. Políticas de Segurança RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Visitantes e membros podem visualizar oportunidades aprovadas
DROP POLICY IF EXISTS "Public can view approved opportunities" ON public.opportunities;
CREATE POLICY "Public can view approved opportunities"
  ON public.opportunities
  FOR SELECT
  USING (approval_status = 'approved');

-- Inserção de novas oportunidades (criador submete como pending)
DROP POLICY IF EXISTS "Allow insertion of opportunities" ON public.opportunities;
CREATE POLICY "Allow insertion of opportunities"
  ON public.opportunities
  FOR INSERT
  WITH CHECK (true);

-- Atualização e Gestão Geral para Administradores
DROP POLICY IF EXISTS "Allow all for authenticated admins" ON public.opportunities;
CREATE POLICY "Allow all for authenticated admins"
  ON public.opportunities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'compliance')
    )
  );

-- 5. RPC Security Definer para leitura administrativa completa
CREATE OR REPLACE FUNCTION public.get_all_admin_opportunities()
RETURNS SETOF public.opportunities
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.opportunities ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_admin_opportunities() TO anon, authenticated;

-- 6. RPC para adicionar perguntas à oportunidade (chat)
CREATE OR REPLACE FUNCTION public.add_opportunity_question(
  p_opportunity_id uuid,
  p_sender_name text,
  p_sender_contact text,
  p_content text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_question jsonb;
  v_questions jsonb;
BEGIN
  v_new_question := jsonb_build_object(
    'id', gen_random_uuid()::text,
    'senderName', p_sender_name,
    'senderContact', p_sender_contact,
    'content', p_content,
    'sentAt', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
  );

  UPDATE public.opportunities
  SET questions = COALESCE(questions, '[]'::jsonb) || jsonb_build_array(v_new_question)
  WHERE id = p_opportunity_id;

  RETURN v_new_question;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_opportunity_question(uuid, text, text, text) TO anon, authenticated;
