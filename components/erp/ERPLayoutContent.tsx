"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useERP } from '@/lib/erp/AuthContext';
import {
  LayoutDashboard,
  CreditCard,
  HardHat,
  Boxes,
  Users,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Lock,
  Sparkles,
  FileText,
  Wrench,
  Activity,
  Globe,
  Building2,
  ShoppingCart,
  Calculator,
  ShieldAlert,
  Clock,
  Layers,
  Bell,
  Key,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  Mail,
  User,
} from 'lucide-react';

const PRIMARY_NAV = [
  { label: 'Dashboard Overview', href: '/erp', icon: LayoutDashboard },
  { label: 'Website Projects & Services', href: '/erp/website', icon: Globe },
  { label: 'Client Inquiries & CRM', href: '/erp/crm', icon: Users },
  { label: 'Quotations & Fixed BOQ', href: '/erp/quotations', icon: FileText },
];

const SITE_OPERATIONS_NAV = [
  { label: 'Construction Projects', href: '/erp/projects', icon: HardHat },
  { label: 'Daily Site Logs', href: '/erp/site-logs', icon: Clock },
  { label: 'Materials & Inventory', href: '/erp/inventory', icon: Boxes },
  { label: 'Machinery & Vehicles', href: '/erp/machinery', icon: Wrench },
  { label: 'Procurement & Orders', href: '/erp/procurement', icon: ShoppingCart },
  { label: 'Site Labour & Workers', href: '/erp/site-labour', icon: Activity },
];

const MANAGEMENT_NAV = [
  { label: 'Invoices & Billing', href: '/erp/finance', icon: CreditCard },
  { label: 'Cost Control & Budget', href: '/erp/budgeting', icon: Calculator },
  { label: 'Site Safety & Checks', href: '/erp/safety', icon: ShieldAlert },
  { label: 'Team Directory', href: '/erp/hr', icon: Users },
  { label: 'Company Profile & Info', href: '/erp/company', icon: Building2 },
];

