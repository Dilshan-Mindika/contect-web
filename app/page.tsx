"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollCanvasBackground from "@/components/ScrollCanvasBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SectionStage {
  badge: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  chips: string[];
  topCardTag: string;
  topCardTitle: string;
  topCardDesc: string;
  topCardImage: string;
  bottomLeftTag: string;
  bottomLeftTitle: string;
  bottomLeftDesc: string;
  bottomLeftLink: string;
  bottomLeftHref: string;
  bottomLeftImage: string;
  statNumber: string;
  statLabel: string;
  rightStatement: string;
  rightLink: string;
  rightHref: string;
}

const STAGES: SectionStage[] = [
  {
    badge: "CONTEC DESIGN & BUILD",
    headlineLine1: "BUILDING VISIONS",
    headlineLine2: "DESIGNING",
    headlineLine3: "FUTURES",
    description:
      "We design and construct bespoke architectural residences blending aerospace-grade precision engineering with sustainable luxury craftsmanship.",
    ctaText: "Explore Projects",
    ctaHref: "/projects",
    chips: ["Sustainable Living", "Parametric Architecture", "Energy Autonomy"],
    topCardTag: "Energy Efficiency",
    topCardTitle: "Passive Climate & Energy",
    topCardDesc:
      "Our commitment to zero-carbon practices ensures that every CONTEC home is both aesthetically magnificent and environmentally regenerative.",
    topCardImage: "/images/interior-preview.jpg",
    bottomLeftTag: "Eco Materials",
    bottomLeftTitle: "Mass Timber & Titanium",
    bottomLeftDesc:
      "We combine certified sustainable timber and low-carbon concrete with high-tensile titanium bracing to maximize structural resilience.",
    bottomLeftLink: "Learn more",
    bottomLeftHref: "/services#materials",
    bottomLeftImage: "/images/material-preview.jpg",
    statNumber: "120+",
    statLabel: "Luxury sustainable estates delivered worldwide",
    rightStatement:
      "We collaborate directly with you to engineer bespoke living spaces that combine iconic architectural form with sustainable performance.",
    rightLink: "About CONTEC",
    rightHref: "/about",
  },
  {
    badge: "PRECISION STRUCTURAL ENGINEERING",
    headlineLine1: "ENGINEERED",
    headlineLine2: "FOR CENTURY",
    headlineLine3: "DURABILITY",
    description:
      "Precision robotic pre-fabrication, aerospace-grade carbon steel framing, and seismic-resistant subterranean foundations.",
    ctaText: "View Services",
    ctaHref: "/services",
    chips: ["Steel Framing", "Seismic Resilience", "Geothermal Loops"],
    topCardTag: "Core Engineering",
    topCardTitle: "Parametric Structural Pod",
    topCardDesc:
      "Engineered with high-tensile curved steel spans that allow column-free 360-degree panoramic glass openings.",
    topCardImage: "/images/hero-main.jpg",
    bottomLeftTag: "Structural Integrity",
    bottomLeftTitle: "Reinforced Composite Framing",
    bottomLeftDesc:
      "Ultra-lightweight high-tensile carbon composites reducing structural deadweight while doubling seismic load tolerances.",
    bottomLeftLink: "Engineering Specs",
    bottomLeftHref: "/services#prefab",
    bottomLeftImage: "/images/craftsmanship-detail.jpg",
    statNumber: "100%",
    statLabel: "Zero-emission certified construction process",
    rightStatement:
      "Every structural beam and connection is mathematically modeled in 3D BIM for millimeter-accurate robotic fabrication.",
    rightLink: "Explore Engineering",
    rightHref: "/services",
  },
  {
    badge: "SMART THERMAL ENVELOPE",
    headlineLine1: "INTELLIGENT",
    headlineLine2: "MICROCLIMATE",
    headlineLine3: "AUTOMATION",
    description:
      "Triple-insulated electrochromic glass, automated ventilation airflows, and rooftop solar harvesting systems operating in harmony.",
    ctaText: "Energy Specs",
    ctaHref: "/services#offgrid",
    chips: ["Smart Glass", "Solar Shading", "IoT Automation"],
    topCardTag: "Smart Living",
    topCardTitle: "Autonomous Energy System",
    topCardDesc:
      "Integrated micro-inverter rooftop solar collectors paired with high-capacity battery storage for 100% off-grid autonomy.",
    topCardImage: "/images/project-forest.jpg",
    bottomLeftTag: "Clean Energy",
    bottomLeftTitle: "Off-Grid Power Architecture",
    bottomLeftDesc:
      "Bespoke solar tile roofing generating up to 42 kW daily clean energy with smart grid backfeeding.",
    bottomLeftLink: "Calculate Savings",
    bottomLeftHref: "#estimator",
    bottomLeftImage: "/images/project-alpine.jpg",
    statNumber: "98.4%",
    statLabel: "Average thermal efficiency rating achieved",
    rightStatement:
      "Our smart envelopes self-regulate ambient temperature and air purity with near-zero acoustic noise.",
    rightLink: "View Technology",
    rightHref: "/services",
  },
  {
    badge: "TURNKEY LUXURY DELIVERY",
    headlineLine1: "BESPOKE",
    headlineLine2: "ARCHITECTURAL",
    headlineLine3: "REALITY",
    description:
      "From architectural zoning approvals and site excavation to custom bespoke interior handover — fully managed turnkey delivery.",
    ctaText: "Start Your Build",
    ctaHref: "/contact",
    chips: ["Turnkey Handover", "Custom Interiors", "Consultation"],
    topCardTag: "Project Delivery",
    topCardTitle: "Architectural Consultation",
    topCardDesc:
      "Collaborate directly with our principal architects and master builders to customize your dream sustainable residence.",
    topCardImage: "/images/project-coastal.jpg",
    bottomLeftTag: "Master Craft",
    bottomLeftTitle: "Artisan Construction",
    bottomLeftDesc:
      "Master builders ensuring the highest grade of tactile luxury in every joint, seam, and architectural finish.",
    bottomLeftLink: "Schedule Private Tour",
    bottomLeftHref: "/contact",
    bottomLeftImage: "/images/craftsmanship-detail.jpg",
    statNumber: "50+",
    statLabel: "Dedicated master architects & engineers",
    rightStatement:
      "Book an initial design discovery session to review terrain suitability, floorplans, and estimated construction timelines.",
    rightLink: "Book Consultation",
    rightHref: "/contact",
  },
];

