"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useERP } from '@/lib/erp/AuthContext';
import { ENTERPRISE_USERS } from '@/lib/erp/auth';
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
  ExternalLink,
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
  const { user, isLoading, logout, switchPersona, activeCompany, setActiveCompany, companies } = useERP();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);

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
      <header className="sticky top-0 z-40 h-16 bg-[#080e1c]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Official CONTEC Navbar Logo matching main site */}
          <Link href="/erp" className="flex items-center gap-3 group">
            <div className="relative h-10 w-44 sm:w-52 transition-transform duration-300 group-hover:scale-105 flex items-center">
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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Company / Division Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setCompanyMenuOpen(!companyMenuOpen);
                setPersonaMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-200 transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-[#FFB800]" />
              <div className="text-left hidden sm:block">
                <div className="text-[9px] uppercase text-zinc-400 font-medium">Division</div>
                <div className="font-semibold text-white text-xs truncate max-w-[140px] md:max-w-[180px]">
                  {activeCompany === 'CONSOLIDATED'
                    ? 'All Divisions'
                    : currentCompProfile?.tradeName || activeCompany}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {companyMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#080f24] border border-white/15 shadow-2xl p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <span className="text-xs font-bold text-white block">Operating Division</span>
                  <p className="text-[11px] text-zinc-400">Select branch or view all company operations</p>
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
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-all ${
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
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all mt-1 ${
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

          {/* User Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setPersonaMenuOpen(!personaMenuOpen);
                setCompanyMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-200 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left hidden sm:block">
                <div className="text-[9px] uppercase text-zinc-400 font-medium">Logged In As</div>
                <div className="font-semibold text-white text-xs truncate max-w-[120px]">
                  {user?.name || 'Staff User'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {personaMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#091124] border border-white/15 shadow-2xl p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <span className="text-xs font-bold text-white block">Switch Staff Account</span>
                  <p className="text-[11px] text-zinc-400">View dashboard from different department roles</p>
                </div>
                <div className="space-y-1">
                  {Object.values(ENTERPRISE_USERS).map((persona) => {
                    const isCurrent = user?.email === persona.email;
                    return (
                      <button
                        key={persona.email}
                        onClick={async () => {
                          setPersonaMenuOpen(false);
                          await switchPersona(persona.email);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isCurrent
                            ? 'bg-[#0038B8]/40 border border-[#0038B8] text-white font-bold'
                            : 'hover:bg-white/5 text-zinc-300'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-white">{persona.name}</div>
                          <div className="text-[10px] text-zinc-400">{persona.title}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* View Public Website */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
            title="Open Public Website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
            <span className="hidden sm:inline">Public Website</span>
          </Link>

          {/* Logout */}
          <button
            onClick={async () => {
              await logout();
              router.push('/erp/login');
            }}
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#070c18] border-r border-white/10 pt-16 lg:pt-0 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
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

            {/* Sidebar Footer */}
            <div className="pt-4 border-t border-white/10 text-xs text-zinc-400 space-y-1">
              <div className="flex items-center gap-2 font-medium text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>CONTEC Kandy Operations</span>
              </div>
              <p className="text-[11px] text-zinc-500">Design, Engineering &amp; Build</p>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#050811] via-[#070d1d] to-[#050811] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
