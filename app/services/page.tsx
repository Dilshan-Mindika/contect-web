"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SERVICES = [
  {
    id: "design-build",
    badge: "STAGE 01",
    title: "Architectural Design & 3D House Plans",
    desc: "Custom floor plans, photorealistic 3D views, land survey checks, and government municipal council approvals. We design living spaces tailored to Sri Lanka's tropical climate and hillside landscapes.",
    image: "/images/hero-main.jpg",
    features: [
      "Photorealistic 3D Exterior & Interior Designs",
      "Hillside Land & Slope Stability Planning",
      "Municipal Council & Government Approvals",
      "Natural Sunlight & Cross-Ventilation Planning",
    ],
  },
  {
    id: "construction",
    badge: "STAGE 02",
    title: "Turnkey House & Commercial Construction",
    desc: "Complete building construction from foundation to final key handover. Built with certified structural engineering, high-strength steel reinforcement, premium grade concrete, and skilled craftsmanship.",
    image: "/images/craftsmanship-detail.jpg",
    features: [
      "Custom Hillside Villas & Luxury Residences",
      "Commercial & Multi-Storey Buildings",
      "Guaranteed Fixed-Price & Timely Handover",
      "25-Year Structural Warranty on Foundations & Frames",
    ],
  },
  {
    id: "renovation",
    badge: "STAGE 03",
    title: "Home Renovation, Remodeling & Extensions",
    desc: "Transforming existing properties into beautiful, functional spaces. We specialize in modern kitchens, designer bathrooms, structural wall changes, room extensions, and rooftop leisure terraces.",
    image: "/images/project-penthouse.jpg",
    features: [
      "Modern Kitchen & Luxury Bathroom Remodeling",
      "Room Additions & Upper-Floor Extensions",
      "Rooftop Terraces & Balconies",
      "Heritage Restorations & Modern Upgrades",
    ],
  },
  {
    id: "housemaster",
    badge: "STAGE 04",
    title: "House Master Kandy — Complete Home Care & Maintenance",
    desc: "Professional property care to keep your building leak-free and in top condition. Our qualified team handles roof waterproofing, damp proofing, electrical and plumbing repairs, exterior painting, and routine maintenance.",
    image: "/images/material-preview.jpg",
    features: [
      "Annual Roof & Leakage Diagnostic Inspections",
      "Advanced Roof Waterproofing & Damp Proofing",
      "Full Electrical, Plumbing & Water Systems Repair",
      "Weatherproof Exterior Painting & Wall Protection",
    ],
  },
  {
    id: "sustainable",
    badge: "STAGE 05",
    title: "Solar Power Systems & Hillside Retaining Walls",
    desc: "Rooftop solar electricity with battery backup, rainwater harvesting systems, and strong reinforced retaining walls engineered for heavy monsoon rains and lasting safety.",
    image: "/images/project-forest.jpg",
    features: [
      "Rooftop Solar & Hybrid Battery Backup",
      "Reinforced Retaining Walls & Slope Anchoring",
      "Rainwater Harvesting & Water Filtration",
      "Natural Airflow & Energy-Efficient Living",
    ],
  },
];

