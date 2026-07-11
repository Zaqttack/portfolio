-- Insert a default profile row if the table is empty.
-- Forks see the original author's portfolio as the live demo until they replace it via /admin.
INSERT INTO profile (
  name,
  tagline,
  bio,
  location,
  location_short,
  email,
  github,
  linkedin,
  open_to_work,
  avatar_enabled,
  projects_enabled,
  writing_enabled,
  hero_title,
  footer_tagline,
  skills_subtitle,
  contact_cta,
  accent_color
)
SELECT
  'Zaquariah Holland',
  'Full Stack Software Engineer — San Antonio, TX',
  'San Antonio based Software Engineer who designs, develops, and maintains full-stack fintech applications, leveraging front-end frameworks, custom testing tools, and AWS cloud architecture while contributing to team leadership and community engagement.',
  'San Antonio, TX',
  'San Antonio, TX',
  'hello@zaquariah.dev',
  'https://github.com/Zaqttack',
  'https://linkedin.com/in/zaquariah-holland',
  false,
  true,
  true,
  true,
  'I''m {{first_name}}. I build precise, well-architected software.',
  'Built with Next.js + Supabase.',
  'things i work with',
  'Want to work together? Reach out.',
  '#EC6A2C'
WHERE NOT EXISTS (SELECT 1 FROM profile);
