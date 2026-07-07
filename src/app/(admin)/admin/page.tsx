'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'toggle' | 'tags';

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  rows?: number;
  placeholder?: string;
  help?: string;
  onLabel?: string;
  offLabel?: string;
}

interface PageSettingsConfig {
  fields: FieldDef[];
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
  hasStatus?: boolean;
  pageSettings?: PageSettingsConfig;
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
    hasStatus: true,
    pageSettings: {
      fields: [
        {
          key: 'projects_subtitle',
          label: 'Page subtitle',
          type: 'textarea',
          rows: 2,
          placeholder: "Things I've shipped…",
          help: 'Description shown below the "Projects" heading on the projects page.',
        },
      ],
    },
    fields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        placeholder: 'Project name',
        help: 'Displayed as the project heading on the projects page.',
      },
      {
        key: 'slug',
        label: 'Slug',
        type: 'text',
        placeholder: 'project-slug',
        help: 'URL-safe identifier used in the project detail URL (e.g. /work/project-slug).',
      },
      {
        key: 'summary',
        label: 'Summary',
        type: 'textarea',
        rows: 2,
        placeholder: 'Short description shown on projects page',
        help: 'One or two sentences shown in the project card.',
      },
      {
        key: 'body',
        label: 'Body',
        type: 'textarea',
        rows: 10,
        placeholder: 'Full case study…',
        help: 'Markdown. Rendered on the full project detail page.',
      },
      {
        key: 'tags',
        label: 'Tags',
        type: 'tags',
        placeholder: 'Add tag…',
        help: 'Tech stack and labels. Include "side" or "product" to set the filter category.',
      },
      {
        key: 'repo_url',
        label: 'Repo URL',
        type: 'text',
        placeholder: 'https://github.com/…',
        help: 'Optional link to the source repository.',
      },
      {
        key: 'live_url',
        label: 'Live URL',
        type: 'text',
        placeholder: 'https://…',
        help: 'Optional link to the deployed/live version.',
      },
      {
        key: 'featured',
        label: 'Featured',
        type: 'toggle',
        help: 'Featured projects appear in the home page teaser.',
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
    hasStatus: true,
    pageSettings: {
      fields: [
        {
          key: 'writing_enabled',
          label: 'Writing Tab',
          type: 'toggle',
          onLabel: 'Enabled',
          offLabel: 'Disabled',
          help: 'When disabled, the Writing link is hidden from navigation and /writing returns 404.',
        },
        {
          key: 'writing_subtitle',
          label: 'Page subtitle',
          type: 'textarea',
          rows: 2,
          placeholder: 'Notes on systems…',
          help: 'Description shown below the "Writing" heading on the writing page.',
        },
      ],
    },
    fields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        placeholder: 'Post title',
        help: 'The headline shown in the writing list and on the post page.',
      },
      {
        key: 'slug',
        label: 'Slug',
        type: 'text',
        placeholder: 'post-slug',
        help: 'URL-safe identifier used in the post URL (e.g. /writing/post-slug).',
      },
      {
        key: 'excerpt',
        label: 'Excerpt',
        type: 'textarea',
        rows: 2,
        placeholder: 'One-sentence summary',
        help: 'Short preview shown in the writing list.',
      },
      {
        key: 'body',
        label: 'Body',
        type: 'textarea',
        rows: 14,
        placeholder: 'Post content…',
        help: 'Markdown. Rendered on the full post page.',
      },
      {
        key: 'tags',
        label: 'Tags',
        type: 'tags',
        placeholder: 'Add tag…',
        help: 'Category tags (e.g. engineering, community). First tag shows as the category label.',
      },
      {
        key: 'published_at',
        label: 'Published date',
        type: 'date',
        help: 'Sets the date shown on the post. Posts sort newest-first by this date.',
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
    pageSettings: {
      fields: [
        {
          key: 'experience_subtitle',
          label: 'Page subtitle',
          type: 'textarea',
          rows: 2,
          placeholder: 'The résumé, on the page…',
          help: 'Description shown below the "Experience" heading on the experience page.',
        },
      ],
    },
    fields: [
      {
        key: 'company',
        label: 'Company',
        type: 'text',
        placeholder: 'Company name',
        help: 'Organization or employer name.',
      },
      {
        key: 'role',
        label: 'Role',
        type: 'text',
        placeholder: 'Job title',
        help: 'Your title at this company.',
      },
      {
        key: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'San Antonio, TX',
        help: 'City and state shown below the role title.',
      },
      {
        key: 'start_date',
        label: 'Start date',
        type: 'date',
        help: 'When you started this role.',
      },
      {
        key: 'end_date',
        label: 'End date',
        type: 'date',
        help: 'Leave blank if this is your current role — it will show as "PRESENT".',
      },
      {
        key: '_bullets',
        label: 'Achievements',
        type: 'textarea',
        rows: 6,
        placeholder: 'Achievement 1\nAchievement 2',
        help: 'One achievement per line. Each line becomes a bullet on the experience page.',
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
    statusKey: 'category',
    fields: [
      {
        key: 'name',
        label: 'Skill',
        type: 'text',
        placeholder: 'TypeScript',
        help: 'The skill name as it will appear on your site.',
      },
      {
        key: 'category',
        label: 'Category',
        type: 'text',
        placeholder: 'Languages',
        help: 'Groups skills together on the home page. Use consistent names like Languages, Frameworks, Tools, Platforms.',
      },
    ],
  },
  involvement: {
    label: 'Involvement',
    singular: 'org',
    table: 'involvement_orgs',
    colName: 'NAME',
    primaryKey: 'name',
    statusKey: 'name',
    fields: [
      {
        key: 'name',
        label: 'Organization',
        type: 'text',
        placeholder: 'ACM San Antonio',
        help: 'Name of the community org, event series, or initiative.',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 2,
        placeholder: 'What the org does',
        help: 'A short summary of the organization shown on the experience page.',
      },
      {
        key: 'url',
        label: 'Website',
        type: 'text',
        placeholder: 'https://…',
        help: "Optional link to the org's website.",
      },
      {
        key: '_roles',
        label: 'Roles',
        type: 'textarea',
        rows: 4,
        placeholder: 'President | 2023-04 |\nMember | 2022-01 | 2023-03',
        help: 'One role per line: Role Title | Start (YYYY-MM) | End (YYYY-MM, blank = present). Most recent role shows on the experience page.',
      },
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
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Zaquariah Holland',
        help: 'Your full name shown in the site header and meta tags.',
      },
      {
        key: 'hero_title',
        label: 'Hero Title',
        type: 'textarea',
        rows: 2,
        placeholder: "I'm {{first_name}}. I build precise, well-architected software.",
        help: 'The large heading on the home page. Use {{first_name}} as a token for your first name.',
      },
      {
        key: 'tagline',
        label: 'Now',
        type: 'textarea',
        rows: 2,
        placeholder:
          'Building payments infra at SWIVEL, running ACM SA, reading too much about consensus protocols.',
        help: 'Shown in the "// now" blurb on the home page hero.',
      },
      {
        key: 'bio',
        label: 'Bio',
        type: 'textarea',
        rows: 4,
        placeholder: 'Short bio paragraph…',
        help: 'A paragraph about you shown in the home page hero.',
      },
      {
        key: 'terminal_status',
        label: 'Terminal Status',
        type: 'text',
        placeholder: 'heads-down · building',
        help: 'The status text shown in the home page terminal when not open to work.',
      },
      {
        key: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'San Antonio, TX',
        help: 'City shown in the left rail.',
      },
      {
        key: 'email',
        label: 'Email',
        type: 'text',
        placeholder: 'zaquariah@gmail.com',
        help: 'Shown in the contact section and used for the mailto link.',
      },
      {
        key: 'resume_url',
        label: 'Résumé URL',
        type: 'text',
        placeholder: 'https://…',
        help: 'Link to your résumé PDF. Used by the Download résumé button on the experience page.',
      },
      {
        key: 'open_to_work',
        label: 'Open to work',
        type: 'toggle',
        help: 'Shows a pulsing indicator in the left rail when enabled.',
      },
    ],
  },
  profile_links: {
    label: 'Links',
    singular: 'link',
    table: 'profile_links',
    colName: 'LABEL',
    primaryKey: 'label',
    secondaryKey: 'url',
    fields: [
      {
        key: 'label',
        label: 'Label',
        type: 'text',
        placeholder: 'GitHub',
        help: 'Display name shown next to the link.',
      },
      {
        key: 'url',
        label: 'URL',
        type: 'text',
        placeholder: 'https://github.com/…',
        help: 'Full URL the link points to.',
      },
    ],
  },
  education: {
    label: 'Education',
    singular: 'entry',
    table: 'education',
    colName: 'DEGREE',
    primaryKey: 'degree',
    secondaryKey: 'institution',
    fields: [
      {
        key: 'degree',
        label: 'Degree',
        type: 'text',
        placeholder: 'B.S. Computer Science',
        help: 'Degree name as it will appear on the experience page.',
      },
      {
        key: 'institution',
        label: 'Institution',
        type: 'text',
        placeholder: 'University of Texas at San Antonio',
        help: 'School or university name.',
      },
      {
        key: 'start_year',
        label: 'Start year',
        type: 'text',
        placeholder: '2018',
        help: 'Four-digit year you started.',
      },
      {
        key: 'end_year',
        label: 'End year',
        type: 'text',
        placeholder: '2022',
        help: 'Four-digit year you graduated. Leave blank for in-progress.',
      },
    ],
  },
  certifications: {
    label: 'Certifications',
    singular: 'certification',
    table: 'certifications',
    colName: 'NAME',
    primaryKey: 'name',
    secondaryKey: 'issuer',
    fields: [
      {
        key: 'name',
        label: 'Certification name',
        type: 'text',
        placeholder: 'AWS Solutions Architect — Associate',
        help: 'Full certification title.',
      },
      {
        key: 'issuer',
        label: 'Issuer',
        type: 'text',
        placeholder: 'Amazon Web Services',
        help: 'Organization that issued the certification.',
      },
      {
        key: 'year',
        label: 'Year',
        type: 'text',
        placeholder: '2023',
        help: 'Year you earned or renewed it.',
      },
    ],
  },
  achievements: {
    label: 'Awards',
    singular: 'award',
    table: 'achievements',
    colName: 'TITLE',
    primaryKey: 'title',
    secondaryKey: 'date',
    statusKey: 'visibility',
    fields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        placeholder: 'Best Overall Hack — RowdyHacks',
        help: 'Award or achievement name.',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 2,
        placeholder: 'What the award was for…',
        help: 'Optional context shown on the public site.',
      },
      {
        key: 'date',
        label: 'Date',
        type: 'date',
        help: 'Date of the award.',
      },
      {
        key: 'evidence_url',
        label: 'Evidence URL',
        type: 'text',
        placeholder: 'https://…',
        help: 'Optional link to proof (certificate, devpost, article, etc.).',
      },
      {
        key: '_visibility_public',
        label: 'Public',
        type: 'toggle',
        help: 'Show this award on the public site.',
      },
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
      {
        key: 'source_note',
        label: 'Source note',
        type: 'text',
        help: 'Where this import came from.',
      },
      {
        key: 'raw_payload',
        label: 'Payload (JSON)',
        type: 'textarea',
        rows: 14,
        help: 'Raw JSON data from the import.',
      },
      {
        key: 'reviewed',
        label: 'Reviewed',
        type: 'toggle',
        help: 'Mark as reviewed once processed.',
      },
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

type ToastVariant = 'success' | 'error' | 'info';

const TOAST_STYLES: Record<ToastVariant, { border: string; color: string; dot: string }> = {
  success: { border: '#1a3d23', color: '#7EE787', dot: '#7EE787' },
  error: { border: '#3d1a1a', color: '#E5534B', dot: '#E5534B' },
  info: { border: '#2C3037', color: 'var(--text-1)', dot: 'var(--text-4)' },
};

function Toast({
  msg,
  variant,
  onDone,
}: {
  msg: string;
  variant: ToastVariant;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  const s = TOAST_STYLES[variant];
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        zIndex: 99,
        background: '#17181C',
        border: `1px solid ${s.border}`,
        borderRadius: '10px',
        padding: '11px 20px',
        font: '500 12.5px var(--font-space), sans-serif',
        color: s.color,
        boxShadow: '0 12px 32px rgba(0,0,0,.5)',
        animation: 'toastin .25s ease',
        whiteSpace: 'nowrap',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {msg}
    </div>
  );
}

const SECTION_GROUPS = [
  {
    key: 'home',
    label: 'Home',
    tabs: [
      { key: 'profile' as const, label: 'About' },
      { key: 'skills' as const, label: 'Skills' },
      { key: 'profile_links' as const, label: 'Links' },
    ],
  },
  {
    key: 'projects',
    label: 'Projects',
    tabs: [{ key: 'projects' as const, label: 'Projects' }],
  },
  {
    key: 'writing',
    label: 'Writing',
    tabs: [{ key: 'posts' as const, label: 'Posts' }],
  },
  {
    key: 'experience',
    label: 'Experience',
    tabs: [
      { key: 'experience' as const, label: 'Work' },
      { key: 'involvement' as const, label: 'Community' },
      { key: 'education' as const, label: 'Education' },
      { key: 'certifications' as const, label: 'Certifications' },
      { key: 'achievements' as const, label: 'Awards' },
    ],
  },
  {
    key: 'import',
    label: 'Import Queue',
    tabs: [{ key: 'staging' as const, label: 'Queue' }],
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [section, setSection] = useState<keyof typeof SCHEMAS>('profile');
  const [activeGroup, setActiveGroup] = useState('home');
  const [lists, setLists] = useState<Record<string, Record<string, unknown>[]>>({});
  const [profileData, setProfileData] = useState<Record<string, unknown>>({});
  const [pageSettingsForm, setPageSettingsForm] = useState<Record<string, unknown>>({});
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [toast, setToast] = useState<{ msg: string; variant: ToastVariant } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: unknown; label: string } | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [isPageSettingsDirty, setIsPageSettingsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const dragIdx = useRef<number | null>(null);
  const pendingNavRef = useRef<(() => void) | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const showToast = useCallback(
    (msg: string, variant: ToastVariant = 'info') => setToast({ msg, variant }),
    [],
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  useEffect(() => {
    const cfg = SCHEMAS[section]?.pageSettings;
    if (!cfg) return;
    const form: Record<string, unknown> = {};
    cfg.fields.forEach((f) => {
      form[f.key] = profileData[f.key] ?? (f.type === 'toggle' ? false : '');
    });
    setPageSettingsForm(form);
    setIsPageSettingsDirty(false);
  }, [section, profileData]);

  const guardNav = (action: () => void) => {
    if (isDirty || isPageSettingsDirty) {
      pendingNavRef.current = action;
      setShowUnsavedModal(true);
    } else {
      action();
    }
  };

  const discardAndNav = () => {
    setIsDirty(false);
    setIsPageSettingsDirty(false);
    setEditing(null);
    setView('list');
    setShowUnsavedModal(false);
    pendingNavRef.current?.();
    pendingNavRef.current = null;
  };

  const savePageSettings = useCallback(async () => {
    if (!profileData.id) return;
    const cfg = SCHEMAS[section]?.pageSettings;
    if (!cfg) return;
    const payload: Record<string, unknown> = {};
    cfg.fields.forEach((f) => {
      payload[f.key] = pageSettingsForm[f.key];
    });
    const { error } = await supabase.from('profile').update(payload).eq('id', profileData.id);
    if (error) {
      showToast(`Save failed: ${error.message}`, 'error');
      return;
    }
    setProfileData((d) => ({ ...d, ...payload }));
    setIsPageSettingsDirty(false);
    showToast('Page settings saved.', 'success');
  }, [profileData, section, pageSettingsForm, supabase, showToast]);

  const loadSection = useCallback(
    async (s: keyof typeof SCHEMAS) => {
      const schema = SCHEMAS[s];
      if (schema.singleton) {
        const { data } = await supabase.from(schema.table).select('*').maybeSingle();
        if (data) setProfileData(data as Record<string, unknown>);
      } else {
        let query = supabase
          .from(schema.table)
          .select(
            s === 'experience'
              ? '*, experience_bullets(*)'
              : s === 'involvement'
                ? '*, involvement_roles(*)'
                : '*',
          );
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
              : s === 'involvement'
                ? (data as unknown as Record<string, unknown>[]).map((row) => {
                    const roles =
                      (row.involvement_roles as
                        | { role: string; start_date: string; end_date: string | null }[]
                        | null) ?? [];
                    return {
                      ...row,
                      _roles: roles
                        .map(
                          (r) =>
                            `${r.role} | ${r.start_date.slice(0, 7)} | ${r.end_date ? r.end_date.slice(0, 7) : ''}`,
                        )
                        .join('\n'),
                    };
                  })
                : (data as unknown as Record<string, unknown>[]).map((row) =>
                    schema.table === 'import_staging'
                      ? { ...row, raw_payload: JSON.stringify(row.raw_payload, null, 2) }
                      : schema.table === 'achievements'
                        ? { ...row, _visibility_public: row.visibility === 'public' }
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

  // Keep a ref so post-load effects can read profileData without stale closure
  const profileDataRef = useRef<Record<string, unknown>>({});
  useEffect(() => {
    profileDataRef.current = profileData;
  }, [profileData]);

  // After data loads, enter form view for singleton sections
  useEffect(() => {
    if (loadingData) return;
    if (SCHEMAS[section]?.singleton) {
      setEditing({ ...profileDataRef.current });
      setView('form');
    }
  }, [loadingData, section]);

  const schema = SCHEMAS[section];
  const isSingleton = !!schema.singleton;
  const isReadOnly = !!schema.readOnly;
  const rows = isSingleton ? [] : lists[section] || [];

  // Update document title when section changes
  useEffect(() => {
    document.title = `Admin | ${schema.label}`;
  }, [schema.label]);

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

  const goGroup = (groupKey: string) => {
    const group = SECTION_GROUPS.find((g) => g.key === groupKey);
    if (!group) return;
    setActiveGroup(groupKey);
    goSection(group.tabs[0].key);
  };

  const startNew = () => {
    setIsDirty(false);
    const blank: Record<string, unknown> = {};
    schema.fields.forEach((f) => {
      blank[f.key] = f.type === 'toggle' ? false : f.type === 'tags' ? [] : '';
    });
    setEditing(blank);
    setView('form');
  };

  const startEdit = (row: Record<string, unknown>) => {
    setIsDirty(false);
    setEditing({ ...row });
    setView('form');
  };

  const deleteRow = async (id: unknown) => {
    const { error } = await supabase.from(schema.table).delete().eq('id', id);
    if (error) {
      showToast('Delete failed.', 'error');
      return;
    }
    setLists((d) => ({ ...d, [section]: d[section].filter((r) => r.id !== id) }));
    showToast('Deleted.', 'success');
  };

  const saveWithStatus = async (status?: string) => {
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
          console.error('Save failed:', error);
          showToast(`Save failed: ${error.message}`, 'error');
          return;
        }
      } else {
        const { error } = await supabase.from(schema.table).insert(payload);
        if (error) {
          console.error('Save failed:', error);
          showToast(`Save failed: ${error.message}`, 'error');
          return;
        }
      }
      await loadSection(section);
      setIsDirty(false);
      showToast('Profile saved.', 'success');
      return;
    }

    const payload = { ...editing } as Record<string, unknown>;
    const bulletsText = payload._bullets as string | undefined;
    const rolesText = payload._roles as string | undefined;
    delete payload._bullets;
    delete payload._roles;
    delete payload.experience_bullets;
    delete payload.involvement_roles;
    delete payload.created_at;
    delete payload.updated_at;

    if (section === 'achievements') {
      payload.visibility = payload._visibility_public ? 'public' : 'private';
      delete payload._visibility_public;
    }

    if (status !== undefined) payload.status = status;

    if (section === 'staging' && typeof payload.raw_payload === 'string') {
      try {
        payload.raw_payload = JSON.parse(payload.raw_payload);
      } catch {
        showToast('Invalid JSON in payload.', 'error');
        return;
      }
    }

    // Assign next display_order for new records
    if (!payload.id && schema.table !== 'import_staging') {
      payload.display_order = rows.length;
    }

    // Coerce empty strings to null for date fields so Postgres doesn't choke on ''
    for (const f of schema.fields) {
      if (f.type === 'date' && payload[f.key] === '') {
        payload[f.key] = null;
      }
    }

    // skills: default source to 'self'
    if (section === 'skills' && !payload.id) {
      payload.source = 'self';
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
        console.error('Save failed:', error);
        showToast(`Save failed: ${error.message}`, 'error');
        return;
      }
      savedId = data.id;
    } else {
      const { error } = await supabase.from(schema.table).update(payload).eq('id', payload.id);
      if (error) {
        console.error('Save failed:', error);
        showToast(`Save failed: ${error.message}`, 'error');
        return;
      }
    }

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

    if (section === 'involvement' && savedId !== undefined) {
      await supabase.from('involvement_roles').delete().eq('org_id', savedId);
      const lines = (rolesText ?? '')
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);
      if (lines.length > 0) {
        await supabase.from('involvement_roles').insert(
          lines
            .map((line, i) => {
              const [role, start, end] = line.split('|').map((s) => s.trim());
              return {
                org_id: savedId,
                role: role ?? '',
                start_date: start ? `${start}-01` : null,
                end_date: end ? `${end}-01` : null,
                metrics: {},
                display_order: i,
              };
            })
            .filter((r) => r.role && r.start_date),
        );
      }
    }

    await loadSection(section);
    setIsDirty(false);
    setView('list');
    setEditing(null);
    showToast(
      status === 'published' ? 'Published.' : status === 'draft' ? 'Saved as draft.' : 'Saved.',
      'success',
    );
  };

  const cancelForm = () => {
    setIsDirty(false);
    if (isSingleton) {
      setEditing({ ...profileData });
    } else {
      setView('list');
      setEditing(null);
    }
  };

  const setField = (key: string, val: unknown) => {
    setIsDirty(true);
    setEditing((e) => (e ? { ...e, [key]: val } : e));
  };

  // Drag-and-drop reordering
  const handleDrop = async (toIdx: number) => {
    const fromIdx = dragIdx.current;
    if (fromIdx === null || fromIdx === toIdx) return;
    dragIdx.current = null;

    const newRows = [...rows];
    const [item] = newRows.splice(fromIdx, 1);
    newRows.splice(toIdx, 0, item);

    setLists((d) => ({ ...d, [section]: newRows }));

    await Promise.all(
      newRows.map((r, idx) =>
        supabase.from(schema.table).update({ display_order: idx }).eq('id', r.id),
      ),
    );
  };

  const renderField = (
    f: FieldDef,
    val: unknown,
    update: (v: unknown) => void,
    readOnly = false,
    style: React.CSSProperties = {},
  ) => {
    const base: React.CSSProperties = {
      width: '100%',
      background: '#0E0F12',
      border: '1px solid #2C3037',
      borderRadius: '9px',
      padding: '11px 13px',
      color: 'var(--text-1)',
      font: '500 14px var(--font-space), sans-serif',
      transition: 'border-color .2s',
      outline: 'none',
      ...style,
    };
    if (f.type === 'text')
      return (
        <input
          value={String(val ?? '')}
          onChange={(e) => update(e.target.value)}
          placeholder={f.placeholder}
          readOnly={readOnly}
          style={base}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = '#2C3037')}
        />
      );
    if (f.type === 'textarea')
      return (
        <textarea
          value={String(val ?? '')}
          onChange={(e) => update(e.target.value)}
          rows={f.rows || 4}
          placeholder={f.placeholder}
          readOnly={readOnly}
          style={{ ...base, lineHeight: 1.6, resize: 'vertical' }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = '#2C3037')}
        />
      );
    if (f.type === 'toggle')
      return (
        <button
          onClick={() => !readOnly && update(!val)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'transparent',
            border: 'none',
            cursor: readOnly ? 'default' : 'pointer',
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
            style={{ font: '500 12.5px var(--font-space), sans-serif', color: 'var(--text-2)' }}
          >
            {val ? (f.onLabel ?? 'Yes') : (f.offLabel ?? 'No')}
          </span>
        </button>
      );
    return null;
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

  const currentGroup = SECTION_GROUPS.find((g) => g.tabs.some((t) => t.key === section));
  const groupCount = (g: (typeof SECTION_GROUPS)[0]) => {
    if (g.tabs.length === 1 && SCHEMAS[g.tabs[0].key].singleton) return '·';
    const total = g.tabs.reduce((n, t) => n + (lists[t.key]?.length ?? 0), 0);
    return total > 0 ? String(total) : '—';
  };

  const pageTitle = isSingleton
    ? 'About'
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

  const btnBase: React.CSSProperties = {
    border: 'none',
    borderRadius: '8px',
    padding: '9px 18px',
    font: '600 12.5px var(--font-space), sans-serif',
    cursor: 'pointer',
    transition: 'filter .2s',
  };

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
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
            {SECTION_GROUPS.map((g) => {
              const active = activeGroup === g.key;
              return (
                <a
                  key={g.key}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    guardNav(() => goGroup(g.key));
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
                      {g.label}
                    </span>
                  </span>
                  <span
                    style={{ font: '500 10px var(--font-mono), monospace', color: 'var(--text-4)' }}
                  >
                    {groupCount(g)}
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
                    ...btnBase,
                    background: 'transparent',
                    border: '1px solid #2C3037',
                    color: 'var(--text-2)',
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
                {!isReadOnly && schema.hasStatus ? (
                  <>
                    <button
                      onClick={() => saveWithStatus('draft')}
                      style={{
                        ...btnBase,
                        background: 'transparent',
                        border: '1px solid #2C3037',
                        color: 'var(--text-2)',
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
                      Save as draft
                    </button>
                    <button
                      onClick={() => saveWithStatus('published')}
                      style={{ ...btnBase, background: 'var(--accent)', color: 'var(--canvas)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
                    >
                      Publish
                    </button>
                  </>
                ) : !isReadOnly ? (
                  <button
                    onClick={() => saveWithStatus(undefined)}
                    style={{ ...btnBase, background: 'var(--accent)', color: 'var(--canvas)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
                  >
                    Save
                  </button>
                ) : null}
              </>
            ) : view === 'list' && !isSingleton && !isReadOnly ? (
              <button
                onClick={startNew}
                style={{
                  ...btnBase,
                  background: 'var(--accent)',
                  color: 'var(--canvas)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
              >
                + New {schema.singular}
              </button>
            ) : null}
          </div>
        </div>

        {/* SUB-TABS */}
        {currentGroup && currentGroup.tabs.length > 1 && view !== 'form' && (
          <div
            style={{
              display: 'flex',
              gap: '0',
              borderBottom: '1px solid var(--border-1)',
              padding: '0 32px',
              background: 'rgba(11,12,14,0.6)',
            }}
          >
            {currentGroup.tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => guardNav(() => goSection(tab.key))}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom:
                    section === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                  padding: '12px 16px',
                  color: section === tab.key ? 'var(--text-1)' : 'var(--text-3)',
                  font: '500 13px var(--font-space), sans-serif',
                  cursor: 'pointer',
                  transition: 'color .2s, border-color .2s',
                  marginBottom: '-1px',
                }}
                onMouseEnter={(e) => {
                  if (section !== tab.key) e.currentTarget.style.color = 'var(--text-2)';
                }}
                onMouseLeave={(e) => {
                  if (section !== tab.key) e.currentTarget.style.color = 'var(--text-3)';
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* PAGE SETTINGS */}
        {view === 'list' && !isSingleton && schema.pageSettings && (
          <div style={{ padding: '26px 32px 0' }}>
            <div
              style={{
                border: '1px solid var(--border-1)',
                borderRadius: '12px',
                padding: '20px 24px',
                background: '#0C0D10',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '18px',
                }}
              >
                <div
                  style={{
                    font: '500 9.5px var(--font-mono), monospace',
                    letterSpacing: '.08em',
                    color: 'var(--text-4)',
                  }}
                >
                  PAGE SETTINGS
                </div>
                <button
                  onClick={savePageSettings}
                  style={{
                    ...btnBase,
                    background: 'var(--accent)',
                    color: 'var(--canvas)',
                    padding: '7px 14px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
                >
                  Save
                </button>
              </div>
              {schema.pageSettings.fields.map((f) => (
                <div key={f.key} style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      font: '600 12px var(--font-space), sans-serif',
                      color: 'var(--text-2)',
                      marginBottom: '4px',
                    }}
                  >
                    {f.label}
                  </label>
                  {f.help && (
                    <div
                      style={{
                        font: '400 12px var(--font-space), sans-serif',
                        color: 'var(--text-4)',
                        marginBottom: '8px',
                        lineHeight: 1.5,
                      }}
                    >
                      {f.help}
                    </div>
                  )}
                  {renderField(f, pageSettingsForm[f.key], (v) => {
                    setPageSettingsForm((d) => ({ ...d, [f.key]: v }));
                    setIsPageSettingsDirty(true);
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

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
                    gridTemplateColumns: '28px 1fr 150px 120px',
                    gap: '16px',
                    padding: '12px 18px',
                    background: '#0E0F12',
                    borderBottom: '1px solid var(--border-1)',
                    font: '500 9.5px var(--font-mono), monospace',
                    letterSpacing: '.08em',
                    color: 'var(--text-4)',
                  }}
                >
                  <span />
                  <span>{schema.colName}</span>
                  <span>STATUS</span>
                  <span style={{ textAlign: 'right' }}>ACTIONS</span>
                </div>
                {rows.map((row, i) => {
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
                      draggable
                      onDragStart={() => {
                        dragIdx.current = i;
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(i)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '28px 1fr 150px 120px',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '16px 18px',
                        borderBottom: '1px solid #141518',
                        transition: 'background .2s',
                        cursor: 'grab',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#0E0F12')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          color: 'var(--text-5)',
                          fontSize: '14px',
                          cursor: 'grab',
                          userSelect: 'none',
                          letterSpacing: '1px',
                        }}
                      >
                        ⠿
                      </div>
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
                      <div
                        style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}
                        onClick={(e) => e.stopPropagation()}
                        onDragStart={(e) => e.stopPropagation()}
                      >
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
                            onClick={() =>
                              setDeleteConfirm({
                                id: row.id,
                                label: String(row[schema.primaryKey] ?? row.id ?? ''),
                              })
                            }
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
                <div key={f.key} style={{ marginBottom: '26px' }}>
                  <label
                    style={{
                      display: 'block',
                      font: '600 12px var(--font-space), sans-serif',
                      color: 'var(--text-2)',
                      marginBottom: '4px',
                    }}
                  >
                    {f.label}
                  </label>
                  {f.help && (
                    <div
                      style={{
                        font: '400 12px var(--font-space), sans-serif',
                        color: 'var(--text-4)',
                        marginBottom: '8px',
                        lineHeight: 1.5,
                      }}
                    >
                      {f.help}
                    </div>
                  )}
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
                        {val ? (f.onLabel ?? 'Yes') : (f.offLabel ?? 'No')}
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
                  onClick={() => saveWithStatus(undefined)}
                  style={{ ...btnBase, background: 'var(--accent)', color: 'var(--canvas)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
                >
                  Save Profile
                </button>
                <button
                  onClick={cancelForm}
                  style={{
                    ...btnBase,
                    background: 'transparent',
                    border: '1px solid #2C3037',
                    color: 'var(--text-2)',
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

      {toast && <Toast msg={toast.msg} variant={toast.variant} onDone={() => setToast(null)} />}

      {deleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              background: '#0E0F12',
              border: '1px solid #2C3037',
              borderRadius: '14px',
              padding: '28px 32px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 24px 64px rgba(0,0,0,.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                font: '600 16px var(--font-space), sans-serif',
                color: 'var(--text-1)',
                marginBottom: '8px',
              }}
            >
              Delete {schema.singular}?
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text-3)',
                marginBottom: '24px',
                lineHeight: 1.55,
              }}
            >
              This will permanently delete{' '}
              <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{deleteConfirm.label}</span>
              . This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid #2C3037',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  color: 'var(--text-2)',
                  font: '500 13px var(--font-space), sans-serif',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteRow(deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
                style={{
                  background: '#3d1a1a',
                  border: '1px solid #5c2a2a',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  color: '#E5534B',
                  font: '600 13px var(--font-space), sans-serif',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showUnsavedModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowUnsavedModal(false)}
        >
          <div
            style={{
              background: '#0E0F12',
              border: '1px solid #2C3037',
              borderRadius: '14px',
              padding: '28px 32px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                font: '600 16px var(--font-space), sans-serif',
                marginBottom: '10px',
              }}
            >
              Unsaved changes
            </div>
            <div
              style={{
                font: '400 13.5px var(--font-space), sans-serif',
                color: 'var(--text-3)',
                lineHeight: 1.55,
                marginBottom: '24px',
              }}
            >
              You have unsaved changes on this page. Leave anyway?
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowUnsavedModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #2C3037',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  color: 'var(--text-2)',
                  font: '600 12.5px var(--font-space), sans-serif',
                  cursor: 'pointer',
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
                Stay
              </button>
              <button
                onClick={discardAndNav}
                style={{
                  background: '#E5534B',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  color: '#fff',
                  font: '600 12.5px var(--font-space), sans-serif',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
              >
                Discard &amp; leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
