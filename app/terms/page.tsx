"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Scale, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TermsOfServicePage() {
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
            Contractual Framework
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight leading-tight mb-4">
            Terms of <span className="gradient-text-gold">Service</span>
          </h1>

          <p className="text-zinc-400 text-sm mb-10">
            Last Updated: November 24, 2026 • Formulated under CIDA / ICTAD Standard Bidding Document Framework
          </p>

          <div className="space-y-10 text-zinc-300 text-sm sm:text-base leading-relaxed">
            {/* Agreement */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <Scale className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  1. Scope of Engagement
                </h2>
              </div>
              <p className="text-zinc-300 leading-relaxed mb-3">
                These Terms of Service govern all architectural design proposals, Bills of Quantities (BOQ), structural consulting agreements, and turnkey construction contracts executed by CONTEC Design & Build (Pvt) Ltd.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                By commissioning architectural concepts or signing a Construction Agreement with CONTEC, the client agrees to these terms alongside project-specific contractual annexures.
              </p>
            </div>

            {/* Architectural & Engineering Approvals */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <Award className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  2. Design Iterations & Client Sign-Off
                </h2>
              </div>
              <ul className="space-y-3 list-disc list-inside text-zinc-300">
                <li><strong className="text-white">Concept Phase:</strong> Includes up to three comprehensive 3D visual concept iterations prior to preliminary architectural sign-off.</li>
                <li><strong className="text-white">Detailed Engineering:</strong> Once structural calculations and municipal drawings are finalized and certified by chartered structural engineers, alterations are treated as scope variations.</li>
                <li><strong className="text-white">Statutory Approvals:</strong> While CONTEC coordinates municipal, environmental, and UDA approvals, approval timelines remain subject to local governmental processing.</li>
              </ul>
            </div>

            {/* Construction Protocols & Variations */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 mb-4 text-[#FFB800]">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                  3. Variations & Milestone Execution
                </h2>
              </div>
              <p className="mb-4">
                Construction progresses strictly in structured milestones as agreed in the contract BOQ schedule:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {[
                  "Milestone 01: Subterranean Earthworks & Piling Foundations",
                  "Milestone 02: Reinforced Concrete Substructure & Core Framing",
                  "Milestone 03: Precision Pre-Fabrication & Roof Envelope",
                  "Milestone 04: Mechanical, Electrical & Plumbing (MEP) Rough-Ins",
                  "Milestone 05: Luxury Architectural Finishes & Joinery Handover",
                  "Milestone 06: Final Inspection, Commissioning & Key Handover"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-zinc-400">
                * Any client-requested structural or material modifications are formally estimated as Variation Orders (VO) and require mutual written endorsement prior to site execution.
              </p>
            </div>

            {/* Defect Liability & Guarantees */}
            <div className="bg-[#080e1c]/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mb-4 text-[#FFB800]">
                4. Defects Liability Period & Structural Warranties
              </h2>
              <div className="space-y-3 text-zinc-300">
                <p>
                  <strong className="text-white">12-Month Defects Liability:</strong> CONTEC maintains a mandatory 12-month Defects Liability Period (DLP) following practical completion, rectifying any latent workmanship defects at our expense.
                </p>
                <p>
                  <strong className="text-white">Long-Term Structural Warranty:</strong> Reinforced concrete structural elements and certified mass-timber frameworks carry a comprehensive 10 to 25-year structural integrity guarantee.
                </p>
                <p>
                  <strong className="text-white">Waterproofing & Roof Membranes:</strong> High-performance torch-on bituminous and elastomeric waterproofing carry a 10-year manufacturer-backed leak-free guarantee.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="bg-[#0038B8]/15 border border-[#0038B8]/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              <h3 className="text-base sm:text-lg font-bold text-white uppercase mb-2">
                Governing Law & Dispute Resolution
              </h3>
              <p className="text-zinc-300 text-sm">
                These terms and any disputes arising under building contracts are governed exclusively by the Laws of Sri Lanka, with resolution conducted through amicable mediation or arbitration under the Rules of the Sri Lanka Institute of Architects (SLIA) and CIDA.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
