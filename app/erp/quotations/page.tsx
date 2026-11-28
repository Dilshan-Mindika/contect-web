"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { ConstructionQuotation, BOQItem, BOQSection } from '@/lib/erp/types';
import { formatLKR } from '@/lib/erp/currency';
import DocumentStudioModal from '@/components/erp/DocumentStudioModal';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
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
  const { quotations, addQuotation, addInvoice, updateQuotationStatus, sendQuotationEmailAction } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<ConstructionQuotation | null>(null);

  // Form State
  const [clientCompany, setClientCompany] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [validDays, setValidDays] = useState(30);

  // BOQ items in creation form (in realistic LKR)
  const [boqList, setBoqList] = useState<Omit<BOQItem, 'id'>[]>([
    {
      itemCode: 'BILL-01',
      section: 'PRELIMINARIES',
      description: 'Site mobilization, laboratory setup, CAR insurance & QA facilities',
      unit: 'item',
      quantity: 1,
      unitRate: 45000000,
      totalAmount: 45000000,
    },
    {
      itemCode: 'BILL-02',
      section: 'EARTHWORK',
      description: 'Mass excavation in rock/soil & secant pile diaphragm walls',
      unit: 'm³',
      quantity: 12000,
      unitRate: 9500,
      totalAmount: 114000000,
    },
    {
      itemCode: 'BILL-03',
      section: 'SUBSTRUCTURE',
      description: 'Reinforced concrete foundation raft (G40) and shear core walls',
      unit: 'm³',
      quantity: 4500,
      unitRate: 44000,
      totalAmount: 198000000,
    },
    {
      itemCode: 'BILL-04',
      section: 'SUPERSTRUCTURE',
      description: 'High-tensile Tor steel reinforcement BS 4449 G500 & formwork',
      unit: 'tons',
      quantity: 650,
      unitRate: 355000,
      totalAmount: 230750000,
    },
  ]);

  const [newItemCode, setNewItemCode] = useState('BILL-05');
  const [newSection, setNewSection] = useState<BOQSection>('MEP');
  const [newDesc, setNewDesc] = useState('');
  const [newUnit, setNewUnit] = useState('lot');
  const [newQty, setNewQty] = useState(1);
  const [newRate, setNewRate] = useState(85000000);

  // Sri Lankan Construction Tax Calculation
  const subtotal = boqList.reduce((acc, it) => acc + it.totalAmount, 0);
  const ssclTax = Math.round(subtotal * 0.025); // 2.5% SSCL
  const taxVat = Math.round(subtotal * 0.18); // 18% VAT
  const retentionAmount = Math.round(subtotal * 0.05); // 5% Retention
  const grandTotal = subtotal + ssclTax + taxVat;

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
    setNewItemCode(`BILL-0${boqList.length + 2}`);
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
      clientEmail: clientEmail || `tenders@${clientCompany.toLowerCase().replace(/[^a-z]/g, '')}.lk`,
      projectScope,
      validUntil: generateExpiryDate(validDays),
      boqItems: itemsWithIds,
      subtotal,
      ssclTax,
      taxVat,
      retentionPct: 5,
      retentionAmount,
      advancePaymentPct: 20,
      defectLiabilityMonths: 24,
      grandTotal,
      status: 'ISSUED',
      cidaGrading: 'CIDA Grade CS2 (Specialist Heavy Civil & High-Rise)',
      termsAndConditions:
        'Standard FIDIC Red Book / CIDA SBD-02 commercial contract. Payment milestones: 20% Advance against Bank Guarantee, 35% Substructure, 30% Superstructure, 15% MEP & Handover. 5% Retention held: 50% on Practical Completion Certificate (PCC) and 50% on Defects Liability Period expiry.',
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Quotations & Itemized BOQ
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            CESMM4 / SLS 573 Bill of Quantities generator, CIDA SBD-02 tax schedules, 1-click A4 PDF export, and direct email dispatch.
          </p>
        </div>
      </div>

      {/* KPI Cards in LKR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Tender Bids Value</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatLKR(quotations.reduce((acc, q) => acc + q.grandTotal, 0), true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Across {quotations.length} active construction proposals
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Tenders Accepted (Awarded)</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatLKR(
              quotations
                .filter((q) => q.status === 'ACCEPTED')
                .reduce((acc, q) => acc + q.grandTotal, 0),
              true
            )}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            Approved for mobilization & advance guarantee
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Statutory Deductions & Retention</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">5.0% Retention</div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Plus 18% VAT & 2.5% SSCL per Sri Lankan Construction Law
          </span>
        </div>
      </div>

      {/* MODAL: Customizable Document Studio & PDF */}
      {selectedQuotation && (
        <DocumentStudioModal
          doc={{
            id: selectedQuotation.id,
            mode: 'QUOTATION',
            docNumber: selectedQuotation.quoteNumber,
            clientName: selectedQuotation.clientName,
            clientCompany: selectedQuotation.clientCompany,
            clientEmail: selectedQuotation.clientEmail,
            projectTitle: selectedQuotation.projectScope,
            issueDate: selectedQuotation.createdDate?.slice(0, 10) || new Date().toISOString().split('T')[0],
            dueDate: selectedQuotation.validUntil,
            status: selectedQuotation.status,
            items: selectedQuotation.boqItems.map((b) => ({
              code: b.itemCode,
              description: b.description,
              unit: b.unit,
              quantity: b.quantity,
              unitPrice: b.unitRate,
            })),
            fallbackSubtotal: selectedQuotation.subtotal || selectedQuotation.grandTotal,
            terms: selectedQuotation.termsAndConditions,
          }}
          onClose={() => setSelectedQuotation(null)}
          onSendEmail={sendQuotationEmailAction}
          onConvertToInvoice={(docData, computedTotal) => {
            addInvoice({
              clientName: docData.clientCompany || docData.clientName,
              projectName: docData.projectTitle,
              issueDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
              items: docData.items.map((it) => ({
                description: it.description,
                quantity: it.quantity,
                rate: it.unitPrice,
                amount: it.quantity * it.unitPrice,
              })),
              subtotal: docData.items.reduce((a, b) => a + b.quantity * b.unitPrice, 0),
              tax: 0,
              total: computedTotal,
              status: 'PENDING',
            });
            updateQuotationStatus(selectedQuotation.id, 'ACCEPTED');
            setSelectedQuotation(null);
          }}
        />
      )}

      {/* MODAL: Generate New Construction Quotation & BOQ in LKR */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-5 my-auto animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
                <span>Create CIDA / FIDIC BOQ Tender Proposal (LKR)</span>
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
                    placeholder="e.g. Colombo Port City Holdings"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Client Authorized Representative</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Eng. Sunil Jayawardena"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Contact Email for Tender Dispatch</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="procurement@client.lk"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Tender Validity Period (Days)</label>
                  <input
                    type="number"
                    value={validDays}
                    onChange={(e) => setValidDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Scope & Engineering Classification</label>
                <input
                  type="text"
                  required
                  value={projectScope}
                  onChange={(e) => setProjectScope(e.target.value)}
                  placeholder="e.g. 48-Story Cantilevered Skyscraper with Secant Piling & Marine Geotech"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              {/* Bill of Quantities Items Builder in LKR */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block">
                  Add Itemized Bill of Quantities (BOQ Breakdown in LKR)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400">Bill Ref</label>
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
                      <option value="PRELIMINARIES">Preliminaries</option>
                      <option value="EARTHWORK">Earthwork</option>
                      <option value="SUBSTRUCTURE">Substructure</option>
                      <option value="SUPERSTRUCTURE">Superstructure</option>
                      <option value="MEP">MEP Services</option>
                      <option value="FACADE">Façade & Glazing</option>
                      <option value="FINISHES">Architectural Finishes</option>
                      <option value="INFRASTRUCTURE">Infrastructure</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-zinc-400">Scope Description</label>
                    <input
                      type="text"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="e.g. Grade 40 concrete pour with micro-silica"
                      className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400">Qty, Unit & Rate (LKR)</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        value={newQty}
                        onChange={(e) => setNewQty(Number(e.target.value))}
                        className="w-14 px-1 py-1.5 rounded bg-white/5 border border-white/15 text-white text-xs font-mono"
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
                        className="w-24 px-1 py-1.5 rounded bg-white/5 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddBoqItem}
                      className="w-full py-1.5 rounded bg-[#0038B8] hover:bg-blue-600 text-white font-bold text-xs"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                {/* List of current items in LKR */}
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
                          ({item.quantity} {item.unit} @ {formatLKR(item.unitRate)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">
                          {formatLKR(item.totalAmount)}
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

              {/* Sri Lankan Construction Tax Aggregation in LKR */}
              <div className="text-right space-y-1 text-xs border-t border-white/10 pt-3">
                <div className="text-zinc-400">
                  BOQ Subtotal: <span className="font-mono text-white font-bold">{formatLKR(subtotal)}</span>
                </div>
                <div className="text-blue-300">
                  Social Security Levy (2.5% SSCL): <span className="font-mono font-bold">+{formatLKR(ssclTax)}</span>
                </div>
                <div className="text-blue-300">
                  Statutory VAT (18%): <span className="font-mono font-bold">+{formatLKR(taxVat)}</span>
                </div>
                <div className="text-amber-400">
                  5% Warranty Retention to be Deducted: <span className="font-mono">({formatLKR(retentionAmount)})</span>
                </div>
                <div className="text-base font-extrabold text-[#FFB800] pt-1">
                  Total Tender Sum: {formatLKR(grandTotal)}
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
                  Issue CIDA/FIDIC Tender Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UniversalRecordManager
        title="Quotations & Fixed BOQ Registry (Create, View, Edit, Delete & View Modes)"
        items={quotations as unknown as Record<string, unknown>[]}
        createLabel="New Quotation"
        searchPlaceholder="Search quotations by tender #, developer, or scope..."
        sortOptions={[
          { value: 'quoteNumber', label: 'Quote #' },
          { value: 'grandTotal', label: 'Grand Total' },
          { value: 'status', label: 'Status' },
          { value: 'validUntil', label: 'Valid Until' },
        ]}
        fields={[
          { key: 'quoteNumber', label: 'Quote #', isTitle: true },
          { key: 'clientName', label: 'Client Name', required: true },
          { key: 'clientCompany', label: 'Company', required: true },
          { key: 'projectScope', label: 'Project Scope', required: true },
          { key: 'grandTotal', label: 'Grand Total (LKR)', type: 'number', isCurrency: true },
          { key: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'ISSUED', 'ACCEPTED', 'REVISED', 'DECLINED'], isBadge: true },
          { key: 'validUntil', label: 'Valid Until', type: 'date' },
          { key: 'clientEmail', label: 'Client Email', showInTable: false, optional: true },
          { key: 'clientPhone', label: 'Client Phone', showInTable: false, optional: true },
          { key: 'cidaSbdForm', label: 'CIDA SBD Standard', type: 'select', options: ['CIDA SBD-01', 'CIDA SBD-02', 'CIDA SBD-03', 'CIDA SBD-04', 'FIDIC Red Book'], showInTable: false, optional: true },
          { key: 'mobilizationAdvancePct', label: 'Mobilization Advance (%)', type: 'number', showInTable: false, optional: true },
          { key: 'retentionPct', label: 'Retention (%)', type: 'number', showInTable: false, optional: true },
          { key: 'bidBondRef', label: 'Bid Bond / Guarantee Ref', showInTable: false, optional: true },
          { key: 'completionMonths', label: 'Est. Duration (Months)', type: 'number', showInTable: false, optional: true },
          { key: 'vatAndSsclApplicable', label: 'Include 18% VAT & 2.5% SSCL', type: 'checkbox', showInTable: false, optional: true },
          { key: 'termsAndConditions', label: 'Terms & Escalation Clauses', type: 'textarea', showInTable: false, optional: true },
          { key: 'images', label: 'Site Survey & BOQ Reference Drawings', type: 'images', showInTable: false, optional: true },
        ]}
        renderRowActions={(item) => {
          const q = item as unknown as (typeof quotations)[number];
          return (
            <button
              type="button"
              onClick={() => setSelectedQuotation(q)}
              className="px-2 py-1 rounded-lg bg-[#0038B8]/30 hover:bg-[#0038B8] text-white text-[11px] font-bold border border-blue-500/40 flex items-center gap-1 cursor-pointer"
              title="PDF / Email"
            >
              <Printer className="w-3 h-3 text-[#FFB800]" />
              <span>PDF</span>
            </button>
          );
        }}
      />
    </div>
  );
}
