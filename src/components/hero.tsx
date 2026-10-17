"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa6";
import { FiArrowDown, FiDownload, FiMail } from "react-icons/fi";
import { SiGithub, SiWhatsapp, SiYoutube } from "react-icons/si";

const CV_URL = "/CV_Vincent%20Bryan.pdf";

const ROLES = [
  "Software Developer",
  "Full Stack & Mobile",
  "Frontend Engineer",
  "Tech Enthusiast & Creator",
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/pibich", Icon: SiGithub },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/vincentbryanid",
    Icon: FaLinkedinIn,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@pibichori",
    Icon: SiYoutube,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/6285920637925",
    Icon: SiWhatsapp,
  },
];

export function Hero() {
  const [text, setText] = useState("");

  // Efek ketik lalu hapus, looping ke role berikutnya.
  useEffect(() => {
    let roleIdx = 0;
    let len = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = ROLES[roleIdx];
      if (!deleting) {
        len = Math.min(len + 1, word.length);
        setText(word.slice(0, len));
        if (len === word.length) {
          deleting = true;
          timer = setTimeout(tick, 1600);
          return;
        }
        timer = setTimeout(tick, 55);
      } else {
        len = Math.max(len - 1, 0);
        setText(word.slice(0, len));
        if (len === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % ROLES.length;
          timer = setTimeout(tick, 350);
          return;
        }
        timer = setTimeout(tick, 28);
      }
    };

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header
      id="hero"
      className="mx-auto max-w-[1100px] px-6 sm:px-8 pt-20 pb-24 md:pt-28 md:pb-32"
    >
      {/* Status Pill */}
      <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/70 px-3.5 py-1 text-xs font-mono text-muted backdrop-blur-sm">
        <span className="flex h-2 w-2 relative">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span>$ whoami • open to opportunities</span>
      </div>

      {/* Main Title */}
      <h1 className="mt-6 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-ink leading-[1.05]">
        Vincent Bryan
      </h1>

      {/* Typewriter Subtitle */}
      <div className="mt-4 flex items-center min-h-[32px] font-mono text-lg sm:text-2xl text-acc font-medium">
        <span>{text}</span>
        <span className="ml-1 inline-block h-6 w-2.5 animate-[blink_1.1s_step-end_infinite] bg-acc" />
      </div>

      {/* Bio excerpt */}
      <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-body">
        Membangun antarmuka website dan aplikasi modern dengan fokus pada
        performa, estetika minimalis, dan arsitektur kode yang rapi.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
        <Link
          href="#projects"
          className="inline-flex items-center gap-2 rounded-xl bg-acc px-6 py-3 font-mono text-xs sm:text-sm font-semibold text-bg transition-all hover:opacity-90 hover:shadow-lg hover:shadow-acc/25 active:scale-[0.98]"
        >
          <span>Jelajahi Project</span>
          <FiArrowDown className="h-4 w-4 stroke-[2.5]" />
        </Link>

        <a
          href={CV_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-panel/60 px-5 py-3 font-mono text-xs sm:text-sm font-medium text-ink transition-all hover:border-acc hover:text-acc hover:shadow-md"
        >
          <FiDownload className="h-4 w-4" />
          <span>Unduh CV</span>
        </a>

        <Link
          href="#contact"
          className="inline-flex items-center gap-2 rounded-xl border border-line-input bg-panel/30 px-5 py-3 font-mono text-xs sm:text-sm font-medium text-muted transition-colors hover:border-line-hover hover:text-ink"
        >
          <FiMail className="h-4 w-4" />
          <span>Kontak</span>
        </Link>

        {/* Social Icons */}
        <div className="flex items-center gap-2 sm:ml-2">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-input bg-panel/50 text-muted transition-all hover:border-acc hover:text-acc hover:scale-105"
            >
              <Icon className="text-base" aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
