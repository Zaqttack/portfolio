ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS writing_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS projects_subtitle text,
  ADD COLUMN IF NOT EXISTS writing_subtitle text,
  ADD COLUMN IF NOT EXISTS experience_subtitle text;

CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text NOT NULL,
  start_year text NOT NULL DEFAULT '',
  end_year text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text,
  year text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements
  ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- RLS for new tables
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_education"     ON education       FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_write_education"    ON education       FOR ALL    TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_certifications"  ON certifications  FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_write_certifications" ON certifications  FOR ALL    TO authenticated USING (true) WITH CHECK (true);
