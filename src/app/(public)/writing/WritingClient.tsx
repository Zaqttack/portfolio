'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CmdK from '@/components/CmdK';
import Footer from '@/components/Footer';
import LeftRail from '@/components/LeftRail';
import TopNav from '@/components/TopNav';
import type { Post, ProfileLink } from '@/types';

function formatPostDate(d: string): string {
  const dt = new Date(d);
  return `${dt.getFullYear()} · ${String(dt.getMonth() + 1).padStart(2, '0')}`;
}

export default function WritingClient({
  posts,
  subtitle,
  writingEnabled,
  resumeUrl,
  profileLinks,
}: {
  posts: Post[];
  subtitle: string | null;
  writingEnabled: boolean;
  resumeUrl: string | null;
  profileLinks: ProfileLink[];
}) {
  const featured = posts[0] ?? null;
  const archive = posts.slice(1);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'featured' | 'archive'>('featured');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = '1';
            (e.target as HTMLElement).style.transform = 'none';
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const elem = el as HTMLElement;
      elem.style.opacity = '0';
      elem.style.transform = 'translateY(14px)';
      elem.style.transition = 'opacity .55s ease, transform .55s ease';
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const sectionIds = ['featured', 'archive'] as const;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id as (typeof sectionIds)[number]);
        });
      },
      { rootMargin: '0px 0px -60% 0px' },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <LeftRail
        items={[
          ...(featured
            ? [{ href: '#featured', label: 'featured', active: activeSection === 'featured' }]
            : []),
          ...(archive.length > 0
            ? [{ href: '#archive', label: 'archive', active: activeSection === 'archive' }]
            : []),
          { href: '/', label: '← index', active: false, isBack: true },
        ]}
      />
      <main style={{ position: 'relative', zIndex: 2, marginLeft: 'var(--rail-w)' }}>
        <TopNav
          onCmdK={() => setCmdkOpen(true)}
          writingEnabled={writingEnabled}
          resumeUrl={resumeUrl}
        />

        <header style={{ padding: '56px 56px 30px 40px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              font: '500 11px var(--font-mono), monospace',
              color: 'var(--text-3)',
              textDecoration: 'none',
              transition: 'color .3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            <ArrowLeft size={12} /> home
          </Link>
          <h1
            style={{
              fontWeight: 700,
              fontSize: '46px',
              letterSpacing: '-.03em',
              margin: '16px 0 12px',
            }}
          >
            Writing
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: 'var(--text-2)',
                maxWidth: '40em',
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </header>

        {/* featured */}
        {featured && (
          <div id="featured" style={{ padding: '0 56px 30px 40px' }}>
            <a
              data-reveal
              href={`/writing/${featured.slug}`}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid var(--border-2)',
                borderRadius: '14px',
                padding: '32px',
                background: 'var(--panel-1)',
                transition: 'border-color .3s, transform .35s cubic-bezier(.34,1.56,.64,1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-2)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  font: '500 11px var(--font-mono), monospace',
                  color: 'var(--text-4)',
                  marginBottom: '16px',
                }}
              >
                <span style={{ color: 'var(--accent)' }}>LATEST</span>
                {featured.published_at && <span>{formatPostDate(featured.published_at)}</span>}
                {featured.tags[0] && (
                  <>
                    <span>·</span>
                    <span>{featured.tags[0]}</span>
                  </>
                )}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '30px',
                  lineHeight: 1.15,
                  letterSpacing: '-.02em',
                  marginBottom: '12px',
                  maxWidth: '20em',
                }}
              >
                {featured.title}
              </div>
              <p
                style={{
                  fontSize: '15.5px',
                  lineHeight: 1.65,
                  color: 'var(--text-2)',
                  maxWidth: '46em',
                  margin: '0 0 16px',
                }}
              >
                {featured.excerpt}
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  font: '500 12px var(--font-mono), monospace',
                  color: 'var(--accent)',
                }}
              >
                read <ArrowRight size={12} />
              </span>
            </a>
          </div>
        )}

        {/* archive */}
        <div id="archive" style={{ padding: '0 56px 80px 40px' }}>
          <div style={{ borderTop: '1px solid var(--border-2)' }}>
            {archive.length === 0 && !featured && (
              <p style={{ padding: '40px 4px', color: 'var(--text-3)', fontSize: '14px' }}>
                No posts yet.
              </p>
            )}
            {archive.map((p) => (
              <a
                key={p.id}
                data-reveal
                href={`/writing/${p.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr auto',
                  gap: '22px',
                  alignItems: 'baseline',
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '26px 4px',
                  borderBottom: '1px solid var(--border-1)',
                  transition: 'padding .35s cubic-bezier(.34,1.56,.64,1), background .3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.paddingLeft = '16px';
                  e.currentTarget.style.background = '#101114';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.paddingLeft = '4px';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  style={{ font: '500 11px var(--font-mono), monospace', color: 'var(--text-4)' }}
                >
                  {p.published_at ? formatPostDate(p.published_at) : ''}
                </span>
                <span>
                  <span
                    style={{
                      display: 'block',
                      fontWeight: 600,
                      fontSize: '20px',
                      letterSpacing: '-.01em',
                      marginBottom: '5px',
                    }}
                  >
                    {p.title}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      lineHeight: 1.55,
                      color: 'var(--text-2)',
                      maxWidth: '46em',
                    }}
                  >
                    {p.excerpt}
                  </span>
                </span>
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '6px',
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.tags[0] && (
                    <span
                      style={{
                        font: '500 10.5px var(--font-mono), monospace',
                        color: 'var(--text-3)',
                      }}
                    >
                      {p.tags[0]}
                    </span>
                  )}
                </span>
              </a>
            ))}
          </div>
          <div
            style={{
              paddingTop: '26px',
              font: '500 11px var(--font-mono), monospace',
              color: 'var(--text-4)',
            }}
          >
            // more in the archive — coming as I write them
          </div>
        </div>
      </main>

      <Footer profileLinks={profileLinks} />
      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
    </>
  );
}
