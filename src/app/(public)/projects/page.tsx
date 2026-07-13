import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProfile, getProfileLinks, getProjects } from '@/lib/db';
import type { Profile, ProfileLink, Project } from '@/types';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name ?? 'Portfolio';
  const description =
    profile?.projects_subtitle ??
    (name ? `Software projects by ${name}.` : 'A portfolio of software projects.');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
    : 'http://localhost:3000';
  return {
    title: `${name} | Projects`,
    description,
    openGraph: {
      title: `${name} | Projects`,
      description,
      url: `${siteUrl}/projects`,
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function ProjectsPage() {
  let projects: Project[] = [];
  let profile: Profile | null = null;
  let profileLinks: ProfileLink[] = [];
  try {
    projects = await getProjects();
  } catch {}
  try {
    profile = await getProfile();
  } catch {}
  try {
    profileLinks = await getProfileLinks();
  } catch {}
  if (profile && profile.projects_enabled === false) notFound();
  return (
    <ProjectsClient
      projects={projects}
      subtitle={profile?.projects_subtitle ?? null}
      writingEnabled={profile?.writing_enabled ?? false}
      projectsEnabled={profile?.projects_enabled ?? true}
      resumeUrl={profile?.resume_download_enabled ? '/api/resume' : (profile?.resume_url ?? null)}
      profileLinks={profileLinks}
      locationShort={profile?.location ?? null}
      name={profile?.name ?? null}
    />
  );
}
