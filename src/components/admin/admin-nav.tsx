"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { signOut } from "@/app/admin/actions";

const tabs = [
  { href: "/admin", label: "projects" },
  { href: "/admin/tech", label: "tech-stack" },
  { href: "/admin/profile", label: "profil" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await signOut();
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-bg/92 backdrop-blur">
      <div className="mx-auto flex h-[60px] max-w-[1080px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-7">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-semibold">
            <span className="text-acc">~/admin</span>
          </Link>
          <div className="flex items-center gap-1">
            {tabs.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-[7px] text-[12.5px] transition-colors ${
                    active ? "bg-chip text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[12.5px] text-muted transition-colors hover:text-ink"
          >
            lihat website ↗
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={pending}
            className="rounded-lg border border-line-input px-[13px] py-[7px] text-[12.5px] text-muted transition-colors hover:border-line-hover hover:text-ink disabled:opacity-50"
          >
            logout →
          </button>
        </div>
      </div>
    </nav>
  );
}
