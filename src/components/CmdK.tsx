'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProfileLink, SearchResult } from '@/types';

interface Cmd {
  label: string;
  kind:
    | 'page'
    | 'section'
    | 'action'
    | 'link'
    | 'project'
    | 'post'
    | 'skill'
    | 'job'
    | 'achievement';
  hint: string;
  searchText?: string;
  run: () => void;
}

interface CmdKProps {
  open: boolean;
  onClose: () => void;
  extraCmds?: Cmd[];
  profileLinks?: ProfileLink[];
  resumeUrl?: string | null;
  writingEnabled?: boolean;
  projectsEnabled?: boolean;
  searchIndex?: SearchResult[];
}

function buildNavCmds(writingEnabled: boolean, projectsEnabled: boolean): Cmd[] {
  const cmds: Cmd[] = [
    {
      label: 'Home',
      kind: 'page',
      hint: 'index',
      run: () => {
        window.location.href = '/';
      },
    },
  ];
  if (projectsEnabled) {
    cmds.push({
      label: 'Projects',
      kind: 'page',
      hint: 'projects',
      run: () => {
        window.location.href = '/projects';
      },
    });
  }
  if (writingEnabled) {
    cmds.push({
      label: 'Writing',
      kind: 'page',
      hint: 'blog',
      run: () => {
        window.location.href = '/writing';
      },
    });
  }
  cmds.push({
    label: 'Experience',
    kind: 'page',
    hint: 'resume',
    run: () => {
      window.location.href = '/experience';
    },
  });
  return cmds;
}

function toCmd(r: SearchResult): Cmd {
  return {
    label: r.label,
    kind: r.kind,
    hint: r.hint,
    searchText: r.searchText,
    run: () => {
      window.location.href = r.url;
    },
  };
}

function matchesQuery(cmd: Cmd, q: string): boolean {
  const text = `${cmd.label} ${cmd.kind} ${cmd.hint} ${cmd.searchText ?? ''}`.toLowerCase();
  return text.includes(q);
}

function scoreCmd(cmd: Cmd, q: string): number {
  const label = cmd.label.toLowerCase();
  if (label.startsWith(q)) return 3;
  if (label.includes(q)) return 2;
  return 1;
}

export default function CmdK({
  open,
  onClose,
  extraCmds = [],
  profileLinks = [],
  resumeUrl,
  writingEnabled = true,
  projectsEnabled = true,
  searchIndex = [],
}: CmdKProps) {
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navCmds = buildNavCmds(writingEnabled, projectsEnabled);

  const resumeCmd: Cmd[] = resumeUrl
    ? [
        {
          label: 'Download resume',
          kind: 'action',
          hint: 'pdf',
          run: () => window.open(resumeUrl, '_blank'),
        },
      ]
    : [];

  const linkCmds: Cmd[] = profileLinks.map((l) => ({
    label: l.label,
    kind: 'link' as const,
    hint: '↗',
    run: () => {
      if (l.url.startsWith('mailto:')) {
        window.location.href = l.url;
      } else {
        window.open(l.url, '_blank');
      }
    },
  }));

  const staticCmds = [...navCmds, ...resumeCmd, ...linkCmds, ...extraCmds];
  const contentCmds = searchIndex.map(toCmd);

  const q = query.trim().toLowerCase();

  const filtered: Cmd[] = q
    ? [
        ...staticCmds.filter((c) => matchesQuery(c, q)),
        ...contentCmds.filter((c) => matchesQuery(c, q)),
      ].sort((a, b) => scoreCmd(b, q) - scoreCmd(a, q))
    : staticCmds;

  useEffect(() => {
    if (open) {
      setQuery('');
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filtered[sel]?.run();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, sel, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'rgba(6,7,9,0.6)',
        backdropFilter: 'blur(3px)',
        paddingTop: '14vh',
      }}
    >
      <div
        style={{
          width: 'min(560px, 90vw)',
          background: 'var(--panel-1)',
          border: '1px solid var(--border-3)',
          borderRadius: '14px',
          boxShadow: '0 30px 80px rgba(0,0,0,.6)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-1)',
          }}
        >
          <span style={{ font: '500 12px var(--font-mono), monospace', color: 'var(--accent)' }}>
            ➜
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSel(0);
            }}
            placeholder="jump to…"
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-1)',
              font: '500 14px var(--font-space), sans-serif',
              caretColor: 'var(--accent)',
            }}
          />
          <span
            style={{
              font: '500 9px var(--font-mono), monospace',
              color: 'var(--text-4)',
              border: '1px solid var(--border-3)',
              borderRadius: '5px',
              padding: '2px 6px',
            }}
          >
            ESC
          </span>
        </div>
        <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px' }}>
          {filtered.map((cmd, i) => (
            <div
              key={`${cmd.kind}-${cmd.label}`}
              onClick={() => {
                cmd.run();
                onClose();
              }}
              onMouseEnter={() => setSel(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: i === sel ? '#17181C' : 'transparent',
                transition: 'background .15s',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <span
                  style={{
                    font: '500 9px var(--font-mono), monospace',
                    letterSpacing: '.04em',
                    color: 'var(--text-4)',
                    textTransform: 'uppercase',
                    width: '52px',
                    flexShrink: 0,
                  }}
                >
                  {cmd.kind}
                </span>
                <span
                  style={{
                    font: '500 14px var(--font-space), sans-serif',
                    color: i === sel ? 'var(--text-1)' : '#C7CBD1',
                  }}
                >
                  {cmd.label}
                </span>
              </span>
              <span
                style={{
                  font: '500 10.5px var(--font-mono), monospace',
                  color: 'var(--text-4)',
                  whiteSpace: 'nowrap',
                  maxWidth: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {cmd.hint}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                padding: '20px 12px',
                font: '500 12px var(--font-mono), monospace',
                color: 'var(--text-4)',
                textAlign: 'center',
              }}
            >
              no results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
