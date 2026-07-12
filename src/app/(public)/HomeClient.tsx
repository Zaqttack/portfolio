'use client';

import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import CmdK from '@/components/CmdK';
import type { HeroVariant } from '@/components/HeroCard';
import HeroCard from '@/components/HeroCard';
import LeftRail from '@/components/LeftRail';
import MobileNav from '@/components/MobileNav';
import TopNav from '@/components/TopNav';
import type {
  Experience,
  InvolvementOrg,
  Post,
  Profile,
  ProfileLink,
  Project,
  SearchResult,
  Skill,
} from '@/types';

const ALL_SECTIONS_BASE = [
  'intro',
  'skills',
  'projects',
  'writing',
  'experience',
  'contact',
] as const;
type Section = (typeof ALL_SECTIONS_BASE)[number];

const RAIL_LABELS: Record<Section, string> = {
  intro: 'intro',
  skills: 'skills',
  projects: 'projects',
  writing: 'writing',
  experience: 'exp',
  contact: 'hi',
};

function applyTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function fmtPeriod(start: string, end: string | null): string {
  const fmt = (d: string) => {
    const [year, month] = d.split('-');
    return `${MONTHS[parseInt(month) - 1]} ${year}`;
  };
  return `${fmt(start)} — ${end ? fmt(end) : 'PRESENT'}`;
}

function fmtPostDate(d: string): string {
  const dt = new Date(d);
  return `${dt.getFullYear()} · ${String(dt.getMonth() + 1).padStart(2, '0')}`;
}

