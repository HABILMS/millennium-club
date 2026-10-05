-- Permite leitura de candidaturas para exibição na lista do painel administrativo
drop policy if exists applications_admin_read on public.applications;

create policy applications_public_select on public.applications
  for select to anon, authenticated using (true);