const FEATURED_PROJECTS = [
  {
    title: "Hanthana Hillside Sanctuary",
    location: "Hanthana, Kandy",
    category: "Hillside Luxury",
    specs: "6,400 sq ft • 42 kW Solar • Net-Zero Living",
    image: "/images/project-alpine.jpg",
    href: "/projects",
  },
  {
    title: "Anniewatte Modern Residence",
    location: "Anniewatte, Kandy",
    category: "Tropical Modern",
    specs: "5,800 sq ft • 38 kW Solar • Turnkey Build",
    image: "/images/project-coastal.jpg",
    href: "/projects",
  },
  {
    title: "Victoria Lakefront Villa",
    location: "Digana / Victoria Golf Resort",
    category: "Eco Sanctuary",
    specs: "4,800 sq ft • Solar Microgrid • Multi-Tier Deck",
    image: "/images/project-forest.jpg",
    href: "/projects",
  },
];

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [activeChipIdx, setActiveChipIdx] = useState<number>(0);

  // Interactive Estimator State
  const [terrain, setTerrain] = useState("Alpine Mountain");
  const [sqft, setSqft] = useState(5000);
  const [autonomy, setAutonomy] = useState("100% Off-Grid Microgrid");

  // Track scroll position to update hero stage
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = container.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      let stageIndex = Math.floor(progress * STAGES.length);
      if (stageIndex >= STAGES.length) stageIndex = STAGES.length - 1;

      setCurrentStageIdx(stageIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentStage = STAGES[currentStageIdx];

  const scrollToStage = (stageIdx: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollableDistance = container.offsetHeight - window.innerHeight;
    const targetScroll = container.offsetTop + (stageIdx / (STAGES.length - 1)) * scrollableDistance;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  // Estimator Calculations
  const calculatedMonths = (6 + (sqft / 1500)).toFixed(1);
  const calculatedSolar = Math.round(sqft * 0.0075);
  const calculatedInvestment = (sqft * 750 / 1000000).toFixed(1);

  return (
    <div className="relative w-full bg-[#050811] text-white">
      {/* Global Sticky Navigation Bar */}
      <Navbar />
      
      {/* ================= SECTION 1: STICKY SCROLL HERO (150-FRAME COVER ANIMATION) ================= */}
      <div ref={scrollContainerRef} className="relative w-full min-h-[450vh]">
        
        {/* Full-Screen Sticky Viewport */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          {/* Edge-to-Edge 16:9 Scroll-Linked Canvas Animation (Zero black spaces on sides) */}
          <ScrollCanvasBackground
            totalFrames={150}
            containerRef={scrollContainerRef}
          />

          {/* Borderless Full-Screen Content Layer */}
          <div className="relative z-10 w-full h-full flex flex-col justify-between overflow-y-auto lg:overflow-hidden custom-scrollbar pt-20 sm:pt-24 lg:pt-24">
            
            {/* ================= MAIN HERO BODY CONTENT ================= */}
            <div className="relative z-20 w-full px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 flex-1 flex flex-col justify-between">
              
              {/* Top Row: Headline (Left) + Feature Glass Card (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
                
                {/* Left Column: Badge + Dynamic Headline + CTA Button */}
                <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start select-none transition-all duration-500 ease-out">
                  
                  {/* Category Badge with Golden Ambient Light */}
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-badge text-[#FFB800] text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-3">
                    {currentStage.badge}
                  </div>

                  {/* High-Contrast Oversized Brand Headline with Drop Shadow */}
                  <h1 className="text-white font-extrabold uppercase text-3xl sm:text-5xl md:text-6xl lg:text-[60px] xl:text-[72px] leading-[0.96] tracking-[-0.03em] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
                    <span className="block transition-all duration-300">{currentStage.headlineLine1}</span>
                    <span className="block transition-all duration-300 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#FFB800]">
                      {currentStage.headlineLine2}
                    </span>
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-1">
                      <span className="transition-all duration-300">{currentStage.headlineLine3}</span>
                      
                      {/* Inline CTA Button with Warm Amber Glow Shadow */}
                      <Link
                        href={currentStage.ctaHref}
                        className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#FFB800] hover:bg-[#F59E0B] text-black font-extrabold text-xs sm:text-sm tracking-normal hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_6px_28px_rgba(255,184,0,0.45)] group cursor-pointer"
                      >
                        <span>{currentStage.ctaText}</span>
                        <svg
                          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-black"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </h1>

                  {/* Supporting Description with Solid Dark Contrast Backplate */}
                  <p className="mt-3 text-zinc-100 text-xs sm:text-sm max-w-lg font-medium leading-relaxed dark-backdrop-contrast p-3.5 sm:p-4 rounded-2xl text-shadow-sub">
                    {currentStage.description}
                  </p>
                </div>

                {/* Right Column: Floating Top-Right Glass Card */}
                <div className="lg:col-span-5 xl:col-span-5 flex justify-end">
                  <div className="w-full max-w-[460px] rounded-[24px] sm:rounded-[28px] glass-panel border border-blue-500/30 p-4 sm:p-5 backdrop-blur-2xl bg-[#080e1c]/90 shadow-[0_16px_45px_rgba(0,0,0,0.85)] transition-all duration-300">
                    
                    {/* Style/Phase Pill Chips */}
                    <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-white/15">
                      {currentStage.chips.map((chip, idx) => (
                        <button
                          key={chip}
                          onClick={() => setActiveChipIdx(idx)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                            activeChipIdx === idx
                              ? "bg-[#FFB800] text-black shadow-[0_2px_12px_rgba(255,184,0,0.45)]"
                              : "bg-white/[0.08] text-zinc-200 hover:bg-white/[0.18] hover:text-white border border-white/10"
                          }`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Content Details + Inset Image Preview */}
                    <div className="mt-3.5 flex flex-col-reverse sm:flex-row gap-3.5 items-start sm:items-center justify-between">
                      <div className="flex-1 pr-1">
                        <div className="inline-block text-[11px] font-extrabold text-[#FFB800] uppercase tracking-wider mb-1 text-shadow-sub">
                          {currentStage.topCardTag}
                        </div>
                        <h3 className="text-white font-bold text-sm sm:text-base mb-1 text-shadow-sub">
                          {currentStage.topCardTitle}
                        </h3>
                        <p className="text-zinc-200 text-xs leading-relaxed font-medium">
                          {currentStage.topCardDesc}
                        </p>
                      </div>

                      {/* Inset Rounded Preview Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-white/25 shadow-lg group">
                        <Image
                          src={currentStage.topCardImage}
                          alt="Architectural Preview"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* ================= BOTTOM ROW CARDS & SOCIAL PROOF ================= */}
              <div className="pb-3 sm:pb-4 pt-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                
                {/* Bottom Left: Tinted Card with High Contrast */}
                <div className="md:col-span-4 xl:col-span-4">
                  <div className="glass-card-warm rounded-[22px] sm:rounded-[26px] p-3.5 sm:p-4 flex gap-3.5 items-center transition-all duration-300 hover:border-[#FFB800]/60 group">
                    <div className="relative w-16 sm:w-18 h-18 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-[#FFB800]/40 shadow-md">
                      <Image
                        src={currentStage.bottomLeftImage}
                        alt="Materials Preview"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-white font-bold text-xs sm:text-sm mb-0.5 text-shadow-sub">
                        {currentStage.bottomLeftTitle}
                      </h4>
                      <p className="text-zinc-200 text-[11px] sm:text-xs leading-snug line-clamp-2 font-medium">
                        {currentStage.bottomLeftDesc}
                      </p>
                      <Link
                        href={currentStage.bottomLeftHref}
                        className="inline-flex items-center gap-1 mt-1.5 text-xs font-bold text-[#FFB800] hover:text-amber-200 transition-colors"
                      >
                        <span>{currentStage.bottomLeftLink}</span>
                        <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Center: Social Proof with High Contrast Backdrop */}
                <div className="md:col-span-4 xl:col-span-4 flex flex-col items-center justify-center text-center py-1">
                  <div className="dark-backdrop-contrast px-5 py-2.5 rounded-2xl flex flex-col items-center">
                    <div className="flex items-center justify-center -space-x-3 mb-1.5">
                      {[
                        { src: "/images/avatar-1.jpg", alt: "Specialist 1" },
                        { src: "/images/avatar-2.jpg", alt: "Specialist 2" },
                        { src: "/images/avatar-3.jpg", alt: "Specialist 3" },
                      ].map((avatar, idx) => (
                        <div
                          key={idx}
                          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-[#050811] shadow-md ring-1 ring-[#FFB800]"
                        >
                          <Image src={avatar.src} alt={avatar.alt} fill className="object-cover" />
                        </div>
                      ))}
                    </div>

                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {currentStage.statNumber}
                    </div>
                    <p className="text-zinc-200 text-xs max-w-[220px] leading-tight mt-0.5 font-medium text-shadow-sub">
                      {currentStage.statLabel}
                    </p>
                  </div>
                </div>

                {/* Bottom Right: Mission Statement with Strong Backdrop */}
                <div className="md:col-span-4 xl:col-span-4 flex flex-col items-start md:items-end text-left md:text-right">
                  <p className="text-zinc-100 text-xs sm:text-sm max-w-xs leading-relaxed font-medium dark-backdrop-contrast p-3.5 rounded-2xl text-shadow-sub">
                    {currentStage.rightStatement}
                  </p>
                  <Link
                    href={currentStage.rightHref}
                    className="inline-flex items-center gap-1.5 mt-2 text-xs sm:text-sm font-extrabold text-white hover:text-[#FFB800] transition-colors group text-shadow-sub"
                  >
                    <span>{currentStage.rightLink}</span>
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </Link>
                </div>

              </div>

            </div>

            {/* ================= SCROLL STAGE STEPPER ================= */}
            <div className="relative z-30 w-full px-4 sm:px-8 lg:px-12 pb-3 sm:pb-4 pt-1 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2 bg-[#080e1c]/85 backdrop-blur-xl px-4 py-2 rounded-full border border-blue-500/30 shadow-lg">
                <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider mr-1">
                  Phase 0{currentStageIdx + 1}
                </span>
                {STAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToStage(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentStageIdx === idx
                        ? "w-8 bg-[#FFB800] shadow-[0_0_12px_rgba(255,184,0,0.9)]"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Jump to stage ${idx + 1}`}
                  />
                ))}
                <span className="text-[10px] text-zinc-300 ml-1 font-medium">Scroll down to explore ↓</span>
              </div>

              <Link
                href="/projects"
                className="text-xs font-bold text-zinc-200 hover:text-[#FFB800] flex items-center gap-1.5 transition-colors bg-[#080e1c]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10"
              >
                <span>View Full Architectural Portfolio</span>
                <span>↓</span>
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* ================= SECTION 2: SERVICES & CAPABILITIES SHOWCASE ================= */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-badge text-[#FFB800] text-xs font-bold uppercase tracking-wider mb-4">
              Integrated Capabilities
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white max-w-2xl leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Mastery Across Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-slate-100 to-[#FFB800]">Dimension</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="px-6 py-3 rounded-full border border-blue-500/40 hover:border-[#FFB800] text-sm font-bold text-white hover:text-[#FFB800] transition-all backdrop-blur-md bg-[#080e1c]/80 shadow-lg self-start md:self-auto"
          >
            Explore All Services ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "01",
              title: "Parametric Architecture",
              desc: "Computational form-finding modeled around terrain contours, wind aerodynamics, and winter solar harvesting.",
              href: "/services#parametric",
            },
            {
              icon: "02",
              title: "Robotic Pre-fabrication",
              desc: "Aerospace-grade steel and mass timber structural pods milled with sub-millimeter CNC accuracy.",
              href: "/services#prefab",
            },
            {
              icon: "03",
              title: "Smart Solar Microgrids",
              desc: "Integrated solar roof tiles and high-capacity battery storage delivering 100% off-grid clean autonomy.",
              href: "/services#offgrid",
            },
            {
              icon: "04",
              title: "Turnkey Luxury Handover",
              desc: "From initial site permits to bespoke interior carpentry and white-glove handover under one fixed price.",
              href: "/services#turnkey",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="glass-panel p-8 rounded-3xl border border-white/15 bg-[#080e1c]/75 hover:bg-[#0c152b]/95 hover:border-[#FFB800]/60 hover:shadow-[0_12px_40px_rgba(0,56,184,0.3)] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-extrabold text-[#FFB800] font-mono block mb-6 group-hover:translate-x-1 transition-transform drop-shadow-[0_2px_8px_rgba(255,184,0,0.3)]">
                  {item.icon}
                </span>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFB800] transition-colors text-shadow-sub">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-zinc-300 group-hover:text-[#FFB800]">
                <span>View Details</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= SECTION 3: FEATURED PROJECTS PORTFOLIO ================= */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-badge text-[#FFB800] text-xs font-bold uppercase tracking-wider mb-4">
              Selected Works
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white max-w-2xl leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Private Residences <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-blue-300">Delivered</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-full bg-[#FFB800] hover:bg-[#F59E0B] text-black text-sm font-extrabold transition-all shadow-[0_4px_20px_rgba(255,184,0,0.35)] self-start md:self-auto"
          >
            Browse All 120+ Estates ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_PROJECTS.map((proj) => (
            <Link
              key={proj.title}
              href={proj.href}
              className="group glass-panel rounded-3xl overflow-hidden border border-white/15 bg-[#080e1c]/75 hover:border-[#FFB800]/50 hover:shadow-[0_16px_48px_rgba(0,0,0,0.9)] transition-all duration-500 flex flex-col justify-between"
            >
              <div className="relative w-full h-80 overflow-hidden">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/70 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#0038B8]/90 backdrop-blur-md border border-white/20 text-[#FFB800] uppercase shadow-md">
                    {proj.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs text-zinc-300 block mb-1 font-medium">{proj.location}</span>
                  <h3 className="text-2xl font-bold text-white group-hover:text-[#FFB800] transition-colors text-shadow-sub">
                    {proj.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">{proj.specs}</span>
                <span className="text-[#FFB800] font-bold group-hover:translate-x-1 transition-transform">
                  Explore ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= SECTION 4: CRAFTSMANSHIP & MATERIAL SCIENCE ================= */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
            <Image
              src="/images/craftsmanship-detail.jpg"
              alt="Parametric Timber and Titanium Joinery Detail"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 dark-backdrop-contrast p-4 rounded-2xl">
              <span className="text-xs font-mono font-bold text-[#FFB800] block mb-1">
                Material Detail • Grade-5 Titanium & Glulam
              </span>
              <p className="text-xs text-zinc-200 font-medium">
                Interlocking parametric joints precision CNC-milled with sub-millimeter tolerances for century-long structural integrity.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-badge text-[#FFB800] text-xs font-bold uppercase tracking-wider">
              Materiality & Zero Carbon
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Honest Materials, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-slate-100 to-[#FFB800]">
                Enduring Tactility
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal">
              We combine certified European mass timber, low-carbon geopolymer concrete, charred Japanese cedar, and electrochromic glass that tints intelligently with solar intensity.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-[#080e1c]/85 border border-blue-500/30 shadow-lg">
                <span className="text-2xl font-extrabold text-[#FFB800] block font-mono drop-shadow-[0_2px_8px_rgba(255,184,0,0.3)]">92%</span>
                <span className="text-xs text-zinc-300 font-medium">Waste reduction via robotic off-site prefabrication</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#080e1c]/85 border border-blue-500/30 shadow-lg">
                <span className="text-2xl font-extrabold text-blue-400 block font-mono drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]">100 Yrs</span>
                <span className="text-xs text-zinc-300 font-medium">Designed structural service lifetime rating</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#FFB800] transition-colors"
              >
                <span>Read Our Sustainability Whitepaper</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 5: INTERACTIVE PROJECT ESTIMATOR ================= */}
      <section id="estimator" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <div className="glass-panel rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#080f22] to-[#04060d] p-8 sm:p-14 shadow-2xl">
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold font-mono text-[#FFB800] tracking-wider uppercase block mb-2">
              Interactive Planning Tool
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Project Feasibility & Energy Estimator
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 font-normal">
              Configure your property parameters below for an instant preliminary timeline and solar harvesting calculation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Interactive Sliders/Pickers */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Terrain Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  1. Property Terrain & Climate
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["Alpine Mountain", "Coastal Cliff", "Forest Retreat", "Urban Plot"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTerrain(t)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        terrain === t
                          ? "bg-[#FFB800] text-black shadow-[0_2px_12px_rgba(255,184,0,0.45)]"
                          : "bg-white/[0.06] text-zinc-300 hover:bg-white/10 border border-white/15"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Square Footage Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    2. Desired Living Footprint
                  </label>
                  <span className="text-sm font-extrabold text-[#FFB800] font-mono drop-shadow-[0_1px_6px_rgba(255,184,0,0.3)]">
                    {sqft.toLocaleString()} sq ft ({Math.round(sqft * 0.0929)} m²)
                  </span>
                </div>
                <input
                  type="range"
                  min={2500}
                  max={12000}
                  step={500}
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FFB800]"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                  <span>2,500 sq ft</span>
                  <span>7,000 sq ft</span>
                  <span>12,000 sq ft</span>
                </div>
              </div>

              {/* Autonomy Level */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  3. Autonomous Clean Energy Target
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {["100% Off-Grid Microgrid", "Grid-Tied Net-Zero"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setAutonomy(lvl)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        autonomy === lvl
                          ? "bg-[#FFB800] text-black shadow-[0_2px_12px_rgba(255,184,0,0.45)]"
                          : "bg-white/[0.06] text-zinc-300 hover:bg-white/10 border border-white/15"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Calculated Results Card */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#050811]/92 border border-blue-500/30 backdrop-blur-2xl space-y-6 shadow-[0_16px_48px_rgba(0,0,0,0.9)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800] block border-b border-white/10 pb-3 text-shadow-sub">
                  Preliminary Build Metrics
                </span>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-zinc-300 font-medium">Estimated Construction Timeline:</span>
                    <span className="text-white font-bold text-sm font-mono text-shadow-sub">{calculatedMonths} Months</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-zinc-300 font-medium">Daily Clean Energy Output:</span>
                    <span className="text-[#FFB800] font-bold text-sm font-mono text-shadow-sub">~{calculatedSolar} kW / day</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-zinc-300 font-medium">Annual Carbon Offset:</span>
                    <span className="text-white font-bold text-sm font-mono text-shadow-sub">{Math.round(sqft * 0.0042)} Metric Tons</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 font-medium">Estimated Turnkey Investment:</span>
                    <span className="text-[#FFB800] font-extrabold text-base font-mono text-shadow-sub">${calculatedInvestment}M – ${(Number(calculatedInvestment) * 1.3).toFixed(1)}M</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="w-full py-3.5 rounded-full bg-[#FFB800] hover:bg-[#F59E0B] text-black font-extrabold text-xs text-center block uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(255,184,0,0.35)]"
                >
                  Request Detailed Architectural Blueprint ↗
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SECTION 6: CLIENT TESTIMONIALS & AWARDS ================= */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-badge text-[#FFB800] text-xs font-bold uppercase tracking-wider mb-4">
            Client Voices & Recognition
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Trusted by Discerning Visionaries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "ConTec delivered our Hanthana hillside villa ahead of schedule. The structural retaining and rock foundations held flawlessly through the heaviest monsoon season on record.",
              client: "Dr. Rohan & Anoma Senanayake",
              residence: "Hanthana Hillside Sanctuary • Kandy",
              rating: "★★★★★",
            },
            {
              quote: "The open-plan biophilic architecture and custom Kumbuk woodwork in our Anniewatte residence is sheer mastery. ConTec managed every municipal approval and key handover turnkey.",
              client: "Kavinda Dissanayake",
              residence: "Anniewatte Modern Residence • Kandy",
              rating: "★★★★★",
            },
            {
              quote: "House Master Kandy performed a full waterproofing and electrical diagnostic on our commercial building. Transparent pricing and exceptional structural precision.",
              client: "Mahesh Bandaranaike",
              residence: "Commercial Facility • Kandy",
              rating: "★★★★★",
            },
          ].map((item) => (
            <div
              key={item.client}
              className="glass-panel p-8 rounded-3xl border border-white/15 bg-[#080e1c]/60 hover:border-blue-500/40 hover:bg-[#0c152b]/80 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="text-[#FFB800] text-base mb-4 tracking-widest drop-shadow-[0_1px_6px_rgba(255,184,0,0.4)]">{item.rating}</div>
                <p className="text-sm text-zinc-200 leading-relaxed italic mb-6 font-normal">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-white font-bold text-sm">{item.client}</h4>
                <p className="text-xs text-[#FFB800] font-semibold">{item.residence}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 7: FINAL CALL TO ACTION BANNER ================= */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#0038B8]/35 via-[#080e1c] to-[#FFB800]/20 border border-blue-500/40 p-10 sm:p-16 text-center relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-tight mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Building Visions, Designing Futures
            </h2>
            <p className="text-sm sm:text-base text-zinc-200 mb-8 leading-relaxed font-normal">
              Visit our head office at No. 167, George E. De Silva Mawatha, Kandy, or message our project directors on WhatsApp for a direct consultation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-full bg-[#FFB800] hover:bg-[#F59E0B] text-black font-extrabold text-sm tracking-wide transition-all shadow-[0_4px_24px_rgba(255,184,0,0.45)]"
              >
                Schedule Discovery Session ↗
              </Link>
              <a
                href="https://wa.me/94777812141?text=Hello%20ConTec%2C%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full border border-white/30 hover:border-white text-white font-bold text-sm backdrop-blur-md bg-white/[0.08] transition-all"
              >
                WhatsApp Us Directly
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GLOBAL FOOTER ================= */}
      <Footer />
      
    </div>
  );
}
