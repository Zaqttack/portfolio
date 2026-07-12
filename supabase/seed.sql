-- Seed data for local development
-- run after applying migrations: supabase db reset

insert into profile (name, tagline, bio, location, email, github, linkedin, resume_url, open_to_work, hero_variant) values (
  'Zaquariah Holland',
  'Software engineer — San Antonio, TX',
  'Full-stack, backend-leaning. Five years shipping fintech software at SWIVEL. I care about reliability, clean interfaces, and getting things done.',
  'San Antonio, TX',
  'zaquariah@gmail.com',
  'https://github.com/Zaqttack',
  'https://linkedin.com/in/zaquariah-holland',
  'https://drive.google.com/file/d/1BaO6_zvsUadRQ8kNX5aBOaWNnBrjAUCs/view',
  false,
  'terminal'
);

-- experience (hardcoded IDs for FK references below)
insert into experience (id, company, role, start_date, org_type, location, display_order) values
  ('e0000000-0000-0000-0000-000000000001'::uuid, 'SWIVEL', 'Software Engineer', '2024-04-01', 'job', 'San Antonio, TX', 1);

insert into experience (id, company, role, start_date, end_date, org_type, location, display_order) values
  ('e0000000-0000-0000-0000-000000000002'::uuid, 'SWIVEL', 'Junior Software Engineer', '2021-08-01', '2024-04-01', 'job', 'San Antonio, TX', 2),
  ('e0000000-0000-0000-0000-000000000003'::uuid, 'SWBC',   'Software Engineering Intern', '2021-05-01', '2021-08-01', 'internship', 'San Antonio, TX', 3);

insert into experience_bullets (experience_id, text, visibility, display_order) values
  ('e0000000-0000-0000-0000-000000000001'::uuid, 'Shipped 5+ major product features improving transaction processing and user experience.', 'public', 1),
  ('e0000000-0000-0000-0000-000000000001'::uuid, 'Built Google Analytics integration and ADA-compliant component library.', 'public', 2),
  ('e0000000-0000-0000-0000-000000000001'::uuid, 'Led a full application rebuild in React, modernizing the frontend architecture from scratch.', 'public', 3),
  ('e0000000-0000-0000-0000-000000000002'::uuid, 'Developed and maintained features across a React + Node.js fintech stack.', 'public', 1),
  ('e0000000-0000-0000-0000-000000000002'::uuid, 'Worked closely with product and design to ship customer-facing features on tight cycles.', 'public', 2),
  ('e0000000-0000-0000-0000-000000000002'::uuid, 'Grew into independent ownership of backend services before promotion.', 'public', 3),
  ('e0000000-0000-0000-0000-000000000003'::uuid, 'Contributed to internal tooling and web application development.', 'public', 1),
  ('e0000000-0000-0000-0000-000000000003'::uuid, 'Collaborated with senior engineers on code review and agile sprint workflow.', 'public', 2);

-- involvement orgs (hardcoded IDs for FK references below)
insert into involvement_orgs (id, name, description, url, display_order) values
  ('o0000000-0000-0000-0000-000000000001'::uuid, 'ACM San Antonio', 'Professional tech community chapter for San Antonio software engineers.', 'https://acmsa.org', 1),
  ('o0000000-0000-0000-0000-000000000002'::uuid, 'DEV SA', 'One of San Antonio''s largest developer communities.', null, 2),
  ('o0000000-0000-0000-0000-000000000003'::uuid, 'Code:You SA', 'Local tech education program focused on hands-on curriculum and workshops.', null, 3),
  ('o0000000-0000-0000-0000-000000000004'::uuid, 'Dinosaur Jam', 'A month-long, dinosaur-themed game jam.', null, 4),
  ('o0000000-0000-0000-0000-000000000005'::uuid, 'RowdyHacks', 'UTSA''s annual intercollegiate hackathon.', null, 5);

insert into involvement_roles (org_id, role, start_date, highlights, metrics, display_order) values
  ('o0000000-0000-0000-0000-000000000001'::uuid, 'President', '2023-04-01',
    array['Grew the chapter into a monthly rhythm of talks, workshops, and hack nights.', 'Established recurring speaker series and hack night format.'],
    '{"where": "San Antonio tech community", "how": "Monthly events, speaker series, hack nights"}',
    1);

insert into involvement_roles (org_id, role, start_date, highlights, metrics, display_order) values
  ('o0000000-0000-0000-0000-000000000002'::uuid, 'Board Member', '2024-10-01',
    array['Part of the organizing body for one of SA''s largest developer communities.'],
    '{}',
    1);

insert into involvement_roles (org_id, role, start_date, highlights, metrics, display_order) values
  ('o0000000-0000-0000-0000-000000000003'::uuid, 'Build Committee Member', '2024-12-01',
    array['Helping design curriculum and hands-on workshops for the local tech education program.'],
    '{}',
    1);

insert into involvement_roles (org_id, role, start_date, highlights, metrics, display_order) values
  ('o0000000-0000-0000-0000-000000000004'::uuid, 'Organizer', '2022-01-01',
    array['A month-long, dinosaur-themed game jam. 40+ entries last year and counting.'],
    '{"entries": "40+"}',
    1);

insert into involvement_roles (org_id, role, start_date, end_date, highlights, metrics, display_order) values
  ('o0000000-0000-0000-0000-000000000005'::uuid, 'Organizer', '2020-01-01', '2022-05-01',
    array['Helped coordinate logistics for 300+ participants across two annual events.'],
    '{"attendees": "300+"}',
    1);

-- projects
insert into projects (title, slug, summary, tags, repo_url, live_url, status, featured, display_order) values
  ('SWIVEL — Fintech Platform', 'swivel-fintech', 'Full-stack fintech application development. Shipped 5+ major features improving transaction processing efficiency.', array['React','TypeScript','AWS','Node.js'], null, null, 'published', true, 1),
  ('ACM SA Portal', 'acm-sa-portal', 'Events, RSVPs, and a member directory for the chapter. Quietly runs every meetup we host.', array['React','Supabase'], null, 'https://acmsa.org', 'published', true, 2),
  ('RowdyHacks Website', 'rowdyhacks-website', 'Hackathon logistics website coordinating 300+ participants.', array['HTML','CSS','JavaScript'], null, null, 'published', false, 3),
  ('Dinosaur Jam', 'dinosaur-jam', 'A month-long game jam I organize. The theme is always dinosaurs. 40+ entries last year.', array['community','organizing'], null, null, 'published', false, 4),
  ('SWIVEL Engineering Hackathon', 'swivel-hackathon', 'Co-organized SWIVEL''s first engineering-wide hackathon with 40+ participants and 5 projects.', array['organizing','leadership'], null, null, 'published', false, 5);

-- skills
insert into skills (name, category, display_order) values
  ('TypeScript', 'languages', 1),
  ('JavaScript', 'languages', 2),
  ('Python', 'languages', 3),
  ('SQL', 'languages', 4),
  ('React', 'frameworks', 5),
  ('Next.js', 'frameworks', 6),
  ('Node.js', 'frameworks', 7),
  ('Express', 'frameworks', 8),
  ('AWS', 'cloud', 9),
  ('Docker', 'cloud', 10),
  ('GitHub Actions', 'cloud', 11),
  ('Terraform', 'cloud', 12),
  ('PostgreSQL', 'data', 13),
  ('Redis', 'data', 14);
