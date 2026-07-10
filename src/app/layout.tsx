import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
  : 'http://localhost:3000';

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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
