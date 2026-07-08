import { NextResponse } from 'next/server';
import { getSkills } from '@/lib/db';

export async function GET() {
  try {
    const data = await getSkills();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
