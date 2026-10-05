-- Migration para permitir a leitura das candidaturas no admin via RPC security definer
create or replace function public.get_all_applications()
returns setof public.applications
language sql
security definer
set search_path = public
as $$
  select * from public.applications order by created_at desc;
$$;

grant execute on function public.get_all_applications() to anon, authenticated;
