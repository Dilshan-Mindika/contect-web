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
              <div className="relative h-10 sm:h-12 w-44 sm:w-52">
                <Image
                  src="/branding/contec-white-logo.png"
                  alt="CONTEC Design & Build"
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            </Link>
            
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
              Building Visions, Designing Futures. CONTEC is Kandy&apos;s premier design &amp; build firm, specializing in custom luxury homes, modern commercial buildings, and professional property care.
            </p>

            {/* Theme-Aligned Official Social Media Links */}
            <div className="flex items-center gap-2.5">
              {[
                {
                  name: "Facebook",
                  href: "https://www.facebook.com/conteckandy",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  name: "Instagram",
                  href: "https://www.instagram.com/conteckandy",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  name: "WhatsApp",
                  href: "https://wa.me/94777812141",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  ),
                },
                {
                  name: "LinkedIn",
                  href: "https://www.linkedin.com/company/contec-engineering",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  ),
                },
                {
                  name: "YouTube",
                  href: "https://www.youtube.com/@conteckandy",
                  icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-9 h-9 rounded-xl bg-[#080e1c] border border-blue-500/30 flex items-center justify-center text-zinc-300 hover:text-[#FFB800] hover:border-[#FFB800]/60 hover:bg-[#FFB800]/10 hover:shadow-[0_0_15px_rgba(255,184,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                </a>
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
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-xs uppercase font-bold text-[#FFB800] tracking-wider mb-4">Core Capabilities</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/services#design-build" className="hover:text-[#FFB800] transition-colors">Architectural Design & 3D Plans</Link>
              </li>
              <li>
                <Link href="/services#construction" className="hover:text-[#FFB800] transition-colors">Turnkey House Construction</Link>
              </li>
              <li>
                <Link href="/services#renovation" className="hover:text-[#FFB800] transition-colors">Home Renovation & Remodeling</Link>
              </li>
              <li>
                <Link href="/services#housemaster" className="hover:text-[#FFB800] transition-colors">House Master Home Care</Link>
              </li>
              <li>
                <Link href="/services#sustainable" className="hover:text-[#FFB800] transition-colors">Solar Power & Retaining Walls</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studios & Contact */}
          <div>
            <h4 className="text-xs uppercase font-bold text-[#FFB800] tracking-wider mb-4">Contact & Location</h4>
            <div className="flex flex-col gap-3 text-xs text-zinc-400 leading-relaxed">
              <div>
                <p className="text-white font-semibold">Kandy Head Office</p>
                <p>No. 167, George E. De Silva Mawatha,</p>
                <p>Kandy, Sri Lanka, 20000</p>
              </div>
              <div>
                <p className="text-white font-semibold">Direct Inquiries & WhatsApp</p>
                <a href="tel:+94777812141" className="hover:text-[#FFB800] transition-colors block text-zinc-300 font-medium">
                  +94 77 781 2141
                </a>
              </div>
              <div>
                <p className="text-white font-semibold">Official Email</p>
                <a href="mailto:conteckandy@gmail.com" className="text-[#FFB800] hover:underline">
                  conteckandy@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} ConTec Design & Build (Kandy). All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund" className="hover:text-zinc-300 transition-colors">
              Refund & Payment Terms
            </Link>
            <Link href="/contact" className="hover:text-[#FFB800] transition-colors">
              Contact Office
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
