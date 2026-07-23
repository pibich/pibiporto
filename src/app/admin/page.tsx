import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/dashboard";
import { getProjects, getSettings } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware guards this route, but re-check defensively.
  if (!user) redirect("/login?redirect=/admin");

  const [projects, settings] = await Promise.all([
    getProjects(),
    getSettings(),
  ]);

  return (
    <AdminDashboard
      projects={projects}
      profileImageUrl={settings.profile_image_url}
    />
  );
}
