'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

interface TopNavProps {
  onCmdK?: () => void;
  writingEnabled?: boolean;
  projectsEnabled?: boolean;
  resumeUrl?: string | null;
  sticky?: boolean;
  paddingLeft?: string;
}

export default function TopNav({
  onCmdK,
  writingEnabled = true,
  projectsEnabled = true,
  resumeUrl,
  sticky = false,
  paddingLeft = '40px',
}: TopNavProps) {
  const pathname = usePathname();

  const link = (href: string, label: string) => {
    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
    return (
      <Link
        href={href}
        style={{
          textDecoration: 'none',
          color: active ? 'var(--accent)' : 'var(--text-body)',
          transition: 'color .3s',
        }}
        onMouseEnter={(e) => {
          if (!active) (e.target as HTMLElement).style.color = 'var(--text)';
        }}
        onMouseLeave={(e) => {
          if (!active) (e.target as HTMLElement).style.color = 'var(--text-body)';
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <div
      className="desktop-only"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `13px 40px 13px ${paddingLeft}`,
        font: '500 11.5px var(--font-mono), monospace',
        letterSpacing: '.02em',
        ...(sticky
          ? {
              position: 'sticky',
              top: 0,
              zIndex: 30,
              background: 'var(--bg)',
              borderBottom: '1px solid var(--border-1)',
            }
          : {}),
      }}
    >
      <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-meta-2)' }}>
        {process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'zaquariah.dev'}
      </Link>
      <span style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
        {onCmdK && (
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
              color: 'var(--text-meta)',
              font: '500 10px var(--font-mono), monospace',
              transition: 'border-color .3s, color .3s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-meta-2)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-3)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-meta)';
            }}
          >
            ⌘K
          </button>
        )}
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
        <ThemeToggle />
      </span>
    </div>
  );
}
