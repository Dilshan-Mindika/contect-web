"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatLKR, formatLKRFull } from '@/lib/erp/currency';
import {
  Printer,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Save,
  Plus,
  Trash2,
  ArrowRightLeft,
  X,
} from 'lucide-react';

export interface StudioLineItem {
  code?: string;
  description: string;
  unit?: string;
  quantity: number;
  unitPrice: number;
}

export interface StudioDocumentData {
  id: string;
  mode: 'QUOTATION' | 'INVOICE';
  docNumber: string;
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  projectTitle: string;
  issueDate: string;
  dueDate: string;
  status: string;
  items: StudioLineItem[];
  fallbackSubtotal: number;
  terms?: string;
}

interface TemplateConfig {
  docTitle: string;
  companyName: string;
  addressLine: string;
  cidaSeal: string;
  accentColor: string;
  watermark: string;
  showLogo: boolean;
  showCodeCol: boolean;
  showUnitCol: boolean;
  showSignatories: boolean;
  vatPct: number;
  ssclPct: number;
  retentionPct: number;
  discountPct: number;
  whtPct: number;
  bankDetails: string;
  footerTerms: string;
  signatoryLeft: string;
  signatoryRight: string;
}

const ACCENT_PRESETS = [
  { label: 'Royal Navy', color: '#0038B8' },
  { label: 'Executive Gold', color: '#D97706' },
  { label: 'Emerald', color: '#059669' },
  { label: 'Slate Minimal', color: '#334155' },
];

interface Props {
  doc: StudioDocumentData;
  onClose: () => void;
  onSendEmail?: (id: string) => Promise<{ success: boolean; simulated?: boolean; message?: string }>;
  onConvertToInvoice?: (doc: StudioDocumentData, computedTotal: number) => void;
}

