import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { email, cfToken } = body ?? {};

  if (!email || !cfToken) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Verify Turnstile token when configured
  if (process.env.TURNSTILE_SECRET_KEY) {
    const form = new FormData();
    form.append('secret', process.env.TURNSTILE_SECRET_KEY);
    form.append('response', cfToken);
    const ip =
      req.headers.get('cf-connecting-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (ip) form.append('remoteip', ip);

    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const result = await verification.json();

    if (!result.success) {
      return NextResponse.json({ error: 'Security check failed' }, { status: 400 });
    }
  }

  // Send magic link via Supabase — use createServerClient so the PKCE
  // code verifier is stored in a cookie on the response, matching the
  // callback handler which expects exchangeCodeForSession.
  const response = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${new URL(req.url).origin}/admin/auth/callback`,
      shouldCreateUser: false,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return response;
}
