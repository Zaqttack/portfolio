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

export const metadata: Metadata = {
  title: 'Zaquariah Holland',
  description:
    'Software engineer — San Antonio, TX. Full-stack, backend-leaning. Fintech and cloud infrastructure.',
  metadataBase: new URL('https://zaquariah.dev'),
  openGraph: {
    title: 'Zaquariah Holland',
    description: 'Software engineer — San Antonio, TX.',
    url: 'https://zaquariah.dev',
    siteName: 'zaquariah.dev',
    locale: 'en_US',
    type: 'website',
  },
};

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