export default function DocumentStudioModal({ doc, onClose, onSendEmail, onConvertToInvoice }: Props) {
  const storageKey = `contec_doc_tpl_${doc.mode.toLowerCase()}`;

  const defaultConfig: TemplateConfig = {
    docTitle: doc.mode === 'QUOTATION' ? 'FIXED-PRICE BOQ QUOTATION' : 'TAX INVOICE / INTERIM CERTIFICATE',
    companyName: 'CONTEC Design & Build (Pvt) Ltd. • EPC & Heavy Civil Engineering',
    addressLine: 'No. 167, George E. De Silva Mawatha, Kandy 20000, Sri Lanka • +94 77 781 2141',
    cidaSeal: 'CIDA CS2/2026/0411 • TIN: 104009821 • VAT: 104009821-7000',
    accentColor: '#0038B8',
    watermark: doc.status === 'DRAFT' ? 'DRAFT' : 'ORIGINAL',
    showLogo: true,
    showCodeCol: true,
    showUnitCol: true,
    showSignatories: true,
    vatPct: 18,
    ssclPct: 2.5,
    retentionPct: 5,
    discountPct: 0,
    whtPct: 0,
    bankDetails: 'Bank of Ceylon (Kandy Super Grade) • A/C: 0078941205 • SWIFT: BCEYLKLX',
    footerTerms:
      doc.terms ||
      '1. All rates are in LKR per CESMM4 / SLS 573 standards. 2. Statutory 18% VAT & 2.5% SSCL applied per Sri Lankan tax law. 3. 5% Defect Liability Retention held for 12 months.',
    signatoryLeft: 'Authorized Signatory (CONTEC Director / QS)',
    signatoryRight: 'Client / Employer Acceptance & Official Stamp',
  };

  const [cfg, setCfg] = useState<TemplateConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
      } catch {
        // ignore
      }
    }
    return defaultConfig;
  });

  const [showCustomizer, setShowCustomizer] = useState(true);
  const [lineItems, setLineItems] = useState<StudioLineItem[]>(
    doc.items && doc.items.length > 0
      ? doc.items
      : [
          {
            code: 'BOQ-01',
            description: doc.projectTitle || 'Civil & Structural Engineering Works',
            unit: 'Lump Sum',
            quantity: 1,
            unitPrice: doc.fallbackSubtotal || 0,
          },
        ]
  );

  const [emailSending, setEmailSending] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (doc.items && doc.items.length > 0) setLineItems(doc.items);
  }, [doc]);

  const subtotal = lineItems.reduce((acc, it) => acc + Number(it.quantity || 0) * Number(it.unitPrice || 0), 0);
  const discountAmt = Math.round(subtotal * (cfg.discountPct / 100));
  const netAfterDiscount = Math.max(0, subtotal - discountAmt);
  const retentionAmt = Math.round(netAfterDiscount * (cfg.retentionPct / 100));
  const ssclAmt = Math.round(netAfterDiscount * (cfg.ssclPct / 100));
  const vatAmt = Math.round((netAfterDiscount + ssclAmt) * (cfg.vatPct / 100));
  const whtAmt = Math.round(netAfterDiscount * (cfg.whtPct / 100));
  const grandTotal = netAfterDiscount + ssclAmt + vatAmt - retentionAmt - whtAmt;

  const savePreset = () => {
    localStorage.setItem(storageKey, JSON.stringify(cfg));
    setNotice({ ok: true, text: `Saved "${doc.mode}" template preset for future documents.` });
  };

  const handleEmail = async () => {
    if (!onSendEmail) return;
    setEmailSending(true);
    setNotice(null);
    const res = await onSendEmail(doc.id);
    setEmailSending(false);
    setNotice({
      ok: res.success,
      text: res.success
        ? res.simulated
          ? `Document queued & simulated in LKR to ${doc.clientEmail || doc.clientName}`
          : `Document dispatched to ${doc.clientEmail || doc.clientName}`
        : res.message || 'Email dispatch failed',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-6xl bg-[#070d1d] border border-white/20 rounded-2xl shadow-2xl overflow-hidden my-auto text-[#f4f4f7]">
        {/* Top Action Toolbar */}
        <div className="p-3.5 bg-[#091329] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FFB800]" />
            <span className="font-bold text-sm text-white">Document Studio &amp; Customizer</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {doc.docNumber}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCustomizer((v) => !v)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>{showCustomizer ? 'Hide Customizer' : 'Customize Layout & Taxes'}</span>
            </button>

            <button
              type="button"
              onClick={savePreset}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preset</span>
            </button>

            {doc.mode === 'QUOTATION' && onConvertToInvoice && (
              <button
                type="button"
                onClick={() => onConvertToInvoice(doc, grandTotal)}
                className="px-3 py-1.5 rounded-xl bg-amber-600/25 hover:bg-amber-600/40 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Convert to Invoice</span>
              </button>
            )}

            {onSendEmail && doc.clientEmail && (
              <button
                type="button"
                onClick={handleEmail}
                disabled={emailSending}
                className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Mail className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>{emailSending ? 'Sending...' : 'Email'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-[#0038B8] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {notice && (
          <div
            className={`px-4 py-2.5 text-xs flex items-center gap-2 print:hidden ${
              notice.ok ? 'bg-emerald-950/60 text-emerald-200 border-b border-emerald-500/30' : 'bg-red-950/60 text-red-200 border-b border-red-500/30'
            }`}
          >
            {notice.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{notice.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto print:block print:max-h-none">
          {/* LEFT CUSTOMIZER PANEL */}
          {showCustomizer && (
            <div className="lg:col-span-4 p-4 bg-[#081024] border-r border-white/10 space-y-4 text-xs print:hidden">
              <div className="font-bold text-[#FFB800] uppercase tracking-wider text-[11px]">
                Customize Template &amp; Taxes
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-zinc-400 mb-1">Document Heading</label>
                  <input
                    type="text"
                    value={cfg.docTitle}
                    onChange={(e) => setCfg({ ...cfg, docTitle: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Company / Entity Header</label>
                  <input
                    type="text"
                    value={cfg.companyName}
                    onChange={(e) => setCfg({ ...cfg, companyName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">CIDA / Tax Registration Line</label>
                  <input
                    type="text"
                    value={cfg.cidaSeal}
                    onChange={(e) => setCfg({ ...cfg, cidaSeal: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Watermark Stamp</label>
                  <input
                    type="text"
                    placeholder="e.g. ORIGINAL, DRAFT, CERTIFIED"
                    value={cfg.watermark}
                    onChange={(e) => setCfg({ ...cfg, watermark: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Accent Theme Color</label>
                  <div className="flex items-center gap-2">
                    {ACCENT_PRESETS.map((p) => (
                      <button
                        key={p.color}
                        type="button"
                        onClick={() => setCfg({ ...cfg, accentColor: p.color })}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                          cfg.accentColor === p.color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: p.color }}
                        title={p.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Tax & Deductions */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-[10px] text-zinc-400">VAT %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={cfg.vatPct}
                    onChange={(e) => setCfg({ ...cfg, vatPct: Number(e.target.value) })}
                    className="w-full px-2 py-1 rounded bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400">SSCL %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={cfg.ssclPct}
                    onChange={(e) => setCfg({ ...cfg, ssclPct: Number(e.target.value) })}
                    className="w-full px-2 py-1 rounded bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400">Retention %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={cfg.retentionPct}
                    onChange={(e) => setCfg({ ...cfg, retentionPct: Number(e.target.value) })}
                    className="w-full px-2 py-1 rounded bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400">Discount %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={cfg.discountPct}
                    onChange={(e) => setCfg({ ...cfg, discountPct: Number(e.target.value) })}
                    className="w-full px-2 py-1 rounded bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400">WHT %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={cfg.whtPct}
                    onChange={(e) => setCfg({ ...cfg, whtPct: Number(e.target.value) })}
                    className="w-full px-2 py-1 rounded bg-white/5 border border-white/15 text-white font-mono"
                  />
                </div>
              </div>

              {/* Column & Block Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                {[
                  { key: 'showLogo', label: 'Show Logo' },
                  { key: 'showCodeCol', label: 'Item Code Col' },
                  { key: 'showUnitCol', label: 'Unit Col' },
                  { key: 'showSignatories', label: 'Signatory Matrix' },
                ].map((t) => (
                  <label key={t.key} className="flex items-center gap-2 cursor-pointer text-[11px] text-zinc-300">
                    <input
                      type="checkbox"
                      checked={Boolean(cfg[t.key as keyof TemplateConfig])}
                      onChange={(e) => setCfg({ ...cfg, [t.key]: e.target.checked })}
                      className="accent-[#0038B8]"
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>

              {/* Line Items Editor */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-300">Line Items ({lineItems.length})</span>
                  <button
                    type="button"
                    onClick={() =>
                      setLineItems([
                        ...lineItems,
                        { code: `ITEM-${lineItems.length + 1}`, description: 'Additional Civil Works', unit: 'Nos', quantity: 1, unitPrice: 50000 },
                      ])
                    }
                    className="px-2 py-1 rounded bg-blue-600/30 text-blue-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Line
                  </button>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {lineItems.map((it, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={it.description}
                          onChange={(e) => {
                            const next = [...lineItems];
                            next[idx] = { ...next[idx], description: e.target.value };
                            setLineItems(next);
                          }}
                          className="flex-1 px-2 py-1 rounded bg-black/30 text-[11px] text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))}
                          className="p-1 text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <input
                          type="text"
                          value={it.unit || 'Lot'}
                          onChange={(e) => {
                            const next = [...lineItems];
                            next[idx] = { ...next[idx], unit: e.target.value };
                            setLineItems(next);
                          }}
                          placeholder="Unit"
                          className="px-2 py-1 rounded bg-black/30 text-[10px] text-zinc-300"
                        />
                        <input
                          type="number"
                          value={it.quantity}
                          onChange={(e) => {
                            const next = [...lineItems];
                            next[idx] = { ...next[idx], quantity: Number(e.target.value) };
                            setLineItems(next);
                          }}
                          placeholder="Qty"
                          className="px-2 py-1 rounded bg-black/30 text-[10px] text-white font-mono"
                        />
                        <input
                          type="number"
                          value={it.unitPrice}
                          onChange={(e) => {
                            const next = [...lineItems];
                            next[idx] = { ...next[idx], unitPrice: Number(e.target.value) };
                            setLineItems(next);
                          }}
                          placeholder="Rate"
                          className="px-2 py-1 rounded bg-black/30 text-[10px] text-[#FFB800] font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Bank &amp; Remittance Details</label>
                <input
                  type="text"
                  value={cfg.bankDetails}
                  onChange={(e) => setCfg({ ...cfg, bankDetails: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Footer Terms &amp; Notes</label>
                <textarea
                  rows={2}
                  value={cfg.footerTerms}
                  onChange={(e) => setCfg({ ...cfg, footerTerms: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white"
                />
              </div>
            </div>
          )}

          {/* RIGHT LIVE A4 PREVIEW */}
          <div className={`${showCustomizer ? 'lg:col-span-8' : 'lg:col-span-12'} p-5 sm:p-8 bg-white text-zinc-900 relative overflow-hidden`}>
            {cfg.watermark && (
              <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center opacity-[0.04] text-7xl font-black tracking-widest -rotate-12">
                {cfg.watermark}
              </div>
            )}

            <div className="relative z-10 space-y-6">
              {/* Letterhead */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b-4" style={{ borderColor: cfg.accentColor }}>
                <div>
                  {cfg.showLogo && (
                    <div className="relative h-10 w-44 mb-2 bg-zinc-950 rounded-lg px-2 py-1">
                      <Image src="/branding/logo nav.png" alt="CONTEC" fill className="object-contain p-1" unoptimized />
                    </div>
                  )}
                  <div className="text-sm font-bold text-zinc-900">{cfg.companyName}</div>
                  <div className="text-[11px] font-mono font-bold mt-0.5" style={{ color: cfg.accentColor }}>{cfg.cidaSeal}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{cfg.addressLine}</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl font-black uppercase tracking-tight" style={{ color: cfg.accentColor }}>
                    {cfg.docTitle}
                  </div>
                  <div className="text-xs font-mono font-bold text-zinc-700 mt-1">Ref #: {doc.docNumber}</div>
                  <div className="text-[11px] font-mono text-zinc-500">Issued: {doc.issueDate} • Valid/Due: {doc.dueDate}</div>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-100 text-zinc-800 border border-zinc-300">
                    STATUS: {doc.status}
                  </span>
                </div>
              </div>

              {/* Client & Project Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                <div>
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Billed / Addressed To</div>
                  <div className="font-bold text-zinc-900 text-sm mt-0.5">{doc.clientCompany || doc.clientName}</div>
                  {doc.clientCompany && <div className="text-zinc-600">Attn: {doc.clientName}</div>}
                  {doc.clientEmail && <div className="text-zinc-500 font-mono text-[11px]">{doc.clientEmail}</div>}
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Project / Scope</div>
                  <div className="font-bold text-zinc-900 text-sm mt-0.5">{doc.projectTitle}</div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5">Currency: Sri Lankan Rupees (LKR)</div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="text-white font-mono text-[10px] uppercase" style={{ backgroundColor: cfg.accentColor }}>
                    <tr>
                      {cfg.showCodeCol && <th className="p-2.5">Code</th>}
                      <th className="p-2.5">Description</th>
                      {cfg.showUnitCol && <th className="p-2.5 text-center">Unit</th>}
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">Rate (LKR)</th>
                      <th className="p-2.5 text-right">Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {lineItems.map((it, idx) => (
                      <tr key={idx}>
                        {cfg.showCodeCol && <td className="p-2.5 font-mono text-zinc-500">{it.code || `0${idx + 1}`}</td>}
                        <td className="p-2.5 font-medium text-zinc-900">{it.description}</td>
                        {cfg.showUnitCol && <td className="p-2.5 text-center text-zinc-600">{it.unit || 'Lot'}</td>}
                        <td className="p-2.5 text-right font-mono">{it.quantity}</td>
                        <td className="p-2.5 text-right font-mono">{formatLKR(it.unitPrice)}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-zinc-900">
                          {formatLKR(it.quantity * it.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="flex justify-end">
                <div className="w-full sm:w-80 space-y-1.5 text-xs font-mono bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Subtotal Works:</span>
                    <span className="font-bold">{formatLKR(subtotal)}</span>
                  </div>
                  {cfg.discountPct > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({cfg.discountPct}%):</span>
                      <span>-{formatLKR(discountAmt)}</span>
                    </div>
                  )}
                  {cfg.ssclPct > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-600">SSCL Levy ({cfg.ssclPct}%):</span>
                      <span>+{formatLKR(ssclAmt)}</span>
                    </div>
                  )}
                  {cfg.vatPct > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-600">VAT ({cfg.vatPct}%):</span>
                      <span>+{formatLKR(vatAmt)}</span>
                    </div>
                  )}
                  {cfg.retentionPct > 0 && (
                    <div className="flex justify-between text-red-700">
                      <span>Less Retention ({cfg.retentionPct}%):</span>
                      <span>-{formatLKR(retentionAmt)}</span>
                    </div>
                  )}
                  {cfg.whtPct > 0 && (
                    <div className="flex justify-between text-red-700">
                      <span>Less WHT ({cfg.whtPct}%):</span>
                      <span>-{formatLKR(whtAmt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t-2 border-zinc-800 text-sm font-black" style={{ color: cfg.accentColor }}>
                    <span>NET PAYABLE:</span>
                    <span>{formatLKRFull(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Bank & Terms */}
              <div className="text-[11px] text-zinc-600 space-y-1.5 pt-3 border-t border-zinc-200">
                <div><strong>Bank Remittance:</strong> {cfg.bankDetails}</div>
                <div><strong>Terms &amp; Conditions:</strong> {cfg.footerTerms}</div>
              </div>

              {/* Signatories */}
              {cfg.showSignatories && (
                <div className="grid grid-cols-2 gap-8 pt-8 text-[11px] font-mono text-zinc-700">
                  <div>
                    <div className="border-t border-zinc-400 pt-1.5 font-bold">{cfg.signatoryLeft}</div>
                  </div>
                  <div>
                    <div className="border-t border-zinc-400 pt-1.5 font-bold">{cfg.signatoryRight}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
