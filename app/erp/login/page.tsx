"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useERP } from '@/lib/erp/AuthContext';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Building2,
  Eye,
  EyeOff,
  Briefcase,
  Users,
} from 'lucide-react';

export default function ERPLoginPage() {
  const router = useRouter();
  const { login } = useERP();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/erp');
    } else {
      setError(result.error || 'Invalid email address or password. Please try again.');
    }
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
          <div className="relative h-10 w-44">
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
        <Link
          href="/"
          className="text-xs font-semibold text-zinc-400 hover:text-[#FFB800] transition-colors flex items-center gap-1.5"
        >
          <span>Back to Main Website</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left: Friendly Team Overview */}
        <div className="flex-1 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs text-blue-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
            <span>CONTEC Staff Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Team Workspace &amp; <span className="text-gradient-gold">Project Management</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Welcome to the internal CONTEC management portal. Sign in to oversee active construction sites, client inquiries, bill of quantities, material inventory, and project schedules.
          </p>

          {/* Friendly Capabilities Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">Live Site Operations</div>
                <div className="text-[11px] text-zinc-400">Track progress, inspections &amp; daily logs</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
              <Briefcase className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">Estimates &amp; Invoices</div>
                <div className="text-[11px] text-zinc-400">Manage BOQs, supplier bills &amp; payments</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
              <Users className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">Client Inquiries</div>
                <div className="text-[11px] text-zinc-400">Review requests &amp; consultation bookings</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">Authorized Access Only</div>
                <div className="text-[11px] text-zinc-400">Secure sign-in for CONTEC staff members</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Authentication Form */}
        <div className="w-full max-w-md bg-[#080e1c]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Staff Sign In</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Please enter your registered email and password to access the portal.
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
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition-all"
                placeholder="e.g. name@contec.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-zinc-300" />
                  ) : (
                    <Eye className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-bold text-sm shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#FFB800]" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Help & Support note */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Need account assistance or password reset? Please contact the office administrator at Kandy Main Office or call{" "}
              <a href="tel:+94777812141" className="text-[#FFB800] hover:underline font-semibold">
                +94 77 781 2141
              </a>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-zinc-400 border-t border-white/10">
        © {new Date().getFullYear()} CONTEC Design &amp; Build (Kandy) • Internal Team &amp; Staff Management Portal
      </footer>
    </div>
  );
}
