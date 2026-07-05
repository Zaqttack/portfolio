import { supabase } from './supabase';
import type { Project, Post, WorkEntry, LeadershipEntry, Profile } from '@/types';

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('sort_order');
  if (error) throw error;
  return data;
}

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getWorkHistory(): Promise<WorkEntry[]> {
  const { data, error } = await supabase
    .from('work_history')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data;
}

export async function getLeadership(): Promise<LeadershipEntry[]> {
  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data;
}

export async function getProfile(): Promise<Profile> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single();
  if (error) throw error;
  return data;
}
