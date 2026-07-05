import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const data = await getProfile();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
