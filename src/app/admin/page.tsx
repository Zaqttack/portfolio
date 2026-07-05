'use client';

import { useState, useEffect, useRef } from 'react';

const PASSPHRASE = 'raptor';

type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'toggle' | 'tags';

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  rows?: number;
  placeholder?: string;
  help?: string;
}

interface Schema {
  label: string;
  singular: string;
  colName: string;
  singleton?: boolean;
  fields: FieldDef[];
  primaryKey: string;
  secondaryKey?: string;
  statusKey?: string;
}

const SCHEMAS: Record<string, Schema> = {
  projects: {
    label: 'Projects',
    singular: 'project',
    colName: 'TITLE',
    primaryKey: 'title',
    secondaryKey: 'stack',
    statusKey: 'status',
    fields: [
      { key: 'title', label: 'TITLE', type: 'text', placeholder: 'Project name' },
      { key: 'tag', label: 'TAG', type: 'select', options: [{ value: 'product', label: 'Product' }, { value: 'side', label: 'Side project' }] },
      { key: 'year', label: 'YEAR', type: 'number', placeholder: '2024' },
      { key: 'stack', label: 'STACK', type: 'tags', placeholder: 'Add technology…' },
      { key: 'blurb', label: 'BLURB', type: 'textarea', rows: 3, placeholder: 'Short description shown on work page' },
      { key: 'link', label: 'LINK', type: 'text', placeholder: 'https://…' },
      { key: 'body', label: 'BODY (MARKDOWN)', type: 'textarea', rows: 8, placeholder: 'Full case study…' },
      { key: 'status', label: 'STATUS', type: 'select', options: [{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }, { value: 'archived', label: 'Archived' }] },
    ],
  },
  posts: {
    label: 'Posts',
    singular: 'post',
    colName: 'TITLE',
    primaryKey: 'title',
    secondaryKey: 'category',
    statusKey: 'status',
    fields: [
      { key: 'title', label: 'TITLE', type: 'text', placeholder: 'Post title' },
      { key: 'category', label: 'CATEGORY', type: 'select', options: [{ value: 'engineering', label: 'Engineering' }, { value: 'community', label: 'Community' }, { value: 'side projects', label: 'Side projects' }] },
      { key: 'date', label: 'DATE', type: 'date' },
      { key: 'readTime', label: 'READ TIME', type: 'text', placeholder: '5 min' },
      { key: 'excerpt', label: 'EXCERPT', type: 'textarea', rows: 2, placeholder: 'One-sentence summary' },
      { key: 'body', label: 'BODY (MARKDOWN)', type: 'textarea', rows: 12, placeholder: 'Post content…' },
      { key: 'status', label: 'STATUS', type: 'select', options: [{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }] },
    ],
  },
  experience: {
    label: 'Experience',
    singular: 'entry',
    colName: 'ROLE',
    primaryKey: 'role',
    secondaryKey: 'org',
    statusKey: 'type',
    fields: [
      { key: 'role', label: 'ROLE', type: 'text', placeholder: 'Job title' },
      { key: 'org', label: 'ORGANIZATION', type: 'text', placeholder: 'Company name' },
      { key: 'location', label: 'LOCATION', type: 'text', placeholder: 'San Antonio, TX' },
      { key: 'type', label: 'TYPE', type: 'select', options: [{ value: 'work', label: 'Work' }, { value: 'leadership', label: 'Leadership' }, { value: 'education', label: 'Education' }] },
      { key: 'start', label: 'START', type: 'date' },
      { key: 'end', label: 'END', type: 'date', help: 'Leave blank for current role' },
      { key: 'bullets', label: 'BULLETS (one per line)', type: 'textarea', rows: 5, placeholder: 'Achievement 1\nAchievement 2' },
    ],
  },
  profile: {
    label: 'Profile',
    singular: 'Profile',
    colName: 'NAME',
    singleton: true,
    primaryKey: 'name',
    statusKey: 'openToWork',
    fields: [
      { key: 'name', label: 'NAME', type: 'text', placeholder: 'Zaquariah Holland' },
      { key: 'tagline', label: 'TAGLINE', type: 'text', placeholder: 'heads-down · building ◆' },
      { key: 'intro', label: 'INTRO', type: 'textarea', rows: 4, placeholder: 'Hero paragraph…' },
      { key: 'now', label: 'NOW', type: 'textarea', rows: 3, placeholder: "What you're working on right now" },
      { key: 'openToWork', label: 'OPEN TO WORK', type: 'toggle' },
      { key: 'email', label: 'EMAIL', type: 'text', placeholder: 'zaquariah@gmail.com' },
      { key: 'github', label: 'GITHUB', type: 'text', placeholder: 'https://github.com/…' },
      { key: 'linkedin', label: 'LINKEDIN', type: 'text', placeholder: 'https://linkedin.com/in/…' },
      { key: 'resume', label: 'RÉSUMÉ URL', type: 'text', placeholder: 'https://drive.google.com/…' },
    ],
  },
};

