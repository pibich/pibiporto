import { createClient } from "@/lib/supabase/server";
import type { Message, Project, Settings, TechItem } from "@/lib/types";

/** Projects for the public homepage / admin list, newest first. */
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProjects:", error.message);
    return [];
  }
  return data ?? [];
}

/** A single project by its slug, or null if not found. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getProjectBySlug:", error.message);
    return null;
  }
  return data;
}

/** Tech-stack items for the homepage skills section & project tech picker. */
export async function getTechStack(): Promise<TechItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tech_stack")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getTechStack:", error.message);
    return [];
  }
  return data ?? [];
}

/** The single settings row; falls back to empty defaults if unavailable. */
export async function getSettings(): Promise<Settings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getSettings:", error.message);
    return {
      id: true,
      profile_image_url: null,
      updated_at: new Date().toISOString(),
    };
  }
  return data;
}

/** Contact form submissions for the admin panel, newest first. */
export async function getMessages(): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMessages:", error.message);
    return [];
  }
  return data ?? [];
}