export default function HomeClient({
  profile,
  projects,
  posts,
  experience,
  involvement,
  skills,
  profileLinks,
}: {
  profile: Profile | null;
  projects: Project[];
  posts: Post[];
  experience: Experience[];
  involvement: InvolvementOrg[];
  skills: Skill[];
  profileLinks: ProfileLink[];
}) {
  const openToWork = profile?.open_to_work ?? false;
  const writingEnabled = profile?.writing_enabled ?? true;
  const projectsEnabled = profile?.projects_enabled ?? true;
  const firstName = profile?.name?.split(' ')[0] ?? '';
  const latestRole = experience[0]?.role ?? null;
  const heroLabel =
    [latestRole, profile?.location].filter(Boolean).join(' — ') || 'SOFTWARE ENGINEER';
  const heroTitle = applyTemplate(
    profile?.hero_title ?? "I'm {{first_name}}. I build precise, well-architected software.",
    { first_name: firstName },
  );
  const heroVariant: HeroVariant = (profile?.hero_variant as HeroVariant) ?? 'terminal';

  const ALL_SECTIONS = ALL_SECTIONS_BASE.filter(
    (s) => (s !== 'writing' || writingEnabled) && (s !== 'projects' || projectsEnabled),
  ) as Section[];
  const SECTIONS = ALL_SECTIONS;
  const [activeSection, setActiveSection] = useState<Section>('intro');
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchResult[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // ⌘K keyboard shortcut
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

  // Prefetch search index
  useEffect(() => {
    fetch('/api/search')
      .then((r) => r.json())
      .then((data: SearchResult[]) => setSearchIndex(data))
      .catch(() => {});
  }, []);

  // Cursor glow
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    let tx = window.innerWidth / 2,
      ty = window.innerHeight / 2;
    let cx = tx,
      cy = ty;
    const loop = () => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Scroll-spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id as Section);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

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
      { rootMargin: '0px 0px -12% 0px' },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(14px)';
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Timeline draw-in
  useEffect(() => {
    const section = document.getElementById('experience');
    if (!section) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const spine = document.getElementById('tl-spine');
            if (spine) spine.style.transform = 'scaleY(1)';
            document.querySelectorAll('#timeline [data-tl]').forEach((n, i) => {
              setTimeout(
                () => {
                  (n as HTMLElement).style.opacity = '1';
                  (n as HTMLElement).style.transform = 'none';
                },
                240 + i * 200,
              );
            });
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  // Magnetic buttons
  useEffect(() => {
    const cleanup: Array<() => void> = [];
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const move = (e: Event) => {
        const me = e as MouseEvent;
        const r = (el as HTMLElement).getBoundingClientRect();
        const dx = (me.clientX - (r.left + r.width / 2)) * 0.28;
        const dy = (me.clientY - (r.top + r.height / 2)) * 0.34;
        (el as HTMLElement).style.transform = `translate(${dx}px,${dy}px)`;
      };
      const reset = () => {
        (el as HTMLElement).style.transform = 'translate(0,0)';
      };
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', reset);
      cleanup.push(() => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', reset);
      });
    });
    return () => cleanup.forEach((fn) => fn());
  }, []);

  const railItems = SECTIONS.map((id) => ({
    href: `#${id}`,
    label: RAIL_LABELS[id],
    active: activeSection === id,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    },
  }));

  const resumeUrl = profile?.resume_download_enabled
    ? '/api/resume'
    : (profile?.resume_url ?? null);

  const extraCmds = [
    {
      label: 'Skills',
      kind: 'section' as const,
      hint: 'this page',
      run: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      label: 'Recent projects',
      kind: 'section' as const,
      hint: 'this page',
      run: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      label: 'Contact',
      kind: 'section' as const,
      hint: 'this page',
      run: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
    },
  ];

  const skillsByCategory = Object.entries(
    skills.reduce<Record<string, string[]>>((acc, s) => {
      const cat = (s.category ?? 'OTHER').toUpperCase();
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s.name);
      return acc;
    }, {}),
  );
  // Home preview: first 3 skill names total (flat), no category grouping
  const previewSkillNames = skills.slice(0, 3).map((s) => s.name);

  return (
    <>
      {/* Cursor glow */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
          background: 'radial-gradient(circle, rgba(236,106,44,0.06), rgba(236,106,44,0) 60%)',
          transform: 'translate(-50%,-50%)',
          willChange: 'transform',
        }}
      />

      <MobileNav
        name={profile?.name}
        railItems={railItems}
        openToWork={openToWork}
        locationShort={profile?.location ?? null}
        writingEnabled={writingEnabled}
        projectsEnabled={projectsEnabled}
        resumeUrl={resumeUrl}
        onCmdK={() => setCmdkOpen(true)}
      />

      <LeftRail
        items={railItems}
        openToWork={openToWork}
        locationShort={profile?.location ?? null}
        name={profile?.name}
      />

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

        {/* HERO */}
        <section
          id="intro"
          data-section
          style={{
            scrollMarginTop: 0,
            display: 'grid',
            gridTemplateColumns: '1.15fr .85fr',
            gap: '52px',
            alignItems: 'center',
            minHeight: 'calc(100vh - 92px)',
            padding: '36px 56px 64px 40px',
          }}
        >
          <div>
            <div
              style={{
                font: '500 11px var(--font-mono), monospace',
                letterSpacing: '.14em',
                color: 'var(--text-meta)',
                marginBottom: '26px',
              }}
            >
              {heroLabel}
            </div>
            <h1
              style={
                {
                  fontWeight: 700,
                  fontSize: '54px',
                  lineHeight: 1.04,
                  letterSpacing: '-.03em',
                  margin: '0 0 22px',
                  textWrap: 'balance',
                } as React.CSSProperties
              }
            >
              {heroTitle}
            </h1>
            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.65,
                color: 'var(--text-body)',
                maxWidth: '33em',
                margin: '0 0 32px',
              }}
            >
              {profile?.bio ??
                'Full-stack, backend-leaning — fintech and cloud infrastructure by trade. Clean TypeScript, boring reliability, systems that hold up. I also run a month-long dinosaur game jam, because someone has to.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                data-magnetic
                href="/projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  font: '600 13px var(--font-space), sans-serif',
                  textDecoration: 'none',
                  padding: '13px 20px',
                  borderRadius: '8px',
                  transition: 'transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,.5)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                View work <ArrowUpRight size={14} />
              </Link>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-body)',
                  font: '600 13px var(--font-space), sans-serif',
                  textDecoration: 'none',
                  padding: '13px 6px',
                  transition: 'color .3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-body)')}
              >
                Get in touch
              </a>
            </div>
            {profile?.tagline &&
              (!profile.now_expires_at || new Date(profile.now_expires_at) > new Date()) && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '10px',
                    marginTop: '26px',
                    paddingTop: '22px',
                    borderTop: '1px solid var(--border-1)',
                    font: '500 11.5px var(--font-mono), monospace',
                    maxWidth: '36em',
                  }}
                >
                  <span style={{ color: 'var(--accent)', whiteSpace: 'nowrap' }}>// now</span>
                  <span style={{ color: 'var(--text-body)', lineHeight: 1.65 }}>
                    {profile.tagline}
                  </span>
                </div>
              )}
          </div>

          {/* Hero card (configurable variant) */}
          <HeroCard
            variant={heroVariant}
            name={profile?.name ?? firstName}
            firstName={firstName}
            role={latestRole}
            openToWork={openToWork}
            terminalStatus={profile?.terminal_status ?? null}
            nowBlurb={profile?.tagline ?? null}
            projects={projects}
            skills={skills}
            avatarUrl={profile?.avatar_url ?? null}
            avatarEnabled={profile?.avatar_enabled ?? false}
          />
        </section>

        {/* SKILLS — preview (3 categories) */}
        <section
          id="skills"
          data-section
          style={{
            scrollMarginTop: '20px',
            padding: '80px 56px 80px 40px',
            borderTop: '1px solid var(--border-1)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            <div>
              <div
                style={{
                  font: '500 11px var(--font-mono), monospace',
                  letterSpacing: '.12em',
                  color: 'var(--accent)',
                }}
              >
                01 / SKILLS
              </div>
              {(profile?.skills_subtitle ?? 'what I reach for, day to day.') && (
                <div
                  style={{
                    font: '500 10.5px var(--font-mono), monospace',
                    color: 'var(--text-meta-2)',
                    marginTop: '10px',
                    lineHeight: 1.6,
                  }}
                >
                  {profile?.skills_subtitle ?? 'what I reach for, day to day.'}
                </div>
              )}
            </div>
            <div style={{ borderTop: '1px solid var(--border-2)' }}>
              {skills.length === 0 && (
                <p style={{ padding: '15px 0', color: 'var(--text-meta)', fontSize: '14px' }}>
                  No skills listed yet.
                </p>
              )}
              {previewSkillNames.length > 0 && (
                <div
                  data-reveal
                  style={{
                    padding: '15px 0',
                    borderBottom: '1px solid var(--border-1)',
                    font: '500 13px var(--font-mono), monospace',
                    color: 'var(--text-strong)',
                  }}
                >
                  {previewSkillNames.join(' · ')}
                </div>
              )}
              {skills.length > 0 && (
                <div style={{ paddingTop: '14px' }}>
                  <Link
                    href="/experience#skills"
                    style={{
                      font: '500 12px var(--font-mono), monospace',
                      color: 'var(--text-body)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-body)')}
                  >
                    → full breakdown on Experience <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RECENT PROJECTS */}
        {projectsEnabled && (
          <section
            id="projects"
            data-section
            style={{
              scrollMarginTop: '20px',
              padding: '80px 56px 80px 40px',
              borderTop: '1px solid var(--border-1)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: '48px',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  font: '500 11px var(--font-mono), monospace',
                  letterSpacing: '.12em',
                  color: 'var(--accent)',
                }}
              >
                02 / RECENT PROJECTS
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '6px',
                  }}
                >
                  <h2
                    style={{
                      fontWeight: 600,
                      fontSize: '26px',
                      letterSpacing: '-.02em',
                      margin: 0,
                    }}
                  >
                    Latest projects
                  </h2>
                  <Link
                    href="/projects"
                    style={{
                      font: '500 12px var(--font-mono), monospace',
                      color: 'var(--text-body)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-body)')}
                  >
                    view all <ArrowRight size={12} />
                  </Link>
                </div>
                <div style={{ borderTop: '1px solid var(--border-2)', marginTop: '16px' }}>
                  {projects.length === 0 && (
                    <p style={{ padding: '24px 4px', color: 'var(--text-meta)', fontSize: '14px' }}>
                      No projects yet.
                    </p>
                  )}
                  {projects.slice(0, 2).map((p, i) => (
                    <Link
                      key={p.id}
                      href="/projects"
                      className="list-row"
                      style={{
                        gridTemplateColumns: '44px 1fr auto',
                        gap: '22px',
                        alignItems: 'baseline',
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: '24px 4px',
                        borderBottom: '1px solid var(--border-1)',
                        transition: 'padding .35s cubic-bezier(.34,1.56,.64,1), background .3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.paddingLeft = '16px';
                        e.currentTarget.style.background = 'var(--bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.paddingLeft = '4px';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span
                        className="list-row-meta"
                        style={{
                          font: '500 12px var(--font-mono), monospace',
                          color: 'var(--text-meta-2)',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span
                          style={{
                            display: 'block',
                            fontWeight: 600,
                            fontSize: '22px',
                            letterSpacing: '-.01em',
                            marginBottom: '6px',
                          }}
                        >
                          {p.title}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '14.5px',
                            lineHeight: 1.55,
                            color: 'var(--text-body)',
                            maxWidth: '44em',
                          }}
                        >
                          {p.summary}
                        </span>
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '8px',
                          textAlign: 'right',
                        }}
                      >
                        <span
                          style={{
                            font: '500 11px var(--font-mono), monospace',
                            color: 'var(--text-meta-2)',
                          }}
                        >
                          {`'${new Date(p.created_at).getFullYear().toString().slice(2)}`}
                        </span>
                        <span
                          style={{
                            font: '500 10.5px var(--font-mono), monospace',
                            color: 'var(--text-meta)',
                          }}
                        >
                          {p.tags.filter((t) => t !== 'product' && t !== 'side').join(' · ')}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* RECENT WRITING */}
        {writingEnabled && (
          <section
            id="writing"
            data-section
            style={{
              scrollMarginTop: '20px',
              padding: '80px 56px 80px 40px',
              borderTop: '1px solid var(--border-1)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: '48px',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  font: '500 11px var(--font-mono), monospace',
                  letterSpacing: '.12em',
                  color: 'var(--accent)',
                }}
              >
                03 / WRITING
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '6px',
                  }}
                >
                  <h2
                    style={{
                      fontWeight: 600,
                      fontSize: '26px',
                      letterSpacing: '-.02em',
                      margin: 0,
                    }}
                  >
                    Latest writing
                  </h2>
                  <Link
                    href="/writing"
                    style={{
                      font: '500 12px var(--font-mono), monospace',
                      color: 'var(--text-body)',
                      textDecoration: 'none',
                      transition: 'color .3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-body)')}
                  >
                    all writing <ArrowRight size={12} />
                  </Link>
                </div>
                <div style={{ borderTop: '1px solid var(--border-2)', marginTop: '16px' }}>
                  {posts.length === 0 && (
                    <p style={{ padding: '24px 4px', color: 'var(--text-meta)', fontSize: '14px' }}>
                      No posts yet.
                    </p>
                  )}
                  {posts.slice(0, 2).map((p) => (
                    <Link
                      key={p.id}
                      href="/writing"
                      className="list-row"
                      style={{
                        gridTemplateColumns: '110px 1fr',
                        gap: '22px',
                        alignItems: 'baseline',
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: '24px 4px',
                        borderBottom: '1px solid var(--border-1)',
                        transition: 'padding .35s cubic-bezier(.34,1.56,.64,1), background .3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.paddingLeft = '16px';
                        e.currentTarget.style.background = 'var(--bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.paddingLeft = '4px';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span
                        className="list-row-meta"
                        style={{
                          font: '500 11px var(--font-mono), monospace',
                          color: 'var(--text-meta-2)',
                        }}
                      >
                        {p.published_at ? fmtPostDate(p.published_at) : ''}
                      </span>
                      <span>
                        <span
                          style={{
                            display: 'block',
                            fontWeight: 600,
                            fontSize: '19px',
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
                            color: 'var(--text-body)',
                            maxWidth: '44em',
                          }}
                        >
                          {p.excerpt}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCE TEASER */}
        <section
          id="experience"
          data-section
          style={{
            scrollMarginTop: '20px',
            padding: '80px 56px 90px 40px',
            borderTop: '1px solid var(--border-1)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            <div
              style={{
                font: '500 11px var(--font-mono), monospace',
                letterSpacing: '.12em',
                color: 'var(--accent)',
              }}
            >
              04 / EXPERIENCE
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '34px',
                }}
              >
                <h2
                  style={{ fontWeight: 600, fontSize: '26px', letterSpacing: '-.02em', margin: 0 }}
                >
                  Where I've worked
                </h2>
                <Link
                  href="/experience"
                  style={{
                    font: '500 12px var(--font-mono), monospace',
                    color: 'var(--text-body)',
                    textDecoration: 'none',
                    transition: 'color .3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-body)')}
                >
                  full history <ArrowRight size={12} />
                </Link>
              </div>
              <div id="timeline" style={{ position: 'relative', paddingLeft: '30px' }}>
                <span
                  id="tl-spine"
                  style={{
                    position: 'absolute',
                    left: '5px',
                    top: '6px',
                    bottom: '6px',
                    width: '1.5px',
                    background: 'linear-gradient(var(--border-3),var(--border-1))',
                    transform: 'scaleY(0)',
                    transformOrigin: 'top',
                    transition: 'transform 1s cubic-bezier(.65,0,.35,1)',
                  }}
                />
                {[
                  ...experience.slice(0, 2).map((e, i) => ({
                    id: e.id,
                    role: e.role,
                    company: e.company,
                    dates: fmtPeriod(e.start_date, e.end_date),
                    desc:
                      (e.experience_bullets ?? []).find((b) => b.visibility === 'public')?.text ??
                      '',
                    accent: i === 0,
                  })),
                  ...involvement.slice(0, 1).map((org) => {
                    const r = org.involvement_roles?.[0];
                    return {
                      id: org.id,
                      role: r?.role ?? org.name,
                      company: org.name,
                      dates: r ? fmtPeriod(r.start_date, r.end_date) : '',
                      desc: org.description ?? '',
                      accent: false,
                    };
                  }),
                ].map((item, i) => (
                  <div
                    key={item.id}
                    data-tl
                    style={{
                      position: 'relative',
                      marginBottom: '32px',
                      opacity: 0,
                      transform: 'translateY(12px)',
                      transition: 'opacity .5s ease, transform .5s ease',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: i === 0 ? '-30px' : '-29px',
                        top: i === 0 ? '3px' : '4px',
                        width: i === 0 ? '12px' : '10px',
                        height: i === 0 ? '12px' : '10px',
                        borderRadius: '50%',
                        background: i === 0 ? 'var(--accent)' : 'var(--bg)',
                        border: i === 0 ? 'none' : '1.5px solid var(--text-meta-2)',
                        boxShadow: '0 0 0 4px var(--bg)',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        flexWrap: 'wrap',
                        gap: '6px',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '19px' }}>
                        {item.role} —{' '}
                        <span style={{ color: 'var(--text-body)' }}>{item.company}</span>
                      </div>
                      <div
                        style={{
                          font: '500 11px var(--font-mono), monospace',
                          color: i === 0 ? 'var(--accent)' : 'var(--text-meta-2)',
                        }}
                      >
                        {item.dates}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '14.5px',
                        lineHeight: 1.6,
                        color: 'var(--text-body)',
                        maxWidth: '44em',
                        marginTop: '6px',
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          data-section
          style={{
            scrollMarginTop: '20px',
            padding: '96px 56px 40px 40px',
            borderTop: '1px solid var(--border-1)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            <div
              style={{
                font: '500 11px var(--font-mono), monospace',
                letterSpacing: '.12em',
                color: 'var(--accent)',
              }}
            >
              05 / CONTACT
            </div>
            <div>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: '40px',
                  lineHeight: 1.06,
                  letterSpacing: '-.03em',
                  margin: '0 0 28px',
                  maxWidth: '15em',
                }}
              >
                {profile?.contact_cta ??
                  "Let's build something — or just come argue about type systems at a meetup."}
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '11px',
                  alignItems: 'center',
                  marginBottom: '80px',
                }}
              >
                {profile?.email && (
                  <a
                    data-magnetic
                    href={`mailto:${profile.email}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '9px',
                      background: 'var(--accent)',
                      color: 'var(--bg)',
                      font: '600 14px var(--font-space), sans-serif',
                      textDecoration: 'none',
                      padding: '14px 22px',
                      borderRadius: '9px',
                      transition: 'transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .3s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow = '0 16px 34px rgba(0,0,0,.5)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    {profile.email}
                  </a>
                )}
                {(profile?.resume_download_enabled || profile?.resume_url) &&
                  (() => {
                    const href = profile?.resume_download_enabled
                      ? '/api/resume'
                      : profile!.resume_url!;
                    const isDownload = profile?.resume_download_enabled;
                    return (
                      <a
                        href={href}
                        {...(isDownload
                          ? { download: true }
                          : { target: '_blank', rel: 'noopener noreferrer' })}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          font: '500 12px var(--font-mono), monospace',
                          color: 'var(--text)',
                          textDecoration: 'none',
                          padding: '13px 17px',
                          border: '1px solid var(--border-3)',
                          borderRadius: '9px',
                          transition:
                            'transform .3s cubic-bezier(.34,1.56,.64,1), border-color .3s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.borderColor = 'var(--text-meta-2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'var(--border-3)';
                        }}
                      >
                        Resume <ArrowDown size={13} />
                      </a>
                    );
                  })()}
                {profileLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      font: '500 12px var(--font-mono), monospace',
                      color: 'var(--text)',
                      textDecoration: 'none',
                      padding: '13px 17px',
                      border: '1px solid var(--border-3)',
                      borderRadius: '9px',
                      transition: 'transform .3s cubic-bezier(.34,1.56,.64,1), border-color .3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = 'var(--text-meta-2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-3)';
                    }}
                  >
                    {link.label} <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
              <div
                style={{
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  font: '500 10.5px var(--font-mono), monospace',
                  color: 'var(--text-meta-2)',
                }}
              >
                <span>
                  © {new Date().getFullYear()}{' '}
                  {process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'zaquariah.dev'}
                </span>
                <span>{profile?.footer_tagline ?? 'built to show you who I am'}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CmdK
        open={cmdkOpen}
        onClose={() => setCmdkOpen(false)}
        extraCmds={extraCmds}
        profileLinks={profileLinks}
        resumeUrl={resumeUrl}
        writingEnabled={writingEnabled}
        projectsEnabled={projectsEnabled}
        searchIndex={searchIndex}
      />
    </>
  );
}
