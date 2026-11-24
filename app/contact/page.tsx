"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ChevronDown,
  Layers,
  ArrowRight,
  Compass,
  Home,
  Hammer,
  Zap,
  User,
  Check,
  Star
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does the free initial consultation work?",
    answer: "We start with a friendly discussion and a site visit. We look at your land, ground slope, sunlight direction, and your family's needs. Within 48 hours, our architect and engineer provide an initial layout concept and practical advice on what works best for your land.",
  },
  {
    question: "Do you build hillside retaining walls and handle NBRO landslide approvals?",
    answer: "Yes. Hillside construction is our top specialty in Kandy. We test the soil, calculate slope safety, build strong reinforced concrete retaining walls, and handle all NBRO (National Building Research Organisation) approvals for you.",
  },
  {
    question: "How do you protect clients from rising material costs?",
    answer: "We provide an itemized Bill of Quantities (BOQ) with guaranteed fixed pricing. We source steel, cement, and quality materials in advance at wholesale rates, so the price we agree on in your contract is locked in and protected against sudden market increases.",
  },
  {
    question: "Do you handle municipal council and government building approvals?",
    answer: "Yes, our turnkey service includes all paperwork and permits: local Pradeshiya Sabha / Municipal Council approvals, Urban Development Authority (UDA) clearances, and electricity & water utility connections.",
  },
  {
    question: "What warranties and support do you give after construction?",
    answer: "Every CONTEC build includes 1 full year of free repairs for any defects. We also provide a 25-year structural warranty on concrete foundations and frames, plus a 10-year leak-free warranty on all roofs and waterproofing.",
  },
];

interface TypologyOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
}

const TYPOLOGY_OPTIONS: TypologyOption[] = [
  { id: "Hillside Villa / Luxury House", label: "Hillside Villa / Luxury House", icon: Home, desc: "Custom homes designed for hill slopes and scenic views" },
  { id: "Commercial Building / Shop / Hotel", label: "Commercial / Shop / Hotel", icon: Building2, desc: "Offices, retail shops, restaurants, and boutique hotels" },
  { id: "Complete Home Renovation", label: "Complete Home Renovation", icon: Hammer, desc: "Upgrades, structural repairs, and modern extensions" },
  { id: "Roof Waterproofing & Structural Repairs", label: "Roof Waterproofing & Repairs", icon: ShieldCheck, desc: "Roof leak repair, damp proofing, and maintenance" },
  { id: "Solar Power & Retaining Walls", label: "Solar Power & Retaining Walls", icon: Zap, desc: "Rooftop solar setups, retaining walls, and earthworks" },
];

const TERRAIN_OPTIONS = [
  "Hillside / Sloping Land",
  "Flat Land / Urban Plot",
  "Lakefront / Riverfront",
  "Old House to Demolish & Rebuild",
];

const BUDGET_OPTIONS = [
  { label: "LKR 45M – 100M", desc: "Standard / Luxury House (3,000–4,500 sq ft)" },
  { label: "LKR 100M – 250M", desc: "Large Luxury Home / Villa (5,000–8,500 sq ft)" },
  { label: "LKR 250M – 750M", desc: "Commercial Building / Multi-Unit Project" },
  { label: "LKR 750M+", desc: "Major Development / Large Commercial Complex" },
];

