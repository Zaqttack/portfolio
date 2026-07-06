import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, getProfile } from '@/lib/db';
import type { Post, Profile } from '@/types';
import WritingClient from './WritingClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Zaquariah Holland | Writing' };

export default async function WritingPage() {
  let posts: Post[] = [];
  let profile: Profile | null = null;
  try {
    [posts, profile] = await Promise.all([getPosts(), getProfile()]);
  } catch {
    // DB not available — show empty state
  }
  if (profile && profile.writing_enabled === false) notFound();
  return (
    <WritingClient
      posts={posts}
      subtitle={profile?.writing_subtitle ?? null}
      writingEnabled={profile?.writing_enabled ?? true}
      resumeUrl={profile?.resume_url ?? null}
    />
  );
}
