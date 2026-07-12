'use client';

import { useEffect, useRef } from 'react';
import type { Project, Skill } from '@/types';

export type HeroVariant = 'terminal' | 'email' | 'chat' | 'notecard' | 'playground';

interface HeroCardProps {
  variant: HeroVariant;
  name: string;
  firstName: string;
  role: string | null;
  openToWork: boolean;
  terminalStatus: string | null;
  nowBlurb: string | null;
  projects: Project[];
  skills: Skill[];
  avatarUrl: string | null;
  avatarEnabled: boolean;
}

function Avatar({ url, name }: { url: string; name: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: '22px',
        width: '84px',
        height: '84px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 0 0 4px var(--bg), 0 8px 22px rgba(0,0,0,.5)',
        background: 'var(--border-2)',
        flexShrink: 0,
      }}
    >
      <img src={url} alt={name} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
    </div>
  );
}

/* ── Terminal ──────────────────────────────────────────────────────────────── */
function TerminalCard({
  firstName,
  role,
  openToWork,
  terminalStatus,
  projects,
  skills,
  avatarUrl,
  avatarEnabled,
  name,
}: HeroCardProps) {
  const termRef = useRef<HTMLDivElement>(null);

  const statusText = openToWork ? 'open to work ✓' : (terminalStatus ?? 'heads-down · building ◆');
  const accent = 'var(--accent)';
  const txt = 'var(--text-strong)';
  const dim = 'var(--text-meta-2)';

  useEffect(() => {
    const out = termRef.current;
    if (!out) return;
    out.innerHTML = '';

    const projSlugs = projects
      .slice(0, 3)
      .map((p) =>
        p.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .slice(0, 14),
      )
      .join('  ');
    const projMore = projects.length > 3 ? `  (+${projects.length - 3})` : '';
    const stackLine = skills
      .slice(0, 6)
      .map((s) => s.name.toLowerCase())
      .join('  ');

    type SeqItem = {
      t: string;
      color?: string;
      prompt?: true;
      pre?: string;
      chunk?: true;
    };

    const seq: SeqItem[] = [
      { t: 'whoami', prompt: true },
      { t: `\n${firstName.toLowerCase()}${role ? ` — ${role.toLowerCase()}` : ''}\n`, color: txt },
      { t: 'status', prompt: true, pre: '\n' },
      { t: `\n${statusText}\n`, color: txt, chunk: true },
      ...(projects.length > 0
        ? ([
            { t: 'ls ./projects', prompt: true, pre: '\n' },
            {
              t: `\n${projects.length} ${projects.length === 1 ? 'project' : 'projects'}  `,
              color: dim,
            },
            { t: projSlugs, color: txt, chunk: true },
            ...(projMore ? [{ t: projMore, color: dim, chunk: true }] : []),
            { t: '\n', color: txt, chunk: true },
          ] as SeqItem[])
        : []),
      ...(stackLine
        ? ([
            { t: 'stack', prompt: true, pre: '\n' },
            { t: `\n${stackLine}\n`, color: txt },
          ] as SeqItem[])
        : []),
    ];

    let si = 0;
    let tt: ReturnType<typeof setTimeout>;

    const promptSpan = () => {
      const s = document.createElement('span');
      s.style.color = accent;
      s.textContent = '➜ ~ ';
      out.appendChild(s);
    };

    const typeStr = (str: string, color: string, done: () => void) => {
      const span = document.createElement('span');
      span.style.color = color;
      out.appendChild(span);
      let i = 0;
      const step = () => {
        span.textContent += str[i++];
        if (i < str.length) tt = setTimeout(step, 24 + Math.random() * 26);
        else tt = setTimeout(done, 260);
      };
      step();
    };

    const run = () => {
      if (si >= seq.length) return;
      const item = seq[si++];
      if (item.pre) out.appendChild(document.createTextNode(item.pre));
      if (item.chunk) {
        const s = document.createElement('span');
        s.style.color = item.color ?? txt;
        s.textContent = item.t;
        out.appendChild(s);
        tt = setTimeout(run, 80);
        return;
      }
      if (item.prompt) {
        promptSpan();
        typeStr(item.t, txt, run);
      } else {
        const s = document.createElement('span');
        s.style.color = item.color ?? txt;
        s.textContent = item.t;
        out.appendChild(s);
        tt = setTimeout(run, 200);
      }
    };

    tt = setTimeout(run, 550);
    return () => clearTimeout(tt);
  }, [firstName, role, statusText, projects, skills]);

  return (
    <div style={{ position: 'relative', paddingTop: '34px' }}>
      <div
        style={{
          border: '1px solid var(--border-2)',
          borderRadius: '11px',
          overflow: 'hidden',
          background: 'var(--bg-panel)',
          boxShadow: '0 24px 60px rgba(0,0,0,.5)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 12px',
            borderBottom: '1px solid var(--border-1)',
            background: 'var(--bg-panel-2)',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--border-3)',
              }}
            />
          ))}
          <span
            style={{
              marginLeft: '6px',
              font: '500 9.5px var(--font-mono), monospace',
              color: 'var(--text-meta-2)',
            }}
          >
            {firstName.toLowerCase()} — zsh
          </span>
        </div>
        <div
          style={{
            padding: '16px 15px',
            font: '500 12px/1.85 var(--font-mono), monospace',
            minHeight: '120px',
          }}
        >
          <div
            ref={termRef}
            style={{ whiteSpace: 'pre-wrap', color: 'var(--text-strong)', display: 'inline' }}
          />
          <span
            style={{
              display: 'inline-block',
              width: '7px',
              height: '1.05em',
              transform: 'translateY(2px)',
              background: 'var(--accent)',
              animation: 'blink 1.05s steps(1) infinite',
            }}
          />
        </div>
      </div>
      {avatarUrl && avatarEnabled && <Avatar url={avatarUrl} name={name} />}
    </div>
  );
}

