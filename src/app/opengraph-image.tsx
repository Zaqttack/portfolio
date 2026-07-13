import { ImageResponse } from 'next/og';
import { getProfile } from '@/lib/db';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function OgImage() {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name ?? 'Portfolio';
  const tagline = profile?.tagline ?? '';
  const accent = profile?.accent_color ?? '#EC6A2C';
  const avatarUrl = profile?.avatar_enabled && profile?.avatar_url ? profile.avatar_url : null;

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
      {/* Accent glow */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: accent,
          opacity: 0.08,
          filter: 'blur(80px)',
          display: 'flex',
        }}
      />

      {/* Content */}
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
        {avatarUrl && (
          <img
            src={avatarUrl}
            width={72}
            height={72}
            style={{ borderRadius: '50%', marginBottom: 32, objectFit: 'cover' }}
          />
        )}

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#ECEEF1',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            fontFamily: 'sans-serif',
            display: 'flex',
          }}
        >
          {name}
        </div>

        {tagline && (
          <div
            style={{
              fontSize: 26,
              color: '#6C7280',
              marginTop: 16,
              fontFamily: 'sans-serif',
              fontWeight: 400,
              display: 'flex',
            }}
          >
            {tagline}
          </div>
        )}

        {/* Bottom accent bar */}
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

        {process.env.NEXT_PUBLIC_SITE_DOMAIN && (
          <div
            style={{
              position: 'absolute',
              bottom: 28,
              right: 80,
              fontSize: 18,
              color: '#454A55',
              fontFamily: 'monospace',
              display: 'flex',
            }}
          >
            {process.env.NEXT_PUBLIC_SITE_DOMAIN}
          </div>
        )}
      </div>
    </div>,
    { ...size },
  );
}
