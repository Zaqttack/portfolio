-- Initial schema
-- All tables use RLS. anon role gets read-only access to published/public content.
-- Service-role key (used in route handlers) bypasses RLS.

create table profile (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  tagline         text,
  bio             text,
  avatar_url      text,
  location        text,
  resume_url      text,
  email           text,
  github          text,
  linkedin        text,
  twitter         text,
  website         text,
  open_to_work    boolean default false,
  updated_at      timestamptz default now()
);

create table experience (
  id              uuid primary key default gen_random_uuid(),
  company         text not null,
  role            text not null,
  start_date      date not null,
  end_date        date,
  org_type        text default 'job' check (org_type in ('job', 'internship', 'contract', 'volunteer')),
  location        text,
  display_order   int default 0,
  created_at      timestamptz default now()
);

create table experience_bullets (
  id              uuid primary key default gen_random_uuid(),
  experience_id   uuid not null references experience(id) on delete cascade,
  text            text not null,
  visibility      text default 'public' check (visibility in ('public', 'private')),
  source          text default 'self' check (source in ('self', 'work_import')),
  display_order   int default 0
);

create table involvement_orgs (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text,
  url             text,
  logo            text,
  display_order   int default 0
);

create table involvement_roles (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references involvement_orgs(id) on delete cascade,
  role            text not null,
  start_date      date not null,
  end_date        date,
  highlights      text[],
  metrics         jsonb default '{}',
  display_order   int default 0
);

create table achievements (
  id                      uuid primary key default gen_random_uuid(),
  title                   text not null,
  description             text,
  date                    date,
  related_experience_id   uuid references experience(id),
  related_org_id          uuid references involvement_orgs(id),
  evidence_url            text,
  visibility              text default 'public' check (visibility in ('public', 'private')),
  display_order           int default 0
);

create table skills (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  category              text,
  proficiency           int check (proficiency between 1 and 5),
  source_experience_id  uuid references experience(id),
  source                text default 'self' check (source in ('self', 'work_import')),
  display_order         int default 0
);

