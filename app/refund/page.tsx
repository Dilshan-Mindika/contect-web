"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, RefreshCw, CreditCard, AlertCircle, FileCheck2 } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#FFB800] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Public Site</span>
          </Link>

          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0038B8]/30 border border-[#0038B8]/60 text-[#FFB800] text-xs font-bold tracking-wider uppercase backdrop-blur-md mb-4 shadow-lg shadow-blue-950/40">
            Payment Integrity & Financial Guarantee
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight leading-tight mb-4">
            Refund & <span className="gradient-text-gold">Payment Terms</span>
          </h1>

          <p className="text-zinc-400 text-sm mb-10">
            Last Updated: November 24, 2026 • Formulated under Construction Industry Development Authority (CIDA) Norms
          </p>

          <div className="space-y-10 text-zinc-300 text-sm sm:text-base leading-relaxed">
            {/* Principles */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <RefreshCw className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  1. Structured Payment Principles
                </h2>
              </div>
              <p className="text-zinc-300 mb-3">
                Due to the customized nature of luxury residential design, structural procurement, robotic pre-fabrication, and bespoke engineering, CONTEC operates under transparent milestone-based escrow reconciliations.
              </p>
              <p className="text-zinc-300">
                All client funds are tied directly to verified physical site progress and independently certified Interim Payment Certificates (IPC).
              </p>
            </div>

            {/* Design & Consultation Retainers */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <CreditCard className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  2. Architectural Retainers & Design Deposits
                </h2>
              </div>
              <ul className="space-y-3 list-disc list-inside text-zinc-300">
                <li>
                  <strong className="text-white">Pre-Design Consultation:</strong> Initial site visits and conceptual feasibility discussions are non-refundable once performed by our chartered architects.
                </li>
                <li>
                  <strong className="text-white">Preliminary Concept Phase:</strong> If a client terminates the engagement prior to the commencement of 3D modeling, 50% of the concept design retainer is refundable.
                </li>
                <li>
                  <strong className="text-white">Detailed Engineering Phase:</strong> Retainers become non-refundable once structural calculations, municipal approval drawings, and 3D BIM data have been completed.
                </li>
              </ul>
            </div>

            {/* Construction Mobilization & Stage Cancellations */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <FileCheck2 className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  3. Construction Mobilization Advance & Reconciliations
                </h2>
              </div>
              <p className="mb-4">
                Upon contract execution, client mobilization advances are protected through statutory bank guarantees:
              </p>
              <div className="space-y-3 text-zinc-300">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <h4 className="text-white font-bold text-sm mb-1">Pre-Mobilization Cancellation</h4>
                  <p className="text-xs text-zinc-400">
                    If construction is canceled prior to site clearing or material procurement, the advance is fully refunded minus documented architectural expenses.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <h4 className="text-white font-bold text-sm mb-1">Active Site Reconciliation</h4>
                  <p className="text-xs text-zinc-400">
                    If work is paused or halted by client notice during active construction, an independent Quantity Surveyor (QS) inspection determines the value of completed works and uninstalled materials on site. Any unused surplus funds are remitted to the client within 30 days.
                  </p>
                </div>
              </div>
            </div>

            {/* Retention Money Guarantee */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <AlertCircle className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  4. Retention Fund Release Protocols
                </h2>
              </div>
              <p className="text-zinc-300 leading-relaxed mb-3">
                In adherence to CIDA CS2 guidelines, a 5% to 10% retention is held on all interim progress payments to guarantee workmanship:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                <li>• <strong className="text-white">50% of Retention</strong> is refunded to the contractor upon Practical Completion and issuance of the Client Handover Certificate.</li>
                <li>• <strong className="text-white">Remaining 50%</strong> is released at the conclusion of the 12-Month Defects Liability Period following final rectification inspection.</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-[#0038B8]/15 border border-[#0038B8]/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              <h3 className="text-base sm:text-lg font-bold text-white uppercase mb-2">
                Finance & Contract Accounts
              </h3>
              <p className="text-zinc-300 text-sm mb-4">
                For milestone reconciliations or payment inquiries, reach our commercial department:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-zinc-400 block">Finance Email:</span>
                  <a href="mailto:conteckandy@gmail.com" className="text-[#FFB800] font-semibold hover:underline">
                    conteckandy@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-zinc-400 block">Commercial Desk:</span>
                  <span className="text-white font-medium">+94 77 781 2141 • Kandy Head Office</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
