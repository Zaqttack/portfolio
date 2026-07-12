create table project_images (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  url           text not null,
  caption       text,
  display_order int default 0,
  created_at    timestamptz default now()
);

alter table project_images enable row level security;
create policy "anon_read_project_images"  on project_images for select to anon        using (true);
create policy "auth_write_project_images" on project_images for all    to authenticated using (true) with check (true);
