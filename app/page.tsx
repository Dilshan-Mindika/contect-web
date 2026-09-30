"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollCanvasBackground from "@/components/ScrollCanvasBackground";
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
    badge: "MODERN ARCHITECTURE & CONSTRUCTION",
    headlineLine1: "YOUR VISION",
    headlineLine2: "OF SUSTAINABLE",
    headlineLine3: "LIVING",
    description:
      "We design and construct bespoke architectural residences that blend sustainable technologies with ultra-modern luxury craftsmanship.",
    ctaText: "Explore Projects",
    ctaHref: "/projects",
    chips: ["Sustainable Living", "Modern Architecture", "Energy Efficiency"],
    topCardTag: "Energy Efficiency",
    topCardTitle: "Passive Climate & Energy",
    topCardDesc:
      "Our commitment to eco-friendly practices ensures that every home we create is both aesthetically magnificent and environmentally responsible.",
    topCardImage: "/images/interior-preview.jpg",
    bottomLeftTag: "Eco Materials",
    bottomLeftTitle: "Sustainable Materials",
    bottomLeftDesc:
      "We use certified sustainable mass timber and low-carbon concrete to ensure your home is built to last while minimizing footprint.",
    bottomLeftLink: "Learn more",
    bottomLeftHref: "/services#materials",
    bottomLeftImage: "/images/material-preview.jpg",
    statNumber: "50+",
    statLabel: "Specialists dedicated to sustainable living",
    rightStatement:
      "We work with you to create a home that meets your unique needs and preferences, blending luxury with sustainability.",
    rightLink: "About our studio",
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
      "Ultra-lightweight high-tensile carbon composites reducing deadweight while doubling seismic load tolerances.",
    bottomLeftLink: "Engineering Specs",
    bottomLeftHref: "/services#prefab",
    bottomLeftImage: "/images/craftsmanship-detail.jpg",
    statNumber: "100%",
    statLabel: "Zero-emission certified construction process",
    rightStatement:
      "Every structural beam and connection is mathematically modeled in 3D BIM for millimeter-accurate fabrication.",
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
    statNumber: "120+",
    statLabel: "Luxury sustainable homes delivered globally",
    rightStatement:
      "Book an initial design discovery session to review terrain suitability, floorplans, and estimated construction timelines.",
    rightLink: "Book Consultation",
    rightHref: "/contact",
  },
];

