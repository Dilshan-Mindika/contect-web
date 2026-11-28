import { ERPUser, UserRole } from './types';

export type CrudAction = 'view' | 'create' | 'edit' | 'delete';

export interface ErpModuleDef {
  key: string;
  label: string;
  href: string;
  group: 'Main Navigation' | 'Site Operations' | 'Finance & Admin';
  legacyPermission?: string;
}

export const ERP_MODULES: ErpModuleDef[] = [
  // Main Navigation
  { key: 'dashboard', label: 'Dashboard Overview', href: '/erp', group: 'Main Navigation' },
  { key: 'website', label: 'Website Projects', href: '/erp/website', group: 'Main Navigation', legacyPermission: 'manage_crm' },
  { key: 'services', label: 'Website Services', href: '/erp/services', group: 'Main Navigation', legacyPermission: 'manage_crm' },
  { key: 'inquiries', label: 'Client Inquiries', href: '/erp/inquiries', group: 'Main Navigation', legacyPermission: 'manage_crm' },
  { key: 'crm', label: 'CRM Pipeline', href: '/erp/crm', group: 'Main Navigation', legacyPermission: 'manage_crm' },
  { key: 'quotations', label: 'Quotations', href: '/erp/quotations', group: 'Main Navigation', legacyPermission: 'manage_invoices' },

  // Site Operations
  { key: 'projects', label: 'Construction Projects', href: '/erp/projects', group: 'Site Operations', legacyPermission: 'manage_projects' },
  { key: 'site-logs', label: 'Daily Site Logs', href: '/erp/site-logs', group: 'Site Operations', legacyPermission: 'manage_projects' },
  { key: 'inventory', label: 'Materials Inventory', href: '/erp/inventory', group: 'Site Operations', legacyPermission: 'manage_inventory' },
  { key: 'machinery', label: 'Machinery Fleet', href: '/erp/machinery', group: 'Site Operations', legacyPermission: 'manage_projects' },
  { key: 'procurement', label: 'Procurement', href: '/erp/procurement', group: 'Site Operations', legacyPermission: 'manage_inventory' },
  { key: 'site-labour', label: 'Site Labour', href: '/erp/site-labour', group: 'Site Operations', legacyPermission: 'manage_employees' },

  // Finance & Admin
  { key: 'finance', label: 'Invoices', href: '/erp/finance', group: 'Finance & Admin', legacyPermission: 'manage_invoices' },
  { key: 'budgeting', label: 'Cost Control', href: '/erp/budgeting', group: 'Finance & Admin', legacyPermission: 'view_financials' },
  { key: 'contracts', label: 'Contracts', href: '/erp/contracts', group: 'Finance & Admin', legacyPermission: 'manage_projects' },
  { key: 'safety', label: 'Site Safety', href: '/erp/safety', group: 'Finance & Admin', legacyPermission: 'manage_projects' },
  { key: 'hr', label: 'Team Directory', href: '/erp/hr', group: 'Finance & Admin', legacyPermission: 'manage_employees' },
  { key: 'users', label: 'Users & Access Control', href: '/erp/users', group: 'Finance & Admin', legacyPermission: 'admin_settings' },
  { key: 'company', label: 'Company Profile', href: '/erp/company', group: 'Finance & Admin', legacyPermission: 'admin_settings' },
  { key: 'audit', label: 'System & Audit Logs', href: '/erp/audit', group: 'Finance & Admin', legacyPermission: 'view_audit_logs' },
];

export const CRUD_ACTIONS: CrudAction[] = ['view', 'create', 'edit', 'delete'];

export function permKey(moduleKey: string, action: CrudAction): `${string}:${CrudAction}` {
  return `${moduleKey}:${action}`;
}

export function getModuleKeyFromPath(pathname: string): string {
  const exact = ERP_MODULES.find((m) => m.href === pathname);
  if (exact) return exact.key;
  const prefix = ERP_MODULES.find((m) => m.href !== '/erp' && pathname.startsWith(m.href));
  return prefix ? prefix.key : 'dashboard';
}

export function hasModuleAccess(
  user: Pick<ERPUser, 'role' | 'permissions'> | null | undefined,
  moduleKey: string,
  action: CrudAction = 'view'
): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  const perms = Array.isArray(user.permissions) ? user.permissions : [];
  const hasGranular = perms.some((p) => typeof p === 'string' && p.includes(':'));

  if (hasGranular) {
    return perms.includes(permKey(moduleKey, action));
  }

  // Backward compatibility for users still storing legacy coarse permission keys
  if (moduleKey === 'dashboard') return action === 'view';
  const mod = ERP_MODULES.find((m) => m.key === moduleKey);
  if (!mod || !mod.legacyPermission) return false;

  if (mod.legacyPermission === 'view_financials') {
    return perms.includes('view_financials') && action === 'view';
  }
  if (mod.legacyPermission === 'view_audit_logs') {
    return perms.includes('view_audit_logs') && action === 'view';
  }
  if (mod.legacyPermission === 'manage_invoices') {
    if (perms.includes('manage_invoices')) return true;
    return perms.includes('view_financials') && action === 'view';
  }
  return perms.includes(mod.legacyPermission as never);
}

export function expandLegacyPermissions(legacyPerms: string[], role?: UserRole): string[] {
  if (role === 'SUPER_ADMIN') {
    return ERP_MODULES.flatMap((m) => CRUD_ACTIONS.map((a) => permKey(m.key, a)));
  }
  const hasGranular = legacyPerms.some((p) => p.includes(':'));
  if (hasGranular) return legacyPerms;

  const out = new Set<string>([permKey('dashboard', 'view')]);
  for (const mod of ERP_MODULES) {
    if (!mod.legacyPermission) continue;
    if (legacyPerms.includes(mod.legacyPermission)) {
      if (mod.legacyPermission === 'view_financials' || mod.legacyPermission === 'view_audit_logs') {
        out.add(permKey(mod.key, 'view'));
      } else {
        CRUD_ACTIONS.forEach((a) => out.add(permKey(mod.key, a)));
      }
    } else if (mod.key === 'finance' && legacyPerms.includes('view_financials')) {
      out.add(permKey('finance', 'view'));
    }
  }
  return Array.from(out);
}
