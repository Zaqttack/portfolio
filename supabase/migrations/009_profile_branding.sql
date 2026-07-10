-- Configurable branding and display fields for the profile singleton
ALTER TABLE profile
  ADD COLUMN avatar_enabled      boolean NOT NULL DEFAULT true,
  ADD COLUMN projects_enabled    boolean NOT NULL DEFAULT true,
  ADD COLUMN location_short      text,
  ADD COLUMN footer_tagline      text,
  ADD COLUMN writing_footer_note text,
  ADD COLUMN skills_subtitle     text,
  ADD COLUMN accent_color        text DEFAULT '#ec6a2c';
