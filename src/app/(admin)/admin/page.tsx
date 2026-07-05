'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  table: string;
  colName: string;
  singleton?: boolean;
  readOnly?: boolean;
  fields: FieldDef[];
  primaryKey: string;
  secondaryKey?: string;
  statusKey?: string;
}

const SCHEMAS: Record<string, Schema> = {
  projects: {
    label: 'Projects',
    singular: 'project',
    table: 'projects',
    colName: 'TITLE',
    primaryKey: 'title',
    secondaryKey: 'tags',
    statusKey: 'status',
    fields: [
      { key: 'title', label: 'TITLE', type: 'text', placeholder: 'Project name' },
      { key: 'slug', label: 'SLUG', type: 'text', placeholder: 'project-slug' },
      {
        key: 'summary',
        label: 'SUMMARY',
        type: 'textarea',
        rows: 2,
        placeholder: 'Short description shown on work page',
      },
      {
        key: 'body',
        label: 'BODY (MARKDOWN)',
        type: 'textarea',
        rows: 10,
        placeholder: 'Full case study…',
      },
      { key: 'tags', label: 'TAGS', type: 'tags', placeholder: 'Add tag…' },
      { key: 'repo_url', label: 'REPO URL', type: 'text', placeholder: 'https://github.com/…' },
      { key: 'live_url', label: 'LIVE URL', type: 'text', placeholder: 'https://…' },
      { key: 'featured', label: 'FEATURED', type: 'toggle' },
      { key: 'display_order', label: 'ORDER', type: 'number', placeholder: '0' },
      {
        key: 'status',
        label: 'STATUS',
        type: 'select',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ],
      },
    ],
  },
  posts: {
    label: 'Posts',
    singular: 'post',
    table: 'posts',
    colName: 'TITLE',
    primaryKey: 'title',
    secondaryKey: 'tags',
    statusKey: 'status',
    fields: [
      { key: 'title', label: 'TITLE', type: 'text', placeholder: 'Post title' },
      { key: 'slug', label: 'SLUG', type: 'text', placeholder: 'post-slug' },
      {
        key: 'excerpt',
        label: 'EXCERPT',
        type: 'textarea',
        rows: 2,
        placeholder: 'One-sentence summary',
      },
      {
        key: 'body',
        label: 'BODY (MARKDOWN)',
        type: 'textarea',
        rows: 14,
        placeholder: 'Post content…',
      },
      { key: 'tags', label: 'TAGS', type: 'tags', placeholder: 'Add tag…' },
      { key: 'published_at', label: 'PUBLISHED AT', type: 'date' },
      {
        key: 'status',
        label: 'STATUS',
        type: 'select',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ],
      },
    ],
  },
  experience: {
    label: 'Experience',
    singular: 'entry',
    table: 'experience',
    colName: 'ROLE',
    primaryKey: 'role',
    secondaryKey: 'company',
    statusKey: 'org_type',
    fields: [
      { key: 'company', label: 'COMPANY', type: 'text', placeholder: 'Company name' },
      { key: 'role', label: 'ROLE', type: 'text', placeholder: 'Job title' },
      {
        key: 'org_type',
        label: 'TYPE',
        type: 'select',
        options: [
          { value: 'job', label: 'Job' },
          { value: 'internship', label: 'Internship' },
          { value: 'contract', label: 'Contract' },
          { value: 'volunteer', label: 'Volunteer' },
        ],
      },
      { key: 'location', label: 'LOCATION', type: 'text', placeholder: 'San Antonio, TX' },
      { key: 'start_date', label: 'START', type: 'date' },
      { key: 'end_date', label: 'END', type: 'date', help: 'Leave blank for current role' },
      { key: 'display_order', label: 'ORDER', type: 'number', placeholder: '0' },
      {
        key: '_bullets',
        label: 'BULLETS (one per line)',
        type: 'textarea',
        rows: 6,
        placeholder: 'Achievement 1\nAchievement 2',
      },
    ],
  },
  skills: {
    label: 'Skills',
    singular: 'skill',
    table: 'skills',
    colName: 'NAME',
    primaryKey: 'name',
    secondaryKey: 'category',
    statusKey: 'source',
    fields: [
      { key: 'name', label: 'NAME', type: 'text', placeholder: 'TypeScript' },
      { key: 'category', label: 'CATEGORY', type: 'text', placeholder: 'Languages' },
      { key: 'proficiency', label: 'PROFICIENCY (1–5)', type: 'number', placeholder: '3' },
      {
        key: 'source',
        label: 'SOURCE',
        type: 'select',
        options: [
          { value: 'self', label: 'Self' },
          { value: 'work_import', label: 'Work Import' },
        ],
      },
      { key: 'display_order', label: 'ORDER', type: 'number', placeholder: '0' },
    ],
  },
  involvement: {
    label: 'Involvement',
    singular: 'org',
    table: 'involvement_orgs',
    colName: 'NAME',
    primaryKey: 'name',
    statusKey: 'url',
    fields: [
      { key: 'name', label: 'NAME', type: 'text', placeholder: 'ACM San Antonio' },
      {
        key: 'description',
        label: 'DESCRIPTION',
        type: 'textarea',
        rows: 2,
        placeholder: 'What the org does',
      },
      { key: 'url', label: 'URL', type: 'text', placeholder: 'https://…' },
      { key: 'display_order', label: 'ORDER', type: 'number', placeholder: '0' },
    ],
  },
  profile: {
    label: 'Profile',
    singular: 'Profile',
    table: 'profile',
    colName: 'NAME',
    singleton: true,
    primaryKey: 'name',
    statusKey: 'open_to_work',
    fields: [
      { key: 'name', label: 'NAME', type: 'text', placeholder: 'Zaquariah Holland' },
      { key: 'tagline', label: 'TAGLINE', type: 'text', placeholder: 'heads-down · building ◆' },
      { key: 'bio', label: 'BIO', type: 'textarea', rows: 4, placeholder: 'Short bio paragraph…' },
      { key: 'location', label: 'LOCATION', type: 'text', placeholder: 'San Antonio, TX' },
      { key: 'email', label: 'EMAIL', type: 'text', placeholder: 'zaquariah@gmail.com' },
      { key: 'github', label: 'GITHUB', type: 'text', placeholder: 'https://github.com/…' },
      {
        key: 'linkedin',
        label: 'LINKEDIN',
        type: 'text',
        placeholder: 'https://linkedin.com/in/…',
      },
      { key: 'twitter', label: 'TWITTER', type: 'text', placeholder: 'https://twitter.com/…' },
      { key: 'resume_url', label: 'RÉSUMÉ URL', type: 'text', placeholder: 'https://…' },
      { key: 'open_to_work', label: 'OPEN TO WORK', type: 'toggle' },
    ],
  },
  staging: {
    label: 'Import Queue',
    singular: 'item',
    table: 'import_staging',
    colName: 'SOURCE',
    readOnly: true,
    primaryKey: 'source_note',
    statusKey: 'reviewed',
    fields: [
      { key: 'source_note', label: 'SOURCE NOTE', type: 'text' },
      { key: 'raw_payload', label: 'PAYLOAD (JSON)', type: 'textarea', rows: 14 },
      { key: 'reviewed', label: 'REVIEWED', type: 'toggle' },
    ],
  },
};

