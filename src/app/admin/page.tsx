import { redirect } from "next/navigation";
import { ProjectsPanel } from "@/components/admin/projects-panel";
import { getProjects, getTechStack } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proxy guards this route, but re-check defensively.
  if (!user) redirect("/login?redirect=/admin");

  const [projects, tech] = await Promise.all([getProjects(), getTechStack()]);

  return <ProjectsPanel projects={projects} tech={tech} />;
}
