'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import CmdK from '@/components/CmdK';
import LeftRail from '@/components/LeftRail';
import TopNav from '@/components/TopNav';
import type { Project } from '@/types';

type Tag = 'all' | 'product' | 'side';

function projectTag(p: Project): 'product' | 'side' {
  if (p.tags.includes('side')) return 'side';
  return 'product';
}

function projectYear(p: Project): string {
  return `'${new Date(p.created_at).getFullYear().toString().slice(2)}`;
}

export default function WorkClient({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Tag>('all');
  const [cmdkOpen, setCmdkOpen] = useState(false);

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
    { href: '/', label: '← index', active: false, isBack: true },
  ];

  const visible = projects.filter((p) => filter === 'all' || projectTag(p) === filter);

  const pillStyle = (t: Tag): React.CSSProperties => ({
    font: '500 11px var(--font-mono), monospace',
    letterSpacing: '.03em',
    color: filter === t ? 'var(--canvas)' : 'var(--text-2)',
    background: filter === t ? 'var(--accent)' : 'transparent',
    border: filter === t ? '1px solid var(--accent)' : '1px solid var(--border-3)',
    borderRadius: '20px',
    padding: '6px 14px',
    cursor: 'pointer',
    transition: 'background .2s, color .2s, border-color .2s',
  });

  return (
    <>
      <LeftRail items={railItems} />

      <main style={{ position: 'relative', zIndex: 2, marginLeft: 'var(--rail-w)' }}>
        <TopNav onCmdK={() => setCmdkOpen(true)} />

        <header style={{ padding: '56px 56px 30px 40px' }}>
          <Link
            href="/"
            style={{
              font: '500 11px var(--font-mono), monospace',
              color: 'var(--text-3)',
              textDecoration: 'none',
              transition: 'color .3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            ← index
          </Link>
          <h1
            style={{
              fontWeight: 700,
              fontSize: '46px',
              letterSpacing: '-.03em',
              margin: '16px 0 12px',
            }}
          >
            Work
          </h1>
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'var(--text-2)',
              maxWidth: '40em',
              margin: '0 0 26px',
            }}
          >
            Things I've shipped — professionally and for the sheer fun of it. The side projects get
            documented with the same rigor as the paid work, on purpose.
          </p>
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
              <p style={{ padding: '40px 4px', color: 'var(--text-3)', fontSize: '14px' }}>
                No projects here yet.
              </p>
            )}
            {visible.map((p) => {
              const tag = projectTag(p);
              const stack = p.tags.filter((t) => t !== 'product' && t !== 'side');
              return (
                <div
                  key={p.id}
                  data-reveal
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '22px',
                    padding: '30px 4px',
                    borderBottom: '1px solid var(--border-1)',
                    alignItems: 'start',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '24px', letterSpacing: '-.01em' }}>
                        {p.title}
                      </span>
                      <span
                        style={{
                          font: '500 9px var(--font-mono), monospace',
                          letterSpacing: '.06em',
                          color: tag === 'product' ? 'var(--accent)' : 'var(--text-3)',
                          border:
                            tag === 'product' ? '1px solid #3a2a1e' : '1px solid var(--border-3)',
                          background: tag === 'product' ? '#1a1310' : 'transparent',
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
                        color: 'var(--text-2)',
                        maxWidth: '46em',
                        margin: '0 0 12px',
                      }}
                    >
                      {p.summary}
                    </p>
                    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                      {stack.map((s) => (
                        <span
                          key={s}
                          style={{
                            font: '500 10.5px var(--font-mono), monospace',
                            color: 'var(--text-3)',
                            border: '1px solid var(--border-2)',
                            borderRadius: '5px',
                            padding: '3px 8px',
                          }}
                        >
                          {s}
                        </span>
                      ))}
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
                    <span
                      style={{
                        font: '500 11px var(--font-mono), monospace',
                        color: 'var(--text-4)',
                      }}
                    >
                      {projectYear(p)}
                    </span>
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          font: '500 11px var(--font-mono), monospace',
                          color: 'var(--text-2)',
                          textDecoration: 'none',
                          transition: 'color .3s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                      >
                        visit ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
    </>
  );
}
