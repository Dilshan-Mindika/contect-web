"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import CustomSelect from '@/components/erp/CustomSelect';
import { LabourTrade, SiteLabourWorker } from '@/lib/erp/types';
import {
  Activity,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  DollarSign,
  AlertCircle,
  FileText,
  ShieldCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function SiteLabourManagementPage() {
  const {
    labourWorkers,
    musterRolls,
    labourPayrolls,
    addLabourWorker,
    addMusterRoll,
    verifyMusterRoll,
    activeCompany,
    projects,
    companies,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'MUSTER' | 'PAYROLL_15' | 'WORKERS' | 'WORKFLOW'>('MUSTER');
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showMusterModal, setShowMusterModal] = useState(false);

  // New Worker Form State
  const [fullName, setFullName] = useState('');
  const [trade, setTrade] = useState<LabourTrade>('MASON');
  const [dailyRate, setDailyRate] = useState(4200);
  const [otRate, setOtRate] = useState(600);
  const [phone, setPhone] = useState('+94 77 ');
  const [assignedProjectCode, setAssignedProjectCode] = useState(projects[0]?.code || 'CNT-PRJ-241');

  // Filter based on activeCompany
  const filteredWorkers = labourWorkers.filter(
    (w) => activeCompany === 'CONSOLIDATED' || w.companyId === activeCompany
  );

  const filteredMuster = musterRolls.filter(
    (m) => activeCompany === 'CONSOLIDATED' || m.companyId === activeCompany
  );

  const filteredPayrolls = labourPayrolls.filter(
    (lp) => activeCompany === 'CONSOLIDATED' || lp.companyId === activeCompany
  );

  const totalWorkers = filteredWorkers.length;
  const totalWagesDisbursed = filteredPayrolls.reduce((acc, p) => acc + p.totalGrossWagesLkr, 0);

  const handleEnrollWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;
    addLabourWorker({
      companyId: activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany,
      fullName,
      trade,
      dailyWageRateLkr: Number(dailyRate),
      otHourlyRateLkr: Number(otRate),
      phone,
      assignedProjectCode,
    });
    setFullName('');
    setShowAddWorkerModal(false);
  };

  const handleCreateMuster = (e: React.FormEvent) => {
    e.preventDefault();
    addMusterRoll({
      companyId: activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany,
      projectId: projects[0]?.id || 'prj-01',
      projectCode: assignedProjectCode,
      date: new Date().toISOString().split('T')[0],
      supervisorName: 'S. K. Dharmadasa (Site Foreman)',
      isVerified: false,
      totalWorkersPresent: filteredWorkers.length,
      totalWageCostLkr: filteredWorkers.reduce((acc, w) => acc + w.dailyWageRateLkr, 0),
      entries: filteredWorkers.map((w) => ({
        workerId: w.id,
        workerName: w.fullName,
        trade: w.trade,
        shiftDays: 1.0,
        otHours: 1.5,
        wageAmountLkr: w.dailyWageRateLkr + w.otHourlyRateLkr * 1.5,
        advanceDeductionLkr: 0,
      })),
    });
    setShowMusterModal(false);
  };

  const currentComp = companies.find((c) => c.id === activeCompany);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Site Labour & Worker Attendance
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            6-step daily attendance verification, 15-day half-monthly wages, advance recovery, and automatic posting to Project Cost ledger for {activeCompany === 'CONSOLIDATED' ? 'Consolidated Group' : currentComp?.tradeName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMusterModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold shadow-lg border border-blue-400/30 flex items-center gap-2 transition-all"
          >
            <Clock className="w-4 h-4 text-[#FFB800]" />
            <span>File Today's Muster Roll</span>
          </button>
          <button
            onClick={() => setShowAddWorkerModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-[#FFB800]" />
            <span>Enroll Worker</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Registered Daily Workers</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {totalWorkers} Craftsmen
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Masons, Carpenters, Bar Benders & Helpers
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Cumulative 15-Day Wages</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatLKR(totalWagesDisbursed, true)}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            Posted Directly to Project Accounts
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Average Daily Trade Rate</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            LKR 4,200 / day
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Overtime: 1.5x Hourly Scale
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Payment Verification Cycle</span>
          <div className="text-2xl font-extrabold text-blue-300 mt-1">
            15 Days Cycle
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            6-Step Anti-Leakage Audit
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { key: 'MUSTER', label: '01. Daily Site Muster Rolls', icon: Clock },
          { key: 'PAYROLL_15', label: '02. 15-Day Half-Monthly Wages', icon: DollarSign },
          { key: 'WORKERS', label: '03. Worker Master & Trade Rates', icon: Users },
          { key: 'WORKFLOW', label: '04. 6-Step Audit Workflow Guide', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/30 border border-blue-400 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFB800]' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DAILY MUSTER ROLLS */}
      {activeTab === 'MUSTER' && (
        <div className="space-y-4">
          {filteredMuster.map((m) => (
            <div key={m.id} className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base font-mono">{m.projectCode} Daily Muster</span>
                    <span className="text-xs text-zinc-400 font-mono">({m.date})</span>
                    {m.isVerified ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified by {m.engineerVerifiedBy}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Pending Site Engineer Verification
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">Logged by Supervisor: {m.supervisorName}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase">Shift Labour Cost</span>
                    <div className="text-base font-extrabold text-[#FFB800] font-mono">{formatLKR(m.totalWageCostLkr)}</div>
                  </div>
                  {!m.isVerified && (
                    <button
                      onClick={() => verifyMusterRoll(m.id, 'Eng. Maya Lin (Structural Eng)')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Verify as Engineer
                    </button>
                  )}
                </div>
              </div>

              {/* Entries table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white/5 text-zinc-400 font-mono">
                    <tr>
                      <th className="p-2.5">Worker Name</th>
                      <th className="p-2.5">Trade Category</th>
                      <th className="p-2.5">Shift Days</th>
                      <th className="p-2.5">OT Hours</th>
                      <th className="p-2.5">Daily Wages (LKR)</th>
                      <th className="p-2.5">Advance Deduction</th>
                      <th className="p-2.5 text-right">Net Daily Pay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {m.entries.map((en, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-2.5 font-sans font-bold text-white">{en.workerName}</td>
                        <td className="p-2.5 text-blue-300">{en.trade}</td>
                        <td className="p-2.5 text-white">{en.shiftDays}</td>
                        <td className="p-2.5 text-amber-300">+{en.otHours} hrs</td>
                        <td className="p-2.5 text-zinc-200">{formatLKR(en.wageAmountLkr)}</td>
                        <td className="p-2.5 text-red-400">
                          {en.advanceDeductionLkr > 0 ? `-${formatLKR(en.advanceDeductionLkr)}` : '0'}
                        </td>
                        <td className="p-2.5 text-right font-bold text-emerald-400">
                          {formatLKR(en.wageAmountLkr - en.advanceDeductionLkr)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: 15-DAY HALF-MONTHLY WAGES */}
      {activeTab === 'PAYROLL_15' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300">
            <strong>15-Day Half-Monthly Payroll Cycle:</strong> Construction field workers receive disbursements twice per month. Wages + OT are aggregated, all logged mid-period advances are automatically recovered, and the total is debited directly to the respective Project Cost Code.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPayrolls.map((cycle) => (
              <div key={cycle.id} className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#FFB800]">{cycle.projectCode}</span>
                    <h3 className="font-bold text-white text-base">{cycle.cyclePeriod}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      cycle.status === 'DISBURSED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {cycle.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Total Gross Muster Wages:</span>
                    <span className="font-mono font-bold text-white">{formatLKR(cycle.totalGrossWagesLkr)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5 text-red-400">
                    <span>Less: Mid-Cycle Cash Advances Recovered:</span>
                    <span className="font-mono font-bold">-{formatLKR(cycle.totalAdvancesDeductedLkr)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-white/10 font-bold text-sm">
                    <span className="text-white">Net Total Disbursed:</span>
                    <span className="font-mono text-emerald-400">{formatLKRFull(cycle.totalNetPayableLkr)}</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] font-mono text-zinc-400">
                  Posted to General Ledger: <code>GL-5020 (Site Labour Direct Cost)</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WORKER MASTER & TRADE RATES */}
      {activeTab === 'WORKERS' && (
        <div className="space-y-4">
          <UniversalRecordManager
            title="Site Labour Registry (Create, View, Edit, Delete & View Modes)"
            defaultViewMode="DETAILED"
            items={filteredWorkers as unknown as Record<string, unknown>[]}
            createLabel="Register Worker"
            searchPlaceholder="Search workers by name, trade, site..."
            sortOptions={[
              { value: 'fullName', label: 'Worker Name' },
              { value: 'trade', label: 'Trade' },
              { value: 'dailyWageRateLkr', label: 'Daily Wage' },
            ]}
            fields={[
              { key: 'fullName', label: 'Full Name', isTitle: true, required: true },
              { key: 'workerCode', label: 'Worker Code', required: true },
              { key: 'trade', label: 'Trade / Skill', isBadge: true, required: true },
              { key: 'assignedProjectCode', label: 'Assigned Site' },
              { key: 'dailyWageRateLkr', label: 'Daily Wage (LKR)', type: 'number', isCurrency: true },
              { key: 'otHourlyRateLkr', label: 'OT Rate (LKR/hr)', type: 'number', isCurrency: true, showInTable: false, optional: true },
              { key: 'phone', label: 'Contact Phone' },
              { key: 'nicNumber', label: 'NIC / Passport Number', showInTable: false, optional: true },
              { key: 'skillLevel', label: 'Skill Tier', type: 'select', options: ['Master Craftsman', 'Skilled', 'Semi-Skilled', 'General Helper'], showInTable: false, optional: true },
              { key: 'ppeIssued', label: 'PPE Kit Issued (Helmet/Boots/Vest)', showInTable: false, optional: true },
              { key: 'safetyInductionDate', label: 'HSE Induction Date', type: 'date', showInTable: false, optional: true },
              { key: 'emergencyContact', label: 'Emergency Contact & Blood Group', showInTable: false, optional: true },
              { key: 'bankDetails', label: 'Bank Account / Mobile Wallet', showInTable: false, optional: true },
              { key: 'images', label: 'Worker ID, NIC & Trade Cert Photos', type: 'images', showInTable: false, optional: true },
            ]}
          />
        </div>
      )}

      {/* TAB 4: 6-STEP AUDIT WORKFLOW */}
      {activeTab === 'WORKFLOW' && (
        <div className="p-6 rounded-2xl bg-[#080e1c] border border-white/10 space-y-5">
          <h3 className="font-bold text-white text-base">Standard Operating Procedure: 6-Step Labour Audit Workflow</h3>
          <p className="text-xs text-zinc-400">
            Strict internal anti-ghost-worker controls guarantee complete traceability from physical site muster to project cost ledger posting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-3">
            {[
              { step: '01', title: 'Site Supervisor Entry', desc: 'Foreman records daily in/out and OT hours on site.' },
              { step: '02', title: 'Site Engineer Check', desc: 'Engineer verifies actual physical output vs muster count.' },
              { step: '03', title: 'System Wage Calc', desc: 'Auto calculates trade wages + 1.5x OT hours.' },
              { step: '04', title: 'Advance Deductions', desc: 'Mid-period subsistence advances are automatically deducted.' },
              { step: '05', title: 'PM Approval', desc: 'Project Manager reviews and digitally signs 15-day batch.' },
              { step: '06', title: 'Cost Ledger Posting', desc: 'Accounts disburse payment; labor cost debited to project.' },
            ].map((st) => (
              <div key={st.step} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFB800]/20 text-[#FFB800] font-bold">
                  Step {st.step}
                </span>
                <h4 className="font-bold text-white text-xs">{st.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Sample Calculation Verification:</strong> 12 Days worked × Rs. 3,500/day = Rs. 42,000. Less Mid-period Advance Rs. 5,000 = <strong>Net Payable Rs. 37,000</strong> posted directly to Project Accounts.
            </span>
          </div>
        </div>
      )}

      {/* ADD WORKER MODAL */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FFB800]" />
                <span>Enroll Daily Site Worker</span>
              </h3>
              <button onClick={() => setShowAddWorkerModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleEnrollWorker} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Worker Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. K. G. Sunil Premaratne"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Trade Category</label>
                  <CustomSelect
                    value={trade}
                    onChange={(val) => setTrade(val as LabourTrade)}
                    options={[
                      { value: 'MASON', label: 'Mason' },
                      { value: 'CARPENTER', label: 'Carpenter' },
                      { value: 'STEEL_FIXER', label: 'Steel Fixer' },
                      { value: 'BAR_BENDER', label: 'Bar Bender' },
                      { value: 'HELPER', label: 'General Helper' },
                      { value: 'ELECTRICIAN', label: 'Electrician' },
                      { value: 'PLUMBER', label: 'Plumber' },
                      { value: 'PAINTER', label: 'Painter' },
                      { value: 'MACHINE_OPERATOR', label: 'Plant Operator' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Assigned Mega-Project</label>
                  <CustomSelect
                    value={assignedProjectCode}
                    onChange={setAssignedProjectCode}
                    options={projects.map((p) => ({ value: p.code, label: `${p.code} - ${p.name}` }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Daily Wage Rate (LKR)</label>
                  <input
                    type="number"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">OT Rate / Hour (LKR)</label>
                  <input
                    type="number"
                    value={otRate}
                    onChange={(e) => setOtRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Mobile Contact</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                />
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddWorkerModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Enroll Craftsman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILE MUSTER MODAL */}
      {showMusterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFB800]" />
                <span>File Shift Daily Muster Roll</span>
              </h3>
              <button onClick={() => setShowMusterModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateMuster} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Target Mega-Site</label>
                <CustomSelect
                  value={assignedProjectCode}
                  onChange={setAssignedProjectCode}
                  options={projects.map((p) => ({ value: p.code, label: `${p.code} - ${p.name}` }))}
                />
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-zinc-400">Total Enrolled Workers Present:</div>
                <div className="text-lg font-bold text-white">{filteredWorkers.length} Personnel</div>
                <div className="text-emerald-400 font-mono text-[11px]">
                  Estimated Daily Wages: {formatLKR(filteredWorkers.reduce((acc, w) => acc + w.dailyWageRateLkr, 0))}
                </div>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMusterModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Submit Muster to Engineer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
