-- Public bucket files are accessible via direct URL without a SELECT policy.
-- Dropping the anon read policy removes the ability to enumerate all file paths.
drop policy if exists "media_public_read" on storage.objects;
