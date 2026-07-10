import { ImageResponse } from 'next/og';
import { getProfile } from '@/lib/db';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function Icon() {
  const profile = await getProfile().catch(() => null);
  const accent = profile?.accent_color ?? '#EC6A2C';

  const S = 200;
  const cx = S / 2;
  const cy = S / 2;
  const half = S / 2;
  const r = 0.385 * half;
  const pl = 0.54 * half;
  const pw = 0.24 * half;
  const sw = 4.5;
  const cpw = pw * 2;

  function f(v: number) {
    return (Math.round(v * 100) / 100).toString();
  }

  // 12 petals, single ring, quadratic bezier converted to cubic for compat
  const paths: string[] = [];
  for (let i = 0; i < 12; i++) {
    const rad = (i * 30 - 90) * (Math.PI / 180);
    const px = cx + r * Math.cos(rad);
    const py = cy + r * Math.sin(rad);
    const ux = Math.cos(rad);
    const uy = Math.sin(rad);
    const nx = -uy;
    const ny = ux;

    const t1x = px + pl * ux,
      t1y = py + pl * uy;
    const t2x = px - pl * ux,
      t2y = py - pl * uy;
    const qRx = px + cpw * nx,
      qRy = py + cpw * ny;
    const qLx = px - cpw * nx,
      qLy = py - cpw * ny;

    // Convert quadratic Q(P0,P1,P2) → cubic C so Satori handles it cleanly
    const c1rx = t1x + (2 / 3) * (qRx - t1x),
      c1ry = t1y + (2 / 3) * (qRy - t1y);
    const c2rx = t2x + (2 / 3) * (qRx - t2x),
      c2ry = t2y + (2 / 3) * (qRy - t2y);
    const c1lx = t2x + (2 / 3) * (qLx - t2x),
      c1ly = t2y + (2 / 3) * (qLy - t2y);
    const c2lx = t1x + (2 / 3) * (qLx - t1x),
      c2ly = t1y + (2 / 3) * (qLy - t1y);

    const d =
      `M${f(t1x)},${f(t1y)} ` +
      `C${f(c1rx)},${f(c1ry)} ${f(c2rx)},${f(c2ry)} ${f(t2x)},${f(t2y)} ` +
      `C${f(c1lx)},${f(c1ly)} ${f(c2lx)},${f(c2ly)} ${f(t1x)},${f(t1y)}Z`;

    paths.push(
      `<path d="${d}" fill="none" stroke="${accent}" stroke-width="${sw}" stroke-linejoin="round"/>`,
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" fill="none">${paths.join('')}</svg>`;
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <img src={src} width="100%" height="100%" />
    </div>,
    { ...size },
  );
}
