"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/#about", label: "tentang" },
  { href: "/#skills", label: "skills" },
  { href: "/#projects", label: "projects" },
  { href: "/#youtube", label: "youtube" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/85 backdrop-blur-md shadow-lg shadow-black/20"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6 sm:px-8">
        {/* Brand */}
        <Link
          href="/#hero"
          className="group flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-ink"
        >
          <span className="text-acc transition-transform group-hover:-translate-x-0.5">
            ~/
          </span>
          <span>vincent-bryan</span>
          <span
            className="flex h-2 w-2 relative ml-1.5"
            title="Available for projects"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7">
          <div className="flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-[13px] text-muted transition-colors hover:text-ink"
              >
                <span className="text-hint mr-1">{"//"}</span>
                {l.label}
              </Link>
            ))}
          </div>

          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 rounded-xl bg-acc px-4 py-2 font-mono text-xs font-semibold text-bg transition-all hover:opacity-90 hover:shadow-lg hover:shadow-acc/20 active:scale-[0.98]"
          >
            <span>Hubungi Saya</span>
            <FiArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/#contact"
            className="rounded-lg bg-acc px-3 py-1.5 font-mono text-xs font-semibold text-bg"
          >
            Kontak
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-input bg-panel text-muted hover:text-ink"
          >
            {mobileOpen ? (
              <FiX className="h-4 w-4" />
            ) : (
              <FiMenu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-b border-line bg-panel/95 backdrop-blur-xl px-6 py-4 shadow-2xl">
          <div className="flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 font-mono text-sm text-muted hover:bg-chip hover:text-ink"
              >
                <span>
                  <span className="text-hint mr-1.5">{"//"}</span>
                  {l.label}
                </span>
                <span className="text-xs text-hint">→</span>
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-acc py-2.5 font-mono text-xs font-semibold text-bg"
            >
              <span>Hubungi Saya</span>
              <FiArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
