-- tech stack tags on experience entries (shown on resume under each job)
ALTER TABLE experience ADD COLUMN tech_tags text[] NOT NULL DEFAULT '{}';

-- resume star toggle for involvement orgs
ALTER TABLE involvement_orgs ADD COLUMN resume_include boolean NOT NULL DEFAULT false;

-- date range for projects (distinct from created_at)
ALTER TABLE projects ADD COLUMN started_at date;
ALTER TABLE projects ADD COLUMN ended_at date;

-- resume star toggles for education, certifications, achievements
-- education/certs default on (you'd normally want all of them); achievements default off (opt-in)
ALTER TABLE education ADD COLUMN resume_include boolean NOT NULL DEFAULT true;
ALTER TABLE certifications ADD COLUMN resume_include boolean NOT NULL DEFAULT true;
ALTER TABLE achievements ADD COLUMN resume_include boolean NOT NULL DEFAULT false;
