import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { SearchResult } from '@/types';

export const runtime = 'nodejs';

export async function GET() {
  const [profile, projects, posts, skills, experience, achievements] = await Promise.all([
    supabase.from('profile').select('writing_enabled, projects_enabled').single(),
    supabase
      .from('projects')
      .select('title, slug, tags, summary')
      .eq('status', 'published')
      .order('display_order'),
    supabase
      .from('posts')
      .select('title, slug, tags, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase.from('skills').select('name, category').order('display_order'),
    supabase
      .from('experience')
      .select('role, company, start_date, end_date, tech_tags, company_data:companies(name)')
      .order('display_order'),
    supabase
      .from('achievements')
      .select('title, date, description')
      .eq('visibility', 'public')
      .order('display_order'),
  ]);

  const writingEnabled = profile.data?.writing_enabled ?? true;
  const projectsEnabled = profile.data?.projects_enabled ?? true;

  const results: SearchResult[] = [];

  if (projectsEnabled && projects.data) {
    for (const p of projects.data) {
      results.push({
        kind: 'project',
        label: p.title,
        hint: (p.tags as string[]).slice(0, 3).join(' · ') || 'project',
        searchText: [(p.tags as string[]).join(' '), p.summary ?? ''].join(' '),
        url: `/projects/${p.slug}`,
      });
    }
  }

  if (writingEnabled && posts.data) {
    for (const p of posts.data) {
      const date = p.published_at ? new Date(p.published_at) : null;
      const hint = date
        ? `${date.toLocaleString('en', { month: 'short' }).toLowerCase()} ${date.getFullYear()}`
        : 'post';
      results.push({
        kind: 'post',
        label: p.title,
        hint,
        searchText: (p.tags as string[]).join(' '),
        url: `/writing/${p.slug}`,
      });
    }
  }

  if (skills.data) {
    for (const s of skills.data) {
      results.push({
        kind: 'skill',
        label: s.name,
        hint: s.category ?? 'skill',
        searchText: s.category ?? '',
        url: '/#skills',
      });
    }
  }

  if (experience.data) {
    for (const e of experience.data) {
      const companyData = Array.isArray(e.company_data)
        ? (e.company_data[0] as { name: string } | undefined)
        : (e.company_data as { name: string } | null);
      const company = companyData?.name ?? (e.company as string | null) ?? '';
      const startYear = (e.start_date as string)?.slice(0, 4) ?? '';
      const endYear = e.end_date ? (e.end_date as string).slice(0, 4) : 'now';
      results.push({
        kind: 'job',
        label: company ? `${e.role} · ${company}` : (e.role as string),
        hint: `${startYear}–${endYear}`,
        searchText: (e.tech_tags as string[] | null)?.join(' ') ?? '',
        url: '/experience',
      });
    }
  }

  if (achievements.data) {
    for (const a of achievements.data) {
      results.push({
        kind: 'achievement',
        label: a.title,
        hint: a.date ? (a.date as string).slice(0, 4) : 'achievement',
        searchText: a.description ?? '',
        url: '/experience',
      });
    }
  }

  return NextResponse.json(results);
}
