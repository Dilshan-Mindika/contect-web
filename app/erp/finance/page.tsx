"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { InvoiceStatus, Invoice } from '@/lib/erp/types';
import { formatLKR } from '@/lib/erp/currency';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function FinancePage() {
  const { invoices, updateInvoiceStatus, addInvoice } = useERP();
  const [activeTab, setActiveTab] = useState<'ALL' | InvoiceStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Form State in LKR
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [itemDesc, setItemDesc] = useState('Substructure Concrete Raft Pour & Steel Reinforcement Inspection');
  const [itemAmount, setItemAmount] = useState(85000000); // LKR 85 Million default

  const filteredInvoices = invoices.filter((inv) => {
    const matchesTab = activeTab === 'ALL' || inv.status === activeTab;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.ipcNumber && inv.ipcNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, inv) => acc + inv.total, 0);
  const totalPending = invoices
    .filter((inv) => inv.status === 'PENDING')
    .reduce((acc, inv) => acc + inv.total, 0);

  const totalRetention = invoices.reduce((acc, inv) => acc + (inv.retentionDeducted || Math.round(inv.subtotal * 0.05)), 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !projectName) return;
    const sscl = Math.round(itemAmount * 0.025);
    const vat = Math.round(itemAmount * 0.18);
    const retention = Math.round(itemAmount * 0.05);
    const netTotal = itemAmount + sscl + vat - retention;

    addInvoice({
      clientName,
      projectName,
      ipcNumber: `IPC #${Math.floor(10 + Math.random() * 90)} (CIDA SBD-02)`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: [
        {
          description: itemDesc,
          quantity: 1,
          rate: Number(itemAmount),
          amount: Number(itemAmount),
        },
      ],
      subtotal: Number(itemAmount),
      ssclTax: sscl,
      tax: vat,
      retentionDeducted: retention,
      total: netTotal,
      status: 'PENDING',
    });
    setClientName('');
    setProjectName('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>Corporate Finance, Progress Billing & IPC Ledgers (LKR)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Interim Payment Certificates (IPC) & Construction Billing
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Manage Running Account (RA) bills, CIDA SBD-02 statutory retentions, 18% VAT & 2.5% SSCL schedules in Sri Lankan Rupees.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-lg shadow-blue-900/40 border border-blue-400/40 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#FFB800]" />
          <span>Issue Interim Certificate (IPC)</span>
        </button>
      </div>

      {/* KPI Cards in LKR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Certified Invoiced</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatLKR(totalInvoiced, true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {invoices.length} Total Issued Certificates
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Collections Received (Paid)</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatLKR(totalPaid, true)}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            {Math.round((totalPaid / (totalInvoiced || 1)) * 100)}% Collection Efficiency
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Pending Employer Receivables</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {formatLKR(totalPending, true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Within 30-day FIDIC payment terms
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Retention Held</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            {formatLKR(totalRetention, true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Defect Liability Security (5%)
          </span>
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start">
          {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-[#0038B8] text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search certificate #, client, or site..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFB800]"
          />
        </div>
      </div>

      {/* Invoices Table in LKR */}
      <div className="rounded-2xl bg-[#080e1c]/85 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-zinc-400 font-mono text-[11px] border-b border-white/10 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Certificate / IPC #</th>
                <th className="py-3.5 px-4">Employer & Project</th>
                <th className="py-3.5 px-4">Payment Due</th>
                <th className="py-3.5 px-4 text-right">Net Certified (LKR)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    <div>{inv.invoiceNumber}</div>
                    {inv.ipcNumber && (
                      <div className="text-[10px] text-blue-400 font-normal">{inv.ipcNumber}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{inv.clientName}</div>
                    <div className="text-[11px] text-zinc-400">{inv.projectName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-[#FFB800] text-sm font-mono">
                    {formatLKR(inv.total)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : inv.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {inv.status === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                      {inv.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {inv.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
                      <span>{inv.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== 'PAID' && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, 'PAID')}
                          className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-[11px] font-semibold transition-colors"
                      >
                        Inspect IPC
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    No payment certificates matching current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal in LKR */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#091124] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-[#FFB800]">CONTEC Interim Payment Certificate</span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Certificate {selectedInvoice.invoiceNumber}
                </h3>
                {selectedInvoice.ipcNumber && (
                  <span className="text-[11px] font-mono text-blue-300">{selectedInvoice.ipcNumber}</span>
                )}
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-400">Employer / Developer:</span>
                <div className="font-bold text-white mt-0.5">{selectedInvoice.clientName}</div>
                <div className="text-zinc-300">{selectedInvoice.projectName}</div>
              </div>
              <div className="text-right">
                <span className="text-zinc-400">Settlement Terms:</span>
                <div className="font-mono text-white mt-0.5">Due: {selectedInvoice.dueDate}</div>
                <div className="text-emerald-400 font-bold uppercase">{selectedInvoice.status}</div>
              </div>
            </div>

            {/* Line items in LKR */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-zinc-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Work Package Description</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {selectedInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-white">{it.description}</td>
                      <td className="p-3 text-right font-mono">{it.quantity}</td>
                      <td className="p-3 text-right font-mono font-bold text-white">
                        {formatLKR(it.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statutory CIDA & Tax Deductions Summary in LKR */}
            <div className="space-y-1.5 text-xs text-right pt-2 border-t border-white/10">
              <div className="text-zinc-400 flex justify-between">
                <span>Gross Value of Work Done:</span>
                <span className="text-white font-mono font-bold">{formatLKR(selectedInvoice.subtotal)}</span>
              </div>
              <div className="text-amber-400 flex justify-between">
                <span>Less 5% Retention Withheld:</span>
                <span className="font-mono">
                  -{formatLKR(selectedInvoice.retentionDeducted || selectedInvoice.subtotal * 0.05)}
                </span>
              </div>
              <div className="text-blue-300 flex justify-between">
                <span>Plus 2.5% Social Security Levy (SSCL):</span>
                <span className="font-mono">
                  +{formatLKR(selectedInvoice.ssclTax || selectedInvoice.subtotal * 0.025)}
                </span>
              </div>
              <div className="text-blue-300 flex justify-between">
                <span>Plus 18% Value Added Tax (VAT):</span>
                <span className="font-mono">
                  +{formatLKR(selectedInvoice.tax)}
                </span>
              </div>
              <div className="text-base font-extrabold text-[#FFB800] pt-2 border-t border-white/10 flex justify-between">
                <span>Net Certified Payment Due:</span>
                <span className="font-mono text-lg">{formatLKR(selectedInvoice.total)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal in LKR */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091124] border border-white/15 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FFB800]" />
                <span>Issue Interim Payment Certificate (IPC)</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Employer / Developer Entity</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Port City Colombo Holdings"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Project Assignment</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Colombo Port City Marina Residences"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Interim Scope Description</label>
                <input
                  type="text"
                  required
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Gross Work Executed in Period (LKR)</label>
                <input
                  type="number"
                  required
                  value={itemAmount}
                  onChange={(e) => setItemAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FFB800] font-mono"
                />
                <div className="mt-2 p-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] space-y-1 text-zinc-300">
                  <div className="flex justify-between">
                    <span>Gross Work Executed:</span>
                    <span className="font-mono text-white">{formatLKR(itemAmount)}</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>Less 5% Retention:</span>
                    <span className="font-mono">-{formatLKR(itemAmount * 0.05)}</span>
                  </div>
                  <div className="flex justify-between text-blue-300">
                    <span>Plus 2.5% SSCL:</span>
                    <span className="font-mono">+{formatLKR(itemAmount * 0.025)}</span>
                  </div>
                  <div className="flex justify-between text-blue-300">
                    <span>Plus 18% VAT:</span>
                    <span className="font-mono">+{formatLKR(itemAmount * 0.18)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-1 border-t border-white/10">
                    <span>Net Amount Due to Contractor:</span>
                    <span className="font-mono text-[#FFB800]">{formatLKR(itemAmount * 1.155)}</span>
                  </div>
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
                  Authorize & Issue IPC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
