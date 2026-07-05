import type {
  Achievement,
  AdminActivity,
  BotSignature,
  Experience,
  GalleryImage,
  ImportStaging,
  InvolvementOrg,
  PageView,
  Post,
  Profile,
  Project,
  Skill,
} from '@/types';
import { supabase } from './supabase';

export async function getProfile(): Promise<Profile> {
  const { data, error } = await supabase.from('profile').select('*').single();
  if (error) throw error;
  return data;
}

export async function getExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*, experience_bullets(*)')
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

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('display_order');
  if (error) throw error;
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