const MOCK_LISTS: Record<string, Record<string, unknown>[]> = {
  projects: [
    { id: '1', title: 'SWIVEL — Fintech Platform', tag: 'product', year: 2024, stack: ['React', 'TypeScript', 'AWS'], blurb: 'Full-stack fintech application development.', link: '', body: '', status: 'published' },
    { id: '2', title: 'ACM SA Portal', tag: 'product', year: 2023, stack: ['React', 'Supabase'], blurb: 'Events, RSVPs, and a member directory.', link: 'https://acmsa.org', body: '', status: 'published' },
    { id: '3', title: 'Dinosaur Jam', tag: 'side', year: 2024, stack: ['community', 'organizing'], blurb: 'Annual dinosaur game jam.', link: '', body: '', status: 'published' },
  ],
  posts: [
    { id: '1', title: 'Event sourcing without the regret', category: 'engineering', date: '2026-03-01', readTime: '8 min', excerpt: "What I'd tell myself before building LedgerLoop's ledger a second time.", body: '', status: 'published' },
    { id: '2', title: 'Running a game jam is a distributed-systems problem', category: 'community', date: '2026-01-15', readTime: '6 min', excerpt: 'Coordination, backpressure, and eventual consistency — but with dinosaurs.', body: '', status: 'published' },
  ],
  experience: [
    { id: '1', role: 'Software Engineer', org: 'SWIVEL', location: 'San Antonio, TX', type: 'work', start: '2024-04-01', end: '', bullets: 'Shipped 5+ major features\nBuilt ADA-compliant components' },
    { id: '2', role: 'Junior Software Engineer', org: 'SWIVEL', location: 'San Antonio, TX', type: 'work', start: '2021-08-01', end: '2024-04-01', bullets: 'Full-stack feature development\nOwned backend services' },
    { id: '3', role: 'President', org: 'ACM San Antonio', location: 'San Antonio, TX', type: 'leadership', start: '2023-04-01', end: '', bullets: 'Grew chapter to monthly events\nManaged 50+ member community' },
  ],
};

const MOCK_PROFILE: Record<string, unknown> = {
  name: 'Zaquariah Holland',
  tagline: 'heads-down · building ◆',
  intro: 'Software engineer based in San Antonio, TX.',
  now: 'Building things at SWIVEL, running ACM SA.',
  openToWork: false,
  email: 'zaquariah@gmail.com',
  github: 'https://github.com/Zaqttack',
  linkedin: 'https://www.linkedin.com/in/zaquariah-holland/',
  resume: 'https://drive.google.com/file/d/1BaO6_zvsUadRQ8kNX5aBOaWNnBrjAUCs/view',
};

