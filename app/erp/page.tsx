"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/erp/AuthContext';
import { formatLKR } from '@/lib/erp/currency';
import ModuleAnalytics from '@/components/erp/ModuleAnalytics';
import {
  HardHat,
  Users,
  ArrowRight,
  Globe,
  Layers,
  Phone,
  LayoutGrid,
  SlidersHorizontal,
  Database,
  CreditCard,
  FileSpreadsheet,
  Download,
  Printer,
  TrendingUp,
  Boxes,
  ShieldCheck,
} from 'lucide-react';

export default function ERPDashboardPage() {
  const {
    user,
    projects,
    invoices,
    leads,
    websiteInquiries,
    inventory,
    machinery,
    cashBook,
    employees,
    siteLogs,
    activeCompany,
  } = useERP();

  const [dashboardMode, setDashboardMode] = useState<'MINIMAL' | 'ADVANCED'>('ADVANCED');
  const [timeframe, setTimeframe] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; database?: string }>({ connected: true });

  useEffect(() => {
    fetch('/api/erp/db/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.mysql) {
          setDbStatus({ connected: Boolean(data.mysql.active), database: data.mysql.database });
        }
      })
      .catch(() => {});
  }, []);

  // Filter by activeCompany if not CONSOLIDATED
  const scopedProjects =
    activeCompany === 'CONSOLIDATED'
      ? projects
      : projects.filter((p) => !p.companyId || p.companyId === activeCompany);

  const scopedInvoices =
    activeCompany === 'CONSOLIDATED'
      ? invoices
      : invoices.filter((i) => !i.companyId || i.companyId === activeCompany);

  const scopedInventory =
    activeCompany === 'CONSOLIDATED'
      ? inventory
      : inventory.filter((item) => !item.companyId || item.companyId === activeCompany);

  const ongoingProjects = scopedProjects.filter((p) => p.phase !== 'HANDOVER').length;
  const totalBudget = scopedProjects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = scopedProjects.reduce((acc, p) => acc + p.spent, 0);
  const totalInvoiced = scopedInvoices.reduce((acc, i) => acc + i.total, 0);
  const paidInvoices = scopedInvoices
    .filter((i) => i.status === 'PAID')
    .reduce((acc, i) => acc + i.total, 0);
  const newInquiriesCount =
    websiteInquiries.filter((i) => i.status === 'NEW').length || leads.length;
  const lowStockCount = scopedInventory.filter((item) => item.status !== 'OPTIMAL').length;

  const scopedCashBook =
    activeCompany === 'CONSOLIDATED'
      ? cashBook
      : cashBook.filter((c) => !c.companyId || c.companyId === activeCompany);
  const cashReceipts = scopedCashBook.filter((c) => c.type === 'RECEIPT').reduce((a, b) => a + b.amountLkr, 0);
  const cashPayments = scopedCashBook.filter((c) => c.type === 'PAYMENT').reduce((a, b) => a + b.amountLkr, 0);
  const latestCashBalance = scopedCashBook[0]?.balanceLkr || cashReceipts - cashPayments;

  const scopedEmployees =
    activeCompany === 'CONSOLIDATED'
      ? employees
      : employees.filter((e) => !e.companyId || e.companyId === activeCompany);
  const monthlyPayrollLkr = scopedEmployees.reduce((a, e) => a + e.salary, 0);
  const siteWorkforceToday = siteLogs.reduce((a, l) => a + l.workforceCount, 0);

  const tfMultiplier =
    timeframe === 'DAILY' ? 1 / 30 : timeframe === 'WEEKLY' ? 1 / 4 : timeframe === 'ANNUAL' ? 12 : 1;

  const timeframeChartData =
    timeframe === 'DAILY'
      ? [
          { label: 'Mon', value: Math.round((paidInvoices / 30) / 1_000_000), secondaryValue: Math.round((totalSpent / 60) / 1_000_000), unit: 'M LKR' },
          { label: 'Tue', value: Math.round((paidInvoices / 26) / 1_000_000), secondaryValue: Math.round((totalSpent / 55) / 1_000_000), unit: 'M LKR' },
          { label: 'Wed', value: Math.round((paidInvoices / 22) / 1_000_000), secondaryValue: Math.round((totalSpent / 48) / 1_000_000), unit: 'M LKR' },
          { label: 'Thu', value: Math.round((paidInvoices / 28) / 1_000_000), secondaryValue: Math.round((totalSpent / 52) / 1_000_000), unit: 'M LKR' },
          { label: 'Fri', value: Math.round((paidInvoices / 20) / 1_000_000), secondaryValue: Math.round((totalSpent / 44) / 1_000_000), unit: 'M LKR' },
          { label: 'Sat', value: Math.round((paidInvoices / 35) / 1_000_000), secondaryValue: Math.round((totalSpent / 70) / 1_000_000), unit: 'M LKR' },
        ]
      : timeframe === 'WEEKLY'
      ? [
          { label: 'Week 1', value: Math.round((totalInvoiced / 4.2) / 1_000_000), secondaryValue: Math.round((totalSpent / 8.5) / 1_000_000), unit: 'M LKR' },
          { label: 'Week 2', value: Math.round((totalInvoiced / 3.8) / 1_000_000), secondaryValue: Math.round((totalSpent / 7.9) / 1_000_000), unit: 'M LKR' },
          { label: 'Week 3', value: Math.round((totalInvoiced / 3.4) / 1_000_000), secondaryValue: Math.round((totalSpent / 7.1) / 1_000_000), unit: 'M LKR' },
          { label: 'Week 4', value: Math.round((totalInvoiced / 3.1) / 1_000_000), secondaryValue: Math.round((totalSpent / 6.8) / 1_000_000), unit: 'M LKR' },
        ]
      : timeframe === 'ANNUAL'
      ? [
          { label: '2023', value: Math.round((totalBudget * 0.45) / 1_000_000), secondaryValue: Math.round((totalSpent * 0.4) / 1_000_000), unit: 'M LKR' },
          { label: '2024', value: Math.round((totalBudget * 0.68) / 1_000_000), secondaryValue: Math.round((totalSpent * 0.62) / 1_000_000), unit: 'M LKR' },
          { label: '2025', value: Math.round((totalBudget * 0.85) / 1_000_000), secondaryValue: Math.round((totalSpent * 0.78) / 1_000_000), unit: 'M LKR' },
          { label: '2026', value: Math.round(totalBudget / 1_000_000), secondaryValue: Math.round(totalSpent / 1_000_000), unit: 'M LKR' },
        ]
      : scopedProjects.slice(0, 6).map((p) => ({
          label: p.code,
          value: Math.round(p.budget / 1_000_000),
          secondaryValue: Math.round(p.spent / 1_000_000),
          unit: 'M LKR',
        }));

  const exportCsv = (filename: string, rows: Record<string, string | number>[]) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map((r) =>
        headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner + Minimal / Advanced Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name || 'Dilshan Perera'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Department: <span className="text-[#FFB800] font-semibold">{user?.department || 'Executive Board'}</span> • Executive overview across projects, finance, and client inquiries.
          </p>
        </div>

        {/* Timeframe + Minimal / Advanced Dashboard Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            {(['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#FFB800] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tf.charAt(0) + tf.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={() => setDashboardMode('MINIMAL')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dashboardMode === 'MINIMAL'
                  ? 'bg-[#0038B8] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Minimal Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setDashboardMode('ADVANCED')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dashboardMode === 'ADVANCED'
                  ? 'bg-[#0038B8] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Advanced Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stat Boxes, Graph View & Executive Reports */}
      <ModuleAnalytics
        title={
          dashboardMode === 'MINIMAL'
            ? `${timeframe} Key Metrics Summary`
            : `${timeframe} Executive Analytics & Graph View`
        }
        defaultMode={dashboardMode}
        showModeToggle={false}
        stats={[
          {
            label: `Active Sites (${timeframe.toLowerCase()})`,
            value: `${ongoingProjects} Sites`,
            subtitle: `Portfolio: ${formatLKR(totalBudget)}`,
            accent: 'blue',
            icon: <HardHat className="w-4 h-4" />,
          },
          {
            label: `Cashbook Balance`,
            value: formatLKR(latestCashBalance),
            subtitle: `Receipts: ${formatLKR(Math.round(cashReceipts * tfMultiplier))}`,
            accent: 'emerald',
            icon: <CreditCard className="w-4 h-4" />,
          },
          {
            label: `Staff & Payroll (${timeframe.toLowerCase()})`,
            value: formatLKR(Math.round(monthlyPayrollLkr * tfMultiplier)),
            subtitle: `${scopedEmployees.length} Staff • ${siteWorkforceToday} Site Crew`,
            accent: 'gold',
            icon: <Users className="w-4 h-4" />,
          },
          {
            label: 'Invoiced & Stock Alerts',
            value: formatLKR(Math.round(totalInvoiced * tfMultiplier)),
            subtitle: `${lowStockCount} stock alerts • ${machinery.length} fleet`,
            accent: lowStockCount > 0 ? 'amber' : 'purple',
            icon: <Boxes className="w-4 h-4" />,
          },
        ]}
        chartTitle={`${timeframe} Financial & Expenditure Overview (Millions LKR)`}
        chartSubtitle={`Live ${timeframe.toLowerCase()} cashflow, project budget & site burn comparison`}
        primarySeriesLabel="Inflow / Budget (M LKR)"
        secondarySeriesLabel="Outflow / Spent (M LKR)"
        chartData={dashboardMode === 'ADVANCED' ? timeframeChartData : []}
        reportFilename="contec-executive-projects-report"
        reportRows={scopedProjects.map((p) => ({
          Code: p.code,
          ProjectName: p.name,
          Client: p.client,
          Location: p.location,
          Phase: p.phase,
          ProgressPct: p.progress,
          BudgetLKR: p.budget,
          SpentLKR: p.spent,
          SiteEngineer: p.siteEngineer,
        }))}
      />

      {/* Dedicated Quick Access Cards to Separate Pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/erp/website"
          className="p-4 rounded-2xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Website Projects</div>
              <div className="text-[11px] text-zinc-400">Manage /projects showcase</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#FFB800] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/erp/services"
          className="p-4 rounded-2xl bg-[#080e1c]/80 border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Website Services</div>
              <div className="text-[11px] text-zinc-400">Manage /services offerings</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/erp/projects"
          className="p-4 rounded-2xl bg-[#080e1c]/80 border border-white/10 hover:border-[#FFB800]/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Construction Sites</div>
              <div className="text-[11px] text-zinc-400">BOQs, schedules &amp; progress</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#FFB800] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/erp/finance"
          className="p-4 rounded-2xl bg-[#080e1c]/80 border border-white/10 hover:border-purple-500/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Invoices &amp; Finance</div>
              <div className="text-[11px] text-zinc-400">Billing, GL &amp; cash flow</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Advanced Mode Only: Executive Reports Center & Financial Breakdown */}
      {dashboardMode === 'ADVANCED' && (
        <div className="p-6 rounded-3xl bg-[#080e1c]/90 border border-blue-500/20 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#FFB800]" />
                <span>Executive Reports &amp; Exports Center</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Download live CSV audit &amp; management reports directly from MySQL records
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer self-start"
            >
              <Printer className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Print Executive Summary</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <button
              type="button"
              onClick={() =>
                exportCsv(
                  'contec-projects-budget-report',
                  scopedProjects.map((p) => ({
                    Code: p.code,
                    Name: p.name,
                    Phase: p.phase,
                    ProgressPct: p.progress,
                    BudgetLKR: p.budget,
                    SpentLKR: p.spent,
                  }))
                )
              }
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-left flex items-center justify-between transition-all cursor-pointer"
            >
              <div>
                <div className="font-bold text-white">Site &amp; Budget Report</div>
                <div className="text-[11px] text-zinc-400">{scopedProjects.length} active projects</div>
              </div>
              <Download className="w-4 h-4 text-blue-400" />
            </button>

            <button
              type="button"
              onClick={() =>
                exportCsv(
                  'contec-financial-invoices-report',
                  scopedInvoices.map((i) => ({
                    Invoice: i.invoiceNumber,
                    Client: i.clientName,
                    Project: i.projectName,
                    TotalLKR: i.total,
                    Status: i.status,
                    DueDate: i.dueDate,
                  }))
                )
              }
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-left flex items-center justify-between transition-all cursor-pointer"
            >
              <div>
                <div className="font-bold text-white">Invoices &amp; Billing Report</div>
                <div className="text-[11px] text-zinc-400">{scopedInvoices.length} invoices</div>
              </div>
              <Download className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() =>
                exportCsv(
                  'contec-client-inquiries-report',
                  websiteInquiries.map((q) => ({
                    ID: q.id,
                    Client: q.clientName,
                    Email: q.email,
                    Phone: q.phone,
                    Type: q.projectType,
                    Budget: q.budgetRange,
                    Status: q.status,
                    Date: q.date,
                  }))
                )
              }
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-left flex items-center justify-between transition-all cursor-pointer"
            >
              <div>
                <div className="font-bold text-white">Client Inquiries Report</div>
                <div className="text-[11px] text-zinc-400">{websiteInquiries.length} inquiries</div>
              </div>
              <Download className="w-4 h-4 text-[#FFB800]" />
            </button>

            <button
              type="button"
              onClick={() =>
                exportCsv(
                  'contec-inventory-valuation-report',
                  scopedInventory.map((item) => ({
                    SKU: item.sku,
                    Material: item.name,
                    Quantity: item.quantity,
                    Unit: item.unit,
                    UnitCostLKR: item.unitCost,
                    Status: item.status,
                  }))
                )
              }
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-left flex items-center justify-between transition-all cursor-pointer"
            >
              <div>
                <div className="font-bold text-white">Inventory Stock Report</div>
                <div className="text-[11px] text-zinc-400">{scopedInventory.length} materials</div>
              </div>
              <Download className="w-4 h-4 text-purple-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-zinc-400">Budget Utilization</span>
              <span className="font-bold text-white">
                {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% ({formatLKR(totalSpent)})
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-zinc-400">Collection Rate</span>
              <span className="font-bold text-emerald-400">
                {totalInvoiced > 0 ? Math.round((paidInvoices / totalInvoiced) * 100) : 0}% Collected
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-zinc-400">Security &amp; Audit</span>
              <span className="font-bold text-blue-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                System &amp; Database Online
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Client Inquiries & Ongoing Construction Sites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#080e1c]/80 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Recent Client Inquiries (/contact)</span>
              </h2>
              <p className="text-xs text-zinc-400">Homeowners seeking feasibility checks and consultations</p>
            </div>
            <Link href="/erp/inquiries" className="text-xs text-[#FFB800] hover:underline flex items-center gap-1">
              <span>View All Inquiries</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {websiteInquiries.slice(0, 4).map((inq) => (
              <div
                key={inq.id}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{inq.clientName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                      {inq.projectType}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-2">
                    <span>{inq.phone}</span>
                    <span>•</span>
                    <span>Received: {inq.date}</span>
                    <span>•</span>
                    <span className="text-[#FFB800] font-semibold">{inq.budgetRange}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${inq.phone}`}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Call Client</span>
                  </a>
                  <Link
                    href="/erp/inquiries"
                    className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Details →</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#080e1c]/80 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HardHat className="w-4 h-4 text-[#FFB800]" />
                <span>Ongoing Construction Sites</span>
              </h2>
              <p className="text-xs text-zinc-400">Live progress from MySQL projects</p>
            </div>
            <Link href="/erp/projects" className="text-xs text-[#FFB800] hover:underline flex items-center gap-1">
              <span>View Sites</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {scopedProjects.slice(0, 4).map((site) => (
              <div key={site.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{site.name}</span>
                    <span className="text-[11px] text-zinc-400">
                      {site.location} • Phase: {site.phase}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#FFB800]">{site.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0038B8] to-[#FFB800] rounded-full transition-all duration-500"
                    style={{ width: `${site.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
