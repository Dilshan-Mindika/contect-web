import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken, createJwtToken, COOKIE_NAME, ENTERPRISE_USERS } from '@/lib/erp/auth';
import { query } from '@/lib/db';
import { ensureUsersTable } from '@/lib/erp/usersDb';

async function getAuthUser(req: NextRequest) {
  let token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  if (!token) return null;
  return await verifyJwtToken(token);
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await ensureUsersTable();
  const rows = await query<Record<string, unknown>[]>(
    'SELECT id, name, email, role, title, department, mfa_enabled FROM erp_users WHERE id = ? OR email = ? LIMIT 1',
    [user.id, user.email.toLowerCase()]
  );

  if (rows && rows.length > 0) {
    const r = rows[0];
    return NextResponse.json({
      success: true,
      profile: {
        name: String(r.name),
        title: String(r.title || ''),
        department: String(r.department || ''),
        mfaEnabled: Boolean(r.mfa_enabled),
      },
    });
  }

  return NextResponse.json({
    success: true,
    profile: {
      name: user.name,
      title: user.title,
      department: user.department,
      mfaEnabled: false,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await ensureUsersTable();
    const body = await req.json();
    const nextName = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : user.name;
    const nextTitle = typeof body.title === 'string' ? body.title.trim() : user.title;
    const nextMfa = typeof body.mfaEnabled === 'boolean' ? body.mfaEnabled : undefined;

    const rows = await query<Record<string, unknown>[]>(
      'SELECT * FROM erp_users WHERE id = ? OR email = ? LIMIT 1',
      [user.id, user.email.toLowerCase()]
    );

    const updates: string[] = ['name = ?', 'title = ?'];
    const params: unknown[] = [nextName, nextTitle];

    if (nextMfa !== undefined) {
      updates.push('mfa_enabled = ?');
      params.push(nextMfa ? 1 : 0);
    }

    if (body.newPassword && String(body.newPassword).trim().length > 0) {
      const newPass = String(body.newPassword).trim();
      if (newPass.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
      }
      const existingPass =
        rows && rows.length > 0
          ? String(rows[0].password_hash)
          : ENTERPRISE_USERS[user.email.toLowerCase()]?.passwordHash;
      if (existingPass && String(body.currentPassword || '') !== existingPass) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }
      updates.push('password_hash = ?');
      params.push(newPass);
    }

    if (rows && rows.length > 0) {
      params.push(rows[0].id);
      await query(`UPDATE erp_users SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const updatedUser = {
      ...user,
      name: nextName,
      title: nextTitle,
    };

    const token = await createJwtToken(updatedUser);
    const response = NextResponse.json({
      success: true,
      user: updatedUser,
      mfaEnabled: nextMfa,
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
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update profile' },
      { status: 500 }
    );
  }
}
