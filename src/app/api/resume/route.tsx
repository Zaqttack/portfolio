export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { renderToBuffer } from '@react-pdf/renderer';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getResumeData } from '@/lib/db';
import ResumeDoc from './ResumeDoc';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.id === process.env.ADMIN_USER_ID;

  const data = await getResumeData();
  const isPublicEnabled = !!(data.profile as Record<string, unknown>)?.resume_download_enabled;

  if (!isAdmin && !isPublicEnabled) {
    return new NextResponse('Not found', { status: 404 });
  }

  const buf = await renderToBuffer(
    <ResumeDoc
      profile={data.profile as Record<string, unknown>}
      links={data.links as { label: string; url: string }[]}
      experience={data.experience as Parameters<typeof ResumeDoc>[0]['experience']}
      projects={data.projects as Parameters<typeof ResumeDoc>[0]['projects']}
      skills={data.skills as Parameters<typeof ResumeDoc>[0]['skills']}
      education={data.education as Parameters<typeof ResumeDoc>[0]['education']}
      certifications={data.certifications as Parameters<typeof ResumeDoc>[0]['certifications']}
      involvement={data.involvement as Parameters<typeof ResumeDoc>[0]['involvement']}
    />,
  );

  const name = String((data.profile as Record<string, unknown>)?.name ?? 'resume')
    .toLowerCase()
    .replace(/\s+/g, '-');

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${name}-resume.pdf"`,
    },
  });
}
