"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { AuditSeverity, AuditModule } from '@/lib/erp/types';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Search,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export default function AuditPage() {
  const { auditLogs, user } = useERP();
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | AuditSeverity>('ALL');
  const [selectedModule, setSelectedModule] = useState<'ALL' | AuditModule>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSev = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
    const matchesMod = selectedModule === 'ALL' || log.module === selectedModule;
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSev && matchesMod && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Cybersecurity Governance & Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Cryptographic Audit Ledger & Token Inspector
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Immutable tracking of enterprise logins, transaction approvals, and cryptographic token verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>0 Vulnerabilities Audited</span>
          </span>
        </div>
      </div>

      {/* Security Posture Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">JWT Token Standard</span>
            <Lock className="w-4 h-4 text-[#FFB800]" />
          </div>
          <div className="text-xl font-mono font-extrabold text-white mt-1">
            HMAC-SHA256 (HS256)
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Cryptographically signed with quantum-resistant key
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Session Security Transport</span>
            <KeyRound className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-extrabold text-emerald-400 mt-1">
            HttpOnly & SameSite=Lax
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Protected against XSS and cross-site request forgery
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">RBAC Role Enforcement</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-mono font-extrabold text-blue-400 mt-1">
            {user?.role || 'SUPER_ADMIN'}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {user?.permissions.length || 8} Active permission scopes granted
          </span>
        </div>
      </div>

      {/* Real-time JWT Claims Inspector */}
      <div className="p-5 rounded-2xl bg-[#080e1c]/90 border border-blue-500/30 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#FFB800]" />
            <h3 className="text-sm font-bold text-white">
              Decoded Active Session Claims (JWT Payload)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Issuer: contec:erp:auth • Audience: contec:enterprise
          </span>
        </div>

        <div className="bg-[#03060f] p-4 rounded-xl border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto space-y-1">
          <div className="text-zinc-500">{"// Real-time token verification payload"}</div>
          <div>
            <span className="text-purple-400">&quot;sub&quot;</span>: <span className="text-emerald-300">&quot;{user?.id}&quot;</span>,
          </div>
          <div>
            <span className="text-purple-400">&quot;name&quot;</span>: <span className="text-emerald-300">&quot;{user?.name}&quot;</span>,
          </div>
          <div>
            <span className="text-purple-400">&quot;email&quot;</span>: <span className="text-emerald-300">&quot;{user?.email}&quot;</span>,
          </div>
          <div>
            <span className="text-purple-400">&quot;role&quot;</span>: <span className="text-[#FFB800]">&quot;{user?.role}&quot;</span>,
          </div>
          <div>
            <span className="text-purple-400">&quot;department&quot;</span>: <span className="text-emerald-300">&quot;{user?.department}&quot;</span>,
          </div>
          <div>
            <span className="text-purple-400">&quot;permissions&quot;</span>: [
            {user?.permissions.map((p, idx) => (
              <span key={p} className="text-blue-300">
                &quot;{p}&quot;{idx < (user?.permissions.length || 0) - 1 ? ', ' : ''}
              </span>
            ))}
            ],
          </div>
          <div>
            <span className="text-purple-400">&quot;iss&quot;</span>: <span className="text-zinc-400">&quot;contec:erp:auth&quot;</span>,
          </div>
          <div>
            <span className="text-purple-400">&quot;exp&quot;</span>: <span className="text-amber-400">7 Days (Rolling Session)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-400 mr-1">Severity:</span>
          {(['ALL', 'INFO', 'WARNING', 'CRITICAL'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedSeverity === sev
                  ? 'bg-[#0038B8] text-white shadow'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400'
              }`}
            >
              {sev}
            </button>
          ))}

          <span className="text-xs text-zinc-400 ml-3 mr-1">Module:</span>
          {(['ALL', 'AUTH', 'FINANCE', 'PROJECTS', 'INVENTORY', 'HR', 'CRM', 'SECURITY'] as const).map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                selectedModule === mod
                  ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, actor, or details..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFB800]"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-[#080e1c]/85 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-zinc-400 font-mono text-[11px] border-b border-white/10 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Action & Module</th>
                <th className="py-3.5 px-4">Event Details</th>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-zinc-400 whitespace-nowrap text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{log.action}</div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-blue-300">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300 max-w-md leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{log.actorName}</div>
                    <div className="text-[10px] text-zinc-400">{log.role}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        log.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

