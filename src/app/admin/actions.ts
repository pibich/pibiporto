"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  fetchReadme,
  fetchRepoMeta,
  fetchRootFile,
  parseRepo,
} from "@/lib/github";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import type { DocSource, ProjectCategory, TechCategory } from "@/lib/types";

export type ProjectInput = {
  title: string;
  category?: ProjectCategory | string;
  description: string;
  demo_url: string;
  repo_url: string;
  tech: string[];
  image_url: string | null;
  documentation: string;
  doc_source: DocSource;
  show_description: boolean;
};

const DOC_SOURCES: DocSource[] = ["manual", "github", "none"];

export type ActionResult = { ok: boolean; error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Tidak terautentikasi.");
  return supabase;
}

function normalize(input: ProjectInput) {
  return {
    title: input.title.trim(),
    category: input.category ? input.category.trim() : null,
    description: input.description.trim() || null,
    demo_url: input.demo_url.trim() || null,
    repo_url: input.repo_url.trim() || null,
    tech: input.tech,
    image_url: input.image_url,
    documentation: input.documentation.trim() || null,
    doc_source: DOC_SOURCES.includes(input.doc_source)
      ? input.doc_source
      : "manual",
    show_description: input.show_description,
  };
}

/**
 * For a GitHub-sourced project, best-effort fetch the README and keep it as the
 * stored fallback copy. Never fails the save — the detail page fetches live too.
 */
async function withReadmeBackup(row: ReturnType<typeof normalize>) {
  if (row.doc_source !== "github") return row;
  const ref = parseRepo(row.repo_url);
  if (!ref) return row;
  const readme = await fetchReadme(ref, 0); // fresh copy at save time
  return readme.ok ? { ...row, documentation: readme.markdown } : row;
}

/**
 * A slug unique across projects, derived from the title. Appends -2, -3, …
 * on collision. `excludeId` lets a project keep its own slug when updating.
 */
async function uniqueSlug(
  supabase: SupabaseClient,
  title: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(title) || "project";
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    let query = supabase
      .from("projects")
      .select("id")
      .eq("slug", candidate)
      .limit(1);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return candidate;
  }
}

