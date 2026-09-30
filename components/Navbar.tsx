"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo - Clean Transparent Presentation with White Luminescence Shadow */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 sm:h-12 w-36 sm:w-48 transition-transform duration-300 group-hover:scale-105 flex items-center">
              <Image
                src="/branding/logo nav.png"
                alt="CONTEC Design & Build"
                fill
                className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)]"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 bg-[#080e1c]/85 backdrop-blur-xl px-5 py-2 rounded-full border border-blue-500/30 shadow-lg shadow-black/50">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "text-white font-extrabold bg-[#0038B8] shadow-md shadow-blue-900/40"
                      : "text-zinc-200 hover:text-[#FFB800] hover:bg-white/[0.08]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-[#FFB800] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FFB800]/60 text-[#FFB800] hover:text-black hover:bg-[#FFB800] text-xs font-extrabold backdrop-blur-xl bg-[#080e1c]/85 transition-all duration-300 shadow-lg shadow-black/40 group"
            >
              <span>Book Consultation</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#080e1c]/90 border border-white/20 text-white backdrop-blur-md hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
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
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050811]/95 backdrop-blur-2xl md:hidden pt-24 px-6 flex flex-col justify-between pb-12 animate-fadeIn">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider mb-2">Navigation</span>
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-base font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? "bg-[#0038B8]/40 text-[#FFB800] border border-[#0038B8]/60"
                      : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#FFB800]" />}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-full bg-[#FFB800] hover:bg-[#F59E0B] text-black font-extrabold text-sm text-center shadow-lg shadow-amber-500/20"
            >
              Schedule Discovery Session ↗
            </Link>
            <p className="text-center text-xs text-zinc-400">
              CONTEC Design & Build • Building Visions, Designing Futures
            </p>
          </div>
        </div>
      )}
    </>
  );
}
