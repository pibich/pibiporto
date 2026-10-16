"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub, SiWhatsapp, SiYoutube } from "react-icons/si";

// Taruh filenya di public/ — buka di tab baru supaya PDF-nya tidak
// menggantikan halaman portofolio. (%20 = spasi di nama file.)
const CV_URL = "/CV_Vincent%20Bryan.pdf";

const ROLES = [
  "Software Developer",
  "Website & Mobile",
  "Frontend",
  "Content Creator",
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
          timer = setTimeout(tick, 1500);
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
    <header id="hero" className="mx-auto max-w-[1080px] px-7 pt-24 pb-[88px]">
      <div className="font-mono text-sm text-muted">$ whoami</div>
      <h1 className="mt-[18px] text-[56px] font-bold leading-[1.08] tracking-[-0.02em]">
        Vincent Bryan
      </h1>
      <div className="mt-3 min-h-[26px] font-mono text-[19px] text-acc">
        {text}
        <span className="ml-[3px] inline-block h-5 w-[9px] translate-y-[3px] animate-[blink_1.1s_step-end_infinite] bg-acc align-baseline" />
      </div>
      <div className="mt-[34px] flex flex-wrap items-center gap-[14px]">
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
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-body transition-colors hover:border-acc hover:text-acc"
            >
              <Icon className="text-[15px]" aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
