"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { fetchReadme, parseRepo } from "@/lib/github";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import type { DocSource, TechCategory } from "@/lib/types";

export type ProjectInput = {
  title: string;
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
    const { error } = await supabase
      .from("projects")
      .insert({ ...finalRow, slug });
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
    const { error } = await supabase
      .from("projects")
      .update({ ...finalRow, slug })
      .eq("id", id);
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
    if (error) return { ok: false, error: error.message };

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
    if (error) return { ok: false, error: error.message };

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

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
