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
    title: "Bespoke Architectural Design & 3D BIM Modeling",
    desc: "Computational architectural form-finding, 3D photorealistic renderings, terrain contour mapping, and local authority municipal approvals. We design living spaces harmonized with Sri Lanka's tropical climate and hillside landscapes.",
    image: "/images/hero-main.jpg",
    features: [
      "3D Photorealistic Architectural Visualization",
      "Hillside Terrain & Slope Stability Analysis",
      "Municipal Council & Planning Approvals",
      "Climate-Responsive Biophilic Layouts",
    ],
  },
  {
    id: "construction",
    badge: "STAGE 02",
    title: "Turnkey Residential & Commercial Construction",
    desc: "End-to-end building construction with certified structural engineering, high-tensile steel reinforcements, premium grade concrete, and master craftsmanship from foundation to final key handover.",
    image: "/images/craftsmanship-detail.jpg",
    features: [
      "Custom Hillside Villas & Luxury Residences",
      "Commercial & Mixed-Use Multi-Storey Buildings",
      "Fixed-Price & Guaranteed Timeline Delivery",
      "Comprehensive 20-Year Structural Integrity Warranty",
    ],
  },
  {
    id: "renovation",
    badge: "STAGE 03",
    title: "Luxury Renovation, Remodeling & Expansions",
    desc: "Transforming existing properties into modern architectural showpieces. We specialize in luxury kitchen modernizations, designer bathrooms, structural wall reconfigurations, room additions, and rooftop entertaining decks.",
    image: "/images/project-penthouse.jpg",
    features: [
      "Modern Kitchen & Luxury Bathroom Remodeling",
      "Structural Additions & Floor-Level Expansions",
      "Rooftop Terraces & Cantilevered Balconies",
      "Seamless Heritage & Contemporary Modern Restorations",
    ],
  },
  {
    id: "housemaster",
    badge: "STAGE 04",
    title: "House Master Kandy — Complete Property Care & Maintenance",
    desc: "Professional property care services ensuring long-term value and durability. Our certified technicians handle routine structural inspections, roof waterproofing, electrical & plumbing overhauls, exterior protective coatings, and landscaping.",
    image: "/images/material-preview.jpg",
    features: [
      "Annual Structural & Leakage Diagnostic Audits",
      "Advanced Roof Waterproofing & Damp Proofing",
      "Full Electrical, Plumbing & HVAC Maintenance",
      "Weatherproof Exterior Painting & Landscape Architecture",
    ],
  },
  {
    id: "sustainable",
    badge: "STAGE 05",
    title: "Solar Microgrids, Hillside Foundations & Sustainable Living",
    desc: "High-capacity rooftop solar power integration with battery storage, rainwater harvesting systems, and reinforced hillside retaining structures engineered for heavy monsoon rains and century durability.",
    image: "/images/project-forest.jpg",
    features: [
      "Rooftop Solar & Hybrid Battery Microgrids",
      "Reinforced Retaining Walls & Soil Anchoring",
      "Rainwater Harvesting & Filtration Networks",
      "Passive Natural Ventilation & Thermal Comfort",
    ],
  },
];

const FAQS = [
  {
    q: "How long does a full bespoke architectural build take from concept to handover?",
    a: "Because 75% of the structural pod is pre-fabricated using automated CNC robotic systems off-site while foundation works occur concurrently, our typical construction timeline is 7–11 months, compared to 18–24 months for conventional builds.",
  },
  {
    q: "Can CONTEC homes be constructed on extreme or off-grid terrains?",
    a: "Yes. Our cantilevered engineering and modular foundation systems are specifically designed for steep alpine slopes, coastal cliffs, and remote forest environments where conventional heavy machinery cannot easily operate.",
  },
  {
    q: "What does 'Net-Positive Energy' mean for my home?",
    a: "Our integrated solar roof tiles and smart energy storage generate more clean electricity annually than the home consumes for heating, cooling, lighting, and EV charging, allowing you to feed surplus power back to the grid.",
  },
  {
    q: "How does the CONTEC fixed-price guarantee work?",
    a: "Following the preliminary BIM engineering phase, we provide a binding fixed-price contract with zero surprise overruns, covering architectural design, pre-fabrication, on-site assembly, and luxury interior finishes.",
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
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0038B8]/25 border border-[#0038B8]/50 text-[#FFB800] text-xs font-bold tracking-wider uppercase backdrop-blur-md mb-6 text-shadow-sub">
            CONTEC Engineering & Construction
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] max-w-4xl mb-8 text-shadow-heading">
            From Computational <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-slate-100 to-[#FFB800]">Vision</span> to Turnkey Reality
          </h1>

          <p className="text-zinc-300 text-lg sm:text-xl max-w-3xl leading-relaxed font-light mb-12">
            We operate as a single unified entity — principal architecture studio, computational engineering lab, and master construction builder.
          </p>

          {/* Quick Service Anchor Navigation */}
          <div className="flex flex-wrap gap-3">
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#0038B8]/15 hover:bg-[#0038B8]/30 border border-blue-500/20 text-zinc-200 hover:text-[#FFB800] transition-all"
              >
                {s.title.split("&")[0]}
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
            <h2 className="text-xs uppercase font-bold text-[#FFB800] tracking-widest mb-3">Our Methodology</h2>
            <p className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              The 4-Phase Delivery Flow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Discovery & Terrain Survey",
                desc: "Solar path mapping, geotechnical drone terrain scans, and initial architectural vision session.",
              },
              {
                step: "02",
                title: "3D BIM & Parametric Engineering",
                desc: "Full structural calculation, energy modeling, and fabrication-ready digital twin creation.",
              },
              {
                step: "03",
                title: "Robotic Prefab & Foundation",
                desc: "Parallel execution: subterranean foundation installation while structural pods are CNC-milled.",
              },
              {
                step: "04",
                title: "Assembly & White-Glove Handover",
                desc: "Rapid on-site erection, smart envelope testing, bespoke interior detailing, and key delivery.",
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
