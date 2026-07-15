import { getProfile } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  const profile = await getProfile().catch(() => null);
  const color = profile?.accent_color ?? '#EC6A2C';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none"><path d="M100,7.5 C132,43.5 132,79.5 100,115.5 C68,79.5 68,43.5 100,7.5Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M146.25,19.89 C155.96,67.07 137.96,98.25 92.25,113.42 C82.54,66.25 100.54,35.07 146.25,19.89Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M180.11,53.75 C164.93,99.46 133.75,117.46 86.58,107.75 C101.75,62.04 132.93,44.04 180.11,53.75Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M192.5,100 C156.5,132 120.5,132 84.5,100 C120.5,68 156.5,68 192.5,100Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M180.11,146.25 C132.93,155.96 101.75,137.96 86.58,92.25 C133.75,82.54 164.93,100.54 180.11,146.25Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M146.25,180.11 C100.54,164.93 82.54,133.75 92.25,86.58 C137.96,101.75 155.96,132.93 146.25,180.11Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M100,192.5 C68,156.5 68,120.5 100,84.5 C132,120.5 132,156.5 100,192.5Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M53.75,180.11 C44.04,132.93 62.04,101.75 107.75,86.58 C117.46,133.75 99.46,164.93 53.75,180.11Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M19.89,146.25 C35.07,100.54 66.25,82.54 113.42,92.25 C98.25,137.96 67.07,155.96 19.89,146.25Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M7.5,100 C43.5,68 79.5,68 115.5,100 C79.5,132 43.5,132 7.5,100Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M19.89,53.75 C67.07,44.04 98.25,62.04 113.42,107.75 C66.25,117.46 35.07,99.46 19.89,53.75Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/><path d="M53.75,19.89 C99.46,35.07 117.46,66.25 107.75,113.42 C62.04,98.25 44.04,67.07 53.75,19.89Z" fill="none" stroke="${color}" stroke-width="4.5" stroke-linejoin="round"/></svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=0',
    },
  });
}
