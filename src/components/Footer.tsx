'use client';

import { ArrowUpRight } from 'lucide-react';
import type { ProfileLink } from '@/types';

export default function Footer({
  profileLinks,
  siteDomain,
}: {
  profileLinks: ProfileLink[];
  siteDomain?: string | null;
}) {
  return (
    <footer
      style={{
        marginLeft: 'var(--rail-w)',
        padding: '26px 56px 26px 40px',
        borderTop: '1px solid var(--border-1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          font: '500 11.5px var(--font-mono), monospace',
          color: 'var(--text-4)',
          flexWrap: 'wrap',
        }}
      >
        {profileLinks.map((link, i) => (
          <span key={link.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                color: 'var(--text-4)',
                transition: 'color .3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-4)')}
            >
              {link.label}
              <ArrowUpRight size={11} />
            </a>
            {i < profileLinks.length - 1 && <span style={{ color: 'var(--border-3)' }}>/</span>}
          </span>
        ))}
      </div>
      <span style={{ font: '500 10.5px var(--font-mono), monospace', color: 'var(--text-4)' }}>
        © {new Date().getFullYear()} {siteDomain ?? 'zaquariah.dev'}
      </span>
    </footer>
  );
}
