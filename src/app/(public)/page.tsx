import {
  getExperience,
  getInvolvement,
  getPosts,
  getProfile,
  getProfileLinks,
  getProjects,
  getSkills,
} from '@/lib/db';
import type {
  Experience,
  InvolvementOrg,
  Post,
  Profile,
  ProfileLink,
  Project,
  Skill,
} from '@/types';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function HomePage() {
  let profile: Profile | null = null;
  let projects: Project[] = [];
  let posts: Post[] = [];
  let experience: Experience[] = [];
  let involvement: InvolvementOrg[] = [];
  let skills: Skill[] = [];
  let profileLinks: ProfileLink[] = [];
  try {
    [profile, projects, posts, experience, involvement, skills, profileLinks] = await Promise.all([
      getProfile().catch(() => null),
      getProjects().catch((): Project[] => []),
      getPosts().catch((): Post[] => []),
      getExperience().catch((): Experience[] => []),
      getInvolvement().catch((): InvolvementOrg[] => []),
      getSkills().catch((): Skill[] => []),
      getProfileLinks().catch((): ProfileLink[] => []),
    ]);
  } catch {
    // DB not available — show empty state
  }
  return (
    <HomeClient
      profile={profile}
      projects={projects}
      posts={posts}
      experience={experience}
      involvement={involvement}
      skills={skills}
      profileLinks={profileLinks}
    />
  );
}
