'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import LeftRail from '@/components/LeftRail';
import CmdK from '@/components/CmdK';

const FEATURED = {
  date: '2026 · 03',
  category: 'engineering',
  readTime: '8 min',
  title: 'Event sourcing without the regret',
  excerpt: "What I'd tell myself before building LedgerLoop's ledger a second time — where event sourcing earned its keep, where it added ceremony, and the three rules I'd keep.",
  slug: '#',
};

const POSTS = [
  {
    slug: '#',
    date: '2026 · 01',
    title: 'Running a game jam is a distributed-systems problem',
    excerpt: 'Coordination, backpressure, and eventual consistency — but with dinosaurs and a Discord server.',
    category: 'community',
    readTime: '6 min',
  },
  {
    slug: '#',
    date: '2025 · 11',
    title: 'The boring parts are the job',
    excerpt: "Retries, idempotency, and observability aren't the fun part. They're most of the value.",
    category: 'engineering',
    readTime: '5 min',
  },
  {
    slug: '#',
    date: '2025 · 08',
    title: 'Over-engineering a cat quiz, and why I\'d do it again',
    excerpt: 'A five-dimensional scoring model for a joke quiz. The joke got funnier the more correct it got.',
    category: 'side projects',
    readTime: '7 min',
  },
  {
    slug: '#',
    date: '2025 · 05',
    title: 'TypeScript conventions I actually enforce',
    excerpt: 'A short, opinionated list. Fewer rules than you\'d think, held more strictly than you\'d like.',
    category: 'engineering',
    readTime: '9 min',
  },
];

export default function WritingPage() {
  const [cmdkOpen, setCmdkOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = '1';
          (e.target as HTMLElement).style.transform = 'none';
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => {
      const elem = el as HTMLElement;
      elem.style.opacity = '0';
      elem.style.transform = 'translateY(14px)';
      elem.style.transition = 'opacity .55s ease, transform .55s ease';
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen(v => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const railItems = [
    { href: '/', label: 'home', active: false },
    { href: '/work', label: 'work', active: false },
    { href: '/writing', label: 'writing', active: true },
    { href: '/experience', label: 'exp', active: false },
    { href: '/#contact', label: 'hi', active: false },
  ];

  return (
    <>
      <LeftRail items={railItems} />

      <main style={{ position: 'relative', zIndex: 2, marginLeft: 'var(--rail-w)' }}>
        <TopNav onCmdK={() => setCmdkOpen(true)} />

        <header style={{ padding: '56px 56px 30px 40px' }}>
          <Link href="/" style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-3)', textDecoration: 'none', transition: 'color .3s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
            ← index
          </Link>
          <h1 style={{ fontWeight: 700, fontSize: '46px', letterSpacing: '-.03em', margin: '16px 0 12px' }}>Writing</h1>
          <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-2)', maxWidth: '40em', margin: 0 }}>
            Notes on systems, reliability, and the occasional side project that got out of hand. Plainly written — no padded intros.
          </p>
        </header>

        {/* featured */}
        <div style={{ padding: '0 56px 30px 40px' }}>
          <a
            data-reveal
            href={FEATURED.slug}
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
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-2)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', font: "500 11px var(--font-mono), monospace", color: 'var(--text-4)', marginBottom: '16px' }}>
              <span style={{ color: 'var(--accent)' }}>LATEST</span>
              <span>{FEATURED.date}</span>
              <span>·</span>
              <span>{FEATURED.category}</span>
              <span>·</span>
              <span>{FEATURED.readTime}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: '30px', lineHeight: 1.15, letterSpacing: '-.02em', marginBottom: '12px', maxWidth: '20em' }}>{FEATURED.title}</div>
            <p style={{ fontSize: '15.5px', lineHeight: 1.65, color: 'var(--text-2)', maxWidth: '46em', margin: '0 0 16px' }}>{FEATURED.excerpt}</p>
            <span style={{ font: "500 12px var(--font-mono), monospace", color: 'var(--accent)' }}>read →</span>
          </a>
        </div>

        {/* archive */}
        <div style={{ padding: '0 56px 80px 40px' }}>
          <div style={{ borderTop: '1px solid var(--border-2)' }}>
            {POSTS.map(p => (
              <a
                key={p.slug + p.title}
                data-reveal
                href={p.slug}
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
                onMouseEnter={e => {
                  e.currentTarget.style.paddingLeft = '16px';
                  e.currentTarget.style.background = '#101114';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.paddingLeft = '4px';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-4)' }}>{p.date}</span>
                <span>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: '20px', letterSpacing: '-.01em', marginBottom: '5px' }}>{p.title}</span>
                  <span style={{ display: 'block', fontSize: '14px', lineHeight: 1.55, color: 'var(--text-2)', maxWidth: '46em' }}>{p.excerpt}</span>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <span style={{ font: "500 10.5px var(--font-mono), monospace", color: 'var(--text-3)' }}>{p.category}</span>
                  <span style={{ font: "500 10.5px var(--font-mono), monospace", color: 'var(--text-4)' }}>{p.readTime}</span>
                </span>
              </a>
            ))}
          </div>
          <div style={{ paddingTop: '26px', font: "500 11px var(--font-mono), monospace", color: 'var(--text-4)' }}>
            // more in the archive — coming as I write them
          </div>
        </div>
      </main>

      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
    </>
  );
}
