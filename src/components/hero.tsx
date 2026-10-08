"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const TAGLINE = "Web Developer · UI/UX Designer · Content Creator";

// Taruh filenya di public/ — buka di tab baru supaya PDF-nya tidak
// menggantikan halaman portofolio. (%20 = spasi di nama file.)
const CV_URL = "/CV_Vincent%20Bryan.pdf";

export function Hero() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTyped(TAGLINE.slice(0, i));
      if (i >= TAGLINE.length) clearInterval(timer);
    }, 55);
    return () => clearInterval(timer);
  }, []);

  return (
    <header id="hero" className="mx-auto max-w-[1080px] px-7 pt-24 pb-[88px]">
      <div className="font-mono text-sm text-muted">$ whoami</div>
      <h1 className="mt-[18px] text-[56px] font-bold leading-[1.08] tracking-[-0.02em]">
        Vincent Bryan
      </h1>
      <div className="mt-3 min-h-[26px] font-mono text-[19px] text-acc">
        {typed}
        <span className="ml-[3px] inline-block h-5 w-[9px] translate-y-[3px] animate-[blink_1.1s_step-end_infinite] bg-acc align-baseline" />
      </div>
      <p className="mt-[22px] max-w-[520px] text-[17px] leading-[1.65] text-body text-pretty">
        Saya membangun website yang sederhana dan enak dipandang — fokus pada
        detail tampilan, kecepatan, dan pengalaman pengguna.
      </p>
      <div className="mt-[34px] flex flex-wrap gap-[14px]">
        <Link
          href="#projects"
          className="rounded-lg bg-acc px-[22px] py-3 font-mono text-[13.5px] font-semibold text-bg transition-opacity hover:opacity-85"
        >
          Lihat Project →
        </Link>
        <a
          href={CV_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-line-strong px-[22px] py-3 font-mono text-[13.5px] text-ink transition-colors hover:border-acc hover:text-acc"
        >
          Lihat CV <span className="text-hint">(PDF)</span>
        </a>
        <Link
          href="#contact"
          className="rounded-lg border border-line-strong px-[22px] py-3 font-mono text-[13.5px] text-ink transition-colors hover:border-acc hover:text-acc"
        >
          Contact Me
        </Link>
      </div>
    </header>
  );
}
