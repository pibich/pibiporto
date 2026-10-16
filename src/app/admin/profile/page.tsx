import { redirect } from "next/navigation";
import { ProfileSection } from "@/components/admin/profile-section";
import { getSettings } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin/profile");

  const settings = await getSettings();

  return (
    <div>
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.01em]">Profil</h1>
        <p className="mt-[6px] text-[12.5px] text-muted">
          foto profil tampil di section “tentang-saya” homepage
        </p>
      </div>
      <div className="mt-7">
        <ProfileSection profileImageUrl={settings.profile_image_url} />
      </div>
    </div>
  );
}
