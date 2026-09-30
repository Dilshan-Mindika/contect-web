"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    projectType: "Alpine / Mountain Residence",
    location: "",
    budget: "$2M - $5M",
    timeline: "Within 6–12 months",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-20">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0038B8]/25 border border-[#0038B8]/50 text-[#FFB800] text-xs font-bold tracking-wider uppercase backdrop-blur-md mb-6 text-shadow-sub">
            Direct Architectural Inquiries
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] max-w-4xl mb-6 text-shadow-heading">
            Initiate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-slate-100 to-blue-300">CONTEC</span> Project
          </h1>

          <p className="text-zinc-300 text-lg sm:text-xl max-w-3xl leading-relaxed font-light">
            Whether you hold land in the Alps, coastal Mediterranean, or an urban setting, our principal architects and structural engineers will review your project parameters within 48 hours.
          </p>
        </section>

        {/* Main 2-Column Section: Form + Studio Details */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left Column: Interactive Consultation Booking Form */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-blue-500/25 bg-[#080e1c]/60 shadow-2xl">
                
                {submitted ? (
                  <div className="py-16 text-center animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-[#0038B8]/30 text-[#FFB800] flex items-center justify-center mx-auto mb-6 text-2xl font-bold border border-[#FFB800]/40">
                      ✓
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Consultation Request Received
                    </h3>
                    <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed mb-6 font-light">
                      Thank you, {formData.fullName}. A principal architect from CONTEC Design & Build will review your site specifications and contact you at {formData.email}.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-full border border-[#FFB800]/40 text-[#FFB800] text-xs font-bold hover:bg-[#FFB800] hover:text-black transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-xl font-bold text-white">Project Consultation Form</h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Please provide initial details regarding your property and architectural vision.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Lord / Lady / Dr. / Mr. / Ms."
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="client@domain.com"
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+41 / +44 / +1 ..."
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                          Project Location / Country
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g. Valais Switzerland / Malibu / Aspen"
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                          Project Typology
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/15 text-xs text-white focus:outline-none focus:border-[#FFB800] transition-colors"
                        >
                          <option>Hillside Luxury Villa / Custom Residence</option>
                          <option>Turnkey Commercial & Mixed-Use Build</option>
                          <option>Complete Home Renovation & Remodeling</option>
                          <option>House Master Inspection & Maintenance</option>
                          <option>Hillside Structural & Solar Microgrid</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                          Investment Range
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/15 text-xs text-white focus:outline-none focus:border-[#FFB800] transition-colors"
                        >
                          <option>$1.5M - $3M</option>
                          <option>$3M - $6M</option>
                          <option>$6M - $12M</option>
                          <option>$12M+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                          Target Timeline
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/15 text-xs text-white focus:outline-none focus:border-[#FFB800] transition-colors"
                        >
                          <option>Within 6–12 months</option>
                          <option>1–2 Years</option>
                          <option>Long-term Planning</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                        Project Vision & Site Specifications
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about the property terrain, architectural aspirations, desired off-grid capabilities..."
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFB800] transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-[#FFB800] hover:bg-[#F59E0B] text-black font-extrabold text-sm tracking-wide uppercase transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      Submit Project Discovery Request ↗
                    </button>

                    <p className="text-center text-[11px] text-zinc-500">
                      All submissions are strictly protected under non-disclosure confidentiality.
                    </p>
                  </form>
                )}

              </div>
            </div>

            {/* Right Column: ConTec Kandy Office & Contacts */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Studio Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/25 bg-[#080e1c]/80 shadow-2xl">
                <h3 className="text-xs uppercase font-bold text-[#FFB800] tracking-widest mb-6">
                  ConTec Kandy Headquarters
                </h3>

                <div className="space-y-6">
                  <div className="pb-5 border-b border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-base font-bold text-white">Main Office & Consultation Lab</h4>
                      <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
                    </div>
                    <p className="text-xs text-zinc-300 mb-2 leading-relaxed">
                      No. 167, George E. De Silva Mawatha, Kandy 20000, Sri Lanka
                    </p>
                    <div className="flex flex-col gap-2 text-xs text-zinc-300 mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#FFB800] font-bold">Hotline / WhatsApp:</span>
                        <a href="tel:+94777812141" className="hover:text-[#FFB800] font-semibold transition-colors">
                          +94 77 781 2141
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#FFB800] font-bold">Email:</span>
                        <a href="mailto:conteckandy@gmail.com" className="hover:text-amber-200 transition-colors">
                          conteckandy@gmail.com
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400">Working Hours:</span>
                        <span>Mon–Sat: 08:30 – 18:00 (IST)</span>
                      </div>
                    </div>
                  </div>

                  {/* Facebook & Social Connect */}
                  <div className="pt-1">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Social Connect</h5>
                    <a
                      href="https://www.facebook.com/conteckandy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0038B8]/30 border border-[#0038B8]/50 text-[#FFB800] text-xs font-bold hover:bg-[#0038B8]/60 transition-all shadow-md"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>Visit facebook.com/conteckandy ↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* House Master Property Care Services Card */}
              <div className="glass-panel p-6 rounded-3xl border border-[#0038B8]/40 bg-[#0038B8]/20 shadow-xl">
                <h4 className="text-xs uppercase font-bold text-[#FFB800] tracking-wider mb-2 flex items-center gap-2">
                  <span>House Master Kandy</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FFB800] text-black font-extrabold">Property Care</span>
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  Full-service building maintenance, waterproofing, electrical & plumbing overhauls, exterior painting, and structural inspections across Kandy & the Central Province.
                </p>
                <a
                  href="https://wa.me/94777812141?text=Hello%20ConTec%2C%20I%20would%20like%20to%20request%20House%20Master%20maintenance%20service."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FFB800] hover:text-amber-200 transition-colors"
                >
                  <span>Book House Master Inspection on WhatsApp</span>
                  <span>↗</span>
                </a>
              </div>

            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
