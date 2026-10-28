"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useERP } from '@/lib/erp/AuthContext';
import { ENTERPRISE_USERS } from '@/lib/erp/auth';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';

export default function ERPLoginPage() {
  const router = useRouter();
  const { login } = useERP();
  const [email, setEmail] = useState('admin@contec.com');
  const [password, setPassword] = useState('ContecSuper2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/erp');
    } else {
      setError(result.error || 'Authentication rejected by security policy.');
    }
  };

  const handleQuickSelect = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-[#f4f4f7] flex flex-col justify-between selection:bg-[#0038B8] selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#0038B8]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-36">
            <Image
              src="/branding/logo nav.png"
              alt="CONTEC Design & Build"
              fill
              className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              priority
            />
          </div>
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>Return to Public Site</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left: Security Briefing */}
        <div className="flex-1 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs font-mono text-blue-300">
            <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
            <span>Zero-Trust Enterprise Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            CONTEC <span className="text-gradient-gold">ERP Suite</span> & Management
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Centralized enterprise operations connecting multi-million dollar structural projects, real-time financial ledgers, automated procurement, and cryptographic JWT access control.
          </p>

          {/* Security Features Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">0 Vulnerabilities</div>
                <div className="text-[11px] text-zinc-400">Next.js 16.4.3 & ESLint 10 audited</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">Cryptographic JWT</div>
                <div className="text-[11px] text-zinc-400">HMAC-SHA256 HttpOnly tokens</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">End-to-End BMS</div>
                <div className="text-[11px] text-zinc-400">Finance, CRM, Ops, Supply, HRMS</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">Strict RBAC</div>
                <div className="text-[11px] text-zinc-400">Granular role-based permissions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Authentication Form & Demo Selector */}
        <div className="w-full max-w-md bg-[#080e1c]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Enterprise Sign In</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Authenticate with your enterprise credentials or click a pre-configured persona below.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Corporate Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition-all"
                placeholder="name@contec.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Cryptographic Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition-all"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-bold text-sm shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying JWT...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#FFB800]" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Personas */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                1-Click Role Testing
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-left">
              {Object.values(ENTERPRISE_USERS).map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => handleQuickSelect(p.email, p.passwordHash)}
                  className={`p-2 rounded-lg text-left text-xs transition-colors border ${
                    email === p.email
                      ? 'bg-[#0038B8]/30 border-[#0038B8] text-white'
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-300'
                  }`}
                >
                  <div className="font-semibold text-white truncate text-[11px]">{p.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{p.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-zinc-400 border-t border-white/10">
        CONTEC Design & Build • Enterprise ERP Management Suite • Zero Vulnerabilities Certified
      </footer>
    </div>
  );
}