function statusPill(val: string | boolean | null | undefined) {
  if (val === true || val === 'published')
    return { fg: '#7EE787', bg: '#0d1e11', border: '#1a3d23' };
  if (val === false || val === 'draft') return { fg: '#9A9EA6', bg: '#17181C', border: '#2C3037' };
  if (val === 'archived') return { fg: '#565B64', bg: '#14151A', border: '#23262C' };
  if (val === 'job') return { fg: 'var(--accent)', bg: '#1a1310', border: '#3a2a1e' };
  if (val === 'internship') return { fg: '#79C0FF', bg: '#0d1a24', border: '#1a3048' };
  if (val === 'contract') return { fg: '#D2A8FF', bg: '#16101f', border: '#2d1a42' };
  if (val === 'volunteer') return { fg: '#7EE787', bg: '#0d1e11', border: '#1a3d23' };
  if (val === 'self') return { fg: 'var(--accent)', bg: '#1a1310', border: '#3a2a1e' };
  if (val === 'work_import') return { fg: '#9A9EA6', bg: '#17181C', border: '#2C3037' };
  return { fg: '#9A9EA6', bg: '#17181C', border: '#2C3037' };
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        zIndex: 99,
        background: '#17181C',
        border: '1px solid #2C3037',
        borderRadius: '10px',
        padding: '11px 20px',
        font: '500 12.5px var(--font-space), sans-serif',
        color: 'var(--text-1)',
        boxShadow: '0 12px 32px rgba(0,0,0,.5)',
        animation: 'toastin .25s ease',
        whiteSpace: 'nowrap',
        transform: 'translateX(-50%)',
      }}
    >
      {msg}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [section, setSection] = useState<keyof typeof SCHEMAS>('projects');
  const [lists, setLists] = useState<Record<string, Record<string, unknown>[]>>({});
  const [profileData, setProfileData] = useState<Record<string, unknown>>({});
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [toast, setToast] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const loadSection = useCallback(
    async (s: keyof typeof SCHEMAS) => {
      const schema = SCHEMAS[s];
      if (schema.singleton) {
        const { data } = await supabase.from(schema.table).select('*').maybeSingle();
        if (data) setProfileData(data);
      } else {
        let query = supabase
          .from(schema.table)
          .select(s === 'experience' ? '*, experience_bullets(*)' : '*');
        if (schema.table !== 'import_staging') query = query.order('display_order' as string);
        else query = query.order('created_at', { ascending: false });
        const { data } = await query;
        if (data) {
          const rows =
            s === 'experience'
              ? (data as unknown as Record<string, unknown>[]).map((row) => {
                  const bullets = (row.experience_bullets as { text: string }[] | null) ?? [];
                  return { ...row, _bullets: bullets.map((b) => b.text).join('\n') };
                })
              : (data as unknown as Record<string, unknown>[]).map((row) =>
                  schema.table === 'import_staging'
                    ? { ...row, raw_payload: JSON.stringify(row.raw_payload, null, 2) }
                    : row,
                );
          setLists((d) => ({ ...d, [s]: rows }));
        }
      }
    },
    [supabase],
  );

  useEffect(() => {
    const loadAll = async () => {
      setLoadingData(true);
      await Promise.all((Object.keys(SCHEMAS) as (keyof typeof SCHEMAS)[]).map(loadSection));
      setLoadingData(false);
    };
    loadAll();
  }, [loadSection]);

  const schema = SCHEMAS[section];
  const isSingleton = !!schema.singleton;
  const isReadOnly = !!schema.readOnly;
  const rows = isSingleton ? [] : lists[section] || [];

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
    const blank: Record<string, unknown> = {};
    schema.fields.forEach((f) => {
      blank[f.key] = f.type === 'toggle' ? false : f.type === 'tags' ? [] : '';
    });
    setEditing(blank);
    setView('form');
  };

  const startEdit = (row: Record<string, unknown>) => {
    setEditing({ ...row });
    setView('form');
  };

  const deleteRow = async (id: unknown) => {
    const { error } = await supabase.from(schema.table).delete().eq('id', id);
    if (error) {
      showToast('Delete failed.');
      return;
    }
    setLists((d) => ({ ...d, [section]: d[section].filter((r) => r.id !== id) }));
    showToast('Deleted.');
  };

  const save = async () => {
    if (!editing) return;

    if (isSingleton) {
      const payload = { ...editing } as Record<string, unknown>;
      delete payload.id;
      delete payload.updated_at;

      if (profileData.id) {
        const { error } = await supabase
          .from(schema.table)
          .update(payload)
          .eq('id', profileData.id);
        if (error) {
          showToast('Save failed.');
          return;
        }
      } else {
        const { error } = await supabase.from(schema.table).insert(payload);
        if (error) {
          showToast('Save failed.');
          return;
        }
      }
      await loadSection(section);
      showToast('Profile saved.');
      return;
    }

    const payload = { ...editing } as Record<string, unknown>;
    const bulletsText = payload._bullets as string | undefined;
    delete payload._bullets;
    delete payload.experience_bullets;
    delete payload.created_at;
    delete payload.updated_at;

    // Handle import_staging: parse raw_payload back to JSON
    if (section === 'staging' && typeof payload.raw_payload === 'string') {
      try {
        payload.raw_payload = JSON.parse(payload.raw_payload);
      } catch {
        showToast('Invalid JSON in payload.');
        return;
      }
    }

    const isNew = !payload.id;
    let savedId = payload.id as string | undefined;

    if (isNew) {
      delete payload.id;
      const { data, error } = await supabase
        .from(schema.table)
        .insert(payload)
        .select('id')
        .single();
      if (error) {
        showToast('Save failed.');
        return;
      }
      savedId = data.id;
    } else {
      const { error } = await supabase.from(schema.table).update(payload).eq('id', payload.id);
      if (error) {
        showToast('Save failed.');
        return;
      }
    }

    // Handle experience bullets
    if (section === 'experience' && savedId !== undefined) {
      await supabase.from('experience_bullets').delete().eq('experience_id', savedId);
      const lines = (bulletsText ?? '')
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);
      if (lines.length > 0) {
        await supabase.from('experience_bullets').insert(
          lines.map((text, i) => ({
            experience_id: savedId,
            text,
            visibility: 'public',
            source: 'self',
            display_order: i,
          })),
        );
      }
    }

    await loadSection(section);
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

  const setField = (key: string, val: unknown) => {
    setEditing((e) => (e ? { ...e, [key]: val } : e));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0E0F12',
    border: '1px solid #2C3037',
    borderRadius: '9px',
    padding: '11px 13px',
    color: 'var(--text-1)',
    font: '500 14px var(--font-space), sans-serif',
    transition: 'border-color .2s',
    outline: 'none',
  };

  const SECTIONS = Object.keys(SCHEMAS) as (keyof typeof SCHEMAS)[];

  const sectionCount = (s: string) =>
    SCHEMAS[s].singleton ? '·' : String((lists[s] || []).length);

  const pageTitle = isSingleton
    ? 'Profile'
    : view === 'list'
      ? schema.label
      : editing?.id && rows.find((r) => r.id === editing?.id)
        ? `Edit ${schema.singular}`
        : `New ${schema.singular}`;

  if (loadingData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--canvas)',
        }}
      >
        <div style={{ font: '500 12px var(--font-mono), monospace', color: 'var(--text-4)' }}>
          loading…
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '224px 1fr', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <aside
        style={{
          borderRight: '1px solid var(--border-1)',
          background: '#0C0D10',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '22px 0',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div>
          <div style={{ padding: '0 20px 22px' }}>
            <div style={{ font: '700 14px var(--font-mono), monospace' }}>
              zq<span style={{ color: 'var(--accent)' }}>.</span>admin
            </div>
            <div
              style={{
                font: '500 9.5px var(--font-mono), monospace',
                color: 'var(--text-4)',
                marginTop: '3px',
              }}
            >
              content management
            </div>
          </div>
          <div
            style={{
              font: '500 9px var(--font-mono), monospace',
              letterSpacing: '.1em',
              color: '#4A4E56',
              padding: '0 20px 10px',
            }}
          >
            COLLECTIONS
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
            {SECTIONS.map((s) => {
              const active = section === s;
              return (
                <a
                  key={s}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    goSection(s);
                  }}
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
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = '#15171B';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '3px',
                        height: '16px',
                        borderRadius: '2px',
                        background: active ? 'var(--accent)' : 'transparent',
                      }}
                    />
                    <span
                      style={{
                        font: '500 13.5px var(--font-space), sans-serif',
                        color: active ? 'var(--text-1)' : 'var(--text-2)',
                      }}
                    >
                      {SCHEMAS[s].label}
                    </span>
                  </span>
                  <span
                    style={{ font: '500 10px var(--font-mono), monospace', color: 'var(--text-4)' }}
                  >
                    {sectionCount(s)}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
        <div style={{ padding: '0 12px' }}>
          <button
            onClick={signOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              border: 'none',
              padding: '10px 12px',
              borderRadius: '8px',
              color: 'var(--text-3)',
              font: '500 12.5px var(--font-space), sans-serif',
              cursor: 'pointer',
              transition: 'color .2s, background .2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-1)';
              e.currentTarget.style.background = '#15171B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-3)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ width: '3px', height: '16px' }} />
            Sign out ↗
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Topbar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 32px',
            borderBottom: '1px solid var(--border-1)',
            background: 'rgba(11,12,14,0.85)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {view === 'form' && !isSingleton && (
              <>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    cancelForm();
                  }}
                  style={{
                    font: '500 11px var(--font-mono), monospace',
                    color: 'var(--text-3)',
                    textDecoration: 'none',
                    transition: 'color .2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
                >
                  ← back
                </a>
                <span style={{ color: '#2C3037' }}>/</span>
              </>
            )}
            <h1 style={{ fontWeight: 600, fontSize: '20px', letterSpacing: '-.01em', margin: 0 }}>
              {pageTitle}
            </h1>
            {view === 'list' && !isSingleton && (
              <span
                style={{
                  font: '500 11px var(--font-mono), monospace',
                  color: 'var(--text-4)',
                  border: '1px solid var(--border-2)',
                  borderRadius: '20px',
                  padding: '2px 9px',
                  whiteSpace: 'nowrap',
                }}
              >
                {rows.length} {rows.length === 1 ? schema.singular : `${schema.singular}s`}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {view === 'form' && !isSingleton ? (
              <>
                <button
                  onClick={cancelForm}
                  style={{
                    background: 'transparent',
                    border: '1px solid #2C3037',
                    borderRadius: '8px',
                    padding: '9px 16px',
                    color: 'var(--text-2)',
                    font: '600 12.5px var(--font-space), sans-serif',
                    cursor: 'pointer',
                    transition: 'border-color .2s, color .2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#565B64';
                    e.currentTarget.style.color = 'var(--text-1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2C3037';
                    e.currentTarget.style.color = 'var(--text-2)';
                  }}
                >
                  Cancel
                </button>
                {!isReadOnly && (
                  <button
                    onClick={save}
                    style={{
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '9px 18px',
                      color: 'var(--canvas)',
                      font: '600 12.5px var(--font-space), sans-serif',
                      cursor: 'pointer',
                      transition: 'filter .2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
                  >
                    Save
                  </button>
                )}
              </>
            ) : view === 'list' && !isSingleton && !isReadOnly ? (
              <button
                onClick={startNew}
                style={{
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  color: 'var(--canvas)',
                  font: '600 12.5px var(--font-space), sans-serif',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'filter .2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
              >
                + New {schema.singular}
              </button>
            ) : null}
          </div>
        </div>

        {/* LIST */}
        {view === 'list' && !isSingleton && (
          <div style={{ padding: '26px 32px 60px' }}>
            {rows.length > 0 ? (
              <div
                style={{
                  border: '1px solid var(--border-1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 150px 120px',
                    gap: '16px',
                    padding: '12px 18px',
                    background: '#0E0F12',
                    borderBottom: '1px solid var(--border-1)',
                    font: '500 9.5px var(--font-mono), monospace',
                    letterSpacing: '.08em',
                    color: 'var(--text-4)',
                  }}
                >
                  <span>{schema.colName}</span>
                  <span>STATUS</span>
                  <span style={{ textAlign: 'right' }}>ACTIONS</span>
                </div>
                {rows.map((row) => {
                  const primary = String(row[schema.primaryKey] || '—');
                  const secondary = schema.secondaryKey
                    ? Array.isArray(row[schema.secondaryKey])
                      ? (row[schema.secondaryKey] as string[]).join(', ')
                      : String(row[schema.secondaryKey] || '')
                    : '';
                  const statusVal = schema.statusKey ? row[schema.statusKey] : '';
                  const pill = statusPill(statusVal as string | boolean);
                  return (
                    <div
                      key={String(row.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 150px 120px',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '16px 18px',
                        borderBottom: '1px solid #141518',
                        transition: 'background .2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#0E0F12')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '15px',
                            letterSpacing: '-.01em',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {primary}
                        </div>
                        {secondary && (
                          <div
                            style={{
                              font: '500 11px var(--font-mono), monospace',
                              color: 'var(--text-3)',
                              marginTop: '3px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {secondary}
                          </div>
                        )}
                      </div>
                      <div>
                        <span
                          style={{
                            display: 'inline-flex',
                            font: '500 9.5px var(--font-mono), monospace',
                            letterSpacing: '.04em',
                            padding: '3px 9px',
                            borderRadius: '20px',
                            color: pill.fg,
                            background: pill.bg,
                            border: `1px solid ${pill.border}`,
                          }}
                        >
                          {statusVal === true
                            ? 'TRUE'
                            : statusVal === false
                              ? 'FALSE'
                              : String(statusVal || '—').toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => startEdit(row)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #2C3037',
                            borderRadius: '7px',
                            padding: '6px 11px',
                            color: 'var(--text-2)',
                            font: '500 11px var(--font-mono), monospace',
                            cursor: 'pointer',
                            transition: 'border-color .2s, color .2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent)';
                            e.currentTarget.style.color = 'var(--accent)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#2C3037';
                            e.currentTarget.style.color = 'var(--text-2)';
                          }}
                        >
                          {isReadOnly ? 'view' : 'edit'}
                        </button>
                        {!isReadOnly && (
                          <button
                            onClick={() => deleteRow(row.id)}
                            style={{
                              background: 'transparent',
                              border: '1px solid #2C3037',
                              borderRadius: '7px',
                              padding: '6px 9px',
                              color: 'var(--text-4)',
                              font: '500 11px var(--font-mono), monospace',
                              cursor: 'pointer',
                              transition: 'border-color .2s, color .2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#E5534B';
                              e.currentTarget.style.color = '#E5534B';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#2C3037';
                              e.currentTarget.style.color = 'var(--text-4)';
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  border: '1px dashed #2C3037',
                  borderRadius: '12px',
                  padding: '64px 24px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    font: '500 12px var(--font-mono), monospace',
                    color: 'var(--text-4)',
                    marginBottom: '14px',
                  }}
                >
                  // nothing here yet
                </div>
                {!isReadOnly && (
                  <button
                    onClick={startNew}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--accent)',
                      borderRadius: '8px',
                      padding: '9px 18px',
                      color: 'var(--accent)',
                      font: '600 12.5px var(--font-space), sans-serif',
                      cursor: 'pointer',
                    }}
                  >
                    + Create the first {schema.singular}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* FORM */}
        {view === 'form' && editing && (
          <div style={{ padding: '28px 32px 80px', maxWidth: '720px' }}>
            {schema.fields.map((f) => {
              const val = editing[f.key];
              const update = (v: unknown) => setField(f.key, v);
              return (
                <div key={f.key} style={{ marginBottom: '22px' }}>
                  <label
                    style={{
                      display: 'block',
                      font: '500 10px var(--font-mono), monospace',
                      letterSpacing: '.08em',
                      color: 'var(--text-3)',
                      marginBottom: '8px',
                    }}
                  >
                    {f.label}
                  </label>
                  {f.type === 'text' && (
                    <input
                      value={String(val ?? '')}
                      onChange={(e) => update(e.target.value)}
                      placeholder={f.placeholder}
                      readOnly={isReadOnly}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = '#2C3037')}
                    />
                  )}
                  {f.type === 'number' && (
                    <input
                      value={String(val ?? '')}
                      onChange={(e) => update(e.target.value)}
                      inputMode="numeric"
                      placeholder={f.placeholder}
                      readOnly={isReadOnly}
                      style={{
                        ...inputStyle,
                        width: '160px',
                        font: '500 14px var(--font-mono), monospace',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = '#2C3037')}
                    />
                  )}
                  {f.type === 'date' && (
                    <input
                      type="date"
                      value={String(val ?? '')}
                      onChange={(e) => update(e.target.value)}
                      readOnly={isReadOnly}
                      style={{
                        ...inputStyle,
                        width: 'auto',
                        font: '500 13px var(--font-mono), monospace',
                        colorScheme: 'dark',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = '#2C3037')}
                    />
                  )}
                  {f.type === 'textarea' && (
                    <textarea
                      value={String(val ?? '')}
                      onChange={(e) => update(e.target.value)}
                      rows={f.rows || 4}
                      placeholder={f.placeholder}
                      readOnly={isReadOnly}
                      style={{ ...inputStyle, lineHeight: 1.6, resize: 'vertical' }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = '#2C3037')}
                    />
                  )}
                  {f.type === 'select' && (
                    <select
                      value={String(val ?? '')}
                      onChange={(e) => update(e.target.value)}
                      disabled={isReadOnly}
                      style={{
                        ...inputStyle,
                        width: 'auto',
                        minWidth: '220px',
                        cursor: 'pointer',
                        font: '500 13.5px var(--font-space), sans-serif',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = '#2C3037')}
                    >
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {f.type === 'toggle' && (
                    <button
                      onClick={() => !isReadOnly && update(!val)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'transparent',
                        border: 'none',
                        cursor: isReadOnly ? 'default' : 'pointer',
                        padding: 0,
                      }}
                    >
                      <span
                        style={{
                          width: '42px',
                          height: '24px',
                          borderRadius: '20px',
                          background: val ? 'var(--accent)' : '#2C3037',
                          position: 'relative',
                          transition: 'background .2s',
                          display: 'inline-block',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '3px',
                            left: val ? '21px' : '3px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'var(--text-1)',
                            transition: 'left .2s',
                          }}
                        />
                      </span>
                      <span
                        style={{
                          font: '500 12.5px var(--font-space), sans-serif',
                          color: 'var(--text-2)',
                        }}
                      >
                        {val ? 'Yes' : 'No'}
                      </span>
                    </button>
                  )}
                  {f.type === 'tags' && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '7px',
                        alignItems: 'center',
                        background: '#0E0F12',
                        border: '1px solid #2C3037',
                        borderRadius: '9px',
                        padding: '9px 10px',
                      }}
                    >
                      {((val as string[]) || []).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            font: '500 11px var(--font-mono), monospace',
                            color: '#C7CBD1',
                            background: '#17181C',
                            border: '1px solid #2C3037',
                            borderRadius: '6px',
                            padding: '4px 8px',
                          }}
                        >
                          {tag}
                          {!isReadOnly && (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                update((val as string[]).filter((t) => t !== tag));
                              }}
                              style={{
                                color: 'var(--text-4)',
                                textDecoration: 'none',
                                fontWeight: 700,
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = '#E5534B')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-4)')}
                            >
                              ×
                            </a>
                          )}
                        </span>
                      ))}
                      {!isReadOnly && (
                        <input
                          placeholder={f.placeholder}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              const v = (e.target as HTMLInputElement).value
                                .trim()
                                .replace(',', '');
                              if (v) {
                                update([...((val as string[]) || []), v]);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          style={{
                            flex: 1,
                            minWidth: '120px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-1)',
                            font: '500 13px var(--font-space), sans-serif',
                            padding: '4px 2px',
                            outline: 'none',
                          }}
                        />
                      )}
                    </div>
                  )}
                  {f.help && (
                    <div
                      style={{
                        font: '500 11px var(--font-mono), monospace',
                        color: 'var(--text-4)',
                        marginTop: '7px',
                      }}
                    >
                      {f.help}
                    </div>
                  )}
                </div>
              );
            })}
            {isSingleton && !isReadOnly && (
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-1)',
                }}
              >
                <button
                  onClick={save}
                  style={{
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '11px 22px',
                    color: 'var(--canvas)',
                    font: '600 13px var(--font-space), sans-serif',
                    cursor: 'pointer',
                    transition: 'filter .2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
                >
                  Save Profile
                </button>
                <button
                  onClick={cancelForm}
                  style={{
                    background: 'transparent',
                    border: '1px solid #2C3037',
                    borderRadius: '8px',
                    padding: '11px 20px',
                    color: 'var(--text-2)',
                    font: '600 13px var(--font-space), sans-serif',
                    cursor: 'pointer',
                    transition: 'border-color .2s, color .2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#565B64';
                    e.currentTarget.style.color = 'var(--text-1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2C3037';
                    e.currentTarget.style.color = 'var(--text-2)';
                  }}
                >
                  Revert
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
