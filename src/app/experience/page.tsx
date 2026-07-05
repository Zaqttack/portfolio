'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import LeftRail from '@/components/LeftRail';
import CmdK from '@/components/CmdK';

const WORK_HISTORY = [
  {
    role: 'Software Engineer',
    org: 'SWIVEL',
    period: 'APR 2024 — PRESENT',
    location: 'San Antonio, TX · payments infrastructure',
    accent: true,
    bullets: [
      'Shipped 5+ major product features improving transaction processing and user experience.',
      'Built Google Analytics integration and ADA-compliant component library for compliance and accessibility.',
      'Led a full application rebuild in React, modernizing the frontend architecture from scratch.',
    ],
  },
  {
    role: 'Junior Software Engineer',
    org: 'SWIVEL',
    period: 'AUG 2021 — APR 2024',
    location: 'San Antonio, TX · full-stack',
    accent: false,
    bullets: [
      'Developed and maintained features across a React + Node.js fintech stack.',
      'Worked closely with product and design to ship customer-facing features on tight cycles.',
      'Grew into independent ownership of backend services before promotion.',
    ],
  },
  {
    role: 'Software Engineering Intern',
    org: 'SWBC',
    period: 'MAY 2021 — AUG 2021',
    location: 'San Antonio, TX · financial services',
    accent: false,
    bullets: [
      'Contributed to internal tooling and web application development.',
      'Collaborated with senior engineers on code review and agile sprint workflow.',
    ],
  },
];

const LEADERSHIP = [
  {
    role: 'President — ACM San Antonio',
    period: 'APR 2023 — PRESENT',
    desc: 'Grew the chapter into a monthly rhythm of talks, workshops, and hack nights. Logistics is the leadership.',
  },
  {
    role: 'Board Member — DEV SA',
    period: 'OCT 2024 — PRESENT',
    desc: 'Part of the organizing body for one of SA\'s largest developer communities.',
  },
  {
    role: 'Build Committee — Code:You SA',
    period: 'DEC 2024 — PRESENT',
    desc: 'Helping design curriculum and hands-on workshops for the local tech education program.',
  },
  {
    role: 'Organizer — Dinosaur Jam',
    period: 'ANNUAL',
    desc: 'A month-long, dinosaur-themed game jam. 40+ entries last year and counting.',
  },
];

