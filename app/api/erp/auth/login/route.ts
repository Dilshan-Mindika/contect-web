import { NextRequest, NextResponse } from 'next/server';
import { ENTERPRISE_USERS, createJwtToken, COOKIE_NAME } from '@/lib/erp/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const userAccount = ENTERPRISE_USERS[cleanEmail];

    if (!userAccount || userAccount.passwordHash !== password) {
      return NextResponse.json(
        { error: 'Invalid enterprise credentials or access restricted.' },
        { status: 401 }
      );
    }

    // Build sanitized user
    const sanitizedUser = {
      id: userAccount.id,
      name: userAccount.name,
      email: userAccount.email,
      role: userAccount.role,
      title: userAccount.title,
      department: userAccount.department,
      avatar: userAccount.avatar,
      permissions: userAccount.permissions,
    };

    // Generate cryptographic JWT
    const token = await createJwtToken(sanitizedUser);

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful. Enterprise session established.',
      token,
      user: sanitizedUser,
    });

    // Set hardened HttpOnly cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal enterprise authentication error.' },
      { status: 500 }
    );
  }
}