/* ── Email ─────────────────────────────────────────────────────────────────── */
function EmailCard({
  name,
  firstName,
  role,
  openToWork,
  nowBlurb: _nowBlurb,
  projects,
  skills,
  avatarUrl,
  avatarEnabled,
}: HeroCardProps) {
  const email = `hey@${(typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SITE_DOMAIN : null) ?? 'zaquariah.dev'}`;
  const statusText = openToWork ? 'open to work' : 'heads-down · building';
  const topSkills = skills.slice(0, 4).map((s) => s.name);

  return (
    <div style={{ position: 'relative', paddingTop: '34px' }}>
      <div
        style={{
          border: '1px solid var(--border-2)',
          borderRadius: '11px',
          overflow: 'hidden',
          background: 'var(--bg-panel)',
          boxShadow: '0 24px 60px rgba(0,0,0,.5)',
        }}
      >
        {/* Chrome bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 14px',
            borderBottom: '1px solid var(--border-1)',
            background: 'var(--bg-panel-2)',
            font: '500 14px var(--font-mono), monospace',
            color: 'var(--text-meta-2)',
          }}
        >
          <span>⟵</span>
          <span>↻</span>
          <span>⋯</span>
        </div>
        {/* Sender row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px 10px',
            borderBottom: '1px solid var(--border-1)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              font: '700 13px var(--font-space), sans-serif',
              color: 'var(--bg)',
              flexShrink: 0,
            }}
          >
            {firstName[0]?.toUpperCase() ?? 'Z'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>{name}</div>
            <div
              style={{
                font: '500 10.5px var(--font-mono), monospace',
                color: 'var(--text-meta)',
              }}
            >
              {email} · now
            </div>
          </div>
        </div>
        {/* Subject */}
        <div
          style={{
            padding: '10px 16px 6px',
            fontWeight: 600,
            fontSize: '13px',
            borderBottom: '1px solid var(--border-1)',
            color: 'var(--text)',
          }}
        >
          Hey — a quick update
        </div>
        {/* Body */}
        <div
          style={{
            padding: '12px 16px',
            fontSize: '13px',
            lineHeight: 1.7,
            color: 'var(--text-body)',
          }}
        >
          Hey! Currently {statusText}
          {role ? ` as a ${role.toLowerCase()}` : ''} — mostly working across{' '}
          {topSkills.length > 0
            ? topSkills.slice(0, -1).join(', ') +
              (topSkills.length > 1 ? `, and ${topSkills.at(-1)}` : topSkills[0])
            : 'the full stack'}{' '}
          these days.
        </div>
        {/* Attachments */}
        {projects.length > 0 && (
          <div
            style={{
              padding: '0 16px 14px',
              display: 'flex',
              gap: '7px',
              flexWrap: 'wrap',
            }}
          >
            {projects.slice(0, 3).map((p) => (
              <span
                key={p.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  font: '500 10.5px var(--font-mono), monospace',
                  color: 'var(--text-meta)',
                  border: '1px solid var(--border-2)',
                  borderRadius: '5px',
                  padding: '3px 8px',
                }}
              >
                📎 {p.title}
              </span>
            ))}
          </div>
        )}
      </div>
      {avatarUrl && avatarEnabled && <Avatar url={avatarUrl} name={name} />}
    </div>
  );
}

