"use client";

import { useEffect, useRef } from "react";

/**
 * Soft light that follows the mouse over the page background.
 * Sits at -z-10 so it paints above the body gradient but under all content.
 * Disabled on touch devices (no pointer movement to follow).
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let raf = 0;
    let x = -9999;
    let y = -9999;

    const paint = () => {
      raf = 0;
      el.style.transform = `translate3d(${x - 320}px, ${y - 320}px, 0)`;
      el.style.opacity = "1";
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 -z-10 h-[640px] w-[640px] opacity-0"
      style={{
        background:
          "radial-gradient(circle, rgb(91 163 245 / 0.17), rgb(91 163 245 / 0.05) 42%, transparent 68%)",
        transition: "opacity .6s ease",
      }}
    />
  );
}
