import { createClient } from "@/lib/supabase/server";
import type { Game, Project, Settings, Testimonial } from "@/lib/types";

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

/** The single settings row; falls back to boosting open if unavailable. */
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
      boosting_open: true,
      profile_image_url: null,
      updated_at: new Date().toISOString(),
    };
  }
  return data;
}

/** Boosting service games (joki), oldest first for a stable order. */
export async function getGames(): Promise<Game[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getGames:", error.message);
    return [];
  }
  return data ?? [];
}

/** Testimonial screenshots for the boosting page, oldest first. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getTestimonials:", error.message);
    return [];
  }
  return data ?? [];
}
