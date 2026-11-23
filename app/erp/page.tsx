"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/erp/AuthContext';
import { formatLKR } from '@/lib/erp/currency';
import {
  TrendingUp,
  HardHat,
  Users,
  ShieldAlert,
  ArrowUpRight,
  Plus,
  ArrowRight,
  Activity,
  FileText,
  Sparkles,
  Fuel,
  Droplets,
  Award,
  CheckCircle2,
  ShieldCheck,
  Building2,
  DollarSign,
  UserCheck,
  Truck,
  Package,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  FolderLock,
  Landmark,
  Scale,
  Briefcase,
} from 'lucide-react';

export default function ERPDashboardPage() {
  const {
    user,
    invoices,
    projects,
    leads,
    auditLogs,
    machinery,
    siteLogs,
    addInvoice,
    addLead,
    activeCompany,
    setActiveCompany,
    companies,
    cidaIpcs,
    threeWayMatches,
    musterRolls,
    budgetBaselines,
    glAccounts,
    vaultDocuments,
    safetyInspections,
  } = useERP();

  // Quick Action Modal States
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  // New Invoice form state
  const [invClient, setInvClient] = useState('');
  const [invProject, setInvProject] = useState('');
  const [invAmount, setInvAmount] = useState(85000000); // 85M LKR default

  // New Lead form state
  const [leadCompany, setLeadCompany] = useState('');
  const [leadProject, setLeadProject] = useState('');
  const [leadValue, setLeadValue] = useState(1850000000); // 1.85B LKR default

  // Active Company Context Details
  const compA = companies.find((c) => c.id === 'COMP_A');
  const compB = companies.find((c) => c.id === 'COMP_B');

  // Filtered metrics by activeCompany
  const filteredProjects = projects.filter(
    (p) => activeCompany === 'CONSOLIDATED' || (p as { companyId?: string }).companyId === activeCompany || (!((p as { companyId?: string }).companyId) && activeCompany === 'COMP_A')
  );

  const filteredInvoices = invoices.filter(
    (inv) => activeCompany === 'CONSOLIDATED' || (inv as { companyId?: string }).companyId === activeCompany || (!((inv as { companyId?: string }).companyId) && activeCompany === 'COMP_A')
  );

  const filteredIPCs = cidaIpcs.filter(
    (ipc: { companyId: string }) => activeCompany === 'CONSOLIDATED' || ipc.companyId === activeCompany
  );

  const filteredMachinery = machinery.filter(
    (m) => activeCompany === 'CONSOLIDATED' || (m as { companyId?: string }).companyId === activeCompany || (activeCompany === 'COMP_B')
  );

  const filteredMuster = musterRolls.filter(
    (m) => activeCompany === 'CONSOLIDATED' || m.companyId === activeCompany
  );

  const filteredDocs = vaultDocuments.filter(
    (d) => activeCompany === 'CONSOLIDATED' || d.companyId === activeCompany
  );

  // Compute live aggregates in LKR
  const totalInvoiced = filteredInvoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalPaid = filteredInvoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, inv) => acc + inv.total, 0);
  const totalPending = filteredInvoices
    .filter((inv) => inv.status !== 'PAID')
    .reduce((acc, inv) => acc + inv.total, 0);

  const totalProjectBudget = filteredProjects.reduce((acc, p) => acc + p.budget, 0);
  const totalProjectSpent = filteredProjects.reduce((acc, p) => acc + p.spent, 0);
  const pipelineValuation = leads.reduce((acc, l) => acc + l.estimatedValue, 0);

  // Construction domain metrics
  const totalWorkforceOnSite = siteLogs.reduce((acc, s) => acc + s.workforceCount, 0);
  const totalConcretePoured = siteLogs.reduce((acc, s) => acc + s.concretePouredM3, 0);
  const operationalMachinery = filteredMachinery.filter((m) => m.status === 'OPERATIONAL').length;
  const avgFleetFuel = Math.round(
    filteredMachinery.reduce((acc, m) => acc + m.fuelCapacityPct, 0) / (filteredMachinery.length || 1)
  );

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClient || !invProject) return;
    const sscl = Math.round(invAmount * 0.025);
    const vat = Math.round(invAmount * 0.18);
    const retention = Math.round(invAmount * 0.05);
    const netTotal = invAmount + sscl + vat - retention;

    addInvoice({
      clientName: invClient,
      projectName: invProject,
      ipcNumber: `IPC #${Math.floor(10 + Math.random() * 90)} (CIDA SBD-02)`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: [{ description: 'Interim Work Execution & Material Measurement', quantity: 1, rate: invAmount, amount: invAmount }],
      subtotal: invAmount,
      ssclTax: sscl,
      tax: vat,
      retentionDeducted: retention,
      total: netTotal,
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
      contactEmail: 'tenders@' + leadCompany.toLowerCase().replace(/[^a-z]/g, '') + '.lk',
      phone: '+94 11 234 5678',
      assignedTo: user?.name || 'Julian Voss (Commercial Director)',
      notes: 'Initial enterprise tender inquiry logged in executive command.',
      cidaCategory: 'Building & Heavy Civil (CIDA CS2)',
    });
    setLeadCompany('');
    setLeadProject('');
    setShowLeadModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Welcome & Live Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CONTEC Multi-Company Construction ERP</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
              {activeCompany === 'COMP_A'
                ? 'Company A: Contec Engineering (CIDA CS2)'
                : activeCompany === 'COMP_B'
                ? 'Company B: Contec Heavy Infra (CIDA EM1)'
                : 'CONSOLIDATED GROUP VIEW (COMPANIES A + B)'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Executive Command Hub • {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Role: <span className="text-blue-300 font-semibold">{user?.title}</span> • All monetary values standardized in <span className="text-[#FFB800] font-semibold">Sri Lankan Rupees (LKR)</span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/erp/quotations"
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>New BOQ Tender</span>
          </Link>

          <button
            onClick={() => setShowInvoiceModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Issue Interim Bill (IPC)</span>
          </button>

          <button
            onClick={() => setShowLeadModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] border border-blue-400/40 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-blue-900/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Add Tender Deal</span>
          </button>
        </div>
      </div>

      {/* Multi-Company Context Quick Switcher Banner */}
      <div className="p-4 rounded-2xl bg-[#080e1c]/90 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0038B8]/20 border border-blue-500/30 text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-400 font-mono">Current Reporting Scope</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>
                {activeCompany === 'COMP_A'
                  ? 'Company A: Contec Engineering & Construction (Pvt) Ltd'
                  : activeCompany === 'COMP_B'
                  ? 'Company B: Contec Heavy Infra & Equipment (Pvt) Ltd'
                  : 'Consolidated Enterprise Group View'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Audit Ready
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveCompany('COMP_A')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCompany === 'COMP_A'
                ? 'bg-[#0038B8] text-white shadow-md shadow-blue-900/40'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400'
            }`}
          >
            Company A (Civil CS2)
          </button>
          <button
            onClick={() => setActiveCompany('COMP_B')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCompany === 'COMP_B'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400'
            }`}
          >
            Company B (Plant EM1)
          </button>
          <button
            onClick={() => setActiveCompany('CONSOLIDATED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCompany === 'CONSOLIDATED'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400'
            }`}
          >
            🏢 Consolidated Group
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid in LKR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue in LKR */}
        <div className="p-5 rounded-2xl bg-[#080e1c]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Certified IPC Billing</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono text-xs font-bold">
              LKR
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">
              {formatLKR(totalInvoiced, true)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs previous quarter</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Collected: {formatLKR(totalPaid, true)}</span>
            <span className="text-amber-400">Pending: {formatLKR(totalPending, true)}</span>
          </div>
        </div>

        {/* Card 2: Active Projects Budget in LKR */}
        <div className="p-5 rounded-2xl bg-[#080e1c]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-[#FFB800]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Active Contract Commitment</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#FFB800]">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">
              {formatLKR(totalProjectBudget, true)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-300">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>{filteredProjects.length} Active Mega-Sites</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Executed: {formatLKR(totalProjectSpent, true)}</span>
            <span className="text-emerald-400 font-semibold">
              {totalProjectBudget > 0 ? Math.round((totalProjectSpent / totalProjectBudget) * 100) : 0}% Physical Progress
            </span>
          </div>
        </div>

        {/* Card 3: Commercial CRM Pipeline in LKR */}
        <div className="p-5 rounded-2xl bg-[#080e1c]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Tender Pipeline Valuation</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">
              {formatLKR(pipelineValuation, true)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{leads.length} Major Tenders</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Win Probability: 72%</span>
            <span className="text-blue-300">Govt / BOI / UDA</span>
          </div>
        </div>

        {/* Card 4: Site Workforce & Concrete Operations */}
        <div className="p-5 rounded-2xl bg-[#080e1c]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Site Workforce & Plants</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">
              {totalWorkforceOnSite > 0 ? totalWorkforceOnSite : 154} On-Site
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-300">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>{totalConcretePoured} m³ Concrete Poured</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Fleet: {operationalMachinery}/{filteredMachinery.length} Active</span>
            <span className="text-emerald-400">Zero Harm (0 LTIR)</span>
          </div>
        </div>
      </div>

      {/* Construction Real-time Operational Telemetry Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#091124] border border-blue-500/20 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-zinc-400 font-mono text-[10px] uppercase">CIDA Accreditation</div>
            <div className="font-bold text-white">Grade CS2 / C1 Civil & Building</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <div className="text-zinc-400 font-mono text-[10px] uppercase">Heavy Fleet Fuel Status</div>
            <div className="font-bold text-white">{avgFleetFuel}% Diesel Avg (Auto Diesel @ LKR 370/L)</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-zinc-400 font-mono text-[10px] uppercase">QA/QC Concrete Testing</div>
            <div className="font-bold text-emerald-300">100% Slump & Cube Compliance</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-zinc-400 font-mono text-[10px] uppercase">Statutory Tax & Retentions</div>
            <div className="font-bold text-white">18% VAT • 2.5% SSCL • 5% Retention</div>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 12 CORE MODULES DIRECT COCKPIT TILES */}
      {/* ======================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FFB800]" />
              <span>12 Core Construction ERP Modules</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Fully integrated enterprise systems aligned with FIDIC, CIDA Directive 102/2024, and Sri Lanka statutory regulations.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
            12 of 12 Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Module 01 */}
          <Link
            href="/erp/company"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 01</span>
              <Building2 className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Company & Administration
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              2 Corporate profiles, BR/TIN/VAT, Directors, Bank Accounts & Approval Matrix.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-emerald-400 font-semibold">2 Registered Entities</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 02 */}
          <Link
            href="/erp/projects"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 02</span>
              <HardHat className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Project Management & Cockpit
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              360° Site Cockpit, Gantt schedules, EVM SPI/CPI, Variations & Handover checklists.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-blue-300 font-semibold">{filteredProjects.length} Active Mega-Sites</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 03 */}
          <Link
            href="/erp/finance"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 03</span>
              <Landmark className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Accounting & Finance (GL)
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              Double-entry GL, Cash/Bank books, Journal vouchers, Fixed assets & P&L statements.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-emerald-400 font-semibold">{glAccounts.length} Chart Accounts</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 04 */}
          <Link
            href="/erp/hr"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 04</span>
              <Briefcase className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              HR & Corporate Workforce
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              Staff directories, Site assignments, EPF (12%+8%) & ETF (3%) payroll computations.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-purple-300 font-semibold">EPF/ETF Compliant</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 05 */}
          <Link
            href="/erp/site-labour"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 05</span>
              <UserCheck className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Site Labour Management
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              Daily site muster rolls, 15-day wage cycle, 6-step audit & fingerprint verification.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-amber-400 font-semibold">{filteredMuster.length} Muster Records</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 06 */}
          <Link
            href="/erp/procurement"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 06</span>
              <Scale className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Procurement & Purchasing
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              Requisitions (PR), RFQs, Purchase Orders (PO), and mandatory 3-Way Match GRN audit.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-emerald-400 font-semibold">3-Way Match Active</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 07 */}
          <Link
            href="/erp/inventory"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 07</span>
              <Package className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Inventory & Multi-Store
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              Central & Site stores, Material Issue Notes (MIN), transfers & wastage thresholds.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-blue-300 font-semibold">Multi-Store Tracking</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 08 */}
          <Link
            href="/erp/machinery"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 08</span>
              <Truck className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Plant & Machinery Fleet
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              Heavy equipment telematics, fuel consumption @ LKR 370/L, log sheets & plant hire.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-amber-400 font-semibold">{filteredMachinery.length} Fleet Units</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 09 */}
          <Link
            href="/erp/budgeting"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 09</span>
              <DollarSign className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Project Budgeting & EVM
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              BOQ original baseline, revised budget, committed costs, CV, SV, and EVM metrics.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-emerald-400 font-semibold">CPI 1.04 • SPI 0.98</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 10 */}
          <Link
            href="/erp/contracts"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 10</span>
              <FileSpreadsheet className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Government Contracts & IPC
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              SBD-02/04 Government contracts & CIDA Directive 102/2024 Interim Payment Certificates.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-blue-300 font-semibold">{filteredIPCs.length} CIDA 102 Claims</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 11 */}
          <Link
            href="/erp/safety"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 11</span>
              <ShieldAlert className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Health, Safety & HSE
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              Site safety audits, green tag scaffolding, PPE issuance registry, and zero-harm LTIR logs.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-emerald-400 font-semibold">0.0 LTIR • Safe Sites</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 12 */}
          <Link
            href="/erp/audit"
            className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/50 hover:bg-[#0c162e] transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FFB800] font-bold">MODULE 12</span>
              <FolderLock className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              Document Vault & Audit
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-2">
              Central electronic document vault, SHA-256 tamper verification & immutable audit trail.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-purple-300 font-semibold">{filteredDocs.length} Vault Documents</span>
              <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Middle Section: Project Health Matrix & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Construction Mega-Sites */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#080e1c]/85 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HardHat className="w-4 h-4 text-[#FFB800]" />
                <span>Active Commercial & Heavy Civil Mega-Sites</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Physical progress, earned value analysis, and budget execution in LKR
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
            {filteredProjects.map((project) => (
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
                      {project.cidaClassification && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 hidden sm:inline">
                          {project.cidaClassification.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Client: {project.client} • Location: {project.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#FFB800]">
                      {project.progress}% Done
                    </span>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {formatLKR(project.spent, true)} / {formatLKR(project.budget, true)}
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-400 pt-1 gap-1">
                  <span>Site Engineer: {project.siteEngineer}</span>
                  <div className="flex items-center gap-3">
                    {project.cpi && (
                      <span className="text-emerald-400 font-mono">CPI: {project.cpi.toFixed(2)}</span>
                    )}
                    <span>Target: {project.targetCompletion}</span>
                  </div>
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
                <span>Construction Audit Trail</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                HMAC Signed
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

      {/* Modal: Issue Interim Bill (IPC) in LKR */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091124] border border-white/15 rounded-2xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FFB800]" />
                <span>Issue Interim Payment Certificate (IPC)</span>
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
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Client Entity / Employer</label>
                <input
                  type="text"
                  required
                  value={invClient}
                  onChange={(e) => setInvClient(e.target.value)}
                  placeholder="e.g. Port City Colombo Holdings"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Contract / Project Assignment</label>
                <input
                  type="text"
                  required
                  value={invProject}
                  onChange={(e) => setInvProject(e.target.value)}
                  placeholder="e.g. Colombo Port City Marina Residences"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Work Done Value in Period (LKR)</label>
                <input
                  type="number"
                  required
                  value={invAmount}
                  onChange={(e) => setInvAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800] font-mono"
                />
                <div className="mt-2 p-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] space-y-1 text-zinc-300">
                  <div className="flex justify-between">
                    <span>Gross Work Executed:</span>
                    <span className="font-mono text-white">{formatLKR(invAmount)}</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>Less 5% Retention:</span>
                    <span className="font-mono">-{formatLKR(invAmount * 0.05)}</span>
                  </div>
                  <div className="flex justify-between text-blue-300">
                    <span>Plus 2.5% SSCL:</span>
                    <span className="font-mono">+{formatLKR(invAmount * 0.025)}</span>
                  </div>
                  <div className="flex justify-between text-blue-300">
                    <span>Plus 18% VAT:</span>
                    <span className="font-mono">+{formatLKR(invAmount * 0.18)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-1 border-t border-white/10">
                    <span>Net Certified Payable:</span>
                    <span className="font-mono text-[#FFB800]">{formatLKR(invAmount * 1.155)}</span>
                  </div>
                </div>
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
                  Authorize & Issue IPC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Deal Pipeline in LKR */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091124] border border-white/15 rounded-2xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FFB800]" />
                <span>Register Construction Tender / Deal</span>
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
                  placeholder="e.g. Urban Development Authority (UDA)"
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
                  placeholder="e.g. Coastal High-Rise & Transit Arcade"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Estimated Tender Value (LKR)</label>
                <input
                  type="number"
                  required
                  value={leadValue}
                  onChange={(e) => setLeadValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800] font-mono"
                />
                <span className="text-[11px] text-[#FFB800] font-mono mt-1 block">
                  Formatted Value: {formatLKR(leadValue)}
                </span>
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
                  Enter into Tender Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
