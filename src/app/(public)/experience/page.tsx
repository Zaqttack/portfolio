import type { Metadata } from 'next';
import {
  getAchievements,
  getCertifications,
  getEducation,
  getExperience,
  getInvolvement,
  getProfile,
  getProfileLinks,
} from '@/lib/db';
import type {
  Achievement,
  Certification,
  Education,
  Experience,
  InvolvementOrg,
  Profile,
  ProfileLink,
} from '@/types';
import ExperienceClient from './ExperienceClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Zaquariah Holland | Experience' };

export default async function ExperiencePage() {
  let experience: Experience[] = [];
  let involvement: InvolvementOrg[] = [];
  let profile: Profile | null = null;
  let education: Education[] = [];
  let certifications: Certification[] = [];
  let achievements: Achievement[] = [];
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
      profileLinks={profileLinks}
      subtitle={profile?.experience_subtitle ?? null}
      writingEnabled={profile?.writing_enabled ?? false}
      projectsEnabled={profile?.projects_enabled ?? true}
      siteDomain={profile?.site_domain ?? null}
      locationShort={profile?.location ?? null}
    />
  );
}
