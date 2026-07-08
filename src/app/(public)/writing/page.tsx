import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, getProfile, getProfileLinks } from '@/lib/db';
import type { Post, Profile, ProfileLink } from '@/types';
import WritingClient from './WritingClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Zaquariah Holland | Writing' };

export default async function WritingPage() {
  let posts: Post[] = [];
  let profile: Profile | null = null;
  let profileLinks: ProfileLink[] = [];
  try {
    posts = await getPosts();
  } catch {}
  try {
    profile = await getProfile();
  } catch {}
  try {
    profileLinks = await getProfileLinks();
  } catch {}
  if (profile && profile.writing_enabled === false) notFound();
  return (
    <WritingClient
      posts={posts}
      subtitle={profile?.writing_subtitle ?? null}
      writingEnabled={profile?.writing_enabled ?? false}
      resumeUrl={profile?.resume_download_enabled ? '/api/resume' : (profile?.resume_url ?? null)}
      profileLinks={profileLinks}
    />
  );
}
