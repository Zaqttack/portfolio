alter table profile
  add column if not exists hero_variant text
    check (hero_variant in ('terminal', 'email', 'chat', 'notecard', 'playground'));
