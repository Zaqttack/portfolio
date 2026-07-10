'use client';

import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import CmdK from '@/components/CmdK';
import Footer from '@/components/Footer';
import LeftRail from '@/components/LeftRail';
import TopNav from '@/components/TopNav';
import type {
  Achievement,
  Certification,
  Education,
  Experience,
  InvolvementOrg,
  Profile,
  ProfileLink,
} from '@/types';

type CompanyGroup = {
  key: string;
  companyName: string;
  logoUrl: string | null;
  earliest: string;
  latest: string | null;
  roles: Experience[];
};

function buildGroups(jobs: Experience[]): CompanyGroup[] {
  const seen = new Map<string, CompanyGroup>();
  const order: string[] = [];
  for (const job of jobs) {
    const key = job.company_id ?? `__${job.company ?? job.id}`;
    if (!seen.has(key)) {
      seen.set(key, {
        key,
        companyName: job.company_data?.name ?? job.company ?? '',
        logoUrl: job.company_data?.logo_url ?? null,
        earliest: job.start_date,
        latest: job.end_date,
        roles: [],
      });
      order.push(key);
    }
    const g = seen.get(key)!;
    g.roles.push(job);
    if (job.start_date < g.earliest) g.earliest = job.start_date;
    if (job.end_date === null) {
      g.latest = null;
    } else if (g.latest !== null && job.end_date > g.latest) {
      g.latest = job.end_date;
    }
  }
  return order.map((k) => seen.get(k)!);
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function fmtDate(d: string): string {
  const [year, month] = d.split('-');
  return `${MONTHS[parseInt(month) - 1]} ${year}`;
}

function fmtPeriod(start: string, end: string | null): string {
  return `${fmtDate(start)} — ${end ? fmtDate(end) : 'PRESENT'}`;
}

export default function ExperienceClient({
  experience,
  involvement,
  profile,
  education,
  certifications,
  achievements,
  profileLinks,
  subtitle,
  writingEnabled,
  projectsEnabled,
  siteDomain,
  locationShort,
}: {
  experience: Experience[];
  involvement: InvolvementOrg[];
  profile: Profile | null;
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  profileLinks: ProfileLink[];
  subtitle: string | null;
  writingEnabled: boolean;
  projectsEnabled: boolean;
  siteDomain: string | null;
  locationShort: string | null;
}) {
  const [activeSection, setActiveSection] = useState<
    'history' | 'community' | 'education' | 'awards'
  >('history');
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLSpanElement>(null);

  // Timeline draw-in animation
  useEffect(() => {
    if (!timelineRef.current || !spineRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          if (spineRef.current) spineRef.current.style.transform = 'scaleY(1)';
          timelineRef.current?.querySelectorAll('[data-tl]').forEach((node, i) => {
            setTimeout(
              () => {
                (node as HTMLElement).style.opacity = '1';
                (node as HTMLElement).style.transform = 'none';
              },
              200 + i * 200,
            );
          });
          obs.unobserve(e.target);
        });
      },
      { rootMargin: '0px 0px -18% 0px' },
    );
    obs.observe(timelineRef.current);
    return () => obs.disconnect();
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

  // Scroll-spy for active section
  useEffect(() => {
    const sectionIds = ['history', 'community', 'education', 'awards'] as const;
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

  // Magnetic button
  const magnetRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = magnetRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.28}px, ${(e.clientY - (r.top + r.height / 2)) * 0.34}px)`;
    };
    const reset = () => {
      el.style.transform = 'translate(0,0)';
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', reset);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', reset);
    };
  }, []);

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
    { href: '#history', label: 'history', active: activeSection === 'history' },
    { href: '#community', label: 'community', active: activeSection === 'community' },
    { href: '#education', label: 'education', active: activeSection === 'education' },
    { href: '#awards', label: 'awards', active: activeSection === 'awards' },
    { href: '/', label: '← home', active: false, isBack: true },
  ];

  return (
    <>
      <LeftRail items={railItems} locationShort={locationShort} name={profile?.name} />

      <main style={{ position: 'relative', zIndex: 2, marginLeft: 'var(--rail-w)' }}>
        <TopNav
          onCmdK={() => setCmdkOpen(true)}
          writingEnabled={writingEnabled}
          projectsEnabled={projectsEnabled}
          siteDomain={siteDomain}
          resumeUrl={
            profile?.resume_download_enabled ? '/api/resume' : (profile?.resume_url ?? null)
          }
        />

        <header style={{ padding: '56px 56px 12px 40px' }}>
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '16px',
              marginTop: '16px',
            }}
          >
            <div>
              <h1
                style={{
                  fontWeight: 700,
                  fontSize: '46px',
                  letterSpacing: '-.03em',
                  margin: '0 0 12px',
                }}
              >
                Experience
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
            </div>
            {(profile?.resume_download_enabled || profile?.resume_url) &&
              (() => {
                const href = profile?.resume_download_enabled
                  ? '/api/resume'
                  : profile!.resume_url!;
                const isDownload = profile?.resume_download_enabled;
                return (
                  <a
                    ref={magnetRef}
                    href={href}
                    {...(isDownload
                      ? { download: true }
                      : { target: '_blank', rel: 'noopener noreferrer' })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--accent)',
                      color: 'var(--canvas)',
                      font: '600 13px var(--font-space), sans-serif',
                      textDecoration: 'none',
                      padding: '13px 20px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      transition: 'box-shadow .3s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,.5)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    Download resume <Download size={13} />
                  </a>
                );
              })()}
          </div>
        </header>

        {/* WORK HISTORY */}
        <section id="history" style={{ scrollMarginTop: '20px', padding: '44px 56px 30px 40px' }}>
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
              / WORK HISTORY
            </div>
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
              {experience.length === 0 && (
                <p style={{ color: 'var(--text-3)', fontSize: '14px', marginTop: '20px' }}>
                  No work history yet.
                </p>
              )}
              {(() => {
                const groups = buildGroups(experience);
                return groups.map((group, gi) => {
                  const accent = gi === 0;
                  return (
                    <div
                      key={group.key}
                      data-tl
                      style={{
                        position: 'relative',
                        marginBottom: gi < groups.length - 1 ? '48px' : 0,
                        opacity: 0,
                        transform: 'translateY(12px)',
                        transition: 'opacity .5s ease, transform .5s ease',
                      }}
                    >
                      {/* Company dot on the spine */}
                      <span
                        style={{
                          position: 'absolute',
                          left: '-30px',
                          top: accent ? '3px' : '5px',
                          width: accent ? '12px' : '10px',
                          height: accent ? '12px' : '10px',
                          borderRadius: '50%',
                          background: accent ? 'var(--accent)' : 'var(--canvas)',
                          border: accent ? 'none' : '1.5px solid var(--text-4)',
                          boxShadow: '0 0 0 4px var(--canvas)',
                        }}
                      />

                      {/* Company header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '18px',
                        }}
                      >
                        {group.logoUrl && (
                          <img
                            src={group.logoUrl}
                            alt={group.companyName}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '7px',
                              objectFit: 'cover',
                              border: '1px solid var(--border-2)',
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '20px',
                              letterSpacing: '-.01em',
                            }}
                          >
                            {group.companyName}
                          </div>
                          <div
                            style={{
                              font: '500 11px var(--font-mono), monospace',
                              color: accent ? 'var(--accent)' : 'var(--text-4)',
                              marginTop: '2px',
                            }}
                          >
                            {fmtPeriod(group.earliest, group.latest)}
                          </div>
                        </div>
                      </div>

                      {/* Nested roles */}
                      <div style={{ paddingLeft: '24px' }}>
                        {group.roles.map((role, ri) => {
                          const bullets = (role.experience_bullets ?? []).filter(
                            (b) => b.visibility === 'public',
                          );
                          return (
                            <div
                              key={role.id}
                              style={{
                                position: 'relative',
                                paddingBottom: ri < group.roles.length - 1 ? '22px' : 0,
                              }}
                            >
                              {/* Role dot */}
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '-16px',
                                  top: '6px',
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: 'var(--canvas)',
                                  border: '1.5px solid var(--text-4)',
                                  boxShadow: '0 0 0 3px var(--canvas)',
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
                                <div style={{ fontWeight: 600, fontSize: '16px' }}>{role.role}</div>
                                <div
                                  style={{
                                    font: '500 11px var(--font-mono), monospace',
                                    color: 'var(--text-4)',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {fmtPeriod(role.start_date, role.end_date)}
                                </div>
                              </div>
                              {role.location && (
                                <div
                                  style={{
                                    font: '500 11px var(--font-mono), monospace',
                                    color: 'var(--text-4)',
                                    marginTop: '2px',
                                    marginBottom: bullets.length > 0 ? '8px' : 0,
                                  }}
                                >
                                  {role.location}
                                </div>
                              )}
                              {bullets.length > 0 && (
                                <ul
                                  style={{
                                    margin: role.location ? 0 : '8px 0 0',
                                    paddingLeft: '18px',
                                    fontSize: '14px',
                                    lineHeight: 1.7,
                                    color: 'var(--text-2)',
                                    maxWidth: '48em',
                                  }}
                                >
                                  {bullets.map((b) => (
                                    <li key={b.id}>{b.text}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </section>

        {/* LEADERSHIP */}
        <section
          id="community"
          style={{
            scrollMarginTop: '20px',
            padding: '36px 56px 30px 40px',
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
              / LEADERSHIP &amp; COMMUNITY
            </div>
            <div style={{ borderTop: '1px solid var(--border-2)' }}>
              {involvement.length === 0 && (
                <p style={{ padding: '22px 0', color: 'var(--text-3)', fontSize: '14px' }}>
                  No community involvement yet.
                </p>
              )}
              {involvement.map((org) => {
                const roles = org.involvement_roles ?? [];
                const earliest = roles.reduce(
                  (min, r) => (!min || r.start_date < min ? r.start_date : min),
                  null as string | null,
                );
                const latest = roles.reduce<string | null>(
                  (max, r) =>
                    !r.end_date ? null : max === null ? null : r.end_date > max ? r.end_date : max,
                  roles[0]?.end_date ?? null,
                );
                return (
                  <div
                    key={org.id}
                    data-reveal
                    style={{
                      padding: '22px 0',
                      borderBottom: '1px solid var(--border-1)',
                    }}
                  >
                    {/* Org header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: roles.length > 0 ? '14px' : 0,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {org.logo && (
                          <img
                            src={org.logo}
                            alt={org.name}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              objectFit: 'cover',
                              border: '1px solid var(--border-2)',
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-.01em' }}>
                          {org.name}
                        </div>
                      </div>
                      {earliest && (
                        <div
                          style={{
                            font: '500 11px var(--font-mono), monospace',
                            color: 'var(--text-4)',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {fmtPeriod(earliest, latest === undefined ? null : latest)}
                        </div>
                      )}
                    </div>

                    {/* Roles */}
                    {roles.map((role, ri) => {
                      const bullets = role.highlights ?? [];
                      return (
                        <div
                          key={role.id}
                          style={{
                            paddingLeft: '16px',
                            paddingBottom: ri < roles.length - 1 ? '16px' : 0,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              gap: '16px',
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: '15px' }}>{role.role}</div>
                            <div
                              style={{
                                font: '500 11px var(--font-mono), monospace',
                                color: 'var(--text-4)',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                              }}
                            >
                              {fmtPeriod(role.start_date, role.end_date)}
                            </div>
                          </div>
                          {bullets.length > 0 && (
                            <ul
                              style={{
                                margin: '6px 0 0',
                                paddingLeft: '18px',
                                fontSize: '14px',
                                lineHeight: 1.7,
                                color: 'var(--text-2)',
                                maxWidth: '46em',
                              }}
                            >
                              {bullets.map((b, bi) => (
                                <li key={bi}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}

                    {/* Fallback description if no roles */}
                    {roles.length === 0 && org.description && (
                      <div
                        style={{
                          fontSize: '14px',
                          lineHeight: 1.55,
                          color: 'var(--text-2)',
                          maxWidth: '46em',
                        }}
                      >
                        {org.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section
          id="education"
          style={{
            scrollMarginTop: '20px',
            padding: '36px 56px 80px 40px',
            borderTop: '1px solid var(--border-1)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr 1fr',
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
              / EDUCATION
            </div>
            <div data-reveal>
              {education.length === 0 && (
                <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>
                  No education entries yet.
                </p>
              )}
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '20px' }}>
                  <div style={{ fontWeight: 600, fontSize: '17px', marginBottom: '4px' }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--text-2)' }}>
                    {edu.institution}
                  </div>
                  <div
                    style={{
                      font: '500 11px var(--font-mono), monospace',
                      color: 'var(--text-4)',
                      marginTop: '6px',
                    }}
                  >
                    {edu.start_year}
                    {edu.end_year ? ` — ${edu.end_year}` : ' — PRESENT'}
                  </div>
                </div>
              ))}
            </div>
            {certifications.length > 0 && (
              <div data-reveal>
                <div
                  style={{
                    font: '500 10.5px var(--font-mono), monospace',
                    letterSpacing: '.08em',
                    color: 'var(--text-4)',
                    marginBottom: '12px',
                  }}
                >
                  CERTIFICATIONS
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.9,
                    color: '#C7CBD1',
                    fontFamily: 'var(--font-mono), monospace',
                  }}
                >
                  {certifications.map((c) => (
                    <div key={c.id}>{c.name}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* AWARDS & ACHIEVEMENTS */}
        <section
          id="awards"
          style={{
            scrollMarginTop: '20px',
            padding: '36px 56px 80px 40px',
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
              / AWARDS &amp; ACHIEVEMENTS
            </div>
            <div style={{ borderTop: '1px solid var(--border-2)' }}>
              {achievements.length === 0 && (
                <p style={{ padding: '22px 0', color: 'var(--text-3)', fontSize: '14px' }}>
                  No awards yet.
                </p>
              )}
              {achievements.map((award) => (
                <div
                  key={award.id}
                  data-reveal
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '20px',
                    padding: '22px 0',
                    borderBottom: '1px solid var(--border-1)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '17px', marginBottom: '4px' }}>
                      {award.evidence_url ? (
                        <a
                          href={award.evidence_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'inherit',
                            textDecoration: 'none',
                            transition: 'color .3s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                        >
                          {award.title} <ArrowUpRight size={13} />
                        </a>
                      ) : (
                        award.title
                      )}
                    </div>
                    {award.description && (
                      <div style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--text-2)' }}>
                        {award.description}
                      </div>
                    )}
                  </div>
                  {award.date && (
                    <div
                      style={{
                        font: '500 11px var(--font-mono), monospace',
                        color: 'var(--text-4)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {award.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer profileLinks={profileLinks} siteDomain={siteDomain} />
      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
    </>
  );
}
