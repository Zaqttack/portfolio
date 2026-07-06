import type { Metadata } from 'next';
import {
  getCertifications,
  getEducation,
  getExperience,
  getInvolvement,
  getProfile,
} from '@/lib/db';
import type { Certification, Education, Experience, InvolvementOrg, Profile } from '@/types';
import ExperienceClient from './ExperienceClient';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata: Metadata = { title: 'Zaquariah Holland | Experience' };

export default async function ExperiencePage() {
  let experience: Experience[] = [];
  let involvement: InvolvementOrg[] = [];
  let profile: Profile | null = null;
  let education: Education[] = [];
  let certifications: Certification[] = [];
  try {
    [experience, involvement, profile, education, certifications] = await Promise.all([
      getExperience(),
      getInvolvement(),
      getProfile(),
      getEducation(),
      getCertifications(),
    ]);
  } catch {
    // DB not available — show empty state
  }
  return (
    <ExperienceClient
      experience={experience}
      involvement={involvement}
      profile={profile}
      education={education}
      certifications={certifications}
      subtitle={profile?.experience_subtitle ?? null}
      writingEnabled={profile?.writing_enabled ?? true}
    />
  );
}
