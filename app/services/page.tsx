"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SERVICES = [
  {
    id: "parametric",
    badge: "STAGE 01",
    title: "Parametric Architectural Design & BIM",
    desc: "Computational architectural modeling tailored to local solar angles, terrain gradients, and microclimate patterns. We generate millimeter-accurate 3D BIM models ready for direct digital fabrication.",
    image: "/images/hero-main.jpg",
    features: [
      "Solar & Thermal Sunlight Simulation",
      "Aerodynamic Wind-Load Optimization",
      "Millimeter-Accurate 3D BIM Coordination",
      "Virtual Reality Walkthrough Previews",
    ],
  },
  {
    id: "prefab",
    badge: "STAGE 02",
    title: "Robotic Pre-fabrication & Carbon Steel Framing",
    desc: "Off-site CNC manufacturing in our specialized facility. High-tensile steel framing and mass timber structural pods are assembled under strict climate control, ensuring 10x higher tolerances than traditional sites.",
    image: "/images/craftsmanship-detail.jpg",
    features: [
      "Sub-Millimeter CNC Timber Joinery",
      "Seismic Grade Aerospace Titanium Bracing",
      "92% Less Site Construction Waste",
      "Accelerated On-Site Assembly Timeline",
    ],
  },
  {
    id: "offgrid",
    badge: "STAGE 03",
    title: "Off-Grid Solar Microgrids & Thermal Envelopes",
    desc: "Triple-glazed smart electrochromic glass paired with integrated solar roof tiles and high-capacity battery storage. Your home functions as an autonomous net-positive energy ecosystem.",
    image: "/images/project-forest.jpg",
    features: [
      "Passivhaus Certified Thermal Envelopes",
      "35 kW+ Daily Solar Harvesting Capacity",
      "Lithium-Iron-Phosphate Battery Storage",
      "IoT Air Quality & Microclimate Automation",
    ],
  },
  {
    id: "turnkey",
    badge: "STAGE 04",
    title: "Turnkey Luxury Construction & Interior Handover",
    desc: "From initial zoning permits and foundation excavation to bespoke artisan interior carpentry, custom lighting, and white-glove key handover — fully managed under a single guaranteed contract.",
    image: "/images/project-penthouse.jpg",
    features: [
      "Fixed-Price & Guaranteed Timeline Contracts",
      "Dedicated Principal Architect Project Manager",
      "Custom Bespoke Interior Woodwork & Finishes",
      "Comprehensive 20-Year Structural Warranty",
    ],
  },
];

const FAQS = [
  {
    q: "How long does a full bespoke architectural build take from concept to handover?",
    a: "Because 75% of the structural pod is pre-fabricated using automated CNC robotic systems off-site while foundation works occur concurrently, our typical construction timeline is 7–11 months, compared to 18–24 months for conventional builds.",
  },
  {
    q: "Can EcoDream homes be constructed on extreme or off-grid terrains?",
    a: "Yes. Our cantilevered engineering and modular foundation systems are specifically designed for steep alpine slopes, coastal cliffs, and remote forest environments where conventional heavy machinery cannot easily operate.",
  },
  {
    q: "What does 'Net-Positive Energy' mean for my home?",
    a: "Our integrated solar roof tiles and smart energy storage generate more clean electricity annually than the home consumes for heating, cooling, lighting, and EV charging, allowing you to feed surplus power back to the grid.",
  },
  {
    q: "How does the fixed-price guarantee work?",
    a: "Following the preliminary BIM engineering phase, we provide a binding fixed-price contract with zero surprise overruns, covering architectural design, pre-fabrication, on-site assembly, and luxury interior finishes.",
  },
];

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#050509] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20">
        {/* Hero Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Comprehensive Architectural Services
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] max-w-4xl mb-8">
            From Computational <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">Vision</span> to Turnkey Reality
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
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.06] hover:bg-white/15 border border-white/10 text-zinc-200 hover:text-white transition-all"
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
                className={`glass-panel rounded-3xl border border-white/15 bg-white/[0.02] p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row gap-10 items-center scroll-mt-28 ${
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
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-400 text-black uppercase">
                      {service.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-2 block">
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
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
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
                      className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md"
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
            <h2 className="text-xs uppercase font-bold text-emerald-400 tracking-widest mb-3">Our Methodology</h2>
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
                className="glass-panel p-6 rounded-3xl border border-white/15 bg-white/[0.02] relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 font-mono mb-3 block">
                    {phase.step}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">{phase.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{phase.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-semibold text-zinc-500">
                  Phase {idx + 1} of 4
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
          <div className="text-center mb-12">
            <h2 className="text-xs uppercase font-bold text-emerald-400 tracking-widest mb-3">Frequently Asked Questions</h2>
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
                  className="rounded-2xl border border-white/15 bg-white/[0.02] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-emerald-400 text-lg transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
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
