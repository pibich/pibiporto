import { createClient } from "@/lib/supabase/server";
import type { Project, Settings } from "@/lib/types";

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
