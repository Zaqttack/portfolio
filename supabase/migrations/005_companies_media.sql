-- Companies: one record per employer, with optional logo
create table companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  logo_url      text,
  website_url   text,
  display_order int default 0,
  created_at    timestamptz default now()
);

alter table companies enable row level security;
create policy "anon_read_companies"  on companies for select to anon        using (true);
create policy "auth_write_companies" on companies for all    to authenticated using (true) with check (true);

-- Link experience rows to companies (nullable so existing rows are unaffected)
alter table experience add column company_id uuid references companies(id) on delete set null;

-- Allow company text to be null now that company_id is the primary link
alter table experience alter column company drop not null;

-- Supabase Storage: public media bucket for logos and project images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "media_public_read"  on storage.objects for select to anon        using (bucket_id = 'media');
create policy "media_auth_upload"  on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "media_auth_update"  on storage.objects for update to authenticated using (bucket_id = 'media');
create policy "media_auth_delete"  on storage.objects for delete to authenticated using (bucket_id = 'media');
