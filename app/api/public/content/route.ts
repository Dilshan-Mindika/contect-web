import { NextResponse } from 'next/server';
import { fetchPublicProjectsFromDb, fetchPublicServicesFromDb } from '@/lib/publicDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [projects, services] = await Promise.all([
      fetchPublicProjectsFromDb(),
      fetchPublicServicesFromDb(),
    ]);

    return NextResponse.json({
      success: true,
      projects,
      services,
    });
  } catch (error) {
    console.error('[PUBLIC CONTENT API ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load public content' },
      { status: 500 }
    );
  }
}
