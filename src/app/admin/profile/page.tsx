import { redirect } from "next/navigation";
import { CvSection } from "@/components/admin/cv-section";
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
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-ink">
          Profil & Pengaturan
        </h1>
        <p className="mt-1 text-[13px] text-muted">
          Kelola aset visual utama website, dokumen CV, dan pantau status
          integrasi.
        </p>
      </div>
      <div className="mt-8 space-y-8">
        <ProfileSection profileImageUrl={settings.profile_image_url} />
        <CvSection cvUrl={settings.cv_url} />
      </div>
    </div>
  );
}
