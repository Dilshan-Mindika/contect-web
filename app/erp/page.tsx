"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/erp/AuthContext';
import {
  DollarSign,
  TrendingUp,
  HardHat,
  Boxes,
  Users,
  ShieldAlert,
  ArrowUpRight,
  Plus,
  ArrowRight,
  Activity,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function ERPDashboardPage() {
  const {
    user,
    invoices,
    projects,
    leads,
    inventory,
    employees,
    auditLogs,
    addInvoice,
    addLead,
  } = useERP();

  // Quick Action Modal States
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  // New Invoice form state
  const [invClient, setInvClient] = useState('');
  const [invProject, setInvProject] = useState('');
  const [invAmount, setInvAmount] = useState(750000);

  // New Lead form state
  const [leadCompany, setLeadCompany] = useState('');
  const [leadProject, setLeadProject] = useState('');
  const [leadValue, setLeadValue] = useState(12000000);

  // Compute live aggregates
  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, inv) => acc + inv.total, 0);
  const totalPending = invoices
    .filter((inv) => inv.status !== 'PAID')
    .reduce((acc, inv) => acc + inv.total, 0);

  const totalProjectBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalProjectSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const pipelineValuation = leads.reduce((acc, l) => acc + l.estimatedValue, 0);

  const lowStockCount = inventory.filter(
    (item) => item.status === 'LOW_STOCK' || item.status === 'CRITICAL'
  ).length;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClient || !invProject) return;
    const tax = Math.round(invAmount * 0.05);
    addInvoice({
      clientName: invClient,
      projectName: invProject,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: [{ description: 'Engineering & Construction Phase Progress', quantity: 1, rate: invAmount, amount: invAmount }],
      subtotal: invAmount,
      tax,
      total: invAmount + tax,
      status: 'PENDING',
    });
    setInvClient('');
    setInvProject('');
    setShowInvoiceModal(false);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadCompany || !leadProject) return;
    addLead({
      clientName: leadCompany,
      company: leadCompany,
      projectType: leadProject,
      estimatedValue: Number(leadValue),
      stage: 'NEW',
      probability: 30,
      contactEmail: 'contact@' + leadCompany.toLowerCase().replace(/[^a-z]/g, '') + '.com',
      phone: '+1 (555) 019-8800',
      assignedTo: user?.name || 'Julian Voss',
      notes: 'Initial enterprise inquiry submitted via executive dashboard launcher.',
    });
    setLeadCompany('');
    setLeadProject('');
    setShowLeadModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Welcome & Live Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Enterprise Operations Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Role: <span className="text-blue-300 font-semibold">{user?.title}</span> • Department: {user?.department}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Issue Invoice</span>
          </button>

          <button
            onClick={() => setShowLeadModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] border border-blue-400/40 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-blue-900/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Add Deal Pipeline</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="p-5 rounded-2xl bg-[#080e1c]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Invoiced</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">
              ${(totalInvoiced / 1000000).toFixed(2)}M
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs last quarter</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Collected: ${(totalPaid / 1000000).toFixed(2)}M</span>
            <span className="text-amber-400">Pending: ${(totalPending / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        {/* Card 2: Active Projects Budget */}
        <div className="p-5 rounded-2xl bg-[#080e1c]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-[#FFB800]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Projects Committed</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#FFB800]">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">
              ${(totalProjectBudget / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-300">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>{projects.length} Active Mega-Sites</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Disbursed: ${(totalProjectSpent / 1000000).toFixed(1)}M</span>
            <span className="text-emerald-400">
              {Math.round((totalProjectSpent / totalProjectBudget) * 100)}% Burn Rate
            </span>
          </div>
        </div>

        {/* Card 3: Commercial CRM Pipeline */}
        <div className="p-5 rounded-2xl bg-[#080e1c]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Sales Deal Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">
              ${(pipelineValuation / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{leads.length} Prospective Bids</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span>High Probability: 85%</span>
            <span className="text-blue-300">Target Q4</span>
          </div>
        </div>

        {/* Card 4: Supply Chain & Workforce */}
        <div className="p-5 rounded-2xl bg-[#080e1c]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Supply & Staffing</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">
              {employees.length * 23} Engineers
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-300">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Across 5 International Hubs</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Inventory SKUs: {inventory.length}</span>
            <span className={lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}>
              {lowStockCount} Stock Alerts
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Project Health Matrix & Financial Outflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Construction Mega-Sites */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#080e1c]/85 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HardHat className="w-4 h-4 text-[#FFB800]" />
                <span>Flagship Construction Site Operations</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time phase completion and site structural telemetry
              </p>
            </div>
            <Link
              href="/erp/projects"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              <span>View All Sites</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{project.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {project.phase}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Client: {project.client} • Location: {project.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#FFB800]">
                      {project.progress}%
                    </span>
                    <div className="text-[11px] text-zinc-400">
                      ${(project.spent / 1000000).toFixed(1)}M / ${(project.budget / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0038B8] via-[#1D4ED8] to-[#FFB800] rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                  <span>Site Lead: {project.siteEngineer}</span>
                  <span>Target: {project.targetCompletion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Security & Compliance Audit Stream */}
        <div className="p-6 rounded-2xl bg-[#080e1c]/85 border border-white/10 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FFB800]" />
                <span>Live Audit Trail</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Encrypted
              </span>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white">{log.action}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        log.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">
                    {log.details}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                    <span>{log.actorName}</span>
                    <span>{log.timestamp.split(' ')[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/erp/audit"
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs font-semibold text-zinc-200 transition-colors flex items-center justify-center gap-1.5 mt-4"
          >
            <span>Full Cryptographic Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Modal: Issue Invoice */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091124] border border-white/15 rounded-2xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FFB800]" />
                <span>Issue Commercial Invoice</span>
              </h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Client Entity</label>
                <input
                  type="text"
                  required
                  value={invClient}
                  onChange={(e) => setInvClient(e.target.value)}
                  placeholder="e.g. Meridian Prime Real Estate"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Assignment</label>
                <input
                  type="text"
                  required
                  value={invProject}
                  onChange={(e) => setInvProject(e.target.value)}
                  placeholder="e.g. The Lumina Waterfront Residences"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Subtotal Amount ($ USD)</label>
                <input
                  type="number"
                  required
                  value={invAmount}
                  onChange={(e) => setInvAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Applicable 5% VAT: ${(invAmount * 0.05).toLocaleString()} • Total: ${(invAmount * 1.05).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-blue-900/40"
                >
                  Authorize & Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Deal Pipeline */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091124] border border-white/15 rounded-2xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FFB800]" />
                <span>Register Prospective Commercial Deal</span>
              </h3>
              <button
                onClick={() => setShowLeadModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Developer / Client Group</label>
                <input
                  type="text"
                  required
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  placeholder="e.g. Pacific Trans-Urban Consortium"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Scope & Typology</label>
                <input
                  type="text"
                  required
                  value={leadProject}
                  onChange={(e) => setLeadProject(e.target.value)}
                  placeholder="e.g. Geothermal High-Rise Tower"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Estimated Contract Value ($ USD)</label>
                <input
                  type="number"
                  required
                  value={leadValue}
                  onChange={(e) => setLeadValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-blue-900/40"
                >
                  Enter into Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

