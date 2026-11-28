"use client";

import React, { useEffect, useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { ROLE_PERMISSIONS } from '@/lib/erp/auth';
import {
  ERP_MODULES,
  CRUD_ACTIONS,
  CrudAction,
  permKey,
  expandLegacyPermissions,
} from '@/lib/erp/permissions';
import { ActiveCompany, Permission, UserRole } from '@/lib/erp/types';
import DataViewToolbar, { ViewMode } from '@/components/erp/DataViewToolbar';
import ModuleAnalytics from '@/components/erp/ModuleAnalytics';
import CustomSelect from '@/components/erp/CustomSelect';
import {
  Users,
  ShieldCheck,
  Key,
  Lock,
  Unlock,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  CheckCircle2,
  AlertTriangle,
  Building2,
} from 'lucide-react';

interface ManagedUser {
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
}

const ALL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'FINANCE_DIRECTOR',
  'OPERATIONS_HEAD',
  'PROJECT_DIRECTOR',
  'HR_MANAGER',
  'SALES_DIRECTOR',
  'PROJECT_ENGINEER',
  'QUANTITY_SURVEYOR',
  'SAFETY_ENGINEER',
];

const ALL_PERMISSIONS: { key: Permission; label: string; desc: string }[] = [
  { key: 'view_financials', label: 'View Financials', desc: 'Ledgers, cashflow, P&L, and budgets' },
  { key: 'manage_invoices', label: 'Manage Invoices & BOQ', desc: 'Issue/edit IPCs, quotations & billing' },
  { key: 'manage_projects', label: 'Manage Construction Projects', desc: 'Sites, logs, machinery, safety & contracts' },
  { key: 'manage_inventory', label: 'Manage Inventory & Procurement', desc: 'Stockpiles, POs, GRNs & stores' },
  { key: 'manage_employees', label: 'Manage HR & Payroll', desc: 'Staff, EPF/ETF & daily site labour' },
  { key: 'manage_crm', label: 'Manage CRM & Website', desc: 'Leads, tenders, public projects & services' },
  { key: 'view_audit_logs', label: 'View System & Audit Logs', desc: 'Security trail, vault & system health' },
  { key: 'admin_settings', label: 'Admin & RBAC Control', desc: 'Create users, change roles & permissions' },
];

