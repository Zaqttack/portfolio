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
    openGraph: {
      title: name,
      description,
      url: siteUrl,
      siteName: process.env.NEXT_PUBLIC_SITE_DOMAIN ?? '',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile().catch(() => null);
  const accentColor = profile?.accent_color ?? '#ec6a2c';

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
