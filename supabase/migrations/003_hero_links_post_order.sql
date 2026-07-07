-- Configurable hero title and terminal status
ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS hero_title text,
  ADD COLUMN IF NOT EXISTS terminal_status text;

-- Arbitrary profile links (replaces fixed github/linkedin/twitter columns)
CREATE TABLE IF NOT EXISTS profile_links (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label         text NOT NULL,
  url           text NOT NULL,
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE profile_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_profile_links"  ON profile_links FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_write_profile_links" ON profile_links FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- posts was missing display_order, causing 400 on admin save
ALTER TABLE posts ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
