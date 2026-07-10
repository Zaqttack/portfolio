import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProfile, getProfileLinks, getProjects } from '@/lib/db';
import type { Profile, ProfileLink, Project } from '@/types';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Zaquariah Holland | Projects' };

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
