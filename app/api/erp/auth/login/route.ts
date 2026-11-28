import { NextRequest, NextResponse } from 'next/server';
import { createJwtToken, COOKIE_NAME } from '@/lib/erp/auth';
import { authenticateUserFromDb } from '@/lib/erp/usersDb';
import { query } from '@/lib/db';
import { checkRateLimit } from '@/lib/erp/rateLimit';

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

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const rl = checkRateLimit(`login:${clientIp}:${String(email).toLowerCase().trim()}`, 10, 15 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please wait ${rl.retryAfterSeconds}s and try again.` },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      );
    }

    const { user: userAccount, suspended } = await authenticateUserFromDb(email, password);

    if (suspended) {
      await query(
        `INSERT INTO audit_logs (id, company_id, actor_name, actor_email, role, action, module, details, severity)
         VALUES (?, 'CONSOLIDATED', ?, ?, 'UNKNOWN', 'LOGIN_BLOCKED_SUSPENDED', 'AUTH', 'Blocked login attempt on suspended account.', 'CRITICAL')`,
        [`aud-${Date.now()}`, email, email]
      );
      return NextResponse.json(
        { error: 'This account has been suspended by the System Administrator.' },
        { status: 403 }
      );
    }

    if (!userAccount) {
      return NextResponse.json(
        { error: 'Invalid enterprise credentials or access restricted.' },
        { status: 401 }
      );
    }

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

    const token = await createJwtToken(sanitizedUser);

    await query(
      `INSERT INTO audit_logs (id, company_id, actor_name, actor_email, role, action, module, details, severity)
       VALUES (?, ?, ?, ?, ?, 'ERP_USER_LOGIN', 'AUTH', 'Authenticated JWT session established.', 'INFO')`,
      [`aud-${Date.now()}`, userAccount.companyScope || 'CONSOLIDATED', userAccount.name, userAccount.email, userAccount.role]
    );

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful. Enterprise session established.',
      token,
      user: sanitizedUser,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
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
