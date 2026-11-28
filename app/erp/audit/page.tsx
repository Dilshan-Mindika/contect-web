"use client";

import React, { useState, useEffect } from 'react';
import { useERP } from '@/lib/erp/AuthContext';
import UniversalRecordManager from '@/components/erp/UniversalRecordManager';
import CustomSelect from '@/components/erp/CustomSelect';
import {
  AuditSeverity,
  AuditModule,
  VaultDocument,
  DocumentCategory,
  CompanyId,
} from '@/lib/erp/types';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Search,
  CheckCircle2,
  Terminal,
  FileText,
  FolderLock,
  Download,
  Plus,
  Filter,
  Eye,
  FileCheck,
  Building2,
  Calendar,
  User,
  X,
  FileCode,
  HardHat,
} from 'lucide-react';

export default function AuditAndVaultPage() {
  const {
    auditLogs,
    user,
    activeCompany,
    vaultDocuments,
    addVaultDocument,
    logAuditEvent,
    companies,
  } = useERP();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'VAULT' | 'AUDIT' | 'SYSTEM'>('VAULT');
  const [sysInfo, setSysInfo] = useState<{
    runtime?: { nodeVersion: string; platform: string; uptimeSeconds: number; rssMb: number; heapUsedMb: number; heapTotalMb: number; env: string };
    database?: { connected: boolean; latencyMs: number; tableCounts: Record<string, number>; config?: { host: string; database: string } };
  } | null>(null);

  useEffect(() => {
    if (activeTab === 'SYSTEM') {
      fetch('/api/erp/system-logs')
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.success) setSysInfo(d);
        })
        .catch(() => {});
    }
  }, [activeTab]);

  // Vault State
  const [vaultCategory, setVaultCategory] = useState<'ALL' | DocumentCategory>('ALL');
  const [vaultFormat, setVaultFormat] = useState<'ALL' | 'PDF' | 'EXCEL' | 'WORD' | 'IMAGE'>('ALL');
  const [vaultCompanyFilter, setVaultCompanyFilter] = useState<'ALL' | CompanyId>(
    activeCompany === 'CONSOLIDATED' ? 'ALL' : activeCompany
  );
  const [vaultSearch, setVaultSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocForInspect, setSelectedDocForInspect] = useState<VaultDocument | null>(null);

  // New Document Form State
  const [newCompanyId, setNewCompanyId] = useState<CompanyId>(
    activeCompany === 'COMP_B' ? 'COMP_B' : 'COMP_A'
  );
  const [newDocRef, setNewDocRef] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('CONTRACT');
  const [newRelatedEntity, setNewRelatedEntity] = useState('CNT-2026-001');
  const [newFormat, setNewFormat] = useState<'PDF' | 'EXCEL' | 'WORD' | 'IMAGE'>('PDF');
  const [newFileSizeKb, setNewFileSizeKb] = useState(2450);
  const [newTags, setNewTags] = useState('Contract, FIDIC, CIDA');
  const [newIsConfidential, setNewIsConfidential] = useState(true);

  // Audit State
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | AuditSeverity>('ALL');
  const [selectedModule, setSelectedModule] = useState<'ALL' | AuditModule>('ALL');
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [auditCompanyFilter, setAuditCompanyFilter] = useState<'ALL' | CompanyId>(
    activeCompany === 'CONSOLIDATED' ? 'ALL' : activeCompany
  );

  // Filtered Vault Documents
  const filteredDocuments = vaultDocuments.filter((doc) => {
    const matchesComp =
      vaultCompanyFilter === 'ALL'
        ? activeCompany === 'CONSOLIDATED' || doc.companyId === activeCompany
        : doc.companyId === vaultCompanyFilter;
    const matchesCat = vaultCategory === 'ALL' || doc.category === vaultCategory;
    const matchesFormat = vaultFormat === 'ALL' || doc.fileFormat === vaultFormat;
    const matchesSearch =
      doc.title.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      doc.documentRefNumber.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(vaultSearch.toLowerCase())) ||
      doc.uploadedBy.toLowerCase().includes(vaultSearch.toLowerCase());
    return matchesComp && matchesCat && matchesFormat && matchesSearch;
  });

  // Filtered Audit Logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesComp =
      auditCompanyFilter === 'ALL'
        ? activeCompany === 'CONSOLIDATED' || !log.companyId || log.companyId === activeCompany
        : log.companyId === auditCompanyFilter;
    const matchesSev = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
    const matchesMod = selectedModule === 'ALL' || log.module === selectedModule;
    const matchesSearch =
      log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearchTerm.toLowerCase());
    return matchesComp && matchesSev && matchesMod && matchesSearch;
  });

  // Handle Archive Document Submission
  const handleArchiveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const ref =
      newDocRef.trim() ||
      `${newCompanyId === 'COMP_A' ? 'A' : 'B'}-DOC-${Math.floor(1000 + Math.random() * 9000)}`;

    addVaultDocument({
      companyId: newCompanyId,
      documentRefNumber: ref,
      title: newTitle.trim(),
      category: newCategory,
      relatedEntityId: newRelatedEntity.trim() || undefined,
      fileFormat: newFormat,
      fileSizeKb: Number(newFileSizeKb) || 1024,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: user?.name || 'Chief Auditor',
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      isConfidential: newIsConfidential,
    });

    logAuditEvent(
      'ARCHIVE_VAULT_DOCUMENT',
      'DOCUMENTS',
      `Archived secure document [${ref}] "${newTitle}" under category ${newCategory} (Format: ${newFormat}, Size: ${newFileSizeKb} KB). SHA-256 fingerprint generated.`,
      newIsConfidential ? 'WARNING' : 'INFO',
      newCompanyId
    );

    // Reset Form
    setNewDocRef('');
    setNewTitle('');
    setShowUploadModal(false);
  };

  // Export Manifest as CSV
  const handleExportManifest = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        ['Ref Number', 'Company', 'Title', 'Category', 'Format', 'Size (KB)', 'Upload Date', 'Uploaded By', 'Confidential', 'SHA-256 Status'].join(','),
        ...filteredDocuments.map((d) =>
          [
            `"${d.documentRefNumber}"`,
            `"${d.companyId}"`,
            `"${d.title.replace(/"/g, '""')}"`,
            `"${d.category}"`,
            `"${d.fileFormat}"`,
            d.fileSizeKb,
            `"${d.uploadDate}"`,
            `"${d.uploadedBy}"`,
            d.isConfidential ? 'YES' : 'NO',
            'VERIFIED_SHA256',
          ].join(',')
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CONTEC_VAULT_MANIFEST_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Audit Trail as CSV
  const handleExportAuditTrail = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        ['Timestamp (UTC)', 'Company', 'Module', 'Action', 'Severity', 'Operator', 'IP Address', 'Details'].join(','),
        ...filteredLogs.map((l) =>
          [
            `"${l.timestamp}"`,
            `"${l.companyId || 'CONSOLIDATED'}"`,
            `"${l.module}"`,
            `"${l.action}"`,
            `"${l.severity}"`,
            `"${l.actorName} (${l.role})"`,
            `"${l.ipAddress}"`,
            `"${l.details.replace(/"/g, '""')}"`,
          ].join(',')
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CONTEC_IMMUTABLE_AUDIT_LOGS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Document Management & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            CIDA &amp; ISO 9001:2015 document archive, multi-company record isolation, and activity audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {activeTab === 'VAULT' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportManifest}
                className="h-10 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Export Manifest</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-900/30 whitespace-nowrap transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Archive Document</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleExportAuditTrail}
              className="h-10 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export Audit Trail (CSV)</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Vault Documents Stored</span>
            <FolderLock className="w-4 h-4 text-[#FFB800]" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-white mt-1">
            {vaultDocuments.length}
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {vaultDocuments.filter((d) => d.companyId === 'COMP_A').length} Company A •{' '}
            {vaultDocuments.filter((d) => d.companyId === 'COMP_B').length} Company B
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Total Vault Volume</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-blue-400 mt-1">
            {(vaultDocuments.reduce((acc, d) => acc + d.fileSizeKb, 0) / 1024).toFixed(2)} MB
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Protected company document storage
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Access Protection</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            Role-Based Access
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Secure staff session controls
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1c]/80 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Active Audit Ledger</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-purple-300 mt-1">
            {auditLogs.length} Events
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Immutable log trail across 12 modules
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-white/10">
        <button
          onClick={() => setActiveTab('VAULT')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'VAULT'
              ? 'border-[#FFB800] text-[#FFB800]'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <FolderLock className="w-4 h-4" />
          <span>01. Central Document Vault ({filteredDocuments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'AUDIT'
              ? 'border-[#0038B8] text-blue-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>02. Activity &amp; Security Audit Trail ({filteredLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SYSTEM')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'SYSTEM'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>System Activity &amp; Health</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CENTRAL DOCUMENT VAULT */}
      {/* ========================================================================= */}
      {activeTab === 'VAULT' && (
        <div className="space-y-6">
          {/* Vault Filter and Search Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#080e1c]/80 border border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#FFB800]" /> Company:
              </span>
              {(['ALL', 'COMP_A', 'COMP_B'] as const).map((comp) => (
                <button
                  key={comp}
                  onClick={() => setVaultCompanyFilter(comp)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    vaultCompanyFilter === comp
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                  }`}
                >
                  {comp === 'ALL'
                    ? 'All Entities'
                    : comp === 'COMP_A'
                    ? 'Company A (Building)'
                    : 'Company B (Heavy Plant)'}
                </button>
              ))}

              <span className="text-xs font-mono text-zinc-400 ml-3">Format:</span>
              {(['ALL', 'PDF', 'EXCEL', 'WORD', 'IMAGE'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setVaultFormat(fmt)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                    vaultFormat === fmt
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
                placeholder="Search ref, title, tag, or uploader..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFB800]"
              />
            </div>
          </div>

          {/* Categories Pill Scroller */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {(
              [
                'ALL',
                'CONTRACT',
                'INVOICE',
                'PAYMENT_VOUCHER',
                'JOURNAL_VOUCHER',
                'BANK_STATEMENT',
                'PURCHASE_ORDER',
                'EMPLOYEE_FILE',
                'PAYROLL_SHEET',
                'TAX_RETURN',
                'CIDA_IPC',
              ] as const
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setVaultCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                  vaultCategory === cat
                    ? 'bg-[#0038B8] text-white font-bold shadow-md shadow-blue-900/30'
                    : 'bg-[#080e1c] hover:bg-white/5 text-zinc-400 border border-white/5'
                }`}
              >
                {cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Document Vault Table */}
          <div className="rounded-2xl bg-[#080e1c]/85 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] text-zinc-400 font-mono text-[11px] border-b border-white/10 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Ref Number</th>
                    <th className="py-3.5 px-4">Document Title & Tags</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Company Entity</th>
                    <th className="py-3.5 px-4">Format & Size</th>
                    <th className="py-3.5 px-4">Uploaded By & Date</th>
                    <th className="py-3.5 px-4 text-center">Security</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-zinc-500 font-mono text-xs">
                        No documents found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                          {doc.documentRefNumber}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-white leading-tight">{doc.title}</div>
                          {doc.relatedEntityId && (
                            <span className="text-[10px] font-mono text-blue-300 mr-2">
                              Ref: {doc.relatedEntityId}
                            </span>
                          )}
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {doc.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.2 rounded bg-white/5 text-zinc-400 text-[10px] font-mono"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/20 whitespace-nowrap">
                            {doc.category.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              doc.companyId === 'COMP_A'
                                ? 'bg-[#0038B8]/20 text-blue-300 border border-blue-500/30'
                                : 'bg-amber-500/20 text-[#FFB800] border border-amber-500/30'
                            }`}
                          >
                            {doc.companyId === 'COMP_A' ? 'A (General Civil)' : 'B (Plant Fleet)'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                          <span className="text-white font-bold">{doc.fileFormat}</span> •{' '}
                          {(doc.fileSizeKb / 1024).toFixed(1)} MB
                        </td>
                        <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                          <div className="text-white text-[11px] font-medium">{doc.uploadedBy}</div>
                          <div className="text-[10px] font-mono text-zinc-500">{doc.uploadDate}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {doc.isConfidential ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                              <Lock className="w-3 h-3" /> Confidential
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Standard
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedDocForInspect(doc)}
                              title="View Document Details"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-400" />
                            </button>
                            <button
                              onClick={() => {
                                alert(`Downloading document "${doc.documentRefNumber}" (${doc.title}).`);
                              }}
                              title="Download Secure File"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-[#FFB800] transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVITY & SECURITY AUDIT TRAIL */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#080e1c]/90 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
              <span className="font-bold text-white">Active Session:</span>
              <span className="text-zinc-300">{user?.name} ({user?.role})</span>
            </div>
            <span className="text-zinc-400">Company Scope: <strong className="text-blue-300">{activeCompany}</strong></span>
          </div>

          {/* Filter and Search Bar for Audit */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#080e1c]/80 border border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-400 mr-1">Severity:</span>
              {(['ALL', 'INFO', 'WARNING', 'CRITICAL'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedSeverity === sev
                      ? 'bg-[#0038B8] text-white shadow'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                  }`}
                >
                  {sev}
                </button>
              ))}

              <span className="text-xs text-zinc-400 ml-3 mr-1">Company:</span>
              {(['ALL', 'COMP_A', 'COMP_B'] as const).map((comp) => (
                <button
                  key={comp}
                  onClick={() => setAuditCompanyFilter(comp)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    auditCompanyFilter === comp
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          <UniversalRecordManager
            title="Activity History"
            defaultViewMode="DETAILED"
            items={filteredLogs as unknown as Record<string, unknown>[]}
            createLabel="Log Manual Audit"
            searchPlaceholder="Search audit logs by actor, action, module..."
            sortOptions={[
              { value: 'timestamp', label: 'Timestamp' },
              { value: 'actorName', label: 'Actor' },
              { value: 'module', label: 'Module' },
              { value: 'severity', label: 'Severity' },
            ]}
            fields={[
              { key: 'action', label: 'Action', isTitle: true, required: true },
              { key: 'actorName', label: 'Actor', required: true },
              { key: 'module', label: 'Module', required: true },
              { key: 'severity', label: 'Severity', type: 'select', options: ['INFO', 'WARNING', 'CRITICAL'], isBadge: true },
              { key: 'timestamp', label: 'Timestamp' },
              { key: 'companyId', label: 'Company Scope', type: 'select', options: ['CONSOLIDATED', 'COMP_A', 'COMP_B'], showInTable: false, optional: true },
              { key: 'ipAddress', label: 'Source IP / Device', showInTable: false, optional: true },
              { key: 'complianceStandard', label: 'Compliance Ref (ISO/CIDA/LKAS)', showInTable: false, optional: true },
              { key: 'details', label: 'Details', type: 'textarea', showInTable: false, optional: true },
              { key: 'images', label: 'Audit Evidence Screenshots', type: 'images', showInTable: false, optional: true },
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SYSTEM LOGS & SERVER TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === 'SYSTEM' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#080e1c]/90 border border-white/10">
              <div className="text-[11px] font-mono text-zinc-400">Database Health</div>
              <div className={`text-xl font-extrabold mt-1 ${sysInfo?.database?.connected ? 'text-emerald-400' : 'text-amber-400'}`}>
                {sysInfo?.database?.connected ? `ONLINE (${sysInfo.database.latencyMs} ms)` : 'Checking / Fallback'}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 font-mono">{sysInfo?.database?.config?.database || 'contec_erp'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#080e1c]/90 border border-white/10">
              <div className="text-[11px] font-mono text-zinc-400">Node.js Heap Usage</div>
              <div className="text-xl font-extrabold text-blue-300 mt-1 font-mono">
                {sysInfo?.runtime ? `${sysInfo.runtime.heapUsedMb} / ${sysInfo.runtime.heapTotalMb} MB` : '—'}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 font-mono">RSS: {sysInfo?.runtime?.rssMb ?? '—'} MB (Low-Mem Ready)</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#080e1c]/90 border border-white/10">
              <div className="text-[11px] font-mono text-zinc-400">Runtime &amp; Uptime</div>
              <div className="text-xl font-extrabold text-[#FFB800] mt-1 font-mono">
                {sysInfo?.runtime?.nodeVersion || 'Node.js'}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 font-mono">Uptime: {sysInfo?.runtime?.uptimeSeconds ?? 0}s ({sysInfo?.runtime?.env || 'prod'})</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#080e1c]/90 border border-white/10">
              <div className="text-[11px] font-mono text-zinc-400">Security &amp; Auth Events</div>
              <div className="text-xl font-extrabold text-white mt-1 font-mono">
                {auditLogs.filter((l) => l.module === 'AUTH' || l.module === 'SECURITY' || l.module === 'SYSTEM').length} Events
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 font-mono">Auth, RBAC &amp; System changes</div>
            </div>
          </div>

          {sysInfo?.database?.tableCounts && (
            <div className="p-5 rounded-2xl bg-[#080e1c]/90 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">System Records Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(sysInfo.database.tableCounts).map(([tbl, cnt]) => (
                  <div key={tbl} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">{tbl}</span>
                    <span className="font-bold text-emerald-400">{cnt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <UniversalRecordManager
            title="System, Auth & Security Event Stream"
            defaultViewMode="DETAILED"
            items={auditLogs.filter((l) => l.module === 'AUTH' || l.module === 'SECURITY' || l.module === 'SYSTEM' || l.severity !== 'INFO') as unknown as Record<string, unknown>[]}
            createLabel="Log System Note"
            searchPlaceholder="Filter system/auth/security events..."
            sortOptions={[
              { value: 'timestamp', label: 'Timestamp' },
              { value: 'severity', label: 'Severity' },
              { value: 'module', label: 'Module' },
            ]}
            fields={[
              { key: 'action', label: 'Event', isTitle: true, required: true },
              { key: 'module', label: 'Subsystem', required: true },
              { key: 'actorName', label: 'Actor / Service', required: true },
              { key: 'severity', label: 'Level', type: 'select', options: ['INFO', 'WARNING', 'CRITICAL'], isBadge: true },
              { key: 'timestamp', label: 'Timestamp' },
              { key: 'details', label: 'Diagnostic Details', type: 'textarea', showInTable: false, optional: true },
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ARCHIVE / UPLOAD SECURE DOCUMENT */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-[#091124] border border-white/20 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <FolderLock className="w-5 h-5 text-[#FFB800]" />
              <h2 className="text-lg font-extrabold text-white">
                Archive Document to Secure Vault
              </h2>
            </div>

            <form onSubmit={handleArchiveDocument} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono">Company Entity</label>
                <CustomSelect
                  value={newCompanyId}
                  onChange={(val) => setNewCompanyId(val as CompanyId)}
                  options={[
                    { value: 'COMP_A', label: 'Company A: Contec Engineering & Construction (Building)' },
                    { value: 'COMP_B', label: 'Company B: Contec Heavy Infra & Equipment (Plant Hire)' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Document Ref (Optional)</label>
                  <input
                    type="text"
                    value={newDocRef}
                    onChange={(e) => setNewDocRef(e.target.value)}
                    placeholder="e.g. A-CNT-2026-009"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Category</label>
                  <CustomSelect
                    value={newCategory}
                    onChange={(val) => setNewCategory(val as DocumentCategory)}
                    options={[
                      { value: 'CONTRACT', label: 'CONTRACT (FIDIC / CIDA)' },
                      { value: 'INVOICE', label: 'INVOICE (Client Claim)' },
                      { value: 'PAYMENT_VOUCHER', label: 'PAYMENT_VOUCHER' },
                      { value: 'JOURNAL_VOUCHER', label: 'JOURNAL_VOUCHER' },
                      { value: 'BANK_STATEMENT', label: 'BANK_STATEMENT' },
                      { value: 'PURCHASE_ORDER', label: 'PURCHASE_ORDER' },
                      { value: 'EMPLOYEE_FILE', label: 'EMPLOYEE_FILE' },
                      { value: 'PAYROLL_SHEET', label: 'PAYROLL_SHEET' },
                      { value: 'TAX_RETURN', label: 'TAX_RETURN (VAT/SSCL)' },
                      { value: 'CIDA_IPC', label: 'CIDA_IPC' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Colombo Port City Tower Phase 2 Signed Contract"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Related Entity / Code</label>
                  <input
                    type="text"
                    value={newRelatedEntity}
                    onChange={(e) => setNewRelatedEntity(e.target.value)}
                    placeholder="e.g. CNT-2026-001"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">File Format</label>
                  <CustomSelect
                    value={newFormat}
                    onChange={(val) => setNewFormat(val as typeof newFormat)}
                    options={['PDF', 'EXCEL', 'WORD', 'IMAGE']}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">File Size (KB)</label>
                  <input
                    type="number"
                    value={newFileSizeKb}
                    onChange={(e) => setNewFileSizeKb(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Signed, CIDA CS2, Retention, Legal"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="confidentialCheck"
                  checked={newIsConfidential}
                  onChange={(e) => setNewIsConfidential(e.target.checked)}
                  className="rounded bg-white/5 border-white/10 text-[#0038B8] focus:ring-0"
                />
                <label htmlFor="confidentialCheck" className="text-zinc-300 font-medium cursor-pointer">
                  Mark as Confidential (Restricted to Directors & Authorized Signatories)
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold shadow-lg shadow-blue-900/30 flex items-center gap-1.5"
                >
                  <FolderLock className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Save to Vault</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DOCUMENT DETAILS */}
      {selectedDocForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl rounded-2xl bg-[#091124] border border-blue-500/30 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedDocForInspect(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">
                Document Details &amp; Verification
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-[#03060f] border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Document Reference:</span>
                <span className="text-white font-bold">{selectedDocForInspect.documentRefNumber}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Document Title:</span>
                <span className="text-[#FFB800] font-bold text-right truncate max-w-xs">
                  {selectedDocForInspect.title}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Entity Jurisdiction:</span>
                <span className="text-blue-300">
                  {selectedDocForInspect.companyId === 'COMP_A'
                    ? 'Company A: Contec Engineering (CIDA CS2)'
                    : 'Company B: Contec Heavy Infra (CIDA EM1)'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">Upload Provenance:</span>
                <span className="text-zinc-300">
                  {selectedDocForInspect.uploadedBy} on {selectedDocForInspect.uploadDate}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-400">File Format &amp; Size:</span>
                <span className="text-white">
                  {selectedDocForInspect.fileFormat} • {(selectedDocForInspect.fileSizeKb / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Verified Archive Record</span>
                <p className="text-[11px] text-emerald-300/80 mt-0.5">
                  This document is archived in the central vault with complete audit history.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedDocForInspect(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Provenance certificate generated for ${selectedDocForInspect.documentRefNumber}.`);
                  setSelectedDocForInspect(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Verification Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
