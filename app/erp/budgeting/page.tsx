"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  PieChart,
} from 'lucide-react';

export default function ProjectBudgetingCostControlPage() {
  const {
    budgetBaselines,
    activeCompany,
    projects,
    companies,
  } = useERP();

  const filteredBaselines = budgetBaselines.filter(
    (b) => activeCompany === 'CONSOLIDATED' || b.companyId === activeCompany
  );

  const [selectedBaselineId, setSelectedBaselineId] = useState(filteredBaselines[0]?.id || budgetBaselines[0]?.id);

  const baseline = filteredBaselines.find((b) => b.id === selectedBaselineId) || filteredBaselines[0] || budgetBaselines[0];

  const totalBaselineBudget = baseline?.totalBaselineBudgetLkr || 3850000000;
  const actualCost =
    (baseline?.actualMaterialsSpentLkr || 0) +
    (baseline?.actualLabourSpentLkr || 0) +
    (baseline?.actualMachinerySpentLkr || 0) +
    (baseline?.actualSubcontractSpentLkr || 0) +
    (baseline?.actualOverheadSpentLkr || 0);

  const committedCost = baseline?.committedCostLkr || 450000000;
  const totalCommitment = actualCost + committedCost;
  const remainingBudget = Math.max(0, totalBaselineBudget - totalCommitment);
  const utilizationPct = Math.round((totalCommitment / totalBaselineBudget) * 100);

  const currentComp = companies.find((c) => c.id === activeCompany);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Project Budgeting & Cost Control
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Compare locked baseline budgets against real-time actuals (Materials + Labour + Equipment + Subcontractors) and committed POs for {activeCompany === 'CONSOLIDATED' ? 'All Companies' : currentComp?.tradeName}.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <select
            value={baseline?.id}
            onChange={(e) => setSelectedBaselineId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080f24] border border-blue-500/30 text-white text-xs font-mono"
          >
            {filteredBaselines.map((b) => (
              <option key={b.id} value={b.id}>
                {b.projectCode} Baseline (LKR {formatLKR(b.totalBaselineBudgetLkr)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Cost Dashboard Gauges */}
      <div className="p-6 rounded-2xl bg-[#080f24] border border-blue-500/20 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                {baseline?.projectCode}
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Locked Baseline Approved: {baseline?.approvedDate}</span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Sample Approved Budget: {formatLKRFull(totalBaselineBudget)}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-zinc-400">Total Budget Utilization</span>
            <div className={`text-2xl font-extrabold font-mono mt-0.5 ${utilizationPct > 90 ? 'text-red-400' : 'text-emerald-400'}`}>
              {utilizationPct}% Utilized
            </div>
          </div>
        </div>

        {/* 4 Summary Metrics (Sample from Slide 22) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-zinc-400 text-[10px] uppercase">1. Approved Baseline Budget</span>
            <div className="text-lg font-extrabold text-white">{formatLKR(totalBaselineBudget, true)}</div>
            <span className="text-[10px] text-zinc-500">Master BOQ Sum</span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-zinc-400 text-[10px] uppercase">2. Actual Cost Incurred</span>
            <div className="text-lg font-extrabold text-blue-300">{formatLKR(actualCost, true)}</div>
            <span className="text-[10px] text-blue-300/80">
              {Math.round((actualCost / totalBaselineBudget) * 100)}% Physical Execution
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-zinc-400 text-[10px] uppercase">3. Committed Cost (POs & Subs)</span>
            <div className="text-lg font-extrabold text-[#FFB800]">{formatLKR(committedCost, true)}</div>
            <span className="text-[10px] text-[#FFB800]/80">
              {Math.round((committedCost / totalBaselineBudget) * 100)}% Committed Orders
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-zinc-400 text-[10px] uppercase">4. Remaining Uncommitted</span>
            <div className="text-lg font-extrabold text-emerald-400">{formatLKR(remainingBudget, true)}</div>
            <span className="text-[10px] text-emerald-400/80">
              {Math.round((remainingBudget / totalBaselineBudget) * 100)}% Safe Runway
            </span>
          </div>
        </div>

        {/* Progress Bar Visualization */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-300">
              Actual Cost: {formatLKR(actualCost, true)} + Committed: {formatLKR(committedCost, true)}
            </span>
            <span className="text-emerald-400 font-bold">Remaining: {formatLKR(remainingBudget, true)}</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
            <div
              className="bg-blue-600 h-full"
              style={{ width: `${Math.min(100, Math.round((actualCost / totalBaselineBudget) * 100))}%` }}
              title="Actual Cost"
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${Math.min(100, Math.round((committedCost / totalBaselineBudget) * 100))}%` }}
              title="Committed Cost"
            />
          </div>
        </div>
      </div>

      {/* Granular Cost Line-Item Breakdown Table */}
      <div className="p-6 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="font-bold text-white text-base">Cost Category Breakdown vs Baseline Budget</h3>
            <p className="text-xs text-zinc-400">
              Integrated real-time feeds from Inventory (MIN), Site Labour, Fleet Machinery, and Subcontractor bills
            </p>
          </div>
          <span className="text-xs font-mono text-[#FFB800] bg-[#FFB800]/10 px-2.5 py-1 rounded-lg border border-[#FFB800]/30">
            EVM Schedule & Cost Aligned
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/5 text-zinc-400 border-b border-white/10 font-mono">
              <tr>
                <th className="p-3">Cost Code / Category</th>
                <th className="p-3 text-right">Baseline Budget (LKR)</th>
                <th className="p-3 text-right">Actual Spent (LKR)</th>
                <th className="p-3 text-right">Burn Rate %</th>
                <th className="p-3 text-right">Remaining Allocation</th>
                <th className="p-3">Data Feed Source Module</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {[
                {
                  code: 'COST-01',
                  name: 'Direct Construction Materials',
                  budget: baseline?.materialsBudgetLkr || 1650000000,
                  spent: baseline?.actualMaterialsSpentLkr || 615000000,
                  source: 'Materials & Store Issue Notes (MIN)',
                },
                {
                  code: 'COST-02',
                  name: 'Site Labour Wages (15-Day Muster)',
                  budget: baseline?.labourBudgetLkr || 680000000,
                  spent: baseline?.actualLabourSpentLkr || 242000000,
                  source: 'Site Labour Attendance & Wages',
                },
                {
                  code: 'COST-03',
                  name: 'Heavy Plant & Machinery Operations',
                  budget: baseline?.machineryBudgetLkr || 520000000,
                  spent: baseline?.actualMachinerySpentLkr || 198000000,
                  source: 'Machinery Fleet & Fuel Records',
                },
                {
                  code: 'COST-04',
                  name: 'Specialized Subcontractors',
                  budget: baseline?.subcontractorBudgetLkr || 720000000,
                  spent: baseline?.actualSubcontractSpentLkr || 288000000,
                  source: 'Procurement & Subcontractor Invoices',
                },
                {
                  code: 'COST-05',
                  name: 'Site Utilities, Water & Overheads',
                  budget: baseline?.siteOverheadBudgetLkr || 280000000,
                  spent: baseline?.actualOverheadSpentLkr || 120000000,
                  source: 'Cash & Petty Cash Books',
                },
              ].map((row) => {
                const burnPct = Math.round((row.spent / row.budget) * 100);
                const remaining = row.budget - row.spent;
                return (
                  <tr key={row.code} className="hover:bg-white/[0.02]">
                    <td className="p-3">
                      <span className="text-blue-300 font-bold block">{row.code}</span>
                      <span className="font-sans text-white text-xs">{row.name}</span>
                    </td>
                    <td className="p-3 text-right text-zinc-300 font-bold">{formatLKR(row.budget)}</td>
                    <td className="p-3 text-right text-white font-bold">{formatLKR(row.spent)}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${burnPct > 80 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {burnPct}%
                      </span>
                    </td>
                    <td className="p-3 text-right text-emerald-400 font-bold">{formatLKR(remaining)}</td>
                    <td className="p-3 font-sans text-zinc-400 text-[11px]">{row.source}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <UniversalRecordManager
        title="Budget Baselines Manager (Create, View, Edit, Delete & View Modes)"
        defaultViewMode="DETAILED"
        items={budgetBaselines as unknown as Record<string, unknown>[]}
        createLabel="New Budget Line"
        searchPlaceholder="Search budget baselines..."
        sortOptions={[
          { value: 'projectCode', label: 'Project Code' },
          { value: 'costCode', label: 'Cost Code' },
          { value: 'baselineBudgetLkr', label: 'Baseline Budget' },
        ]}
        fields={[
          { key: 'description', label: 'Cost Element', isTitle: true, required: true },
          { key: 'projectCode', label: 'Project Code', required: true },
          { key: 'costCode', label: 'Cost Code', isBadge: true },
          { key: 'baselineBudgetLkr', label: 'Baseline (LKR)', type: 'number', isCurrency: true },
          { key: 'actualSpentLkr', label: 'Actual Spent (LKR)', type: 'number', isCurrency: true },
          { key: 'committedPoLkr', label: 'Committed POs (LKR)', type: 'number', isCurrency: true, showInTable: false, optional: true },
          { key: 'forecastToCompleteLkr', label: 'Forecast to Complete (ETC)', type: 'number', isCurrency: true, showInTable: false, optional: true },
          { key: 'costEngineer', label: 'Responsible Cost Engineer / QS', showInTable: false, optional: true },
          { key: 'varianceReason', label: 'Variance & Escalation Justification', type: 'textarea', showInTable: false, optional: true },
          { key: 'images', label: 'BOQ & Cost Variance Supporting Scans', type: 'images', showInTable: false, optional: true },
        ]}
      />
    </div>
  );
}