const TIMELINE_OPTIONS = [
  "Immediately (within 3 months)",
  "In 6 to 12 months",
  "In 1 to 2 years",
  "Still in early planning",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    projectType: "Hillside Villa / Luxury House",
    terrain: "Hillside / Sloping Land",
    location: "",
    budget: "LKR 45M – 100M",
    timeline: "In 6 to 12 months",
    message: "",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);

  // Custom Dropdown Menus States & Click-Outside Handling
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const budgetRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setBudgetOpen(false);
      }
      if (timelineRef.current && !timelineRef.current.contains(event.target as Node)) {
        setTimelineOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          message: `[Terrain: ${formData.terrain}] ${formData.message}`,
        }),
      });
      const data = await res.json();
      if (data.inquiryId) {
        setInquiryId(data.inquiryId);
      }
    } catch (err) {
      console.warn("Inquiry dispatch error", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col justify-between selection:bg-[#0038B8] selection:text-white">
      <Navbar />

      <main className="pt-28 pb-20 overflow-hidden">
        {/* ================= HERO SECTION ================= */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Luminous Glow in Background */}
          <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-[#0038B8]/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-20 right-10 w-[400px] h-[250px] bg-[#FFB800]/10 rounded-full blur-[130px] pointer-events-none" />

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.98] max-w-5xl mb-6">
            <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">Let's Build Your</span>{" "}
            <span className="gradient-text-gold">CONTEC</span>{" "}
            <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">Dream Project</span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed font-light">
            Whether you are planning a hillside home in Kandy, a modern commercial building, or a complete renovation, our experienced architects and engineers are here to guide you every step of the way.
          </p>

          {/* Quick Action Channels Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            <a
              href="https://wa.me/94777812141?text=Hello%20CONTEC%2C%20I%20would%20like%20to%20inquire%20about%20a%20new%20building%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#080e1c]/80 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all duration-300 group flex items-center gap-3.5 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">WhatsApp Priority</span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate block">+94 77 781 2141</span>
              </div>
            </a>

            <a
              href="tel:+94777812141"
              className="p-4 rounded-2xl bg-[#080e1c]/80 border border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-600/10 transition-all duration-300 group flex items-center gap-3.5 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">Kandy Main Office</span>
                <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate block">+94 77 781 2141</span>
              </div>
            </a>

            <a
              href="mailto:conteckandy@gmail.com"
              className="p-4 rounded-2xl bg-[#080e1c]/80 border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10 transition-all duration-300 group flex items-center gap-3.5 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#FFB800] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFB800] block">Official Email</span>
                <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate block">conteckandy@gmail.com</span>
              </div>
            </a>

            <div className="p-4 rounded-2xl bg-[#080e1c]/80 border border-white/10 flex items-center gap-3.5 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-zinc-300 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Office Hours</span>
                <span className="text-sm font-bold text-white truncate block">Mon–Sat: 08:30 – 18:00</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MAIN INTERACTIVE CONSULTATION SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* Left 7 Columns: Interactive Consultation Form */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-blue-500/30 bg-[#080e1c]/85 shadow-2xl relative overflow-hidden">
                
                {submitted ? (
                  <div className="py-16 text-center animate-fadeIn">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 text-3xl font-bold border border-emerald-500/40 shadow-xl shadow-emerald-950/50">
                      ✓
                    </div>
                    <span className="text-xs font-bold text-[#FFB800] uppercase tracking-widest block mb-2">
                      Inquiry Received Successfully
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                      Thank You for Reaching Out
                    </h3>
                    
                    {inquiryId && (
                      <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-300 mb-5">
                        Inquiry Reference: <span className="font-semibold text-[#FFB800]">{inquiryId}</span>
                      </div>
                    )}
                    
                    <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed mb-8 font-light">
                      Thank you, <strong className="text-white">{formData.fullName}</strong>. We have received your inquiry for a <strong className="text-[#FFB800]">{formData.projectType}</strong>. Our architect and engineer will review your details and contact you at <strong className="text-white">{formData.email}</strong> or by phone within 24–48 hours.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href={`https://wa.me/94777812141?text=Hello%20CONTEC%2C%20I%20have%20submitted%20project%20inquiry%20${inquiryId || ""}%20under%20the%20name%20${encodeURIComponent(formData.fullName)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        <span>Chat on WhatsApp Now</span>
                      </a>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            fullName: "",
                            email: "",
                            phone: "",
                            projectType: "Hillside Villa / Luxury House",
                            terrain: "Hillside / Sloping Land",
                            location: "",
                            budget: "LKR 45M – 100M",
                            timeline: "In 6 to 12 months",
                            message: "",
                          });
                        }}
                        className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Header */}
                    <div className="border-b border-white/10 pb-5">
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Start Your Project Inquiry
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Tell us about your land and ideas so our architects and engineers can provide practical advice and clear estimates.
                      </p>
                    </div>

                    {/* 1. Project Typology Visual Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center justify-between">
                        <span>1. What type of project are you planning? <span className="text-[#FFB800]">*</span></span>
                        <span className="text-[11px] text-[#FFB800] font-normal">Choose Project Type</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TYPOLOGY_OPTIONS.map((opt) => {
                          const isSelected = formData.projectType === opt.id;
                          const IconComponent = opt.icon;
                          const isFullWidth = opt.id === "Solar Power & Retaining Walls";
                          return (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() => setFormData({ ...formData, projectType: opt.id })}
                              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                                isFullWidth ? "sm:col-span-2" : ""
                              } ${
                                isSelected
                                  ? "bg-gradient-to-r from-[#0038B8]/30 via-[#0038B8]/15 to-[#080e1c] border-[#FFB800] shadow-lg shadow-amber-500/10 ring-1 ring-[#FFB800]"
                                  : "bg-black/40 border-white/10 hover:border-white/25 hover:bg-white/[0.04]"
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? "bg-[#FFB800] text-black shadow-md shadow-amber-500/30"
                                    : "bg-white/[0.06] text-zinc-300 border border-white/10"
                                }`}
                              >
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={`text-xs font-bold block ${isSelected ? "text-white" : "text-zinc-200"}`}>
                                  {opt.label}
                                </span>
                                <span className="text-[11px] text-zinc-400 block line-clamp-1 mt-0.5">
                                  {opt.desc}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Client Identity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                          Full Name <span className="text-[#FFB800]">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="e.g. Nimal Perera"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/30 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                          Email Address <span className="text-[#FFB800]">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="yourname@gmail.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/30 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Phone & Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                          Phone Number / WhatsApp <span className="text-[#FFB800]">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+94 77 123 4567"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/30 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                          Land Location / Town
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Kandy, Digana, Peradeniya, Katugastota"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/30 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Terrain & Land Characteristics */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2.5">
                        What is your land like?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TERRAIN_OPTIONS.map((terrain) => {
                          const isSelected = formData.terrain === terrain;
                          return (
                            <button
                              type="button"
                              key={terrain}
                              onClick={() => setFormData({ ...formData, terrain })}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#FFB800] text-black font-bold shadow-md shadow-amber-500/20"
                                  : "bg-white/[0.05] border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {terrain}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 5. Investment Range & Timeline (Custom Themed Dropdowns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Budget Dropdown */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                          Estimated Budget (LKR)
                        </label>
                        <div className="relative" ref={budgetRef}>
                          <button
                            type="button"
                            onClick={() => {
                              setBudgetOpen(!budgetOpen);
                              setTimelineOpen(false);
                            }}
                            className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                              budgetOpen
                                ? "border-[#FFB800] ring-1 ring-[#FFB800]/30 bg-black/80 shadow-lg shadow-amber-500/10"
                                : "border-white/15 hover:border-white/30 text-white"
                            }`}
                          >
                            <span className="font-semibold text-white truncate">
                              {formData.budget}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 shrink-0 ml-2 ${
                                budgetOpen ? "rotate-180 text-[#FFB800]" : "text-zinc-400"
                              }`}
                            />
                          </button>

                          {budgetOpen && (
                            <div className="absolute left-0 right-0 top-full mt-2 z-50 p-1.5 rounded-2xl bg-[#080e1c] border border-blue-500/40 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-1 max-h-72 overflow-y-auto ring-1 ring-black/80">
                              {BUDGET_OPTIONS.map((b) => {
                                const isSelected = formData.budget === b.label;
                                return (
                                  <button
                                    type="button"
                                    key={b.label}
                                    onClick={() => {
                                      setFormData({ ...formData, budget: b.label });
                                      setBudgetOpen(false);
                                    }}
                                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                                      isSelected
                                        ? "bg-gradient-to-r from-[#0038B8]/40 via-[#0038B8]/20 to-transparent border border-[#FFB800]/50 text-white shadow-md"
                                        : "hover:bg-white/[0.08] text-zinc-300 hover:text-white"
                                    }`}
                                  >
                                    <div className="min-w-0 pr-2">
                                      <span className={`text-xs block ${isSelected ? "font-bold text-[#FFB800]" : "font-medium text-white"}`}>
                                        {b.label}
                                      </span>
                                      <span className="text-[11px] text-zinc-400 block truncate mt-0.5">
                                        {b.desc}
                                      </span>
                                    </div>
                                    {isSelected && (
                                      <Check className="w-4 h-4 text-[#FFB800] shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timeline Dropdown */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                          When would you like to start?
                        </label>
                        <div className="relative" ref={timelineRef}>
                          <button
                            type="button"
                            onClick={() => {
                              setTimelineOpen(!timelineOpen);
                              setBudgetOpen(false);
                            }}
                            className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                              timelineOpen
                                ? "border-[#FFB800] ring-1 ring-[#FFB800]/30 bg-black/80 shadow-lg shadow-amber-500/10"
                                : "border-white/15 hover:border-white/30 text-white"
                            }`}
                          >
                            <span className="font-semibold text-white truncate">
                              {formData.timeline}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 shrink-0 ml-2 ${
                                timelineOpen ? "rotate-180 text-[#FFB800]" : "text-zinc-400"
                              }`}
                            />
                          </button>

                          {timelineOpen && (
                            <div className="absolute left-0 right-0 top-full mt-2 z-50 p-1.5 rounded-2xl bg-[#080e1c] border border-blue-500/40 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-1 ring-1 ring-black/80">
                              {TIMELINE_OPTIONS.map((t) => {
                                const isSelected = formData.timeline === t;
                                return (
                                  <button
                                    type="button"
                                    key={t}
                                    onClick={() => {
                                      setFormData({ ...formData, timeline: t });
                                      setTimelineOpen(false);
                                    }}
                                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                                      isSelected
                                        ? "bg-gradient-to-r from-[#0038B8]/40 via-[#0038B8]/20 to-transparent border border-[#FFB800]/50 text-white shadow-md"
                                        : "hover:bg-white/[0.08] text-zinc-300 hover:text-white"
                                    }`}
                                  >
                                    <span className={`text-xs ${isSelected ? "font-bold text-[#FFB800]" : "font-medium text-white"}`}>
                                      {t}
                                    </span>
                                    {isSelected && (
                                      <Check className="w-4 h-4 text-[#FFB800] shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 6. Message */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                        Tell us about your project & requirements
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us what you'd like to build: number of bedrooms, floors, special features (solar power, garden, scenic views), or repair requirements..."
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/30 transition-all"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-[#FFB800] to-[#F59E0B] hover:brightness-110 text-black font-extrabold text-sm tracking-wider uppercase transition-all shadow-xl shadow-amber-500/25 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                          <span>Sending your inquiry to our team...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Inquiry & Request Consultation</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Confidential & Secure • Zero Spam Guarantee • Response within 24–48 Hours</span>
                    </div>
                  </form>
                )}

              </div>
            </div>

            {/* Right 5 Columns: Studio Locations & Priority Consultation */}
            <div className="lg:col-span-5 space-y-6">

              {/* Card 1: Head Office & Studio */}
              <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-blue-500/25 bg-[#080e1c]/80 shadow-2xl space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs uppercase font-bold text-[#FFB800] tracking-widest flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      <span>Head Office & Studio</span>
                    </h3>
                    <span className="text-[11px] text-zinc-400 font-medium">Kandy, Sri Lanka</span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white">
                    Kandy Main Office
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                    No. 167, George E. De Silva Mawatha, Kandy, Sri Lanka, 20000
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Direct Phone / WhatsApp:</span>
                    <a href="tel:+94777812141" className="text-[#FFB800] font-bold hover:underline">
                      +94 77 781 2141
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Office Email:</span>
                    <a href="mailto:conteckandy@gmail.com" className="text-zinc-200 hover:text-[#FFB800]">
                      conteckandy@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Visiting Hours:</span>
                    <span className="text-zinc-300 font-medium">Mon–Sat: 08:30 – 18:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Specialty:</span>
                    <span className="text-zinc-300 font-medium truncate ml-2">Hillside Homes, Retaining Walls & Luxury Builds</span>
                  </div>
                </div>

                {/* Dark Styled Map Embed */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/10 shadow-inner group">
                  <iframe
                    title="CONTEC Kandy Head Office Map"
                    src="https://maps.google.com/maps?q=George+E.+De+Silva+Mawatha,+Kandy,+Sri+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 filter invert-[90%] hue-rotate-180 contrast-[110%] brightness-[90%]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href="https://maps.google.com/?q=George+E.+De+Silva+Mawatha,+Kandy,+Sri+Lanka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2.5 right-2.5 px-3.5 py-1.5 rounded-lg bg-black/85 hover:bg-[#FFB800] hover:text-black text-white text-[11px] font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 shadow-lg"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Open Directions ↗</span>
                  </a>
                </div>
              </div>

              {/* Card 2: Priority Consultation & Client Guarantees */}
              <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#0038B8]/20 via-[#080e1c]/90 to-amber-950/20 shadow-2xl relative overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#0038B8]/15 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Free On-Site Feasibility Check</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-semibold">Kandy District</span>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Prefer an In-Person Meeting or Site Visit?
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed mt-1 font-light">
                      Building on a hillside or have architectural questions? Our chartered architect and senior structural engineer can inspect your land in Kandy for a free initial evaluation.
                    </p>
                  </div>

                  {/* Direct Action Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <a
                      href="https://wa.me/94777812141?text=Hello%20CONTEC%20Architect%2C%20I%20would%20like%20to%20request%20a%20site%20visit%20and%20consultation%20for%20my%20land%20in%20Kandy."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                      <svg className="w-4 h-4 fill-currentColor shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span>Chat on WhatsApp ↗</span>
                    </a>

                    <a
                      href="tel:+94777812141"
                      className="p-3 rounded-2xl bg-[#0038B8]/25 hover:bg-[#0038B8]/40 border border-blue-500/40 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md group"
                    >
                      <Phone className="w-4 h-4 text-[#FFB800] shrink-0" />
                      <span>Call Chief Engineer</span>
                    </a>
                  </div>
                </div>

                {/* 4 Trust Commitments */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider block">
                    Our Guarantees to Every Client
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>CIDA Grade CS2 Certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>100% Guaranteed Fixed BOQ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Chartered Architects & Engs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>25-Yr Structural Warranty</span>
                    </div>
                  </div>
                </div>

                {/* 3 Metric Highlights */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-sm font-extrabold text-[#FFB800] block">100%</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Fixed BOQ</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-sm font-extrabold text-blue-400 block">48 Hours</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Concept</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-sm font-extrabold text-emerald-400 block">25 Years</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Warranty</span>
                  </div>
                </div>

                {/* Client Quote Strip */}
                <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
                      ))}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      Verified Client
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 italic leading-snug">
                    &ldquo;CONTEC built our hillside villa in Digana with exceptional engineering and zero budget surprises.&rdquo;
                  </p>
                  <span className="text-[10px] text-[#FFB800] font-semibold block">
                    — Eng. R. Wickramasinghe, Digana Residence
                  </span>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ================= SECTION: 4-STEP DISCOVERY TIMELINE ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10 mt-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold text-[#FFB800] tracking-widest block mb-3">
              Simple & Clear Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              How We Work <span className="gradient-text-gold">With You</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-3">
              A clear, step-by-step process from your first meeting to moving into your completed building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "First Meeting & Site Visit",
                time: "Days 1–2",
                desc: "We visit your land, inspect the ground slope, and discuss your family's lifestyle, ideas, and budget.",
                icon: Layers,
              },
              {
                step: "02",
                title: "3D House Design & Floor Plans",
                time: "Days 3–7",
                desc: "Realistic 3D exterior visuals, room layouts, and smart ventilation/sunlight planning tailored to your land.",
                icon: Compass,
              },
              {
                step: "03",
                title: "Clear Cost Estimate (BOQ)",
                time: "Days 8–14",
                desc: "Complete itemized material breakdown and fixed pricing agreement so there are no unexpected surprises.",
                icon: Building2,
              },
              {
                step: "04",
                title: "Approvals & Start Construction",
                time: "Month 1",
                desc: "We handle all municipal council approvals and NBRO permits, then begin quality construction on site.",
                icon: ShieldCheck,
              },
            ].map((st, i) => (
              <div
                key={i}
                className="relative p-6 rounded-2xl bg-[#080e1c]/80 border border-white/10 hover:border-blue-500/40 transition-all duration-300 group shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#FFB800]">{st.step}</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300">
                    {st.time}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#FFB800] transition-colors">
                  {st.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION: FREQUENTLY ASKED QUESTIONS ================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-white/10">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block mb-2">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              Frequently Asked <span className="gradient-text-gold">Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#080e1c]/70 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#FFB800] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 animate-fadeIn">
                      {faq.answer}
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