/* ── Chat ──────────────────────────────────────────────────────────────────── */
function ChatCard({
  name,
  firstName,
  role,
  openToWork,
  nowBlurb,
  projects,
  skills,
  avatarUrl,
  avatarEnabled,
}: HeroCardProps) {
  const statusText = openToWork ? 'open to work ✓' : 'heads-down · building ◆';
  const topSkills = skills
    .slice(0, 4)
    .map((s) => s.name)
    .join(' · ');

  return (
    <div style={{ position: 'relative', paddingTop: '34px' }}>
      <div
        style={{
          border: '1px solid var(--border-2)',
          borderRadius: '11px',
          overflow: 'hidden',
          background: 'var(--bg-panel)',
          boxShadow: '0 24px 60px rgba(0,0,0,.5)',
        }}
      >
        {/* Profile strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            borderBottom: '1px solid var(--border-1)',
            background: 'var(--bg-panel-2)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              font: '700 13px var(--font-space), sans-serif',
              color: 'var(--bg)',
              flexShrink: 0,
            }}
          >
            {firstName[0]?.toUpperCase() ?? 'Z'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>{name}</div>
            {topSkills && (
              <div
                style={{
                  font: '500 10px var(--font-mono), monospace',
                  color: 'var(--text-meta)',
                }}
              >
                {topSkills}
              </div>
            )}
          </div>
        </div>
        {/* Messages */}
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Incoming */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                background: 'var(--bg-panel-2)',
                border: '1px solid var(--border-2)',
                borderRadius: '12px 12px 12px 3px',
                padding: '9px 12px',
                font: '400 13px var(--font-space), sans-serif',
                color: 'var(--text-body)',
                maxWidth: '80%',
              }}
            >
              hey, what are you up to?
            </div>
          </div>
          {/* Outgoing */}
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '7px' }}
          >
            <div
              style={{
                background: 'var(--accent-soft-bg)',
                border: '1px solid var(--accent-soft-border)',
                borderRadius: '12px 12px 3px 12px',
                padding: '9px 12px',
                font: '400 13px var(--font-space), sans-serif',
                color: 'var(--text)',
                maxWidth: '80%',
              }}
            >
              {statusText}
              {nowBlurb ? ` — ${nowBlurb}.` : '.'}
            </div>
            {/* Attachment chips */}
            {projects.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                }}
              >
                {projects.slice(0, 3).map((p) => (
                  <span
                    key={p.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      font: '500 10px var(--font-mono), monospace',
                      color: 'var(--text-meta)',
                      border: '1px solid var(--border-2)',
                      borderRadius: '5px',
                      padding: '2px 7px',
                    }}
                  >
                    📎 {p.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {avatarUrl && avatarEnabled && <Avatar url={avatarUrl} name={name} />}
    </div>
  );
}

/* ── Notecard ───────────────────────────────────────────────────────────────── */
function NotecardCard({
  name,
  role,
  openToWork,
  projects,
  skills,
  avatarUrl,
  avatarEnabled,
}: HeroCardProps) {
  const statusText = openToWork ? 'open to work ✓' : 'heads-down · building ◆';
  const projectList = projects
    .slice(0, 3)
    .map((p) => p.title)
    .join(', ');
  const skillList = skills
    .slice(0, 5)
    .map((s) => s.name)
    .join(' · ');

  return (
    <div style={{ position: 'relative', paddingTop: '34px' }}>
      <div
        style={{
          borderRadius: '4px',
          overflow: 'hidden',
          background: '#f3ecd8',
          boxShadow: '0 18px 48px rgba(0,0,0,.45), 0 4px 12px rgba(0,0,0,.2)',
          transform: 'rotate(-1deg)',
          padding: '24px 22px 28px',
          backgroundImage: `
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 27px,
              rgba(60,42,16,0.1) 27px,
              rgba(60,42,16,0.1) 28px
            )
          `,
        }}
      >
        <div style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2a1f10' }}>
          <div
            style={{
              fontSize: '26px',
              fontWeight: 700,
              borderBottom: '1.5px solid #2a1f10',
              paddingBottom: '2px',
              marginBottom: '16px',
              display: 'inline-block',
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: 2.15, marginBottom: '2px' }}>
            → {role ?? 'full-stack engineer'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: 2.15 }}>
            → status: <span style={{ color: '#a8431e' }}>{statusText}</span>
          </div>
          {projectList && (
            <div style={{ fontSize: '19px', fontWeight: 500, lineHeight: 2.15 }}>
              → projects: {projectList}
            </div>
          )}
          {skillList && (
            <div style={{ fontSize: '19px', fontWeight: 500, lineHeight: 2.15 }}>
              → stack: {skillList}
            </div>
          )}
        </div>
      </div>
      {avatarUrl && avatarEnabled && <Avatar url={avatarUrl} name={name} />}
    </div>
  );
}