const FEATURED_PROJECTS = [
  {
    title: "Alpine Horizon Villa",
    location: "St. Moritz, Switzerland",
    category: "Alpine Sanctuary",
    specs: "6,400 sq ft • 42 kW Solar • Net-Positive +120%",
    image: "/images/project-alpine.jpg",
    href: "/projects",
  },
  {
    title: "Mirador Cliff Residence",
    location: "Mallorca, Spain",
    category: "Coastal Estate",
    specs: "5,800 sq ft • 38 kW Solar • Cantilevered Design",
    image: "/images/project-coastal.jpg",
    href: "/projects",
  },
  {
    title: "Sky Atrium Penthouse",
    location: "Tokyo, Japan",
    category: "Urban Biophilic",
    specs: "4,200 sq ft • Indoor Atrium • LEED Platinum",
    image: "/images/project-penthouse.jpg",
    href: "/projects",
  },
];

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [activeChipIdx, setActiveChipIdx] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="relative w-full bg-[#050509] text-white">
      
      {/* ================= SECTION 1: STICKY SCROLL HERO (150-FRAME CANVA ANIMATION) ================= */}
      <div ref={scrollContainerRef} className="relative w-full min-h-[450vh]">
        
        {/* Sticky Viewport pinned full screen as user scrolls */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-7 overflow-hidden">
          
          {/* Full-Screen 16:9 Scroll-Linked Canvas Animation (Crystalline background, 100% visible) */}
          <ScrollCanvasBackground
            totalFrames={150}
            containerRef={scrollContainerRef}
          />

          {/* Outer Frame with Minimalist Glass Outline */}
          <div className="relative z-10 w-full max-w-[1440px] h-full max-h-[920px] rounded-[24px] sm:rounded-[32px] lg:rounded-[44px] overflow-y-auto lg:overflow-hidden border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col justify-between custom-scrollbar">
            
            {/* ================= TOP NAVIGATION BAR ================= */}
            <header className="relative z-30 w-full px-4 sm:px-8 lg:px-14 pt-4 sm:pt-6 lg:pt-7 flex items-center justify-between shrink-0">
              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-400 p-[1.5px] shadow-lg shadow-teal-900/30">
                  <div className="w-full h-full bg-[#0d0f14] rounded-[6.5px] flex items-center justify-center">
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
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-8 bg-black/40 backdrop-blur-md px-5 py-1.5 rounded-full border border-white/10">
                {[
                  { label: "Home", href: "/" },
                  { label: "About", href: "/about" },
                  { label: "Services", href: "/services" },
                  { label: "Projects", href: "/projects" },
                  { label: "Contact", href: "/contact" },
                ].map((item, idx) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-xs lg:text-sm font-medium transition-colors hover:text-white drop-shadow-sm ${
                      idx === 0 ? "text-white font-semibold" : "text-zinc-300/85"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Top Right Action Button */}
              <div className="flex items-center gap-3">
                <Link
                  href="/contact"
                  className="px-5 sm:px-6 py-2 rounded-full border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white hover:bg-emerald-500 text-xs sm:text-sm font-semibold backdrop-blur-md bg-emerald-950/20 transition-all duration-300 shadow-sm"
                >
                  Contact Us ↗
                </Link>

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
                {[
                  { label: "Home", href: "/" },
                  { label: "About Us", href: "/about" },
                  { label: "Services", href: "/services" },
                  { label: "Projects", href: "/projects" },
                  { label: "Contact", href: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm text-zinc-100 hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* ================= MAIN HERO BODY CONTENT ================= */}
            <div className="relative z-20 w-full px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 lg:pt-6 flex-1 flex flex-col justify-between">
              
              {/* Top Row: Headline (Left) + Feature Glass Card (Right) */}
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
                      
                      {/* Inline CTA Button */}
                      <Link
                        href={currentStage.ctaHref}
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
                      </Link>
                    </div>
                  </h1>

                  {/* Short Supporting Description */}
                  <p className="mt-2 sm:mt-3 text-zinc-200 text-xs sm:text-sm max-w-md font-normal leading-relaxed drop-shadow-md bg-black/25 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                    {currentStage.description}
                  </p>
                </div>

                {/* Right Column: Floating Top-Right Glass Card */}
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
              <div className="pb-3 sm:pb-4 pt-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                
                {/* Bottom Left: Tinted Card */}
                <div className="md:col-span-4 xl:col-span-4">
                  <div className="glass-card-warm rounded-[22px] sm:rounded-[26px] p-3.5 sm:p-4 flex gap-3.5 items-center transition-all duration-300 hover:border-amber-400/40 group bg-amber-950/30 backdrop-blur-md border border-amber-500/20">
                    <div className="relative w-16 sm:w-18 h-18 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-amber-200/25 shadow-md">
                      <Image
                        src={currentStage.bottomLeftImage}
                        alt="Materials Preview"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-xs sm:text-sm mb-0.5">
                        {currentStage.bottomLeftTitle}
                      </h4>
                      <p className="text-zinc-200 text-[11px] sm:text-xs leading-snug line-clamp-2">
                        {currentStage.bottomLeftDesc}
                      </p>
                      <Link
                        href={currentStage.bottomLeftHref}
                        className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 transition-colors"
                      >
                        <span>{currentStage.bottomLeftLink}</span>
                        <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Center: Social Proof */}
                <div className="md:col-span-4 xl:col-span-4 flex flex-col items-center justify-center text-center py-1">
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

                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {currentStage.statNumber}
                  </div>
                  <p className="text-zinc-200 text-xs max-w-[220px] leading-tight mt-0.5 drop-shadow-sm">
                    {currentStage.statLabel}
                  </p>
                </div>

                {/* Bottom Right: Mission Statement */}
                <div className="md:col-span-4 xl:col-span-4 flex flex-col items-start md:items-end text-left md:text-right">
                  <p className="text-zinc-200 text-xs sm:text-sm max-w-xs leading-relaxed drop-shadow-md bg-black/25 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                    {currentStage.rightStatement}
                  </p>
                  <Link
                    href={currentStage.rightHref}
                    className="inline-flex items-center gap-1.5 mt-2 text-xs sm:text-sm font-semibold text-white hover:text-emerald-300 transition-colors group drop-shadow-sm"
                  >
                    <span>{currentStage.rightLink}</span>
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </Link>
                </div>

              </div>

            </div>

            {/* ================= SCROLL STAGE STEPPER ================= */}
            <div className="relative z-30 w-full px-4 sm:px-8 lg:px-12 pb-3 sm:pb-4 pt-1 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
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
                <span className="text-[10px] text-zinc-400 ml-1">Scroll down to explore ↓</span>
              </div>

              <Link
                href="/projects"
                className="text-xs font-semibold text-zinc-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              Integrated Capabilities
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white max-w-2xl leading-tight">
              Mastery Across Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-200">Dimension</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="px-6 py-3 rounded-full border border-white/20 hover:border-emerald-400 text-sm font-semibold text-white hover:text-emerald-300 transition-all backdrop-blur-md bg-white/[0.03] self-start md:self-auto"
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
              title: "Smart Microgrids",
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
              className="glass-panel p-8 rounded-3xl border border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-extrabold text-emerald-400/80 font-mono block mb-6 group-hover:translate-x-1 transition-transform">
                  {item.icon}
                </span>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-emerald-300">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              Selected Works
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white max-w-2xl leading-tight">
              Private Residences <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-emerald-300">Delivered</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold transition-all shadow-lg shadow-emerald-500/30 self-start md:self-auto"
          >
            Browse All 120+ Estates ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_PROJECTS.map((proj) => (
            <Link
              key={proj.title}
              href={proj.href}
              className="group glass-panel rounded-3xl overflow-hidden border border-white/15 bg-white/[0.02] hover:border-emerald-500/40 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="relative w-full h-80 overflow-hidden">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050509] via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md border border-white/20 text-emerald-300 uppercase">
                    {proj.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs text-zinc-300 block mb-1">{proj.location}</span>
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {proj.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">{proj.specs}</span>
                <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
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
            <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <span className="text-xs font-mono font-bold text-amber-400 block mb-1">
                Material Detail • Grade-5 Titanium & Glulam
              </span>
              <p className="text-xs text-zinc-300">
                Interlocking parametric joints precision CNC-milled with sub-millimeter tolerances for century-long structural integrity.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Materiality & Zero Carbon
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
              Honest Materials, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                Enduring Tactility
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              We reject synthetic composites in favor of certified European mass timber, low-carbon geopolymer concrete, charred Japanese cedar, and electrochromic glass that tints intelligently with solar intensity.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-2xl font-extrabold text-emerald-400 block font-mono">92%</span>
                <span className="text-xs text-zinc-400">Waste reduction via robotic off-site prefabrication</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-2xl font-extrabold text-amber-300 block font-mono">100 Yrs</span>
                <span className="text-xs text-zinc-400">Designed structural service lifetime rating</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
              >
                <span>Read Our Sustainability Whitepaper</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 5: INTERACTIVE PROJECT DISCOVERY ESTIMATOR ================= */}
      <section id="estimator" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <div className="glass-panel rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0c1412] to-[#08080f] p-8 sm:p-14 shadow-2xl">
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold font-mono text-emerald-400 tracking-wider uppercase block mb-2">
              Interactive Planning Tool
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              Project Feasibility & Energy Estimator
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 font-light">
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
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        terrain === t
                          ? "bg-emerald-500 text-black shadow-md"
                          : "bg-white/[0.05] text-zinc-300 hover:bg-white/10 border border-white/10"
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
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">
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
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
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
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        autonomy === lvl
                          ? "bg-emerald-500 text-black shadow-md"
                          : "bg-white/[0.05] text-zinc-300 hover:bg-white/10 border border-white/10"
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
              <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/15 backdrop-blur-xl space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block border-b border-white/10 pb-3">
                  Preliminary Build Metrics
                </span>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-zinc-400">Estimated Construction Timeline:</span>
                    <span className="text-white font-bold text-sm font-mono">{calculatedMonths} Months</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-zinc-400">Daily Clean Energy Output:</span>
                    <span className="text-emerald-400 font-bold text-sm font-mono">~{calculatedSolar} kW / day</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-zinc-400">Annual Carbon Offset:</span>
                    <span className="text-white font-bold text-sm font-mono">{Math.round(sqft * 0.0042)} Metric Tons</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Estimated Turnkey Investment:</span>
                    <span className="text-amber-300 font-extrabold text-base font-mono">${calculatedInvestment}M – ${(Number(calculatedInvestment) * 1.3).toFixed(1)}M</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs text-center block uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/30"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider mb-4">
            Client Voices & Recognition
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Trusted by Discerning Visionaries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "EcoDream delivered our alpine villa in St. Moritz three months ahead of schedule. The home produced 140% of its winter energy needs during the coldest blizzard on record.",
              client: "Johannes & Claire von Berg",
              residence: "Alpine Horizon Villa • St. Moritz",
              rating: "★★★★★",
            },
            {
              quote: "The cantilevered steel engineering in our Mallorca cliff house is sheer magic. We live entirely off-grid without sacrificing a single tactile luxury.",
              client: "Mateo S.",
              residence: "Mirador Cliff Residence • Mallorca",
              rating: "★★★★★",
            },
            {
              quote: "The acoustic isolation and indoor biophilic atrium transformed our Tokyo duplex. It feels like an ancient mountain retreat 40 stories in the air.",
              client: "Dr. Kenji Takahashi",
              residence: "Sky Atrium Penthouse • Tokyo",
              rating: "★★★★★",
            },
          ].map((item) => (
            <div
              key={item.client}
              className="glass-panel p-8 rounded-3xl border border-white/15 bg-white/[0.02] flex flex-col justify-between"
            >
              <div>
                <div className="text-emerald-400 text-base mb-4 tracking-widest">{item.rating}</div>
                <p className="text-sm text-zinc-300 leading-relaxed italic mb-6 font-light">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-white font-bold text-sm">{item.client}</h4>
                <p className="text-xs text-emerald-400 font-medium">{item.residence}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 7: FINAL CALL TO ACTION BANNER ================= */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0d1512] to-amber-950 border border-emerald-500/30 p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-tight mb-4">
              Begin Your Architectural Journey Today
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mb-8 leading-relaxed font-light">
              Connect with our founding partners in Zurich, London, or New York for a private design discovery consultation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/40"
              >
                Schedule Discovery Session ↗
              </Link>
              <Link
                href="/projects"
                className="px-8 py-4 rounded-full border border-white/30 hover:border-white text-white font-semibold text-sm backdrop-blur-md bg-white/[0.08] transition-all"
              >
                Explore Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GLOBAL FOOTER ================= */}
      <Footer />
      
    </div>
  );
}
