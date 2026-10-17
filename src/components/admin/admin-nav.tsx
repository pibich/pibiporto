"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  FiCpu,
  FiExternalLink,
  FiLayers,
  FiLogOut,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { signOut } from "@/app/admin/actions";

const tabs = [
  { href: "/admin", label: "Projects", icon: FiLayers },
  { href: "/admin/tech", label: "Tech Stack", icon: FiCpu },
  { href: "/admin/messages", label: "Pesan Masuk", icon: FiMail },
  { href: "/admin/profile", label: "Profil", icon: FiUser },
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
    <nav className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1140px] items-center justify-between gap-4 px-6 sm:px-8">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-6 overflow-x-auto py-2 no-scrollbar">
          <Link
            href="/admin"
            className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight transition-opacity hover:opacity-90"
          >
            <span className="flex h-2 w-2 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-acc">~/admin</span>
          </Link>

          <div className="flex items-center gap-1.5">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active =
                t.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all ${
                    active
                      ? "bg-chip border border-line-chip text-ink shadow-sm"
                      : "text-muted hover:border-line hover:bg-chip/50 hover:text-ink border border-transparent"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${active ? "text-acc" : "text-muted"}`}
                  />
                  <span>{t.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 flex-none">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-line-input bg-panel/60 px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:border-line-hover hover:text-ink"
          >
            <span>Live Site</span>
            <FiExternalLink className="h-3.5 w-3.5 text-hint" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={pending}
            title="Keluar dari akun admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-input bg-panel/60 px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger disabled:opacity-50"
          >
            <FiLogOut className="h-3.5 w-3.5" />
            <span>{pending ? "Keluar…" : "Logout"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
