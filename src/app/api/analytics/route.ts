import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type PageViewPayload = {
  path: string;
  referrer: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  country: string | null;
  is_bot: boolean;
  bot_name: string | null;
};

async function sha256hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function matchBot(
  ua: string,
  signatures: { pattern: string; bot_name: string }[],
): { is_bot: boolean; bot_name: string | null } {
  for (const sig of signatures) {
    try {
      if (new RegExp(sig.pattern, 'i').test(ua)) {
        return { is_bot: true, bot_name: sig.bot_name };
      }
    } catch {
      // invalid regex — skip
    }
  }
  return { is_bot: false, bot_name: null };
}

export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !supabaseUrl) return NextResponse.json({}, { status: 200 });

  const token = req.headers.get('x-analytics-token');
  if (!token || token !== serviceKey) return NextResponse.json({}, { status: 200 });

  const body = (await req.json().catch(() => null)) as PageViewPayload | null;
  if (!body?.path) return NextResponse.json({}, { status: 200 });

  const admin = createClient(supabaseUrl, serviceKey);

  // Fetch bot signatures once per request
  const { data: sigs } = await admin.from('bot_signatures').select('pattern, bot_name');
  const ua = body.user_agent ?? '';
  const botResult = sigs ? matchBot(ua, sigs) : { is_bot: false, bot_name: null };

  await admin.from('page_views').insert({
    path: body.path,
    referrer: body.referrer,
    user_agent: ua || null,
    ip_hash: body.ip_hash,
    country: body.country,
    is_bot: botResult.is_bot,
    bot_name: botResult.bot_name,
    ts: new Date().toISOString(),
  });

  return NextResponse.json({}, { status: 200 });
}
