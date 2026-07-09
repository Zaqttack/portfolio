import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const ACCENT = '#EC6A2C';
const TEXT = '#111111';
const MUTED = '#555555';
const RULE = '#CCCCCC';

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: TEXT,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 42,
    lineHeight: 1.4,
  },
  // ── Header ──────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerLeft: { flex: 1 },
  headerRight: { alignItems: 'flex-end' },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24,
    letterSpacing: 0.4,
    marginBottom: 18,
  },
  subtitle: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: ACCENT,
  },
  contactLine: {
    fontSize: 8.5,
    color: MUTED,
    marginBottom: 2,
  },
  contactLink: {
    fontSize: 8.5,
    color: MUTED,
    textDecoration: 'none',
  },
  divider: {
    borderBottomWidth: 1.5,
    borderBottomColor: TEXT,
    borderBottomStyle: 'solid',
    marginBottom: 10,
  },
  bio: {
    fontSize: 9.5,
    color: TEXT,
    marginBottom: 12,
    lineHeight: 1.55,
  },
  // ── Sections ────────────────────────────────────────────────────────
  section: { marginBottom: 10 },
  sectionHeader: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    letterSpacing: 1.4,
    color: ACCENT,
    textTransform: 'uppercase',
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
    borderBottomStyle: 'solid',
  },
  // ── Experience / Involvement ─────────────────────────────────────────
  entry: { marginBottom: 8 },
  entryTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginBottom: 1,
  },
  entryMeta: {
    fontSize: 8.5,
    color: MUTED,
    marginBottom: 2,
  },
  bullet: { flexDirection: 'row', marginTop: 2, paddingLeft: 2 },
  bulletDot: { width: 9, flexShrink: 0, color: TEXT, marginTop: 0.5 },
  bulletText: { flex: 1, color: TEXT },
  // ── Projects ────────────────────────────────────────────────────────
  projEntry: { marginBottom: 7 },
  projRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  projTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9.5 },
  projUrl: { fontSize: 8.5, color: MUTED, textDecoration: 'none' },
  projStack: { fontSize: 8.5, color: MUTED, marginTop: 1 },
  projSummary: { fontSize: 9, color: MUTED, marginTop: 1.5 },
  // ── Skills ──────────────────────────────────────────────────────────
  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillCat: { fontFamily: 'Helvetica-Bold', width: 140, flexShrink: 0, fontSize: 9.5 },
  skillList: { flex: 1, color: MUTED },
  // ── Education ───────────────────────────────────────────────────────
  eduEntry: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  eduLeft: { flex: 1 },
  eduInst: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  eduDegree: { color: MUTED, marginTop: 1, fontSize: 9 },
  eduYear: { color: MUTED, fontSize: 8.5, textAlign: 'right' },
  // ── Certifications ──────────────────────────────────────────────────
  certEntry: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  certLeft: { flex: 1 },
  certName: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  certIssuer: { color: MUTED, fontSize: 8.5, marginTop: 1 },
  certYear: { color: MUTED, fontSize: 8.5 },
});

