"use client";

import React, { useState } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import { InvoiceStatus, Invoice, JournalLine } from '@/lib/erp/types';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import ModuleAnalytics from '@/components/erp/ModuleAnalytics';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import DocumentStudioModal from '@/components/erp/DocumentStudioModal';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Landmark,
  Scale,
  DollarSign,
  TrendingUp,
  Receipt,
  BookOpen,
  PieChart,
} from 'lucide-react';

export default function FinancePage() {
  const {
    invoices,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    addInvoice,
    activeCompany,
    glAccounts,
    journalEntries,
    addJournalEntry,
    postJournalEntry,
    cashBook,
    addCashBookEntry,
    companies,
  } = useERP();

  const [financeTab, setFinanceTab] = useState<'IPC' | 'GL' | 'CASHBOOK' | 'COA' | 'STATEMENTS'>('IPC');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'ALL' | InvoiceStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showCreateJvModal, setShowCreateJvModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [studioInvoice, setStudioInvoice] = useState<Invoice | null>(null);

  // New Invoice Form State in LKR
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [itemDesc, setItemDesc] = useState('Substructure Concrete Raft Pour & Steel Reinforcement Inspection');
  const [itemAmount, setItemAmount] = useState(85000000);

  // New JV Form State
  const [jvDesc, setJvDesc] = useState('Subcontractor retention deduction & structural material issue');
  const [jvDebitAcc, setJvDebitAcc] = useState('1110');
  const [jvCreditAcc, setJvCreditAcc] = useState('4010');
  const [jvAmount, setJvAmount] = useState(15000000);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesCompany = activeCompany === 'CONSOLIDATED' || !inv.companyId || inv.companyId === activeCompany;
    const matchesTab = activeStatusFilter === 'ALL' || inv.status === activeStatusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.ipcNumber && inv.ipcNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCompany && matchesTab && matchesSearch;
  });

  const filteredJVs = journalEntries.filter(
    (jv) => activeCompany === 'CONSOLIDATED' || jv.companyId === activeCompany
  );

  const filteredCashBook = cashBook.filter(
    (cb) => activeCompany === 'CONSOLIDATED' || cb.companyId === activeCompany
  );

  const filteredGLAccounts = glAccounts.filter(
    (gl) => activeCompany === 'CONSOLIDATED' || gl.companyId === activeCompany
  );

  const totalInvoiced = filteredInvoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalPaid = filteredInvoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, inv) => acc + inv.total, 0);
  const totalPending = filteredInvoices
    .filter((inv) => inv.status === 'PENDING')
    .reduce((acc, inv) => acc + inv.total, 0);
  const totalRetention = filteredInvoices.reduce(
    (acc, inv) => acc + (inv.retentionDeducted || Math.round(inv.subtotal * 0.05)),
    0
  );

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
    setShowCreateInvoiceModal(false);
  };

  const handleCreateJV = (e: React.FormEvent) => {
    e.preventDefault();
    const debitAcc = glAccounts.find((g) => g.code === jvDebitAcc) || glAccounts[0];
    const creditAcc = glAccounts.find((g) => g.code === jvCreditAcc) || glAccounts[1];

    const lines: JournalLine[] = [
      {
        accountId: debitAcc.id,
        accountCode: debitAcc.code,
        accountName: debitAcc.name,
        debitLkr: Number(jvAmount),
        creditLkr: 0,
        memo: jvDesc,
      },
      {
        accountId: creditAcc.id,
        accountCode: creditAcc.code,
        accountName: creditAcc.name,
        debitLkr: 0,
        creditLkr: Number(jvAmount),
        memo: jvDesc,
      },
    ];

    addJournalEntry({
      companyId: activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany,
      date: new Date().toISOString().split('T')[0],
      description: jvDesc,
      referenceType: 'MANUAL',
      lines,
      totalDebitLkr: Number(jvAmount),
      totalCreditLkr: Number(jvAmount),
    });

    setShowCreateJvModal(false);
  };

  // Financial Statements Metrics
  const totalRevenue = filteredGLAccounts
    .filter((a) => a.type === 'REVENUE')
    .reduce((acc, a) => acc + a.balanceLkr, 0);
  const totalExpenses = filteredGLAccounts
    .filter((a) => a.type === 'EXPENSE')
    .reduce((acc, a) => acc + a.balanceLkr, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalAssets = filteredGLAccounts
    .filter((a) => a.type === 'ASSET')
    .reduce((acc, a) => acc + a.balanceLkr, 0);
  const totalLiabilities = filteredGLAccounts
    .filter((a) => a.type === 'LIABILITY')
    .reduce((acc, a) => acc + a.balanceLkr, 0);

  const currentComp = companies.find((c) => c.id === activeCompany);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Invoices, Billing &amp; Financial Ledgers
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Manage Running Account (RA) bills, CIDA SBD-02 statutory retentions, General Ledger, Cash Book, and P&amp;L Statements for {activeCompany === 'CONSOLIDATED' ? 'Consolidated Group' : currentComp?.tradeName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {financeTab === 'GL' && (
            <button
              onClick={() => setShowCreateJvModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg border border-emerald-400/40 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 text-[#FFB800]" />
              <span>Create Journal Voucher (JV)</span>
            </button>
          )}
        </div>
      </div>

      {/* Stat Boxes, Graph View & CSV/Print Reports */}
      <ModuleAnalytics
        title="Financial Telemetry & Reports"
        stats={[
          {
            label: 'Total Certified Invoiced',
            value: formatLKR(totalInvoiced, true),
            subtitle: `${filteredInvoices.length} Interim Certificates`,
            accent: 'blue',
            icon: <CreditCard className="w-4 h-4" />,
          },
          {
            label: 'Collected Payments',
            value: formatLKR(totalPaid, true),
            subtitle: 'Settled to bank',
            accent: 'emerald',
            icon: <CheckCircle2 className="w-4 h-4" />,
          },
          {
            label: 'Pending Receivables',
            value: formatLKR(totalPending, true),
            subtitle: 'Awaiting client settlement',
            accent: 'gold',
            icon: <Clock className="w-4 h-4" />,
          },
          {
            label: 'Statutory Retention',
            value: formatLKR(totalRetention, true),
            subtitle: '5% CIDA SBD-02 held',
            accent: 'purple',
            icon: <Scale className="w-4 h-4" />,
          },
        ]}
        reportFilename="contec-financial-invoices"
        showModeToggle={false}
        reportRows={filteredInvoices.map((inv) => ({
          InvoiceNumber: inv.invoiceNumber,
          Client: inv.clientName,
          Project: inv.projectName,
          IssueDate: inv.issueDate,
          DueDate: inv.dueDate,
          TotalLKR: inv.total,
          Status: inv.status,
        }))}
      />

      {/* KPI Cards in LKR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <span className="text-xs text-zinc-400">Total Certified Invoiced</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatLKR(totalInvoiced, true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {filteredInvoices.length} Active Interim Certificates
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
          <span className="text-xs text-zinc-400">Total Retention Held (5%)</span>
          <div className="text-2xl font-extrabold text-[#FFB800] mt-1">
            {formatLKR(totalRetention, true)}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Defect Liability Security
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { key: 'IPC', label: '01. Interim Certificates (IPC / RA Bills)', icon: FileText },
          { key: 'GL', label: '02. General Ledger & Double-Entry JVs', icon: Scale },
          { key: 'CASHBOOK', label: '03. Cash & Bank Books', icon: Landmark },
          { key: 'COA', label: '04. Chart of Accounts', icon: BookOpen },
          { key: 'STATEMENTS', label: '05. P&L & Balance Sheet', icon: PieChart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = financeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFinanceTab(tab.key as any)}
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

      {/* TAB 1: IPC PROGRESS INVOICES */}
      {financeTab === 'IPC' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeStatusFilter === tab
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab === 'ALL' ? 'All IPCs' : tab}
                </button>
              ))}
            </div>
          </div>

          <UniversalRecordManager
            title="Invoices & IPC Registry (MySQL CRUD, Sort & View Modes)"
            items={filteredInvoices as unknown as Record<string, unknown>[]}
            createLabel="New Invoice"
            searchPlaceholder="Search invoices by number, client, project..."
            sortOptions={[
              { value: 'invoiceNumber', label: 'Invoice #' },
              { value: 'total', label: 'Total (LKR)' },
              { value: 'dueDate', label: 'Due Date' },
              { value: 'status', label: 'Status' },
            ]}
            fields={[
              { key: 'invoiceNumber', label: 'Invoice #', isTitle: true },
              { key: 'clientName', label: 'Client', required: true },
              { key: 'projectName', label: 'Project', required: true },
              { key: 'total', label: 'Total (LKR)', type: 'number', isCurrency: true, required: true },
              { key: 'dueDate', label: 'Due Date', type: 'date' },
              { key: 'ipcNumber', label: 'IPC / RA Bill Ref #', showInTable: false, optional: true },
              { key: 'contractRef', label: 'CIDA / FIDIC Contract #', showInTable: false, optional: true },
              { key: 'retentionDeducted', label: '5% Retention Withheld (LKR)', type: 'number', isCurrency: true, showInTable: false, optional: true },
              { key: 'mobilizationRecoveryLkr', label: 'Mobilization Advance Recovery (LKR)', type: 'number', isCurrency: true, showInTable: false, optional: true },
              { key: 'ssclTax', label: '2.5% SSCL Levy (LKR)', type: 'number', isCurrency: true, showInTable: false, optional: true },
              { key: 'tax', label: '18% VAT (LKR)', type: 'number', isCurrency: true, showInTable: false, optional: true },
              { key: 'paymentMethod', label: 'Settlement Method', type: 'select', options: ['Bank Transfer / RTGS', 'Company Cheque', 'Letter of Credit', 'Treasury Voucher'], showInTable: false, optional: true },
              { key: 'bankReference', label: 'Bank Remittance / Cheque Ref #', showInTable: false, optional: true },
              { key: 'status', label: 'Status', type: 'select', options: ['PENDING', 'PAID', 'OVERDUE'], isBadge: true },
              { key: 'images', label: 'IPC Scans & Payment Advice Photos', type: 'images', showInTable: false, optional: true },
            ]}
            onCreate={(d) => addInvoice({ clientName: String(d.clientName), projectName: String(d.projectName), issueDate: new Date().toISOString().split('T')[0], dueDate: String(d.dueDate || new Date().toISOString().split('T')[0]), items: [], subtotal: Number(d.total || 0), tax: 0, total: Number(d.total || 0), status: (d.status as InvoiceStatus) || 'PENDING' })}
            onUpdate={(id, d) => updateInvoice(id, d)}
            onDelete={(id) => deleteInvoice(id)}
            onView={(item) => setStudioInvoice(item as unknown as Invoice)}
            renderRowActions={(item) => {
              const inv = item as unknown as (typeof filteredInvoices)[number];
              return inv.status !== 'PAID' ? (
                <button
                  type="button"
                  onClick={() => updateInvoiceStatus(inv.id, 'PAID')}
                  className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-[10px] text-emerald-300 font-bold border border-emerald-500/30 cursor-pointer"
                >
                  Settle
                </button>
              ) : null;
            }}
          />
        </div>
      )}

      {/* TAB 2: GENERAL LEDGER & DOUBLE-ENTRY JVS */}
      {financeTab === 'GL' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
            <span>
              <strong>Double-Entry Accounting Rule (LKAS/SLFRS):</strong> Every journal voucher strictly enforces <code className="text-white">Debit = Credit</code>. Posted entries are immutable and can only be reversed with compensating adjustment vouchers.
            </span>
          </div>

          <div className="space-y-3">
            {filteredJVs.map((jv) => (
              <div key={jv.id} className="p-4 rounded-xl bg-[#080e1c] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">{jv.entryNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-500/20 text-blue-300">
                      {jv.referenceType}
                    </span>
                    <span className="text-xs text-zinc-400">{jv.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {jv.isPosted ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>POSTED PERMANENT</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => postJournalEntry(jv.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Post to General Ledger
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-zinc-300">{jv.description}</div>

                <div className="bg-black/30 rounded-lg p-2.5 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-zinc-400 border-b border-white/5 font-mono">
                        <th className="text-left pb-1">A/C Code</th>
                        <th className="text-left pb-1">Account Title</th>
                        <th className="text-right pb-1">Debit (LKR)</th>
                        <th className="text-right pb-1">Credit (LKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {jv.lines.map((l, idx) => (
                        <tr key={idx} className="font-mono">
                          <td className="py-1 text-blue-300">{l.accountCode}</td>
                          <td className="py-1 text-white">{l.accountName}</td>
                          <td className="py-1 text-right text-emerald-400 font-bold">
                            {l.debitLkr > 0 ? formatLKR(l.debitLkr) : '-'}
                          </td>
                          <td className="py-1 text-right text-amber-400 font-bold">
                            {l.creditLkr > 0 ? formatLKR(l.creditLkr) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-white/10 font-mono font-bold text-white">
                      <tr>
                        <td colSpan={2} className="pt-1.5 text-right pr-4">Total Balanced:</td>
                        <td className="pt-1.5 text-right text-emerald-400">{formatLKR(jv.totalDebitLkr)}</td>
                        <td className="pt-1.5 text-right text-amber-400">{formatLKR(jv.totalCreditLkr)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CASH & BANK BOOKS */}
      {financeTab === 'CASHBOOK' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#080e1c] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 text-zinc-400 border-b border-white/10 font-mono">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Voucher #</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Particulars & Description</th>
                    <th className="p-3">Payment Mode</th>
                    <th className="p-3 text-right">Amount (LKR)</th>
                    <th className="p-3 text-right">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCashBook.map((cb) => (
                    <tr key={cb.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-mono text-zinc-400">{cb.date}</td>
                      <td className="p-3 font-mono font-bold text-white">{cb.voucherNo}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            cb.type === 'RECEIPT'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {cb.type}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-white">{cb.particulars}</td>
                      <td className="p-3 font-mono text-zinc-400">{cb.paymentMode}</td>
                      <td className={`p-3 font-mono font-bold text-right ${cb.type === 'RECEIPT' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {cb.type === 'RECEIPT' ? '+' : '-'}{formatLKR(cb.amountLkr)}
                      </td>
                      <td className="p-3 font-mono font-bold text-white text-right">
                        {formatLKR(cb.balanceLkr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHART OF ACCOUNTS */}
      {financeTab === 'COA' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'].map((accType) => {
              const items = filteredGLAccounts.filter((a) => a.type === accType);
              if (items.length === 0) return null;
              return (
                <div key={accType} className="p-4 rounded-xl bg-[#080e1c] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-white text-xs uppercase font-mono">{accType} Accounts</span>
                    <span className="text-[10px] font-mono text-zinc-400">{items.length} Ledgers</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((acc) => (
                      <div key={acc.id} className="flex items-center justify-between p-2 rounded bg-white/[0.02] text-xs">
                        <div>
                          <span className="font-mono text-blue-300 font-bold mr-2">{acc.code}</span>
                          <span className="text-zinc-200">{acc.name}</span>
                        </div>
                        <span className="font-mono font-bold text-white">{formatLKR(acc.balanceLkr)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: FINANCIAL STATEMENTS */}
      {financeTab === 'STATEMENTS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profit & Loss Statement */}
            <div className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-bold text-white text-base">Profit & Loss Statement (P&L)</h3>
                  <p className="text-xs text-zinc-400">For FY 2026/2027 (Sri Lanka LKR)</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  SLFRS Compliant
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5 font-bold text-white">
                  <span>Certified Contract Turnover (Gross IPCs)</span>
                  <span className="font-mono text-emerald-400">{formatLKRFull(totalRevenue)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-300">
                  <span>Less: Direct Construction Materials (MIN)</span>
                  <span className="font-mono text-red-400">-{formatLKR(Math.round(totalExpenses * 0.55))}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-300">
                  <span>Less: Site Labour Wages (15-Day Muster)</span>
                  <span className="font-mono text-red-400">-{formatLKR(Math.round(totalExpenses * 0.25))}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-300">
                  <span>Less: Heavy Plant Fleet Fuel & Maintenance</span>
                  <span className="font-mono text-red-400">-{formatLKR(Math.round(totalExpenses * 0.20))}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-white/10 font-extrabold text-sm text-white">
                  <span>Net Construction Operating Margin</span>
                  <span className="font-mono text-[#FFB800]">{formatLKRFull(netProfit)}</span>
                </div>
              </div>
            </div>

            {/* Balance Sheet Statement */}
            <div className="p-5 rounded-2xl bg-[#080e1c] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-bold text-white text-base">Statement of Financial Position</h3>
                  <p className="text-xs text-zinc-400">Balance Sheet as at 31 October 2026</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  Audited
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5 font-bold text-white">
                  <span>Total Assets (Cash, Receivables, Stock, Plant)</span>
                  <span className="font-mono text-emerald-400">{formatLKRFull(totalAssets)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5 text-zinc-300">
                  <span>Total Liabilities (Trade Payables, VAT, Loans)</span>
                  <span className="font-mono text-red-400">{formatLKRFull(totalLiabilities)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-white/10 font-extrabold text-sm text-white">
                  <span>Net Shareholders' Equity & Reserves</span>
                  <span className="font-mono text-[#FFB800]">{formatLKRFull(totalAssets - totalLiabilities)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FFB800]" />
                <span>Issue Interim Payment Certificate (IPC)</span>
              </h3>
              <button onClick={() => setShowCreateInvoiceModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Employer / Client Name</label>
                <input
                  type="text"
                  placeholder="e.g. Port City Colombo Holdings"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Target Mega-Site / Project</label>
                <input
                  type="text"
                  placeholder="e.g. Colombo Port City Marina Residences"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Certified Work Description</label>
                <input
                  type="text"
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Gross Certified Valuation (LKR)</label>
                <input
                  type="number"
                  value={itemAmount}
                  onChange={(e) => setItemAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  required
                />
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Issue Certified Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE JV MODAL */}
      {showCreateJvModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#FFB800]" />
                <span>Create Double-Entry Journal Voucher (JV)</span>
              </h3>
              <button onClick={() => setShowCreateJvModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateJV} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Transaction Description</label>
                <input
                  type="text"
                  value={jvDesc}
                  onChange={(e) => setJvDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Debit Account</label>
                  <select
                    value={jvDebitAcc}
                    onChange={(e) => setJvDebitAcc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white"
                  >
                    {filteredGLAccounts.map((a) => (
                      <option key={a.id} value={a.code}>{a.code} - {a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Credit Account</label>
                  <select
                    value={jvCreditAcc}
                    onChange={(e) => setJvCreditAcc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1c] border border-white/15 text-white"
                  >
                    {filteredGLAccounts.map((a) => (
                      <option key={a.id} value={a.code}>{a.code} - {a.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Balanced Amount (LKR)</label>
                <input
                  type="number"
                  value={jvAmount}
                  onChange={(e) => setJvAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono"
                  required
                />
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateJvModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Record Balanced Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#080f24] border border-white/20 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">{selectedInvoice.invoiceNumber}</h3>
                <span className="text-xs text-[#FFB800] font-mono">{selectedInvoice.ipcNumber}</span>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-white/[0.02]">
                <div>
                  <span className="text-zinc-400 text-[10px]">Employer / Client</span>
                  <div className="font-bold text-white mt-0.5">{selectedInvoice.clientName}</div>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px]">Mega-Site</span>
                  <div className="font-bold text-white mt-0.5">{selectedInvoice.projectName}</div>
                </div>
              </div>

              <div className="border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-white/5 text-zinc-400">
                    <tr>
                      <th className="p-2.5 text-left">Item Description</th>
                      <th className="p-2.5 text-right">Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {selectedInvoice.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 text-white">{it.description}</td>
                        <td className="p-2.5 text-right font-mono text-zinc-300">{formatLKR(it.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-white/10 font-mono text-xs">
                    <tr>
                      <td className="p-2 text-right text-zinc-400">Subtotal:</td>
                      <td className="p-2 text-right font-bold text-white">{formatLKR(selectedInvoice.subtotal)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-right text-[#FFB800]">Less: 5% Retention:</td>
                      <td className="p-2 text-right font-bold text-[#FFB800]">-{formatLKR(selectedInvoice.retentionDeducted || Math.round(selectedInvoice.subtotal * 0.05))}</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-right text-blue-300">Add: 2.5% SSCL + 18% VAT:</td>
                      <td className="p-2 text-right font-bold text-blue-300">+{formatLKR((selectedInvoice.ssclTax || 0) + selectedInvoice.tax)}</td>
                    </tr>
                    <tr className="border-t border-white/20 text-sm font-extrabold text-white">
                      <td className="p-2 text-right">Net Payable:</td>
                      <td className="p-2 text-right text-emerald-400">{formatLKRFull(selectedInvoice.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {studioInvoice && (
        <DocumentStudioModal
          doc={{
            id: studioInvoice.id,
            mode: 'INVOICE',
            docNumber: studioInvoice.invoiceNumber,
            clientName: studioInvoice.clientName,
            projectTitle: studioInvoice.projectName,
            issueDate: studioInvoice.issueDate,
            dueDate: studioInvoice.dueDate,
            status: studioInvoice.status,
            items: (studioInvoice.items || []).map((it, idx) => ({
              code: `INV-${idx + 1}`,
              description: it.description,
              unit: 'Lot',
              quantity: it.quantity,
              unitPrice: it.rate,
            })),
            fallbackSubtotal: studioInvoice.subtotal || studioInvoice.total,
          }}
          onClose={() => setStudioInvoice(null)}
        />
      )}
    </div>
  );
}
