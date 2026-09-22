"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ScrollCanvasBackground from "@/components/ScrollCanvasBackground";

interface SectionStage {
  badge: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  description: string;
  ctaText: string;
  chips: string[];
  topCardTag: string;
  topCardTitle: string;
  topCardDesc: string;
  topCardImage: string;
  bottomLeftTag: string;
  bottomLeftTitle: string;
  bottomLeftDesc: string;
  bottomLeftLink: string;
  bottomLeftImage: string;
  statNumber: string;
  statLabel: string;
  rightStatement: string;
  rightLink: string;
}

const STAGES: SectionStage[] = [
  {
    badge: "MODERN ARCHITECTURE & CONSTRUCTION",
    headlineLine1: "YOUR VISION",
    headlineLine2: "OF SUSTAINABLE",
    headlineLine3: "LIVING",
    description:
      "We design and construct bespoke architectural residences that blend sustainable technologies with ultra-modern luxury craftsmanship.",
    ctaText: "Let's Explore",
    chips: ["Sustainable Living", "Modern Architecture", "Energy Efficiency"],
    topCardTag: "Energy Efficiency",
    topCardTitle: "Passive Climate & Energy",
    topCardDesc:
      "Our commitment to eco-friendly practices ensures that every home we create is both aesthetically magnificent and environmentally responsible.",
    topCardImage: "/images/interior-preview.jpg",
    bottomLeftTag: "Eco Materials",
    bottomLeftTitle: "Sustainable Materials",
    bottomLeftDesc:
      "We use the highest quality, certified sustainable timber and low-carbon concrete to ensure your home is built to last while minimizing impact.",
    bottomLeftLink: "Learn more",
    bottomLeftImage: "/images/material-preview.jpg",
    statNumber: "50+",
    statLabel: "Specialists dedicated to sustainable living",
    rightStatement:
      "We work with you to create a home that meets your unique needs and preferences, blending luxury with sustainability.",
    rightLink: "Learn more",
  },
  {
    badge: "PRECISION STRUCTURAL ENGINEERING",
    headlineLine1: "ENGINEERED",
    headlineLine2: "FOR CENTURY",
    headlineLine3: "DURABILITY",
    description:
      "Precision robotic pre-fabrication, aerospace-grade carbon steel framing, and seismic-resistant subterranean foundations.",
    ctaText: "View Blueprint",
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
    bottomLeftImage: "/images/material-preview.jpg",
    statNumber: "100%",
    statLabel: "Zero-emission certified construction process",
    rightStatement:
      "Every structural beam and connection is mathematically modeled in 3D BIM for millimeter-accurate fabrication.",
    rightLink: "Explore Engineering",
  },
  {
    badge: "SMART THERMAL ENVELOPE",
    headlineLine1: "INTELLIGENT",
    headlineLine2: "MICROCLIMATE",
    headlineLine3: "AUTOMATION",
    description:
      "Triple-insulated electrochromic glass, automated ventilation airflows, and rooftop solar harvesting systems operating in harmony.",
    ctaText: "Energy Specs",
    chips: ["Smart Glass", "Solar Shading", "IoT Automation"],
    topCardTag: "Smart Living",
    topCardTitle: "Autonomous Energy System",
    topCardDesc:
      "Integrated micro-inverter rooftop solar collectors paired with high-capacity battery storage for 100% off-grid autonomy.",
    topCardImage: "/images/interior-preview.jpg",
    bottomLeftTag: "Clean Energy",
    bottomLeftTitle: "Off-Grid Power Architecture",
    bottomLeftDesc:
      "Bespoke solar tile roofing generating up to 35 kW daily clean energy with smart grid backfeeding.",
    bottomLeftLink: "Calculate Savings",
    bottomLeftImage: "/images/material-preview.jpg",
    statNumber: "98.4%",
    statLabel: "Average thermal efficiency rating achieved",
    rightStatement:
      "Our smart envelopes self-regulate ambient temperature and air purity with near-zero acoustic noise.",
    rightLink: "View Technology",
  },
  {
    badge: "TURNKEY LUXURY DELIVERY",
    headlineLine1: "BESPOKE",
    headlineLine2: "ARCHITECTURAL",
    headlineLine3: "REALITY",
    description:
      "From architectural zoning approvals and site excavation to custom bespoke interior handover — fully managed turnkey delivery.",
    ctaText: "Start Your Build",
    chips: ["Turnkey Handover", "Custom Interiors", "Consultation"],
    topCardTag: "Project Delivery",
    topCardTitle: "Architectural Consultation",
    topCardDesc:
      "Collaborate directly with our principal architects and master builders to customize your dream sustainable residence.",
    topCardImage: "/images/hero-main.jpg",
    bottomLeftTag: "Master Craft",
    bottomLeftTitle: "Artisan Construction",
    bottomLeftDesc:
      "Master builders ensuring the highest grade of tactile luxury in every joint, seam, and architectural finish.",
    bottomLeftLink: "Schedule Private Tour",
    bottomLeftImage: "/images/material-preview.jpg",
    statNumber: "120+",
    statLabel: "Luxury sustainable homes delivered across Europe & US",
    rightStatement:
      "Book an initial design discovery session to review terrain suitability, floorplans, and estimated construction timelines.",
    rightLink: "Book Consultation",
  },
];

