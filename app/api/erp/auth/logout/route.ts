import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/erp/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Enterprise session securely terminated.',
  });

  // Clear cookie
  response.cookies.delete(COOKIE_NAME);

  return response;
}

