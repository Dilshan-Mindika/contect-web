"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  area: string;
  solarCapacity: string;
  energyRating: string;
  image: string;
  tagline: string;
  description: string;
  highlights: string[];
}

const PROJECTS: Project[] = [
  {
    id: "alpine-sanctuary",
    title: "Alpine Horizon Villa",
    category: "Alpine",
    location: "St. Moritz, Switzerland",
    year: "2025",
    area: "6,400 sq ft",
    solarCapacity: "42 kW Integrated Slate",
    energyRating: "Net-Positive +120%",
    image: "/images/project-alpine.jpg",
    tagline: "Ultra-luxury Passivhaus residence built into alpine granite.",
    description: "Features curved glulam timber spans and triple-glazed heated smart glass that clears snow automatically while harvesting winter sunlight.",
    highlights: [
      "Subterranean geothermal heat loop",
      "Integrated battery storage bank (85 kWh)",
      "Zero-carbon timber and stone construction",
    ],
  },
  {
    id: "coastal-cliff",
    title: "Mirador Cliff Residence",
    category: "Coastal",
    location: "Mallorca, Spain",
    year: "2025",
    area: "5,800 sq ft",
    solarCapacity: "38 kW Bifacial Solar",
    energyRating: "Net-Positive +110%",
    image: "/images/project-coastal.jpg",
    tagline: "Cantilevered sustainable luxury suspended above the Mediterranean.",
    description: "Engineered with high-tensile carbon composite columns that allow a 14-meter column-free cantilever with panoramic sea vistas.",
    highlights: [
      "Seawater desalination cooling loop",
      "Biophilic succulent green rooftop",
      "Automated solar tracking louvers",
    ],
  },
  {
    id: "urban-atrium",
    title: "Sky Atrium Penthouse",
    category: "Urban",
    location: "Tokyo, Japan",
    year: "2024",
    area: "4,200 sq ft",
    solarCapacity: "18 kW Facade Glass",
    energyRating: "LEED Platinum",
    image: "/images/project-penthouse.jpg",
    tagline: "Biophilic high-rise duplex with a two-story indoor Japanese garden.",
    description: "Custom sculpted carbon-fiber spiral staircase connecting a multi-tier living pavilion with 360-degree skyline views.",
    highlights: [
      "Acoustic isolation dampening system",
      "Automated aeroponic vertical flora wall",
      "Smart electrochromic privacy glass",
    ],
  },
  {
    id: "nordic-forest",
    title: "Aurora Forest Retreat",
    category: "Forest",
    location: "Rovaniemi, Finland",
    year: "2024",
    area: "3,100 sq ft",
    solarCapacity: "24 kW Solar + Biomass",
    energyRating: "Passivhaus Premium",
    image: "/images/project-forest.jpg",
    tagline: "Off-grid curved parametric cabin pod in ancient pine wilderness.",
    description: "Constructed with charred Shou Sugi Ban timber and curved mirrored facade that disappears seamlessly into the pine canopy.",
    highlights: [
      "100% off-grid autonomous microgrid",
      "Wood-fired sauna & integrated thermal hot tub",
      "Zero environmental footprint foundation",
    ],
  },
];

const CATEGORIES = ["All", "Alpine", "Coastal", "Urban", "Forest"];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0038B8]/25 border border-[#0038B8]/50 text-[#FFB800] text-xs font-bold tracking-wider uppercase backdrop-blur-md mb-6 text-shadow-sub">
            CONTEC Architectural Portfolio
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] max-w-4xl mb-6 text-shadow-heading">
            Monuments of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-slate-100 to-blue-300">Engineering</span> & Luxury
          </h1>

          <p className="text-zinc-300 text-lg sm:text-xl max-w-3xl leading-relaxed font-light mb-10">
            Explore our portfolio of completed private residences, each tailored to its specific terrain and engineered to produce more clean energy than it consumes.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#FFB800] text-black shadow-lg shadow-amber-500/20"
                    : "bg-[#080e1c]/80 text-zinc-300 hover:bg-white/15 hover:text-white border border-blue-500/20"
                }`}
              >
                {cat === "All" ? "All Projects" : `${cat} Residences`}
              </button>
            ))}
          </div>
        </section>

        {/* Project Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group glass-panel rounded-3xl overflow-hidden border border-white/15 bg-white/[0.02] hover:border-[#FFB800]/50 hover:bg-white/[0.05] transition-all duration-500 cursor-pointer flex flex-col justify-between"
              >
                {/* Project Image */}
                <div className="relative w-full h-[320px] sm:h-[380px] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-black/30" />
                  
                  {/* Top Tags */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#0038B8]/80 backdrop-blur-md border border-white/20 text-[#FFB800]">
                      {project.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFB800] backdrop-blur-md text-black">
                      {project.energyRating}
                    </span>
                  </div>

                  {/* Bottom Meta on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs text-zinc-300 font-medium block mb-1">
                      {project.location} • {project.year}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#FFB800] transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Card Details Body */}
                <div className="p-6">
                  <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-light">
                    {project.tagline}
                  </p>

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-zinc-500 block uppercase text-[10px] font-bold">Living Area</span>
                      <span className="text-white font-bold">{project.area}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase text-[10px] font-bold">Solar Power</span>
                      <span className="text-[#FFB800] font-bold">{project.solarCapacity}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
                      <span className="text-xs font-bold text-[#FFB800] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        View Specs ↗
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Detailed Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-[#080e1c] border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col justify-between overflow-y-auto">
              {/* Modal Image Header */}
              <div className="relative w-full h-72 sm:h-96 shrink-0">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080e1c] via-transparent to-black/50" />
                
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-[#FFB800] hover:text-black transition-all cursor-pointer"
                >
                  ✕
                </button>

                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFB800] text-black uppercase inline-block mb-2">
                    {selectedProject.category} • {selectedProject.year}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                    {selectedProject.title}
                  </h2>
                  <p className="text-sm text-zinc-300">{selectedProject.location}</p>
                </div>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs uppercase font-bold text-[#FFB800] tracking-wider mb-2">
                    Architectural Overview
                  </h4>
                  <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-light">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-blue-500/20 text-xs">
                  <div>
                    <span className="text-zinc-500 block uppercase text-[10px] font-bold">Total Area</span>
                    <span className="text-white font-bold text-sm">{selectedProject.area}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase text-[10px] font-bold">Energy Rating</span>
                    <span className="text-[#FFB800] font-bold text-sm">{selectedProject.energyRating}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase text-[10px] font-bold">Solar Harvest</span>
                    <span className="text-white font-bold text-sm">{selectedProject.solarCapacity}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase text-[10px] font-bold">Year Delivered</span>
                    <span className="text-white font-bold text-sm">{selectedProject.year}</span>
                  </div>
                </div>

                {/* Key Technical Highlights */}
                <div>
                  <h4 className="text-xs uppercase font-bold text-[#FFB800] tracking-wider mb-3">
                    Engineering Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedProject.highlights.map((h) => (
                      <div
                        key={h}
                        className="p-3 rounded-xl bg-white/[0.02] border border-blue-500/20 text-xs text-zinc-300 flex items-start gap-2"
                      >
                        <span className="text-[#FFB800] font-bold">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-zinc-400">
                    Interested in a bespoke build inspired by this project?
                  </p>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFB800] hover:bg-[#F59E0B] text-black font-extrabold text-xs text-center transition-all shadow-md shadow-amber-500/20"
                  >
                    Discuss a Similar Project ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
