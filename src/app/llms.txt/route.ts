import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600;

const base = process.env.NEXT_PUBLIC_SITE_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
  : 'http://localhost:3000';

export async function GET() {
  const [profileResult, projectsResult, postsResult, skillsResult, experienceResult] =
    await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase
        .from('projects')
        .select('title, slug, summary, tags')
        .eq('status', 'published')
        .order('display_order'),
      supabase
        .from('posts')
        .select('title, slug, excerpt, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false }),
      supabase.from('skills').select('name, category').order('display_order').limit(30),
      supabase
        .from('experience')
        .select('role, company, start_date, end_date, company_data:companies(name)')
        .order('display_order')
        .limit(10),
    ]);

  const profile = profileResult.data;
  const projects = projectsResult.data ?? [];
  const posts = postsResult.data ?? [];
  const skills = skillsResult.data ?? [];
  const experience = experienceResult.data ?? [];

  const writingEnabled = profile?.writing_enabled ?? true;
  const projectsEnabled = profile?.projects_enabled ?? true;

  const lines: string[] = [];

  // Identity block
  lines.push(`# ${profile?.name ?? 'Portfolio'}`);
  lines.push('');
  if (profile?.bio ?? profile?.tagline) {
    lines.push(`> ${profile?.bio ?? profile?.tagline}`);
    lines.push('');
  }
  if (profile?.location) lines.push(`Location: ${profile.location}`);
  if (profile?.email) lines.push(`Contact: ${profile.email}`);
  const socials: string[] = [];
  if (profile?.github)
    socials.push(`GitHub: https://github.com/${profile.github.replace(/^@/, '')}`);
  if (profile?.linkedin)
    socials.push(`LinkedIn: https://linkedin.com/in/${profile.linkedin.replace(/^@/, '')}`);
  if (profile?.twitter)
    socials.push(`X/Twitter: https://x.com/${profile.twitter.replace(/^@/, '')}`);
  lines.push(...socials);
  lines.push('');

  // Navigation
  lines.push('## Site pages');
  lines.push('');
  lines.push(`- Home: ${base}/`);
  lines.push(`- Experience: ${base}/experience`);
  if (projectsEnabled) lines.push(`- Projects: ${base}/projects`);
  if (writingEnabled) lines.push(`- Writing: ${base}/writing`);
  lines.push('');

  // Projects
  if (projectsEnabled && projects.length > 0) {
    lines.push('## Projects');
    lines.push('');
    for (const p of projects) {
      lines.push(`### [${p.title}](${base}/projects/${p.slug})`);
      if (p.summary) lines.push(p.summary);
      const stack = (p.tags as string[]).filter((t) => t !== 'product' && t !== 'side');
      if (stack.length > 0) lines.push(`Stack: ${stack.join(', ')}`);
      lines.push('');
    }
  }

  // Writing
  if (writingEnabled && posts.length > 0) {
    lines.push('## Writing');
    lines.push('');
    for (const p of posts) {
      const date = p.published_at ? new Date(p.published_at as string).getFullYear() : '';
      lines.push(`### [${p.title}](${base}/writing/${p.slug})${date ? ` (${date})` : ''}`);
      if (p.excerpt) lines.push(p.excerpt as string);
      lines.push('');
    }
  }

  // Skills snapshot
  if (skills.length > 0) {
    const byCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
      const cat = (s.category as string) ?? 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s.name as string);
      return acc;
    }, {});
    lines.push('## Skills');
    lines.push('');
    for (const [cat, names] of Object.entries(byCategory)) {
      lines.push(`**${cat}:** ${names.join(', ')}`);
    }
    lines.push('');
  }

  // Experience summary
  if (experience.length > 0) {
    lines.push('## Experience');
    lines.push('');
    for (const e of experience) {
      const companyData = Array.isArray(e.company_data)
        ? (e.company_data[0] as { name: string } | undefined)
        : (e.company_data as { name: string } | null);
      const company = companyData?.name ?? (e.company as string | null) ?? '';
      const start = (e.start_date as string)?.slice(0, 4) ?? '';
      const end = e.end_date ? (e.end_date as string).slice(0, 4) : 'present';
      lines.push(`- ${e.role}${company ? ` at ${company}` : ''} (${start}–${end})`);
    }
    lines.push('');
  }

  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
