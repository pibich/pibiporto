import type { TechCategory } from "@/lib/types";

// Categories shown in the homepage skills section and offered by the admin
// tech form. Key matches the CHECK constraint on `tech_stack.category`.
export const TECH_CATEGORIES: {
  key: TechCategory;
  label: string; // shown as a "// comment" heading in the terminal theme
}[] = [
  { key: "frontend", label: "frontend" },
  { key: "backend", label: "backend" },
  { key: "database", label: "database" },
  { key: "baas", label: "baas" },
  { key: "mobile", label: "mobile" },
  { key: "tools", label: "tools" },
  { key: "lainnya", label: "lainnya" },
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