function fmtDate(d: string | null): string {
  if (!d) return 'Present';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function fmtMonthYear(d: string | null): string {
  if (!d) return 'Present';
  const [year, month] = d.split('-');
  const dt = new Date(parseInt(year), parseInt(month) - 1);
  return dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

type ProfileRow = Record<string, unknown>;
type LinkRow = { label: string; url: string };
type ExpRow = {
  company: string | null;
  company_data?: { name: string; website_url?: string | null } | null;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  tech_tags?: string[] | null;
  experience_bullets?: { text: string; visibility: string }[] | null;
};
type ProjRow = {
  title: string;
  summary: string | null;
  tags: string[];
  repo_url: string | null;
  live_url: string | null;
  started_at?: string | null;
  ended_at?: string | null;
};
type SkillRow = { name: string; category: string | null };
type EduRow = { institution: string; degree: string; start_year: string; end_year: string | null };
type CertRow = { name: string; issuer: string | null; year: string | null };
type InvolvementRole = {
  role: string;
  start_date: string;
  end_date: string | null;
  highlights: string[] | null;
};
type InvolvementRow = {
  name: string;
  description: string | null;
  involvement_roles?: InvolvementRole[] | null;
};

interface ResumeProps {
  profile: ProfileRow;
  links: LinkRow[];
  experience: ExpRow[];
  projects: ProjRow[];
  skills: SkillRow[];
  education: EduRow[];
  certifications: CertRow[];
  involvement: InvolvementRow[];
}

export default function ResumeDoc({
  profile,
  links,
  experience,
  projects,
  skills,
  education,
  certifications,
  involvement,
}: ResumeProps) {
  const name = String(profile.name ?? '');
  const email = String(profile.email ?? '');
  const location = String(profile.location ?? '').replace(' · ', ', ');
  const bio = String(profile.bio ?? '');

  // Derive current role for subtitle
  const currentRole = experience.find((e) => !e.end_date)?.role ?? '';
  const subtitle = currentRole;

  // Right column: email first, then all profile links
  const rightContact: { text: string; href?: string }[] = [];
  if (email) rightContact.push({ text: email, href: `mailto:${email}` });
  for (const link of links) {
    const display = link.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    rightContact.push({ text: display, href: link.url });
  }
  if (profile.phone) rightContact.push({ text: String(profile.phone) });

  // Skills grouped by category
  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, sk) => {
    const cat = sk.category ?? 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sk.name);
    return acc;
  }, {});

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.name}>{name}</Text>
            {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
            {location ? <Text style={[s.contactLine, { marginTop: 6 }]}>{location}</Text> : null}
          </View>
          <View style={s.headerRight}>
            {rightContact.map((item, i) =>
              item.href ? (
                <Link key={i} src={item.href} style={s.contactLink}>
                  {item.text}
                </Link>
              ) : (
                <Text key={i} style={s.contactLine}>
                  {item.text}
                </Text>
              ),
            )}
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Bio ── */}
        {bio ? <Text style={s.bio}>{bio}</Text> : null}

        {/* ── Professional Experience ── */}
        {experience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionHeader}>Professional Experience</Text>
            {experience.map((exp, i) => {
              const company = exp.company_data?.name ?? exp.company ?? '';
              const bullets = (exp.experience_bullets ?? []).filter(
                (b) => b.visibility === 'public',
              );
              const dates = `${fmtDate(exp.start_date)} – ${fmtDate(exp.end_date)}`;
              return (
                <View key={i} style={s.entry}>
                  <Text style={s.entryTitle}>
                    {exp.role}
                    {company ? ` - ${company}` : ''} ({dates})
                  </Text>
                  {exp.location ? <Text style={s.entryMeta}>{exp.location}</Text> : null}
                  {bullets.map((b, j) => (
                    <View key={j} style={s.bullet}>
                      <Text style={s.bulletDot}>{'•'}</Text>
                      <Text style={s.bulletText}>{b.text}</Text>
                    </View>
                  ))}
                  {exp.tech_tags && exp.tech_tags.length > 0 ? (
                    <Text style={[s.entryMeta, { marginTop: 3 }]}>{exp.tech_tags.join(' · ')}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionHeader}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={s.eduEntry}>
                <View style={s.eduLeft}>
                  <Text style={s.eduInst}>{edu.institution}</Text>
                  <Text style={s.eduDegree}>{edu.degree}</Text>
                </View>
                <Text style={s.eduYear}>
                  {edu.start_year}
                  {edu.end_year ? ` – ${edu.end_year}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Technical Skills ── */}
        {Object.keys(skillsByCategory).length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionHeader}>Technical Skills</Text>
            {Object.entries(skillsByCategory).map(([cat, names], i) => (
              <View key={i} style={s.skillRow}>
                <Text style={s.skillCat}>{cat}</Text>
                <Text style={s.skillList}>{names.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Projects ── */}
        {projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionHeader}>Projects</Text>
            {projects.map((proj, i) => {
              const url = proj.live_url ?? proj.repo_url;
              const stack = proj.tags.filter((t) => t !== 'product' && t !== 'side');
              const projDates = proj.started_at
                ? proj.ended_at
                  ? `${fmtDate(proj.started_at)} – ${fmtDate(proj.ended_at)}`
                  : proj.started_at === proj.ended_at
                    ? fmtDate(proj.started_at)
                    : `${fmtDate(proj.started_at)} – Present`
                : null;
              return (
                <View key={i} style={s.projEntry}>
                  <View style={s.projRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                      <Text style={s.projTitle}>{proj.title}</Text>
                      {projDates ? (
                        <Text style={[s.projStack, { marginTop: 0 }]}>{projDates}</Text>
                      ) : null}
                    </View>
                    {url && (
                      <Link src={url} style={s.projUrl}>
                        {url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      </Link>
                    )}
                  </View>
                  {stack.length > 0 && <Text style={s.projStack}>{stack.join(', ')}</Text>}
                  {proj.summary && <Text style={s.projSummary}>{proj.summary}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* ── Involvement ── */}
        {involvement.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionHeader}>Involvement</Text>
            {involvement.map((org, i) => {
              const roles = org.involvement_roles ?? [];
              if (roles.length === 0) {
                return (
                  <View key={i} style={s.entry}>
                    <Text style={s.entryTitle}>{org.name}</Text>
                    {org.description ? (
                      <View style={s.bullet}>
                        <Text style={s.bulletDot}>{'•'}</Text>
                        <Text style={s.bulletText}>{org.description}</Text>
                      </View>
                    ) : null}
                  </View>
                );
              }
              return roles.map((r, j) => {
                const dates = `${fmtMonthYear(r.start_date)} – ${fmtMonthYear(r.end_date)}`;
                const highlights = r.highlights ?? [];
                return (
                  <View key={`${i}-${j}`} style={s.entry}>
                    <Text style={s.entryTitle}>
                      {r.role} - {org.name} ({dates})
                    </Text>
                    {highlights.map((h, k) => (
                      <View key={k} style={s.bullet}>
                        <Text style={s.bulletDot}>{'•'}</Text>
                        <Text style={s.bulletText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                );
              });
            })}
          </View>
        )}

        {/* ── Certifications ── */}
        {certifications.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionHeader}>Certifications</Text>
            {certifications.map((cert, i) => (
              <View key={i} style={s.certEntry}>
                <View style={s.certLeft}>
                  <Text style={s.certName}>{cert.name}</Text>
                  {cert.issuer && <Text style={s.certIssuer}>{cert.issuer}</Text>}
                </View>
                {cert.year && <Text style={s.certYear}>{cert.year}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
