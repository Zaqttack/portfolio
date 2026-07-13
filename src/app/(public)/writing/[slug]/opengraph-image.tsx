import { ImageResponse } from 'next/og';
import { getPostBySlug, getProfile } from '@/lib/db';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getProfile().catch(() => null),
  ]);

  const accent = profile?.accent_color ?? '#EC6A2C';
  const name = profile?.name ?? '';
  const title = post?.title ?? '';
  const excerpt = post?.excerpt ?? '';
  const publishedAt = post?.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  if (post?.cover_image) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={post.cover_image}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(11,12,14,0.96) 0%, rgba(11,12,14,0.55) 55%, transparent 100%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0 72px 60px',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {publishedAt && (
            <div
              style={{
                fontSize: 16,
                color: accent,
                fontFamily: 'monospace',
                marginBottom: 12,
                display: 'flex',
              }}
            >
              {publishedAt}
            </div>
          )}
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: '#ECEEF1',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              fontFamily: 'sans-serif',
              display: 'flex',
            }}
          >
            {title}
          </div>
          {excerpt && (
            <div
              style={{
                fontSize: 21,
                color: '#A8ADB8',
                marginTop: 14,
                fontFamily: 'sans-serif',
                display: 'flex',
              }}
            >
              {excerpt.length > 110 ? `${excerpt.slice(0, 110)}…` : excerpt}
            </div>
          )}
          {name && (
            <div
              style={{
                fontSize: 16,
                color: accent,
                marginTop: 22,
                fontFamily: 'monospace',
                display: 'flex',
              }}
            >
              {name}
            </div>
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: accent,
            display: 'flex',
          }}
        />
      </div>,
      { ...size },
    );
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#0B0C0E',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -180,
          right: -180,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: accent,
          opacity: 0.07,
          filter: 'blur(80px)',
          display: 'flex',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '72px 80px',
          width: '100%',
          gap: 0,
        }}
      >
        {publishedAt && (
          <div
            style={{
              fontSize: 16,
              color: accent,
              fontFamily: 'monospace',
              marginBottom: 16,
              display: 'flex',
            }}
          >
            {publishedAt}
          </div>
        )}
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: '#ECEEF1',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            fontFamily: 'sans-serif',
            display: 'flex',
          }}
        >
          {title}
        </div>
        {excerpt && (
          <div
            style={{
              fontSize: 23,
              color: '#6C7280',
              marginTop: 16,
              fontFamily: 'sans-serif',
              display: 'flex',
            }}
          >
            {excerpt.length > 110 ? `${excerpt.slice(0, 110)}…` : excerpt}
          </div>
        )}
        {name && (
          <div
            style={{
              fontSize: 16,
              color: accent,
              marginTop: 28,
              fontFamily: 'monospace',
              display: 'flex',
            }}
          >
            {name}
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accent,
          display: 'flex',
        }}
      />
    </div>,
    { ...size },
  );
}
