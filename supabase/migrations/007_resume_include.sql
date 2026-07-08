ALTER TABLE experience ADD COLUMN resume_include boolean NOT NULL DEFAULT false;
ALTER TABLE projects ADD COLUMN resume_include boolean NOT NULL DEFAULT false;
ALTER TABLE skills ADD COLUMN resume_include boolean NOT NULL DEFAULT false;
ALTER TABLE profile ADD COLUMN resume_download_enabled boolean NOT NULL DEFAULT false;
