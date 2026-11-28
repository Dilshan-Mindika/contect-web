"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import CustomSelect from '@/components/erp/CustomSelect';
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Truck,
  ShieldCheck,
  Building2,
  DollarSign,
  Scale,
} from 'lucide-react';

export default function ProcurementPage() {
  const {
    purchaseOrders,
    updatePOStatus,
    addPurchaseOrder,
    purchaseRequisitions,
    addPurchaseRequisition,
    approvePurchaseRequisition,
    goodsReceivedNotes,
    addGoodsReceivedNote,
    threeWayMatches,
    activeCompany,
    projects,
    companies,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'PO' | 'GRN' | 'THREE_WAY' | 'PR' | 'SUPPLIERS'>('PO');
  const [showPoModal, setShowPoModal] = useState(false);
  const [showPrModal, setShowPrModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // PO Form
  const [supplier, setSupplier] = useState('Ceylon Heavy Steel Ltd');
  const [poAmount, setPoAmount] = useState(41400000);
  const [selectedPrRef, setSelectedPrRef] = useState(purchaseRequisitions[0]?.prNumber || 'A-PR-0042');

  // PR Form
  const [prItem, setPrItem] = useState('Ordinary Portland Cement (SLS 107 Grade 42.5N)');
  const [prCategory, setPrCategory] = useState('Cementitious');
  const [prQty, setPrQty] = useState(2500);
  const [prUnit, setPrUnit] = useState('Bags (50kg)');
  const [prCost, setPrCost] = useState(5875000);
  const [prBudgetLine, setPrBudgetLine] = useState('BL-CIV-CEM-02');
  const [prProjectCode, setPrProjectCode] = useState(projects[0]?.code || 'CNT-PRJ-241');

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesCompany = activeCompany === 'CONSOLIDATED' || !po.companyId || po.companyId === activeCompany;
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  const filteredPRs = purchaseRequisitions.filter(
    (pr) => activeCompany === 'CONSOLIDATED' || pr.companyId === activeCompany
  );

  const filteredGRNs = goodsReceivedNotes.filter(
    (grn) => activeCompany === 'CONSOLIDATED' || grn.companyId === activeCompany
  );

  const filteredMatches = threeWayMatches.filter(
    (m) => activeCompany === 'CONSOLIDATED' || m.companyId === activeCompany
  );

  const totalPoCommitted = filteredPOs.reduce((acc, po) => acc + po.totalAmount, 0);

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return;
    addPurchaseOrder({
      supplier,
      totalAmount: Number(poAmount),
      status: 'APPROVED',
      itemsCount: 1,
      approvedBy: 'Ruwan Bandara (CFO)',
      prReference: selectedPrRef,
      projectCode: prProjectCode,
    });
    setShowPoModal(false);
  };

  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prItem) return;
    addPurchaseRequisition({
      companyId: activeCompany === 'COMP_B' ? 'COMP_B' : 'COMP_A',
      projectId: projects[0]?.id || 'prj-01',
      projectCode: prProjectCode,
      requestedBy: 'Eng. Samantha Weerasinghe (Structural Eng)',
      requiredDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      itemName: prItem,
      category: prCategory,
      quantity: Number(prQty),
      unit: prUnit,
      estimatedCostLkr: Number(prCost),
      budgetLineCode: prBudgetLine,
      status: 'PENDING',
    });
    setShowPrModal(false);
  };

  const currentComp = companies.find((c) => c.id === activeCompany);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Procurement & Purchase Orders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Manage site PRs, RFQ price comparisons, PO authorizations, Goods Received Notes (GRN), and 3-Way Matching for {activeCompany === 'CONSOLIDATED' ? 'All Companies' : currentComp?.tradeName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-[#FFB800]" />
            <span>New Site Requisition (PR)</span>
          </button>
          <button
            onClick={() => setShowPoModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold shadow-lg border border-blue-400/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-[#FFB800]" />
            <span>Issue Purchase Order (PO)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Committed PO Value</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatLKR(totalPoCommitted, true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {filteredPOs.length} Active Purchase Orders
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">3-Way Match Verification</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            100% Match Rate
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            Zero Price or Quantity Variances
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Verified GRN Receipts</span>
          <div className="text-2xl font-extrabold text-blue-300 mt-1">
            {filteredGRNs.length} GRN Batches
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Site Quality Inspected & Approved
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Pending Site Requisitions</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            {filteredPRs.filter((p) => p.status === 'PENDING').length} PRs
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Awaiting Budget Authorization
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { key: 'PO', label: '01. Purchase Orders (PO)', icon: ShoppingCart },
          { key: 'GRN', label: '02. Goods Received Notes (GRN)', icon: Truck },
          { key: 'THREE_WAY', label: '03. 3-Way Match Verification', icon: Scale },
          { key: 'PR', label: '04. Site Requisitions (PR)', icon: FileText },
          { key: 'SUPPLIERS', label: '05. Supplier Prequalification Registry', icon: Building2 },
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

      {/* TAB 1: PURCHASE ORDERS */}
      {activeTab === 'PO' && (
        <div className="space-y-4">
          <UniversalRecordManager
            title="Purchase Orders Directory (Create, View, Edit, Delete & View Modes)"
            defaultViewMode="DETAILED"
            items={filteredPOs as unknown as Record<string, unknown>[]}
            createLabel="New Purchase Order"
            searchPlaceholder="Search POs by number, supplier..."
            sortOptions={[
              { value: 'poNumber', label: 'PO #' },
              { value: 'supplier', label: 'Supplier' },
              { value: 'totalAmount', label: 'Amount (LKR)' },
              { value: 'status', label: 'Status' },
            ]}
            fields={[
              { key: 'poNumber', label: 'PO Number', isTitle: true },
              { key: 'supplier', label: 'Supplier', required: true },
              { key: 'projectCode', label: 'Project Code', required: true },
              { key: 'totalAmount', label: 'Total (LKR)', type: 'number', isCurrency: true },
              { key: 'date', label: 'Order Date', type: 'date' },
              { key: 'prReference', label: 'Site PR Reference', showInTable: false, optional: true },
              { key: 'deliverySite', label: 'Delivery Site / Store', showInTable: false, optional: true },
              { key: 'expectedDeliveryDate', label: 'Expected Delivery Date', type: 'date', showInTable: false, optional: true },
              { key: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['30 Days Credit', 'COD / On Delivery', '30% Advance + Balance', 'Letter of Credit'], showInTable: false, optional: true },
              { key: 'approvedBy', label: 'Authorized By', showInTable: false, optional: true },
              { key: 'vatIncluded', label: '18% VAT & 2.5% SSCL Included', type: 'checkbox', showInTable: false, optional: true },
              { key: 'remarks', label: 'Procurement & Delivery Notes', type: 'textarea', showInTable: false, optional: true },
              { key: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'ORDERED', 'DELIVERED', 'FULFILLED', 'CANCELLED'], isBadge: true },
              { key: 'images', label: 'Supplier Quote & Delivery Note Photos', type: 'images', showInTable: false, optional: true },
            ]}
            renderRowActions={(item) => {
              const id = String(item.id || '');
              const st = String(item.status || '');
              return st !== 'FULFILLED' ? (
                <button
                  type="button"
                  onClick={() => updatePOStatus(id, 'FULFILLED')}
                  className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[10px] font-bold cursor-pointer"
                >
                  Fulfill
                </button>
              ) : null;
            }}
          />
        </div>
      )}

      {/* TAB 2: GOODS RECEIVED NOTES (GRN) */}
      {activeTab === 'GRN' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300">
            <strong>Site Gate Inspection & GRN Verification:</strong> Storekeeper and QA/QC engineer inspect incoming material deliveries against original PO specifications and Mill Test Certificates (MTC) prior to stock receipt.
          </div>

          <div className="space-y-3">
            {filteredGRNs.map((grn) => (
              <div key={grn.id} className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base">{grn.grnNumber}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        PO Ref: {grn.poNumber}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">Date: {grn.receivedDate}</span>
                    </div>
                    <div className="text-xs text-zinc-300 mt-1">Supplier: {grn.supplierName} • Invoice: {grn.invoiceNumber}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>QA/QC Approved ({grn.inspectedBy})</span>
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#FFB800] font-mono">{formatLKR(grn.totalAcceptedValueLkr)}</div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left font-mono">
                    <thead className="text-zinc-400 border-b border-white/5">
                      <tr>
                        <th className="pb-1 text-left">SKU & Item Name</th>
                        <th className="pb-1 text-right">Ordered Qty</th>
                        <th className="pb-1 text-right">Received Qty</th>
                        <th className="pb-1 text-right">Damaged Qty</th>
                        <th className="pb-1 text-right">Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {grn.itemsReceived.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-1.5 font-sans font-bold text-white">{it.name}</td>
                          <td className="py-1.5 text-right text-zinc-300">{it.orderedQty}</td>
                          <td className="py-1.5 text-right text-emerald-400 font-bold">{it.receivedQty}</td>
                          <td className="py-1.5 text-right text-red-400">{it.damagedQty}</td>
                          <td className="py-1.5 text-right text-zinc-400">{it.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 3-WAY MATCH VERIFICATION */}
      {activeTab === 'THREE_WAY' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Mandatory Anti-Fraud 3-Way Match:</strong> Invoices are automatically cross-checked across <code>Purchase Order Amount</code> $\leftrightarrow$ <code>GRN Accepted Value</code> $\leftrightarrow$ <code>Supplier Invoice Amount</code>. Zero payments are released if variance exceeds 0%.
            </span>
          </div>

          <div className="space-y-3">
            {filteredMatches.map((m) => (
              <div key={m.id} className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      STATUS: {m.matchStatus}
                    </span>
                    <span className="text-xs text-zinc-300 font-mono">Invoice: {m.invoiceNumber}</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    ✓ Verified for Accounts Payable Wire
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400 text-[10px] block">1. PO Document ({m.poNumber})</span>
                    <span className="text-base font-bold text-white mt-1 block">{formatLKR(m.poAmountLkr)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400 text-[10px] block">2. GRN Gate Receipt ({m.grnNumber})</span>
                    <span className="text-base font-bold text-blue-300 mt-1 block">{formatLKR(m.grnAcceptedValueLkr)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400 text-[10px] block">3. Supplier Invoice Value</span>
                    <span className="text-base font-bold text-[#FFB800] mt-1 block">{formatLKR(m.invoiceAmountLkr)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400 text-[10px] block">Audit Variance (LKR)</span>
                    <span className="text-base font-bold text-emerald-400 mt-1 block">LKR {m.varianceLkr.toLocaleString()} (0%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PURCHASE REQUISITIONS (PR) */}
      {activeTab === 'PR' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#080e1c] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 text-zinc-400 border-b border-white/10 font-mono">
                  <tr>
                    <th className="p-3">PR Number</th>
                    <th className="p-3">Mega-Site</th>
                    <th className="p-3">Requested Item & Category</th>
                    <th className="p-3">Required Qty</th>
                    <th className="p-3">Estimated Cost (LKR)</th>
                    <th className="p-3">Budget Line</th>
                    <th className="p-3">Required By</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPRs.map((pr) => (
                    <tr key={pr.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-mono font-bold text-blue-300">{pr.prNumber}</td>
                      <td className="p-3 font-mono text-zinc-300">{pr.projectCode}</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{pr.itemName}</div>
                        <div className="text-[10px] text-zinc-400">{pr.category}</div>
                      </td>
                      <td className="p-3 font-mono text-white">{pr.quantity} {pr.unit}</td>
                      <td className="p-3 font-mono font-bold text-[#FFB800]">{formatLKR(pr.estimatedCostLkr)}</td>
                      <td className="p-3 font-mono text-zinc-400">{pr.budgetLineCode}</td>
                      <td className="p-3 font-mono text-zinc-400">{pr.requiredDate}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            pr.status === 'APPROVED'
                              ? 'bg-blue-500/20 text-blue-300'
                              : pr.status === 'PO_ISSUED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {pr.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {pr.status === 'PENDING' && (
                          <button
                            onClick={() => approvePurchaseRequisition(pr.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold"
                          >
                            Approve PR
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SUPPLIERS */}
      {activeTab === 'SUPPLIERS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Ceylon Heavy Steel Ltd', reg: 'PV-10492', tin: '104928101', cat: 'Deformed Tor Steel Rebar', rating: 'A+ (SLS 375 Verified)' },
            { name: 'Tokyo Super Cement PLC', reg: 'PV-8921', tin: '100291822', cat: 'Ordinary Portland & Blended Cement', rating: 'A+ (SLS 107 Certified)' },
            { name: 'Lanka IOC PLC', reg: 'PQ-521', tin: '200192833', cat: 'Automotive Diesel (LKR 370/L)', rating: 'Direct Bulk Refinery' },
          ].map((sup, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#080e1c] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                Prequalified Vendor
              </span>
              <h4 className="font-bold text-white text-sm">{sup.name}</h4>
              <p className="text-xs text-zinc-400">{sup.cat}</p>
              <div className="p-2 rounded bg-black/40 text-[10px] font-mono text-zinc-300 space-y-0.5">
                <div>BR: {sup.reg} • TIN: {sup.tin}</div>
                <div className="text-blue-300">Compliance: {sup.rating}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE PO MODAL */}
      {showPoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#FFB800]" />
                <span>Issue Authorized Purchase Order (PO)</span>
              </h3>
              <button onClick={() => setShowPoModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreatePO} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Approved Requisition (PR Ref)</label>
                <CustomSelect
                  value={selectedPrRef}
                  onChange={setSelectedPrRef}
                  options={filteredPRs.map((pr) => ({
                    value: pr.prNumber,
                    label: `${pr.prNumber} - ${pr.itemName} (${formatLKR(pr.estimatedCostLkr)})`,
                  }))}
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Supplier Entity</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Total PO Amount (LKR)</label>
                <input
                  type="number"
                  value={poAmount}
                  onChange={(e) => setPoAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  required
                />
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPoModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Authorize & Issue PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PR MODAL */}
      {showPrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FFB800]" />
                <span>New Site Purchase Requisition (PR)</span>
              </h3>
              <button onClick={() => setShowPrModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreatePR} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Material Name & Spec</label>
                <input
                  type="text"
                  value={prItem}
                  onChange={(e) => setPrItem(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={prQty}
                    onChange={(e) => setPrQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Unit</label>
                  <input
                    type="text"
                    value={prUnit}
                    onChange={(e) => setPrUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Estimated Budget Amount (LKR)</label>
                <input
                  type="number"
                  value={prCost}
                  onChange={(e) => setPrCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  required
                />
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
