"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ConstructionQuotation } from '@/lib/erp/types';
import { formatLKR } from '@/lib/erp/currency';
import {
  Printer,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award,
} from 'lucide-react';

interface Props {
  quotation: ConstructionQuotation;
  onClose: () => void;
  onSendEmail: (quotationId: string) => Promise<{ success: boolean; simulated?: boolean; message?: string }>;
}

export default function QuotationPDFModal({ quotation, onClose, onSendEmail }: Props) {
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ success: boolean; text: string } | null>(null);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDispatchEmail = async () => {
    setEmailSending(true);
    setEmailStatus(null);
    const res = await onSendEmail(quotation.id);
    setEmailSending(false);
    if (res.success) {
      setEmailStatus({
        success: true,
        text: res.simulated
          ? `Quotation email successfully queued & simulated in LKR to ${quotation.clientEmail}`
          : `Quotation email dispatched to ${quotation.clientEmail}`,
      });
    } else {
      setEmailStatus({
        success: false,
        text: res.message || 'Failed to dispatch email.',
      });
    }
  };

  const sscl = quotation.ssclTax || Math.round(quotation.subtotal * 0.025);
  const retention = quotation.retentionAmount || Math.round(quotation.subtotal * (quotation.retentionPct / 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container with Print isolation styles */}
      <div className="w-full max-w-4xl bg-[#070d1d] border border-white/20 rounded-2xl shadow-2xl overflow-hidden my-auto animate-fadeIn text-[#f4f4f7]">
        {/* Top Control Bar (Hidden during Print) */}
        <div className="p-4 bg-[#091329] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FFB800]" />
            <span className="font-bold text-sm text-white">
              Official Construction Tender & BOQ Document
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {quotation.quoteNumber}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 font-bold">
              CURRENCY: LKR
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDispatchEmail}
              disabled={emailSending}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Mail className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>{emailSending ? 'Dispatching...' : 'Email Client'}</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0038B8] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/40 border border-blue-400/40 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Print / Export PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-semibold"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Email status banner */}
        {emailStatus && (
          <div
            className={`p-3 text-xs flex items-center gap-2 print:hidden ${
              emailStatus.success
                ? 'bg-emerald-950/60 border-b border-emerald-500/30 text-emerald-200'
                : 'bg-red-950/60 border-b border-red-500/30 text-red-200'
            }`}
          >
            {emailStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{emailStatus.text}</span>
          </div>
        )}

        {/* PRINTABLE OFFICIAL CONSTRUCTION QUOTATION DOCUMENT */}
        <div id="printable-quotation" className="p-6 sm:p-10 bg-[#060a17] text-white space-y-8 font-sans print:p-0 print:bg-white print:text-black">
          {/* Header & Brand Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-[#FFB800] pb-6">
            <div>
              <div className="relative h-10 w-44 mb-2">
                <Image
                  src="/branding/logo nav.png"
                  alt="CONTEC Design & Build"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <p className="text-xs text-zinc-400 print:text-zinc-600 font-medium">
                CONTEC Design & Build (Pvt) Ltd. • EPC, Heavy Civil & High-Rise Engineering
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#FFB800] print:text-amber-800 font-mono font-bold mt-1">
                <Award className="w-3.5 h-3.5 inline" />
                <span>CIDA REGISTRATION: CS2/2026/0411 (HEAVY CIVIL & BUILDINGS)</span>
              </div>
              <p className="text-[11px] text-zinc-500 print:text-zinc-500 mt-1">
                Kandy Head Office: No. 167, George E. De Silva Mawatha, Kandy 20000, Sri Lanka
              </p>
              <p className="text-[11px] text-zinc-500 print:text-zinc-500">
                Direct: +94 77 781 2141 • Email: conteckandy@gmail.com • Web: contec.lk
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FFB800] print:text-amber-800 font-bold block">
                Official Bill of Quantities (BOQ) Tender
              </span>
              <div className="text-2xl font-extrabold font-mono text-white print:text-black">
                {quotation.quoteNumber}
              </div>
              <div className="text-xs text-zinc-400 print:text-zinc-600 font-mono">
                Date of Issue: {quotation.createdDate}
              </div>
              <div className="text-xs text-amber-400 print:text-amber-700 font-mono font-semibold">
                Tender Validity: Until {quotation.validUntil}
              </div>
              <div className="text-[11px] text-zinc-400 print:text-zinc-600 font-mono">
                Governing Law: FIDIC Red Book / CIDA SBD-02
              </div>
            </div>
          </div>

          {/* Client & Project Scope Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/10 print:border-zinc-300 print:bg-zinc-50 text-xs">
            <div>
              <span className="font-mono text-[10px] text-zinc-400 print:text-zinc-500 uppercase tracking-wider block mb-1">
                Client Organization / Employer
              </span>
              <div className="font-bold text-base text-white print:text-black">{quotation.clientCompany}</div>
              <div className="text-zinc-300 print:text-zinc-700">Attn: {quotation.clientName}</div>
              <div className="text-zinc-400 print:text-zinc-600 font-mono">{quotation.clientEmail}</div>
              <div className="text-[11px] text-zinc-400 print:text-zinc-500 mt-2">
                Currency of Contract: <span className="font-bold text-white print:text-black">Sri Lankan Rupees (LKR)</span>
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] text-zinc-400 print:text-zinc-500 uppercase tracking-wider block mb-1">
                Project Scope & Engineering Classification
              </span>
              <div className="font-bold text-sm text-[#FFB800] print:text-amber-800">{quotation.projectScope}</div>
              <div className="text-zinc-400 print:text-zinc-600 mt-1">
                Classification: {quotation.cidaGrading || 'CIDA Grade CS2 General Building'}
              </div>
              <div className="text-zinc-400 print:text-zinc-600">
                Retention Held: {quotation.retentionPct}% (12-24 Months Defects Liability Period)
              </div>
            </div>
          </div>

          {/* Itemized Bill of Quantities (BOQ) Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-300 print:text-zinc-800">
                Itemized Bill of Quantities (CESMM4 / SLS 573 Measurement)
              </h4>
              <span className="text-[10px] font-mono text-zinc-400 print:text-zinc-500 font-bold">
                All Rates in Sri Lankan Rupees (LKR)
              </span>
            </div>

            <div className="border border-white/15 print:border-zinc-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 print:bg-zinc-200 text-zinc-400 print:text-zinc-700 font-mono text-[10px] uppercase border-b border-white/10 print:border-zinc-300">
                  <tr>
                    <th className="py-2.5 px-3">Item #</th>
                    <th className="py-2.5 px-3">Section</th>
                    <th className="py-2.5 px-3">Scope Description</th>
                    <th className="py-2.5 px-3 text-right">Unit</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate (LKR)</th>
                    <th className="py-2.5 px-3 text-right">Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-zinc-200 text-zinc-300 print:text-zinc-800">
                  {quotation.boqItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-3 font-mono font-bold text-white print:text-black">{item.itemCode}</td>
                      <td className="py-3 px-3 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 print:bg-blue-100 print:text-blue-800 font-bold">
                          {item.section}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-white print:text-black max-w-xs">{item.description}</td>
                      <td className="py-3 px-3 text-right font-mono text-zinc-400 print:text-zinc-600">{item.unit}</td>
                      <td className="py-3 px-3 text-right font-mono">{item.quantity.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold">{formatLKR(item.unitRate)}</td>
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-white print:text-black">
                        {formatLKR(item.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Calculations & Financial Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-white/10 print:border-zinc-300">
            <div className="max-w-md text-xs space-y-2 text-zinc-400 print:text-zinc-600">
              <span className="font-mono text-[10px] text-zinc-400 print:text-zinc-500 uppercase font-bold block">
                Contractual Terms & Milestone Schedule
              </span>
              <p className="leading-relaxed text-[11px] bg-white/[0.02] print:bg-zinc-100 p-3 rounded-lg border border-white/5 print:border-zinc-200">
                {quotation.termsAndConditions}
              </p>
              <div className="text-[10px] text-zinc-500 print:text-zinc-500 font-mono">
                Bank Escrow: Commercial Bank of Ceylon PLC • Kandy Elite Branch • Account: 1000-8924-1100
              </div>
            </div>

            <div className="w-full sm:w-80 space-y-2 text-xs text-right">
              <div className="flex justify-between text-zinc-400 print:text-zinc-600">
                <span>BOQ Subtotal:</span>
                <span className="font-mono font-bold text-white print:text-black">
                  {formatLKR(quotation.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-blue-300 print:text-blue-800">
                <span>Social Security Levy (SSCL 2.5%):</span>
                <span className="font-mono font-bold">
                  +{formatLKR(sscl)}
                </span>
              </div>
              <div className="flex justify-between text-blue-300 print:text-blue-800">
                <span>Statutory VAT (18%):</span>
                <span className="font-mono font-bold">
                  +{formatLKR(quotation.taxVat)}
                </span>
              </div>
              <div className="flex justify-between text-amber-400 print:text-amber-800">
                <span>{quotation.retentionPct}% Defect Liability Retention:</span>
                <span className="font-mono">
                  ({formatLKR(retention)})
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-[#FFB800] text-base font-extrabold text-[#FFB800] print:text-black">
                <span>Total Tender Sum:</span>
                <span className="font-mono text-xl text-[#FFB800] print:text-amber-900">
                  {formatLKR(quotation.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Authorized Signatures Block */}
          <div className="pt-8 border-t border-white/15 print:border-zinc-300 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 print:text-zinc-500 uppercase block mb-6">
                Prepared By (Chief QS & Estimator):
              </span>
              <div className="border-t border-white/30 print:border-zinc-400 pt-1 font-semibold text-white print:text-black">
                Kavita Patel, MRICS
              </div>
              <div className="text-[11px] text-zinc-400 print:text-zinc-600">
                Chief Quantity Surveyor (CIDA Accredited)
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-400 print:text-zinc-500 uppercase block mb-6">
                Authorized By (Executive Board):
              </span>
              <div className="border-t border-white/30 print:border-zinc-400 pt-1 font-semibold text-white print:text-black">
                Eng. Elena Vance, C.Eng MIE-SL
              </div>
              <div className="text-[11px] text-zinc-400 print:text-zinc-600">
                Managing Director & Chartered Engineer
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-zinc-400 print:text-zinc-500 uppercase block mb-6">
                Employer Acceptance & Corporate Seal:
              </span>
              <div className="border-t border-white/30 print:border-zinc-400 pt-1 font-semibold text-white print:text-black">
                Authorized Signatory & Seal
              </div>
              <div className="text-[11px] text-zinc-400 print:text-zinc-600">
                Date: ________________________
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
