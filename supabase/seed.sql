-- seed data for local development
-- run after applying migrations: supabase db reset

insert into profile (name, tagline, intro, now, open_to_work, email, github, linkedin, resume) values (
  'Zaquariah Holland',
  'Software engineer — San Antonio, TX',
  'Full-stack, backend-leaning. Five years shipping fintech software at SWIVEL. I care about reliability, clean interfaces, and getting things done.',
  'Building payments infrastructure at SWIVEL, running ACM San Antonio, and organizing Dinosaur Jam.',
  false,
  'zaquariah@gmail.com',
  'https://github.com/Zaqttack',
  'https://linkedin.com/in/zaquariah',
  'https://drive.google.com/file/d/1BaO6_zvsUadRQ8kNX5aBOaWNnBrjAUCs/view'
);

insert into projects (title, tag, year, stack, blurb, link, link_label, published, sort_order) values
  ('SWIVEL — Fintech Platform', 'product', '''24', array['React','TypeScript','AWS','Node.js'], 'Full-stack fintech application development. Shipped 5+ major features improving transaction processing efficiency.', null, null, true, 1),
  ('ACM SA Portal', 'product', '''23', array['React','Supabase'], 'Events, RSVPs, and a member directory for the chapter. Quietly runs every meetup we host.', 'https://acmsa.org', 'visit ↗', true, 2),
  ('RowdyHacks Website', 'product', '''21', array['HTML','CSS','JavaScript'], 'Hackathon logistics website coordinating 300+ participants.', null, null, true, 3),
  ('Dinosaur Jam', 'side', 'annual', array['community','organizing'], 'A month-long game jam I organize. The theme is always dinosaurs. 40+ entries last year.', null, null, true, 4),
  ('SWIVEL Engineering Hackathon', 'side', '''23', array['organizing','leadership'], 'Co-organized SWIVEL''s first engineering-wide hackathon with 40+ participants and 5 projects.', null, null, true, 5);

insert into work_history (role, org, period, location, bullets, accent, sort_order) values
  ('Software Engineer', 'SWIVEL', 'APR 2024 — PRESENT', 'San Antonio, TX · payments infrastructure', array['Shipped 5+ major product features improving transaction processing and user experience.','Built Google Analytics integration and ADA-compliant component library.','Led a full application rebuild in React, modernizing the frontend architecture from scratch.'], true, 1),
  ('Junior Software Engineer', 'SWIVEL', 'AUG 2021 — APR 2024', 'San Antonio, TX · full-stack', array['Developed and maintained features across a React + Node.js fintech stack.','Worked closely with product and design to ship customer-facing features on tight cycles.','Grew into independent ownership of backend services before promotion.'], false, 2),
  ('Software Engineering Intern', 'SWBC', 'MAY 2021 — AUG 2021', 'San Antonio, TX · financial services', array['Contributed to internal tooling and web application development.','Collaborated with senior engineers on code review and agile sprint workflow.'], false, 3);

insert into leadership (role, period, desc, sort_order) values
  ('President — ACM San Antonio', 'APR 2023 — PRESENT', 'Grew the chapter into a monthly rhythm of talks, workshops, and hack nights.', 1),
  ('Board Member — DEV SA', 'OCT 2024 — PRESENT', 'Part of the organizing body for one of SA''s largest developer communities.', 2),
  ('Build Committee — Code:You SA', 'DEC 2024 — PRESENT', 'Helping design curriculum and hands-on workshops for the local tech education program.', 3),
  ('Organizer — Dinosaur Jam', 'ANNUAL', 'A month-long, dinosaur-themed game jam. 40+ entries last year and counting.', 4);
