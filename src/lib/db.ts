import type {
  Achievement,
  AdminActivity,
  BotSignature,
  Certification,
  Company,
  Education,
  Experience,
  GalleryImage,
  ImportStaging,
  InvolvementOrg,
  PageView,
  Post,
  Profile,
  ProfileLink,
  Project,
  Skill,
} from '@/types';
import { supabase } from './supabase';

export async function getProfile(): Promise<Profile> {
  const { data, error } = await supabase.from('profile').select('*').single();
  if (error) throw error;
  return data;
}

export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await supabase.from('companies').select('*').order('display_order');
  if (error) throw error;
  return data;
}

export async function getExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*, experience_bullets(*), company_data:companies(*)')
    .order('display_order');
  if (error) throw error;
  return data;
}

export async function getInvolvement(): Promise<InvolvementOrg[]> {
  const { data, error } = await supabase
    .from('involvement_orgs')
    .select('*, involvement_roles(*)')
    .order('display_order');
  if (error) throw error;
  return data;
}

export async function getProfileLinks(): Promise<ProfileLink[]> {
  const { data, error } = await supabase.from('profile_links').select('*').order('display_order');
  if (error) throw error;
  return data;
}

export async function getAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('visibility', 'public')
    .order('display_order');
  if (error) throw error;
  return data;
}

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase.from('skills').select('*').order('display_order');
  if (error) throw error;
  return data;
}

export async function getEducation(): Promise<Education[]> {
  const { data, error } = await supabase.from('education').select('*').order('display_order');
  if (error) throw error;
  return data;
}

export async function getCertifications(): Promise<Certification[]> {
  const { data, error } = await supabase.from('certifications').select('*').order('display_order');
  if (error) throw error;
  return data;
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('display_order');
  if (error) throw error;
  return data;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data;
}

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getGallery(): Promise<GalleryImage[]> {
  const { data, error } = await supabase.from('gallery_images').select('*').order('display_order');
  if (error) throw error;
  return data;
}

export async function getResumeData() {
  const [
    profile,
    links,
    expResult,
    projResult,
    skillsResult,
    education,
    certifications,
    involvement,
  ] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('profile_links').select('*').order('display_order'),
    supabase
      .from('experience')
      .select('*, experience_bullets(*), company_data:companies(*)')
      .order('display_order'),
    supabase.from('projects').select('*').eq('status', 'published').order('display_order'),
    supabase.from('skills').select('*').order('display_order'),
    supabase.from('education').select('*').eq('resume_include', true).order('display_order'),
    supabase.from('certifications').select('*').eq('resume_include', true).order('display_order'),
    supabase
      .from('involvement_orgs')
      .select('*, involvement_roles(*)')
      .eq('resume_include', true)
      .order('display_order'),
  ]);

  if (expResult.error) throw expResult.error;
  if (projResult.error) throw projResult.error;
  if (skillsResult.error) throw skillsResult.error;

  return {
    profile: profile.data,
    links: links.data ?? [],
    experience: expResult.data ?? [],
    projects: projResult.data ?? [],
    skills: skillsResult.data ?? [],
    education: education.data ?? [],
    certifications: certifications.data ?? [],
    involvement: involvement.data ?? [],
  };
}

// Admin helpers — called from route handlers using service-role key

export async function getImportStaging(): Promise<ImportStaging[]> {
  const { data, error } = await supabase
    .from('import_staging')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPageViews(limit = 1000): Promise<PageView[]> {
  const { data, error } = await supabase
    .from('page_views')
    .select('*')
    .order('ts', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getBotSignatures(): Promise<BotSignature[]> {
  const { data, error } = await supabase.from('bot_signatures').select('*').order('bot_name');
  if (error) throw error;
  return data;
}

export async function getAdminActivity(limit = 100): Promise<AdminActivity[]> {
  const { data, error } = await supabase
    .from('admin_activity')
    .select('*')
    .order('ts', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
