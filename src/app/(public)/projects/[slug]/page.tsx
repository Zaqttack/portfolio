import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import LeftRail from '@/components/LeftRail';
import TopNav from '@/components/TopNav';
import { getProfile, getProfileLinks, getProjectBySlug } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return {};
  return {
    title: `${project.title} | Zaquariah Holland`,
    description: project.summary ?? undefined,
  };
}

function md2html(text: string): string {
  let s = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // fenced code blocks — protect from further substitutions
  const codeBlocks: string[] = [];
  s = s.replace(/```(?:\w+)?\n([\s\S]*?)```/g, (_, code: string) => {
    codeBlocks.push(code);
    return `\x00CODE${codeBlocks.length - 1}\x00`;
  });

  // headings
  s = s.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  s = s.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  s = s.replace(/^# (.+)$/gm, '<h2>$1</h2>');

  // inline code
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');

  // bold + italic
  s = s.replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

  // links
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // horizontal rules
  s = s.replace(/^---$/gm, '<hr>');

  // unordered lists: collect consecutive list lines into one <ul>
  s = s.replace(/((?:^[-*] .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split('\n')
      .filter((l) => /^[-*] /.test(l))
      .map((l) => `<li>${l.replace(/^[-*] /, '')}</li>`)
      .join('');
    return `<ul>${items}</ul>\n`;
  });

  // blockquotes
  s = s.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // paragraphs
  s = s
    .split(/\n{2,}/)
    .map((block) => {
      const t = block.trim();
      if (!t) return '';
      if (/^<(h[2-4]|ul|ol|blockquote|hr|\x00CODE)/.test(t)) return t;
      return `<p>${t.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');

  // restore code blocks
  s = s.replace(
    /\x00CODE(\d+)\x00/g,
    (_, n: string) => `<pre><code>${codeBlocks[parseInt(n)]}</code></pre>`,
  );

  return s;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, profile, profileLinks] = await Promise.all([
    getProjectBySlug(slug).catch(() => null),
    getProfile().catch(() => null),
    getProfileLinks().catch(() => []),
  ]);

  if (!project) notFound();
  if (profile && profile.projects_enabled === false) notFound();

  const resumeUrl = profile?.resume_download_enabled
    ? '/api/resume'
    : (profile?.resume_url ?? null);
  const tag = project.tags.includes('side') ? 'side' : 'product';
  const stack = project.tags.filter((t) => t !== 'product' && t !== 'side');
  const year = `'${new Date(project.created_at).getFullYear().toString().slice(2)}`;

  const railItems = [
    { href: '/projects', label: '← back', active: false },
    { href: '/', label: 'home', active: false },
  ];

  return (
    <>
      <LeftRail items={railItems} />

      <main style={{ position: 'relative', zIndex: 2, marginLeft: 'var(--rail-w)' }}>
        <TopNav
          writingEnabled={profile?.writing_enabled ?? true}
          projectsEnabled={profile?.projects_enabled ?? true}
          siteDomain={profile?.site_domain ?? null}
          resumeUrl={resumeUrl}
        />

        <article style={{ padding: '56px 56px 96px 40px', maxWidth: '800px' }}>
          <Link
            href="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              font: '500 11px var(--font-mono), monospace',
              color: 'var(--text-3)',
              textDecoration: 'none',
              transition: 'color .3s',
            }}
            onMouseEnter={undefined}
            onMouseLeave={undefined}
          >
            <ArrowLeft size={12} /> projects
          </Link>

          <div style={{ marginTop: '24px', marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
                flexWrap: 'wrap',
              }}
            >
              <h1
                style={{
                  fontWeight: 700,
                  fontSize: '40px',
                  letterSpacing: '-.03em',
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {project.title}
              </h1>
              <span
                style={{
                  font: '500 9px var(--font-mono), monospace',
                  letterSpacing: '.06em',
                  color: tag === 'product' ? 'var(--accent)' : 'var(--text-3)',
                  border: tag === 'product' ? '1px solid #3a2a1e' : '1px solid var(--border-3)',
                  background: tag === 'product' ? '#1a1310' : 'transparent',
                  borderRadius: '20px',
                  padding: '3px 10px',
                }}
              >
                {tag.toUpperCase()}
              </span>
              <span
                style={{
                  font: '500 11px var(--font-mono), monospace',
                  color: 'var(--text-4)',
                }}
              >
                {year}
              </span>
            </div>

            {project.summary && (
              <p
                style={{
                  fontSize: '17px',
                  lineHeight: 1.65,
                  color: 'var(--text-2)',
                  margin: '0 0 20px',
                  maxWidth: '40em',
                }}
              >
                {project.summary}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    font: '600 13px var(--font-space), sans-serif',
                    color: 'var(--canvas)',
                    background: 'var(--accent)',
                    textDecoration: 'none',
                    padding: '9px 16px',
                    borderRadius: '8px',
                  }}
                >
                  Visit <ArrowUpRight size={13} />
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    font: '600 13px var(--font-space), sans-serif',
                    color: 'var(--text-1)',
                    textDecoration: 'none',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-3)',
                  }}
                >
                  Repo <ArrowUpRight size={13} />
                </a>
              )}
              {stack.map((s) => (
                <span
                  key={s}
                  style={{
                    font: '500 10.5px var(--font-mono), monospace',
                    color: 'var(--text-3)',
                    border: '1px solid var(--border-2)',
                    borderRadius: '5px',
                    padding: '4px 9px',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {project.body && (
            <div
              style={{ borderTop: '1px solid var(--border-1)', paddingTop: '36px' }}
              dangerouslySetInnerHTML={{ __html: md2html(project.body) }}
            />
          )}
        </article>

        <style>{`
          article h2 { font-weight:700; font-size:26px; letter-spacing:-.02em; margin:2em 0 .6em; }
          article h3 { font-weight:600; font-size:20px; letter-spacing:-.01em; margin:1.8em 0 .5em; }
          article h4 { font-weight:600; font-size:16px; letter-spacing:-.01em; margin:1.6em 0 .4em; }
          article p  { font-size:16px; line-height:1.75; color:var(--text-2); margin:0 0 1.2em; }
          article ul { padding-left:1.4em; margin:0 0 1.2em; }
          article li { font-size:15.5px; line-height:1.7; color:var(--text-2); margin-bottom:.35em; }
          article pre { background:#0E0F12; border:1px solid var(--border-2); border-radius:9px; padding:16px 18px; overflow-x:auto; margin:0 0 1.4em; }
          article code { font:500 13px var(--font-mono),monospace; color:#C7CBD1; }
          article pre code { font-size:13px; }
          article blockquote { border-left:3px solid var(--accent); padding:2px 0 2px 18px; margin:0 0 1.2em; color:var(--text-3); font-style:italic; }
          article hr { border:none; border-top:1px solid var(--border-1); margin:2em 0; }
          article strong { color:var(--text-1); font-weight:600; }
          article em { color:var(--text-2); font-style:italic; }
          article a { color:var(--accent); text-decoration:none; }
          article a:hover { text-decoration:underline; }
        `}</style>
      </main>

      <Footer profileLinks={profileLinks} siteDomain={profile?.site_domain ?? null} />
    </>
  );
}
