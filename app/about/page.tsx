import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Us | EcoDream Architecture & Construction",
  description: "Learn about EcoDream's visionary team, zero-carbon construction philosophy, and award-winning sustainable architectural living.",
};

const LEADERSHIP = [
  {
    name: "Elena Vance, AIA",
    role: "Principal Design Architect & Founder",
    bio: "Pioneered parametric biophilic structural forms with over 18 years leading flagship sustainable projects across the Alps and Scandinavia.",
    image: "/images/avatar-1.jpg",
    credentials: "ETH Zurich Architecture • AIA Fellow",
  },
  {
    name: "Dr. Marcus Thorne",
    role: "Chief Structural Engineer & BIM Director",
    bio: "Specializes in aerospace-grade steel pre-fabrication, seismic load dampening, and automated robotic construction execution.",
    image: "/images/avatar-2.jpg",
    credentials: "Imperial College London • Ph.D. Civil Eng.",
  },
  {
    name: "Soraya Al-Mansoor",
    role: "Head of Sustainable Systems & Microgrids",
    bio: "Leads research in autonomous residential solar microgrids, thermal phase-change envelopes, and cradle-to-cradle materiality.",
    image: "/images/avatar-3.jpg",
    credentials: "MIT Sustainable Architecture • LEED AP BD+C",
  },
];

const TIMELINE = [
  {
    year: "2014",
    title: "Foundation in Zurich",
    desc: "Established with a bold mission: prove that ultra-luxury residences can be 100% net-zero energy producers.",
  },
  {
    year: "2018",
    title: "Passivhaus Gold Milestone",
    desc: "Delivered the first triple-certified Alpine residence operating off-grid through winter storms.",
  },
  {
    year: "2022",
    title: "Robotic Prefabrication Studio",
    desc: "Opened our 40,000 sq ft millimeter-accuracy CNC timber and steel pre-fabrication facility.",
  },
  {
    year: "2026",
    title: "Global Studio Expansion",
    desc: "Over 120 completed private estates across Europe, North America, and Japan, setting new industry benchmarks.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050509] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Our Heritage & Philosophy
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] max-w-4xl mb-8">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">Eternity</span>, Designed for Harmony
          </h1>

          <p className="text-zinc-300 text-lg sm:text-xl max-w-3xl leading-relaxed font-light mb-12">
            At EcoDream, we merge avant-garde architectural vision with aerospace-level structural engineering to craft residences that produce more clean energy than they consume.
          </p>

          {/* Large Studio Feature Image */}
          <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
            <Image
              src="/images/architect-team.jpg"
              alt="EcoDream Architectural Design Studio"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050509] via-transparent to-black/30" />
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="bg-black/60 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/15 max-w-md">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                  Design Studio • Zurich HQ
                </span>
                <p className="text-sm text-zinc-200 font-normal">
                  Our multidisciplinary team of architects, computational designers, and structural engineers collaborate seamlessly in real-time 3D BIM models.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-5 py-3 rounded-2xl">
                <div className="text-3xl font-extrabold text-emerald-300">120+</div>
                <div className="text-xs text-zinc-200 uppercase font-semibold tracking-wider">
                  Luxury Estates<br />Delivered
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values / 3 Pillars */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-bold text-emerald-400 tracking-widest mb-3">Our Core Pillars</h2>
            <p className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              The Architecture of Responsibility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "01",
                title: "Net-Zero Autonomy",
                desc: "Every home is designed as a standalone power plant equipped with smart microinverters, battery storage, and Passivhaus thermal envelopes.",
              },
              {
                icon: "02",
                title: "Robotic Precision",
                desc: "Off-site CNC timber and steel pre-fabrication reduces on-site construction waste by 92% while delivering sub-millimeter joinery accuracy.",
              },
              {
                icon: "03",
                title: "Tactile Luxury",
                desc: "We celebrate honest materials — charred Shou Sugi Ban timber, raw honed alpine stone, and matte titanium hardware that patina gracefully.",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="glass-panel p-8 rounded-3xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-extrabold text-emerald-400/80 mb-4 block font-mono">
                    {pillar.icon}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">{pillar.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span>Certified Standard</span>
                  <span>✓</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Team */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <h2 className="text-xs uppercase font-bold text-emerald-400 tracking-widest mb-3">Principal Leadership</h2>
              <p className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                Visionaries, Architects, Engineers
              </p>
            </div>
            <p className="text-sm text-zinc-400 max-w-md">
              Our partners personally oversee every phase of design, structural calculation, and on-site assembly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.name}
                className="group glass-panel rounded-3xl overflow-hidden border border-white/15 bg-black/40 hover:border-emerald-500/40 transition-all duration-500"
              >
                <div className="relative w-full h-72 overflow-hidden">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider block mb-1">
                      {leader.credentials}
                    </span>
                    <h3 className="text-xl font-bold text-white">{leader.name}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-xs font-semibold text-amber-300 block mb-3">{leader.role}</span>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Milestone Timeline */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-bold text-emerald-400 tracking-widest mb-3">Our Evolution</h2>
            <p className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              A Decade of Innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {TIMELINE.map((item, idx) => (
              <div
                key={item.year}
                className="glass-panel p-6 rounded-3xl border border-white/15 bg-white/[0.02] relative"
              >
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 font-mono mb-2">
                  {item.year}
                </div>
                <div className="w-8 h-0.5 bg-emerald-500/50 mb-4" />
                <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#0d1512] to-amber-950/40 border border-emerald-500/30 p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white mb-4">
                Ready to Build Your Sustainable Masterpiece?
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 mb-8 leading-relaxed">
                Connect with our principal architects for a private design discovery consultation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all shadow-lg shadow-emerald-500/30"
                >
                  Schedule Consultation ↗
                </Link>
                <Link
                  href="/projects"
                  className="px-8 py-3.5 rounded-full border border-white/30 hover:border-white text-white font-medium text-sm backdrop-blur-md bg-white/[0.08] transition-all"
                >
                  Explore Portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
