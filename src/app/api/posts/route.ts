import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const data = await getPosts();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
