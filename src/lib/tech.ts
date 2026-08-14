import type { TechCategory } from "@/lib/types";

// Category → label + styling used by the homepage skills section.
// `accent` mirrors the old "sedang ditekuni" highlight.
export const TECH_CATEGORIES: {
  key: TechCategory;
  label: string; // shown as a "// comment" heading in the terminal theme
  accent: boolean;
}[] = [
  { key: "foundation", label: "fondasi", accent: false },
  { key: "learning", label: "sedang ditekuni", accent: true },
  { key: "design", label: "ui-ux design", accent: false },
];

/**
 * Turn a tech name into a Simple Icons slug, mirroring the official
 * `titleToSlug` algorithm closely enough for common brand names.
 * e.g. "Next.js" → "nextdotjs", "Tailwind CSS" → "tailwindcss", "C++" → "cplusplus".
 */
export function deriveSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/&/g, "and")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Public Simple Icons CDN URL for a tech's logo. The slug is auto-derived from
 * the name unless an explicit override is provided. When `color` is set (hex
 * without '#'), the logo is tinted; otherwise the brand colour is used.
 */
export function techIconUrl(
  name: string,
  iconSlug?: string | null,
  color?: string | null,
): string {
  const slug = iconSlug?.trim() || deriveSlug(name);
  const tint = color?.trim();
  return tint
    ? `https://cdn.simpleicons.org/${slug}/${tint}`
    : `https://cdn.simpleicons.org/${slug}`;
}
