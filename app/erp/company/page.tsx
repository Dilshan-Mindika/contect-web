"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import {
  Building2,
  ShieldCheck,
  CreditCard,
  FileText,
  Calendar,
  AlertCircle,
  Plus,
  Edit2,
  CheckCircle2,
  Landmark,
  Scale,
  Award,
  Layers,
} from 'lucide-react';
import { CompanyId } from '@/lib/erp/types';

export default function CompanyAdministrationPage() {
  const { companies, activeCompany, setActiveCompany, updateCompanyProfile } = useERP();
  const [selectedCompanyId, setSelectedCompanyId] = useState<CompanyId>(
    activeCompany === 'COMP_B' ? 'COMP_B' : 'COMP_A'
  );
  const [activeTab, setActiveTab] = useState<'LEGAL' | 'DIRECTORS' | 'BANKS' | 'POLICIES' | 'SEQUENCES'>('LEGAL');
  const [showEditModal, setShowEditModal] = useState(false);

  const company = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  // Quick Edit State
  const [editName, setEditName] = useState(company.name);
  const [editAddress, setEditAddress] = useState(company.registeredAddress);
  const [editTin, setEditTin] = useState(company.tinNumber);
  const [editVat, setEditVat] = useState(company.vatNumber);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(company.id, {
      name: editName,
      registeredAddress: editAddress,
      tinNumber: editTin,
      vatNumber: editVat,
    });
    setShowEditModal(false);
  };

  const totalBankLiquidity = company.bankAccounts.reduce((acc, b) => acc + b.balanceLkr, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Company Profile & Governance
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Manage legal registration, BR/TIN/VAT, Directors’ signing matrix, bank accounts, and document series for both entities.
          </p>
        </div>

        {/* Company Quick Selector */}
        <div className="flex items-center gap-2 bg-[#080f24] p-1.5 rounded-xl border border-blue-500/30">
          <button
            onClick={() => {
              setSelectedCompanyId('COMP_A');
              setActiveCompany('COMP_A');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCompanyId === 'COMP_A'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Company A (Contec Eng)
          </button>
          <button
            onClick={() => {
              setSelectedCompanyId('COMP_B');
              setActiveCompany('COMP_B');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCompanyId === 'COMP_B'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Company B (Heavy Plant)
          </button>
        </div>
      </div>

      {/* Top Entity Overview Card */}
      <div className="p-6 rounded-2xl bg-[#080f24] border border-blue-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40 uppercase">
                {company.id === 'COMP_A' ? 'Primary Contractor (CS2)' : 'Plant & Earthworks (EM1)'}
              </span>
              <span className="text-xs font-mono text-zinc-400">Entity Code: {company.code}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{company.name}</h2>
            <p className="text-xs text-zinc-300 max-w-2xl">{company.registeredAddress}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setEditName(company.name);
                setEditAddress(company.registeredAddress);
                setEditTin(company.tinNumber);
                setEditVat(company.vatNumber);
                setShowEditModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 flex items-center gap-2 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Edit Legal Profile</span>
            </button>
          </div>
        </div>

        {/* 4 Essential Statutory Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div>
            <div className="text-[10px] font-mono uppercase text-zinc-400">Company Reg (BR)</div>
            <div className="font-bold text-white text-sm mt-0.5">{company.regNumber}</div>
            <span className="text-[10px] text-emerald-400 font-mono">Valid to {company.brExpiryDate}</span>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-zinc-400">TIN & VAT Number</div>
            <div className="font-bold text-white text-sm mt-0.5">{company.tinNumber}</div>
            <span className="text-[10px] text-blue-300 font-mono">VAT: {company.vatNumber}</span>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-zinc-400">CIDA Accreditation</div>
            <div className="font-bold text-[#FFB800] text-sm mt-0.5">{company.cidaGrade}</div>
            <span className="text-[10px] text-zinc-400 font-mono">Seal: {company.cidaRegNo}</span>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-zinc-400">Total Bank Liquidity</div>
            <div className="font-bold text-emerald-400 text-sm mt-0.5">{formatLKR(totalBankLiquidity, true)}</div>
            <span className="text-[10px] text-zinc-400 font-mono">{company.bankAccounts.length} Verified Accounts</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { key: 'LEGAL', label: '01. Legal & Registrations', icon: ShieldCheck },
          { key: 'DIRECTORS', label: '02. Directors & Signing Matrix', icon: Scale },
          { key: 'BANKS', label: '03. Bank Accounts & Escrow', icon: Landmark },
          { key: 'POLICIES', label: '04. Accounting Policies & FY', icon: Calendar },
          { key: 'SEQUENCES', label: '05. Document Series (A vs B)', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

      {/* Tab 1: Legal & Registrations */}
      {activeTab === 'LEGAL' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFB800]" />
              <span>Statutory Incorporation & CIDA Details</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Incorporation Date</span>
                <span className="font-mono text-white font-bold">{company.incorporationDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Registrar of Companies (ROC) Reg</span>
                <span className="font-mono text-emerald-400 font-bold">{company.regNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">CIDA Registration Category</span>
                <span className="font-bold text-[#FFB800]">{company.cidaGrade}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">CIDA Registration No</span>
                <span className="font-mono text-white font-bold">{company.cidaRegNo}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">CIDA Accreditation Validity</span>
                <span className="font-mono text-emerald-400 font-bold">Valid until {company.cidaExpiryDate}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Inland Revenue Department (IRD) Tax Profile</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Taxpayer Identification Number (TIN)</span>
                <span className="font-mono text-white font-bold">{company.tinNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Value Added Tax (VAT 18%) Reg</span>
                <span className="font-mono text-emerald-400 font-bold">{company.vatNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Social Security Contribution Levy (SSCL)</span>
                <span className="font-bold text-blue-300">Registered (2.5% Statutory)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Withholding Tax (WHT) Advance</span>
                <span className="font-bold text-white">5% on Client Milestone Payments</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Tax Clearance Certificate Expiry</span>
                <span className="font-mono text-amber-400 font-bold">Expires {company.taxClearanceExpiryDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Directors & Signing Matrix */}
      {activeTab === 'DIRECTORS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Board of Directors & Financial Approval Authority Matrix
            </h3>
            <span className="text-xs text-zinc-400">All financial limits governed by Article 84</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {company.directors.map((dir) => (
              <div key={dir.id} className="p-4 rounded-xl bg-[#080e1c] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                    {dir.isSignatory ? 'Authorized Signatory' : 'Non-Executive'}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">NIC: {dir.nic}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{dir.name}</h4>
                  <p className="text-xs text-zinc-400">{dir.designation}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">Signing Authority Ceiling</div>
                  <div className="text-lg font-extrabold text-[#FFB800]">{formatLKRFull(dir.signingLimitLkr)}</div>
                </div>
                <div className="text-[11px] text-zinc-400 space-y-0.5 pt-2 border-t border-white/5">
                  <div>Email: <span className="text-zinc-300">{dir.email}</span></div>
                  <div>Phone: <span className="text-zinc-300">{dir.phone}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Tiered Approval Limits Matrix */}
          <div className="p-4 rounded-xl bg-[#080e1c] border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Approval Authority Limits (PR, PO & Payments)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 text-zinc-400 font-mono">
                  <tr>
                    <th className="p-2.5">Transaction Type</th>
                    <th className="p-2.5">Min Amount (LKR)</th>
                    <th className="p-2.5">Max Amount (LKR)</th>
                    <th className="p-2.5">Authorized Role</th>
                    <th className="p-2.5">Governance Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {company.approvalRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-white/[0.02]">
                      <td className="p-2.5 font-bold text-white">{rule.transactionType}</td>
                      <td className="p-2.5 font-mono text-zinc-300">{formatLKR(rule.minAmountLkr)}</td>
                      <td className="p-2.5 font-mono text-[#FFB800] font-bold">{formatLKR(rule.maxAmountLkr)}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[10px]">
                          {rule.approverRole}
                        </span>
                      </td>
                      <td className="p-2.5 text-zinc-400">{rule.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Bank Accounts & Escrow */}
      {activeTab === 'BANKS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Designated Corporate Bank Accounts ({company.name})</h3>
            <span className="text-xs font-mono text-emerald-400">Total Balance: {formatLKRFull(totalBankLiquidity)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {company.bankAccounts.map((b) => (
              <div key={b.id} className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <Landmark className="w-5 h-5 text-blue-400" />
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#FFB800]/20 text-[#FFB800]">
                    {b.accountType}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{b.bankName}</h4>
                  <p className="text-xs text-zinc-400">{b.branch}</p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono uppercase text-zinc-400">Account Number</div>
                  <div className="font-mono font-bold text-white text-base tracking-wider">{b.accountNumber}</div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">SWIFT: {b.swiftCode || 'N/A'}</div>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Verified Balance</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">{formatLKR(b.balanceLkr)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Accounting Policies & Fiscal Year */}
      {activeTab === 'POLICIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FFB800]" />
              <span>Fiscal Year & Accounting Periods</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Financial Year Cycle</span>
                <span className="font-bold text-white">01 April to 31 March (Sri Lanka Standard)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Current Accounting Period</span>
                <span className="font-mono text-emerald-400 font-bold">FY 2026/2027 (Quarter 3 Active)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Period Locking Rule</span>
                <span className="font-bold text-zinc-300">Closed periods cannot receive backdated journals</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Currency of Account</span>
                <span className="font-mono text-[#FFB800] font-bold">LKR (Sri Lankan Rupee)</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-400" />
              <span>Valuation & Depreciation Rules</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Depreciation Methodology</span>
                <span className="font-bold text-[#FFB800]">
                  {company.depreciationPolicy === 'STRAIGHT_LINE'
                    ? 'Straight Line Method (SLM - LKAS 16)'
                    : 'Reducing Balance Method (Plant Fleet)'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Inventory Valuation Method</span>
                <span className="font-bold text-emerald-400">
                  {company.inventoryValuation === 'FIFO'
                    ? 'First-In, First-Out (FIFO - LKAS 2)'
                    : 'Weighted Average Cost'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Revenue Recognition Standard</span>
                <span className="font-bold text-white">SLFRS 15 / IFRS 15 (Percentage of Completion via IPC)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Defect Liability Retention Policy</span>
                <span className="font-bold text-blue-300">5% Withheld, 50% Released at TOC, 50% Post-DLP</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Document Sequences (Company-wise Separation) */}
      {activeTab === 'SEQUENCES' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300">
            <strong>Company-wise Document Prefix Separation:</strong> All transactions for {company.name} automatically receive prefixes starting with <strong>{company.id === 'COMP_A' ? 'A-' : 'B-'}</strong> to ensure complete auditing independence and zero inter-entity cross-contamination.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {company.documentSequences.map((seq) => (
              <div key={seq.module} className="p-4 rounded-xl bg-[#080e1c] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{seq.module}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    Prefix: {seq.prefix}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between font-mono">
                  <div>
                    <div className="text-[10px] text-zinc-400">Next Document #</div>
                    <div className="text-base font-bold text-[#FFB800]">{seq.prefix}-{seq.nextNumber.toString().padStart(4, '0')}</div>
                  </div>
                  <FileText className="w-5 h-5 text-zinc-500" />
                </div>
                <div className="text-[11px] text-zinc-400">Template Format: <code>{seq.format}</code></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FFB800]" />
                <span>Edit Entity Legal Master</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Company Registered Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Official Registered Office Address</label>
                <textarea
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white resize-none"
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">TIN Number</label>
                  <input
                    type="text"
                    value={editTin}
                    onChange={(e) => setEditTin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">VAT Reg Number</label>
                  <input
                    type="text"
                    value={editVat}
                    onChange={(e) => setEditVat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Save Profile Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UniversalRecordManager
        title="Operating Divisions & Legal Entities (Create, View, Edit, Delete & View Modes)"
        items={companies as unknown as Record<string, unknown>[]}
        createLabel="Add Division"
        searchPlaceholder="Search divisions by name, CIDA grade, TIN..."
        sortOptions={[
          { value: 'tradeName', label: 'Trade Name' },
          { value: 'cidaGrade', label: 'CIDA Grade' },
        ]}
        fields={[
          { key: 'tradeName', label: 'Trade Name', isTitle: true, required: true },
          { key: 'name', label: 'Legal Entity Name', required: true },
          { key: 'registrationNumber', label: 'Reg. Number', required: true },
          { key: 'cidaGrade', label: 'CIDA Grade', isBadge: true },
          { key: 'tin', label: 'TIN' },
          { key: 'phone', label: 'Hotline', showInTable: false },
          { key: 'address', label: 'Address', showInTable: false },
        ]}
      />
    </div>
  );
}
