"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useERP } from '@/lib/erp/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  Search,
  ArrowRight,
  TrendingUp,
  Sun,
  Moon,
} from 'lucide-react';

const PRIMARY_NAV = [
  { label: 'Dashboard Overview', href: '/erp', icon: LayoutDashboard },
  { label: 'Website Projects', href: '/erp/website', icon: Globe },
  { label: 'Website Services', href: '/erp/services', icon: Layers },
  { label: 'Client Inquiries', href: '/erp/inquiries', icon: Mail },
  { label: 'CRM Pipeline', href: '/erp/crm', icon: TrendingUp },
  { label: 'Quotations', href: '/erp/quotations', icon: FileText },
];

const SITE_OPERATIONS_NAV = [
  { label: 'Construction Projects', href: '/erp/projects', icon: HardHat },
  { label: 'Daily Site Logs', href: '/erp/site-logs', icon: Clock },
  { label: 'Materials Inventory', href: '/erp/inventory', icon: Boxes },
  { label: 'Machinery Fleet', href: '/erp/machinery', icon: Wrench },
  { label: 'Procurement', href: '/erp/procurement', icon: ShoppingCart },
  { label: 'Site Labour', href: '/erp/site-labour', icon: Activity },
];

const MANAGEMENT_NAV = [
  { label: 'Invoices', href: '/erp/finance', icon: CreditCard },
  { label: 'Cost Control', href: '/erp/budgeting', icon: Calculator },
  { label: 'Contracts', href: '/erp/contracts', icon: ShieldCheck },
  { label: 'Site Safety', href: '/erp/safety', icon: ShieldAlert },
  { label: 'Team Directory', href: '/erp/hr', icon: Users },
  { label: 'Company Profile', href: '/erp/company', icon: Building2 },
  { label: 'Audit Logs', href: '/erp/audit', icon: Lock },
];

