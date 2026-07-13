import { getProfile } from '@/lib/db';

export const dynamic = 'force-dynamic';

const base = process.env.NEXT_PUBLIC_SITE_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
  : 'http://localhost:3000';

export default async function robots() {
  const profile = await getProfile().catch(() => null);
  const writingEnabled = profile?.writing_enabled ?? true;
  const projectsEnabled = profile?.projects_enabled ?? true;

  const disallow = ['/admin', '/api'];
  if (!writingEnabled) disallow.push('/writing');
  if (!projectsEnabled) disallow.push('/projects');

  return {
    rules: [
      // Main crawlers — full access to enabled public content
      { userAgent: '*', allow: '/', disallow },

      // AI search bots — allow so we appear in AI answers
      { userAgent: 'OAI-SearchBot', allow: '/', disallow },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow },
      { userAgent: 'PerplexityBot', allow: '/', disallow },
      { userAgent: 'Google-Extended', allow: '/', disallow },
      { userAgent: 'Applebot-Extended', allow: '/', disallow },

      // Training-only bots — no SEO benefit, block data scrapers
      { userAgent: 'Bytespider', disallow: ['/'] },
      { userAgent: 'Diffbot', disallow: ['/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
