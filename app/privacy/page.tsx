"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            Legal & Data Governance
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight leading-tight mb-4">
            Privacy <span className="gradient-text-gold">Policy</span>
          </h1>

          <p className="text-zinc-400 text-sm mb-10">
            Last Updated: November 24, 2026 • Compliant with Sri Lanka Personal Data Protection Act (PDPA No. 9 of 2022)
          </p>

          <div className="space-y-10 text-zinc-300 text-sm sm:text-base leading-relaxed">
            {/* Overview */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <Shield className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  1. Our Commitment to Client Confidentiality
                </h2>
              </div>
              <p className="text-zinc-300">
                CONTEC Design & Build (Pvt) Ltd. (&ldquo;CONTEC&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) respects your privacy and is dedicated to protecting the personal data, architectural briefs, land ownership records, and financial investment parameters of our clients, homeowners, and commercial developers.
              </p>
            </div>

            {/* Information Collection */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <Eye className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  2. Information We Collect
                </h2>
              </div>
              <p className="mb-4">
                In the course of providing bespoke architectural design, structural engineering, BOQ estimation, and construction management, we collect:
              </p>
              <ul className="space-y-2.5 list-disc list-inside text-zinc-300">
                <li><strong className="text-white">Contact & Identity Details:</strong> Full name, national identity/passport number, phone number, email address, and billing coordinates.</li>
                <li><strong className="text-white">Property & Survey Records:</strong> Site survey plans, title deeds, land registry extracts, topographic contour maps, and municipal boundary approvals.</li>
                <li><strong className="text-white">Design & Engineering Data:</strong> Architectural briefs, 3D BIM models, soil testing reports, structural calculation sheets, and interior specification preferences.</li>
                <li><strong className="text-white">Financial & Payment Information:</strong> Payment remittance receipts, bank transaction confirmations, and mobilization advance reconciliations.</li>
              </ul>
            </div>

            {/* How We Use Your Data */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <FileText className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  3. Use of Information
                </h2>
              </div>
              <p className="mb-4">Collected information is strictly utilized to:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {[
                  "Prepare architectural plans & parametric 3D models",
                  "Procure municipal and Urban Development Authority (UDA) clearances",
                  "Formulate accurate Bills of Quantities (BOQ) and price quotations",
                  "Manage site logistics, material procurement, and labor teams",
                  "Issue progress certificates (IPC) and warranty handovers",
                  "Maintain regulatory compliance with CIDA and statutory audit standards"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Intellectual Property & Non-Disclosure */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <Lock className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  4. Non-Disclosure & Intellectual Property Protection
                </h2>
              </div>
              <p className="text-zinc-300 mb-3">
                All bespoke residence designs, floor plans, and proprietary engineering calculations produced by CONTEC are protected under international copyright and intellectual property conventions. We never sell, lease, or distribute private floor layouts or personal project photos without prior written client authorization.
              </p>
              <p className="text-zinc-300">
                High-net-worth residential and commercial portfolios are protected under strict Non-Disclosure Agreements (NDA) upon request.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-[#0038B8]/15 border border-[#0038B8]/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              <h3 className="text-base sm:text-lg font-bold text-white uppercase mb-2">
                Questions or Data Requests?
              </h3>
              <p className="text-zinc-300 text-sm mb-4">
                To inspect, update, or request the deletion of your personal records, contact our Legal & Compliance Desk:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-zinc-400 block">Direct Email:</span>
                  <a href="mailto:conteckandy@gmail.com" className="text-[#FFB800] font-semibold hover:underline">
                    conteckandy@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-zinc-400 block">Head Office:</span>
                  <span className="text-white font-medium">No. 167, George E. De Silva Mawatha, Kandy, Sri Lanka</span>
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
