import type { Metadata } from 'next';
import {
  getAchievements,
  getCertifications,
  getEducation,
  getExperience,
  getInvolvement,
  getProfile,
  getProfileLinks,
  getSkills,
} from '@/lib/db';
import type {
  Achievement,
  Certification,
  Education,
  Experience,
  InvolvementOrg,
  Profile,
  ProfileLink,
  Skill,
} from '@/types';
import ExperienceClient from './ExperienceClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name ?? 'Portfolio';
  return { title: `${name} | Experience` };
}

export default async function ExperiencePage() {
  let experience: Experience[] = [];
  let involvement: InvolvementOrg[] = [];
  let profile: Profile | null = null;
  let education: Education[] = [];
  let certifications: Certification[] = [];
  let achievements: Achievement[] = [];
  let skills: Skill[] = [];
  let profileLinks: ProfileLink[] = [];
  try {
    experience = await getExperience();
  } catch {}
  try {
    involvement = await getInvolvement();
  } catch {}
  try {
    profile = await getProfile();
  } catch {}
  try {
    education = await getEducation();
  } catch {}
  try {
    certifications = await getCertifications();
  } catch {}
  try {
    achievements = await getAchievements();
  } catch {}
  try {
    skills = await getSkills();
  } catch {}
  try {
    profileLinks = await getProfileLinks();
  } catch {}
  return (
    <ExperienceClient
      experience={experience}
      involvement={involvement}
      profile={profile}
      education={education}
      certifications={certifications}
      achievements={achievements}
      skills={skills}
      profileLinks={profileLinks}
      subtitle={profile?.experience_subtitle ?? null}
      writingEnabled={profile?.writing_enabled ?? false}
      projectsEnabled={profile?.projects_enabled ?? true}
      locationShort={profile?.location ?? null}
    />
  );
}
