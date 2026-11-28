import { query } from '@/lib/db';
import { ENTERPRISE_USERS, ROLE_PERMISSIONS } from '@/lib/erp/auth';
import { Permission, UserRole, ActiveCompany } from '@/lib/erp/types';
import { hashPassword, verifyPassword, isHashedPassword } from '@/lib/erp/password';

export interface ManagedUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
  permissions: Permission[];
  status: 'ACTIVE' | 'SUSPENDED';
  companyScope: ActiveCompany;
  mfaEnabled: boolean;
  lastLogin: string | null;
  createdAt?: string;
}

let usersTableEnsured = false;

export async function ensureUsersTable(): Promise<void> {
  if (usersTableEnsured) return;

  await query(`
    CREATE TABLE IF NOT EXISTS erp_users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(64) NOT NULL,
      title VARCHAR(160) DEFAULT '',
      department VARCHAR(120) DEFAULT '',
      avatar VARCHAR(500) DEFAULT '',
      permissions JSON,
      status ENUM('ACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
      company_scope ENUM('CONSOLIDATED', 'COMP_A', 'COMP_B') DEFAULT 'CONSOLIDATED',
      mfa_enabled BOOLEAN DEFAULT FALSE,
      last_login TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const countRows = await query<{ cnt: number }[]>('SELECT COUNT(*) AS cnt FROM erp_users');
  if (countRows && countRows[0]?.cnt === 0) {
    for (const u of Object.values(ENTERPRISE_USERS)) {
      await query(
        `INSERT IGNORE INTO erp_users (id, name, email, password_hash, role, title, department, avatar, permissions, status, company_scope, mfa_enabled)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 'CONSOLIDATED', 0)`,
        [
          u.id,
          u.name,
          u.email.toLowerCase(),
          hashPassword(u.passwordHash),
          u.role,
          u.title,
          u.department,
          u.avatar,
          JSON.stringify(u.permissions),
        ]
      );
    }
  }

  usersTableEnsured = true;
}

function parsePermissions(val: unknown, role: UserRole): Permission[] {
  if (Array.isArray(val)) return val as Permission[];
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed as Permission[];
    } catch {
      // fallback
    }
  }
  return ROLE_PERMISSIONS[role] || [];
}

function mapUserRow(r: Record<string, unknown>): ManagedUserRecord {
  const role = String(r.role) as UserRole;
  return {
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    role,
    title: String(r.title || ''),
    department: String(r.department || ''),
    avatar: String(r.avatar || ''),
    permissions: parsePermissions(r.permissions, role),
    status: (r.status as 'ACTIVE' | 'SUSPENDED') || 'ACTIVE',
    companyScope: (r.company_scope as ActiveCompany) || 'CONSOLIDATED',
    mfaEnabled: Boolean(r.mfa_enabled),
    lastLogin: r.last_login ? String(r.last_login) : null,
    createdAt: r.created_at ? String(r.created_at) : undefined,
  };
}

export async function listUsersFromDb(): Promise<ManagedUserRecord[]> {
  await ensureUsersTable();
  const rows = await query<Record<string, unknown>[]>(
    'SELECT id, name, email, role, title, department, avatar, permissions, status, company_scope, mfa_enabled, last_login, created_at FROM erp_users ORDER BY created_at ASC'
  );
  if (!rows) {
    return Object.values(ENTERPRISE_USERS).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      title: u.title,
      department: u.department,
      avatar: u.avatar,
      permissions: u.permissions,
      status: 'ACTIVE',
      companyScope: 'CONSOLIDATED',
      mfaEnabled: false,
      lastLogin: null,
    }));
  }
  return rows.map(mapUserRow);
}

export async function authenticateUserFromDb(
  email: string,
  password: string
): Promise<{ user: ManagedUserRecord | null; suspended?: boolean }> {
  const cleanEmail = email.toLowerCase().trim();
  await ensureUsersTable();
  const rows = await query<Record<string, unknown>[]>(
    'SELECT * FROM erp_users WHERE email = ? LIMIT 1',
    [cleanEmail]
  );

  if (rows && rows.length > 0) {
    const row = rows[0];
    const storedHash = String(row.password_hash || '');
    if (!verifyPassword(password, storedHash)) {
      return { user: null };
    }
    if (String(row.status) === 'SUSPENDED') {
      return { user: null, suspended: true };
    }
    if (!isHashedPassword(storedHash)) {
      await query('UPDATE erp_users SET password_hash = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?', [
        hashPassword(password),
        row.id,
      ]);
    } else {
      await query('UPDATE erp_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [row.id]);
    }
    return { user: mapUserRow(row) };
  }

  // Fallback to static users if DB is unreachable
  const fallback = ENTERPRISE_USERS[cleanEmail];
  if (fallback && fallback.passwordHash === password) {
    return {
      user: {
        id: fallback.id,
        name: fallback.name,
        email: fallback.email,
        role: fallback.role,
        title: fallback.title,
        department: fallback.department,
        avatar: fallback.avatar,
        permissions: fallback.permissions,
        status: 'ACTIVE',
        companyScope: 'CONSOLIDATED',
        mfaEnabled: false,
        lastLogin: new Date().toISOString(),
      },
    };
  }
  return { user: null };
}
