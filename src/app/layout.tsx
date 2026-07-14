import type { Metadata } from 'next';
import { Caveat, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { getProfile } from '@/lib/db';
import './globals.css';

export const dynamic = 'force-dynamic';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-caveat',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
  : 'http://localhost:3000';

// Runs synchronously before first paint to prevent theme flash
const themeScript = `(function(){var m=localStorage.getItem('zq-theme-mode')||'system';var s=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',m==='system'?s:m);})();`;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name ?? process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'Portfolio';
  const description = profile?.tagline ?? '';

  return {
    title: name,
    description,
    metadataBase: new URL(siteUrl),
    icons: { icon: '/api/favicon' },
    openGraph: {
      title: name,
      description,
      url: siteUrl,
      siteName: process.env.NEXT_PUBLIC_SITE_DOMAIN ?? '',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
      : {}),
  };
}

function buildJsonLd(profile: Awaited<ReturnType<typeof getProfile>> | null) {
  const name = profile?.name ?? '';
  const description = profile?.bio ?? profile?.tagline ?? '';

  const sameAs: string[] = [];
  if (profile?.github) sameAs.push(`https://github.com/${profile.github.replace(/^@/, '')}`);
  if (profile?.linkedin)
    sameAs.push(`https://linkedin.com/in/${profile.linkedin.replace(/^@/, '')}`);
  if (profile?.twitter) sameAs.push(`https://x.com/${profile.twitter.replace(/^@/, '')}`);
  if (profile?.website && profile.website !== siteUrl) sameAs.push(profile.website);

  const person = {
    '@type': 'Person',
    name,
    ...(description ? { description } : {}),
    url: siteUrl,
    ...(profile?.email ? { email: profile.email } : {}),
    ...(profile?.location ? { homeLocation: { '@type': 'Place', name: profile.location } } : {}),
    ...(profile?.avatar_url ? { image: profile.avatar_url } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const website = {
    '@type': 'WebSite',
    name,
    url: siteUrl,
    author: person,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/api/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [person, website] });
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile().catch(() => null);
  const accentColor = profile?.accent_color ?? '#ec6a2c';
  const jsonLd = buildJsonLd(profile);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        {process.env.NEXT_PUBLIC_CF_BEACON_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_BEACON_TOKEN}"}`}
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