function statusPill(val: string | boolean) {
  if (val === true || val === 'published') return { fg: '#7EE787', bg: '#0d1e11', border: '#1a3d23' };
  if (val === false || val === 'draft') return { fg: '#9A9EA6', bg: '#17181C', border: '#2C3037' };
  if (val === 'archived') return { fg: '#565B64', bg: '#14151A', border: '#23262C' };
  if (val === 'work') return { fg: 'var(--accent)', bg: '#1a1310', border: '#3a2a1e' };
  if (val === 'leadership') return { fg: '#79C0FF', bg: '#0d1a24', border: '#1a3048' };
  if (val === 'education') return { fg: '#D2A8FF', bg: '#16101f', border: '#2d1a42' };
  if (val === 'side') return { fg: '#9A9EA6', bg: '#17181C', border: '#2C3037' };
  if (val === 'product') return { fg: 'var(--accent)', bg: '#1a1310', border: '#3a2a1e' };
  return { fg: '#9A9EA6', bg: '#17181C', border: '#2C3037' };
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: 'fixed',
      bottom: '28px',
      left: '50%',
      zIndex: 99,
      background: '#17181C',
      border: '1px solid #2C3037',
      borderRadius: '10px',
      padding: '11px 20px',
      font: "500 12.5px var(--font-space), sans-serif",
      color: 'var(--text-1)',
      boxShadow: '0 12px 32px rgba(0,0,0,.5)',
      animation: 'toastin .25s ease',
      whiteSpace: 'nowrap',
    }}>
      {msg}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState(false);
  const [section, setSection] = useState<keyof typeof SCHEMAS>('projects');
  const [lists, setLists] = useState(MOCK_LISTS);
  const [profileData, setProfileData] = useState(MOCK_PROFILE);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [toast, setToast] = useState('');
  const pwRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('adm') === PASSPHRASE) setAuthed(true);
    else setTimeout(() => pwRef.current?.focus(), 60);
  }, []);

  const login = () => {
    if (pw === PASSPHRASE) {
      sessionStorage.setItem('adm', PASSPHRASE);
      setAuthed(true);
    } else {
      setPwErr(true);
      setTimeout(() => setPwErr(false), 2000);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('adm');
    setAuthed(false);
    setPw('');
  };

  const schema = SCHEMAS[section];
  const isSingleton = !!schema.singleton;
  const rows = isSingleton ? [] : (lists[section] || []);

  const goSection = (s: keyof typeof SCHEMAS) => {
    setSection(s);
    if (SCHEMAS[s].singleton) {
      setEditing({ ...profileData });
      setView('form');
    } else {
      setView('list');
      setEditing(null);
    }
  };

  const startNew = () => {
    const blank: Record<string, unknown> = { id: String(Date.now()) };
    schema.fields.forEach(f => {
      blank[f.key] = f.type === 'toggle' ? false : f.type === 'tags' ? [] : '';
    });
    setEditing(blank);
    setView('form');
  };

  const startEdit = (row: Record<string, unknown>) => {
    setEditing({ ...row });
    setView('form');
  };

  const deleteRow = (id: unknown) => {
    setLists(d => ({ ...d, [section]: d[section].filter((r: Record<string, unknown>) => r.id !== id) }));
    showToast('Deleted.');
  };

  const save = () => {
    if (!editing) return;
    if (isSingleton) {
      setProfileData({ ...editing });
      showToast('Profile saved.');
      return;
    }
    const existing = rows.find((r: Record<string, unknown>) => r.id === editing.id);
    if (existing) {
      setLists(d => ({ ...d, [section]: d[section].map((r: Record<string, unknown>) => r.id === editing.id ? editing : r) }));
    } else {
      setLists(d => ({ ...d, [section]: [...d[section], editing] }));
    }
    setView('list');
    setEditing(null);
    showToast('Saved.');
  };

  const cancelForm = () => {
    if (isSingleton) {
      setEditing({ ...profileData });
    } else {
      setView('list');
      setEditing(null);
    }
  };

  const showToast = (msg: string) => setToast(msg);

  const setField = (key: string, val: unknown) => {
    setEditing(e => e ? { ...e, [key]: val } : e);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0E0F12',
    border: '1px solid #2C3037',
    borderRadius: '9px',
    padding: '11px 13px',
    color: 'var(--text-1)',
    font: "500 14px var(--font-space), sans-serif",
    transition: 'border-color .2s',
    outline: 'none',
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'radial-gradient(1200px 600px at 50% -10%, #121317, #0B0C0E 60%)' }}>
        <div style={{ width: 'min(380px, 92vw)' }}>
          <div style={{ font: "700 13px var(--font-mono), monospace", color: 'var(--text-1)', marginBottom: '6px' }}>
            zq<span style={{ color: 'var(--accent)' }}>.</span>admin
          </div>
          <div style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-4)', marginBottom: '26px' }}>restricted · zaquariah.dev</div>
          <div style={{ border: '1px solid var(--border-2)', borderRadius: '14px', background: 'var(--panel-1)', padding: '26px' }}>
            <label style={{ display: 'block', font: "500 10px var(--font-mono), monospace", letterSpacing: '.1em', color: 'var(--text-3)', marginBottom: '9px' }}>PASSPHRASE</label>
            <input
              ref={pwRef}
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="••••••••"
              autoComplete="off"
              style={{ ...inputStyle, font: "500 14px var(--font-mono), monospace", caretColor: 'var(--accent)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = '#2C3037')}
            />
            {pwErr && <div style={{ font: "500 11px var(--font-mono), monospace", color: '#E5534B', marginTop: '9px' }}>✕ wrong passphrase</div>}
            <button
              onClick={login}
              style={{ width: '100%', marginTop: '16px', background: 'var(--accent)', color: 'var(--canvas)', border: 'none', borderRadius: '9px', padding: '12px', font: "600 13px var(--font-space), sans-serif", cursor: 'pointer', transition: 'filter .2s' }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
            >
              Enter →
            </button>
          </div>
          <div style={{ font: "500 10px var(--font-mono), monospace", color: '#3A3E45', marginTop: '16px', textAlign: 'center' }}>
            no link from the site · bookmark this page
          </div>
        </div>
      </div>
    );
  }

  const SECTIONS = ['projects', 'posts', 'experience', 'profile'] as const;

  const sectionCount = (s: string) => SCHEMAS[s].singleton ? '·' : String((lists[s] || []).length);

  const pageTitle = isSingleton
    ? 'Profile'
    : view === 'list'
      ? schema.label
      : (editing?.id && rows.find((r: Record<string, unknown>) => r.id === editing?.id) ? `Edit ${schema.singular}` : `New ${schema.singular}`);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '224px 1fr', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <aside style={{ borderRight: '1px solid var(--border-1)', background: '#0C0D10', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '22px 0', position: 'sticky', top: 0, height: '100vh' }}>
        <div>
          <div style={{ padding: '0 20px 22px' }}>
            <div style={{ font: "700 14px var(--font-mono), monospace" }}>
              zq<span style={{ color: 'var(--accent)' }}>.</span>admin
            </div>
            <div style={{ font: "500 9.5px var(--font-mono), monospace", color: 'var(--text-4)', marginTop: '3px' }}>content management</div>
          </div>
          <div style={{ font: "500 9px var(--font-mono), monospace", letterSpacing: '.1em', color: '#4A4E56', padding: '0 20px 10px' }}>COLLECTIONS</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
            {SECTIONS.map(s => {
              const active = section === s;
              return (
                <a
                  key={s}
                  href="#"
                  onClick={e => { e.preventDefault(); goSection(s); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: active ? '#15171B' : 'transparent',
                    transition: 'background .2s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#15171B'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '3px', height: '16px', borderRadius: '2px', background: active ? 'var(--accent)' : 'transparent' }} />
                    <span style={{ font: "500 13.5px var(--font-space), sans-serif", color: active ? 'var(--text-1)' : 'var(--text-2)' }}>
                      {SCHEMAS[s].label}
                    </span>
                  </span>
                  <span style={{ font: "500 10px var(--font-mono), monospace", color: 'var(--text-4)' }}>{sectionCount(s)}</span>
                </a>
              );
            })}
          </nav>
        </div>
        <div style={{ padding: '0 12px' }}>
          <button
            onClick={logout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', padding: '10px 12px', borderRadius: '8px', color: 'var(--text-3)', font: "500 12.5px var(--font-space), sans-serif", cursor: 'pointer', transition: 'color .2s, background .2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.background = '#15171B'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ width: '3px', height: '16px' }} />Sign out ↗
          </button>
          <div style={{ padding: '12px 15px 0', font: "500 9px var(--font-mono), monospace", color: '#3A3E45' }}>session · local preview</div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Topbar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px', borderBottom: '1px solid var(--border-1)', background: 'rgba(11,12,14,0.85)', backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {view === 'form' && !isSingleton && (
              <>
                <a href="#" onClick={e => { e.preventDefault(); cancelForm(); }} style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-3)', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                  ← back
                </a>
                <span style={{ color: '#2C3037' }}>/</span>
              </>
            )}
            <h1 style={{ fontWeight: 600, fontSize: '20px', letterSpacing: '-.01em', margin: 0 }}>{pageTitle}</h1>
            {view === 'list' && !isSingleton && (
              <span style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-4)', border: '1px solid var(--border-2)', borderRadius: '20px', padding: '2px 9px', whiteSpace: 'nowrap' }}>
                {rows.length} {rows.length === 1 ? schema.singular : `${schema.singular}s`}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {view === 'form' && !isSingleton ? (
              <>
                <button onClick={cancelForm}
                  style={{ background: 'transparent', border: '1px solid #2C3037', borderRadius: '8px', padding: '9px 16px', color: 'var(--text-2)', font: "600 12.5px var(--font-space), sans-serif", cursor: 'pointer', transition: 'border-color .2s, color .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#565B64'; e.currentTarget.style.color = 'var(--text-1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2C3037'; e.currentTarget.style.color = 'var(--text-2)'; }}>
                  Cancel
                </button>
                <button onClick={save}
                  style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '9px 18px', color: 'var(--canvas)', font: "600 12.5px var(--font-space), sans-serif", cursor: 'pointer', transition: 'filter .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'none')}>
                  Save
                </button>
              </>
            ) : view === 'list' && !isSingleton ? (
              <button onClick={startNew}
                style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '9px 18px', color: 'var(--canvas)', font: "600 12.5px var(--font-space), sans-serif", cursor: 'pointer', whiteSpace: 'nowrap', transition: 'filter .2s' }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'none')}>
                + New {schema.singular}
              </button>
            ) : null}
          </div>
        </div>

        {/* LIST VIEW — not shown for singletons */}
        {view === 'list' && !isSingleton && (
          <div style={{ padding: '26px 32px 60px' }}>
            {rows.length > 0 ? (
              <div style={{ border: '1px solid var(--border-1)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 120px', gap: '16px', padding: '12px 18px', background: '#0E0F12', borderBottom: '1px solid var(--border-1)', font: "500 9.5px var(--font-mono), monospace", letterSpacing: '.08em', color: 'var(--text-4)' }}>
                  <span>{schema.colName}</span>
                  <span>STATUS</span>
                  <span style={{ textAlign: 'right' }}>ACTIONS</span>
                </div>
                {rows.map((row: Record<string, unknown>) => {
                  const primary = String(row[schema.primaryKey] || '—');
                  const secondary = schema.secondaryKey ? (Array.isArray(row[schema.secondaryKey]) ? (row[schema.secondaryKey] as string[]).join(', ') : String(row[schema.secondaryKey] || '')) : '';
                  const statusVal = schema.statusKey ? row[schema.statusKey] : '';
                  const pill = statusPill(statusVal as string | boolean);
                  return (
                    <div
                      key={String(row.id)}
                      style={{ display: 'grid', gridTemplateColumns: '1fr 150px 120px', gap: '16px', alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid #141518', transition: 'background .2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#0E0F12')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '15px', letterSpacing: '-.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{primary}</div>
                        {secondary && <div style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-3)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{secondary}</div>}
                      </div>
                      <div>
                        <span style={{ display: 'inline-flex', font: "500 9.5px var(--font-mono), monospace", letterSpacing: '.04em', padding: '3px 9px', borderRadius: '20px', color: pill.fg, background: pill.bg, border: `1px solid ${pill.border}` }}>
                          {statusVal === true ? 'OPEN TO WORK' : statusVal === false ? 'CLOSED' : String(statusVal || '').toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => startEdit(row)}
                          style={{ background: 'transparent', border: '1px solid #2C3037', borderRadius: '7px', padding: '6px 11px', color: 'var(--text-2)', font: "500 11px var(--font-mono), monospace", cursor: 'pointer', transition: 'border-color .2s, color .2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2C3037'; e.currentTarget.style.color = 'var(--text-2)'; }}
                        >edit</button>
                        <button
                          onClick={() => deleteRow(row.id)}
                          style={{ background: 'transparent', border: '1px solid #2C3037', borderRadius: '7px', padding: '6px 9px', color: 'var(--text-4)', font: "500 11px var(--font-mono), monospace", cursor: 'pointer', transition: 'border-color .2s, color .2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#E5534B'; e.currentTarget.style.color = '#E5534B'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2C3037'; e.currentTarget.style.color = 'var(--text-4)'; }}
                        >✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ border: '1px dashed #2C3037', borderRadius: '12px', padding: '64px 24px', textAlign: 'center' }}>
                <div style={{ font: "500 12px var(--font-mono), monospace", color: 'var(--text-4)', marginBottom: '14px' }}>// nothing here yet</div>
                <button onClick={startNew}
                  style={{ background: 'transparent', border: '1px solid var(--accent)', borderRadius: '8px', padding: '9px 18px', color: 'var(--accent)', font: "600 12.5px var(--font-space), sans-serif", cursor: 'pointer' }}>
                  + Create the first {schema.singular}
                </button>
              </div>
            )}
          </div>
        )}

        {/* FORM VIEW */}
        {view === 'form' && editing && (
          <div style={{ padding: '28px 32px 80px', maxWidth: '720px' }}>
            {schema.fields.map(f => {
              const val = editing[f.key];
              const update = (v: unknown) => setField(f.key, v);

              return (
                <div key={f.key} style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', font: "500 10px var(--font-mono), monospace", letterSpacing: '.08em', color: 'var(--text-3)', marginBottom: '8px' }}>{f.label}</label>

                  {f.type === 'text' && (
                    <input value={String(val ?? '')} onChange={e => update(e.target.value)} placeholder={f.placeholder}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={e => (e.target.style.borderColor = '#2C3037')} />
                  )}

                  {f.type === 'number' && (
                    <input value={String(val ?? '')} onChange={e => update(e.target.value)} inputMode="numeric" placeholder={f.placeholder}
                      style={{ ...inputStyle, width: '160px', font: "500 14px var(--font-mono), monospace" }}
                      onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={e => (e.target.style.borderColor = '#2C3037')} />
                  )}

                  {f.type === 'date' && (
                    <input type="date" value={String(val ?? '')} onChange={e => update(e.target.value)}
                      style={{ ...inputStyle, width: 'auto', font: "500 13px var(--font-mono), monospace", colorScheme: 'dark' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={e => (e.target.style.borderColor = '#2C3037')} />
                  )}

                  {f.type === 'textarea' && (
                    <textarea value={String(val ?? '')} onChange={e => update(e.target.value)} rows={f.rows || 4} placeholder={f.placeholder}
                      style={{ ...inputStyle, lineHeight: 1.6, resize: 'vertical' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={e => (e.target.style.borderColor = '#2C3037')} />
                  )}

                  {f.type === 'select' && (
                    <select value={String(val ?? '')} onChange={e => update(e.target.value)}
                      style={{ ...inputStyle, width: 'auto', minWidth: '220px', cursor: 'pointer', font: "500 13.5px var(--font-space), sans-serif" }}
                      onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={e => (e.target.style.borderColor = '#2C3037')}>
                      {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  )}

                  {f.type === 'toggle' && (
                    <button
                      onClick={() => update(!val)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <span style={{ width: '42px', height: '24px', borderRadius: '20px', background: val ? 'var(--accent)' : '#2C3037', position: 'relative', transition: 'background .2s', display: 'inline-block' }}>
                        <span style={{ position: 'absolute', top: '3px', left: val ? '21px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--text-1)', transition: 'left .2s' }} />
                      </span>
                      <span style={{ font: "500 12.5px var(--font-space), sans-serif", color: 'var(--text-2)' }}>{val ? 'Yes' : 'No'}</span>
                    </button>
                  )}

                  {f.type === 'tags' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', alignItems: 'center', background: '#0E0F12', border: '1px solid #2C3037', borderRadius: '9px', padding: '9px 10px' }}>
                      {(val as string[] || []).map((tag: string) => (
                        <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', font: "500 11px var(--font-mono), monospace", color: '#C7CBD1', background: '#17181C', border: '1px solid #2C3037', borderRadius: '6px', padding: '4px 8px' }}>
                          {tag}
                          <a href="#" onClick={e => { e.preventDefault(); update((val as string[]).filter((t: string) => t !== tag)); }}
                            style={{ color: 'var(--text-4)', textDecoration: 'none', fontWeight: 700 }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#E5534B')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-4)')}>×</a>
                        </span>
                      ))}
                      <input
                        placeholder={f.placeholder}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const v = (e.target as HTMLInputElement).value.trim().replace(',', '');
                            if (v) { update([...(val as string[] || []), v]); (e.target as HTMLInputElement).value = ''; }
                          }
                        }}
                        style={{ flex: 1, minWidth: '120px', background: 'transparent', border: 'none', color: 'var(--text-1)', font: "500 13px var(--font-space), sans-serif", padding: '4px 2px', outline: 'none' }}
                      />
                    </div>
                  )}

                  {f.help && <div style={{ font: "500 11px var(--font-mono), monospace", color: 'var(--text-4)', marginTop: '7px' }}>{f.help}</div>}
                </div>
              );
            })}

            {isSingleton && (
              <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-1)' }}>
                <button onClick={save}
                  style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '11px 22px', color: 'var(--canvas)', font: "600 13px var(--font-space), sans-serif", cursor: 'pointer', transition: 'filter .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'none')}>
                  Save Profile
                </button>
                <button onClick={cancelForm}
                  style={{ background: 'transparent', border: '1px solid #2C3037', borderRadius: '8px', padding: '11px 20px', color: 'var(--text-2)', font: "600 13px var(--font-space), sans-serif", cursor: 'pointer', transition: 'border-color .2s, color .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#565B64'; e.currentTarget.style.color = 'var(--text-1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2C3037'; e.currentTarget.style.color = 'var(--text-2)'; }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </div>
  );
}
