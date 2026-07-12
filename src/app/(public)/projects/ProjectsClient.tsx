'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CmdK from '@/components/CmdK';
import Footer from '@/components/Footer';
import LeftRail from '@/components/LeftRail';
import MobileNav from '@/components/MobileNav';
import TopNav from '@/components/TopNav';
import type { ProfileLink, Project } from '@/types';

type Tag = 'all' | 'product' | 'side';

function projectTag(p: Project): 'product' | 'side' {
  if (p.tags.includes('side')) return 'side';
  return 'product';
}

function projectDate(p: Project): string {
  if (p.started_at) {
    const start = new Date(p.started_at + 'T00:00:00');
    const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!p.ended_at || p.ended_at === p.started_at) return startStr;
    const end = new Date(p.ended_at + 'T00:00:00');
    const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${startStr} – ${endStr}`;
  }
  return `'${new Date(p.created_at).getFullYear().toString().slice(2)}`;
}

export default function ProjectsClient({
  projects,
  subtitle,
  writingEnabled,
  projectsEnabled,
  resumeUrl,
  profileLinks,
  locationShort,
  name,
}: {
  projects: Project[];
  subtitle: string | null;
  writingEnabled: boolean;
  projectsEnabled: boolean;
  resumeUrl: string | null;
  profileLinks: ProfileLink[];
  locationShort: string | null;
  name: string | null;
}) {
  const [filter, setFilter] = useState<Tag>('all');
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const router = useRouter();

  // Scroll reveals
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
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(14px)';
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [filter]);

  // ⌘K shortcut
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

  const railItems = [
    {
      href: '#',
      label: 'all',
      active: filter === 'all',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setFilter('all');
      },
    },
    {
      href: '#',
      label: 'product',
      active: filter === 'product',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setFilter('product');
      },
    },
    {
      href: '#',
      label: 'side',
      active: filter === 'side',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setFilter('side');
      },
    },
    { href: '/', label: '← home', active: false, isBack: true },
  ];

  const visible = projects.filter((p) => filter === 'all' || projectTag(p) === filter);

  const pillStyle = (t: Tag): React.CSSProperties => ({
    font: '500 11px var(--font-mono), monospace',
    letterSpacing: '.03em',
    color: filter === t ? 'var(--bg)' : 'var(--text-body)',
    background: filter === t ? 'var(--accent)' : 'transparent',
    border: filter === t ? '1px solid var(--accent)' : '1px solid var(--border-3)',
    borderRadius: '20px',
    padding: '6px 14px',
    cursor: 'pointer',
    transition: 'background .2s, color .2s, border-color .2s',
  });

  return (
    <>
      <MobileNav
        name={name}
        railItems={railItems}
        writingEnabled={writingEnabled}
        projectsEnabled={projectsEnabled}
        resumeUrl={resumeUrl}
        onCmdK={() => setCmdkOpen(true)}
      />

      <LeftRail items={railItems} locationShort={locationShort} name={name} />

      <main
        style={{
          position: 'relative',
          zIndex: 2,
          marginLeft: 'max(var(--main-ml), calc((100vw - var(--content-max-w)) / 2))',
          maxWidth: 'var(--content-max-w)',
        }}
      >
        <TopNav
          onCmdK={() => setCmdkOpen(true)}
          writingEnabled={writingEnabled}
          projectsEnabled={projectsEnabled}
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
              color: 'var(--text-meta)',
              textDecoration: 'none',
              transition: 'color .3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-meta)')}
          >
            ← home
          </Link>
          <h1
            style={{
              fontWeight: 700,
              fontSize: '46px',
              letterSpacing: '-.03em',
              margin: '16px 0 12px',
            }}
          >
            Projects
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: 'var(--text-body)',
                maxWidth: '40em',
                margin: '0 0 26px',
              }}
            >
              {subtitle}
            </p>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('all')} style={pillStyle('all')}>
              All
            </button>
            <button onClick={() => setFilter('product')} style={pillStyle('product')}>
              Product
            </button>
            <button onClick={() => setFilter('side')} style={pillStyle('side')}>
              Side projects
            </button>
          </div>
        </header>

        <div style={{ padding: '0 56px 80px 40px' }}>
          <div style={{ borderTop: '1px solid var(--border-2)' }}>
            {visible.length === 0 && (
              <p style={{ padding: '40px 4px', color: 'var(--text-meta)', fontSize: '14px' }}>
                No projects here yet.
              </p>
            )}
            {visible.map((p) => {
              const tag = projectTag(p);
              const stack = p.tags.filter((t) => t !== 'product' && t !== 'side');
              const visibleStack = stack.slice(0, 3);
              const overflowCount = stack.length - 3;
              const hasDetail = !!p.body?.trim();
              const date = projectDate(p);
              const coverUrl =
                p.project_images && p.project_images.length > 0
                  ? p.project_images[0].url
                  : (p.cover_image ?? null);
              return (
                <div
                  key={p.id}
                  data-reveal
                  onClick={() => hasDetail && router.push(`/projects/${p.slug}`)}
                  className="list-row"
                  style={{
                    gridTemplateColumns: '1fr auto',
                    gap: '22px',
                    padding: '30px 4px',
                    borderBottom: '1px solid var(--border-1)',
                    alignItems: 'start',
                    cursor: hasDetail ? 'pointer' : 'default',
                    transition: 'background .2s',
                  }}
                  onMouseEnter={(e) => {
                    if (hasDetail) e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '24px', letterSpacing: '-.01em' }}>
                        {p.title}
                      </span>
                      <span
                        style={{
                          font: '500 9px var(--font-mono), monospace',
                          letterSpacing: '.06em',
                          color: tag === 'product' ? 'var(--accent)' : 'var(--text-meta)',
                          border:
                            tag === 'product'
                              ? '1px solid var(--accent-soft-border)'
                              : '1px solid var(--border-3)',
                          background: tag === 'product' ? 'var(--accent-soft-bg)' : 'transparent',
                          borderRadius: '20px',
                          padding: '2px 9px',
                        }}
                      >
                        {tag.toUpperCase()}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '14.5px',
                        lineHeight: 1.6,
                        color: 'var(--text-body)',
                        maxWidth: '46em',
                        margin: '0 0 12px',
                      }}
                    >
                      {p.summary}
                    </p>
                    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                      {visibleStack.map((s) => (
                        <span
                          key={s}
                          style={{
                            font: '500 10.5px var(--font-mono), monospace',
                            color: 'var(--text-meta)',
                            border: '1px solid var(--border-2)',
                            borderRadius: '5px',
                            padding: '3px 8px',
                          }}
                        >
                          {s}
                        </span>
                      ))}
                      {overflowCount > 0 && (
                        <span
                          title={stack.slice(3).join(', ')}
                          style={{
                            font: '500 10.5px var(--font-mono), monospace',
                            color: 'var(--text-faint)',
                            border: '1px dashed var(--border-2)',
                            borderRadius: '5px',
                            padding: '3px 8px',
                            cursor: 'default',
                          }}
                        >
                          +{overflowCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      gap: '14px',
                      paddingTop: '4px',
                    }}
                  >
                    {coverUrl && (
                      <img
                        src={coverUrl}
                        alt=""
                        style={{
                          width: '120px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid var(--border-2)',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span
                      style={{
                        font: '500 11px var(--font-mono), monospace',
                        color: 'var(--text-meta-2)',
                        textAlign: 'right',
                      }}
                    >
                      {date}
                    </span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {hasDetail && (
                        <span
                          style={{
                            font: '500 11px var(--font-mono), monospace',
                            color: 'var(--text-meta)',
                          }}
                        >
                          read more →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer profileLinks={profileLinks} />
      <CmdK
        open={cmdkOpen}
        onClose={() => setCmdkOpen(false)}
        profileLinks={profileLinks}
        resumeUrl={resumeUrl}
      />
    </>
  );
}
