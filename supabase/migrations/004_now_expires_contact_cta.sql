ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS now_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS contact_cta text;
