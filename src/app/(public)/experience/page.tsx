import { getExperience, getInvolvement } from '@/lib/db';
import type { Experience, InvolvementOrg } from '@/types';
import ExperienceClient from './ExperienceClient';

export default async function ExperiencePage() {
  let experience: Experience[] = [];
  let involvement: InvolvementOrg[] = [];
  try {
    [experience, involvement] = await Promise.all([getExperience(), getInvolvement()]);
  } catch {
    // DB not available — show empty state
  }
  return <ExperienceClient experience={experience} involvement={involvement} />;
}