create table projects (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text unique not null,
  summary         text,
  body            text,
  cover_image     text,
  tags            text[] default '{}',
  repo_url        text,
  live_url        text,
  status          text default 'draft' check (status in ('draft', 'published')),
  featured        boolean default false,
  display_order   int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text unique not null,
  body            text,
  excerpt         text,
  cover_image     text,
  tags            text[] default '{}',
  published_at    timestamptz,
  status          text default 'draft' check (status in ('draft', 'published')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table gallery_images (
  id              uuid primary key default gen_random_uuid(),
  url             text not null,
  caption         text,
  taken_at        date,
  display_order   int default 0
);

create table import_staging (
  id              uuid primary key default gen_random_uuid(),
  raw_payload     jsonb not null,
  source_note     text,
  reviewed        boolean default false,
  created_at      timestamptz default now()
);

create table page_views (
  id          uuid primary key default gen_random_uuid(),
  ts          timestamptz default now(),
  path        text not null,
  referrer    text,
  user_agent  text,
  ip_hash     text,
  country     text,
  is_bot      boolean default false,
  bot_name    text
);

create table bot_signatures (
  id          uuid primary key default gen_random_uuid(),
  pattern     text not null,
  bot_name    text not null,
  category    text check (category in ('search', 'ai_training', 'other')),
  created_at  timestamptz default now()
);

create table admin_activity (
  id          uuid primary key default gen_random_uuid(),
  actor       text,
  table_name  text,
  row_id      uuid,
  action      text check (action in ('insert', 'update', 'delete')),
  ts          timestamptz default now()
);

-- RLS
alter table profile           enable row level security;
alter table experience        enable row level security;
alter table experience_bullets enable row level security;
alter table involvement_orgs  enable row level security;
alter table involvement_roles enable row level security;
alter table achievements      enable row level security;
alter table skills            enable row level security;
alter table projects          enable row level security;
alter table posts             enable row level security;
alter table gallery_images    enable row level security;
alter table import_staging    enable row level security;
alter table page_views        enable row level security;
alter table bot_signatures    enable row level security;
alter table admin_activity    enable row level security;

-- profile: public read, authenticated write
create policy "anon_read_profile"    on profile for select to anon        using (true);
create policy "auth_write_profile"   on profile for all    to authenticated using (true) with check (true);

-- experience: public read, authenticated write
create policy "anon_read_experience" on experience for select to anon        using (true);
create policy "auth_write_experience" on experience for all   to authenticated using (true) with check (true);

-- experience_bullets: anon reads only public; authenticated reads all
create policy "anon_read_bullets"    on experience_bullets for select to anon        using (visibility = 'public');
create policy "auth_all_bullets"     on experience_bullets for all    to authenticated using (true) with check (true);

-- involvement_orgs: public read, authenticated write
create policy "anon_read_orgs"       on involvement_orgs for select to anon        using (true);
create policy "auth_write_orgs"      on involvement_orgs for all    to authenticated using (true) with check (true);

-- involvement_roles: public read, authenticated write
create policy "anon_read_inv_roles"  on involvement_roles for select to anon        using (true);
create policy "auth_write_inv_roles" on involvement_roles for all    to authenticated using (true) with check (true);

-- achievements: anon reads only public; authenticated reads all
create policy "anon_read_achievements" on achievements for select to anon        using (visibility = 'public');
create policy "auth_all_achievements"  on achievements for all    to authenticated using (true) with check (true);

-- skills: public read, authenticated write
create policy "anon_read_skills"     on skills for select to anon        using (true);
create policy "auth_write_skills"    on skills for all    to authenticated using (true) with check (true);

-- projects: anon reads published only; authenticated reads/writes all
create policy "anon_read_projects"   on projects for select to anon        using (status = 'published');
create policy "auth_all_projects"    on projects for all    to authenticated using (true) with check (true);

-- posts: anon reads published only; authenticated reads/writes all
create policy "anon_read_posts"      on posts for select to anon        using (status = 'published');
create policy "auth_all_posts"       on posts for all    to authenticated using (true) with check (true);

-- gallery: public read, authenticated write
create policy "anon_read_gallery"    on gallery_images for select to anon        using (true);
create policy "auth_write_gallery"   on gallery_images for all    to authenticated using (true) with check (true);

-- import_staging: authenticated only (no anon access)
create policy "auth_all_staging"     on import_staging for all to authenticated using (true) with check (true);

-- page_views: service role inserts (bypasses RLS); authenticated can read
create policy "auth_read_views"      on page_views for select to authenticated using (true);

-- bot_signatures: anon read (needed by middleware); authenticated write
create policy "anon_read_bots"       on bot_signatures for select to anon        using (true);
create policy "auth_write_bots"      on bot_signatures for all    to authenticated using (true) with check (true);

-- admin_activity: authenticated read only; service role writes (bypasses RLS)
create policy "auth_read_activity"   on admin_activity for select to authenticated using (true);

-- Seed bot signatures
insert into bot_signatures (pattern, bot_name, category) values
  ('Googlebot',        'Googlebot',       'search'),
  ('Bingbot',          'Bingbot',         'search'),
  ('DuckDuckBot',      'DuckDuckBot',     'search'),
  ('Slurp',            'Yahoo Slurp',     'search'),
  ('GPTBot',           'GPTBot',          'ai_training'),
  ('ClaudeBot',        'ClaudeBot',       'ai_training'),
  ('CCBot',            'CCBot',           'ai_training'),
  ('PerplexityBot',    'PerplexityBot',   'ai_training'),
  ('Bytespider',       'Bytespider',      'ai_training'),
  ('anthropic-ai',     'Anthropic',       'ai_training'),
  ('ChatGPT-User',     'ChatGPT',         'ai_training'),
  ('OAI-SearchBot',    'OpenAI Search',   'ai_training');