export async function createProject(
  input: ProjectInput,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const row = normalize(input);
    if (!row.title) return { ok: false, error: "Judul wajib diisi." };

    const slug = await uniqueSlug(supabase, row.title);
    const finalRow = await withReadmeBackup(row);
    let { error } = await supabase
      .from("projects")
      .insert({ ...finalRow, slug });

    if (error?.message.includes("category")) {
      const { category: _omitted, ...rowWithoutCategory } = finalRow;
      const retry = await supabase
        .from("projects")
        .insert({ ...rowWithoutCategory, slug });
      error = retry.error;
    }

    if (error) return { ok: false, error: error.message };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const row = normalize(input);
    if (!row.title) return { ok: false, error: "Judul wajib diisi." };

    const slug = await uniqueSlug(supabase, row.title, id);
    const finalRow = await withReadmeBackup(row);
    let { error } = await supabase
      .from("projects")
      .update({ ...finalRow, slug })
      .eq("id", id);

    if (error?.message.includes("category")) {
      const { category: _omitted, ...rowWithoutCategory } = finalRow;
      const retry = await supabase
        .from("projects")
        .update({ ...rowWithoutCategory, slug })
        .eq("id", id);
      error = retry.error;
    }

    if (error) return { ok: false, error: error.message };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ───────────────────────────── profile picture ─────────────────────────────

export async function updateProfileImage(
  image_url: string | null,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase
      .from("settings")
      .update({
        profile_image_url: image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", true);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ─────────────────────────────────── cv / resume ───────────────────────────

export async function updateCvUrl(
  cv_url: string | null,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase
      .from("settings")
      .update({
        cv_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", true);

    if (error) {
      if (
        error.message.includes("column") &&
        error.message.includes("cv_url")
      ) {
        return {
          ok: false,
          error:
            "Kolom cv_url belum ada di tabel settings Supabase. Silakan jalankan di SQL Editor Supabase: ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS cv_url text;",
        };
      }
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/profile");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ─────────────────────────────── tech stack ───────────────────────────────

export type TechInput = {
  name: string;
  category: TechCategory;
  icon_slug: string;
  color: string;
  sort_order: number;
};

function normalizeTech(input: TechInput) {
  return {
    name: input.name.trim(),
    category: input.category,
    icon_slug: input.icon_slug.trim() || null,
    // accept "#abc123" or "abc123"; store without the leading '#'
    color: input.color.trim().replace(/^#/, "") || null,
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
  };
}

export async function createTech(input: TechInput): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const row = normalizeTech(input);
    if (!row.name) return { ok: false, error: "Nama wajib diisi." };

    const { error } = await supabase.from("tech_stack").insert(row);
    if (error) {
      if (
        error.message.includes("category_check") ||
        error.message.includes("check constraint")
      ) {
        return {
          ok: false,
          error:
            "Kategori memerlukan pembaruan constraint di Supabase. Silakan jalankan script supabase/add-ai-and-vps-skills.sql di SQL Editor Supabase.",
        };
      }
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateTech(
  id: string,
  input: TechInput,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const row = normalizeTech(input);
    if (!row.name) return { ok: false, error: "Nama wajib diisi." };

    const { error } = await supabase
      .from("tech_stack")
      .update(row)
      .eq("id", id);
    if (error) {
      if (
        error.message.includes("category_check") ||
        error.message.includes("check constraint")
      ) {
        return {
          ok: false,
          error:
            "Kategori memerlukan pembaruan constraint di Supabase. Silakan jalankan script supabase/add-ai-and-vps-skills.sql di SQL Editor Supabase.",
        };
      }
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteTech(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase.from("tech_stack").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteTechMany(ids: string[]): Promise<ActionResult> {
  if (ids.length === 0) return { ok: true };
  try {
    const supabase = await requireUser();
    const { error } = await supabase.from("tech_stack").delete().in("id", ids);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateTechCategoryMany(
  ids: string[],
  category: TechCategory,
): Promise<ActionResult> {
  if (ids.length === 0) return { ok: true };
  try {
    const supabase = await requireUser();
    const { error } = await supabase
      .from("tech_stack")
      .update({ category })
      .in("id", ids);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

// ─────────────────────────── import dari GitHub ───────────────────────────

// Package/composer dependency → nama di tech-stack. Key sudah di-lowercase.
const DEP_TO_TECH: Record<string, string> = {
  next: "Next.js",
  react: "React",
  "react-dom": "React",
  "react-native": "React Native",
  tailwindcss: "Tailwind CSS",
  "@tailwindcss/postcss": "Tailwind CSS",
  "@tailwindcss/cli": "Tailwind CSS",
  typescript: "TypeScript",
  laravel: "Laravel",
  "@supabase/supabase-js": "Supabase",
  "@supabase/ssr": "Supabase",
  firebase: "Firebase",
  "firebase-admin": "Firebase",
  mysql: "MySQL",
  mysql2: "MySQL",
  sqlite3: "SQLite",
  "better-sqlite3": "SQLite",
};

function parsePackageJson(content: string | null): string[] {
  if (!content) return [];
  try {
    const pkg = JSON.parse(content);
    const deps: Record<string, string> = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    return Object.keys(deps)
      .map((dep) => DEP_TO_TECH[dep.toLowerCase()])
      .filter(Boolean);
  } catch {
    return [];
  }
}

function parseComposerJson(content: string | null): string[] {
  if (!content) return [];
  try {
    const composer = JSON.parse(content);
    const deps: Record<string, string> = {
      ...composer.require,
      ...composer["require-dev"],
    };
    return Object.keys(deps)
      .map((dep) => {
        const key = dep.toLowerCase();
        if (key === "php") return "PHP";
        return DEP_TO_TECH[key];
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export type GitHubImportData = {
  title: string;
  description: string | null;
  tech: string[];
};

/**
 * Read a GitHub repo and suggest project fields: name → title, description,
 * and tech detected from package.json / composer.json / primary language.
 * Detected tech is returned as-is; the form shows it as a selected chip even
 * when the name isn't in the tech-stack list yet.
 */
export async function importFromGitHub(
  repoUrl: string,
): Promise<ActionResult & { data?: GitHubImportData }> {
  try {
    const ref = parseRepo(repoUrl);
    if (!ref) return { ok: false, error: "Link repo GitHub tidak valid." };

    await requireUser();
    const [meta, pkg, composer] = await Promise.all([
      fetchRepoMeta(ref),
      fetchRootFile(ref, "package.json"),
      fetchRootFile(ref, "composer.json"),
    ]);
    if (!meta.ok) return { ok: false, error: meta.error };

    const candidates = new Set<string>([
      ...parsePackageJson(pkg.content),
      ...parseComposerJson(composer.content),
    ]);
    if (meta.meta.language) candidates.add(meta.meta.language);

    return {
      ok: true,
      data: {
        title: meta.meta.name,
        description: meta.meta.description,
        tech: [...candidates],
      },
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ─────────────────────────── messages (contact) ───────────────────────────

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/messages");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
