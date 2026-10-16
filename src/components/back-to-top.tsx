"use client";

import { useEffect, useState } from "react";

/** Tombol "ke atas" melayang di kanan bawah; muncul setelah sedikit scroll. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Kembali ke atas"
      onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
      className="fixed right-6 bottom-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-panel text-[16px] text-muted shadow-lg transition-colors hover:border-acc hover:text-acc"
    >
      ↑
    </button>
  );
}
