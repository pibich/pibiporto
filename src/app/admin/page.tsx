import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/dashboard";
import {
  getGames,
  getProjects,
  getSettings,
  getTestimonials,
} from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware guards this route, but re-check defensively.
  if (!user) redirect("/login?redirect=/admin");

  const [projects, settings, games, testimonials] = await Promise.all([
    getProjects(),
    getSettings(),
    getGames(),
    getTestimonials(),
  ]);

  return (
    <AdminDashboard
      projects={projects}
      boostingOpen={settings.boosting_open}
      profileImageUrl={settings.profile_image_url}
      games={games}
      testimonials={testimonials}
    />
  );
}
