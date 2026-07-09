'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Cmd {
  label: string;
  kind: 'page' | 'section' | 'action' | 'link';
  hint: string;
  run: () => void;
}

interface CmdKProps {
  open: boolean;
  onClose: () => void;
  extraCmds?: Cmd[];
}

const BASE_CMDS: Cmd[] = [
  {
    label: 'Home',
    kind: 'page',
    hint: 'index',
    run: () => {
      window.location.href = '/';
    },
  },
  {
    label: 'Projects',
    kind: 'page',
    hint: 'projects',
    run: () => {
      window.location.href = '/projects';
    },
  },
  {
    label: 'Writing',
    kind: 'page',
    hint: 'blog',
    run: () => {
      window.location.href = '/writing';
    },
  },
  {
    label: 'Experience',
    kind: 'page',
    hint: 'resume',
    run: () => {
      window.location.href = '/experience';
    },
  },
  {
    label: 'Download resume',
    kind: 'action',
    hint: 'pdf',
    run: () =>
      window.open(
        'https://drive.google.com/file/d/1BaO6_zvsUadRQ8kNX5aBOaWNnBrjAUCs/view',
        '_blank',
      ),
  },
  {
    label: 'GitHub',
    kind: 'link',
    hint: '↗',
    run: () => window.open('https://github.com/Zaqttack', '_blank'),
  },
  {
    label: 'LinkedIn',
    kind: 'link',
    hint: '↗',
    run: () => window.open('https://www.linkedin.com/in/zaquariah-holland/', '_blank'),
  },
  {
    label: 'Email',
    kind: 'link',
    hint: '↗',
    run: () => {
      window.location.href = 'mailto:zaquariah@gmail.com';
    },
  },
];

export default function CmdK({ open, onClose, extraCmds = [] }: CmdKProps) {
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const cmds = [...BASE_CMDS, ...extraCmds];
  const filtered = query.trim()
    ? cmds.filter((c) =>
        (c.label + ' ' + c.kind + ' ' + c.hint).toLowerCase().includes(query.toLowerCase()),
      )
    : cmds;

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
              key={cmd.label}
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
                style={{ font: '500 10.5px var(--font-mono), monospace', color: 'var(--text-4)' }}
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
