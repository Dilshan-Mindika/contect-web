import { SignJWT, jwtVerify } from 'jose';
import { ERPUser, UserRole, Permission } from './types';

// Cryptographically secure secret key for JWT signing (HMAC-SHA256)
const JWT_SECRET_STRING = process.env.CONTEC_JWT_SECRET || 'contec_enterprise_hyper_secure_jwt_secret_key_2026_x89f_quantum_safe';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
export const COOKIE_NAME = 'contec_erp_token';

// Role Permissions Matrix
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'view_financials',
    'manage_invoices',
    'manage_projects',
    'manage_inventory',
    'manage_employees',
    'manage_crm',
    'view_audit_logs',
    'admin_settings',
  ],
  FINANCE_DIRECTOR: [
    'view_financials',
    'manage_invoices',
    'view_audit_logs',
  ],
  OPERATIONS_HEAD: [
    'manage_projects',
    'manage_inventory',
    'view_audit_logs',
  ],
  HR_MANAGER: [
    'manage_employees',
    'view_audit_logs',
  ],
  SALES_DIRECTOR: [
    'manage_crm',
    'view_financials',
  ],
  PROJECT_ENGINEER: [
    'manage_projects',
    'manage_inventory',
  ],
};

// Enterprise Executive Personas
export interface DemoAccount extends ERPUser {
  passwordHash: string; // Plaintext for demo match or hash
}

export const ENTERPRISE_USERS: Record<string, DemoAccount> = {
  'admin@contec.com': {
    id: 'usr_admin_01',
    name: 'Elena Vance',
    email: 'admin@contec.com',
    role: 'SUPER_ADMIN',
    title: 'Chief Executive Officer',
    department: 'Executive Board',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
    passwordHash: 'ContecSuper2026!',
  },
  'finance@contec.com': {
    id: 'usr_fin_02',
    name: 'Arthur Sterling',
    email: 'finance@contec.com',
    role: 'FINANCE_DIRECTOR',
    title: 'Chief Financial Officer',
    department: 'Corporate Finance',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    permissions: ROLE_PERMISSIONS.FINANCE_DIRECTOR,
    passwordHash: 'Finance2026!',
  },
  'operations@contec.com': {
    id: 'usr_ops_03',
    name: 'Marcus Chen',
    email: 'operations@contec.com',
    role: 'OPERATIONS_HEAD',
    title: 'VP of Construction & Site Ops',
    department: 'Field Operations',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    permissions: ROLE_PERMISSIONS.OPERATIONS_HEAD,
    passwordHash: 'OpsLead2026!',
  },
  'hr@contec.com': {
    id: 'usr_hr_04',
    name: 'Sophia Al-Mansoor',
    email: 'hr@contec.com',
    role: 'HR_MANAGER',
    title: 'Chief People & Talent Officer',
    department: 'People & Culture',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    permissions: ROLE_PERMISSIONS.HR_MANAGER,
    passwordHash: 'PeopleFirst2026!',
  },
  'sales@contec.com': {
    id: 'usr_sales_05',
    name: 'Julian Voss',
    email: 'sales@contec.com',
    role: 'SALES_DIRECTOR',
    title: 'VP of Global Business Development',
    department: 'Commercial & CRM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    permissions: ROLE_PERMISSIONS.SALES_DIRECTOR,
    passwordHash: 'ContecSales2026!',
  },
  'engineer@contec.com': {
    id: 'usr_eng_06',
    name: 'Maya Lin',
    email: 'engineer@contec.com',
    role: 'PROJECT_ENGINEER',
    title: 'Principal Structural Architect & BIM Lead',
    department: 'Structural Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    permissions: ROLE_PERMISSIONS.PROJECT_ENGINEER,
    passwordHash: 'CivilBIM2026!',
  },
};

/**
 * Sign a standard, secure JWT token with HS256 algorithm and 7-day expiration
 */
export async function createJwtToken(user: ERPUser): Promise<string> {
  return await new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    department: user.department,
    avatar: user.avatar,
    permissions: user.permissions,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer('contec:erp:auth')
    .setAudience('contec:enterprise')
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify and decode an incoming JWT token
 */
export async function verifyJwtToken(token: string): Promise<ERPUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: 'contec:erp:auth',
      audience: 'contec:enterprise',
    });

    if (!payload.sub || !payload.email || !payload.role) {
      return null;
    }

    return {
      id: payload.sub as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      title: payload.title as string,
      department: payload.department as string,
      avatar: (payload.avatar as string) || '',
      permissions: (payload.permissions as Permission[]) || ROLE_PERMISSIONS[payload.role as UserRole] || [],
    };
  } catch {
    return null;
  }
}

/**
 * Helper to check if a user role holds a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

