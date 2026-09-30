import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Us | ConTec Design & Build (Kandy)",
  description: "Learn about ConTec Kandy's expert team, master construction craftsmanship, property development, and House Master property care services.",
};

const LEADERSHIP = [
  {
    name: "Eng. Dilshan Perera, C.Eng",
    role: "Managing Director & Principal Project Director",
    bio: "Over 18 years of pioneering luxury residential construction, complex hillside foundations, and turnkey commercial developments across Kandy and the Central Province.",
    image: "/images/avatar-1.jpg",
    credentials: "B.Sc. Civil Eng. • CEng MIE(SL)",
  },
  {
    name: "Archt. Kasun Jayawardena, AIA / SLIA",
    role: "Head of Architectural Design & 3D Visualization",
    bio: "Specializes in modern tropical architecture, biophilic daylighting, panoramic hillside integration, and high-precision 3D BIM coordination.",
    image: "/images/avatar-2.jpg",
    credentials: "M.Arch • Chartered Architect (SLIA)",
  },
  {
    name: "Eng. Samantha Weerasinghe",
    role: "Lead Structural Engineer & House Master Director",
    bio: "Leads hillside retaining wall engineering, structural diagnostics, roof waterproofing, and House Master comprehensive property care.",
    image: "/images/avatar-3.jpg",
    credentials: "B.Sc. Structural Eng. • Green Building AP",
  },
];

const TIMELINE = [
  {
    year: "2015",
    title: "Established in Kandy",
    desc: "Founded at George E. De Silva Mawatha to deliver uncompromising design & build construction standards in Sri Lanka.",
  },
  {
    year: "2018",
    title: "Hillside Engineering Milestone",
    desc: "Engineered and delivered award-winning cantilevered hillside villas across Hanthana, Anniewatte, and Bahirawakanda.",
  },
  {
    year: "2022",
    title: "House Master Kandy Launch",
    desc: "Established the dedicated House Master division for comprehensive property care, waterproofing, and structural maintenance.",
  },
  {
    year: "2026",
    title: "Premier Turnkey Developer",
    desc: "Over 120 luxury residences, commercial complexes, and bespoke renovations completed with 100% client satisfaction.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0038B8]/25 border border-[#0038B8]/50 text-[#FFB800] text-xs font-bold tracking-wider uppercase backdrop-blur-md mb-6 text-shadow-sub">
            Our Heritage & Philosophy
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] max-w-4xl mb-8 text-shadow-heading">
            Building Visions, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-slate-100 to-blue-400">Designing Futures</span>
          </h1>

          <p className="text-zinc-300 text-lg sm:text-xl max-w-3xl leading-relaxed font-light mb-12">
            At CONTEC Design & Build, we merge avant-garde architectural vision with aerospace-grade structural engineering to craft residences that produce more clean energy than they consume.
          </p>

          {/* Large Studio Feature Image */}
          <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
            <Image
              src="/images/architect-team.jpg"
              alt="CONTEC Architectural Design Studio"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-black/30" />
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="bg-black/70 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/15 max-w-md">
                <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block mb-1">
                  Design Studio • Zurich HQ
                </span>
                <p className="text-sm text-zinc-200 font-normal">
                  Our multidisciplinary team of architects, computational designers, and structural engineers collaborate seamlessly in real-time 3D BIM models.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-[#0038B8]/30 backdrop-blur-md border border-blue-500/30 px-5 py-3 rounded-2xl">
                <div className="text-3xl font-extrabold text-[#FFB800]">120+</div>
                <div className="text-xs text-zinc-200 uppercase font-bold tracking-wider">
                  Luxury Estates<br />Delivered
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values / 3 Pillars */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-bold text-[#FFB800] tracking-widest mb-3">Our Core Pillars</h2>
            <p className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              The Architecture of Precision & Resilience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "01",
                title: "Net-Positive Autonomy",
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
                className="glass-panel p-8 rounded-3xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.07] hover:border-[#FFB800]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-extrabold text-[#FFB800] mb-4 block font-mono">
                    {pillar.icon}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">{pillar.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-[#FFB800]">
                  <span>Certified CONTEC Standard</span>
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
              <h2 className="text-xs uppercase font-bold text-[#FFB800] tracking-widest mb-3">Principal Leadership</h2>
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
                className="group glass-panel rounded-3xl overflow-hidden border border-white/15 bg-black/40 hover:border-[#FFB800]/50 transition-all duration-500"
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
                    <span className="text-[11px] font-mono text-[#FFB800] uppercase tracking-wider block mb-1">
                      {leader.credentials}
                    </span>
                    <h3 className="text-xl font-bold text-white">{leader.name}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-xs font-bold text-blue-400 block mb-3">{leader.role}</span>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Milestone Timeline */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-bold text-[#FFB800] tracking-widest mb-3">Our Evolution</h2>
            <p className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              A Decade of Engineering Milestones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {TIMELINE.map((item) => (
              <div
                key={item.year}
                className="glass-panel p-6 rounded-3xl border border-white/15 bg-white/[0.02] relative"
              >
                <div className="text-3xl font-extrabold text-[#FFB800] font-mono mb-2">
                  {item.year}
                </div>
                <div className="w-8 h-0.5 bg-[#0038B8] mb-4" />
                <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0038B8]/30 via-[#080e1c] to-[#FFB800]/20 border border-blue-500/30 p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white mb-4">
                Ready to Build Your Architectural Vision?
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 mb-8 leading-relaxed">
                Connect with our principal architects for a private design discovery consultation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-3.5 rounded-full bg-[#FFB800] hover:bg-[#F59E0B] text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20"
                >
                  Schedule Consultation ↗
                </Link>
                <Link
                  href="/projects"
                  className="px-8 py-3.5 rounded-full border border-white/30 hover:border-white text-white font-bold text-sm backdrop-blur-md bg-white/[0.08] transition-all"
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
