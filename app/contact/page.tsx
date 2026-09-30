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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0038B8]/20 border border-[#0038B8]/40 text-[#FFB800] text-xs font-bold tracking-wider uppercase backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
            Direct Architectural Inquiries
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] max-w-4xl mb-6">
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
                          <option>Alpine / Mountain Residence</option>
                          <option>Coastal Cliff Estate</option>
                          <option>Urban Biophilic Penthouse</option>
                          <option>Off-Grid Forest Pod</option>
                          <option>Commercial / Hospitality</option>
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

            {/* Right Column: Global Studios & Contacts */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Studio Cards */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/25 bg-[#080e1c]/60">
                <h3 className="text-xs uppercase font-bold text-[#FFB800] tracking-widest mb-6">
                  Global Architecture Studios
                </h3>

                <div className="space-y-6">
                  {[
                    {
                      city: "Zurich (Global Headquarters)",
                      address: "Bahnhofstrasse 45, 8001 Zürich, Switzerland",
                      phone: "+41 44 892 1000",
                      email: "zurich@contec-build.com",
                      hours: "Mon–Fri: 08:30 – 18:30 CET",
                    },
                    {
                      city: "London Design Lab",
                      address: "100 Bishopsgate, London EC2N 4AG, UK",
                      phone: "+44 20 7946 0920",
                      email: "london@contec-build.com",
                      hours: "Mon–Fri: 09:00 – 18:00 GMT",
                    },
                    {
                      city: "New York Studio",
                      address: "432 Park Avenue, New York, NY 10022, USA",
                      phone: "+1 212 555 0198",
                      email: "ny@contec-build.com",
                      hours: "Mon–Fri: 09:00 – 17:30 EST",
                    },
                  ].map((studio) => (
                    <div key={studio.city} className="pb-5 border-b border-white/10 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-base font-bold text-white">{studio.city}</h4>
                        <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">{studio.address}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-zinc-300">
                        <a href={`tel:${studio.phone}`} className="hover:text-[#FFB800] transition-colors">
                          {studio.phone}
                        </a>
                        <a href={`mailto:${studio.email}`} className="text-[#FFB800] hover:text-amber-200 transition-colors">
                          {studio.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Partner Contacts */}
              <div className="glass-panel p-6 rounded-3xl border border-[#0038B8]/40 bg-[#0038B8]/15">
                <h4 className="text-xs uppercase font-bold text-[#FFB800] tracking-wider mb-2">
                  Direct Principal Consultation
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  For confidential high-value acquisitions or rapid zoning approvals, connect directly with our founding partners.
                </p>
                <a
                  href="mailto:partners@contec-build.com"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FFB800] hover:text-amber-200 transition-colors"
                >
                  <span>partners@contec-build.com</span>
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