/* ── Playground ─────────────────────────────────────────────────────────────── */
function PlaygroundCard({
  name,
  firstName,
  role,
  openToWork,
  projects,
  skills,
  avatarUrl,
  avatarEnabled,
}: HeroCardProps) {
  return (
    <div style={{ position: 'relative', paddingTop: '34px' }}>
      <div
        style={{
          border: '1px solid var(--border-2)',
          borderRadius: '11px',
          overflow: 'hidden',
          background: 'var(--bg-panel)',
          boxShadow: '0 24px 60px rgba(0,0,0,.5)',
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 14px',
            borderBottom: '1px solid var(--border-1)',
            background: 'var(--bg-panel-2)',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--border-3)',
              }}
            />
          ))}
          <div
            style={{
              marginLeft: '8px',
              flex: 1,
              background: 'var(--bg-track)',
              borderRadius: '5px',
              padding: '3px 9px',
              font: '500 10px var(--font-mono), monospace',
              color: 'var(--text-meta-2)',
            }}
          >
            {(typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SITE_DOMAIN : null) ??
              'zaquariah.dev'}
            /status
          </div>
        </div>

        {/* Card content */}
        <div style={{ padding: '16px' }}>
          {/* Profile row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                font: '700 14px var(--font-space), sans-serif',
                color: 'var(--bg)',
                flexShrink: 0,
              }}
            >
              {firstName[0]?.toUpperCase() ?? 'Z'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{name}</div>
              <div
                style={{ font: '500 11px var(--font-mono), monospace', color: 'var(--text-meta)' }}
              >
                {role ?? 'software engineer'}
              </div>
            </div>
            {/* Status badge */}
            <div style={{ marginLeft: 'auto' }}>
              <span
                style={{
                  display: 'inline-block',
                  font: '500 10px var(--font-mono), monospace',
                  letterSpacing: '.04em',
                  color: openToWork ? 'var(--accent)' : 'var(--text-meta-2)',
                  background: openToWork ? 'var(--accent-soft-bg)' : 'var(--bg-track)',
                  border: `1px solid ${openToWork ? 'var(--accent-soft-border)' : 'var(--border-2)'}`,
                  borderRadius: '20px',
                  padding: '3px 9px',
                  whiteSpace: 'nowrap',
                }}
              >
                {openToWork ? 'open to work' : 'building'}
              </span>
            </div>
          </div>

          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div
                style={{
                  font: '500 9px var(--font-mono), monospace',
                  letterSpacing: '.1em',
                  color: 'var(--text-faint)',
                  marginBottom: '6px',
                }}
              >
                PROJECTS
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {projects.slice(0, 4).map((p) => (
                  <span
                    key={p.id}
                    style={{
                      font: '500 10.5px var(--font-mono), monospace',
                      color: 'var(--text-body)',
                      background: 'var(--bg-selected)',
                      border: '1px solid var(--border-2)',
                      borderRadius: '5px',
                      padding: '3px 8px',
                    }}
                  >
                    {p.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stack */}
          {skills.length > 0 && (
            <div>
              <div
                style={{
                  font: '500 9px var(--font-mono), monospace',
                  letterSpacing: '.1em',
                  color: 'var(--text-faint)',
                  marginBottom: '6px',
                }}
              >
                STACK
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {skills.slice(0, 6).map((s) => (
                  <span
                    key={s.id}
                    style={{
                      font: '500 10.5px var(--font-mono), monospace',
                      color: 'var(--accent)',
                      background: 'var(--accent-soft-bg)',
                      border: '1px solid var(--accent-soft-border)',
                      borderRadius: '5px',
                      padding: '3px 8px',
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {avatarUrl && avatarEnabled && <Avatar url={avatarUrl} name={name} />}
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────────────────── */
export default function HeroCard(props: HeroCardProps) {
  switch (props.variant) {
    case 'email':
      return <EmailCard {...props} />;
    case 'chat':
      return <ChatCard {...props} />;
    case 'notecard':
      return <NotecardCard {...props} />;
    case 'playground':
      return <PlaygroundCard {...props} />;
    default:
      return <TerminalCard {...props} />;
  }
}