export default function UsersAccessControlPage() {
  const { user: currentUser } = useERP();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('DETAILED');

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('PROJECT_ENGINEER');
  const [formTitle, setFormTitle] = useState('');
  const [formDepartment, setFormDepartment] = useState('Field Operations');
  const [formScope, setFormScope] = useState<ActiveCompany>('CONSOLIDATED');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [formMfa, setFormMfa] = useState(false);
  const [formPermissions, setFormPermissions] = useState<Permission[]>(ROLE_PERMISSIONS.PROJECT_ENGINEER);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/erp/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('PROJECT_ENGINEER');
    setFormTitle('Site Engineer');
    setFormDepartment('Field Operations');
    setFormScope('CONSOLIDATED');
    setFormStatus('ACTIVE');
    setFormMfa(false);
    setFormPermissions(
      expandLegacyPermissions(ROLE_PERMISSIONS.PROJECT_ENGINEER, 'PROJECT_ENGINEER') as Permission[]
    );
    setShowModal(true);
  };

  const openEdit = (u: ManagedUser) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormPassword('');
    setFormRole(u.role);
    setFormTitle(u.title);
    setFormDepartment(u.department);
    setFormScope(u.companyScope || 'CONSOLIDATED');
    setFormStatus(u.status);
    setFormMfa(Boolean(u.mfaEnabled));
    setFormPermissions(expandLegacyPermissions(u.permissions, u.role) as Permission[]);
    setShowModal(true);
  };

  const handleRoleChange = (role: UserRole) => {
    setFormRole(role);
    setFormPermissions(
      expandLegacyPermissions(ROLE_PERMISSIONS[role] || [], role) as Permission[]
    );
  };

  const toggleModuleAction = (moduleKey: string, action: CrudAction) => {
    const key = permKey(moduleKey, action) as Permission;
    const viewKey = permKey(moduleKey, 'view') as Permission;
    setFormPermissions((prev) => {
      const exists = prev.includes(key);
      if (exists) {
        if (action === 'view') {
          // Removing view also removes create/edit/delete for that module
          return prev.filter((p) => !p.startsWith(`${moduleKey}:`));
        }
        return prev.filter((p) => p !== key);
      } else {
        const next = new Set(prev);
        next.add(key);
        if (action !== 'view') {
          // Granting create/edit/delete automatically grants view
          next.add(viewKey);
        }
        return Array.from(next) as Permission[];
      }
    });
  };

  const toggleModuleRowAll = (moduleKey: string) => {
    const allForMod = CRUD_ACTIONS.map((a) => permKey(moduleKey, a) as Permission);
    setFormPermissions((prev) => {
      const hasAll = allForMod.every((k) => prev.includes(k));
      if (hasAll) {
        return prev.filter((p) => !p.startsWith(`${moduleKey}:`));
      }
      return Array.from(new Set([...prev, ...allForMod])) as Permission[];
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    const payload = editingUser
      ? {
          id: editingUser.id,
          name: formName,
          role: formRole,
          title: formTitle,
          department: formDepartment,
          companyScope: formScope,
          status: formStatus,
          mfaEnabled: formMfa,
          permissions: formPermissions,
          ...(formPassword.trim().length >= 6 ? { password: formPassword.trim() } : {}),
        }
      : {
          name: formName,
          email: formEmail,
          password: formPassword,
          role: formRole,
          title: formTitle,
          department: formDepartment,
          companyScope: formScope,
          status: formStatus,
          mfaEnabled: formMfa,
          permissions: formPermissions,
        };

    const res = await fetch('/api/erp/users', {
      method: editingUser ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setBanner({ ok: false, text: data.error || 'Failed to save user' });
      return;
    }

    setUsers(data.users);
    setShowModal(false);
    setBanner({
      ok: true,
      text: editingUser ? `Updated access control for ${formName}.` : `Provisioned account ${formEmail}.`,
    });
  };

  const toggleSuspend = async (u: ManagedUser) => {
    const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const res = await fetch('/api/erp/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: u.id, status: nextStatus }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setUsers(data.users);
      setBanner({ ok: true, text: `${u.name} marked as ${nextStatus}.` });
    } else {
      setBanner({ ok: false, text: data.error || 'Permission denied' });
    }
  };

  const handleDelete = async (u: ManagedUser) => {
    if (!confirm(`Permanently revoke and delete user "${u.name}" (${u.email})?`)) return;
    const res = await fetch(`/api/erp/users?id=${encodeURIComponent(u.id)}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && data.success) {
      setUsers(data.users);
      setBanner({ ok: true, text: `Deleted user ${u.email}.` });
    } else {
      setBanner({ ok: false, text: data.error || 'Could not delete user' });
    }
  };

  const filtered = users
    .filter((u) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'role') return a.role.localeCompare(b.role) * mul;
      if (sortBy === 'status') return a.status.localeCompare(b.status) * mul;
      return a.name.localeCompare(b.name) * mul;
    });

  const activeCount = users.filter((u) => u.status === 'ACTIVE').length;
  const suspendedCount = users.filter((u) => u.status === 'SUSPENDED').length;
  const adminCount = users.filter((u) => u.permissions.includes('admin_settings')).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            User Management &amp; Access Control (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Provision staff logins, assign CIDA/ERP role templates, configure granular module permissions, company scope, and account locks.
          </p>
        </div>
      </div>

      {banner && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            banner.ok
              ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
              : 'bg-red-950/60 border-red-500/30 text-red-200'
          }`}
        >
          {banner.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
          <span>{banner.text}</span>
        </div>
      )}

      <ModuleAnalytics
        title="Identity & Access Control Metrics"
        stats={[
          { label: 'Total ERP Accounts', value: users.length, subtitle: 'Active ERP accounts', accent: 'blue', icon: <Users className="w-4 h-4" /> },
          { label: 'Active Sessions Eligible', value: activeCount, subtitle: 'Verified active users', accent: 'emerald', icon: <ShieldCheck className="w-4 h-4" /> },
          { label: 'Suspended / Locked', value: suspendedCount, subtitle: 'Blocked at login gate', accent: suspendedCount > 0 ? 'amber' : 'blue', icon: <Lock className="w-4 h-4" /> },
          { label: 'Privileged Admins', value: adminCount, subtitle: 'Hold admin_settings scope', accent: 'gold', icon: <Key className="w-4 h-4" /> },
        ]}
        reportFilename="contec-rbac-users"
        showModeToggle={false}
        reportRows={users.map((u) => ({
          Name: u.name,
          Email: u.email,
          Role: u.role,
          Department: u.department,
          Scope: u.companyScope,
          Status: u.status,
          Permissions: u.permissions.join(' | '),
        }))}
      />

      <DataViewToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users by name, email, role, or division..."
        sortOptions={[
          { value: 'name', label: 'Full Name' },
          { value: 'role', label: 'Role' },
          { value: 'status', label: 'Account Status' },
        ]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDir={sortDir}
        onSortDirToggle={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={users.length}
        filteredCount={filtered.length}
        onCreateClick={openCreate}
        createLabel="New ERP User"
      />

      {loading ? (
        <div className="p-8 text-center text-xs text-zinc-400">Loading user directory...</div>
      ) : viewMode === 'DETAILED' ? (
        <div className="rounded-2xl bg-[#080e1c]/90 border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-[10px] uppercase text-zinc-400 font-mono">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role &amp; Division</th>
                <th className="p-3.5">Company Scope</th>
                <th className="p-3.5">Permissions</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{u.email}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-mono text-[10px] font-bold">{u.role}</span>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{u.department}</div>
                  </td>
                  <td className="p-3.5 font-mono text-zinc-300">{u.companyScope}</td>
                  <td className="p-3.5 text-[11px] text-zinc-300">{u.permissions.length} granted</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button type="button" onClick={() => toggleSuspend(u)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-amber-400 cursor-pointer" title={u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}>
                        {u.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                      <button type="button" onClick={() => openEdit(u)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-blue-400 cursor-pointer" title="Edit Access">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button type="button" onClick={() => handleDelete(u)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 cursor-pointer" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={
            viewMode === 'TILE'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'
              : viewMode === 'COMPACT'
              ? 'space-y-2'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          }
        >
          {filtered.map((u) => (
            <div
              key={u.id}
              className={`rounded-2xl bg-[#080e1c]/90 border border-white/10 hover:border-blue-500/30 transition-all flex ${
                viewMode === 'COMPACT' ? 'p-3 items-center justify-between gap-3' : 'p-4 flex-col justify-between gap-3'
              }`}
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{u.name}</h3>
                    <div className="text-[11px] font-mono text-zinc-400 truncate">{u.email}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                    {u.status}
                  </span>
                </div>

                {viewMode !== 'COMPACT' && (
                  <>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold">
                        {u.role}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-300 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#FFB800]" />
                        {u.companyScope}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {u.permissions.slice(0, 4).map((p) => (
                        <span key={p} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-300">
                          {p}
                        </span>
                      ))}
                      {u.permissions.length > 4 && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FFB800]/15 text-[#FFB800]">
                          +{u.permissions.length - 4} more
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => openEdit(u)} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-blue-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer">
                    <Edit3 className="w-3 h-3" />
                    <span>Edit RBAC</span>
                  </button>
                  <button type="button" onClick={() => toggleSuspend(u)} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-amber-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer">
                    {u.status === 'ACTIVE' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}</span>
                  </button>
                </div>
                {u.id !== currentUser?.id && (
                  <button type="button" onClick={() => handleDelete(u)} className="px-2 py-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold cursor-pointer">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit RBAC Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#FFB800]" />
                <span>{editingUser ? `Edit Access Control: ${editingUser.name}` : 'Provision New ERP User'}</span>
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    disabled={Boolean(editingUser)}
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    {editingUser ? 'New Password (leave blank to keep)' : 'Password * (min 6 chars)'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    minLength={editingUser ? undefined : 6}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Role Template</label>
                  <CustomSelect
                    value={formRole}
                    onChange={(val) => handleRoleChange(val as UserRole)}
                    options={ALL_ROLES}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Designation / Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Company Access Scope</label>
                  <CustomSelect
                    value={formScope}
                    onChange={(val) => setFormScope(val as ActiveCompany)}
                    options={[
                      { value: 'CONSOLIDATED', label: 'Consolidated (All Divisions)' },
                      { value: 'COMP_A', label: 'CONTEC Engineering (COMP_A)' },
                      { value: 'COMP_B', label: 'CONTEC Plant & Earthworks (COMP_B)' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Account Status</label>
                  <CustomSelect
                    value={formStatus}
                    onChange={(val) => setFormStatus(val as 'ACTIVE' | 'SUSPENDED')}
                    options={[
                      { value: 'ACTIVE', label: 'ACTIVE' },
                      { value: 'SUSPENDED', label: 'SUSPENDED (Blocked)' },
                    ]}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formMfa}
                  onChange={(e) => setFormMfa(e.target.checked)}
                  className="w-4 h-4 accent-[#0038B8]"
                />
                <span className="font-semibold text-zinc-200">Require Hardware / 2FA Session Verification (Optional)</span>
              </label>

              {/* Per-Module View / Create / Edit / Delete Access Matrix */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-blue-300 uppercase tracking-wider text-[11px] block">
                      Navbar &amp; Module Access Matrix ({formPermissions.filter((p) => p.endsWith(':view')).length} / {ERP_MODULES.length} Tabs Visible)
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Unchecking <strong>View</strong> hides the tab from the user&apos;s sidebar navbar and blocks access.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormPermissions(
                          ERP_MODULES.map((m) => permKey(m.key, 'view')) as Permission[]
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-emerald-300 cursor-pointer"
                    >
                      View Only All
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormPermissions(
                          ERP_MODULES.flatMap((m) =>
                            CRUD_ACTIONS.map((a) => permKey(m.key, a))
                          ) as Permission[]
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#FFB800]/15 hover:bg-[#FFB800]/25 text-[10px] font-bold text-[#FFB800] cursor-pointer"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormPermissions([])}
                      className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-[10px] font-bold text-red-300 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto rounded-xl border border-white/10 custom-scrollbar">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#0b132b] text-zinc-400 sticky top-0 z-10 border-b border-white/10">
                      <tr>
                        <th className="p-2.5">Sidebar Module</th>
                        <th className="p-2.5 text-center">View</th>
                        <th className="p-2.5 text-center">Create</th>
                        <th className="p-2.5 text-center">Edit</th>
                        <th className="p-2.5 text-center">Delete</th>
                        <th className="p-2.5 text-right">All</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {ERP_MODULES.map((mod) => {
                        const rowAllChecked = CRUD_ACTIONS.every((a) =>
                          formPermissions.includes(permKey(mod.key, a) as Permission)
                        );
                        return (
                          <tr key={mod.key} className="hover:bg-white/[0.03]">
                            <td className="p-2.5">
                              <div className="font-semibold text-white">{mod.label}</div>
                              <div className="text-[9px] text-zinc-500">{mod.group}</div>
                            </td>
                            {CRUD_ACTIONS.map((act) => {
                              const checked = formPermissions.includes(
                                permKey(mod.key, act) as Permission
                              );
                              return (
                                <td key={act} className="p-2.5 text-center">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleModuleAction(mod.key, act)}
                                    className="w-3.5 h-3.5 accent-[#0038B8] cursor-pointer"
                                    aria-label={`${mod.label} ${act}`}
                                  />
                                </td>
                              );
                            })}
                            <td className="p-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => toggleModuleRowAll(mod.key)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                  rowAllChecked
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/5 text-zinc-400 hover:text-white'
                                }`}
                              >
                                {rowAllChecked ? 'Full' : 'All'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0038B8] text-white font-bold flex items-center gap-1.5 cursor-pointer">
                  <Check className="w-4 h-4" />
                  <span>{editingUser ? 'Save Access Control' : 'Create User Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
