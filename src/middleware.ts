import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/projects', '/writing', '/experience', '/work'];

function isPublicPage(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith('/projects/') || pathname.startsWith('/writing/')) return true;
  return false;
}

async function sha256hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Admin auth guard ---
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname.startsWith('/admin/auth/')) {
      return NextResponse.next();
    }

    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
            response = NextResponse.next({ request });
            for (const { name, value, options } of cookiesToSet)
              response.cookies.set(name, value, options);
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== process.env.ADMIN_USER_ID) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return response;
  }

  // --- Page view logging for public routes ---
  if (isPublicPage(pathname)) {
    const response = NextResponse.next();

    const ua = request.headers.get('user-agent') ?? '';
    const referrer = request.headers.get('referer') ?? null;
    // Cloudflare provides CF-Connecting-IP; fall back to x-forwarded-for
    const rawIp =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      null;
    const country = request.headers.get('cf-ipcountry') ?? null;
    const ipHash = rawIp ? await sha256hex(rawIp) : null;

    // Fire-and-forget — don't block the response
    const analyticsUrl = new URL('/api/analytics', request.url);
    fetch(analyticsUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Analytics-Token': process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
      },
      body: JSON.stringify({
        path: pathname,
        referrer,
        user_agent: ua,
        ip_hash: ipHash,
        country,
        is_bot: false, // bot detection happens in the route handler
        bot_name: null,
      }),
    }).catch(() => {});

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next|api|favicon|icon|opengraph-image|sitemap|robots|llms).*)'],
};
