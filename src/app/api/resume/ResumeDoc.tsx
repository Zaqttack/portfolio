import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const ACCENT = '#EC6A2C';
const TEXT = '#111111';
const MUTED = '#555555';
const RULE = '#DDDDDD';

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: TEXT,
    paddingTop: 38,
    paddingBottom: 38,
    paddingHorizontal: 44,
    lineHeight: 1.35,
  },
  // Header
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    color: MUTED,
    fontSize: 9,
    marginBottom: 14,
  },
  contactSep: { color: RULE, marginHorizontal: 3 },
  // Section
  section: { marginBottom: 12 },
  sectionHeader: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    letterSpacing: 1.2,
    color: ACCENT,
    textTransform: 'uppercase',
    marginBottom: 5,
    paddingBottom: 4,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
    borderBottomStyle: 'solid',
  },
  // Experience entry
  expEntry: { marginBottom: 9 },
  expTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  expCompany: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  expDates: { color: MUTED, fontSize: 8.5, marginTop: 1 },
  expRole: { color: MUTED, fontSize: 9, marginTop: 1 },
  bullet: { flexDirection: 'row', marginTop: 2 },
  bulletDot: { width: 10, color: ACCENT, flexShrink: 0, marginTop: 0.5 },
  bulletText: { flex: 1 },
  // Project entry
  projEntry: { marginBottom: 8 },
  projTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  projTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9.5 },
  projTags: { color: MUTED, fontSize: 8.5, marginLeft: 6 },
  projSummary: { color: MUTED, marginTop: 1.5, fontSize: 9 },
  // Skills
  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillCat: { fontFamily: 'Helvetica-Bold', width: 88, flexShrink: 0, fontSize: 9 },
  skillList: { flex: 1, color: MUTED },
  // Education / Certs
  eduEntry: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  eduLeft: { flex: 1 },
  eduInst: { fontFamily: 'Helvetica-Bold', fontSize: 9.5 },
  eduDegree: { color: MUTED, marginTop: 1 },
  eduYear: { color: MUTED, fontSize: 8.5, textAlign: 'right' },
  certEntry: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
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

type ProfileRow = Record<string, unknown>;
type LinkRow = { label: string; url: string };
type ExpRow = {
  company: string | null;
  company_data?: { name: string; website_url?: string | null } | null;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  experience_bullets?: { text: string; visibility: string }[] | null;
};
type ProjRow = {
  title: string;
  summary: string | null;
  tags: string[];
  repo_url: string | null;
  live_url: string | null;
};
type SkillRow = { name: string; category: string | null };
type EduRow = { institution: string; degree: string; start_year: string; end_year: string | null };
type CertRow = { name: string; issuer: string | null; year: string | null };

interface ResumeProps {
  profile: ProfileRow;
  links: LinkRow[];
  experience: ExpRow[];
  projects: ProjRow[];
  skills: SkillRow[];
  education: EduRow[];
  certifications: CertRow[];
}

function ContactSep() {
  return <Text style={s.contactSep}>·</Text>;
}

export default function ResumeDoc({
  profile,
  links,
  experience,
  projects,
  skills,
  education,
  certifications,
}: ResumeProps) {
  const name = String(profile.name ?? '');
  const email = String(profile.email ?? '');
  const location = String(profile.location ?? '').replace(' · ', ', ');

  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, sk) => {
    const cat = sk.category ?? 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sk.name);
    return acc;
  }, {});

  const contactItems: { text: string; href?: string }[] = [];
  if (location) contactItems.push({ text: location });
  if (email) contactItems.push({ text: email, href: `mailto:${email}` });
  for (const link of links) {
    const display = link.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    contactItems.push({ text: display, href: link.url });
  }

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <Text style={s.name}>{name}</Text>
        <View style={s.contactRow}>
          {contactItems.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {i > 0 && <ContactSep />}
              {item.href ? (
                <Link src={item.href} style={{ color: MUTED, textDecoration: 'none' }}>
                  {item.text}
                </Link>
              ) : (
                <Text>{item.text}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Experience */}
        {experience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionHeader}>Experience</Text>
            {experience.map((exp, i) => {
              const company = exp.company_data?.name ?? exp.company ?? '';
              const bullets = (exp.experience_bullets ?? []).filter(
                (b) => b.visibility === 'public',
              );
              return (
                <View key={i} style={s.expEntry}>
                  <View style={s.expTopRow}>
                    <Text style={s.expCompany}>{company}</Text>
                    <Text style={s.expDates}>
                      {fmtDate(exp.start_date)} – {fmtDate(exp.end_date)}
                    </Text>
                  </View>
                  <Text style={s.expRole}>
                    {exp.role}
                    {exp.location ? `  ·  ${exp.location}` : ''}
                  </Text>
                  {bullets.map((b, j) => (
                    <View key={j} style={s.bullet}>
                      <Text style={s.bulletDot}>–</Text>
                      <Text style={s.bulletText}>{b.text}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionHeader}>Projects</Text>
            {projects.map((proj, i) => {
              const url = proj.live_url ?? proj.repo_url;
              return (
                <View key={i} style={s.projEntry}>
                  <View style={s.projTopRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', flex: 1 }}>
                      <Text style={s.projTitle}>{proj.title}</Text>
                      {proj.tags.length > 0 && (
                        <Text style={s.projTags}> {proj.tags.join(', ')}</Text>
                      )}
                    </View>
                    {url && (
                      <Link
                        src={url}
                        style={{ color: MUTED, fontSize: 8.5, textDecoration: 'none' }}
                      >
                        {url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      </Link>
                    )}
                  </View>
                  {proj.summary && <Text style={s.projSummary}>{proj.summary}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionHeader}>Skills</Text>
            {Object.entries(skillsByCategory).map(([cat, names], i) => (
              <View key={i} style={s.skillRow}>
                <Text style={s.skillCat}>{cat}</Text>
                <Text style={s.skillList}>{names.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
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
                  {edu.end_year ? ` – ${edu.end_year}` : ' – Present'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
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
