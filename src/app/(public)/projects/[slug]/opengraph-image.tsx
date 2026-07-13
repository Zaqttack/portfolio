import { ImageResponse } from 'next/og';
import { getProfile, getProjectBySlug } from '@/lib/db';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, profile] = await Promise.all([
    getProjectBySlug(slug).catch(() => null),
    getProfile().catch(() => null),
  ]);

  const accent = profile?.accent_color ?? '#EC6A2C';
  const name = profile?.name ?? '';
  const title = project?.title ?? '';
  const summary = project?.summary ?? '';
  const tags = project?.tags ?? [];

  // If the project has a cover image, use it with an overlay
  if (project?.cover_image) {
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
          src={project.cover_image}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(11,12,14,0.95) 0%, rgba(11,12,14,0.5) 60%, transparent 100%)',
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
          <div
            style={{
              fontSize: 54,
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
          {summary && (
            <div
              style={{
                fontSize: 22,
                color: '#A8ADB8',
                marginTop: 12,
                fontFamily: 'sans-serif',
                display: 'flex',
              }}
            >
              {summary.length > 100 ? `${summary.slice(0, 100)}…` : summary}
            </div>
          )}
          {name && (
            <div
              style={{
                fontSize: 16,
                color: accent,
                marginTop: 20,
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

  // Generated fallback card
  const stack = tags.filter((t) => t !== 'product' && t !== 'side').slice(0, 4);

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
        {stack.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            {stack.map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 14,
                  color: '#6C7280',
                  border: '1px solid #252729',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontFamily: 'monospace',
                  display: 'flex',
                }}
              >
                {t}
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            fontSize: 60,
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
        {summary && (
          <div
            style={{
              fontSize: 24,
              color: '#6C7280',
              marginTop: 16,
              fontFamily: 'sans-serif',
              display: 'flex',
            }}
          >
            {summary.length > 100 ? `${summary.slice(0, 100)}…` : summary}
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
