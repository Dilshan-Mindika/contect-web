"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ChevronDown,
  Calendar,
  Layers,
  ArrowRight,
  Compass,
  Home,
  Hammer,
  Zap,
  User
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
    answer: "Every CONTEC build includes 1 full year of free repairs for any defects. We also provide a 25-year structural warranty on concrete foundations and frames, plus a 10-year leak-free warranty on roofs and waterproofing backed by our House Master division.",
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
  { id: "House Master (Waterproofing & Repairs)", label: "House Master Home Care", icon: ShieldCheck, desc: "Roof leak repair, damp proofing, and maintenance" },
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

  const [activeTab, setActiveTab] = useState<"Kandy HQ" | "Colombo Hub">("Kandy HQ");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);

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
            Whether you are planning a hillside home in Kandy, a modern commercial building, a complete renovation, or need roof waterproofing with House Master, our experienced architects and engineers are here to guide you every step of the way.
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
                <MessageSquare className="w-5 h-5" />
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

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
                      <div className="inline-block px-4 py-2 bg-white/10 border border-[#FFB800]/50 rounded-xl text-xs font-mono text-[#FFB800] mb-5">
                        Inquiry Reference ID: {inquiryId}
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
                        <MessageSquare className="w-4 h-4" />
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
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Start Your Project Inquiry
                          </h2>
                          <p className="text-xs text-zinc-400 mt-1">
                            Tell us about your land and ideas so our architects and engineers can provide practical advice and clear estimates.
                          </p>
                        </div>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#0038B8]/30 border border-[#0038B8]/50 text-[#FFB800]">
                          CIDA Grade CS2 Certified
                        </span>
                      </div>
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
                            placeholder="e.g. Kandy, Digana, Peradeniya, Colombo, Galle"
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

                    {/* 5. Investment Range & Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                          Estimated Budget (LKR)
                        </label>
                        <div className="relative">
                          <select
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/15 text-xs text-white focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/30 transition-all cursor-pointer appearance-none"
                          >
                            {BUDGET_OPTIONS.map((b) => (
                              <option key={b.label} value={b.label}>
                                {b.label} • {b.desc}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                          When would you like to start?
                        </label>
                        <div className="relative">
                          <select
                            value={formData.timeline}
                            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/15 text-xs text-white focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/30 transition-all cursor-pointer appearance-none"
                          >
                            {TIMELINE_OPTIONS.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

            {/* Right 5 Columns: Studio Locations & Interactive Maps */}
            <div className="lg:col-span-5 space-y-6">

              {/* Location Tabs Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/25 bg-[#080e1c]/80 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs uppercase font-bold text-[#FFB800] tracking-widest flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    <span>Our Offices</span>
                  </h3>

                  <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10">
                    <button
                      onClick={() => setActiveTab("Kandy HQ")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "Kandy HQ"
                          ? "bg-[#0038B8] text-white shadow-md"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Kandy Main Office
                    </button>
                    <button
                      onClick={() => setActiveTab("Colombo Hub")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "Colombo Hub"
                          ? "bg-[#0038B8] text-white shadow-md"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Colombo
                    </button>
                  </div>
                </div>

                {activeTab === "Kandy HQ" ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Kandy Main Office (Headquarters)</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-400">7.2906° N, 80.6337° E</span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      No. 167, George E. De Silva Mawatha, Kandy, Sri Lanka, 20000
                    </p>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
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
                        <span className="text-zinc-400">Specialty:</span>
                        <span className="text-zinc-300 font-medium">Hillside Homes, Retaining Walls & Luxury Construction</span>
                      </div>
                    </div>

                    {/* Dark Styled Map Embed */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/10 shadow-inner group mt-4">
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
                        className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-[#FFB800] hover:text-black text-white text-[11px] font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 shadow-lg"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Open Directions ↗</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Colombo Consultation Office</span>
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-400">World Trade Center</span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Level 12, West Tower, World Trade Center, Colombo 01, Sri Lanka
                    </p>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Appointments:</span>
                        <span className="text-[#FFB800] font-bold">By Prior Booking</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Direct Hotline:</span>
                        <a href="tel:+94777812141" className="text-zinc-200 hover:text-[#FFB800]">
                          +94 77 781 2141
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Specialty:</span>
                        <span className="text-zinc-300 font-medium">Commercial Buildings & Urban Properties</span>
                      </div>
                    </div>

                    {/* Dark Styled Map Embed for Colombo */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/10 shadow-inner group mt-4">
                      <iframe
                        title="CONTEC Colombo Office Map"
                        src="https://maps.google.com/maps?q=World+Trade+Center,+Colombo,+Sri+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        className="w-full h-full border-0 filter invert-[90%] hue-rotate-180 contrast-[110%] brightness-[90%]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <a
                        href="https://maps.google.com/?q=World+Trade+Center,+Colombo,+Sri+Lanka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-[#FFB800] hover:text-black text-white text-[11px] font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 shadow-lg"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Open Directions ↗</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* House Master Division Card */}
              <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-blue-500/30 bg-[#0038B8]/15 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold text-[#FFB800] tracking-wider">
                      House Master Kandy
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-[#FFB800] text-black font-extrabold uppercase">
                      Home Repairs & Care
                    </span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  Emergency roof waterproofing, damp proofing, foundation inspection, plumbing & electrical repairs, and routine maintenance for homes across Kandy and the Central Province.
                </p>

                <a
                  href="https://wa.me/94777812141?text=Hello%20CONTEC%2C%20I%20would%20like%20to%20book%20a%20House%20Master%20inspection%20for%20my%20home."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0038B8]/30 hover:bg-[#0038B8]/50 border border-[#0038B8]/60 text-white text-xs font-bold transition-all shadow-md group"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Book House Master on WhatsApp</span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-[#FFB800]">↗</span>
                </a>
              </div>

              {/* Guarantees & Credentials */}
              <div className="p-6 rounded-3xl bg-[#080e1c]/60 border border-white/10 space-y-3.5">
                <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                  Why Clients Trust Us
                </span>
                {[
                  "CIDA Grade CS2 Certified Building Contractor",
                  "Qualified Chartered Architects & Structural Engineers",
                  "Itemized BOQ with Guaranteed Fixed Pricing (No hidden costs)",
                  "1-Year Free Maintenance & 25-Year Structural Warranty"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* ================= SECTION: 4-STEP DISCOVERY TIMELINE ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10 mt-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0038B8]/25 border border-[#0038B8]/40 text-[#FFB800] text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Simple & Clear Process</span>
            </div>
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
                  <span className="text-2xl font-black text-[#FFB800] font-mono">{st.step}</span>
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
