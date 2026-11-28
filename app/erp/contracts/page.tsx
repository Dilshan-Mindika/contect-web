"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import { CIDA102IPC } from '@/lib/erp/types';
import {
  FileText,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  Scale,
  Award,
  Building2,
  Landmark,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export default function GovernmentContractsPage() {
  const {
    govtContracts,
    cidaIpcs,
    addCidaIpc,
    updateCidaIpcStatus,
    activeCompany,
    companies,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'IPC_ENGINE' | 'IPC_REGISTRY' | 'CONTRACTS' | 'BONDS' | 'VARIATIONS'>('IPC_ENGINE');
  const [selectedIpc, setSelectedIpc] = useState<CIDA102IPC | null>(cidaIpcs[0] || null);
  const [showNewIpcModal, setShowNewIpcModal] = useState(false);

  // New IPC form state
  const [contractNo, setContractNo] = useState('RDA/CE3/2026/08');
  const [projName, setProjName] = useState('Central Expressway Viaduct Section III');
  const [employer, setEmployer] = useState('Road Development Authority (RDA)');
  const [worksGross, setWorksGross] = useState(185000000);
  const [boqVar, setBoqVar] = useState(14500000);
  const [materialsOnSite, setMaterialsOnSite] = useState(22000000);
  const [prevGross, setPrevGross] = useState(38000000);

  const filteredContracts = govtContracts.filter(
    (gc) => activeCompany === 'CONSOLIDATED' || gc.companyId === activeCompany
  );

  const filteredIpcs = cidaIpcs.filter(
    (ipc) => activeCompany === 'CONSOLIDATED' || ipc.companyId === activeCompany
  );

  const handleGenerateCidaIpc = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = Number(worksGross) + Number(boqVar) + 4500000 + 8200000 + Number(materialsOnSite);
    const retention = Math.round(subtotal * 0.05);
    const advanceRec = Math.round(subtotal * 0.10);
    const netExclVat = subtotal - retention - advanceRec - Number(prevGross);
    const sscl = Math.round(netExclVat * 0.025);
    const vat = Math.round(netExclVat * 0.18);
    const grandTotal = netExclVat + sscl + vat;

    addCidaIpc({
      companyId: activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany,
      contractNumber: contractNo,
      projectName: projName,
      employerName: employer,
      contractorName: activeCompany === 'COMP_B' ? 'Contec Heavy Infra & Equipment (Pvt) Ltd' : 'Contec Engineering & Construction (Pvt) Ltd',
      issueDate: new Date().toISOString().split('T')[0],
      periodTo: new Date().toISOString().split('T')[0],
      cumulativeWorksGrossLkr: Number(worksGross),
      addBoqVariationsLkr: Number(boqVar),
      addNewStarRateVariationsLkr: 4500000,
      addPriceEscalationLkr: 8200000,
      addMaterialsOnSiteLkr: Number(materialsOnSite),
      grossValuationLkr: subtotal,
      lessRetentionDeductionLkr: retention,
      lessAdvanceRecoveryLkr: advanceRec,
      lessLiquidatedDamagesLkr: 0,
      lessPreviousGrossCertifiedLkr: Number(prevGross),
      netCertifiedExclusiveVatLkr: netExclVat,
      ssclLevy2_5PctLkr: sscl,
      vat18PctLkr: vat,
      grandTotalCertifiedPayableLkr: grandTotal,
      status: 'SUBMITTED',
    });

    setShowNewIpcModal(false);
  };

  const currentComp = companies.find((c) => c.id === activeCompany);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Contracts & Payment Certificates
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Full compliance with CIDA Directive Gov/CIDA/Directive/102/2024 (24 Sept 2024), FIDIC Red Book, 2.5% SSCL, 18% VAT, and 5% retention for {activeCompany === 'CONSOLIDATED' ? 'All Companies' : currentComp?.tradeName}.
          </p>
        </div>

        <button
          onClick={() => setShowNewIpcModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold shadow-lg border border-blue-400/30 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#FFB800]" />
          <span>Generate CIDA Directive 102 IPC</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Active Government Contracts</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {filteredContracts.length} Major Tenders
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            RDA, UDA, Port City Authorities
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Contract Valuation</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            {formatLKR(filteredContracts.reduce((acc, c) => acc + c.revisedContractSumLkr, 0), true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Including Approved Variation Orders
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Performance Bonds in Escrow</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatLKR(filteredContracts.reduce((acc, c) => acc + c.performanceSecurityAmountLkr, 0), true)}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            10% Bank Guarantees (BOC & ComBank)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">CIDA Compliance Standard</span>
          <div className="text-2xl font-extrabold text-blue-300 mt-1">
            Dir. 102/2024
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Standard Format 24 Sept 2024
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { key: 'IPC_ENGINE', label: '01. CIDA Directive 102/2024 IPC Engine', icon: FileText },
          { key: 'IPC_REGISTRY', label: '02. IPC Master Directory', icon: Scale },
          { key: 'CONTRACTS', label: '03. Government Contracts & Agreements', icon: Landmark },
          { key: 'BONDS', label: '04. Bid Bonds & Performance Guarantees', icon: ShieldCheck },
          { key: 'VARIATIONS', label: '05. Variation Orders (VO) & EOT Claims', icon: Scale },
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

      {/* TAB 1: CIDA 102 IPC ENGINE */}
      {activeTab === 'IPC_ENGINE' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
            <div>
              <strong>CIDA Directive Gov/CIDA/Directive/102/2024 (24 Sept 2024) Standard Engine:</strong> Implements the statutory 10-line progressive valuation formula with mandatory separate accounting for <strong>2.5% SSCL</strong>, <strong>18% VAT</strong>, 5% Retention, and Mobilization Recovery.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: List of IPCs */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Issued Interim Certificates
              </h3>
              {filteredIpcs.map((ipc) => {
                const isSelected = selectedIpc?.id === ipc.id;
                return (
                  <button
                    key={ipc.id}
                    onClick={() => setSelectedIpc(ipc)}
                    className={`w-full p-4 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-400 shadow-md'
                        : 'bg-[#080e1c] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-mono text-sm">{ipc.ipcNumber}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        {ipc.status}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-300 font-medium mt-1">{ipc.projectName}</div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Contract: {ipc.contractNumber}</div>
                    <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">Grand Certified Due:</span>
                      <span className="font-bold text-[#FFB800]">{formatLKR(ipc.grandTotalCertifiedPayableLkr)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right 2 Cols: Detailed Printable Official Certificate Viewer */}
            {selectedIpc && (
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white text-zinc-900 border border-zinc-200 shadow-2xl space-y-5">
                {/* Certificate Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-900 pb-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-blue-900 font-extrabold tracking-widest">
                      DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA
                    </div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                      INTERIM PAYMENT CERTIFICATE (IPC)
                    </h2>
                    <div className="text-xs font-bold text-zinc-700 font-mono mt-0.5">
                      Compliant with CIDA Directive Gov/CIDA/Directive/102/2024
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-blue-900 font-mono block">
                      {selectedIpc.ipcNumber}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">Date: {selectedIpc.issueDate}</span>
                  </div>
                </div>

                {/* Parties details box */}
                <div className="grid grid-cols-2 gap-4 text-xs p-3 bg-zinc-50 rounded-xl border border-zinc-200 font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Employer / Client:</span>
                    <strong className="text-zinc-900">{selectedIpc.employerName}</strong>
                    <div className="text-[11px] text-zinc-600 mt-0.5">Project: {selectedIpc.projectName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Main Contractor:</span>
                    <strong className="text-blue-900">{selectedIpc.contractorName}</strong>
                    <div className="text-[11px] text-zinc-600 mt-0.5">CIDA CS2 / FIDIC SBD-02</div>
                  </div>
                </div>

                {/* Statutory 10-Line Calculation Table */}
                <div className="border border-zinc-300 rounded-xl overflow-hidden font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-100 text-zinc-700 border-b border-zinc-300 font-bold">
                      <tr>
                        <th className="p-2.5">Line</th>
                        <th className="p-2.5">Certified Valuation Description</th>
                        <th className="p-2.5 text-right">Amount (LKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">1.0</td>
                        <td className="p-2">Cumulative Gross Value of Permanent & Temporary Works</td>
                        <td className="p-2 text-right font-bold">{formatLKR(selectedIpc.cumulativeWorksGrossLkr)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">2.0</td>
                        <td className="p-2">Add: Approved BOQ Rate Variations</td>
                        <td className="p-2 text-right text-emerald-700">+{formatLKR(selectedIpc.addBoqVariationsLkr)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">3.0</td>
                        <td className="p-2">Add: New Star Rate Variations</td>
                        <td className="p-2 text-right text-emerald-700">+{formatLKR(selectedIpc.addNewStarRateVariationsLkr)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">4.0</td>
                        <td className="p-2">Add: Price Escalation (CIDA Formula Indices)</td>
                        <td className="p-2 text-right text-emerald-700">+{formatLKR(selectedIpc.addPriceEscalationLkr)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">5.0</td>
                        <td className="p-2">Add: Materials on Site (80% Advance on verified unfixed goods)</td>
                        <td className="p-2 text-right text-blue-800">+{formatLKR(selectedIpc.addMaterialsOnSiteLkr)}</td>
                      </tr>
                      <tr className="bg-zinc-50 font-bold border-t border-b border-zinc-300">
                        <td className="p-2 text-zinc-900">6.0</td>
                        <td className="p-2 text-zinc-900">SUBTOTAL GROSS VALUATION (Lines 1 to 5)</td>
                        <td className="p-2 text-right text-zinc-900">{formatLKR(selectedIpc.grossValuationLkr)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">7.0</td>
                        <td className="p-2 text-red-700">Less: 5% Defect Liability Retention Withheld</td>
                        <td className="p-2 text-right text-red-700">-{formatLKR(selectedIpc.lessRetentionDeductionLkr)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">8.0</td>
                        <td className="p-2 text-red-700">Less: Mobilization Advance Recovery Deduction</td>
                        <td className="p-2 text-right text-red-700">-{formatLKR(selectedIpc.lessAdvanceRecoveryLkr)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">9.0</td>
                        <td className="p-2">Less: Liquidated & Ascertained Damages (LAD)</td>
                        <td className="p-2 text-right">-{formatLKR(selectedIpc.lessLiquidatedDamagesLkr)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">10.0</td>
                        <td className="p-2 text-zinc-600">Less: Cumulative Previous Certified Gross Amount</td>
                        <td className="p-2 text-right text-zinc-700">-{formatLKR(selectedIpc.lessPreviousGrossCertifiedLkr)}</td>
                      </tr>
                      <tr className="bg-blue-50 font-bold border-t-2 border-zinc-400 text-blue-950">
                        <td className="p-2.5">11.0</td>
                        <td className="p-2.5">NET CURRENT INTERIM AMOUNT (EXCLUSIVE OF TAXES)</td>
                        <td className="p-2.5 text-right font-extrabold">{formatLKR(selectedIpc.netCertifiedExclusiveVatLkr)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">12.0</td>
                        <td className="p-2">Add: Social Security Contribution Levy (SSCL @ 2.5%)</td>
                        <td className="p-2 text-right text-blue-900">+{formatLKR(selectedIpc.ssclLevy2_5PctLkr)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-zinc-500">13.0</td>
                        <td className="p-2">Add: Value Added Tax (VAT @ 18%)</td>
                        <td className="p-2 text-right text-blue-900">+{formatLKR(selectedIpc.vat18PctLkr)}</td>
                      </tr>
                      <tr className="bg-zinc-900 text-white font-extrabold text-sm">
                        <td className="p-3">14.0</td>
                        <td className="p-3">GRAND TOTAL CERTIFIED PROGRESS PAYMENT IN LKR</td>
                        <td className="p-3 text-right text-amber-300 font-mono">
                          {formatLKRFull(selectedIpc.grandTotalCertifiedPayableLkr)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Engineer & Employer Sign-Off Blocks */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-300 text-xs text-zinc-700 font-mono">
                  <div className="space-y-6">
                    <div>
                      <div className="border-b border-zinc-400 pb-1 font-bold text-zinc-900">
                        Eng. Maya Lin, B.Sc. Eng (Hons), C.Eng, MIE(SL)
                      </div>
                      <span className="text-[10px] text-zinc-500">The Engineer's Representative</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="border-b border-zinc-400 pb-1 font-bold text-zinc-900">
                        Arthur Sterling, B.Sc., FCA, FCMA
                      </div>
                      <span className="text-[10px] text-zinc-500">Contractor's Authorized Signatory</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-blue-950 text-white text-xs font-bold flex items-center gap-2 hover:bg-blue-900 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Print Official CIDA Directive 102 Certificate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CONTRACTS REGISTRY */}
      {activeTab === 'CONTRACTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContracts.map((gc) => (
              <div key={gc.id} className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {gc.contractNumber}
                    </span>
                    <h3 className="font-bold text-white text-base mt-1">{gc.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {gc.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Employer / Agency:</span>
                    <span className="text-white font-bold">{gc.employerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Original Contract Sum:</span>
                    <span className="font-mono text-zinc-300">{formatLKR(gc.originalContractSumLkr)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5 text-emerald-400">
                    <span>Approved Variations:</span>
                    <span className="font-mono">+{formatLKR(gc.approvedVariationsLkr)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-white/10 font-bold text-sm">
                    <span className="text-white">Revised Contract Sum:</span>
                    <span className="font-mono text-[#FFB800]">{formatLKRFull(gc.revisedContractSumLkr)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BONDS & SECURITIES */}
      {activeTab === 'BONDS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300">
            <strong>Mandatory Banking Escrow & Guarantees:</strong> Bid Bonds and Performance Securities (10% of Contract Sum) issued by A-rated commercial banks in Colombo under standard CIDA SBD-02 guidelines.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContracts.map((gc) => (
              <div key={gc.id} className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-3 font-mono text-xs">
                <div className="font-bold text-white text-sm font-sans">{gc.title}</div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-zinc-400 text-[10px] block uppercase">10% Performance Security Guarantee</span>
                  <div className="text-base font-bold text-emerald-400">{formatLKRFull(gc.performanceSecurityAmountLkr)}</div>
                  <div className="text-zinc-400 text-[10px]">Bank: {gc.performanceSecurityBank} • Valid to: {gc.performanceSecurityExpiry}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-zinc-400 text-[10px] block uppercase">Tender Bid Bond Security</span>
                  <div className="text-base font-bold text-[#FFB800]">{formatLKRFull(gc.bidBondAmountLkr)}</div>
                  <div className="text-zinc-400 text-[10px]">Bank: {gc.bidBondBank} • Valid to: {gc.bidBondExpiry}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VARIATIONS & CLAIMS */}
      {activeTab === 'VARIATIONS' && (
        <div className="p-6 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-base">Variation Orders (VO) & Extension of Time (EOT)</h3>
          <p className="text-xs text-zinc-400">
            FIDIC Red Book Clause 13 claims management. All client design amendments, ground condition anomalies, and statutory price escalation indices are tracked under formal Engineer determinations.
          </p>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300 space-y-1">
            <div className="font-bold text-white">Central Expressway Viaduct VO-01: Additional Deep Piling Pier #14</div>
            <div className="text-emerald-400 font-mono">Approved Value: LKR 340,000,000 • Approved EOT: 90 Days</div>
          </div>
        </div>
      )}

      {/* NEW IPC GENERATOR MODAL */}
      {showNewIpcModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FFB800]" />
                <span>Generate CIDA Directive 102/2024 IPC</span>
              </h3>
              <button onClick={() => setShowNewIpcModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleGenerateCidaIpc} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Contract Number</label>
                <input
                  type="text"
                  value={contractNo}
                  onChange={(e) => setContractNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Project Name</label>
                <input
                  type="text"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Employer / Agency</label>
                <input
                  type="text"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Works Gross (LKR)</label>
                  <input
                    type="number"
                    value={worksGross}
                    onChange={(e) => setWorksGross(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">BOQ Variations (LKR)</label>
                  <input
                    type="number"
                    value={boqVar}
                    onChange={(e) => setBoqVar(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Materials on Site (LKR)</label>
                  <input
                    type="number"
                    value={materialsOnSite}
                    onChange={(e) => setMaterialsOnSite(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Prev Gross Certified (LKR)</label>
                  <input
                    type="number"
                    value={prevGross}
                    onChange={(e) => setPrevGross(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewIpcModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Calculate &amp; Generate Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'IPC_REGISTRY' && (
        <UniversalRecordManager
          title="CIDA IPC Certificates Directory (Create, View, Edit, Delete & View Modes)"
          defaultViewMode="DETAILED"
          items={cidaIpcs as unknown as Record<string, unknown>[]}
          createLabel="New IPC Certificate"
          searchPlaceholder="Search IPCs by number, project..."
          sortOptions={[
            { value: 'ipcNumber', label: 'IPC #' },
            { value: 'grandTotalCertifiedPayableLkr', label: 'Grand Certified Due' },
            { value: 'status', label: 'Status' },
          ]}
          fields={[
            { key: 'ipcNumber', label: 'IPC Number', isTitle: true },
            { key: 'projectName', label: 'Project Name', required: true },
            { key: 'contractNumber', label: 'Contract #', required: true },
            { key: 'grandTotalCertifiedPayableLkr', label: 'Certified Due (LKR)', type: 'number', isCurrency: true },
            { key: 'employerName', label: 'Employer / Authority', showInTable: false, optional: true },
            { key: 'engineersRep', label: "Engineer's Representative", showInTable: false, optional: true },
            { key: 'cidaForm', label: 'CIDA / FIDIC Form', type: 'select', options: ['CIDA SBD-02', 'CIDA SBD-01', 'CIDA SBD-04', 'FIDIC Red Book', 'FIDIC Design-Build'], showInTable: false, optional: true },
            { key: 'performanceBondRef', label: 'Performance Bond / Bank Guarantee #', showInTable: false, optional: true },
            { key: 'advanceGuaranteeRef', label: 'Advance Payment Guarantee #', showInTable: false, optional: true },
            { key: 'eotDaysGranted', label: 'EOT Granted (Days)', type: 'number', showInTable: false, optional: true },
            { key: 'defectLiabilityMonths', label: 'Defect Liability Period (Months)', type: 'number', showInTable: false, optional: true },
            { key: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'CERTIFIED_BY_CONSULTANT', 'PAID'], isBadge: true },
            { key: 'images', label: 'Signed IPC & Bond Document Photos', type: 'images', showInTable: false, optional: true },
          ]}
        />
      )}
    </div>
  );
}
