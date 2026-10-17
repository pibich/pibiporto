"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  FiBookOpen,
  FiEdit3,
  FiExternalLink,
  FiFileText,
  FiFilter,
  FiGithub,
  FiGlobe,
  FiLayers,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { deleteProject } from "@/app/admin/actions";
import type { Project, TechItem } from "@/lib/types";
import { ProjectModal } from "./project-modal";

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function ProjectsPanel({
  projects,
  tech,
}: {
  projects: Project[];
  tech: TechItem[];
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "demo" | "repo" | "docs"
  >("all");
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: projects.length,
      withDemo: projects.filter((p) => !!p.demo_url).length,
      withRepo: projects.filter((p) => !!p.repo_url).length,
      withDocs: projects.filter((p) => p.doc_source !== "none").length,
    };
  }, [projects]);

  // Filtered projects
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      // Search query
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));

      if (!matchSearch) return false;

      // Filter type
      if (filterType === "demo") return !!p.demo_url;
      if (filterType === "repo") return !!p.repo_url;
      if (filterType === "docs") return p.doc_source !== "none";
      return true;
    });
  }, [projects, search, filterType]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setModalOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    startTransition(async () => {
      await deleteProject(targetId);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-ink">
              Daftar Project
            </h1>
            <span className="rounded-full bg-acc/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-acc border border-acc/20">
              {projects.length}
            </span>
          </div>
          <p className="mt-1 text-[13px] text-muted">
            Kelola portofolio karya Anda. Perubahan akan langsung
            tersinkronisasi ke homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-acc px-4 py-2.5 text-sm font-semibold text-bg transition-all hover:opacity-90 hover:shadow-lg hover:shadow-acc/20 active:scale-[0.98]"
        >
          <FiPlus className="h-4 w-4 stroke-[2.5]" />
          <span>Tambah Project</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-line bg-panel p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              Total
            </span>
            <FiLayers className="h-4 w-4 text-acc" />
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">{stats.total}</div>
          <div className="mt-0.5 text-[11px] text-hint">Koleksi project</div>
        </div>

        <div className="rounded-xl border border-line bg-panel p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              Live Demo
            </span>
            <FiGlobe className="h-4 w-4 text-success" />
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">
            {stats.withDemo}
          </div>
          <div className="mt-0.5 text-[11px] text-hint">
            Bisa dicoba langsung
          </div>
        </div>

        <div className="rounded-xl border border-line bg-panel p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              Repo GitHub
            </span>
            <FiGithub className="h-4 w-4 text-ink" />
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">
            {stats.withRepo}
          </div>
          <div className="mt-0.5 text-[11px] text-hint">
            Terhubung ke source
          </div>
        </div>

        <div className="rounded-xl border border-line bg-panel p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              Dokumentasi
            </span>
            <FiFileText className="h-4 w-4 text-acc" />
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">
            {stats.withDocs}
          </div>
          <div className="mt-0.5 text-[11px] text-hint">
            Halaman detail aktif
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-hint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan judul, deskripsi, atau tech..."
            className="w-full rounded-xl border border-line-input bg-panel pl-10 pr-4 py-2 text-[13px] text-ink placeholder:text-hint outline-none transition-all focus:border-acc focus:ring-1 focus:ring-acc"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-hint hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-hint flex items-center gap-1 flex-none mr-1">
            <FiFilter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </span>
          {[
            { id: "all", label: "Semua" },
            { id: "demo", label: "Demo" },
            { id: "repo", label: "GitHub" },
            { id: "docs", label: "Dokumentasi" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterType(f.id as typeof filterType)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filterType === f.id
                  ? "bg-acc text-bg font-semibold"
                  : "border border-line-input bg-panel text-muted hover:border-line-hover hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="mt-5 flex flex-col gap-3.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-panel/40 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chip text-muted">
              <FiLayers className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-ink">
              {search ? "Project tidak ditemukan" : "Belum ada project"}
            </h3>
            <p className="mt-1 text-sm text-muted max-w-sm">
              {search
                ? `Tidak ada project yang cocok dengan kata kunci "${search}".`
                : "Mulai bangun portofolio Anda dengan menambahkan project pertama."}
            </p>
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 text-xs font-semibold text-acc hover:underline"
              >
                Reset pencarian
              </button>
            ) : (
              <button
                type="button"
                onClick={openAdd}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-acc px-4 py-2 text-xs font-semibold text-bg hover:opacity-90"
              >
                <FiPlus className="h-3.5 w-3.5" />
                <span>Tambah Sekarang</span>
              </button>
            )}
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col gap-4 rounded-2xl border border-line bg-panel p-4 sm:p-5 transition-all hover:border-line-hover hover:shadow-lg hover:shadow-black/20 md:flex-row md:items-center"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video h-28 sm:h-24 w-full md:w-44 flex-none overflow-hidden rounded-xl border border-line-strong bg-bg">
                {p.image_url ? (
                  // biome-ignore lint/performance/noImgElement: admin thumbnail
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-hint">
                    <FiLayers className="h-6 w-6 opacity-40" />
                    <span className="font-mono text-[10px]">No image</span>
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-ink tracking-tight">
                    {p.title}
                  </h3>
                  {p.slug && (
                    <span className="rounded-md border border-line-chip bg-chip px-2 py-0.5 font-mono text-[11px] text-muted">
                      /{p.slug}
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-hint ml-auto md:ml-0">
                    {dateFmt.format(new Date(p.created_at))}
                  </span>
                </div>

                {p.description && (
                  <p className="mt-1.5 text-xs text-muted line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                )}

                {/* Badges / Tech */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-line/60 bg-bg px-2 py-0.5 text-[11px] font-medium text-body"
                    >
                      {t}
                    </span>
                  ))}

                  {p.doc_source === "github" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-acc/10 px-2 py-0.5 text-[10.5px] font-medium text-acc border border-acc/20">
                      <FiGithub className="h-3 w-3" />
                      <span>README live</span>
                    </span>
                  )}
                  {p.doc_source === "manual" && p.documentation && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-chip px-2 py-0.5 text-[10.5px] font-medium text-ink border border-line-chip">
                      <FiBookOpen className="h-3 w-3" />
                      <span>Docs manual</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Actions & Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/50 pt-3 md:border-t-0 md:pt-0 md:flex-col md:items-end">
                {/* External links */}
                <div className="flex items-center gap-2">
                  {p.demo_url && (
                    <a
                      href={p.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted hover:text-success transition-colors"
                      title="Buka Demo"
                    >
                      <FiGlobe className="h-3.5 w-3.5" />
                      <span>Demo</span>
                    </a>
                  )}
                  {p.repo_url && (
                    <a
                      href={p.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors"
                      title="Buka GitHub Repo"
                    >
                      <FiGithub className="h-3.5 w-3.5" />
                      <span>Repo</span>
                    </a>
                  )}
                  {p.slug && (
                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-muted hover:text-acc transition-colors"
                      title="Lihat Halaman Detail"
                    >
                      <span>Detail</span>
                      <FiExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {/* Edit / Delete Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="inline-flex items-center gap-1 rounded-lg border border-line-input bg-bg px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-line-hover hover:text-ink"
                  >
                    <FiEdit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(p)}
                    disabled={pending}
                    className="inline-flex items-center gap-1 rounded-lg border border-danger/35 bg-bg px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-6">
          <button
            type="button"
            aria-label="Tutup dialog"
            className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-line-input bg-panel p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-danger mb-4">
              <FiTrash2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-ink">Hapus Project?</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Apakah Anda yakin ingin menghapus project{" "}
              <span className="font-semibold text-ink">
                "{deleteTarget.title}"
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-line-input px-4 py-2 text-xs font-semibold text-muted hover:text-ink"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pending}
                className="rounded-lg bg-danger px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {pending ? "Menghapus…" : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal Form */}
      {modalOpen && (
        <ProjectModal
          project={editing}
          techOptions={tech.map((t) => t.name)}
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
