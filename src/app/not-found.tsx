import type { Metadata } from 'next';
import Link from 'next/link';
import { getProfile } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name ?? 'Portfolio';
  return { title: `${name} | Not Found` };
}

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--canvas)',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          font: '700 96px var(--font-mono), monospace',
          color: 'var(--border-1)',
          lineHeight: 1,
          marginBottom: '24px',
          userSelect: 'none',
        }}
      >
        404
      </div>
      <div
        style={{
          font: '600 22px var(--font-space), sans-serif',
          letterSpacing: '-.01em',
          marginBottom: '10px',
        }}
      >
        This page doesn't exist.
      </div>
      <div
        style={{
          font: '400 15px var(--font-space), sans-serif',
          color: 'var(--text-2)',
          marginBottom: '36px',
        }}
      >
        It may have moved, or you followed a broken link.
      </div>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--accent)',
          color: 'var(--canvas)',
          font: '600 13px var(--font-space), sans-serif',
          textDecoration: 'none',
          padding: '12px 22px',
          borderRadius: '8px',
        }}
      >
        ← Back to homepage
      </Link>
    </main>
  );
}