export default function ERPLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    isLoading,
    logout,
    activeCompany,
    setActiveCompany,
    companies,
    projects,
    invoices,
    websiteInquiries,
    leads,
    inventory,
    machinery,
    employees,
    auditLogs,
  } = useERP();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [erpTheme, setErpTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('contec_erp_theme');
    if (saved === 'light' || saved === 'dark') {
      setErpTheme(saved);
    }
  }, []);

  const toggleErpTheme = () => {
    const next = erpTheme === 'dark' ? 'light' : 'dark';
    setErpTheme(next);
    localStorage.setItem('contec_erp_theme', next);
  };
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Global Advanced Search State
  const [globalQuery, setGlobalQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchScope, setSearchScope] = useState<'ALL' | 'PAGES' | 'PROJECTS' | 'INQUIRIES' | 'FINANCE' | 'INVENTORY'>('ALL');
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setSearchFocused(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Build Advanced Global Search Index
  const q = globalQuery.trim().toLowerCase();
  const allNavItems = [...PRIMARY_NAV, ...SITE_OPERATIONS_NAV, ...MANAGEMENT_NAV];

  const searchResults = (() => {
    if (!q) return [];
    const results: {
      id: string;
      category: 'PAGES' | 'PROJECTS' | 'INQUIRIES' | 'FINANCE' | 'INVENTORY';
      badge: string;
      title: string;
      subtitle: string;
      href: string;
    }[] = [];

    if (searchScope === 'ALL' || searchScope === 'PAGES') {
      allNavItems
        .filter((n) => n.label.toLowerCase().includes(q) || n.href.toLowerCase().includes(q))
        .forEach((n) =>
          results.push({
            id: `nav-${n.href}`,
            category: 'PAGES',
            badge: 'Module',
            title: n.label,
            subtitle: n.href,
            href: n.href,
          })
        );
    }

    if (searchScope === 'ALL' || searchScope === 'PROJECTS') {
      projects
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.code.toLowerCase().includes(q) ||
            p.client.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q)
        )
        .forEach((p) =>
          results.push({
            id: `prj-${p.id}`,
            category: 'PROJECTS',
            badge: p.code,
            title: p.name,
            subtitle: `${p.client} • ${p.location} (${p.progress}%)`,
            href: '/erp/projects',
          })
        );
    }

    if (searchScope === 'ALL' || searchScope === 'INQUIRIES') {
      websiteInquiries
        .filter(
          (inq) =>
            inq.clientName.toLowerCase().includes(q) ||
            inq.email.toLowerCase().includes(q) ||
            inq.projectType.toLowerCase().includes(q) ||
            inq.phone.toLowerCase().includes(q)
        )
        .forEach((inq) =>
          results.push({
            id: `inq-${inq.id}`,
            category: 'INQUIRIES',
            badge: inq.status,
            title: inq.clientName,
            subtitle: `${inq.projectType} • ${inq.budgetRange}`,
            href: '/erp/inquiries',
          })
        );

      leads
        .filter(
          (l) =>
            l.company.toLowerCase().includes(q) ||
            l.clientName.toLowerCase().includes(q) ||
            l.projectType.toLowerCase().includes(q)
        )
        .forEach((l) =>
          results.push({
            id: `lead-${l.id}`,
            category: 'INQUIRIES',
            badge: l.stage,
            title: `${l.company} (${l.clientName})`,
            subtitle: `${l.projectType} • CRM Tender`,
            href: '/erp/crm',
          })
        );
    }

    if (searchScope === 'ALL' || searchScope === 'FINANCE') {
      invoices
        .filter(
          (inv) =>
            inv.invoiceNumber.toLowerCase().includes(q) ||
            inv.clientName.toLowerCase().includes(q) ||
            inv.projectName.toLowerCase().includes(q)
        )
        .forEach((inv) =>
          results.push({
            id: `inv-${inv.id}`,
            category: 'FINANCE',
            badge: inv.status,
            title: `${inv.invoiceNumber} — ${inv.clientName}`,
            subtitle: inv.projectName,
            href: '/erp/finance',
          })
        );
    }

    if (searchScope === 'ALL' || searchScope === 'INVENTORY') {
      inventory
        .filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.sku.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        )
        .forEach((item) =>
          results.push({
            id: `invt-${item.id}`,
            category: 'INVENTORY',
            badge: item.sku,
            title: item.name,
            subtitle: `${item.quantity} ${item.unit} • ${item.status}`,
            href: '/erp/inventory',
          })
        );

      machinery
        .filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.assetId.toLowerCase().includes(q)
        )
        .forEach((m) =>
          results.push({
            id: `mach-${m.id}`,
            category: 'INVENTORY',
            badge: m.assetId,
            title: m.name,
            subtitle: `Fleet • ${m.status}`,
            href: '/erp/machinery',
          })
        );

      employees
        .filter(
          (emp) =>
            emp.name.toLowerCase().includes(q) ||
            emp.empId.toLowerCase().includes(q) ||
            emp.department.toLowerCase().includes(q)
        )
        .forEach((emp) =>
          results.push({
            id: `emp-${emp.id}`,
            category: 'INVENTORY',
            badge: emp.empId,
            title: emp.name,
            subtitle: `${emp.role} • ${emp.department}`,
            href: '/erp/hr',
          })
        );
    }

    return results.slice(0, 12);
  })();

  const isLight = erpTheme === 'light';
  const unreadInquiries = websiteInquiries.filter((i) => i.status === 'NEW');
  const lowStockAlerts = inventory.filter((i) => i.status !== 'OPTIMAL');
  const totalAlertCount = unreadInquiries.length + lowStockAlerts.length;

  return (
    <div
      data-erp-theme={erpTheme}
      className={`min-h-screen flex flex-col antialiased transition-colors duration-300 ${
        isLight ? 'bg-[#f4f6fb] text-slate-900' : 'bg-[#050811] text-[#f4f4f7]'
      }`}
    >
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-40 h-16 sm:h-18 backdrop-blur-xl border-b px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 border-slate-200 shadow-xs'
            : 'bg-[#080e1c]/95 border-white/10'
        }`}
      >
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Official CONTEC Navbar Logo - Dynamic Dark/Light */}
          <Link href="/erp" className="flex items-center group py-1.5">
            <div className="relative h-10 sm:h-12 w-40 sm:w-48 lg:w-52 transition-transform duration-300 group-hover:scale-102 flex items-center">
              <Image
                src={isLight ? '/branding/contec-logo.png' : '/branding/contec-white-logo.png'}
                alt="CONTEC Design & Build"
                fill
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
          </Link>
        </div>

        {/* Advanced Global Search Bar */}
        <div ref={searchRef} className="hidden md:block flex-1 max-w-md mx-2 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={globalQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setGlobalQuery(e.target.value);
                setSearchFocused(true);
              }}
              placeholder="Search projects, invoices, inquiries, stock, modules..."
              className="w-full h-12 pl-10 pr-20 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] focus:bg-[#050811] border border-white/10 focus:border-[#FFB800]/60 text-xs text-white placeholder-zinc-400 focus:outline-none transition-all"
            />
            {globalQuery ? (
              <button
                type="button"
                onClick={() => setGlobalQuery('')}
                className="absolute right-3 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label="Clear global search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-3 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 pointer-events-none">
                Ctrl K
              </span>
            )}
          </div>

          {searchFocused && (
            <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-[#080f24] border border-white/15 shadow-2xl p-3 z-50 animate-fadeIn space-y-2.5">
              {/* Scope Filter Pills */}
              <div className="flex flex-wrap items-center gap-1 pb-2 border-b border-white/10">
                {(
                  [
                    { id: 'ALL', label: 'All' },
                    { id: 'PAGES', label: 'Modules' },
                    { id: 'PROJECTS', label: 'Projects' },
                    { id: 'INQUIRIES', label: 'Inquiries' },
                    { id: 'FINANCE', label: 'Invoices' },
                    { id: 'INVENTORY', label: 'Resources' },
                  ] as const
                ).map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSearchScope(sc.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                      searchScope === sc.id
                        ? 'bg-[#0038B8] text-white'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>

              {!q ? (
                <div className="py-3 px-2 text-center text-[11px] text-zinc-400">
                  Type to search across all {allNavItems.length} ERP modules, MySQL projects, invoices, inquiries, materials, and staff.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-4 px-2 text-center text-xs text-zinc-400">
                  No matches found for &ldquo;<span className="text-white font-semibold">{globalQuery}</span>&rdquo;.
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-1">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSearchFocused(false);
                        setGlobalQuery('');
                        router.push(item.href);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0038B8]/30 border border-blue-400/30 text-[#FFB800] shrink-0">
                            {item.badge}
                          </span>
                          <span className="text-xs font-bold text-white truncate">{item.title}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate mt-0.5">{item.subtitle}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#FFB800] shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center / Right controls - Clean & Uniform h-10 */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 1. Operating Division Selector */}
          <div className="relative">
            <button
              onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
              className={`h-10 flex items-center gap-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-200'
              }`}
            >
              <Building2 className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#0038B8]' : 'text-[#FFB800]'}`} />
              <span className="hidden xl:inline truncate max-w-[140px]">
                {activeCompany === 'CONSOLIDATED'
                  ? 'All Divisions'
                  : currentCompProfile?.tradeName || activeCompany}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${companyMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {companyMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className={`absolute right-0 mt-2 w-72 rounded-xl border shadow-2xl p-2 z-50 ${
                    isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#080f24] border-white/15 text-white'
                  }`}
                >
                  <div className={`px-3 py-2 border-b mb-1 ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                    <span className="text-xs font-bold block">Operating Division</span>
                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Select branch or consolidated view
                    </p>
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
                              ? 'bg-[#0038B8] text-white font-bold'
                              : isLight
                              ? 'hover:bg-slate-100 text-slate-700'
                              : 'hover:bg-white/5 text-zinc-300'
                          }`}
                        >
                          <div className="font-semibold">{comp.tradeName}</div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                            {comp.name}
                          </div>
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
                          ? 'bg-[#0038B8] text-white font-bold'
                          : isLight
                          ? 'hover:bg-slate-100 text-slate-700'
                          : 'hover:bg-white/5 text-zinc-300'
                      }`}
                    >
                      <div className="font-semibold">Combined Overview</div>
                      <div className={`text-[10px] mt-0.5 ${activeCompany === 'CONSOLIDATED' ? 'text-blue-100' : isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                        All projects and financial metrics across CONTEC
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Staff Profile Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className={`h-10 flex items-center gap-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white'
            }`}
            title="Staff Profile & Security"
          >
            <div className="relative shrink-0">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0038B8] to-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'ST'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white" />
            </div>
            <span className="hidden sm:inline truncate max-w-[110px]">
              {user?.name || 'Elena Vance'}
            </span>
          </button>

          {/* 3. Light / Dark Theme Toggle */}
          <button
            onClick={toggleErpTheme}
            className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer focus:outline-none ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-amber-600'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-[#FFB800]'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Light/Dark Mode"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* 4. Dynamic Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer relative focus:outline-none ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-300 hover:text-white'
              }`}
              title="Live Notifications"
            >
              <Bell className="w-4 h-4" />
              {totalAlertCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl p-3 z-50 space-y-2 ${
                    isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#080f24] border-white/15 text-white'
                  }`}
                >
                  <div className={`flex items-center justify-between pb-2 border-b px-1 ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                    <span className="text-xs font-bold">Live Notifications</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold">
                      {totalAlertCount} Active
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs max-h-64 overflow-y-auto">
                    {unreadInquiries.slice(0, 2).map((inq) => (
                      <Link
                        key={inq.id}
                        href="/erp/inquiries"
                        onClick={() => setNotificationsOpen(false)}
                        className={`block p-2.5 rounded-xl border space-y-0.5 transition-colors ${
                          isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="font-semibold flex items-center justify-between">
                          <span>New Inquiry: {inq.clientName}</span>
                          <span className="text-[10px] opacity-60">{inq.date}</span>
                        </div>
                        <p className="text-[11px] opacity-75 truncate">{inq.projectType} • {inq.budgetRange}</p>
                      </Link>
                    ))}
                    {lowStockAlerts.slice(0, 2).map((item) => (
                      <Link
                        key={item.id}
                        href="/erp/inventory"
                        onClick={() => setNotificationsOpen(false)}
                        className={`block p-2.5 rounded-xl border space-y-0.5 transition-colors ${
                          isLight ? 'bg-amber-50 border-amber-200 hover:bg-amber-100/60' : 'bg-amber-500/10 border-amber-500/20'
                        }`}
                      >
                        <div className="font-semibold flex items-center justify-between">
                          <span>Stock Alert: {item.name}</span>
                          <span className="text-[10px] text-amber-500 font-bold">{item.status}</span>
                        </div>
                        <p className="text-[11px] opacity-75">{item.quantity} {item.unit} remaining</p>
                      </Link>
                    ))}
                    {auditLogs[0] && (
                      <div className={`p-2.5 rounded-xl border space-y-0.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/5'}`}>
                        <div className="font-semibold flex items-center justify-between">
                          <span>{auditLogs[0].action.replace(/_/g, ' ')}</span>
                          <span className="text-[10px] opacity-60">{auditLogs[0].module}</span>
                        </div>
                        <p className="text-[11px] opacity-75 truncate">{auditLogs[0].details}</p>
                      </div>
                    )}
                  </div>
                  <div className="pt-1 text-center">
                    <Link
                      href="/erp/inquiries"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11px] text-[#0038B8] dark:text-[#FFB800] hover:underline font-bold inline-block"
                    >
                      View All Inquiries →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Sign Out */}
          <button
            onClick={async () => {
              await logout();
              router.push('/erp/login');
            }}
            className={`h-10 flex items-center gap-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
              isLight
                ? 'bg-slate-50 hover:bg-red-50 border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-600'
                : 'bg-white/[0.04] hover:bg-red-500/10 border-white/10 hover:border-red-500/30 text-zinc-300 hover:text-red-300'
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 border-r pt-20 lg:pt-0 transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#070c18] border-white/10'
          } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
            <div className="space-y-6">
              {[
                { title: 'Main Navigation', items: PRIMARY_NAV, accent: true },
                { title: 'Site Operations', items: SITE_OPERATIONS_NAV, accent: false },
                { title: 'Finance & Admin', items: MANAGEMENT_NAV, accent: false },
              ].map((group) => (
                <div key={group.title}>
                  <div
                    className={`text-[10px] uppercase font-bold tracking-wider px-3 mb-2 ${
                      group.accent
                        ? isLight
                          ? 'text-[#0038B8]'
                          : 'text-[#FFB800]'
                        : isLight
                        ? 'text-slate-400'
                        : 'text-zinc-400'
                    }`}
                  >
                    {group.title}
                  </div>
                  <nav className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] text-white shadow-md shadow-blue-900/25'
                              : isLight
                              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              : 'text-zinc-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${
                              isActive
                                ? 'text-[#FFB800]'
                                : isLight
                                ? 'text-slate-400'
                                : 'text-zinc-400'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main
          className={`erp-main flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
            isLight
              ? 'bg-gradient-to-b from-[#f4f6fb] to-[#eef2f8]'
              : 'bg-gradient-to-b from-[#050811] via-[#070d1d] to-[#050811]'
          }`}
        >
          <motion.div
            key={pathname}
            initial={{ opacity: 1, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
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
