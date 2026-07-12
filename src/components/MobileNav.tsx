'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface RailItem {
  href: string;
  label: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isBack?: boolean;
}

interface MobileNavProps {
  name?: string | null;
  railItems?: RailItem[];
  openToWork?: boolean;
  locationShort?: string | null;
  writingEnabled?: boolean;
  projectsEnabled?: boolean;
  resumeUrl?: string | null;
  onCmdK?: () => void;
}

export default function MobileNav({
  name,
  railItems = [],
  openToWork = false,
  locationShort,
  writingEnabled = true,
  projectsEnabled = true,
  resumeUrl,
  onCmdK,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const parts = name ? name.trim().split(/\s+/) : [];
  const monogram =
    parts.length > 0
      ? ((parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '')).toLowerCase() || 'zq'
      : 'zq';

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close when navigating to a new page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const pageLinks = [
    { href: '/', label: 'Home' },
    ...(projectsEnabled ? [{ href: '/projects', label: 'Projects' }] : []),
    ...(writingEnabled ? [{ href: '/writing', label: 'Writing' }] : []),
    { href: '/experience', label: 'Experience' },
    ...(resumeUrl ? [{ href: resumeUrl, label: 'Resume', external: true }] : []),
  ] as Array<{ href: string; label: string; external?: boolean }>;

  // Section jump links — exclude back/home items (those are in page nav)
  const sectionItems = railItems.filter((r) => !r.isBack);

  return (
    <div className="mobile-only">
      {/* Slim fixed header */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          borderBottom: '1px solid var(--border-1)',
          background: 'var(--bg)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            font: '700 14px var(--font-mono), monospace',
            letterSpacing: '.02em',
            color: 'var(--text)',
          }}
        >
          {monogram}
          <span style={{ color: 'var(--accent)' }}>.</span>
        </Link>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-meta)',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <span
            style={{ display: 'block', width: '22px', height: '1.5px', background: 'currentColor' }}
          />
          <span
            style={{ display: 'block', width: '22px', height: '1.5px', background: 'currentColor' }}
          />
          <span
            style={{ display: 'block', width: '14px', height: '1.5px', background: 'currentColor' }}
          />
        </button>
      </div>

      {/* Fullscreen overlay */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Overlay header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-1)',
              flexShrink: 0,
            }}
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              style={{
                textDecoration: 'none',
                font: '700 14px var(--font-mono), monospace',
                letterSpacing: '.02em',
                color: 'var(--text)',
              }}
            >
              {monogram}
              <span style={{ color: 'var(--accent)' }}>.</span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-meta)',
                font: '400 22px var(--font-space), sans-serif',
                padding: '4px 8px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {/* Page nav */}
          <nav
            style={{ padding: '12px 0', borderBottom: '1px solid var(--border-1)', flexShrink: 0 }}
          >
            {pageLinks.map((l) => {
              const active =
                l.href === '/'
                  ? pathname === '/'
                  : pathname === l.href || pathname.startsWith(l.href + '/');
              if (l.external) {
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      padding: '13px 22px',
                      textDecoration: 'none',
                      font: '600 18px var(--font-space), sans-serif',
                      color: active ? 'var(--accent)' : 'var(--text)',
                    }}
                  >
                    {l.label}
                  </a>
                );
              }
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block',
                    padding: '13px 22px',
                    textDecoration: 'none',
                    font: '600 18px var(--font-space), sans-serif',
                    color: active ? 'var(--accent)' : 'var(--text)',
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* On this page */}
          {sectionItems.length > 0 && (
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid var(--border-1)',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  font: '500 9px var(--font-mono), monospace',
                  letterSpacing: '.1em',
                  color: 'var(--text-faint)',
                  marginBottom: '10px',
                }}
              >
                ON THIS PAGE
              </div>
              {sectionItems.map((item) => {
                const content = (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 0',
                      color: item.active ? 'var(--accent)' : 'var(--text-body)',
                      font: '500 13px var(--font-mono), monospace',
                      letterSpacing: '.04em',
                    }}
                  >
                    {item.active && (
                      <span
                        style={{
                          display: 'block',
                          width: '18px',
                          height: '1.5px',
                          background: 'var(--accent)',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {item.label}
                  </span>
                );

                if (item.onClick) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => {
                        setOpen(false);
                        item.onClick?.(e);
                      }}
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      {content}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Bottom: theme toggle + status */}
          <div
            style={{
              padding: '18px 22px',
              borderTop: '1px solid var(--border-1)',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  font: '500 10px var(--font-mono), monospace',
                  letterSpacing: '.06em',
                  color: 'var(--text-faint)',
                }}
              >
                THEME
              </span>
              <ThemeToggle />
            </div>
            <div
              style={{
                font: '500 10px var(--font-mono), monospace',
                letterSpacing: '.04em',
                color: 'var(--text-faint)',
                lineHeight: 1.7,
              }}
            >
              {locationShort && <div>{locationShort}</div>}
              {openToWork && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--text-meta)',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      animation: 'pulse 2s ease-in-out infinite',
                      display: 'inline-block',
                    }}
                  />
                  open to work
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer so content doesn't hide under the fixed header */}
      <div style={{ height: '52px' }} />
    </div>
  );
}
