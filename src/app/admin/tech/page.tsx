import { redirect } from "next/navigation";
import { TechSection } from "@/components/admin/tech-section";
import { getTechStack } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function AdminTechPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin/tech");

  const tech = await getTechStack();

  return <TechSection tech={tech} />;
}
