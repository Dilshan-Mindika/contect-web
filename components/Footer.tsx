import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#08080f] border-t border-white/10 text-white overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
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
              <span className="text-white font-bold text-xl tracking-tight">
                Eco<span className="text-zinc-300 font-light">Dream</span>
              </span>
            </Link>
            
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
              Pioneering the next era of architecture and luxury living through zero-emission engineering, robotic pre-fabrication, and bespoke sustainable construction.
            </p>

            <div className="flex items-center gap-3">
              {["Passivhaus Institute", "LEED Platinum", "Cradle to Cradle"].map((cert) => (
                <span
                  key={cert}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.05] border border-white/10 text-emerald-300/90"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase font-bold text-zinc-300 tracking-wider mb-4">Architecture</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">Home Experience</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">About Our Studio</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-400 transition-colors">Services & Delivery</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-emerald-400 transition-colors">Project Portfolio</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">Book Consultation</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-xs uppercase font-bold text-zinc-300 tracking-wider mb-4">Core Capabilities</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/services#parametric" className="hover:text-emerald-400 transition-colors">Parametric Architecture</Link>
              </li>
              <li>
                <Link href="/services#prefab" className="hover:text-emerald-400 transition-colors">Robotic Pre-fabrication</Link>
              </li>
              <li>
                <Link href="/services#offgrid" className="hover:text-emerald-400 transition-colors">Off-Grid Microgrids</Link>
              </li>
              <li>
                <Link href="/services#turnkey" className="hover:text-emerald-400 transition-colors">Turnkey Luxury Handover</Link>
              </li>
              <li>
                <Link href="/services#materials" className="hover:text-emerald-400 transition-colors">Low-Carbon Materiality</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studios & Contact */}
          <div>
            <h4 className="text-xs uppercase font-bold text-zinc-300 tracking-wider mb-4">Global Studios</h4>
            <div className="flex flex-col gap-3 text-xs text-zinc-400 leading-relaxed">
              <div>
                <p className="text-white font-semibold">Zurich (HQ)</p>
                <p>Bahnhofstrasse 45, 8001 Zürich</p>
              </div>
              <div>
                <p className="text-white font-semibold">London Studio</p>
                <p>100 Bishopsgate, London EC2N 4AG</p>
              </div>
              <div>
                <p className="text-white font-semibold">New York Office</p>
                <p>432 Park Avenue, New York, NY 10022</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} EcoDream Architecture & Construction AG. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Sustainability Report 2026</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
