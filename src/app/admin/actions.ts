"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProjectInput = {
  title: string;
  description: string;
  demo_url: string;
  repo_url: string;
  tech: string[];
  image_url: string | null;
};

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
  };
}

export async function createProject(
  input: ProjectInput,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const row = normalize(input);
    if (!row.title) return { ok: false, error: "Judul wajib diisi." };

    const { error } = await supabase.from("projects").insert(row);
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

    const { error } = await supabase.from("projects").update(row).eq("id", id);
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

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