export default function ConstructionHeroPage() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [activeChipIdx, setActiveChipIdx] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [consultationEmail, setConsultationEmail] = useState("");
  const [consultationSent, setConsultationSent] = useState(false);

  // Track scroll position and smoothly switch active section stage
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

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationEmail) return;
    setConsultationSent(true);
    setTimeout(() => {
      setConsultationSent(false);
      setConsultationEmail("");
    }, 3000);
  };

  const scrollToStage = (stageIdx: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollableDistance = container.offsetHeight - window.innerHeight;
    const targetScroll = container.offsetTop + (stageIdx / (STAGES.length - 1)) * scrollableDistance;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div ref={scrollContainerRef} className="relative w-full min-h-[450vh] bg-[#050509]">
      
      {/* Sticky Viewport pinned full screen as user scrolls */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-7 overflow-hidden">
        
        {/* Full-Screen 16:9 Scroll-Linked Canvas Animation (Crystalline background, 100% visible) */}
        <ScrollCanvasBackground
          totalFrames={150}
          containerRef={scrollContainerRef}
        />

        {/* Outer Frame with Minimalist Glass Outline (Matching Reference Layout) */}
        <div className="relative z-10 w-full max-w-[1440px] h-full max-h-[920px] rounded-[24px] sm:rounded-[32px] lg:rounded-[44px] overflow-y-auto lg:overflow-hidden border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col justify-between custom-scrollbar">
          
          {/* ================= TOP NAVIGATION BAR ================= */}
          <header className="relative z-30 w-full px-4 sm:px-8 lg:px-14 pt-4 sm:pt-6 lg:pt-7 flex items-center justify-between shrink-0">
            {/* Brand Logo matching reference ("EcoDream") */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-400 p-[1.5px] shadow-lg shadow-teal-900/30">
                <div className="w-full h-full bg-[#0d0f14] rounded-[6.5px] flex items-center justify-center">
                  {/* Eco Architecture Icon */}
                  <svg
                    className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              </div>
              <span className="text-white font-bold text-lg tracking-tight group-hover:text-emerald-300 transition-colors">
                Eco<span className="text-zinc-200 font-light">Dream</span>
              </span>
            </a>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              {[
                { label: "About Us", href: "#about" },
                { label: "Services", href: "#services" },
                { label: "Research", href: "#research" },
                { label: "Team", href: "#team" },
              ].map((item, idx) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-white drop-shadow-sm ${
                    idx === 0 ? "text-white font-semibold" : "text-zinc-300/85"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Top Right Action Button */}
            <div className="flex items-center gap-3">
              <a
                href="#consultation"
                className="px-5 sm:px-6 py-2 rounded-full border border-white/30 hover:border-white/70 text-white text-xs sm:text-sm font-medium backdrop-blur-md bg-white/[0.08] hover:bg-white/[0.18] transition-all duration-300 shadow-sm"
              >
                Contact Us
              </a>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-black/40 border border-white/15 text-white backdrop-blur-md"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </header>

          {/* Mobile Dropdown Nav Menu */}
          {mobileMenuOpen && (
            <div className="relative z-40 mx-4 mt-2 p-4 rounded-2xl glass-panel border border-white/20 bg-black/80 backdrop-blur-xl md:hidden flex flex-col gap-3">
              {["About Us", "Services", "Research", "Team"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-zinc-100 hover:bg-white/10"
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          {/* ================= MAIN HERO BODY CONTENT (DYNAMIC PER SCROLL SECTION) ================= */}
          <div className="relative z-20 w-full px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 lg:pt-6 flex-1 flex flex-col justify-between">
            
            {/* Top Row: Oversized Headline (Left) + Top Feature Glass Card (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
              
              {/* Left Column: Badge + Dynamic Headline + CTA Button */}
              <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start select-none transition-all duration-500 ease-out">
                
                {/* Availability / Phase Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/40 border border-white/20 text-emerald-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase backdrop-blur-md mb-2 sm:mb-3 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  {currentStage.badge}
                </div>

                {/* Oversized Brand Headline */}
                <h1 className="text-white font-extrabold uppercase text-3xl sm:text-5xl md:text-6xl lg:text-[60px] xl:text-[72px] leading-[0.96] tracking-[-0.03em] drop-shadow-lg">
                  <span className="block transition-all duration-300">{currentStage.headlineLine1}</span>
                  <span className="block transition-all duration-300 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-amber-100">
                    {currentStage.headlineLine2}
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-1">
                    <span className="transition-all duration-300">{currentStage.headlineLine3}</span>
                    
                    {/* Inline CTA Button matching reference style */}
                    <a
                      href="#consultation"
                      className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2 sm:py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs sm:text-sm tracking-normal hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_4px_25px_rgba(255,255,255,0.4)] group cursor-pointer"
                    >
                      <span>{currentStage.ctaText}</span>
                      <svg
                        className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-zinc-950"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                  </div>
                </h1>

                {/* Short Supporting Description */}
                <p className="mt-2 sm:mt-3 text-zinc-200 text-xs sm:text-sm max-w-md font-normal leading-relaxed drop-shadow-md bg-black/25 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                  {currentStage.description}
                </p>
              </div>

              {/* Right Column: Floating Top-Right Glass Card (Refined to show background clearly) */}
              <div className="lg:col-span-5 xl:col-span-5 flex justify-end">
                <div className="w-full max-w-[460px] rounded-[24px] sm:rounded-[28px] glass-panel border border-white/20 p-4 sm:p-5 backdrop-blur-md bg-black/35 shadow-2xl transition-all duration-300">
                  
                  {/* Style/Phase Pill Chips */}
                  <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-white/15">
                    {currentStage.chips.map((chip, idx) => (
                      <button
                        key={chip}
                        onClick={() => setActiveChipIdx(idx)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                          activeChipIdx === idx
                            ? "bg-white text-black shadow-md font-semibold"
                            : "bg-white/[0.08] text-zinc-200 hover:bg-white/[0.18] hover:text-white"
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Content Details + Inset Image Preview */}
                  <div className="mt-3.5 flex flex-col-reverse sm:flex-row gap-3.5 items-start sm:items-center justify-between">
                    <div className="flex-1 pr-1">
                      <div className="inline-block text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                        {currentStage.topCardTag}
                      </div>
                      <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                        {currentStage.topCardTitle}
                      </h3>
                      <p className="text-zinc-200 text-xs leading-relaxed">
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
            <div className="pb-3 sm:pb-5 pt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
              
              {/* Bottom Left: Tinted Card ("Sustainable Materials" matching reference) */}
              <div className="md:col-span-4 xl:col-span-4">
                <div className="glass-card-warm rounded-[22px] sm:rounded-[26px] p-3.5 sm:p-4 flex gap-3.5 items-center transition-all duration-300 hover:border-amber-400/40 group bg-amber-950/30 backdrop-blur-md border border-amber-500/20">
                  {/* 3D Asset Thumbnail */}
                  <div className="relative w-16 sm:w-18 h-18 sm:h-22 rounded-xl overflow-hidden shrink-0 border border-amber-200/25 shadow-md">
                    <Image
                      src={currentStage.bottomLeftImage}
                      alt="Sustainable Materials Preview"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-xs sm:text-sm mb-0.5">
                      {currentStage.bottomLeftTitle}
                    </h4>
                    <p className="text-zinc-200 text-[11px] sm:text-xs leading-snug line-clamp-2">
                      {currentStage.bottomLeftDesc}
                    </p>
                    <a
                      href="#materials"
                      className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 transition-colors"
                    >
                      <span>{currentStage.bottomLeftLink}</span>
                      <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Center: Social Proof Counter + Overlapping Avatars */}
              <div className="md:col-span-4 xl:col-span-4 flex flex-col items-center justify-center text-center py-1">
                {/* Overlapping Avatar Stack */}
                <div className="flex items-center justify-center -space-x-3 mb-1.5">
                  {[
                    { src: "/images/avatar-1.jpg", alt: "Specialist 1" },
                    { src: "/images/avatar-2.jpg", alt: "Specialist 2" },
                    { src: "/images/avatar-3.jpg", alt: "Specialist 3" },
                  ].map((avatar, idx) => (
                    <div
                      key={idx}
                      className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-[#12111d] shadow-md ring-1 ring-emerald-500/40"
                    >
                      <Image src={avatar.src} alt={avatar.alt} fill className="object-cover" />
                    </div>
                  ))}
                </div>

                {/* Stat Headline */}
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {currentStage.statNumber}
                </div>
                <p className="text-zinc-200 text-xs max-w-[220px] leading-tight mt-0.5 drop-shadow-sm">
                  {currentStage.statLabel}
                </p>
              </div>

              {/* Bottom Right: Mission Statement & Secondary Link */}
              <div className="md:col-span-4 xl:col-span-4 flex flex-col items-start md:items-end text-left md:text-right">
                <p className="text-zinc-200 text-xs sm:text-sm max-w-xs leading-relaxed drop-shadow-md bg-black/25 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                  {currentStage.rightStatement}
                </p>
                <a
                  href="#details"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs sm:text-sm font-semibold text-white hover:text-emerald-300 transition-colors group drop-shadow-sm"
                >
                  <span>{currentStage.rightLink}</span>
                  <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                </a>
              </div>

            </div>

          </div>

          {/* ================= SCROLL STAGE STEPPER & CONSULTATION BAR ================= */}
          <div className="relative z-30 w-full px-4 sm:px-8 lg:px-12 pb-3 sm:pb-4 pt-1 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
            
            {/* Scroll Stage Interactive Stepper (Click to jump to any stage) */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/15">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mr-1">
                Phase 0{currentStageIdx + 1}
              </span>
              {STAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToStage(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentStageIdx === idx
                      ? "w-8 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Jump to stage ${idx + 1}`}
                />
              ))}
              <span className="text-[10px] text-zinc-400 ml-1">Scroll to build ↓</span>
            </div>

            {/* Quick Consultation Planner Bar */}
            <form
              id="consultation"
              onSubmit={handleConsultationSubmit}
              className="w-full sm:w-auto max-w-md rounded-full p-1 pl-4 glass-panel bg-black/40 border border-white/20 flex items-center justify-between gap-2 focus-within:border-emerald-400 transition-all backdrop-blur-md"
            >
              <input
                type="email"
                value={consultationEmail}
                onChange={(e) => setConsultationEmail(e.target.value)}
                placeholder="Enter your email for project blueprint..."
                className="w-full bg-transparent text-xs text-white placeholder-zinc-400 focus:outline-none truncate"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-wide transition-all shadow-md shrink-0 cursor-pointer"
              >
                {consultationSent ? "Request Sent! ✓" : "Get Blueprint ↗"}
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
