import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts, getProfile, getProfileLinks } from '@/lib/db';
import type { Post, Profile, ProfileLink } from '@/types';
import WritingClient from './WritingClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name ?? 'Portfolio';
  const description =
    profile?.writing_subtitle ??
    (name ? `Writing and blog posts by ${name}.` : 'Blog posts and writing on software.');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
    : 'http://localhost:3000';
  return {
    title: `${name} | Writing`,
    description,
    openGraph: {
      title: `${name} | Writing`,
      description,
      url: `${siteUrl}/writing`,
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

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
      projectsEnabled={profile?.projects_enabled ?? true}
      resumeUrl={profile?.resume_download_enabled ? '/api/resume' : (profile?.resume_url ?? null)}
      profileLinks={profileLinks}
      writingFooterNote={profile?.writing_footer_note ?? null}
      locationShort={profile?.location ?? null}
      name={profile?.name ?? null}
    />
  );
}