export default function ExperiencePage() {
  const [activeSection, setActiveSection] = useState<'history' | 'community' | 'education'>('history');
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLSpanElement>(null);

  // Timeline draw-in animation
  useEffect(() => {
    if (!timelineRef.current || !spineRef.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        if (spineRef.current) spineRef.current.style.transform = 'scaleY(1)';
        timelineRef.current?.querySelectorAll('[data-tl]').forEach((node, i) => {
          setTimeout(() => {
            (node as HTMLElement).style.opacity = '1';
            (node as HTMLElement).style.transform = 'none';
          }, 200 + i * 200);
        });
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -18% 0px' });
    obs.observe(timelineRef.current);
    return () => obs.disconnect();
  }, []);

  // Scroll reveals
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

  // Scroll-spy for active section
  useEffect(() => {
    const sectionIds = ['history', 'community', 'education'] as const;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActiveSection(e.target.id as typeof sectionIds[number]);
      });
    }, { rootMargin: '0px 0px -60% 0px' });
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Magnetic button
  const magnetRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = magnetRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.28}px, ${(e.clientY - (r.top + r.height / 2)) * 0.34}px)`;
    };
    const reset = () => { el.style.transform = 'translate(0,0)'; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', reset);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', reset); };
  }, []);

  // ⌘K shortcut
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
    { href: '#history', label: 'history', active: activeSection === 'history' },
    { href: '#community', label: 'community', active: activeSection === 'community' },
    { href: '#education', label: 'education', active: activeSection === 'education' },
    { href: '/', label: '← index', active: false, isBack: true },
  ];

  return (
    <>
      <LeftRail items={railItems} />

      <main style={{ position: 'relative', zIndex: 2, marginLeft: 'var(--rail-w)' }}>
        <TopNav onCmdK={() => setCmdkOpen(true)} />

        <header style={{ padding: '56px 56px 12px 40px' }}>
          <Link href="/" style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-3)', textDecoration: 'none', transition: 'color .3s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
            ← index
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
            <div>
              <h1 style={{ fontWeight: 700, fontSize: '46px', letterSpacing: '-.03em', margin: '0 0 12px' }}>Experience</h1>
              <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-2)', maxWidth: '40em', margin: 0 }}>
                The résumé, on the page. Five years of shipping backend-leaning software — mostly fintech — plus the community work I do on the side.
              </p>
            </div>
            <a
              ref={magnetRef}
              href="https://drive.google.com/file/d/1BaO6_zvsUadRQ8kNX5aBOaWNnBrjAUCs/view"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--accent)',
                color: 'var(--canvas)',
                font: "600 13px var(--font-space), sans-serif",
                textDecoration: 'none',
                padding: '13px 20px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                transition: 'box-shadow .3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,.5)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              Download résumé ↓
            </a>
          </div>
        </header>

        {/* WORK HISTORY */}
        <section id="history" style={{ scrollMarginTop: '20px', padding: '44px 56px 30px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '48px', alignItems: 'start' }}>
            <div style={{ font: "500 11px var(--font-mono), monospace", letterSpacing: '.12em', color: 'var(--accent)' }}>/ WORK HISTORY</div>
            <div ref={timelineRef} style={{ position: 'relative', paddingLeft: '30px' }}>
              <span
                ref={spineRef}
                style={{
                  position: 'absolute',
                  left: '5px',
                  top: '6px',
                  bottom: '6px',
                  width: '1.5px',
                  background: 'linear-gradient(#2C3037,#191B1F)',
                  transform: 'scaleY(0)',
                  transformOrigin: 'top',
                  transition: 'transform 1.1s cubic-bezier(.65,0,.35,1)',
                }}
              />
              {WORK_HISTORY.map((job, i) => (
                <div
                  key={job.role + job.period}
                  data-tl
                  style={{
                    position: 'relative',
                    marginBottom: i < WORK_HISTORY.length - 1 ? '40px' : 0,
                    opacity: 0,
                    transform: 'translateY(12px)',
                    transition: 'opacity .5s ease, transform .5s ease',
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    left: '-30px',
                    top: job.accent ? '3px' : '4px',
                    width: job.accent ? '12px' : '10px',
                    height: job.accent ? '12px' : '10px',
                    borderRadius: '50%',
                    background: job.accent ? 'var(--accent)' : 'var(--canvas)',
                    border: job.accent ? 'none' : '1.5px solid var(--text-4)',
                    boxShadow: '0 0 0 4px var(--canvas)',
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, fontSize: '20px' }}>
                      {job.role} <span style={{ color: 'var(--text-3)' }}>— {job.org}</span>
                    </div>
                    <div style={{ font: "500 11px var(--font-mono), monospace", color: job.accent ? 'var(--accent)' : 'var(--text-4)' }}>{job.period}</div>
                  </div>
                  <div style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-4)', marginBottom: '12px' }}>{job.location}</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '14.5px', lineHeight: 1.7, color: 'var(--text-2)', maxWidth: '48em' }}>
                    {job.bullets.map(b => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEADERSHIP */}
        <section id="community" style={{ scrollMarginTop: '20px', padding: '36px 56px 30px 40px', borderTop: '1px solid var(--border-1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '48px', alignItems: 'start' }}>
            <div style={{ font: "500 11px var(--font-mono), monospace", letterSpacing: '.12em', color: 'var(--accent)' }}>/ LEADERSHIP &amp; COMMUNITY</div>
            <div style={{ borderTop: '1px solid var(--border-2)' }}>
              {LEADERSHIP.map(item => (
                <div
                  key={item.role}
                  data-reveal
                  style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', padding: '22px 0', borderBottom: '1px solid var(--border-1)' }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '17px', marginBottom: '4px' }}>{item.role}</div>
                    <div style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--text-2)', maxWidth: '46em' }}>{item.desc}</div>
                  </div>
                  <div style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-4)', whiteSpace: 'nowrap' }}>{item.period}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" style={{ scrollMarginTop: '20px', padding: '36px 56px 80px 40px', borderTop: '1px solid var(--border-1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: '48px', alignItems: 'start' }}>
            <div style={{ font: "500 11px var(--font-mono), monospace", letterSpacing: '.12em', color: 'var(--accent)' }}>/ EDUCATION</div>
            <div data-reveal>
              <div style={{ fontWeight: 600, fontSize: '17px', marginBottom: '4px' }}>B.S. Computer Science</div>
              <div style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--text-2)' }}>University of Texas at San Antonio</div>
              <div style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-4)', marginTop: '6px' }}>2018 — DEC 2022</div>
            </div>
            <div data-reveal>
              <div style={{ font: "500 10.5px var(--font-mono), monospace", letterSpacing: '.08em', color: 'var(--text-4)', marginBottom: '12px' }}>CERTIFICATIONS</div>
              <div style={{ fontSize: '14px', lineHeight: 1.9, color: '#C7CBD1', fontFamily: "var(--font-mono), monospace" }}>
                AWS Solutions Architect — Assoc.<br />
                AWS Developer — Associate
              </div>
            </div>
          </div>
        </section>
      </main>

      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
    </>
  );
}
