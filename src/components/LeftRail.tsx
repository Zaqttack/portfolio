'use client';

import Link from 'next/link';

interface RailItem {
  href: string;
  label: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isBack?: boolean;
}

interface LeftRailProps {
  items: RailItem[];
  openToWork?: boolean;
  showBack?: boolean;
  backHref?: string;
}

export default function LeftRail({ items, openToWork = false }: LeftRailProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 'var(--rail-w)',
        zIndex: 40,
        borderRight: '1px solid var(--border-1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '22px 0 20px',
        background: 'rgba(11,12,14,0.72)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: 'none',
          font: '700 12px var(--font-mono), monospace',
          letterSpacing: '.02em',
          color: 'var(--text-1)',
          padding: '0 18px',
        }}
      >
        zq<span style={{ color: 'var(--accent)' }}>.</span>
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '0 18px' }}>
        {items.map((item) => {
          const active = item.active ?? false;
          const content = (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                opacity: active ? 1 : 0.42,
                transition: 'opacity .3s',
              }}
            >
              <span
                style={{
                  display: 'block',
                  height: '1.5px',
                  width: active ? '26px' : '14px',
                  background: active
                    ? 'var(--accent)'
                    : item.isBack
                      ? 'var(--text-4)'
                      : 'var(--text-1)',
                  transition: 'width .35s cubic-bezier(.34,1.56,.64,1), background .3s',
                }}
              />
              <span
                style={{
                  font: '500 9px var(--font-mono), monospace',
                  letterSpacing: '.04em',
                  color: active ? 'var(--accent)' : item.isBack ? 'var(--text-3)' : 'var(--text-1)',
                  transition: 'color .3s',
                }}
              >
                {item.label}
              </span>
            </span>
          );

          if (item.onClick) {
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={item.onClick}
                style={{ textDecoration: 'none', marginTop: item.isBack ? '6px' : 0 }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).querySelector('span')!.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).querySelector('span')!.style.opacity = '0.42';
                }}
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              style={{ textDecoration: 'none', marginTop: item.isBack ? '6px' : 0 }}
            >
              {content}
            </Link>
          );
        })}
      </div>

      <div
        style={{
          padding: '0 18px',
          font: '500 8.5px var(--font-mono), monospace',
          letterSpacing: '.04em',
          color: 'var(--text-5)',
          lineHeight: 1.7,
        }}
      >
        <div>SAT · TX</div>
        {openToWork && (
          <div
            style={{
              marginTop: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-3)',
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
    </nav>
  );
}
