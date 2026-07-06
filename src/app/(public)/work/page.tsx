import type { Metadata } from 'next';
import { getProfile, getProjects } from '@/lib/db';
import type { Profile, Project } from '@/types';
import WorkClient from './WorkClient';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata: Metadata = { title: 'Zaquariah Holland | Projects' };

export default async function WorkPage() {
  let projects: Project[] = [];
  let profile: Profile | null = null;
  try {
    [projects, profile] = await Promise.all([getProjects(), getProfile()]);
  } catch {
    // DB not available — show empty state
  }
  return (
    <WorkClient
      projects={projects}
      subtitle={profile?.projects_subtitle ?? null}
      writingEnabled={profile?.writing_enabled ?? true}
      resumeUrl={profile?.resume_url ?? null}
    />
  );
}
