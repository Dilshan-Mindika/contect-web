import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-[#04060d] border-t border-white/10 text-white overflow-hidden">
      {/* Background ambient glow in CONTEC Royal Blue */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#0038B8]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative h-10 sm:h-12 w-36 sm:w-48">
                <Image
                  src="/branding/logo nav.png"
                  alt="CONTEC Design & Build"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
              Building Visions, Designing Futures. CONTEC pioneers modern architectural excellence, aerospace-grade structural prefabrication, and sustainable luxury construction.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              {["Passivhaus Certified", "LEED Platinum", "ISO 9001:2015", "Zero-Carbon 2030"].map((cert) => (
                <span
                  key={cert}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#0038B8]/15 border border-[#0038B8]/30 text-[#FFB800]"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase font-bold text-[#FFB800] tracking-wider mb-4">Architecture</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/" className="hover:text-[#FFB800] transition-colors">Home Experience</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFB800] transition-colors">About Our Studio</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#FFB800] transition-colors">Services & Engineering</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#FFB800] transition-colors">Project Portfolio</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FFB800] transition-colors">Book Consultation</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-xs uppercase font-bold text-[#FFB800] tracking-wider mb-4">Core Capabilities</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/services#parametric" className="hover:text-[#FFB800] transition-colors">Parametric Architecture</Link>
              </li>
              <li>
                <Link href="/services#prefab" className="hover:text-[#FFB800] transition-colors">Robotic Pre-fabrication</Link>
              </li>
              <li>
                <Link href="/services#offgrid" className="hover:text-[#FFB800] transition-colors">Off-Grid Solar Microgrids</Link>
              </li>
              <li>
                <Link href="/services#turnkey" className="hover:text-[#FFB800] transition-colors">Turnkey Luxury Handover</Link>
              </li>
              <li>
                <Link href="/services#materials" className="hover:text-[#FFB800] transition-colors">Mass Timber & Concrete</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studios & Contact */}
          <div>
            <h4 className="text-xs uppercase font-bold text-[#FFB800] tracking-wider mb-4">Global Studios</h4>
            <div className="flex flex-col gap-3 text-xs text-zinc-400 leading-relaxed">
              <div>
                <p className="text-white font-semibold">Zurich (Headquarters)</p>
                <p>Bahnhofstrasse 45, 8001 Zürich</p>
              </div>
              <div>
                <p className="text-white font-semibold">London Design Lab</p>
                <p>100 Bishopsgate, London EC2N 4AG</p>
              </div>
              <div>
                <p className="text-white font-semibold">New York Studio</p>
                <p>432 Park Avenue, New York, NY 10022</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} CONTEC Design & Build. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#FFB800] transition-colors">Sustainability Report 2026</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