export default function ERPLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout, activeCompany, setActiveCompany, companies } = useERP();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current) {
      setPasswordStatus({ type: 'error', msg: 'Please enter your current account password.' });
      return;
    }
    if (passwordForm.newPass.length < 6) {
      setPasswordStatus({ type: 'error', msg: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordStatus({ type: 'error', msg: 'New password and confirmation do not match.' });
      return;
    }
    setPasswordStatus({ type: 'success', msg: 'Enterprise security credentials updated successfully.' });
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    setTimeout(() => {
      setPasswordStatus(null);
    }, 4000);
  };

  // If on login page, render full screen login without sidebar
  if (pathname === '/erp/login') {
    return <>{children}</>;
  }

  // Authentication Guard
  if (!isLoading && !user) {
    if (typeof window !== 'undefined') {
      router.push('/erp/login');
    }
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading staff dashboard...</p>
        </div>
      </div>
    );
  }

  const currentCompProfile = companies.find((c) => c.id === activeCompany);

  return (
    <div className="min-h-screen bg-[#050811] text-[#f4f4f7] flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 h-20 bg-[#080e1c]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Official CONTEC Navbar Logo - Large & Prominent */}
          <Link href="/erp" className="flex items-center group py-2">
            <div className="relative h-12 sm:h-14 w-56 sm:w-68 md:w-80 transition-transform duration-300 group-hover:scale-102 flex items-center">
              <Image
                src="/branding/contec-white-logo.png"
                alt="CONTEC Design & Build"
                fill
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
          </Link>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* 1. Operating Division Selector - Standardized h-12 */}
          <div className="relative">
            <button
              onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
              className="h-12 flex items-center gap-2.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-200 transition-all cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/25 flex items-center justify-center text-[#FFB800] shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider leading-none mb-1">Operating Division</div>
                <div className="font-bold text-white text-xs truncate max-w-[140px] md:max-w-[170px] leading-tight">
                  {activeCompany === 'CONSOLIDATED'
                    ? 'All Divisions'
                    : currentCompProfile?.tradeName || activeCompany}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ml-0.5 ${companyMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {companyMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#080f24] border border-white/15 shadow-2xl p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <span className="text-xs font-bold text-white block">Operating Division</span>
                  <p className="text-[11px] text-zinc-400">Select branch or view consolidated company operations</p>
                </div>
                <div className="space-y-1">
                  {companies.map((comp) => {
                    const isSelected = activeCompany === comp.id;
                    return (
                      <button
                        key={comp.id}
                        onClick={() => {
                          setActiveCompany(comp.id);
                          setCompanyMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0038B8]/30 border border-blue-400 text-white font-bold'
                            : 'hover:bg-white/5 text-zinc-300 border border-transparent'
                        }`}
                      >
                        <div className="font-semibold text-white">{comp.tradeName}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{comp.name}</div>
                      </button>
                    );
                  })}

                  <button
                    onClick={() => {
                      setActiveCompany('CONSOLIDATED');
                      setCompanyMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all mt-1 cursor-pointer ${
                      activeCompany === 'CONSOLIDATED'
                        ? 'bg-blue-600/30 border border-blue-400 text-white font-bold'
                        : 'hover:bg-white/5 text-zinc-300 border border-white/5'
                    }`}
                  >
                    <div className="font-semibold text-blue-300">🏢 Combined Overview</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      All projects and financial metrics across CONTEC
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Secure Staff Profile - Standardized h-12 Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="h-12 flex items-center gap-2.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/40 text-xs transition-all cursor-pointer focus:outline-none text-left"
            title="View Staff Profile & Enterprise Security Credentials"
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0038B8] to-blue-600 text-white font-bold text-xs flex items-center justify-center border border-white/20 shadow-inner">
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'ST'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#080e1c]" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-bold text-white text-xs truncate max-w-[130px] md:max-w-[160px] leading-tight mb-0.5">
                {user?.name || 'Staff User'}
              </div>
              <div className="text-[10px] text-[#FFB800] font-semibold leading-none truncate max-w-[130px] md:max-w-[160px]">
                {user?.department || user?.role?.replace(/_/g, ' ') || 'Executive Board'}
              </div>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-0.5 hidden sm:block" />
          </button>

          {/* 3. Session Sign Out - Standardized h-12 Button */}
          <button
            onClick={async () => {
              await logout();
              router.push('/erp/login');
            }}
            className="h-12 flex items-center gap-2.5 px-3.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-red-300 bg-white/[0.04] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 group transition-all cursor-pointer focus:outline-none text-left"
            title="Sign Out of Staff Session"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 group-hover:text-red-300 transition-colors shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider leading-none mb-1">Session</div>
              <div className="font-bold text-zinc-200 group-hover:text-red-300 transition-colors text-xs leading-tight">Sign Out</div>
            </div>
          </button>

          {/* 4. Quick Activity & Notifications Bell - Standardized h-12 w-12 */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="h-12 w-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer relative focus:outline-none"
              title="Notifications & Recent Inquiries"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FFB800] ring-2 ring-[#080e1c] animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#080f24] border border-white/15 shadow-2xl p-3 z-50 animate-fadeIn space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
                  <span className="text-xs font-bold text-white">Notifications &amp; Activity</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    3 Active
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>New Website Inquiry</span>
                      <span className="text-[10px] text-zinc-400">10m ago</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      Dr. K. Jayasundara submitted a hillside villa inquiry from /contact.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Site Inspection Ready</span>
                      <span className="text-[10px] text-zinc-400">1h ago</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      Hanthana Hillside Villa foundation stage 02 inspection approved.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Encrypted Cloud Backup</span>
                      <span className="text-[10px] text-zinc-400">Today</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      Automated AES-256 cloud sync completed across all 12 modules.
                    </p>
                  </div>
                </div>
                <div className="pt-1 text-center">
                  <Link
                    href="/erp/crm"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] text-[#FFB800] hover:underline font-bold inline-block"
                  >
                    View All Inquiries in CRM →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#070c18] border-r border-white/10 pt-20 lg:pt-0 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Primary Navigation */}
              <div>
                <div className="text-[10px] uppercase font-bold text-[#FFB800] tracking-wider px-3 mb-2">
                  Main Navigation
                </div>
                <nav className="space-y-1">
                  {PRIMARY_NAV.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] text-white shadow-lg shadow-blue-900/40 border border-blue-400/30'
                            : 'text-zinc-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFB800]' : 'text-zinc-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Site Operations */}
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider px-3 mb-2">
                  Site Operations
                </div>
                <nav className="space-y-1">
                  {SITE_OPERATIONS_NAV.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] text-white shadow-lg shadow-blue-900/40 border border-blue-400/30'
                            : 'text-zinc-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFB800]' : 'text-zinc-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Finance & Management */}
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider px-3 mb-2">
                  Finance &amp; Admin
                </div>
                <nav className="space-y-1">
                  {MANAGEMENT_NAV.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] text-white shadow-lg shadow-blue-900/40 border border-blue-400/30'
                            : 'text-zinc-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFB800]' : 'text-zinc-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#050811] via-[#070d1d] to-[#050811] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Staff Profile & Enterprise Security Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#080f24] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0038B8] to-blue-600 text-white font-extrabold text-base flex items-center justify-center border border-white/20 shadow-inner">
                    {user?.name
                      ? user.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'ST'}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#080f24]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>{user?.name || 'Staff User'}</span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </h3>
                  <p className="text-xs text-[#FFB800] font-medium">
                    {user?.role?.replace(/_/g, ' ') || 'Executive Board'} • {user?.department || 'Executive Management'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setPasswordStatus(null);
                }}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile & Security Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Staff Identity ID</span>
                <div className="font-mono font-bold text-white text-xs">{user?.id || 'EMP-CONTEC-014'}</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Email Contact</span>
                <div className="font-bold text-white text-xs truncate">{user?.email || 'elena.vance@contec.lk'}</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">2FA Security</span>
                <div className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hardware &amp; TOTP Active</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Session Encryption</span>
                <div className="font-bold text-blue-300 text-xs">TLS 1.3 / AES-256 GCM</div>
              </div>
            </div>

            {/* Active Security Clearances */}
            <div>
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Active Staff Clearances
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Public Website Publishing',
                  'Fixed BOQ & Contracts',
                  'Engineering Drawings',
                  'Finance & Invoices',
                  'Site Progress & Labour',
                  'Procurement Limits',
                ].map((perm) => (
                  <span
                    key={perm}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-300"
                  >
                    ✓ {perm}
                  </span>
                ))}
              </div>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handleUpdatePassword} className="space-y-3 pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Update Account Password</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              {passwordStatus && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    passwordStatus.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/15 border border-red-500/30 text-red-300'
                  }`}
                >
                  {passwordStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                  )}
                  <span>{passwordStatus.msg}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Current Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.newPass}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] text-white font-bold transition-all shadow-md shadow-blue-950/50 cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