const FAQS = [
  {
    q: "How long does a complete building project take from start to finish?",
    a: "Depending on the size and terrain, most residential projects take between 7 and 12 months. Because we manage both architectural design and construction in-house, we eliminate common delays between separate architects and contractors.",
  },
  {
    q: "Can CONTEC build homes on steep hills and difficult lands?",
    a: "Yes. Building on slopes and hillsides is our specialty in Kandy. We design reinforced retaining walls and strong foundations that keep your home completely safe, stable, and protected from heavy monsoon rain and soil movement.",
  },
  {
    q: "What does solar power integration mean for my house?",
    a: "Our rooftop solar systems generate clean electricity to power your entire house, significantly reducing or even eliminating your monthly electricity bills. Surplus power can be fed back to the national grid.",
  },
  {
    q: "How does the fixed-price guarantee work?",
    a: "Once your design and Bill of Quantities (BOQ) are finalized, we sign a fixed-price contract. That means the price we agreed on is locked in, protecting you against unexpected price increases during construction.",
  },
];

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20">
        {/* Hero Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0038B8]/30 border border-[#0038B8]/60 text-[#FFB800] text-xs font-bold tracking-wider uppercase backdrop-blur-md mb-6 shadow-lg shadow-blue-950/40">
            CONTEC Design & Construction
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.98] max-w-4xl mb-8">
            <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">From Initial</span>{" "}
            <span className="gradient-text-gold">Ideas</span>{" "}
            <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">to Completed Buildings</span>
          </h1>

          <p className="text-zinc-300 text-lg sm:text-xl max-w-3xl leading-relaxed font-light mb-12">
            We are your complete construction partner across Sri Lanka — taking care of architectural design, structural engineering, government approvals, and full building construction under one roof.
          </p>

          {/* Quick Service Anchor Navigation */}
          <div className="flex flex-wrap gap-3">
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#0038B8]/15 hover:bg-[#0038B8]/30 border border-blue-500/20 text-zinc-200 hover:text-[#FFB800] transition-all"
              >
                {s.title.split("&")[0].split("—")[0]}
              </a>
            ))}
          </div>
        </section>

        {/* Detailed Service Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
          {SERVICES.map((service, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                id={service.id}
                key={service.id}
                className={`glass-panel rounded-3xl border border-white/15 bg-white/[0.02] p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row gap-10 items-center scroll-mt-28 hover:border-blue-500/30 transition-all ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image Showcase */}
                <div className="w-full lg:w-1/2 relative h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/15 shadow-xl group">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FFB800] text-black uppercase">
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#FFB800] tracking-wider uppercase mb-2 block">
                      Core Discipline
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase text-white mb-4 leading-tight">
                      {service.title}
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 font-normal">
                      {service.desc}
                    </p>

                    {/* Features Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {service.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2.5 text-xs text-zinc-200">
                          <span className="w-4 h-4 rounded-full bg-[#0038B8]/30 text-[#FFB800] flex items-center justify-center font-bold text-[10px] shrink-0 border border-[#0038B8]/50">
                            ✓
                          </span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                    <Link
                      href="/contact"
                      className="px-6 py-2.5 rounded-full bg-[#FFB800] hover:bg-[#F59E0B] text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/10"
                    >
                      Inquire About This Service ↗
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* 4-Step Process Walkthrough */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-[#FFB800] tracking-widest mb-3">Our Work Process</h2>
            <p className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              The 4-Step Construction Journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "First Meeting & Site Visit",
                desc: "We visit your land, inspect the ground slope, and discuss your family's lifestyle, ideas, and budget.",
              },
              {
                step: "02",
                title: "3D Plans & Structural Design",
                desc: "Realistic 3D views, detailed floor plans, and engineer calculations for safety, natural light, and ventilation.",
              },
              {
                step: "03",
                title: "Clear Pricing & Approvals",
                desc: "A transparent itemized cost breakdown (BOQ) with fixed pricing, plus municipal council approvals.",
              },
              {
                step: "04",
                title: "Quality Construction & Handover",
                desc: "Professional on-site construction, regular progress updates, quality inspections, and key handover on time.",
              },
            ].map((phase, idx) => (
              <div
                key={phase.step}
                className="glass-panel p-6 rounded-3xl border border-white/15 bg-white/[0.02] relative flex flex-col justify-between hover:border-[#FFB800]/40 transition-colors"
              >
                <div>
                  <span className="text-3xl font-extrabold text-[#FFB800] font-mono mb-3 block">
                    {phase.step}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">{phase.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{phase.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-bold text-zinc-500">
                  Phase {idx + 1} of 4
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
          <div className="text-center mb-12">
            <h2 className="text-xs uppercase font-bold text-[#FFB800] tracking-widest mb-3">Frequently Asked Questions</h2>
            <p className="text-3xl font-extrabold uppercase tracking-tight text-white">
              Everything You Need to Know
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/15 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-blue-500/30"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-[#FFB800] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-[#FFB800] text-lg transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
