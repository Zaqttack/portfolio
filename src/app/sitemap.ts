import { supabase } from '@/lib/supabase';

export const revalidate = 3600;

const base = process.env.NEXT_PUBLIC_SITE_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
  : 'http://localhost:3000';

export default async function sitemap() {
  const [profileResult, projectsResult, postsResult] = await Promise.all([
    supabase.from('profile').select('writing_enabled, projects_enabled, updated_at').single(),
    supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('display_order'),
    supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
  ]);

  const writingEnabled = profileResult.data?.writing_enabled ?? true;
  const projectsEnabled = profileResult.data?.projects_enabled ?? true;

  const urls: { url: string; lastModified: Date }[] = [
    { url: base, lastModified: new Date(profileResult.data?.updated_at ?? Date.now()) },
    { url: `${base}/experience`, lastModified: new Date() },
  ];

  if (projectsEnabled) {
    urls.push({ url: `${base}/projects`, lastModified: new Date() });
    for (const p of projectsResult.data ?? []) {
      urls.push({ url: `${base}/projects/${p.slug}`, lastModified: new Date(p.updated_at) });
    }
  }

  if (writingEnabled) {
    urls.push({ url: `${base}/writing`, lastModified: new Date() });
    for (const p of postsResult.data ?? []) {
      urls.push({ url: `${base}/writing/${p.slug}`, lastModified: new Date(p.updated_at) });
    }
  }

  return urls;
}
