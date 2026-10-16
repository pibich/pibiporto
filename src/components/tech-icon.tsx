"use client";

import { useState } from "react";
import { techIconUrl } from "@/lib/tech";

/**
 * Brand logo for a tech, resolved automatically from its name via the
 * Simple Icons CDN. If the icon can't be found (unknown brand, e.g.
 * "UI/UX Design"), it silently renders nothing instead of a broken image.
 */
export function TechIcon({
  name,
  iconSlug,
  color,
  size = 15,
  className,
}: {
  name: string;
  iconSlug?: string | null;
  color?: string | null;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = techIconUrl(name, iconSlug, color);
  if (!src || failed) return null;

  return (
    // biome-ignore lint/performance/noImgElement: tiny external SVG logo from the Simple Icons CDN
    <img
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
