'use client';

import { useEffect, useState } from 'react';

type Mode = 'system' | 'light' | 'dark';

const OPTIONS: { mode: Mode; icon: string; title: string }[] = [
  { mode: 'system', icon: '◐', title: 'System' },
  { mode: 'light', icon: '☀', title: 'Light' },
  { mode: 'dark', icon: '☾', title: 'Dark' },
];

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('system');

  useEffect(() => {
    const stored = localStorage.getItem('zq-theme-mode') as Mode | null;
    if (stored) setMode(stored);
  }, []);

  const apply = (m: Mode) => {
    setMode(m);
    localStorage.setItem('zq-theme-mode', m);
    const sys = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', m === 'system' ? sys : m);
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        border: '1px solid var(--border-2)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      {OPTIONS.map(({ mode: m, icon, title }) => {
        const active = mode === m;
        return (
          <button
            key={m}
            onClick={() => apply(m)}
            title={title}
            style={{
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'var(--bg)' : 'var(--text-meta)',
              border: 'none',
              padding: '5px 9px',
              cursor: 'pointer',
              font: '500 12px var(--font-mono), monospace',
              lineHeight: 1,
              transition: 'background .2s, color .2s',
            }}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
