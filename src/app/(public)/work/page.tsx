import type { Metadata } from 'next';
import { getProfile, getProfileLinks, getProjects } from '@/lib/db';
import type { Profile, ProfileLink, Project } from '@/types';
import WorkClient from './WorkClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Zaquariah Holland | Projects' };

export default async function WorkPage() {
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
  return (
    <WorkClient
      projects={projects}
      subtitle={profile?.projects_subtitle ?? null}
      writingEnabled={profile?.writing_enabled ?? false}
      resumeUrl={profile?.resume_url ?? null}
      profileLinks={profileLinks}
    />
  );
}
