'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopNavProps {
  onCmdK?: () => void;
  writingEnabled?: boolean;
  projectsEnabled?: boolean;
  resumeUrl?: string | null;
  siteDomain?: string | null;
}

export default function TopNav({
  onCmdK,
  writingEnabled = true,
  projectsEnabled = true,
  resumeUrl,
  siteDomain,
}: TopNavProps) {
  const pathname = usePathname();

  const link = (href: string, label: string) => {
    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
    return (
      <Link
        href={href}
        style={{
          textDecoration: 'none',
          color: active ? 'var(--accent)' : 'var(--text-2)',
          transition: 'color .3s',
        }}
        onMouseEnter={(e) => {
          if (!active) (e.target as HTMLElement).style.color = 'var(--text-1)';
        }}
        onMouseLeave={(e) => {
          if (!active) (e.target as HTMLElement).style.color = 'var(--text-2)';
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-1)',
        padding: '13px 40px',
        font: '500 11.5px var(--font-mono), monospace',
        letterSpacing: '.02em',
      }}
    >
      <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-4)' }}>
        {siteDomain ?? 'zaquariah.dev'}
      </Link>
      <span style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
        <button
          onClick={onCmdK}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: '1px solid var(--border-3)',
            borderRadius: '6px',
            padding: '5px 9px',
            cursor: 'pointer',
            color: 'var(--text-3)',
            font: '500 10px var(--font-mono), monospace',
            transition: 'border-color .3s, color .3s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-4)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-3)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-3)';
          }}
        >
          ⌘K
        </button>
        {projectsEnabled && link('/projects', 'Projects')}
        {writingEnabled && link('/writing', 'Writing')}
        {link('/experience', 'Experience')}
        {resumeUrl && (
          <a
            href={resumeUrl}
            {...(resumeUrl.startsWith('/')
              ? { download: true }
              : { target: '_blank', rel: 'noopener noreferrer' })}
            style={{ textDecoration: 'none', color: 'var(--accent)' }}
          >
            Resume ↓
          </a>
        )}
      </span>
    </div>
  );
}
