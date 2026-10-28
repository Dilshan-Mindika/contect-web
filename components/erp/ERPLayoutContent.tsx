"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useERP } from '@/lib/erp/AuthContext';
import { ENTERPRISE_USERS } from '@/lib/erp/auth';
import {
  LayoutDashboard,
  TrendingUp,
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
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Executive Command', href: '/erp', icon: LayoutDashboard, badge: 'Live' },
  { label: 'CRM & Contracts', href: '/erp/crm', icon: TrendingUp, badge: '5 Deals' },
  { label: 'Finance & Invoicing', href: '/erp/finance', icon: CreditCard, badge: '$48.6M' },
  { label: 'Project Operations', href: '/erp/projects', icon: HardHat, badge: '4 Sites' },
  { label: 'Supply Chain & Stock', href: '/erp/inventory', icon: Boxes, badge: 'Alerts' },
  { label: 'HR & Workforce', href: '/erp/hr', icon: Users, badge: '184 Staff' },
  { label: 'Security & Audit', href: '/erp/audit', icon: ShieldCheck, badge: 'Quantum' },
];

export default function ERPLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout, switchPersona } = useERP();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);

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
          <div className="w-12 h-12 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 font-mono text-sm tracking-wider">Verifying Enterprise Cryptographic Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050811] text-[#f4f4f7] flex flex-col antialiased">
      {/* Top Enterprise Bar */}
      <header className="sticky top-0 z-40 h-16 bg-[#080e1c]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/erp" className="flex items-center gap-3 group">
            <div className="relative h-8 w-28 sm:w-36">
              <Image
                src="/branding/logo nav.png"
                alt="CONTEC Enterprise"
                fill
                className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                priority
              />
            </div>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/40">
              ERP Suite v4.2
            </span>
          </Link>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-zinc-200 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden md:inline text-zinc-400">Persona:</span>
              <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                {user?.name || 'Switch Role'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {personaMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#091124] border border-white/15 shadow-2xl p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">Fast Role Switcher</span>
                    <Sparkles className="w-3 h-3 text-[#FFB800]" />
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Test RBAC permissions instantly</p>
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
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-white/10 text-[#FFB800]">
                          {persona.role.split('_')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User badge */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="text-right">
              <div className="text-xs font-semibold text-white">{user?.name}</div>
              <div className="text-[10px] font-mono text-[#FFB800]">{user?.role}</div>
            </div>
          </div>

          {/* Return to Public Portal */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            title="Return to Main Website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Public Site</span>
          </Link>

          {/* Logout */}
          <button
            onClick={async () => {
              await logout();
              router.push('/erp/login');
            }}
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Secure Logout"
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
              {/* Security Pill */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-950/40 to-[#040813] border border-blue-500/20">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                  <Lock className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Encrypted JWT HS256</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Strict RBAC policies active. Zero vulnerabilities detected.
                </p>
              </div>

              {/* Navigation Links */}
              <div>
                <div className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider px-3 mb-2">
                  Enterprise Modules
                </div>
                <nav className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] text-white shadow-lg shadow-blue-900/40 border border-blue-400/30'
                            : 'text-zinc-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFB800]' : 'text-zinc-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              isActive
                                ? 'bg-black/30 text-white'
                                : 'bg-white/5 text-zinc-400 border border-white/5'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Sidebar Footer System Health */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Nodes Operational</span>
                </span>
                <span className="font-mono text-[10px] text-zinc-400">99.98% SLA</span>
              </div>
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

