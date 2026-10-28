"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { ConstructionQuotation, BOQItem, BOQSection } from '@/lib/erp/types';
import QuotationPDFModal from '@/components/erp/QuotationPDFModal';
import {
  FileText,
  Plus,
  Search,
  Printer,
  Sparkles,
  Trash2,
} from 'lucide-react';

function generateExpiryDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function generateBoqItemId(idx: number): string {
  return `boq-${idx}-${Math.random().toString(36).substring(2, 7)}`;
}

export default function QuotationsPage() {
  const { quotations, addQuotation, updateQuotationStatus, sendQuotationEmailAction } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<ConstructionQuotation | null>(null);

  // Form State
  const [clientCompany, setClientCompany] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [validDays, setValidDays] = useState(30);

  // BOQ items in creation form
  const [boqList, setBoqList] = useState<Omit<BOQItem, 'id'>[]>([
    {
      itemCode: 'C-101',
      section: 'EARTHWORK',
      description: 'Mass excavation & geotechnical shoring',
      unit: 'm³',
      quantity: 12000,
      unitRate: 45,
      totalAmount: 540000,
    },
    {
      itemCode: 'C-102',
      section: 'SUBSTRUCTURE',
      description: 'Reinforced concrete foundation raft and core walls',
      unit: 'm³',
      quantity: 4500,
      unitRate: 210,
      totalAmount: 945000,
    },
    {
      itemCode: 'C-103',
      section: 'SUPERSTRUCTURE',
      description: 'Structural steel outriggers and composite deck slabs',
      unit: 'tons',
      quantity: 1800,
      unitRate: 850,
      totalAmount: 1530000,
    },
  ]);

  const [newItemCode, setNewItemCode] = useState('C-104');
  const [newSection, setNewSection] = useState<BOQSection>('MEP');
  const [newDesc, setNewDesc] = useState('');
  const [newUnit, setNewUnit] = useState('kit');
  const [newQty, setNewQty] = useState(1);
  const [newRate, setNewRate] = useState(250000);

  const subtotal = boqList.reduce((acc, it) => acc + it.totalAmount, 0);
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + tax;

  const handleAddBoqItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc) return;
    const totalAmount = newQty * newRate;
    setBoqList((prev) => [
      ...prev,
      {
        itemCode: newItemCode,
        section: newSection,
        description: newDesc,
        unit: newUnit,
        quantity: Number(newQty),
        unitRate: Number(newRate),
        totalAmount,
      },
    ]);
    setNewDesc('');
    setNewItemCode(`C-${100 + boqList.length + 2}`);
  };

  const handleRemoveBoqItem = (index: number) => {
    setBoqList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompany || !projectScope || boqList.length === 0) return;

    const itemsWithIds: BOQItem[] = boqList.map((it, idx) => ({
      ...it,
      id: generateBoqItemId(idx),
    }));

    addQuotation({
      clientCompany,
      clientName: clientName || clientCompany,
      clientEmail: clientEmail || `procurement@${clientCompany.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      projectScope,
      validUntil: generateExpiryDate(validDays),
      boqItems: itemsWithIds,
      subtotal,
      taxVat: tax,
      grandTotal,
      retentionPct: 5,
      status: 'ISSUED',
      termsAndConditions:
        'Standard FIDIC commercial contract. Payment milestones: 10% Advance, 35% Substructure, 30% Superstructure, 20% MEP & Handover. 5% Retention held for 12 months.',
    });

    setClientCompany('');
    setClientName('');
    setProjectScope('');
    setShowCreateModal(false);
  };

  const filteredQuotations = quotations.filter(
    (q) =>
      q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.projectScope.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Commercial Tenders & Cost Estimation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Construction Quotations & BOQ Generator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Generate itemized Bill of Quantities, FIDIC tender documentation, print PDF proposals, and dispatch to clients.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#FFB800]" />
          <span>Generate New Quotation & BOQ</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Tender Bids Value</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            ${(quotations.reduce((acc, q) => acc + q.grandTotal, 0) / 1000000).toFixed(2)}M
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Across {quotations.length} active construction proposals
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Tenders Accepted (Awarded)</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            $
            {(
              quotations
                .filter((q) => q.status === 'ACCEPTED')
                .reduce((acc, q) => acc + q.grandTotal, 0) / 1000000
            ).toFixed(2)}
            M
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            Approved for mobilization
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Standard Defect Retention Rate</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">5.0%</div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            12-Month Post-Handover Warranty Period
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by quote #, client entity, or project scope..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFB800]"
        />
      </div>

      {/* Quotation Table */}
      <div className="rounded-2xl bg-[#080e1c]/85 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-zinc-400 font-mono text-[11px] border-b border-white/10 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Quote #</th>
                <th className="py-3.5 px-4">Developer & Project Scope</th>
                <th className="py-3.5 px-4">Validity Date</th>
                <th className="py-3.5 px-4 text-center">BOQ Items</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredQuotations.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{q.quoteNumber}</td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-white">{q.clientCompany}</div>
                    <div className="text-[11px] text-zinc-400 line-clamp-1">{q.projectScope}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">{q.validUntil}</td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-blue-300 font-bold">
                      {q.boqItems.length} Lines
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-[#FFB800] text-sm font-mono">
                    ${q.grandTotal.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        q.status === 'ACCEPTED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : q.status === 'ISSUED'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedQuotation(q)}
                        className="px-3 py-1.5 rounded-lg bg-[#0038B8]/30 hover:bg-[#0038B8] text-white text-xs font-bold border border-blue-500/40 flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#FFB800]" />
                        <span>PDF / Email</span>
                      </button>

                      {q.status !== 'ACCEPTED' && (
                        <button
                          onClick={() => updateQuotationStatus(q.id, 'ACCEPTED')}
                          className="px-2 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-xs font-semibold border border-emerald-500/30 transition-colors"
                          title="Mark Accepted / Won"
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Full PDF & Email Document Viewer */}
      {selectedQuotation && (
        <QuotationPDFModal
          quotation={selectedQuotation}
          onClose={() => setSelectedQuotation(null)}
          onSendEmail={sendQuotationEmailAction}
        />
      )}

      {/* MODAL: Generate New Construction Quotation & BOQ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-5 my-auto animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
                <span>Create Official Construction Proposal & BOQ</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Developer / Client Entity</label>
                  <input
                    type="text"
                    required
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="e.g. Apex Luxury Holdings"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Client Contact Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Director Tariq Mansour"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Contact Email Address</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="name@corp.com"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Quotation Validity (Days)</label>
                  <input
                    type="number"
                    value={validDays}
                    onChange={(e) => setValidDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Scope & Typology</label>
                <input
                  type="text"
                  required
                  value={projectScope}
                  onChange={(e) => setProjectScope(e.target.value)}
                  placeholder="e.g. 32-Story Parametric Commercial Tower & Piling"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              {/* Bill of Quantities Items Builder */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block">
                  Add Bill of Quantities (BOQ) Items
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400">Code</label>
                    <input
                      type="text"
                      value={newItemCode}
                      onChange={(e) => setNewItemCode(e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400">Section</label>
                    <select
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value as BOQSection)}
                      className="w-full px-2 py-1.5 rounded bg-[#080e1c] border border-white/15 text-white text-xs"
                    >
                      <option value="EARTHWORK">Earthwork</option>
                      <option value="SUBSTRUCTURE">Substructure</option>
                      <option value="SUPERSTRUCTURE">Superstructure</option>
                      <option value="MEP">MEP</option>
                      <option value="FACADE">Facade</option>
                      <option value="FINISHES">Finishes</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-zinc-400">Description</label>
                    <input
                      type="text"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="e.g. Slump tested concrete core"
                      className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400">Qty & Unit Rate ($)</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        value={newQty}
                        onChange={(e) => setNewQty(Number(e.target.value))}
                        className="w-14 px-1 py-1.5 rounded bg-white/5 border border-white/15 text-white text-xs"
                      />
                      <input
                        type="text"
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        className="w-10 px-1 py-1.5 rounded bg-white/5 border border-white/15 text-white text-xs"
                      />
                      <input
                        type="number"
                        value={newRate}
                        onChange={(e) => setNewRate(Number(e.target.value))}
                        className="w-16 px-1 py-1.5 rounded bg-white/5 border border-white/15 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddBoqItem}
                      className="w-full py-1.5 rounded bg-[#0038B8] hover:bg-blue-600 text-white font-bold text-xs"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* List of current items */}
                <div className="space-y-1.5 pt-2 max-h-44 overflow-y-auto">
                  {boqList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-white/[0.03] border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#FFB800]">{item.itemCode}</span>
                        <span className="text-zinc-300">{item.description}</span>
                        <span className="text-zinc-400 text-[10px]">
                          ({item.quantity} {item.unit} @ ${item.unitRate})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">
                          ${item.totalAmount.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBoqItem(idx)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Aggregation */}
              <div className="text-right space-y-1 text-xs border-t border-white/10 pt-3">
                <div className="text-zinc-400">
                  Subtotal: <span className="font-mono text-white font-bold">${subtotal.toLocaleString()}</span>
                </div>
                <div className="text-zinc-400">
                  5% VAT: <span className="font-mono text-white font-bold">${tax.toLocaleString()}</span>
                </div>
                <div className="text-base font-extrabold text-[#FFB800]">
                  Grand Total: ${grandTotal.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-blue-900/40"
                >
                  Authorize Tender Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

