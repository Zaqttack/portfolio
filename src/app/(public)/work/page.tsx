import { getProjects } from '@/lib/db';
import type { Project } from '@/types';
import WorkClient from './WorkClient';

export default async function WorkPage() {
  let projects: Project[] = [];
  try {
    projects = await getProjects();
  } catch {
    // DB not available — show empty state
  }
  return <WorkClient projects={projects} />;
}
