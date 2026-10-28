import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken, COOKIE_NAME } from '@/lib/erp/auth';

export async function GET(req: NextRequest) {
  try {
    // Check HttpOnly cookie first, then Bearer header
    let token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'No active enterprise session found.' },
        { status: 401 }
      );
    }

    const user = await verifyJwtToken(token);

    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: 'Invalid or expired JWT token signature.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Failed to verify session integrity.' },
      { status: 500 }
    );
  }
}

