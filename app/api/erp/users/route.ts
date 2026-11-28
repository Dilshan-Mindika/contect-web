import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken, COOKIE_NAME, ROLE_PERMISSIONS } from '@/lib/erp/auth';
import { query } from '@/lib/db';
import { ensureUsersTable, listUsersFromDb } from '@/lib/erp/usersDb';
import { UserRole } from '@/lib/erp/types';

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

async function logRbacAudit(actorName: string, actorEmail: string, role: string, action: string, details: string) {
  await query(
    `INSERT INTO audit_logs (id, company_id, actor_name, actor_email, role, action, module, details, severity)
     VALUES (?, 'CONSOLIDATED', ?, ?, ?, ?, 'SECURITY', ?, 'WARNING')`,
    [`aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, actorName, actorEmail, role, action, details]
  );
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const users = await listUsersFromDb();
  return NextResponse.json({ success: true, users });
}

export async function POST(req: NextRequest) {
  const actor = await getAuthUser(req);
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (actor.role !== 'SUPER_ADMIN' && !actor.permissions.includes('admin_settings')) {
    return NextResponse.json({ error: 'Forbidden: Admin settings permission required' }, { status: 403 });
  }

  try {
    await ensureUsersTable();
    const body = await req.json();
    const role = (body.role as UserRole) || 'PROJECT_ENGINEER';
    const permissions = Array.isArray(body.permissions) && body.permissions.length > 0
      ? body.permissions
      : ROLE_PERMISSIONS[role] || [];
    const id = `usr_${Date.now().toString(36)}`;
    const email = String(body.email || '').toLowerCase().trim();

    if (!email || !body.name || !body.password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    await query(
      `INSERT INTO erp_users (id, name, email, password_hash, role, title, department, avatar, permissions, status, company_scope, mfa_enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        String(body.name),
        email,
        String(body.password),
        role,
        String(body.title || role.replace(/_/g, ' ')),
        String(body.department || 'Operations'),
        String(body.avatar || ''),
        JSON.stringify(permissions),
        body.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
        body.companyScope || 'CONSOLIDATED',
        body.mfaEnabled ? 1 : 0,
      ]
    );

    await logRbacAudit(
      actor.name,
      actor.email,
      actor.role,
      'CREATE_ERP_USER',
      `Provisioned user ${body.name} (${email}) with role ${role} and ${permissions.length} permissions.`
    );

    const users = await listUsersFromDb();
    return NextResponse.json({ success: true, users });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const actor = await getAuthUser(req);
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (actor.role !== 'SUPER_ADMIN' && !actor.permissions.includes('admin_settings')) {
    return NextResponse.json({ error: 'Forbidden: Admin settings permission required' }, { status: 403 });
  }

  try {
    await ensureUsersTable();
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'User id required' }, { status: 400 });

    const updates: string[] = [];
    const params: unknown[] = [];

    if (body.name !== undefined) { updates.push('name = ?'); params.push(String(body.name)); }
    if (body.role !== undefined) { updates.push('role = ?'); params.push(String(body.role)); }
    if (body.title !== undefined) { updates.push('title = ?'); params.push(String(body.title)); }
    if (body.department !== undefined) { updates.push('department = ?'); params.push(String(body.department)); }
    if (body.permissions !== undefined) { updates.push('permissions = ?'); params.push(JSON.stringify(body.permissions)); }
    if (body.status !== undefined) { updates.push('status = ?'); params.push(body.status); }
    if (body.companyScope !== undefined) { updates.push('company_scope = ?'); params.push(body.companyScope); }
    if (body.mfaEnabled !== undefined) { updates.push('mfa_enabled = ?'); params.push(body.mfaEnabled ? 1 : 0); }
    if (body.password && String(body.password).trim().length >= 6) {
      updates.push('password_hash = ?');
      params.push(String(body.password));
    }

    if (updates.length > 0) {
      params.push(id);
      await query(`UPDATE erp_users SET ${updates.join(', ')} WHERE id = ?`, params);
      await logRbacAudit(
        actor.name,
        actor.email,
        actor.role,
        'UPDATE_RBAC_ACCESS',
        `Updated user ${id} access control (${updates.length} fields modified).`
      );
    }

    const users = await listUsersFromDb();
    return NextResponse.json({ success: true, users });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const actor = await getAuthUser(req);
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (actor.role !== 'SUPER_ADMIN' && !actor.permissions.includes('admin_settings')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (id === actor.id) {
    return NextResponse.json({ error: 'Cannot delete your own active session account' }, { status: 400 });
  }

  await ensureUsersTable();
  await query('DELETE FROM erp_users WHERE id = ?', [id]);
  await logRbacAudit(actor.name, actor.email, actor.role, 'DELETE_ERP_USER', `Revoked and deleted user account ${id}.`);

  const users = await listUsersFromDb();
  return NextResponse.json({ success: true, users });
}
