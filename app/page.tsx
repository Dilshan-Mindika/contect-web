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
      "We design and build custom luxury homes and modern buildings, combining strong engineering precision with beautiful, lasting craftsmanship.",
    ctaText: "Explore Projects",
    ctaHref: "/projects",
    chips: ["Custom Luxury Homes", "Modern Architecture", "Solar Living"],
    topCardTag: "Energy-Smart Living",
    topCardTitle: "Naturally Cool & Efficient",
    topCardDesc:
      "Our smart designs keep your home naturally cool and energy-efficient, lowering your electricity bills while protecting the environment.",
    topCardImage: "/images/interior-preview.jpg",
    bottomLeftTag: "Quality Materials",
    bottomLeftTitle: "Solid Timber & Steel",
    bottomLeftDesc:
      "We combine certified high-grade timber, durable concrete, and treated steel to give your home maximum strength and durability.",
    bottomLeftLink: "Learn more",
    bottomLeftHref: "/services#materials",
    bottomLeftImage: "/images/material-preview.jpg",
    statNumber: "120+",
    statLabel: "Luxury homes & commercial buildings completed",
    rightStatement:
      "We work closely with you from sketch to keys, creating living spaces that look stunning and feel comfortable all year round.",
    rightLink: "About CONTEC",
    rightHref: "/about",
  },
  {
    badge: "PRECISION STRUCTURAL ENGINEERING",
    headlineLine1: "ENGINEERED",
    headlineLine2: "FOR CENTURY",
    headlineLine3: "DURABILITY",
    description:
      "Precision engineering, high-strength steel framing, and deep earthquake-safe concrete foundations designed for hill slopes and any terrain.",
    ctaText: "View Services",
    ctaHref: "/services",
    chips: ["Strong Steel Framing", "Hillside Retaining", "Deep Foundations"],
    topCardTag: "Structural Design",
    topCardTitle: "Open-Span Living Areas",
    topCardDesc:
      "Engineered with high-strength steel spans that allow wide open living rooms and panoramic glass views without blocking columns.",
    topCardImage: "/images/hero-main.jpg",
    bottomLeftTag: "Foundation Strength",
    bottomLeftTitle: "Reinforced Concrete Frames",
    bottomLeftDesc:
      "Heavy-duty foundations and reinforced concrete frames designed to withstand heavy rainfall, soil movement, and hill slopes.",
    bottomLeftLink: "Engineering Specs",
    bottomLeftHref: "/services#prefab",
    bottomLeftImage: "/images/craftsmanship-detail.jpg",
    statNumber: "100%",
    statLabel: "Guaranteed structural engineering safety standards",
    rightStatement:
      "Every column, beam, and joint is carefully calculated in 3D design software before construction begins on site.",
    rightLink: "Explore Engineering",
    rightHref: "/services",
  },
  {
    badge: "ENERGY-EFFICIENT & SMART HOMES",
    headlineLine1: "INTELLIGENT",
    headlineLine2: "NATURAL CLIMATE",
    headlineLine3: "COMFORT",
    description:
      "Double-glazed glass, natural airflow design, and rooftop solar power working together to keep your home cool, bright, and energy-independent.",
    ctaText: "Solar Specs",
    ctaHref: "/services#offgrid",
    chips: ["Rooftop Solar", "Natural Airflow", "Smart Lighting"],
    topCardTag: "Clean Power",
    topCardTitle: "Solar Power & Battery Backup",
    topCardDesc:
      "Rooftop solar panels paired with reliable battery backup provide uninterrupted electricity, even during power cuts.",
    topCardImage: "/images/project-forest.jpg",
    bottomLeftTag: "Energy Savings",
    bottomLeftTitle: "Rooftop Solar Setup",
    bottomLeftDesc:
      "High-efficiency solar systems producing clean electricity to power your entire house and cut monthly utility bills.",
    bottomLeftLink: "Calculate Savings",
    bottomLeftHref: "#estimator",
    bottomLeftImage: "/images/project-alpine.jpg",
    statNumber: "90%+",
    statLabel: "Average reduction in monthly electricity costs",
    rightStatement:
      "Our homes stay naturally cool and comfortable, cutting down on air conditioning needs while letting in plenty of natural daylight.",
    rightLink: "View Technology",
    rightHref: "/services",
  },
  {
    badge: "COMPLETE TURNKEY CONSTRUCTION",
    headlineLine1: "FROM IDEA",
    headlineLine2: "TO COMPLETED",
    headlineLine3: "HOME",
    description:
      "From government building approvals and foundation digging to custom interior finishes and key handover — we manage everything for you.",
    ctaText: "Start Your Build",
    ctaHref: "/contact",
    chips: ["All-in-One Service", "Custom Interiors", "Free Consultation"],
    topCardTag: "Project Delivery",
    topCardTitle: "Personal Consultation",
    topCardDesc:
      "Sit down with our experienced architects and engineers to tailor your dream home exactly to your budget and lifestyle.",
    topCardImage: "/images/project-coastal.jpg",
    bottomLeftTag: "Master Craft",
    bottomLeftTitle: "Experienced Builders",
    bottomLeftDesc:
      "Skilled master builders and carpenters ensuring the highest quality finishes in every room, tile, and door.",
    bottomLeftLink: "Book Consultation",
    bottomLeftHref: "/contact",
    bottomLeftImage: "/images/craftsmanship-detail.jpg",
    statNumber: "50+",
    statLabel: "Dedicated architects, engineers & master builders",
    rightStatement:
      "Book a friendly consultation with our team to discuss your land, review sample floorplans, and get a realistic cost estimate.",
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
  const [terrain, setTerrain] = useState("Hillside / Slope");
  const [sqft, setSqft] = useState(5000);
  const [autonomy, setAutonomy] = useState("Solar with Battery Storage");

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
            
            {/* ================= MAIN HERO BODY CONTENT (CONSTRAINED CONTAINER) ================= */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 flex-1 flex flex-col justify-between">
              
              {/* Top Row: Headline (Left) + Feature Glass Card (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
                
                {/* Left Column: Badge + Dynamic Headline + CTA Button */}
                <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start select-none transition-all duration-500 ease-out">
                  
                  {/* Category Badge with Golden Ambient Light */}
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-badge text-[#FFB800] text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-3">
                    {currentStage.badge}
                  </div>

                  {/* High-Contrast Oversized Brand Headline */}
                  <h1 className="text-white font-extrabold uppercase text-3xl sm:text-5xl md:text-5xl lg:text-[52px] xl:text-[62px] leading-[0.98] tracking-[-0.03em]">
                    <span className="block transition-all duration-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">{currentStage.headlineLine1}</span>
                    <span className="block transition-all duration-300 gradient-text-gold">
                      {currentStage.headlineLine2}
                    </span>
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-1">
                      <span className="transition-all duration-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">{currentStage.headlineLine3}</span>
                      
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
                  <div className="w-full max-w-[420px] rounded-[24px] sm:rounded-[28px] glass-panel border border-blue-500/30 p-4 sm:p-5 backdrop-blur-2xl bg-[#080e1c]/90 shadow-[0_16px_45px_rgba(0,0,0,0.85)] transition-all duration-300">
                    
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

            {/* ================= SCROLL STAGE STEPPER (CONSTRAINED CONTAINER) ================= */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4 pt-1 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
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
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white max-w-2xl leading-tight">
              <span className="drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">Mastery Across Every</span>{" "}
              <span className="gradient-text-blue">Dimension</span>
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
              title: "Architectural Design & 3D Plans",
              desc: "Custom floor plans, photorealistic 3D views, and natural sunlight & ventilation planning tailored to your land.",
              href: "/services#design-build",
            },
            {
              icon: "02",
              title: "Precision Construction",
              desc: "High-strength steel framing, reinforced concrete, and quality timber built to exact engineering measurements.",
              href: "/services#construction",
            },
            {
              icon: "03",
              title: "Rooftop Solar & Backup Power",
              desc: "Rooftop solar panels and reliable battery storage providing clean power and protection against electricity cuts.",
              href: "/services#sustainable",
            },
            {
              icon: "04",
              title: "Complete Turnkey Delivery",
              desc: "From council building approvals to custom interior carpentry and move-in ready handover under one fixed price.",
              href: "/services#construction",
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
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white max-w-2xl leading-tight">
              <span className="drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">Private Residences</span>{" "}
              <span className="gradient-text-gold">Delivered</span>
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

      {/* ================= SECTION 4: CRAFTSMANSHIP & MATERIALS ================= */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
            <Image
              src="/images/craftsmanship-detail.jpg"
              alt="Teak, Kumbuk and Reinforced Steel Joinery Detail"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 dark-backdrop-contrast p-4 rounded-2xl">
              <span className="text-xs font-mono font-bold text-[#FFB800] block mb-1">
                Craftsmanship Detail • Teak, Kumbuk & Steel
              </span>
              <p className="text-xs text-zinc-200 font-medium">
                Carefully fitted joints and precision-milled timber crafted for decades of structural strength and elegance.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-badge text-[#FFB800] text-xs font-bold uppercase tracking-wider">
              Quality Materials & Strength
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
              <span className="drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">Natural Materials,</span> <br />
              <span className="gradient-text-blue">
                Lasting Beauty
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal">
              We combine seasoned Sri Lankan Kumbuk and Teak timber, high-strength low-carbon concrete, natural stone, and double-glazed solar-tinted glass that keeps interiors cool in every season.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-[#080e1c]/85 border border-blue-500/30 shadow-lg">
                <span className="text-2xl font-extrabold text-[#FFB800] block font-mono drop-shadow-[0_2px_8px_rgba(255,184,0,0.3)]">90%+</span>
                <span className="text-xs text-zinc-300 font-medium">Less on-site waste through careful precision planning</span>
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
                <span>Learn More About Our Standards</span>
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
              Project Planning & Cost Estimator
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 font-normal">
              Select your land type and desired house size below for an instant preliminary timeline and cost estimate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Interactive Sliders/Pickers */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Terrain Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  1. Land Type & Location
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["Hillside / Slope", "Lakefront / River", "Forest / Estate", "City / Urban Plot"].map((t) => (
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
                    2. Desired House Size
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
                  3. Clean Energy Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {["Solar with Battery Storage", "Grid-Tied Solar"].map((lvl) => (
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
                  Estimated Project Details
                </span>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-zinc-300 font-medium">Estimated Construction Time:</span>
                    <span className="text-white font-bold text-sm font-mono text-shadow-sub">{calculatedMonths} Months</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-zinc-300 font-medium">Daily Solar Power Output:</span>
                    <span className="text-[#FFB800] font-bold text-sm font-mono text-shadow-sub">~{calculatedSolar} kW / day</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-zinc-300 font-medium">Annual Carbon Offset:</span>
                    <span className="text-white font-bold text-sm font-mono text-shadow-sub">{Math.round(sqft * 0.0042)} Metric Tons</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 font-medium">Estimated Turnkey Investment:</span>
                    <span className="text-[#FFB800] font-extrabold text-base font-mono drop-shadow-[0_2px_8px_rgba(255,184,0,0.4)]">LKR {(Number(calculatedInvestment) * 45).toFixed(0)}M – {(Number(calculatedInvestment) * 60).toFixed(0)}M</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="w-full py-3.5 rounded-full bg-[#FFB800] hover:bg-[#F59E0B] text-black font-extrabold text-xs text-center block uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(255,184,0,0.35)]"
                >
                  Request Detailed Plan & Free Estimate ↗
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
            Client Reviews & Trust
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Trusted by Homeowners & Businesses Across Kandy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "ConTec delivered our Hanthana hillside villa ahead of schedule. The retaining walls and rock foundations held strong through the heaviest monsoon season on record.",
              client: "Dr. Rohan & Anoma Senanayake",
              residence: "Hanthana Hillside Sanctuary • Kandy",
              rating: "★★★★★",
            },
            {
              quote: "The open-plan design and custom Kumbuk woodwork in our Anniewatte home is simply stunning. ConTec handled all municipal council approvals and handed over the keys right on time.",
              client: "Kavinda Dissanayake",
              residence: "Anniewatte Modern Residence • Kandy",
              rating: "★★★★★",
            },
            {
              quote: "House Master Kandy inspected and repaired roof waterproofing on our commercial building. Transparent pricing, excellent communication, and no more water leaks.",
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
                Book Free Consultation ↗
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
