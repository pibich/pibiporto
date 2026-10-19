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
  { key: "ai", label: "ai & agentic" },
  { key: "tools", label: "tools" },
  { key: "lainnya", label: "lainnya" },
];

// Nama brand yang slug Simple Icons-nya tidak bisa diturunkan otomatis
// (slug resmi berbeda dari hasil deriveSlug, atau ikonnya sudah dihapus
// dari Simple Icons). Value berupa slug Simple Icons, atau path ikon lokal
// di /public yang diawali "/" (mis. VS Code, REST API).
const ICON_OVERRIDES: Record<string, string> = {
  html: "html5",
  "react native": "react",
  "rest api": "/icons/rest-api.svg",
  "vs code": "/icons/vscode.svg",
  antigravity: "/icons/antigravity.svg",
  "google antigravity": "/icons/antigravity.svg",
  "model context protocol (mcp)": "/icons/mcp.svg",
  "model context protocol": "/icons/mcp.svg",
  mcp: "/icons/mcp.svg",
  "claude code": "claude",
  claude: "claude",
  "github copilot": "githubcopilot",
  "linux (ubuntu)": "ubuntu",
  "linux (ubuntu / vps)": "ubuntu",
  "vps (linux)": "linux",
  vps: "linux",
  "mermaid.js": "mermaid",
  mermaid: "mermaid",
};

// Simple Icons CDN memakai warna brand asli; beberapa brand nyaris hitam
// sehingga tidak terlihat di latar gelap. Slug ini dipaksa ke warna terang
// kecuali admin mengatur warna sendiri.
const LIGHT_ICONS: Record<string, string> = {
  nextdotjs: "e6edf3",
  github: "e6edf3",
  vercel: "e6edf3",
  express: "e6edf3",
  django: "e6edf3",
  rust: "e6edf3",
  prisma: "e6edf3",
  opencv: "e6edf3",
  cursor: "e6edf3",
  githubcopilot: "e6edf3",
  markdown: "e6edf3",
};

/** Slug ikon Simple Icons untuk sebuah nama tech, atau null bila tidak ada. */
export function iconSlugFor(
  name: string,
  override?: string | null,
): string | null {
  const explicit = override?.trim().toLowerCase();
  if (explicit) return explicit;
  const key = name.trim().toLowerCase();
  const mapped = ICON_OVERRIDES[key];
  if (mapped !== undefined) return mapped || null;
  return deriveSlug(name) || null;
}

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
 * Public URL for a tech's logo, or null when no icon exists for it.
 * Local icons (paths starting with "/") are served from /public; everything
 * else resolves via the Simple Icons CDN. When `color` is set (hex without
 * '#'), the CDN logo is tinted; local icons keep their baked-in colour.
 */
export function techIconUrl(
  name: string,
  iconSlug?: string | null,
  color?: string | null,
): string | null {
  const explicit = iconSlug?.trim();
  if (explicit?.startsWith("/")) return explicit;

  const mapped = ICON_OVERRIDES[name.trim().toLowerCase()];
  if (mapped?.startsWith("/")) return mapped;

  const slug = iconSlugFor(name, iconSlug);
  if (!slug) return null;
  if (slug.startsWith("/")) return slug;

  const tint = color?.trim() || LIGHT_ICONS[slug];
  return tint
    ? `https://cdn.simpleicons.org/${slug}/${tint}`
    : `https://cdn.simpleicons.org/${slug}`;
}
