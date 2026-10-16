import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg">
      <AdminNav />
      <div className="mx-auto max-w-[1080px] px-7 pt-10 pb-20">{children}</div>
    </div>
  );
}
