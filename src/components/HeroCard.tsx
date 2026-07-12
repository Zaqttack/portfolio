'use client';

import { useEffect, useRef } from 'react';
import type { Project, Skill } from '@/types';

export type HeroVariant = 'terminal' | 'email' | 'chat' | 'notecard' | 'playground';

interface HeroCardProps {
  variant: HeroVariant;
  name: string;
  firstName: string;
  role: string | null;
  email: string | null;
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

function BubbleIn({ text }: { text: string }) {
  return (
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
        {text}
      </div>
    </div>
  );
}

function resolveStatus(openToWork: boolean, terminalStatus: string | null): string {
  if (openToWork) return 'open to work';
  return terminalStatus ?? 'heads-down · building';
}

function joinList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
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
  const statusLine = openToWork ? 'open to work ✓' : `${terminalStatus ?? 'heads-down · building'}`;
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
      { t: `\n${firstName.toLowerCase()}${role ? ` / ${role.toLowerCase()}` : ''}\n`, color: txt },
      { t: 'status', prompt: true, pre: '\n' },
      { t: `\n${statusLine}\n`, color: txt, chunk: true },
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
  }, [firstName, role, statusLine, projects, skills]);

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
  email,
  openToWork,
  terminalStatus,
  projects,
  skills,
  avatarUrl,
  avatarEnabled,
}: HeroCardProps) {
  const statusText = resolveStatus(openToWork, terminalStatus);
  const domain =
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SITE_DOMAIN : null) ??
    'zaquariah.dev';
  const displayEmail = email ?? `hey@${domain}`;
  const topSkills = skills.slice(0, 5);

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
              {displayEmail} · now
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
          RE: Glad to Connect!
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
          Hello! I&apos;m currently {statusText}
          {role ? ` as a ${role.toLowerCase()}` : ''}.
        </div>
        {/* Attachments: projects */}
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
        {/* Signature footer: skills */}
        {topSkills.length > 0 && (
          <div
            style={{
              padding: '10px 16px 12px',
              borderTop: '1px solid var(--border-1)',
              font: '500 10px var(--font-mono), monospace',
              color: 'var(--text-meta-2)',
              letterSpacing: '.04em',
            }}
          >
            {topSkills.map((s) => s.name).join(' · ')}
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
  terminalStatus,
  nowBlurb,
  projects,
  skills,
  avatarUrl,
  avatarEnabled,
}: HeroCardProps) {
  const statusText = resolveStatus(openToWork, terminalStatus);
  const topSkillNames = skills.slice(0, 5).map((s) => s.name);

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const msg1 = `${cap(statusText)}${role ? ` as a ${role.toLowerCase()}` : ''}${nowBlurb ? `. ${nowBlurb.replace(/\.$/, '')}` : ''}.`;

  const outBubble = {
    background: 'var(--accent-soft-bg)',
    border: '1px solid var(--accent-soft-border)',
    borderRadius: '12px 12px 3px 12px',
    padding: '9px 12px',
    font: '400 13px var(--font-space), sans-serif',
    color: 'var(--text)',
    maxWidth: '80%',
  };

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
            <div
              style={{
                font: '500 10px var(--font-mono), monospace',
                color: 'var(--text-meta)',
              }}
            >
              {openToWork ? 'open to work' : 'online'}
            </div>
          </div>
        </div>
        {/* Messages */}
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Exchange 1: status + context */}
          <BubbleIn text="hey, what's new with you?" />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={outBubble}>{msg1}</div>
          </div>

          {/* Exchange 2: projects */}
          <BubbleIn text="working on anything lately?" />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '5px',
            }}
          >
            {projects.length > 0 ? (
              <>
                <div style={outBubble}>a few things in progress</div>
                <div
                  style={{
                    display: 'flex',
                    gap: '5px',
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
              </>
            ) : (
              <div style={outBubble}>nothing to show just yet!</div>
            )}
          </div>

          {/* Exchange 3: skills as natural text */}
          {topSkillNames.length > 0 && (
            <>
              <BubbleIn text="nice! what are you using these days?" />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={outBubble}>a few things like {joinList(topSkillNames)}</div>
              </div>
            </>
          )}
          {topSkillNames.length === 0 && openToWork && (
            <>
              <BubbleIn text="are you open to new work?" />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={outBubble}>yep, open to the right fit. reach out!</div>
              </div>
            </>
          )}
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
  terminalStatus,
  projects,
  skills,
  avatarUrl,
  avatarEnabled,
}: HeroCardProps) {
  const statusText = openToWork ? 'open to work ✓' : `${terminalStatus ?? 'heads-down · building'}`;

  const noteItems: { label: string | null; text: string; accent?: boolean; bold?: boolean }[] = [
    { label: null, text: role ?? 'builder', bold: false },
    { label: 'status', text: statusText, bold: true, accent: true },
    ...(projects.length > 0
      ? [
          {
            label: 'projects',
            text: projects
              .slice(0, 3)
              .map((p) => p.title)
              .join(', '),
          },
        ]
      : []),
    ...(skills.length > 0
      ? [
          {
            label: 'skills',
            text: skills
              .slice(0, 5)
              .map((s) => s.name)
              .join(' · '),
          },
        ]
      : []),
  ];

  const rotations = [-0.4, 0.5, -0.3, 0.6, -0.2];
  const indents = [2, 6, 0, 8, 3];

  return (
    <div style={{ position: 'relative', paddingTop: '34px', overflow: 'hidden' }}>
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
              marginBottom: '18px',
              display: 'inline-block',
            }}
          >
            {name}
          </div>
          {noteItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '7px',
                fontSize: '19px',
                fontWeight: item.bold ? 600 : 500,
                lineHeight: 2.0,
                transform: `rotate(${rotations[i % rotations.length]}deg)`,
                marginLeft: `${indents[i % indents.length]}px`,
              }}
            >
              <span style={{ fontSize: '13px', flexShrink: 0 }}>•</span>
              {item.label && (
                <span style={{ fontSize: '13px', color: '#8a6a42', flexShrink: 0 }}>
                  {item.label}:
                </span>
              )}
              <span style={item.accent ? { color: '#a8431e' } : {}}>{item.text}</span>
            </div>
          ))}
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
  terminalStatus,
  projects,
  skills,
  avatarUrl,
  avatarEnabled,
}: HeroCardProps) {
  const statusText = resolveStatus(openToWork, terminalStatus);
  const domain =
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SITE_DOMAIN : null) ??
    'zaquariah.dev';
  const projectCount = projects.length;
  const skillCount = skills.length;

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
            {domain}
          </div>
        </div>

        {/* Content — mirrors site layout patterns */}
        <div style={{ padding: '16px' }}>
          {/* Header: avatar + name/role + status badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  letterSpacing: '-.01em',
                  lineHeight: 1.2,
                }}
              >
                {name}
              </div>
              <div
                style={{
                  font: '500 10px var(--font-mono), monospace',
                  color: 'var(--text-meta)',
                  marginTop: '2px',
                }}
              >
                {role ?? 'builder'}
              </div>
            </div>
            <span
              style={{
                display: 'inline-block',
                font: '500 9px var(--font-mono), monospace',
                letterSpacing: '.04em',
                color: openToWork ? 'var(--accent)' : 'var(--text-meta-2)',
                background: openToWork ? 'var(--accent-soft-bg)' : 'var(--bg-track)',
                border: `1px solid ${openToWork ? 'var(--accent-soft-border)' : 'var(--border-2)'}`,
                borderRadius: '20px',
                padding: '3px 9px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {statusText}
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--border-1)', marginBottom: '14px' }} />

          {/* 01 / PROJECTS */}
          {projectCount > 0 && (
            <div style={{ marginBottom: skillCount > 0 ? '12px' : '0' }}>
              <div
                style={{
                  font: '500 9px var(--font-mono), monospace',
                  letterSpacing: '.12em',
                  color: 'var(--accent)',
                  marginBottom: '7px',
                }}
              >
                01 / PROJECTS
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
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

          {/* 02 / SKILLS (or 01 if no projects) */}
          {skillCount > 0 && (
            <div>
              <div
                style={{
                  font: '500 9px var(--font-mono), monospace',
                  letterSpacing: '.12em',
                  color: 'var(--accent)',
                  marginBottom: '7px',
                }}
              >
                {projectCount > 0 ? '02 / SKILLS' : '01 / SKILLS'}
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
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
