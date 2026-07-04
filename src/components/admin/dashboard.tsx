"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProject, setBoostingOpen, signOut } from "@/app/admin/actions";
import type { Game, Project, Testimonial } from "@/lib/types";
import { GamesSection } from "./games-section";
import { ProfileSection } from "./profile-section";
import { ProjectModal } from "./project-modal";
import { TestimonialsSection } from "./testimonials-section";

function ym(iso: string) {
  return iso.slice(0, 7); // YYYY-MM
}

export function AdminDashboard({
  projects,
  boostingOpen,
  profileImageUrl,
  games,
  testimonials,
}: {
  projects: Project[];
  boostingOpen: boolean;
  profileImageUrl: string | null;
  games: Game[];
  testimonials: Testimonial[];
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [pending, startTransition] = useTransition();

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setModalOpen(true);
  }

  function handleDelete(p: Project) {
    if (!confirm(`Hapus project "${p.title}"?`)) return;
    startTransition(async () => {
      await deleteProject(p.id);
      router.refresh();
    });
  }

  function handleToggleBoosting() {
    startTransition(async () => {
      await setBoostingOpen(!boostingOpen);
      router.refresh();
    });
  }

  function handleLogout() {
    startTransition(async () => {
      await signOut();
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* topbar */}
      <nav className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-[12px]">
        <div className="mx-auto flex h-[60px] max-w-[920px] items-center justify-between px-7">
          <div className="font-mono text-sm font-semibold">
            <span className="text-acc">~/admin</span>/projects
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="font-mono text-[12.5px] text-muted transition-colors hover:text-ink"
            >
              lihat website ↗
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={pending}
              className="rounded-md border border-line-input px-[13px] py-[7px] font-mono text-[12.5px] text-muted transition-colors hover:border-line-hover hover:text-ink"
            >
              logout →
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-[920px] px-7 pt-11 pb-20">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold tracking-[-0.01em]">
              Daftar Project
            </h1>
            <p className="mt-[6px] font-mono text-[12.5px] text-muted">
              {projects.length} project · perubahan langsung tampil di homepage
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-lg bg-acc px-[18px] py-[11px] font-mono text-[13px] font-semibold text-bg transition-opacity hover:opacity-85"
          >
            + Tambah Project
          </button>
        </div>

        {/* homepage profile picture */}
        <ProfileSection profileImageUrl={profileImageUrl} />

        {/* boosting status toggle (added per handoff — not in prototype) */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-line bg-panel px-[18px] py-4">
          <div>
            <div className="font-mono text-[13px] text-ink">
              status boosting
            </div>
            <div className="mt-1 font-mono text-[11.5px] text-muted">
              tampil di halaman /boosting
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleBoosting}
            disabled={pending}
            className={`rounded-full border-[1.5px] px-[16px] py-[7px] font-mono text-[12px] font-semibold transition-colors ${
              boostingOpen
                ? "border-success text-success"
                : "border-danger text-danger"
            }`}
          >
            {boostingOpen
              ? "OPEN — klik untuk tutup"
              : "CLOSED — klik untuk buka"}
          </button>
        </div>

        {/* boosting: games (joki) + testimonial screenshots */}
        <GamesSection games={games} />
        <TestimonialsSection testimonials={testimonials} />

        {/* list */}
        <div className="mt-7 flex flex-col gap-3">
          {projects.length === 0 && (
            <p className="font-mono text-[13px] text-hint">
              Belum ada project. Klik “+ Tambah Project”.
            </p>
          )}
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-xl border border-line bg-panel px-[18px] py-4 transition-colors hover:border-line-hover"
            >
              <div className="flex h-12 w-[72px] flex-none items-center justify-center overflow-hidden rounded-[7px] border border-dashed border-line-strong font-mono text-[9px] text-hint">
                {p.image_url ? (
                  // biome-ignore lint/performance/noImgElement: tiny admin thumbnail; next/image not warranted
                  <img
                    src={p.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "img"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15.5px] font-semibold">{p.title}</div>
                <div className="mt-1 font-mono text-[11.5px] text-muted">
                  {p.tech.join(" · ") || "—"}
                </div>
              </div>
              <div className="font-mono text-[11px] text-hint">
                {ym(p.created_at)}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="rounded-md border border-line-input px-[13px] py-[7px] font-mono text-[12px] text-muted transition-colors hover:border-line-hover hover:text-ink"
                >
                  edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  disabled={pending}
                  className="rounded-md border border-danger/35 px-[13px] py-[7px] font-mono text-[12px] text-danger transition-colors hover:bg-danger/12"
                >
                  hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <ProjectModal
          project={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
