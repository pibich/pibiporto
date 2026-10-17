import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg text-ink selection:bg-acc selection:text-bg">
      <AdminNav />
      <main className="mx-auto max-w-[1140px] px-6 sm:px-8 pt-8 pb-24">
        {children}
      </main>
    </div>
  );
}
