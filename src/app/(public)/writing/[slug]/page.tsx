import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import TopNav from '@/components/TopNav';
import { getPostBySlug, getProfile, getProfileLinks } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, profile] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getProfile().catch(() => null),
  ]);
  if (!post) return {};
  const name = profile?.name ?? 'Portfolio';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
    : 'http://localhost:3000';
  return {
    title: `${post.title} | ${name}`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: `${post.title} | ${name}`,
      description: post.excerpt ?? undefined,
      url: `${siteUrl}/writing/${post.slug}`,
      type: 'article',
      ...(post.published_at ? { publishedTime: post.published_at } : {}),
      ...(post.cover_image
        ? { images: [{ url: post.cover_image, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: { card: 'summary_large_image' },
  };
}

function md2html(text: string): string {
  let s = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const codeBlocks: string[] = [];
  s = s.replace(/```(?:\w+)?\n([\s\S]*?)```/g, (_, code: string) => {
    codeBlocks.push(code);
    return `\x00CODE${codeBlocks.length - 1}\x00`;
  });

  s = s.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  s = s.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  s = s.replace(/^# (.+)$/gm, '<h2>$1</h2>');
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  s = s.replace(/^---$/gm, '<hr>');
  s = s.replace(/((?:^[-*] .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split('\n')
      .filter((l) => /^[-*] /.test(l))
      .map((l) => `<li>${l.replace(/^[-*] /, '')}</li>`)
      .join('');
    return `<ul>${items}</ul>\n`;
  });
  s = s.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  s = s
    .split(/\n{2,}/)
    .map((block) => {
      const t = block.trim();
      if (!t) return '';
      if (/^<(h[2-4]|ul|ol|blockquote|hr|\x00CODE)/.test(t)) return t;
      return `<p>${t.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');
  s = s.replace(
    /\x00CODE(\d+)\x00/g,
    (_, n: string) => `<pre><code>${codeBlocks[parseInt(n)]}</code></pre>`,
  );
  return s;
}

function buildPostJsonLd(
  post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>,
  profile: Awaited<ReturnType<typeof getProfile>> | null,
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
    : 'http://localhost:3000';
  const author = profile?.name
    ? { '@type': 'Person', name: profile.name, url: siteUrl }
    : undefined;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    url: `${siteUrl}/writing/${post.slug}`,
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    dateModified: post.updated_at,
    ...(author ? { author } : {}),
    ...(post.cover_image ? { image: post.cover_image } : {}),
    keywords: post.tags.join(', '),
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, profile, profileLinks] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getProfile().catch(() => null),
    getProfileLinks().catch(() => []),
  ]);

  if (!post) notFound();
  if (profile && profile.writing_enabled === false) notFound();

  const resumeUrl = profile?.resume_download_enabled
    ? '/api/resume'
    : (profile?.resume_url ?? null);
  const jsonLd = buildPostJsonLd(post, profile);
  const tags = post.tags.filter(Boolean);

  const railItems = [
    { href: '/writing', label: '← writing', active: false },
    { href: '/', label: 'home', active: false, isBack: true },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <MobileNav
        name={profile?.name}
        railItems={railItems}
        writingEnabled={profile?.writing_enabled ?? true}
        projectsEnabled={profile?.projects_enabled ?? true}
        resumeUrl={resumeUrl}
      />

      <TopNav
        writingEnabled={profile?.writing_enabled ?? true}
        projectsEnabled={profile?.projects_enabled ?? true}
        resumeUrl={resumeUrl}
        sticky
        paddingLeft="calc(max(var(--main-ml), calc((100vw - var(--content-max-w)) / 2)) + 40px)"
      />

      <main
        style={{
          position: 'relative',
          zIndex: 2,
          marginLeft: 'max(var(--main-ml), calc((100vw - var(--content-max-w)) / 2))',
          maxWidth: 'var(--content-max-w)',
        }}
      >
        <article style={{ padding: '56px 56px 96px 40px', maxWidth: '800px' }}>
          <Link
            href="/writing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              font: '500 11px var(--font-mono), monospace',
              color: 'var(--text-3)',
              textDecoration: 'none',
              transition: 'color .3s',
            }}
          >
            <ArrowLeft size={12} /> writing
          </Link>

          {post.cover_image && (
            <div
              style={{
                marginTop: '28px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid var(--border-1)',
              }}
            >
              <img
                src={post.cover_image}
                alt={post.title}
                style={{ width: '100%', display: 'block', maxHeight: '360px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div style={{ marginTop: post.cover_image ? '32px' : '24px', marginBottom: '32px' }}>
            <h1
              style={{
                fontWeight: 700,
                fontSize: '40px',
                letterSpacing: '-.03em',
                margin: '0 0 14px',
                lineHeight: 1.1,
              }}
            >
              {post.title}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {post.published_at && (
                <span
                  style={{
                    font: '400 12px var(--font-mono), monospace',
                    color: 'var(--text-4)',
                  }}
                >
                  {formatDate(post.published_at)}
                </span>
              )}
              {tags.length > 0 && post.published_at && (
                <span style={{ color: 'var(--border-2)' }}>·</span>
              )}
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    font: '500 10.5px var(--font-mono), monospace',
                    color: 'var(--text-3)',
                    border: '1px solid var(--border-2)',
                    borderRadius: '5px',
                    padding: '3px 8px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {post.excerpt && (
              <p
                style={{
                  fontSize: '17px',
                  lineHeight: 1.65,
                  color: 'var(--text-2)',
                  margin: '18px 0 0',
                  maxWidth: '40em',
                  borderLeft: '2px solid var(--border-2)',
                  paddingLeft: '16px',
                  fontStyle: 'italic',
                }}
              >
                {post.excerpt}
              </p>
            )}
          </div>

          {post.body && (
            <div
              style={{ borderTop: '1px solid var(--border-1)', paddingTop: '36px' }}
              dangerouslySetInnerHTML={{ __html: md2html(post.body) }}
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

      <Footer
        profileLinks={profileLinks}
        marginLeft="0"
        paddingLeft="calc(max(var(--main-ml), calc((100vw - var(--content-max-w)) / 2)) + 40px)"
      />
    </>
  );
}
