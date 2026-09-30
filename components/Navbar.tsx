"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#050509]/85 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
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
            <span className="text-white font-bold text-lg tracking-tight group-hover:text-emerald-300 transition-colors">
              Eco<span className="text-zinc-300 font-light">Dream</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white font-semibold bg-white/15 shadow-sm"
                      : "text-zinc-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 text-xs font-semibold backdrop-blur-md bg-emerald-950/20 transition-all duration-300 shadow-sm group"
            >
              <span>Book Consultation</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-black/50 border border-white/15 text-white backdrop-blur-md hover:bg-white/10 transition-colors"
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
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-2xl md:hidden pt-24 px-6 flex flex-col justify-between pb-12 animate-fadeIn">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase font-bold text-zinc-500 tracking-wider mb-2">Navigation</span>
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-base font-semibold flex items-center justify-between transition-all ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-full bg-emerald-500 text-black font-bold text-sm text-center shadow-lg shadow-emerald-500/30"
            >
              Schedule Discovery Session ↗
            </Link>
            <p className="text-center text-xs text-zinc-500">
              Sustainable Luxury Architecture & Turnkey Construction
            </p>
          </div>
        </div>
      )}
    </>
  );
}
