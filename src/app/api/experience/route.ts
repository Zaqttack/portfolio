import { NextResponse } from 'next/server';
import { getExperience, getInvolvement } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const [experience, involvement] = await Promise.all([getExperience(), getInvolvement()]);
    return NextResponse.json({ experience, involvement });
  } catch {
    return NextResponse.json({ experience: [], involvement: [] }, { status: 500 });
  }
}
